import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { DataSource } from 'typeorm';

type PostSearchParams = {
  q?: string;
  game?: string;
  resolution?: string;
  budgetMax?: number;
  part?: string;
  cpuBrand?: string;
  gpuBrand?: string;
  comboType?: string;
  sort: string;
  limit: number;
};

type RecommendationPostPayload = {
  slug?: string;
  title?: string;
  subtitle?: string | null;
  summary?: string | null;
  bodyMd?: string | null;
  status?: string;
  sourceType?: string;
  targetBudget?: number | string | null;
  totalPrice?: number | string | null;
  purpose?: string;
  cpuBrand?: string | null;
  gpuBrand?: string | null;
  cpuModel?: string | null;
  gpuModel?: string | null;
  comboType?: string | null;
  thumbnailImageUrl?: string | null;
  casePartName?: string | null;
  popularityScore?: number | string | null;
  parts?: Array<{
    partId?: string | number;
    category?: string;
    label?: string | null;
    name?: string;
    price?: number | string | null;
    quantity?: number | string | null;
    productNo?: string | null;
    imageUrl?: string | null;
    specText?: string | null;
    sortOrder?: number | string | null;
  }>;
  games?: Array<{
    gameName?: string;
    resolution?: string;
    qualityPreset?: string | null;
    fpsMin?: number | string | null;
    fpsMax?: number | string | null;
    comfortGrade?: string | null;
  }>;
};

@Injectable()
export class RecommendationsService {
  private openai: OpenAI | null = null;

