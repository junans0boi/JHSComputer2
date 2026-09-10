import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { formatPublicComboName, formatPublicCpuModel, formatPublicGpuModel } from './public-model-labels';
import { normalizeComponentModelKey } from './component-benchmark';

type ComboSearchParams = {
  q?: string;
  cpu?: string;
  gpu?: string;
  game?: string;
  resolution?: string;
  includeNoFps: boolean;
  limit: number;
};

type ComboGamesParams = {
  comboKey: string;
  game?: string;
  resolution?: string;
  limit: number;
};

type RecommendationComboSearchParams = {
  q?: string;
  cpu?: string;
  gpu?: string;
  game?: string;
  resolution?: string;
  limit: number;
};

type QuotePerformanceParams = {
  parts: Array<{ category?: string; name?: string }>;
  games: string[];
  resolution?: string;
  limit: number;
};

@Injectable()
export class BenchmarksService {
  constructor(private readonly dataSource: DataSource) {}

  async getSummary() {
    const [summary] = await this.dataSource.query(`
      SELECT
        (SELECT COUNT(*) FROM benchmark_builds) AS buildCount,
        (SELECT COUNT(DISTINCT COMBO_KEY) FROM benchmark_builds) AS totalComboCount,
        (SELECT COUNT(DISTINCT COMBO_KEY) FROM benchmark_combo_game_results) AS fpsComboCount,
        (SELECT COUNT(*) FROM benchmark_games) AS gameCount,
        (SELECT COUNT(*) FROM benchmark_fps_results) AS fpsResultCount,
        (SELECT COUNT(*) FROM benchmark_combo_game_results) AS comboGameResultCount
    `);

    const topCombos = await this.dataSource.query(`
      SELECT
        b.COMBO_KEY AS comboKey,
        MIN(b.CPU_MODEL) AS cpuModel,
        MIN(b.GPU_MODEL) AS gpuModel,
        MIN(b.CPU_NAME) AS cpuName,
        MIN(b.GPU_NAME) AS gpuName,
        COUNT(DISTINCT b.BENCHMARK_BUILD_ID) AS buildSampleCount,
        COUNT(DISTINCT r.BENCHMARK_GAME_ID) AS gameCount,
        COUNT(r.BENCHMARK_COMBO_GAME_RESULT_ID) AS resultCount
      FROM benchmark_builds b
      JOIN benchmark_combo_game_results r ON r.COMBO_KEY = b.COMBO_KEY
      GROUP BY b.COMBO_KEY
      ORDER BY buildSampleCount DESC, comboKey ASC
      LIMIT 10
    `);

    const publicComboRows = await this.dataSource.query(`
      SELECT
        b.COMBO_KEY AS comboKey,
        MIN(b.CPU_MODEL) AS cpuModel,
        MIN(b.GPU_MODEL) AS gpuModel,
        MIN(b.CPU_NAME) AS cpuName,
        MIN(b.GPU_NAME) AS gpuName,
        COUNT(DISTINCT b.BENCHMARK_BUILD_ID) AS buildSampleCount,
        COUNT(DISTINCT r.BENCHMARK_GAME_ID) AS gameCount,
        COUNT(r.BENCHMARK_COMBO_GAME_RESULT_ID) AS resultCount
      FROM benchmark_builds b
      LEFT JOIN benchmark_combo_game_results r ON r.COMBO_KEY = b.COMBO_KEY
      GROUP BY b.COMBO_KEY
    `);
    const publicComboCount = mergePublicCombos(publicComboRows.map((row: any) => toPublicCombo(row))).length;

    const publicTopCombos = mergePublicCombos(topCombos.map((combo: any) => toPublicCombo(combo)));
    await this.attachComponentPartIds(publicTopCombos);

    return {
      ...summary,
      sourceComboCount: summary.totalComboCount,
      totalComboCount: String(publicComboCount),
      topCombos: publicTopCombos,
    };
  }

  async getGames(params: { q?: string; limit: number }) {
    const where: string[] = [];
    const values: unknown[] = [];
    if (params.q) {
      where.push('GAME_NAME LIKE ?');
      values.push(`%${params.q}%`);
    }
    values.push(limitValue(params.limit, 300, 100));

    const rows = await this.dataSource.query(
      `
      SELECT
        BENCHMARK_GAME_ID AS gameId,
        GAME_NAME AS gameName
      FROM benchmark_games
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY GAME_NAME ASC
      LIMIT ?
      `,
      values,
    );

    return { items: rows, total: rows.length };
  }

  async getCombos(params: ComboSearchParams) {
    const where: string[] = [];
    const values: unknown[] = [];

    if (params.q) {
      where.push('(b.COMBO_KEY LIKE ? OR b.CPU_MODEL LIKE ? OR b.GPU_MODEL LIKE ? OR b.TITLE LIKE ?)');
      values.push(`%${params.q}%`, `%${params.q}%`, `%${params.q}%`, `%${params.q}%`);
    }
    if (params.cpu) {
      where.push('(b.CPU_MODEL LIKE ? OR b.CPU_NAME LIKE ?)');
      values.push(`%${params.cpu}%`, `%${params.cpu}%`);
    }
    if (params.gpu) {
      where.push('(b.GPU_MODEL LIKE ? OR b.GPU_NAME LIKE ?)');
      values.push(`%${params.gpu}%`, `%${params.gpu}%`);
    }
    if (params.game) {
      where.push(`EXISTS (
        SELECT 1
        FROM benchmark_combo_game_results r
        JOIN benchmark_games g ON g.BENCHMARK_GAME_ID = r.BENCHMARK_GAME_ID
        WHERE r.COMBO_KEY = b.COMBO_KEY AND g.GAME_NAME LIKE ?
      )`);
      values.push(`%${params.game}%`);
    }
    if (params.resolution) {
      where.push(`EXISTS (
        SELECT 1
        FROM benchmark_combo_game_results r
        WHERE r.COMBO_KEY = b.COMBO_KEY AND r.RESOLUTION = ?
      )`);
      values.push(params.resolution);
    }
    if (!params.includeNoFps) {
      where.push(`EXISTS (
        SELECT 1
        FROM benchmark_combo_game_results r
        WHERE r.COMBO_KEY = b.COMBO_KEY
      )`);
    }

    values.push(limitValue(params.limit, 200, 50));
    const rows = await this.dataSource.query(
      `
      SELECT
        b.COMBO_KEY AS comboKey,
        MIN(b.CPU_MODEL) AS cpuModel,
        MIN(b.GPU_MODEL) AS gpuModel,
        MIN(b.CPU_NAME) AS cpuName,
        MIN(b.GPU_NAME) AS gpuName,
        COUNT(DISTINCT b.BENCHMARK_BUILD_ID) AS buildSampleCount,
        COUNT(DISTINCT r.BENCHMARK_GAME_ID) AS gameCount,
        COUNT(r.BENCHMARK_COMBO_GAME_RESULT_ID) AS resultCount
      FROM benchmark_builds b
      LEFT JOIN benchmark_combo_game_results r ON r.COMBO_KEY = b.COMBO_KEY
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      GROUP BY b.COMBO_KEY
      ORDER BY buildSampleCount DESC, gameCount DESC, comboKey ASC
      LIMIT ?
      `,
      values,
    );

    const items = mergePublicCombos(rows.map((row: any) => toPublicCombo(row)));
    await this.attachComponentPartIds(items);
    return { items, total: items.length };
  }

