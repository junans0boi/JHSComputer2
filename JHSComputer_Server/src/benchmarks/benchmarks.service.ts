import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

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
        COUNT(DISTINCT b.BENCHMARK_BUILD_ID) AS sampleCount
      FROM benchmark_builds b
      JOIN benchmark_combo_game_results r ON r.COMBO_KEY = b.COMBO_KEY
      GROUP BY b.COMBO_KEY
      ORDER BY sampleCount DESC, comboKey ASC
      LIMIT 10
    `);

    return { ...summary, topCombos };
  }

  async getGames(params: { q?: string; limit: number }) {
    const where: string[] = [];
    const values: unknown[] = [];
    if (params.q) {
      where.push('GAME_NAME LIKE ?');
      values.push(`%${params.q}%`);
    }
    values.push(Math.min(params.limit, 300));

    const rows = await this.dataSource.query(
      `
      SELECT
        BENCHMARK_GAME_ID AS gameId,
        GAME_NAME AS gameName,
        SLUG AS slug
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

    values.push(Math.min(params.limit, 200));
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

    return { items: rows, total: rows.length };
  }

  async getComboDetail(comboKey: string) {
    const [combo] = await this.dataSource.query(
      `
      SELECT
        COMBO_KEY AS comboKey,
        MIN(CPU_MODEL) AS cpuModel,
        MIN(GPU_MODEL) AS gpuModel,
        MIN(CPU_NAME) AS cpuName,
        MIN(GPU_NAME) AS gpuName,
        COUNT(*) AS buildSampleCount
      FROM benchmark_builds
      WHERE COMBO_KEY = ?
      GROUP BY COMBO_KEY
      `,
      [comboKey],
    );

    if (!combo) return null;

    const builds = await this.dataSource.query(
      `
      SELECT
        BENCHMARK_BUILD_ID AS buildId,
        EXTERNAL_BUILD_ID AS externalBuildId,
        TITLE AS title,
        GAME_COUNT AS gameCount,
        FPS_RECORD_COUNT AS fpsRecordCount
      FROM benchmark_builds
      WHERE COMBO_KEY = ?
      ORDER BY GAME_COUNT DESC, EXTERNAL_BUILD_ID ASC
      `,
      [comboKey],
    );

    return { ...combo, builds };
  }

  async getComboGames(params: ComboGamesParams) {
    const where = ['r.COMBO_KEY = ?'];
    const values: unknown[] = [params.comboKey];

    if (params.game) {
      where.push('g.GAME_NAME LIKE ?');
      values.push(`%${params.game}%`);
    }
    if (params.resolution) {
      where.push('r.RESOLUTION = ?');
      values.push(params.resolution);
    }

    values.push(Math.min(params.limit, 500));

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
        r.COMFORT_GRADE AS comfortGrade
      FROM benchmark_combo_game_results r
      JOIN benchmark_games g ON g.BENCHMARK_GAME_ID = r.BENCHMARK_GAME_ID
      WHERE ${where.join(' AND ')}
      ORDER BY g.GAME_NAME ASC, FIELD(r.RESOLUTION, 'FHD', 'QHD', 'UHD')
      LIMIT ?
      `,
      values,
    );

    return { items: rows, total: rows.length };
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

    const combo = (cpuKeywords.length && gpuKeywords.length ? await this.findBestCombo(cpuKeywords, gpuKeywords) : null)
      ?? await this.findNearestCombo(cpuKeywords, gpuKeywords);
    if (!combo) {
      return {
        items: [],
        total: 0,
        combo: null,
        reason: '해당 CPU/GPU 조합의 벤치마크 DB가 없습니다.',
      };
    }

    const resolution = normalizeBenchmarkResolution(params.resolution);
    const rows = await this.findComboGameRows({
      comboKey: combo.comboKey,
      games: params.games,
      resolution,
      limit: params.limit,
    });

    return {
      items: normalizeQuotePerformanceRows(rows),
      total: rows.length,
      combo,
      source: 'benchmark_combo_game_results',
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
      LIMIT 1
      `,
      values,
    );

    return rows[0] ?? null;
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
        r.DISPLAY_FPS_MIN AS displayFpsMin,
        r.DISPLAY_FPS_MAX AS displayFpsMax,
        r.RAW_FPS_MIN AS rawFpsMin,
        r.RAW_FPS_MAX AS rawFpsMax,
        r.BEST_QUALITY AS bestQuality,
        r.COMFORT_GRADE AS comfortGrade
      FROM benchmark_combo_game_results r
      JOIN benchmark_games g ON g.BENCHMARK_GAME_ID = r.BENCHMARK_GAME_ID
      WHERE ${params.where.join(' AND ')}
      ORDER BY ${priorityOrder} g.GAME_NAME ASC, FIELD(r.RESOLUTION, 'FHD', 'QHD', 'UHD')
      LIMIT ?
      `,
      [...params.values, ...priorityValues, Math.min(params.limit, 200)],
    );
  }

  async getRecommendedBuilds(params: { source?: string; q?: string; limit: number }) {
    const where: string[] = [];
    const values: unknown[] = [];

    if (params.source) {
      where.push('s.SOURCE_CODE = ?');
      values.push(params.source);
    }
    if (params.q) {
      where.push('(b.TITLE LIKE ? OR b.COMBO_KEY LIKE ? OR b.CPU_MODEL LIKE ? OR b.GPU_MODEL LIKE ?)');
      values.push(`%${params.q}%`, `%${params.q}%`, `%${params.q}%`, `%${params.q}%`);
    }

    values.push(Math.min(params.limit, 100));

    const rows = await this.dataSource.query(
      `
      SELECT
        b.BENCHMARK_BUILD_ID AS buildId,
        s.SOURCE_CODE AS sourceCode,
        s.SOURCE_NAME AS sourceName,
        b.EXTERNAL_BUILD_ID AS externalBuildId,
        b.TITLE AS title,
        b.COMBO_KEY AS comboKey,
        b.CPU_MODEL AS cpuModel,
        b.GPU_MODEL AS gpuModel,
        b.CPU_NAME AS cpuName,
        b.GPU_NAME AS gpuName,
        CAST(JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.price')) AS UNSIGNED) AS price,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.url')) AS sourceUrl,
        JSON_EXTRACT(b.RAW_JSON, '$.keywords') AS keywords,
        COUNT(p.BENCHMARK_BUILD_PART_ID) AS partCount
      FROM benchmark_builds b
      JOIN benchmark_sources s ON s.BENCHMARK_SOURCE_ID = b.BENCHMARK_SOURCE_ID
      LEFT JOIN benchmark_build_parts p ON p.BENCHMARK_BUILD_ID = b.BENCHMARK_BUILD_ID
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      GROUP BY b.BENCHMARK_BUILD_ID, s.SOURCE_CODE, s.SOURCE_NAME
      ORDER BY price ASC, b.BENCHMARK_BUILD_ID DESC
      LIMIT ?
      `,
      values,
    );

    return { items: rows, total: rows.length };
  }

  async getRecommendedBuild(buildId: number) {
    const [build] = await this.dataSource.query(
      `
      SELECT
        b.BENCHMARK_BUILD_ID AS buildId,
        s.SOURCE_CODE AS sourceCode,
        s.SOURCE_NAME AS sourceName,
        b.EXTERNAL_BUILD_ID AS externalBuildId,
        b.TITLE AS title,
        b.COMBO_KEY AS comboKey,
        b.CPU_MODEL AS cpuModel,
        b.GPU_MODEL AS gpuModel,
        b.CPU_NAME AS cpuName,
        b.GPU_NAME AS gpuName,
        CAST(JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.price')) AS UNSIGNED) AS price,
        JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.url')) AS sourceUrl,
        JSON_EXTRACT(b.RAW_JSON, '$.keywords') AS keywords
      FROM benchmark_builds b
      JOIN benchmark_sources s ON s.BENCHMARK_SOURCE_ID = b.BENCHMARK_SOURCE_ID
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

    return { ...build, parts };
  }
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