  constructor(private readonly dataSource: DataSource) {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  async getAdminPosts(limit = 100) {
    const rows = await this.dataSource.query(
      `
      SELECT
        RECOMMENDATION_POST_ID AS id,
        SLUG AS slug,
        TITLE AS title,
        SUBTITLE AS subtitle,
        SUMMARY AS summary,
        BODY_MD AS bodyMd,
        STATUS AS status,
        SOURCE_TYPE AS sourceType,
        TARGET_BUDGET AS targetBudget,
        TOTAL_PRICE AS totalPrice,
        PURPOSE AS purpose,
        CPU_BRAND AS cpuBrand,
        GPU_BRAND AS gpuBrand,
        CPU_MODEL AS cpuModel,
        GPU_MODEL AS gpuModel,
        COMBO_TYPE AS comboType,
        THUMBNAIL_IMAGE_URL AS thumbnailImageUrl,
        CASE_PART_NAME AS casePartName,
        POPULARITY_SCORE AS popularityScore,
        PUBLISHED_DT AS publishedAt,
        UPDATED_DT AS updatedAt,
        CREATED_DT AS createdAt
      FROM recommendation_posts
      ORDER BY COALESCE(UPDATED_DT, CREATED_DT) DESC, RECOMMENDATION_POST_ID DESC
      LIMIT ?
      `,
      [Math.min(limit, 200)],
    );

    const items = await Promise.all(rows.map(async (row: any) => this.attachPostChildren(row)));
    return { items, total: items.length };
  }

  async createAdminPost(payload: RecommendationPostPayload) {
    return this.saveAdminPost(null, payload);
  }

  async updateAdminPost(id: number, payload: RecommendationPostPayload) {
    return this.saveAdminPost(id, payload);
  }

  async getPosts(params: PostSearchParams) {
    const where = ['p.STATUS = ?'];
    const values: unknown[] = ['PUBLISHED'];

    if (params.q) {
      where.push('(p.TITLE LIKE ? OR p.SUBTITLE LIKE ? OR p.SUMMARY LIKE ? OR p.CPU_MODEL LIKE ? OR p.GPU_MODEL LIKE ?)');
      values.push(...Array(5).fill(`%${params.q}%`));
    }
    if (params.budgetMax && params.budgetMax > 0) {
      where.push('p.TOTAL_PRICE <= ?');
      values.push(params.budgetMax);
    }
    if (params.cpuBrand) {
      where.push('p.CPU_BRAND = ?');
      values.push(params.cpuBrand);
    }
    if (params.gpuBrand) {
      where.push('p.GPU_BRAND = ?');
      values.push(params.gpuBrand);
    }
    if (params.comboType) {
      where.push('p.COMBO_TYPE = ?');
      values.push(params.comboType);
    }
    if (params.game) {
      where.push(`EXISTS (
        SELECT 1 FROM recommendation_post_games g
        WHERE g.RECOMMENDATION_POST_ID = p.RECOMMENDATION_POST_ID
          AND g.GAME_NAME LIKE ?
          ${params.resolution ? 'AND g.RESOLUTION = ?' : ''}
      )`);
      values.push(`%${params.game}%`);
      if (params.resolution) values.push(params.resolution);
    } else if (params.resolution) {
      where.push(`EXISTS (
        SELECT 1 FROM recommendation_post_games g
        WHERE g.RECOMMENDATION_POST_ID = p.RECOMMENDATION_POST_ID
          AND g.RESOLUTION = ?
      )`);
      values.push(params.resolution);
    }
    if (params.part) {
      where.push(`EXISTS (
        SELECT 1 FROM recommendation_post_parts part
        WHERE part.RECOMMENDATION_POST_ID = p.RECOMMENDATION_POST_ID
          AND part.PART_NAME LIKE ?
      )`);
      values.push(`%${params.part}%`);
    }

    const orderBy = this.resolveOrderBy(params.sort);
    values.push(Math.min(params.limit, 100));

    const rows = await this.dataSource.query(
      `
      SELECT
        p.RECOMMENDATION_POST_ID AS id,
        p.SLUG AS slug,
        p.TITLE AS title,
        p.SUBTITLE AS subtitle,
        p.SUMMARY AS summary,
        p.TARGET_BUDGET AS targetBudget,
        p.TOTAL_PRICE AS totalPrice,
        p.PURPOSE AS purpose,
        p.CPU_BRAND AS cpuBrand,
        p.GPU_BRAND AS gpuBrand,
        p.CPU_MODEL AS cpuModel,
        p.GPU_MODEL AS gpuModel,
        p.COMBO_TYPE AS comboType,
        COALESCE(casePart.IMAGE_URL, p.THUMBNAIL_IMAGE_URL) AS thumbnailImageUrl,
        COALESCE(casePart.PART_NAME, p.CASE_PART_NAME) AS casePartName,
        p.POPULARITY_SCORE AS popularityScore,
        p.ORDER_COUNT AS orderCount,
        p.CART_COUNT AS cartCount,
        p.PUBLISHED_DT AS publishedAt,
        GROUP_CONCAT(DISTINCT CONCAT(g.GAME_NAME, ':', g.RESOLUTION) ORDER BY g.GAME_NAME SEPARATOR '|') AS gameTags
      FROM recommendation_posts p
      LEFT JOIN recommendation_post_parts casePart
        ON casePart.RECOMMENDATION_POST_ID = p.RECOMMENDATION_POST_ID
       AND casePart.PART_CATEGORY IN ('CASE', '케이스')
      LEFT JOIN recommendation_post_games g
        ON g.RECOMMENDATION_POST_ID = p.RECOMMENDATION_POST_ID
      WHERE ${where.join(' AND ')}
      GROUP BY p.RECOMMENDATION_POST_ID, casePart.RECOMMENDATION_POST_PART_ID
      ORDER BY ${orderBy}
      LIMIT ?
      `,
      values,
    );

    return {
      items: rows.map((row: any) => ({
        ...row,
        gameTags: row.gameTags ? String(row.gameTags).split('|') : [],
      })),
      total: rows.length,
    };
  }

  async getPost(slugOrId: string) {
    const numericId = Number(slugOrId);
    const isNumericId = Number.isInteger(numericId) && numericId > 0;
    const [post] = await this.dataSource.query(
      `
      SELECT
        RECOMMENDATION_POST_ID AS id,
        SLUG AS slug,
        TITLE AS title,
        SUBTITLE AS subtitle,
        SUMMARY AS summary,
        BODY_MD AS bodyMd,
        TARGET_BUDGET AS targetBudget,
        TOTAL_PRICE AS totalPrice,
        PURPOSE AS purpose,
        CPU_BRAND AS cpuBrand,
        GPU_BRAND AS gpuBrand,
        CPU_MODEL AS cpuModel,
        GPU_MODEL AS gpuModel,
        COMBO_TYPE AS comboType,
        THUMBNAIL_IMAGE_URL AS thumbnailImageUrl,
        CASE_PART_NAME AS casePartName,
        POPULARITY_SCORE AS popularityScore,
        PUBLISHED_DT AS publishedAt
      FROM recommendation_posts
      WHERE STATUS = 'PUBLISHED' AND ${isNumericId ? 'RECOMMENDATION_POST_ID = ?' : 'SLUG = ?'}
      `,
      [isNumericId ? numericId : slugOrId],
    );

    if (!post) {
      throw new NotFoundException('추천 견적을 찾을 수 없습니다.');
    }

    const parts = await this.dataSource.query(
      `
      SELECT
        RECOMMENDATION_POST_PART_ID AS partId,
        PART_CATEGORY AS category,
        PART_LABEL AS label,
        PART_NAME AS name,
        PART_PRICE AS price,
        QUANTITY AS quantity,
        PRODUCT_NO AS productNo,
        IMAGE_URL AS imageUrl,
        SPEC_TEXT AS specText,
        SORT_ORDER AS sortOrder
      FROM recommendation_post_parts
      WHERE RECOMMENDATION_POST_ID = ?
      ORDER BY SORT_ORDER ASC, RECOMMENDATION_POST_PART_ID ASC
      `,
      [post.id],
    );

    const manualGames = await this.dataSource.query(
      `
      SELECT
        GAME_NAME AS gameName,
        RESOLUTION AS resolution,
        QUALITY_PRESET AS qualityPreset,
        FPS_MIN AS fpsMin,
        FPS_MAX AS fpsMax,
        COMFORT_GRADE AS comfortGrade
      FROM recommendation_post_games
      WHERE RECOMMENDATION_POST_ID = ?
      ORDER BY GAME_NAME ASC, FIELD(RESOLUTION, 'FHD', 'QHD', '4K', 'UHD')
      `,
      [post.id],
    );

    const benchmarkGames = await this.getBenchmarkGamesForPost(post.cpuModel, post.gpuModel);
    const games = this.mergeGames(manualGames, benchmarkGames);

    return { ...post, parts, games };
  }

  async generateSummary(payload: RecommendationPostPayload & { games?: any[] }) {
    const parts = (payload.parts ?? []).filter((part) => part.name);
    const fallback = this.generateFallbackSummary(payload, parts);
    if (!this.openai) return { summary: fallback, source: 'fallback' };

    const prompt = [
      `제목: ${payload.title ?? ''}`,
      `본문: ${payload.bodyMd ?? ''}`,
      `CPU: ${payload.cpuModel ?? ''}`,
      `GPU: ${payload.gpuModel ?? ''}`,
      `총가격: ${payload.totalPrice ?? ''}`,
      `부품: ${parts.map((part) => `${part.label ?? part.category}: ${part.name}`).join(' / ')}`,
      `게임성능 샘플: ${(payload.games ?? []).slice(0, 10).map((game: any) => `${game.gameName} ${game.resolution} ${game.fpsMin ?? ''}-${game.fpsMax ?? ''}FPS`).join(' / ')}`,
    ].join('\n');

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_SUMMARY_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'JHS Computer 추천 PC 게시글의 짧은 요약문을 작성한다. 한국어 존댓말이 아닌 자연스러운 쇼핑몰 문체로 120자 이내, 과장 없이 핵심 용도/가격대/CPU/GPU/게임 성능 포인트를 담는다.',
          },
          { role: 'user', content: prompt },
        ],
      });
      const summary = response.choices[0]?.message?.content?.trim();
      return { summary: summary || fallback, source: summary ? 'llm' : 'fallback' };
    } catch {
      return { summary: fallback, source: 'fallback' };
    }
  }

  private async saveAdminPost(id: number | null, payload: RecommendationPostPayload) {
    const normalized = this.normalizePayload(payload);

    return this.dataSource.transaction(async (manager) => {
      let postId = id;
      if (postId) {
        const result = await manager.query(
          `
          UPDATE recommendation_posts
          SET
            SLUG = ?,
            TITLE = ?,
            SUBTITLE = ?,
            SUMMARY = ?,
            BODY_MD = ?,
            STATUS = ?,
            SOURCE_TYPE = ?,
            TARGET_BUDGET = ?,
            TOTAL_PRICE = ?,
            PURPOSE = ?,
            CPU_BRAND = ?,
            GPU_BRAND = ?,
            CPU_MODEL = ?,
            GPU_MODEL = ?,
            COMBO_TYPE = ?,
            THUMBNAIL_IMAGE_URL = ?,
            CASE_PART_NAME = ?,
            POPULARITY_SCORE = ?,
            PUBLISHED_DT = CASE
              WHEN ? = 'PUBLISHED' AND PUBLISHED_DT IS NULL THEN NOW()
              WHEN ? != 'PUBLISHED' THEN NULL
              ELSE PUBLISHED_DT
            END
          WHERE RECOMMENDATION_POST_ID = ?
          `,
          [
            normalized.slug,
            normalized.title,
            normalized.subtitle,
            normalized.summary,
            normalized.bodyMd,
            normalized.status,
            normalized.sourceType,
            normalized.targetBudget,
            normalized.totalPrice,
            normalized.purpose,
            normalized.cpuBrand,
            normalized.gpuBrand,
            normalized.cpuModel,
            normalized.gpuModel,
            normalized.comboType,
            normalized.thumbnailImageUrl,
            normalized.casePartName,
            normalized.popularityScore,
            normalized.status,
            normalized.status,
            postId,
          ],
        );
        if (!result?.affectedRows) throw new NotFoundException('추천 게시글을 찾을 수 없습니다.');
      } else {
        const result = await manager.query(
          `
          INSERT INTO recommendation_posts (
            SLUG, TITLE, SUBTITLE, SUMMARY, BODY_MD, STATUS, SOURCE_TYPE,
            TARGET_BUDGET, TOTAL_PRICE, PURPOSE, CPU_BRAND, GPU_BRAND,
            CPU_MODEL, GPU_MODEL, COMBO_TYPE, THUMBNAIL_IMAGE_URL,
            CASE_PART_NAME, POPULARITY_SCORE, PUBLISHED_DT
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, IF(? = 'PUBLISHED', NOW(), NULL))
          `,
          [
            normalized.slug,
            normalized.title,
            normalized.subtitle,
            normalized.summary,
            normalized.bodyMd,
            normalized.status,
            normalized.sourceType,
            normalized.targetBudget,
            normalized.totalPrice,
            normalized.purpose,
            normalized.cpuBrand,
            normalized.gpuBrand,
            normalized.cpuModel,
            normalized.gpuModel,
            normalized.comboType,
            normalized.thumbnailImageUrl,
            normalized.casePartName,
            normalized.popularityScore,
            normalized.status,
          ],
        );
        postId = Number(result.insertId);
      }

      await manager.query('DELETE FROM recommendation_post_parts WHERE RECOMMENDATION_POST_ID = ?', [postId]);
      await manager.query('DELETE FROM recommendation_post_games WHERE RECOMMENDATION_POST_ID = ?', [postId]);

      for (const [index, part] of normalized.parts.entries()) {
        await manager.query(
          `
          INSERT INTO recommendation_post_parts (
            RECOMMENDATION_POST_ID, PART_CATEGORY, PART_LABEL, PART_NAME,
            PART_PRICE, QUANTITY, PRODUCT_NO, IMAGE_URL, SPEC_TEXT, SORT_ORDER
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            postId,
            part.category,
            part.label,
            part.name,
            part.price,
            part.quantity,
            part.productNo,
            part.imageUrl,
            part.specText,
            part.sortOrder ?? index,
          ],
        );
      }

      for (const game of normalized.games) {
        await manager.query(
          `
          INSERT INTO recommendation_post_games (
            RECOMMENDATION_POST_ID, GAME_NAME, RESOLUTION, QUALITY_PRESET,
            FPS_MIN, FPS_MAX, COMFORT_GRADE
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            postId,
            game.gameName,
            game.resolution,
            game.qualityPreset,
            game.fpsMin,
            game.fpsMax,
            game.comfortGrade,
          ],
        );
      }

      const [post] = await manager.query(
        `
        SELECT
          RECOMMENDATION_POST_ID AS id,
          SLUG AS slug,
          TITLE AS title,
          SUBTITLE AS subtitle,
          SUMMARY AS summary,
          BODY_MD AS bodyMd,
          STATUS AS status,
          SOURCE_TYPE AS sourceType,
          TARGET_BUDGET AS targetBudget,
          TOTAL_PRICE AS totalPrice,
          PURPOSE AS purpose,
          CPU_BRAND AS cpuBrand,
          GPU_BRAND AS gpuBrand,
          CPU_MODEL AS cpuModel,
          GPU_MODEL AS gpuModel,
          COMBO_TYPE AS comboType,
          THUMBNAIL_IMAGE_URL AS thumbnailImageUrl,
          CASE_PART_NAME AS casePartName,
          POPULARITY_SCORE AS popularityScore,
          PUBLISHED_DT AS publishedAt,
          UPDATED_DT AS updatedAt,
          CREATED_DT AS createdAt
        FROM recommendation_posts
        WHERE RECOMMENDATION_POST_ID = ?
        `,
        [postId],
      );

      return this.attachPostChildren(post, manager);
    });
  }

  private async attachPostChildren(post: any, queryRunner: { query: (query: string, parameters?: any[]) => Promise<any> } = this.dataSource) {
    const parts = await queryRunner.query(
      `
      SELECT
        RECOMMENDATION_POST_PART_ID AS partId,
        PART_CATEGORY AS category,
        PART_LABEL AS label,
        PART_NAME AS name,
        PART_PRICE AS price,
        QUANTITY AS quantity,
        PRODUCT_NO AS productNo,
        IMAGE_URL AS imageUrl,
        SPEC_TEXT AS specText,
        SORT_ORDER AS sortOrder
      FROM recommendation_post_parts
      WHERE RECOMMENDATION_POST_ID = ?
      ORDER BY SORT_ORDER ASC, RECOMMENDATION_POST_PART_ID ASC
      `,
      [post.id],
    );
    const games = await queryRunner.query(
      `
      SELECT
        GAME_NAME AS gameName,
        RESOLUTION AS resolution,
        QUALITY_PRESET AS qualityPreset,
        FPS_MIN AS fpsMin,
        FPS_MAX AS fpsMax,
        COMFORT_GRADE AS comfortGrade
      FROM recommendation_post_games
      WHERE RECOMMENDATION_POST_ID = ?
      ORDER BY GAME_NAME ASC, FIELD(RESOLUTION, 'FHD', 'QHD', '4K', 'UHD')
      `,
      [post.id],
    );
    return { ...post, parts, games };
  }

  private async getBenchmarkGamesForPost(cpuModel?: string | null, gpuModel?: string | null) {
    if (!cpuModel || !gpuModel) return [];
    return this.dataSource.query(
      `
      SELECT
        g.GAME_NAME AS gameName,
        c.RESOLUTION AS resolution,
        c.BEST_QUALITY AS qualityPreset,
        c.DISPLAY_FPS_MIN AS fpsMin,
        c.DISPLAY_FPS_MAX AS fpsMax,
        c.COMFORT_GRADE AS comfortGrade
      FROM benchmark_combo_game_results c
      INNER JOIN benchmark_games g
        ON g.BENCHMARK_GAME_ID = c.BENCHMARK_GAME_ID
      WHERE
        (
          LOWER(c.CPU_MODEL) = LOWER(?)
          OR LOWER(?) LIKE CONCAT('%', LOWER(c.CPU_MODEL), '%')
          OR LOWER(c.CPU_MODEL) LIKE CONCAT('%', LOWER(?), '%')
        )
        AND (
          LOWER(c.GPU_MODEL) = LOWER(?)
          OR LOWER(?) LIKE CONCAT('%', LOWER(c.GPU_MODEL), '%')
          OR LOWER(c.GPU_MODEL) LIKE CONCAT('%', LOWER(?), '%')
        )
      ORDER BY g.GAME_NAME ASC, FIELD(c.RESOLUTION, 'FHD', 'QHD', '4K', 'UHD')
      `,
      [cpuModel, cpuModel, cpuModel, gpuModel, gpuModel, gpuModel],
    );
  }

  private mergeGames(manualGames: any[], benchmarkGames: any[]) {
    const seen = new Set<string>();
    const merged: any[] = [];
    for (const game of [...manualGames, ...benchmarkGames]) {
      const key = `${game.gameName}::${game.resolution}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(game);
    }
    return merged;
  }

  private generateFallbackSummary(payload: RecommendationPostPayload, parts: RecommendationPostPayload['parts'] = []) {
    const cpu = payload.cpuModel || parts.find((part) => ['CPU'].includes(String(part.category)))?.name || 'CPU';
    const gpu = payload.gpuModel || parts.find((part) => ['GPU', '그래픽카드'].includes(String(part.category)))?.name || 'GPU';
    const price = this.toNumber(payload.totalPrice, 0);
    const priceText = price > 0 ? `${Math.round(price / 10000).toLocaleString()}만원대` : '합리적인 예산';
    return `${cpu}와 ${gpu} 조합으로 구성한 ${priceText} JHS 추천 PC입니다. 게임 성능과 업그레이드 밸런스를 고려한 구성입니다.`;
  }

  private normalizePayload(payload: RecommendationPostPayload) {
    const title = String(payload.title ?? '').trim();
    if (!title) throw new NotFoundException('제목은 필수입니다.');
    const slug = String(payload.slug ?? '').trim() || `${this.slugify(title)}-${Date.now()}`;
    if (!slug) throw new NotFoundException('슬러그는 필수입니다.');

    const parts = (payload.parts ?? [])
      .filter((part) => part.name && part.category)
      .map((part, index) => ({
        category: String(part.category),
        label: part.label ? String(part.label) : String(part.category),
        name: String(part.name),
        price: this.toNumber(part.price, 0),
        quantity: Math.max(1, this.toNumber(part.quantity, 1)),
        productNo: part.productNo ? String(part.productNo) : null,
        imageUrl: part.imageUrl ? String(part.imageUrl) : null,
        specText: part.specText ? String(part.specText) : null,
        sortOrder: this.toNumber(part.sortOrder, index),
      }));
    const totalPrice = this.toNumber(payload.totalPrice, parts.reduce((sum, part) => sum + part.price * part.quantity, 0));

    return {
      slug,
      title,
      subtitle: payload.subtitle ? String(payload.subtitle) : null,
      summary: payload.summary ? String(payload.summary) : null,
      bodyMd: payload.bodyMd ? String(payload.bodyMd) : null,
      status: payload.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
      sourceType: payload.sourceType ? String(payload.sourceType) : 'JHS_MANUAL',
      targetBudget: this.nullableNumber(payload.targetBudget),
      totalPrice,
      purpose: payload.purpose ? String(payload.purpose) : 'GAME',
      cpuBrand: payload.cpuBrand ? String(payload.cpuBrand) : null,
      gpuBrand: payload.gpuBrand ? String(payload.gpuBrand) : null,
      cpuModel: payload.cpuModel ? String(payload.cpuModel) : null,
      gpuModel: payload.gpuModel ? String(payload.gpuModel) : null,
      comboType: payload.comboType ? String(payload.comboType) : null,
      thumbnailImageUrl: payload.thumbnailImageUrl ? String(payload.thumbnailImageUrl) : null,
      casePartName: payload.casePartName ? String(payload.casePartName) : null,
      popularityScore: this.toNumber(payload.popularityScore, 0),
      parts,
      games: (payload.games ?? [])
        .filter((game) => game.gameName)
        .map((game) => ({
          gameName: String(game.gameName),
          resolution: game.resolution ? String(game.resolution) : 'FHD',
          qualityPreset: game.qualityPreset ? String(game.qualityPreset) : null,
          fpsMin: this.nullableNumber(game.fpsMin),
          fpsMax: this.nullableNumber(game.fpsMax),
          comfortGrade: game.comfortGrade ? String(game.comfortGrade) : null,
        })),
    };
  }

  private slugify(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 150);
  }

  private nullableNumber(value: unknown) {
    if (value === undefined || value === null || value === '') return null;
    return this.toNumber(value, 0);
  }

  private toNumber(value: unknown, fallback: number) {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : fallback;
  }

  private resolveOrderBy(sort: string) {
    switch (sort) {
      case 'price':
        return 'p.TOTAL_PRICE ASC, p.POPULARITY_SCORE DESC';
      case 'performance':
        return 'p.TOTAL_PRICE DESC, p.POPULARITY_SCORE DESC';
      case 'new':
        return 'p.PUBLISHED_DT DESC, p.RECOMMENDATION_POST_ID DESC';
      case 'popular':
      default:
        return 'p.POPULARITY_SCORE DESC, p.ORDER_COUNT DESC, p.CART_COUNT DESC, p.PUBLISHED_DT DESC';
    }
  }
}