  async getRecommendationCombos(params: RecommendationComboSearchParams) {
    const where = validKjwwangRecommendationConditions();
    const values: unknown[] = [];
    const requestedResolution = params.resolution === '4K' ? 'UHD' : params.resolution;

    if (params.q) {
      where.push(`(
        b.COMBO_KEY LIKE ? OR b.CPU_MODEL LIKE ? OR b.GPU_MODEL LIKE ? OR
        b.CPU_NAME LIKE ? OR b.GPU_NAME LIKE ? OR
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.gameName')) LIKE ?
      )`);
      const q = `%${params.q}%`;
      values.push(q, q, q, q, q, q);
    }
    if (params.cpu) {
      where.push('(b.CPU_MODEL LIKE ? OR b.CPU_NAME LIKE ?)');
      values.push(`%${params.cpu}%`, `%${params.cpu}%`);
    }
    if (params.gpu) {
      where.push('(b.GPU_MODEL LIKE ? OR b.GPU_NAME LIKE ?)');
      values.push(`%${params.gpu}%`, `%${params.gpu}%`);
    }
    if (params.game) {
      where.push("JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.gameName')) LIKE ?");
      values.push(`%${params.game}%`);
    }
    if (requestedResolution) {
      where.push("JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.resolution')) = ?");
      values.push(requestedResolution);
    }

    const rows = await this.dataSource.query(
      `
      SELECT
        b.COMBO_KEY AS comboKey,
        b.CPU_MODEL AS cpuModel,
        b.GPU_MODEL AS gpuModel,
        b.CPU_NAME AS cpuName,
        b.GPU_NAME AS gpuName,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.gameId')) AS gameId,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.gameName')) AS gameName,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.resolution')) AS resolution,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.tier')) AS tier,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.platform')) AS platform,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.crawledAt')) AS capturedAt
      FROM benchmark_builds b
      JOIN benchmark_sources s ON s.BENCHMARK_SOURCE_ID = b.BENCHMARK_SOURCE_ID
      WHERE ${where.join(' AND ')}
      ORDER BY capturedAt DESC, b.BENCHMARK_BUILD_ID DESC
      `,
      values,
    );

    if (!rows.length) return { items: [], total: 0 };

    const allGroupRows = await this.dataSource.query(
      `
      SELECT
        b.COMBO_KEY AS comboKey,
        b.CPU_MODEL AS cpuModel,
        b.GPU_MODEL AS gpuModel,
        b.CPU_NAME AS cpuName,
        b.GPU_NAME AS gpuName
      FROM benchmark_builds b
      JOIN benchmark_sources s ON s.BENCHMARK_SOURCE_ID = b.BENCHMARK_SOURCE_ID
      WHERE ${validKjwwangRecommendationConditions().join(' AND ')}
      `,
    );

    const grouped = groupRecommendationSnapshots(rows, allGroupRows);
    const items = grouped
      .sort((left, right) => right.recommendationCount - left.recommendationCount
        || String(right.latestCapturedAt ?? '').localeCompare(String(left.latestCapturedAt ?? ''))
        || left.publicComboName.localeCompare(right.publicComboName))
      .slice(0, limitValue(params.limit, 200, 50));
    return { items, total: grouped.length };
  }

  async getRecommendationComboDetail(comboRef: string, limit = 500) {
    const internalComboKeys = await this.resolveRecommendationComboKeys(comboRef);
    if (!internalComboKeys.length) return null;
    const placeholders = internalComboKeys.map(() => '?').join(', ');
    const detailConditions = [...validKjwwangRecommendationConditions(), `b.COMBO_KEY IN (${placeholders})`].join(' AND ');
    const [combo] = await this.dataSource.query(
      `
      SELECT
        MIN(b.COMBO_KEY) AS comboKey,
        MIN(b.CPU_MODEL) AS cpuModel,
        MIN(b.GPU_MODEL) AS gpuModel,
        MIN(b.CPU_NAME) AS cpuName,
        MIN(b.GPU_NAME) AS gpuName,
        COUNT(DISTINCT b.BENCHMARK_BUILD_ID) AS recommendationCount,
        COUNT(DISTINCT JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.gameId'))) AS gameCount,
        MAX(JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.crawledAt'))) AS latestCapturedAt
      FROM benchmark_builds b
      JOIN benchmark_sources s ON s.BENCHMARK_SOURCE_ID = b.BENCHMARK_SOURCE_ID
      WHERE ${detailConditions}
      `,
      internalComboKeys,
    );

    if (!combo || Number(combo.recommendationCount ?? 0) === 0) return null;

    const contextCountRows = await this.dataSource.query(
      `
      SELECT COUNT(*) AS total
      FROM benchmark_builds b
      JOIN benchmark_sources s ON s.BENCHMARK_SOURCE_ID = b.BENCHMARK_SOURCE_ID
      WHERE ${detailConditions}
      `,
      internalComboKeys,
    );
    const contextRows = await this.dataSource.query(
      `
      SELECT
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.gameId')) AS gameId,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.gameName')) AS gameName,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.resolution')) AS resolution,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.tier')) AS tier,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.platform')) AS platform,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.priceRange')) AS priceRange,
        CAST(JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.price')) AS UNSIGNED) AS price,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.sourceUrl')) AS sourceUrl,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.crawledAt')) AS capturedAt
      FROM benchmark_builds b
      JOIN benchmark_sources s ON s.BENCHMARK_SOURCE_ID = b.BENCHMARK_SOURCE_ID
      WHERE ${detailConditions}
      ORDER BY gameName ASC, FIELD(resolution, 'FHD', 'QHD', 'UHD'), tier ASC, capturedAt DESC
      LIMIT ?
      `,
      [...internalComboKeys, limitValue(limit, 500, 500)],
    );

    return {
      combo: toRecommendationCombo(combo, comboRef),
      contexts: contextRows.map((row: any) => ({
        ...row,
        price: row.price == null ? null : Number(row.price),
        sourceCode: 'KJWWANG',
        sourceName: '견적왕',
      })),
      total: Number(contextCountRows[0]?.total ?? 0),
    };
  }