function normalizeBenchmarkResolution(resolution?: string) {
  if (!resolution) return undefined;
  if (resolution === '4K') return 'UHD';
  if (['FHD', 'QHD', 'UHD'].includes(resolution)) return resolution;
  return undefined;
}

function mapQuotePerformanceRow(row: any) {
  const fpsMin = safeFps(row.displayFpsMin ?? row.rawFpsMin);
  const fpsMax = safeFps(row.displayFpsMax ?? row.rawFpsMax ?? fpsMin);
  return {
    game: row.gameName,
    resolution: row.resolution === 'UHD' ? '4K' : row.resolution,
    grade: mapComfortGrade(row.comfortGrade, fpsMin),
    fpsMin,
    fpsMax: Math.max(fpsMin, fpsMax),
    isEstimated: false,
    sampleCount: Number(row.sampleCount ?? 0),
    bestQuality: row.bestQuality,
  };
}

function normalizeQuotePerformanceRows(rows: any[]) {
  const items = rows.map(mapQuotePerformanceRow);
  const groupMap = new Map<string, typeof items>();

  items.forEach((item) => {
    const group = groupMap.get(item.game) ?? [];
    group.push(item);
    groupMap.set(item.game, group);
  });

  return items.map((item) => {
    const group = groupMap.get(item.game) ?? [];
    if (!shouldAdjustResolutionBuckets(group)) return item;

    const baseline = group.find((result) => result.resolution === 'FHD') ?? group[0];
    const multiplier = getResolutionFpsMultiplier(item.resolution);
    const fpsMin = safeFps(baseline.fpsMin * multiplier);
    const fpsMax = Math.max(fpsMin, safeFps(baseline.fpsMax * multiplier));

    return {
      ...item,
      grade: mapComfortGrade(item.grade, fpsMin),
      fpsMin,
      fpsMax,
      isResolutionAdjusted: item.resolution !== 'FHD',
    };
  });
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