  async getComboDetail(comboKey: string) {
    const internalComboKeys = await this.resolveInternalComboKeys(comboKey);
    const placeholders = internalComboKeys.map(() => '?').join(', ');
    const [combo] = await this.dataSource.query(
      `
      SELECT
        MIN(COMBO_KEY) AS comboKey,
        MIN(CPU_MODEL) AS cpuModel,
        MIN(GPU_MODEL) AS gpuModel,
        MIN(CPU_NAME) AS cpuName,
        MIN(GPU_NAME) AS gpuName,
        COUNT(*) AS buildSampleCount
      FROM benchmark_builds
      WHERE COMBO_KEY IN (${placeholders})
      `,
      internalComboKeys,
    );

    if (!combo || Number(combo.buildSampleCount ?? 0) === 0) return null;

    const builds = await this.dataSource.query(
      `
      SELECT
        BENCHMARK_BUILD_ID AS buildId,
        TITLE AS title,
        GAME_COUNT AS gameCount,
        FPS_RECORD_COUNT AS fpsRecordCount
      FROM benchmark_builds
      WHERE COMBO_KEY IN (${placeholders})
      ORDER BY GAME_COUNT DESC, EXTERNAL_BUILD_ID ASC
      `,
      internalComboKeys,
    );

    return { ...toPublicCombo(combo), publicComboRef: comboKey, builds };
  }

  async getComboGames(params: ComboGamesParams) {
    const internalComboKeys = await this.resolveInternalComboKeys(params.comboKey);
    const comboPlaceholders = internalComboKeys.map(() => '?').join(', ');
    const where = [`r.COMBO_KEY IN (${comboPlaceholders})`];
    const values: unknown[] = [...internalComboKeys];

    if (params.game) {
      where.push('g.GAME_NAME LIKE ?');
      values.push(`%${params.game}%`);
    }
    if (params.resolution) {
      where.push('r.RESOLUTION = ?');
      values.push(params.resolution);
    }

    values.push(limitValue(params.limit, 500, 200));

    const rows = await this.dataSource.query(
      `
      SELECT
        g.BENCHMARK_GAME_ID AS gameId,
        g.GAME_NAME AS gameName,
        r.RESOLUTION AS resolution,
        r.SAMPLE_COUNT AS sampleCount,
        r.RAW_FPS_AVG AS rawFpsAvg,
        r.RAW_FPS_MIN AS rawFpsMin,
        r.RAW_FPS_MAX AS rawFpsMax,
        r.DISPLAY_FPS_MIN AS displayFpsMin,
        r.DISPLAY_FPS_MAX AS displayFpsMax,
        r.BEST_QUALITY AS bestQuality,
        r.COMFORT_GRADE AS comfortGrade,
        (
          SELECT GROUP_CONCAT(DISTINCT source.SOURCE_NAME ORDER BY source.SOURCE_NAME SEPARATOR ', ')
          FROM benchmark_builds sourceBuild
          JOIN benchmark_sources source ON source.BENCHMARK_SOURCE_ID = sourceBuild.BENCHMARK_SOURCE_ID
          WHERE sourceBuild.COMBO_KEY = r.COMBO_KEY
        ) AS sourceNames
      FROM benchmark_combo_game_results r
      JOIN benchmark_games g ON g.BENCHMARK_GAME_ID = r.BENCHMARK_GAME_ID
      WHERE ${where.join(' AND ')}
      ORDER BY g.GAME_NAME ASC, FIELD(r.RESOLUTION, 'FHD', 'QHD', 'UHD')
      LIMIT ?
      `,
      values,
    );

    const items = collapseSourceReportedResolutionRows(rows.map((row: any) => ({ ...row, ...benchmarkEvidence(row) })));
    return { items, total: items.length };
  }

  async getQuotePerformance(params: QuotePerformanceParams) {
    const cpuName = findPartName(params.parts, ['CPU']);
    const gpuName = findPartName(params.parts, ['그래픽카드', 'GPU', 'VGA']);
    if (!cpuName || !gpuName) {
      return { items: [], total: 0, combo: null, reason: 'CPU/GPU 부품이 부족합니다.' };
    }

    const cpuKeywords = buildCpuKeywords(cpuName);
    const gpuKeywords = buildGpuKeywords(gpuName);
    if (!cpuKeywords.length && !gpuKeywords.length) {
      return { items: [], total: 0, combo: null, reason: 'CPU/GPU 모델명을 인식하지 못했습니다.' };
    }

    // Do not attach a different build's measured FPS to this quote. A nearest
    // CPU/GPU family can be useful for a future explicitly-labelled estimate,
    // but it is not an exact benchmark result for the selected parts.
    const combo = cpuKeywords.length && gpuKeywords.length
      ? await this.findBestCombo(cpuKeywords, gpuKeywords)
      : null;
    if (!combo) {
      return {
        items: [],
        total: 0,
        combo: null,
        reason: '선택한 CPU/GPU 조합의 실측 벤치마크 DB가 없습니다.',
      };
    }

    const resolution = normalizeBenchmarkResolution(params.resolution);
    const rows = await this.findComboGameRows({
      comboKey: combo.comboKey,
      games: params.games,
      resolution,
      limit: params.limit,
    });

    const items = normalizeQuotePerformanceRows(rows);
    return {
      items,
      total: items.length,
      combo: combo ? toPublicCombo(combo) : null,
    };
  }

  private async findBestCombo(cpuKeywords: string[], gpuKeywords: string[]) {
    const where: string[] = [];
    const values: unknown[] = [];

    where.push(`(${cpuKeywords.map(() => '(b.CPU_MODEL LIKE ? OR b.CPU_NAME LIKE ?)').join(' OR ')})`);
    cpuKeywords.forEach((keyword) => values.push(`%${keyword}%`, `%${keyword}%`));
    where.push(`(${gpuKeywords.map(() => '(b.GPU_MODEL LIKE ? OR b.GPU_NAME LIKE ?)').join(' OR ')})`);
    gpuKeywords.forEach((keyword) => values.push(`%${keyword}%`, `%${keyword}%`));

    const rows = await this.dataSource.query(
      `
      SELECT
        b.COMBO_KEY AS comboKey,
        MIN(b.CPU_MODEL) AS cpuModel,
        MIN(b.GPU_MODEL) AS gpuModel,
        MIN(b.CPU_NAME) AS cpuName,
        MIN(b.GPU_NAME) AS gpuName,
        COUNT(DISTINCT b.BENCHMARK_BUILD_ID) AS buildSampleCount,
        COUNT(DISTINCT r.BENCHMARK_GAME_ID) AS gameCount
      FROM benchmark_builds b
      JOIN benchmark_combo_game_results r ON r.COMBO_KEY = b.COMBO_KEY
      WHERE ${where.join(' AND ')}
      GROUP BY b.COMBO_KEY
      ORDER BY buildSampleCount DESC, gameCount DESC, comboKey ASC
      `,
      values,
    );

    return rows.find((row: any) => (
      matchesExactModel(row.cpuModel, row.cpuName, cpuKeywords)
      && matchesExactModel(row.gpuModel, row.gpuName, gpuKeywords)
    )) ?? null;
  }

  private async findNearestCombo(cpuKeywords: string[], gpuKeywords: string[]) {
    const gpuCombo = await this.findBestComboBySingleSide('gpu', gpuKeywords);
    if (gpuCombo) return { ...gpuCombo, matchType: 'GPU_FAMILY' };

    const cpuCombo = await this.findBestComboBySingleSide('cpu', cpuKeywords);
    if (cpuCombo) return { ...cpuCombo, matchType: 'CPU_FAMILY' };

    const rows = await this.dataSource.query(
      `
      SELECT
        b.COMBO_KEY AS comboKey,
        MIN(b.CPU_MODEL) AS cpuModel,
        MIN(b.GPU_MODEL) AS gpuModel,
        MIN(b.CPU_NAME) AS cpuName,
        MIN(b.GPU_NAME) AS gpuName,
        COUNT(DISTINCT b.BENCHMARK_BUILD_ID) AS buildSampleCount,
        COUNT(DISTINCT r.BENCHMARK_GAME_ID) AS gameCount
      FROM benchmark_builds b
      JOIN benchmark_combo_game_results r ON r.COMBO_KEY = b.COMBO_KEY
      GROUP BY b.COMBO_KEY
      ORDER BY gameCount DESC, buildSampleCount DESC, comboKey ASC
      LIMIT 1
      `,
    );

    return rows[0] ? { ...rows[0], matchType: 'POPULAR_DB_COMBO' } : null;
  }

  private async findBestComboBySingleSide(side: 'cpu' | 'gpu', keywords: string[]) {
    if (!keywords.length) return null;
    const modelColumn = side === 'cpu' ? 'b.CPU_MODEL' : 'b.GPU_MODEL';
    const nameColumn = side === 'cpu' ? 'b.CPU_NAME' : 'b.GPU_NAME';
    const values: unknown[] = [];
    const where = `(${keywords.map(() => `(${modelColumn} LIKE ? OR ${nameColumn} LIKE ?)`).join(' OR ')})`;
    keywords.forEach((keyword) => values.push(`%${keyword}%`, `%${keyword}%`));

    const rows = await this.dataSource.query(
      `
      SELECT
        b.COMBO_KEY AS comboKey,
        MIN(b.CPU_MODEL) AS cpuModel,
        MIN(b.GPU_MODEL) AS gpuModel,
        MIN(b.CPU_NAME) AS cpuName,
        MIN(b.GPU_NAME) AS gpuName,
        COUNT(DISTINCT b.BENCHMARK_BUILD_ID) AS buildSampleCount,
        COUNT(DISTINCT r.BENCHMARK_GAME_ID) AS gameCount
      FROM benchmark_builds b
      JOIN benchmark_combo_game_results r ON r.COMBO_KEY = b.COMBO_KEY
      WHERE ${where}
      GROUP BY b.COMBO_KEY
      ORDER BY gameCount DESC, buildSampleCount DESC, comboKey ASC
      LIMIT 1
      `,
      values,
    );

    return rows[0] ?? null;
  }

  private async findComboGameRows(params: { comboKey: string; games: string[]; resolution?: string; limit: number }) {
    const baseWhere = ['r.COMBO_KEY = ?'];
    const baseValues: unknown[] = [params.comboKey];

    if (params.resolution) {
      baseWhere.push('r.RESOLUTION = ?');
      baseValues.push(params.resolution);
    }

    const normalizedGames = params.games.map((game) => game.trim()).filter(Boolean);
    if (!normalizedGames.length) return [];
    baseWhere.push(`(${normalizedGames.map(() => 'g.GAME_NAME LIKE ?').join(' OR ')})`);
    baseValues.push(...normalizedGames.map((game) => `%${game}%`));
    return this.queryComboGameRows({
      where: baseWhere,
      values: baseValues,
      priorityGames: normalizedGames,
      limit: params.limit,
    });
  }

  private async queryComboGameRows(params: { where: string[]; values: unknown[]; priorityGames?: string[]; limit: number }) {
    const priorityGames = params.priorityGames ?? [];
    const priorityOrder = priorityGames.length
      ? `CASE WHEN ${priorityGames.map(() => 'g.GAME_NAME LIKE ?').join(' OR ')} THEN 0 ELSE 1 END,`
      : '';
    const priorityValues = priorityGames.map((game) => `%${game}%`);

    return this.dataSource.query(
      `
      SELECT
        g.BENCHMARK_GAME_ID AS gameId,
        g.GAME_NAME AS gameName,
        r.RESOLUTION AS resolution,
        r.SAMPLE_COUNT AS sampleCount,
        r.RAW_FPS_AVG AS rawFpsAvg,
        r.DISPLAY_FPS_MIN AS displayFpsMin,
        r.DISPLAY_FPS_MAX AS displayFpsMax,
        r.RAW_FPS_MIN AS rawFpsMin,
        r.RAW_FPS_MAX AS rawFpsMax,
        r.BEST_QUALITY AS bestQuality,
        r.COMFORT_GRADE AS comfortGrade,
        (
          SELECT GROUP_CONCAT(DISTINCT source.SOURCE_NAME ORDER BY source.SOURCE_NAME SEPARATOR ', ')
          FROM benchmark_builds sourceBuild
          JOIN benchmark_sources source ON source.BENCHMARK_SOURCE_ID = sourceBuild.BENCHMARK_SOURCE_ID
          WHERE sourceBuild.COMBO_KEY = r.COMBO_KEY
        ) AS sourceNames
      FROM benchmark_combo_game_results r
      JOIN benchmark_games g ON g.BENCHMARK_GAME_ID = r.BENCHMARK_GAME_ID
      WHERE ${params.where.join(' AND ')}
      ORDER BY ${priorityOrder} g.GAME_NAME ASC, FIELD(r.RESOLUTION, 'FHD', 'QHD', 'UHD')
      LIMIT ?
      `,
      [...params.values, ...priorityValues, limitValue(params.limit, 200, 80)],
    );
  }

  async getRecommendedBuilds(params: { q?: string; limit: number }) {
    const where: string[] = [];
    const values: unknown[] = [];

    if (params.q) {
      where.push('(b.TITLE LIKE ? OR b.COMBO_KEY LIKE ? OR b.CPU_MODEL LIKE ? OR b.GPU_MODEL LIKE ?)');
      values.push(`%${params.q}%`, `%${params.q}%`, `%${params.q}%`, `%${params.q}%`);
    }

    values.push(limitValue(params.limit, 100, 30));

    const rows = await this.dataSource.query(
      `
      SELECT
        b.BENCHMARK_BUILD_ID AS buildId,
        b.TITLE AS title,
        b.COMBO_KEY AS comboKey,
        b.CPU_MODEL AS cpuModel,
        b.GPU_MODEL AS gpuModel,
        b.CPU_NAME AS cpuName,
        b.GPU_NAME AS gpuName,
        CAST(JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.price')) AS UNSIGNED) AS price,
        COUNT(p.BENCHMARK_BUILD_PART_ID) AS partCount
      FROM benchmark_builds b
      LEFT JOIN benchmark_build_parts p ON p.BENCHMARK_BUILD_ID = b.BENCHMARK_BUILD_ID
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      GROUP BY b.BENCHMARK_BUILD_ID
      ORDER BY price ASC, b.BENCHMARK_BUILD_ID DESC
      LIMIT ?
      `,
      values,
    );

    return {
      items: rows.map((row: any) => toPublicCombo(row)),
      total: rows.length,
    };
  }

  async getRecommendedBuild(buildId: number) {
    const [build] = await this.dataSource.query(
      `
      SELECT
        b.BENCHMARK_BUILD_ID AS buildId,
        b.TITLE AS title,
        b.COMBO_KEY AS comboKey,
        b.CPU_MODEL AS cpuModel,
        b.GPU_MODEL AS gpuModel,
        b.CPU_NAME AS cpuName,
        b.GPU_NAME AS gpuName,
        CAST(JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.price')) AS UNSIGNED) AS price
      FROM benchmark_builds b
      WHERE b.BENCHMARK_BUILD_ID = ?
      `,
      [buildId],
    );

    if (!build) return null;

    const parts = await this.dataSource.query(
      `
      SELECT
        BENCHMARK_BUILD_PART_ID AS partId,
        PART_CATEGORY AS category,
        PART_LABEL AS label,
        PART_NAME AS name,
        PART_PRICE AS price,
        QUANTITY AS quantity,
        EXTERNAL_PRODUCT_CODE AS externalProductCode,
        IMAGE_URL AS imageUrl,
        SPEC_TEXT AS specText
      FROM benchmark_build_parts
      WHERE BENCHMARK_BUILD_ID = ?
      ORDER BY
        CASE
          WHEN FIELD(PART_CATEGORY, 'CPU', 'COOLER', 'MAINBOARD', 'RAM', 'GPU', 'SSD', 'HDD', 'POWER', 'CASE', 'OS', 'SERVICE') = 0 THEN 99
          ELSE FIELD(PART_CATEGORY, 'CPU', 'COOLER', 'MAINBOARD', 'RAM', 'GPU', 'SSD', 'HDD', 'POWER', 'CASE', 'OS', 'SERVICE')
        END,
        BENCHMARK_BUILD_PART_ID
      `,
      [buildId],
    );

    return { ...toPublicCombo(build), parts };
  }

  private async attachComponentPartIds(combos: any[]) {
    if (!combos.length) return;
    const rows = await this.dataSource.query(
      `SELECT p.PART_ID AS partId, p.PART_CATEGORY_ID AS categoryId, p.CANONICAL_NAME AS partName,
              p.MODEL_NAME AS modelName, p.MANUFACTURER AS manufacturer,
              p.IS_ADMIN_APPROVED AS isAdminApproved, p.ADMIN_PRIORITY AS adminPriority,
              p.POPULARITY_SCORE AS popularityScore
       FROM parts p
       JOIN (
         SELECT DISTINCT o.PART_ID
         FROM benchmark_component_observations o
         JOIN benchmark_component_tests t ON t.BENCHMARK_COMPONENT_TEST_ID = o.BENCHMARK_COMPONENT_TEST_ID
         WHERE o.PART_ID IS NOT NULL AND t.IS_ACTIVE = 'Y'
       ) observed ON observed.PART_ID = p.PART_ID
       WHERE p.PART_CATEGORY_ID IN (1, 5) AND p.STATUS = 'ACTIVE'`,
    );
    const byKey = new Map<string, any[]>();
    for (const row of rows) {
      const deviceType = Number(row.categoryId) === 1 ? 'CPU' : 'GPU';
      const key = normalizeComponentModelKey(
        `${row.manufacturer ?? ''} ${row.modelName ?? row.partName ?? ''}`,
        deviceType,
      );
      const candidates = byKey.get(key) ?? [];
      candidates.push(row);
      byKey.set(key, candidates);
    }

    combos.forEach((combo) => {
      const cpuCandidates = byKey.get(normalizeComponentModelKey(`${combo.cpuName ?? ''} ${combo.cpuModel ?? ''}`, 'CPU')) ?? [];
      const gpuCandidates = byKey.get(normalizeComponentModelKey(`${combo.gpuName ?? ''} ${combo.gpuModel ?? ''}`, 'GPU')) ?? [];
      // A public combo receives a concrete SKU only when the model-family match
      // is both benchmark-backed and unique. Never pick a popular SKU as a proxy.
      if (cpuCandidates.length === 1) combo.cpuPartId = Number(cpuCandidates[0].partId);
      if (gpuCandidates.length === 1) combo.gpuPartId = Number(gpuCandidates[0].partId);
    });
  }

  private async resolveInternalComboKeys(publicComboKey: string) {
    const decodedComboKeys = decodePublicComboRef(publicComboKey);
    const decodedCandidates = Array.isArray(decodedComboKeys) ? decodedComboKeys : decodedComboKeys ? [decodedComboKeys] : [];
    const candidates = [
      ...decodedCandidates,
      publicComboKey,
      `kjwwang-${publicComboKey}`,
      `wanggapc-${publicComboKey}`,
    ].filter(Boolean) as string[];
    const uniqueCandidates = [...new Set(candidates)];
    const placeholders = uniqueCandidates.map(() => '?').join(', ');
    const rows = await this.dataSource.query(
      `
      SELECT COMBO_KEY AS comboKey
      FROM benchmark_builds
      WHERE COMBO_KEY IN (${placeholders})
      ORDER BY FIELD(COMBO_KEY, ${placeholders})
      `,
      [...uniqueCandidates, ...uniqueCandidates],
    );
    const resolved = rows.map((row: any) => String(row.comboKey)).filter(Boolean);
    return resolved.length ? resolved : uniqueCandidates.slice(0, 1);
  }

  private async resolveRecommendationComboKeys(publicComboRef: string) {
    const decoded = decodePublicComboRef(publicComboRef);
    const decodedCandidates = Array.isArray(decoded) ? [...new Set(decoded)] : [];
    if (decodedCandidates.length <= 1) return this.resolveInternalComboKeys(publicComboRef);

    const placeholders = decodedCandidates.map(() => '?').join(', ');
    const rows = await this.dataSource.query(
      `
      SELECT
        b.COMBO_KEY AS comboKey,
        MIN(b.CPU_MODEL) AS cpuModel,
        MIN(b.GPU_MODEL) AS gpuModel,
        MIN(b.CPU_NAME) AS cpuName,
        MIN(b.GPU_NAME) AS gpuName
      FROM benchmark_builds b
      JOIN benchmark_sources s ON s.BENCHMARK_SOURCE_ID = b.BENCHMARK_SOURCE_ID
      WHERE ${validKjwwangRecommendationConditions().join(' AND ')}
        AND b.COMBO_KEY IN (${placeholders})
      GROUP BY b.COMBO_KEY
      `,
      decodedCandidates,
    );
    if (rows.length !== decodedCandidates.length) return [];
    const publicGroups = new Set(rows.map((row: any) => recommendationGroupKey(row)));
    return publicGroups.size === 1 ? decodedCandidates : [];
  }
}

function toPublicComboKey(comboKey: unknown) {
  return String(comboKey ?? '').replace(/^(?:kjwwang|wanggapc)-/i, '');
}

function toRecommendationCombo(row: any, publicComboRef = toPublicComboRef(String(row.comboKey ?? ''))) {
  const publicCpuModel = formatPublicCpuModel(row.cpuModel, row.cpuName);
  const publicGpuModel = formatPublicGpuModel(row.gpuModel, row.gpuName);
  const publicComboKey = buildPublicRecommendationComboKey(row);
  return {
    comboKey: toPublicComboKey(row.comboKey),
    publicComboKey,
    publicComboRef,
    publicCpuModel,
    publicGpuModel,
    publicComboName: formatPublicComboName(row.cpuModel, row.gpuModel, row.cpuName, row.gpuName),
    cpuModel: publicCpuModel,
    gpuModel: publicGpuModel,
    sourceCode: 'KJWWANG',
    sourceName: '견적왕',
    recommendationCount: Number(row.recommendationCount ?? 0),
    gameCount: Number(row.gameCount ?? 0),
    latestCapturedAt: row.latestCapturedAt ?? null,
  };
}

function buildPublicRecommendationComboKey(row: any) {
  const cpuKey = normalizeComponentModelKey(formatPublicCpuModel(row.cpuModel, row.cpuName), 'CPU').replace(/^cpu:/, '');
  const gpuKey = normalizeComponentModelKey(formatPublicGpuModel(row.gpuModel, row.gpuName), 'GPU').replace(/^gpu:/, '');
  return `${cpuKey}-${gpuKey}`.replace(/:/g, '-');
}

function validKjwwangRecommendationConditions() {
  return [
    "s.SOURCE_CODE = 'KJWWANG'",
    "JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.gameId')) IS NOT NULL",
    "JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.gameName')) IS NOT NULL",
    "JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.resolution')) IS NOT NULL",
    "JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.tier')) IS NOT NULL",
    "JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.platform')) IS NOT NULL",
    "JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.crawledAt')) IS NOT NULL",
  ];
}

function groupRecommendationSnapshots(rows: any[], allGroupRows: any[]) {
  const allInternalKeysByGroup = new Map<string, Set<string>>();
  for (const row of allGroupRows) {
    const groupKey = recommendationGroupKey(row);
    const internalComboKeys = allInternalKeysByGroup.get(groupKey) ?? new Set<string>();
    if (row.comboKey) internalComboKeys.add(String(row.comboKey));
    allInternalKeysByGroup.set(groupKey, internalComboKeys);
  }

  const groups = new Map<string, { rows: any[]; internalComboKeys: Set<string> }>();
  for (const row of rows) {
    const publicCpuModel = formatPublicCpuModel(row.cpuModel, row.cpuName);
    const publicGpuModel = formatPublicGpuModel(row.gpuModel, row.gpuName);
    const groupKey = recommendationGroupKey(row);
    const group = groups.get(groupKey) ?? {
      rows: [],
      internalComboKeys: new Set(allInternalKeysByGroup.get(groupKey) ?? []),
    };
    group.rows.push({ ...row, publicCpuModel, publicGpuModel });
    if (row.comboKey) group.internalComboKeys.add(String(row.comboKey));
    groups.set(groupKey, group);
  }

  return [...groups.values()].map(({ rows: snapshots, internalComboKeys }) => {
    const first = snapshots[0];
    const latestCapturedAt = snapshots
      .map((row) => row.capturedAt)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;
    const gameIds = new Set(snapshots.map((row) => row.gameId).filter(Boolean));
    return toRecommendationCombo({
      ...first,
      recommendationCount: snapshots.length,
      gameCount: gameIds.size,
      latestCapturedAt,
    }, toPublicComboRef([...internalComboKeys].sort()));
  });
}

function recommendationGroupKey(row: any) {
  return buildPublicRecommendationComboKey(row).toLowerCase();
}

function toPublicCombo(row: any) {
  const internalComboKey = String(row.comboKey ?? '');
  const comboKey = toPublicComboKey(row.comboKey);
  const publicCpuModel = formatPublicCpuModel(row.cpuModel, row.cpuName);
  const publicGpuModel = formatPublicGpuModel(row.gpuModel, row.gpuName);
  const resultCount = Number(row.resultCount ?? 0);
  return {
    ...row,
    comboKey,
    publicComboRef: toPublicComboRef(internalComboKey),
    cpuModel: publicCpuModel,
    gpuModel: publicGpuModel,
    publicCpuModel,
    publicGpuModel,
    publicComboName: formatPublicComboName(row.cpuModel, row.gpuModel, row.cpuName, row.gpuName),
    hasFpsEvidence: resultCount > 0 || Number(row.gameCount ?? 0) > 0,
  };
}

function toPublicComboRef(internalComboKey: string | string[]) {
  const keys = Array.isArray(internalComboKey) ? [...new Set(internalComboKey)].sort() : [internalComboKey];
  const payload = keys.length === 1 ? keys[0] : JSON.stringify(keys);
  return `combo_${Buffer.from(payload, 'utf8').toString('base64url')}`;
}

function decodePublicComboRef(publicComboKey: string) {
  if (!publicComboKey.startsWith('combo_')) return null;
  try {
    const decoded = Buffer.from(publicComboKey.slice('combo_'.length), 'base64url').toString('utf8');
    if (decoded.startsWith('[')) {
      const keys = JSON.parse(decoded);
      return Array.isArray(keys) ? keys.filter((key): key is string => typeof key === 'string' && key.length > 0) : null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function mergePublicCombos(rows: any[]) {
  const groups = new Map<string, any>();
  for (const row of rows) {
    const groupKey = `${row.publicCpuModel ?? row.cpuModel}::${row.publicGpuModel ?? row.gpuModel}`.toLowerCase();
    const decodedRef = decodePublicComboRef(String(row.publicComboRef ?? ''));
    const internalComboKeys = Array.isArray(decodedRef)
      ? decodedRef
      : decodedRef
        ? [decodedRef]
        : [String(row.comboKey ?? '')];
    const current = groups.get(groupKey);
    if (!current) {
      groups.set(groupKey, { ...row, __internalComboKeys: internalComboKeys });
      continue;
    }

    current.__internalComboKeys.push(...internalComboKeys);
    current.buildSampleCount = sumCount(current.buildSampleCount, row.buildSampleCount);
    current.resultCount = sumCount(current.resultCount, row.resultCount);
    current.gameCount = Math.max(Number(current.gameCount ?? 0), Number(row.gameCount ?? 0));
    current.hasFpsEvidence = Boolean(current.hasFpsEvidence || row.hasFpsEvidence);
    current.publicComboRef = toPublicComboRef(current.__internalComboKeys);
  }

  return [...groups.values()].map(({ __internalComboKeys, ...row }) => row);
}

function sumCount(left: unknown, right: unknown) {
  const total = Number(left ?? 0) + Number(right ?? 0);
  return Number.isFinite(total) ? total : 0;
}

export function collapseSourceReportedResolutionRows(rows: any[]) {
  const grouped = new Map<string, any[]>();
  rows.forEach((row) => {
    const key = `${row.gameId ?? row.gameName}`;
    const group = grouped.get(key) ?? [];
    group.push(row);
    grouped.set(key, group);
  });

  const result: any[] = [];
  for (const group of grouped.values()) {
    const signatures = new Set(group.map((row) => `${row.rawFpsAvg}-${row.rawFpsMin}-${row.rawFpsMax}-${row.displayFpsMin ?? row.fpsMin}-${row.displayFpsMax ?? row.fpsMax}`));
    if (group.length > 1 && group.every((row) => row.evidenceType === 'SOURCE_REPORTED') && signatures.size === 1) {
      const first = group[0];
      result.push({
        ...first,
        evidenceNote: '해상도별 독립 실측값이 없어 원본 보고값 1건만 표시합니다.',
      });
    } else {
      result.push(...group);
    }
  }
  return result;
}

function findPartName(parts: Array<{ category?: string; name?: string }>, categories: string[]) {
  return parts.find((part) => categories.includes(part.category ?? ''))?.name?.trim() ?? '';
}

function buildCpuKeywords(name: string) {
  const normalized = normalizeModelText(name);
  const keywords = new Set<string>();
  const cpuSuffix = '(?:x3d|x|f|kf|k|g|t|ks)?';
  const intel = normalized.match(new RegExp(`\\bi[3579]\\s*-?\\s*\\d{4,5}${cpuSuffix}\\b`, 'i'))?.[0];
  const intelNumber = normalized.match(new RegExp(`\\b\\d{4,5}${cpuSuffix}\\b`, 'i'))?.[0];
  const ryzen = normalized.match(new RegExp(`\\b(?:ryzen|라이젠)\\s*[3579]?\\s*\\d{4,5}${cpuSuffix}\\b`, 'i'))?.[0];
  const ryzenNumber = normalized.match(new RegExp(`\\b\\d{4,5}${cpuSuffix}\\b`, 'i'))?.[0];

  [intel, intelNumber, ryzen, ryzenNumber].forEach((keyword) => {
    if (keyword) keywords.add(keyword.replace(/\s+/g, ' ').trim());
  });

  return [...keywords].filter((keyword) => keyword.length >= 3);
}

function buildGpuKeywords(name: string) {
  const normalized = normalizeModelText(name);
  const keywords = new Set<string>();
  const rtx = normalized.match(/\brtx\s*\d{4}\s*(?:ti|super)?\b/i)?.[0];
  const gtx = normalized.match(/\bgtx\s*\d{3,4}\s*(?:ti|super)?\b/i)?.[0];
  const rx = normalized.match(/\brx\s*\d{4}\s*(?:xt|gre)?\b/i)?.[0];
  const number = normalized.match(/\b\d{4}\s*(?:ti|super|xt|gre)?\b/i)?.[0];

  [rtx, gtx, rx, number].forEach((keyword) => {
    if (keyword) keywords.add(keyword.replace(/\s+/g, ' ').trim());
  });

  return [...keywords].filter((keyword) => keyword.length >= 3);
}

function normalizeModelText(value: string) {
  return value
    .replace(/[™®]/g, '')
    .replace(/\((?:벌크|정품|멀티팩|대원씨티에스|피씨디렉트|제이씨현|갤럭시|이엠텍|MSI|ASUS|GIGABYTE|기가바이트).*?\)/gi, ' ')
    .replace(/[·,_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesExactModel(model: unknown, name: unknown, keywords: string[]) {
  const candidates = [model, name]
    .filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
    .map(compactModelText);
  return keywords.some((keyword) => {
    const compactKeyword = compactModelText(keyword);
    return compactKeyword.length >= 3 && candidates.some((candidate) => (
      candidate === compactKeyword || candidate.endsWith(compactKeyword)
    ));
  });
}

function compactModelText(value: string) {
  return normalizeModelText(value).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function normalizeBenchmarkResolution(resolution?: string) {
  if (!resolution) return undefined;
  if (resolution === '4K') return 'UHD';
  if (['FHD', 'QHD', 'UHD'].includes(resolution)) return resolution;
  return undefined;
}

function mapQuotePerformanceRow(row: any) {
  const fpsMin = safeFps(row.displayFpsMin ?? row.rawFpsMin);
  const fpsMax = safeFps(row.displayFpsMax ?? row.rawFpsMax ?? fpsMin);
  const evidence = benchmarkEvidence(row);
  return {
    game: row.gameName,
    resolution: row.resolution === 'UHD' ? '4K' : row.resolution,
    grade: mapComfortGrade(row.comfortGrade, fpsMin),
    fpsMin,
    fpsMax: Math.max(fpsMin, fpsMax),
    isEstimated: evidence.isEstimated,
    sampleCount: Number(row.sampleCount ?? 0),
    bestQuality: row.bestQuality,
    evidenceType: evidence.evidenceType,
    confidence: evidence.confidence,
    evidenceNote: evidence.evidenceNote,
  };
}

function normalizeQuotePerformanceRows(rows: any[]) {
  const items = collapseSourceReportedResolutionRows(rows.filter(hasMeasuredFps).map(mapQuotePerformanceRow));
  const groupMap = new Map<string, typeof items>();

  items.forEach((item) => {
    const group = groupMap.get(item.game) ?? [];
    group.push(item);
    groupMap.set(item.game, group);
  });

  return items.map((item) => {
    const group = groupMap.get(item.game) ?? [];
    if (item.evidenceType === 'SOURCE_REPORTED' || !shouldAdjustResolutionBuckets(group)) return item;

    const baseline = group.find((result) => result.resolution === 'FHD') ?? group[0];
    const multiplier = getResolutionFpsMultiplier(item.resolution);
    const fpsMin = safeFps(baseline.fpsMin * multiplier);
    const fpsMax = Math.max(fpsMin, safeFps(baseline.fpsMax * multiplier));

    return {
      ...item,
      grade: mapComfortGrade(item.grade, fpsMin),
      fpsMin,
      fpsMax,
      isEstimated: true,
      isResolutionAdjusted: item.resolution !== 'FHD',
      evidenceType: 'DERIVED',
      confidence: 'LOW',
      evidenceNote: '해상도별 독립 실측값이 없어 FHD 기준 보정값입니다.',
    };
  });
}

function hasMeasuredFps(row: any) {
  return [row.displayFpsMin, row.displayFpsMax, row.rawFpsMin, row.rawFpsMax]
    .some((value) => value !== null && value !== undefined && Number.isFinite(Number(value)) && Number(value) > 0);
}

function shouldAdjustResolutionBuckets(group: ReturnType<typeof mapQuotePerformanceRow>[]) {
  const uniqueResolutions = new Set(group.map((item) => item.resolution));
  if (uniqueResolutions.size < 2) return false;

  const uniqueFpsBuckets = new Set(group.map((item) => `${item.fpsMin}-${item.fpsMax}`));
  return uniqueFpsBuckets.size === 1;
}

function getResolutionFpsMultiplier(resolution: string) {
  if (resolution === 'QHD') return 0.78;
  if (resolution === '4K' || resolution === 'UHD') return 0.55;
  return 1;
}

function safeFps(value: unknown) {
  const fps = Number(value);
  return Number.isFinite(fps) ? Math.max(0, Math.round(fps)) : 0;
}

function mapComfortGrade(comfortGrade: string | null | undefined, fpsMin: number) {
  const grade = `${comfortGrade ?? ''}`.toUpperCase();
  if (['EXCELLENT', 'VERY_SMOOTH', 'SMOOTH'].includes(grade) || fpsMin >= 100) return '쾌적';
  if (['GOOD', 'OK'].includes(grade) || fpsMin >= 60) return '좋음';
  if (['PLAYABLE', 'LOW'].includes(grade) || fpsMin >= 35) return '플레이 가능';
  return '비추천';
}

function benchmarkEvidence(row: any) {
  const sampleCount = Number(row.sampleCount ?? 0);
  const rawAvg = Number(row.rawFpsAvg ?? 0);
  const rawMin = Number(row.rawFpsMin ?? 0);
  const rawMax = Number(row.rawFpsMax ?? 0);
  const displayMin = Number(row.displayFpsMin ?? 0);
  const displayMax = Number(row.displayFpsMax ?? 0);
  const hasSyntheticDisplayRange = rawAvg > 0
    && rawMin === rawMax
    && displayMin === Math.round(rawAvg * 0.85)
    && displayMax === Math.round(rawAvg * 1.15);

  if (hasSyntheticDisplayRange) {
    return {
      isEstimated: true,
      evidenceType: 'SOURCE_REPORTED',
      confidence: 'LOW',
      evidenceNote: '게임당 평균 보고값이며 해상도별 독립 실측을 확인할 수 없습니다.',
    };
  }

  if (sampleCount <= 1) {
    const sourceNames = String(row.sourceNames ?? '').trim();
    return {
      isEstimated: true,
      evidenceType: 'SOURCE_REPORTED',
      confidence: 'LOW',
      evidenceNote: `${sourceNames ? `${sourceNames} ` : ''}원문에 표시된 게임별 평균 FPS입니다. 우리 서버 직접 실측값이 아니며 테스트 조건을 함께 확인해주세요.`,
    };
  }

  return {
    isEstimated: false,
    evidenceType: 'MEASURED',
    confidence: sampleCount >= 3 ? 'MEDIUM' : 'LOW',
    evidenceNote: '원본 FPS 집계값입니다. 테스트 조건을 함께 확인해주세요.',
  };
}

function limitValue(value: number, maximum: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(maximum, Math.max(1, Math.floor(value)));
}
