/**
 * ComputerBase 공개 GPU 게임 벤치마크 수집기.
 *
 * ComputerBase의 게임별 차트에 표시된 평균 FPS를 source-reported 값으로
 * 저장한다. 우리 서버에서 재측정한 값처럼 포장하지 않으며, 테스트 시스템
 * (Ryzen 7 9800X3D)과 원문 URL을 benchmark_builds.RAW_JSON/RAW_TEXT에 남긴다.
 *
 * 기본은 dry-run이며, DB 반영은 --apply가 있어야 한다.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as cheerio from 'cheerio';

const TEST_CPU = {
  name: 'AMD Ryzen 7 9800X3D (ComputerBase 테스트 시스템)',
  model: 'ryzen7-9800x3d',
};

const GPU_DEFINITIONS = {
  rtx5060: { label: 'GeForce RTX 5060 (8 GB)', name: 'NVIDIA GeForce RTX 5060 8GB' },
  rtx5070: { label: 'GeForce RTX 5070 (12 GB)', name: 'NVIDIA GeForce RTX 5070 12GB' },
  rtx5070ti: { label: 'GeForce RTX 5070 Ti (16 GB)', name: 'NVIDIA GeForce RTX 5070 Ti 16GB' },
  rtx5080: { label: 'GeForce RTX 5080 (16 GB)', name: 'NVIDIA GeForce RTX 5080 16GB' },
  rtx5090: { label: 'GeForce RTX 5090 (32 GB)', name: 'NVIDIA GeForce RTX 5090 32GB' },
  rx9070xt: { label: 'Radeon RX 9070 XT (16 GB)', name: 'AMD Radeon RX 9070 XT 16GB' },
  rx9070: { label: 'Radeon RX 9070 (16 GB)', name: 'AMD Radeon RX 9070 16GB' },
  rx7800xt: { label: 'Radeon RX 7800 XT (16 GB)', name: 'AMD Radeon RX 7800 XT 16GB' },
  rx7900xt: { label: 'Radeon RX 7900 XT (20 GB)', name: 'AMD Radeon RX 7900 XT 20GB' },
  rx7900xtx: { label: 'Radeon RX 7900 XTX (24 GB)', name: 'AMD Radeon RX 7900 XTX 24GB' },
};

export const SOURCE_CONFIGS = [
  {
    sourceCode: 'COMPUTERBASE',
    sourceName: 'ComputerBase 공개 벤치마크',
    baseUrl: 'https://www.computerbase.de',
    articleKey: 'nvidia-geforce-rtx-5060-test.92811',
    pages: [3, 4, 5],
    targetModels: Object.keys(GPU_DEFINITIONS),
    resolutionFilter: Object.fromEntries(Object.keys(GPU_DEFINITIONS).map((model) => [model, ['FHD', 'QHD']])),
  },
  {
    sourceCode: 'COMPUTERBASE',
    sourceName: 'ComputerBase 공개 벤치마크',
    baseUrl: 'https://www.computerbase.de',
    articleKey: 'amd-radeon-rx-9070-xt-rx-9070-test.91578',
    pages: [3, 4, 5],
    targetModels: Object.keys(GPU_DEFINITIONS),
    resolutionFilter: Object.fromEntries(Object.keys(GPU_DEFINITIONS).map((model) => [model, ['UHD']])),
  },
];

const GAME_ALIASES = new Map([
  ['Black Myth: Wukong', '검은 신화: 오공'],
  ['COD: Black Ops 6', '콜 오브 듀티 블랙옵스6'],
  ["Dragon's Dogma 2", '드래곤즈 도그마 2'],
  ['Ghost of Tsushima', '고스트 오브 쓰시마'],
  ['God of War: Ragnarök', '갓 오브 워 라그나로크'],
  ['Kingdom Come: Deliverance 2', '킹덤 컴 : 딜리버런스 2'],
  ['Satisfactory', '새티스 팩토리(Satisfactory)'],
  ["Senua's Saga: Hellblade 2", '세누아의 전설: 헬블레이드 2'],
  ['Silent Hill 2', '사일런트 힐 2 (SILENT HILL 2)'],
  ['Spider-Man 2', 'Marvel\'s Spider-Man 2'],
  ['Stalker 2: Heart of Chornobyl', '스토커 2: 하트 오브 체르노빌'],
  ['Warhammer 40k: Space Marine 2', '워해머 40k 스페이스 마린 2'],
  ['Final Fantasy XVI', '파이널 판타지 16'],
  ['Frostpunk 2', '프로스트펑크 2 (Frostpunk 2)'],
  ['Monster Hunter Wilds', '몬스터 헌터 와일즈'],
]);

const RESOLUTION_MAP = new Map([
  ['1.920 × 1.080', 'FHD'],
  ['2.560 × 1.440', 'QHD'],
  ['3.840 × 2.160', 'UHD'],
]);

function parseFps(value) {
  const fps = Number.parseFloat(String(value ?? '').replace(',', '.'));
  return Number.isFinite(fps) && fps > 0 ? fps : null;
}

function normalizeQuality(title) {
  if (/native/i.test(title)) return 'NATIVE';
  if (/quality/i.test(title)) return 'QUALITY';
  if (/ultra/i.test(title)) return 'ULTRA';
  return 'UNKNOWN';
}

function comfortGrade(fps) {
  if (fps === null) return '지원';
  if (fps >= 144) return '쾌적';
  if (fps >= 100) return '좋음';
  if (fps >= 60) return '보통';
  if (fps >= 30) return '플레이 가능';
  return '비추천';
}

function parseChartTitle(title) {
  const resolutionMatch = [...RESOLUTION_MAP.keys()].find((key) => title.includes(key));
  if (!resolutionMatch) return null;
  const resolution = RESOLUTION_MAP.get(resolutionMatch);
  const beforeResolution = title.slice(0, title.indexOf(resolutionMatch)).replace(/,\s*$/, '').trim();
  const optionPreset = title.slice(title.indexOf(resolutionMatch) + resolutionMatch.length).replace(/^,\s*/, '').trim();
  return { sourceGameName: beforeResolution, resolution, optionPreset };
}

export function parseComputerBasePage(html, { pageUrl, targetModels, resolutionFilter = {} }) {
  const $ = cheerio.load(html);
  const targetLabels = new Map(targetModels.map((model) => [GPU_DEFINITIONS[model].label, model]));
  const records = [];

  $('[data-title]').each((_, chart) => {
    const title = $(chart).attr('data-title') ?? '';
    const parsedTitle = parseChartTitle(title);
    if (!parsedTitle || !GAME_ALIASES.has(parsedTitle.sourceGameName)) return;

    const averageGroup = $(chart).find('.chart__group').filter((__, group) => {
      return $(group).find('.chart__group-header').first().text().includes('FPS, Durchschnitt');
    }).first();
    if (!averageGroup.length) return;

    averageGroup.find('.chart__row').each((__, row) => {
      const label = $(row).find('.chart__item').text().replace(/\s+/g, ' ').trim();
      const gpuModel = targetLabels.get(label);
      if (!gpuModel) return;
      if (resolutionFilter[gpuModel] && !resolutionFilter[gpuModel].includes(parsedTitle.resolution)) return;
      const fps = parseFps($(row).find('.chart__label[data-value]').first().attr('data-value'));
      if (fps === null) return;
      records.push({
        sourceGameName: parsedTitle.sourceGameName,
        gameName: GAME_ALIASES.get(parsedTitle.sourceGameName),
        gpuModel,
        resolution: parsedTitle.resolution,
        optionPreset: parsedTitle.optionPreset,
        fps,
        rawText: `${title} | ${label} | ${fps} FPS 평균`,
        pageUrl,
      });
    });
  });

  return records;
}

async function fetchRecords(config) {
  const records = [];
  for (const page of config.pages) {
    const pageUrl = `${config.baseUrl}/artikel/grafikkarten/${config.articleKey}/seite-${page}`;
    const response = await fetch(pageUrl, { headers: { 'user-agent': 'JHSComputer-BenchmarkCollector/1.0' } });
    if (!response.ok) throw new Error(`ComputerBase 요청 실패: ${response.status} ${pageUrl}`);
    const html = await response.text();
    records.push(...parseComputerBasePage(html, {
      pageUrl,
      targetModels: config.targetModels,
      resolutionFilter: config.resolutionFilter,
    }));
  }
  return dedupeRecords(records);
}

function dedupeRecords(records) {
  const map = new Map();
  for (const record of records) {
    const key = `${record.gpuModel}:${record.gameName}:${record.resolution}`;
    if (!map.has(key)) map.set(key, record);
  }
  return [...map.values()];
}

function slugify(value) {
  return value.toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 140);
}

function dbConfig(envPath) {
  dotenv.config({ path: envPath });
  return {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USERNAME ?? 'jhs_dev',
    password: process.env.DB_PASSWORD ?? 'hollywood',
    database: process.env.DB_DATABASE ?? 'jhs_computer_dev',
    charset: 'utf8mb4',
  };
}

async function ensureGame(conn, gameName, cache) {
  if (cache.has(gameName)) return cache.get(gameName);
  await conn.execute(
    `INSERT INTO benchmark_games (GAME_NAME, SLUG, IS_ACTIVE)
     VALUES (?, ?, 'Y') ON DUPLICATE KEY UPDATE IS_ACTIVE='Y'`,
    [gameName, `computerbase-${slugify(gameName)}`],
  );
  const [[row]] = await conn.execute('SELECT BENCHMARK_GAME_ID AS gameId FROM benchmark_games WHERE GAME_NAME = ?', [gameName]);
  cache.set(gameName, row.gameId);
  return row.gameId;
}

async function syncComboResults(conn, { comboKey, cpuModel, gpuModel }) {
  const [rows] = await conn.execute(
    `SELECT BENCHMARK_GAME_ID AS gameId, RESOLUTION AS resolution,
            COUNT(RAW_FPS) AS sampleCount, AVG(RAW_FPS) AS rawFpsAvg,
            MIN(RAW_FPS) AS rawFpsMin, MAX(RAW_FPS) AS rawFpsMax,
            MIN(DISPLAY_FPS_MIN) AS displayFpsMin, MAX(DISPLAY_FPS_MAX) AS displayFpsMax,
            MAX(NORMALIZED_QUALITY) AS bestQuality, MAX(COMFORT_GRADE) AS comfortGrade
     FROM benchmark_fps_results r
     JOIN benchmark_builds b ON b.BENCHMARK_BUILD_ID = r.BENCHMARK_BUILD_ID
     WHERE b.COMBO_KEY = ? GROUP BY BENCHMARK_GAME_ID, RESOLUTION`,
    [comboKey],
  );
  await conn.execute('DELETE FROM benchmark_combo_game_results WHERE COMBO_KEY = ?', [comboKey]);
  for (const row of rows) {
    await conn.execute(
      `INSERT INTO benchmark_combo_game_results
         (COMBO_KEY, CPU_MODEL, GPU_MODEL, BENCHMARK_GAME_ID, RESOLUTION,
          SAMPLE_COUNT, RAW_FPS_AVG, RAW_FPS_MIN, RAW_FPS_MAX,
          DISPLAY_FPS_MIN, DISPLAY_FPS_MAX, BEST_QUALITY, COMFORT_GRADE)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [comboKey, cpuModel, gpuModel, row.gameId, row.resolution, Number(row.sampleCount ?? 0),
       row.rawFpsAvg, row.rawFpsMin, row.rawFpsMax, row.displayFpsMin, row.displayFpsMax,
       row.bestQuality ?? 'UNKNOWN', row.comfortGrade ?? '지원'],
    );
  }
  return rows.length;
}

async function syncConfig(conn, config, records, gameCache, apply) {
  const byGpu = new Map();
  for (const record of records) {
    const group = byGpu.get(record.gpuModel) ?? [];
    group.push(record);
    byGpu.set(record.gpuModel, group);
  }

  if (!apply) return [...byGpu.entries()].map(([gpuModel, gpuRecords]) => ({ gpuModel, recordCount: gpuRecords.length }));

  await conn.execute(
    `INSERT INTO benchmark_sources (SOURCE_CODE, SOURCE_NAME, BASE_URL)
     VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE SOURCE_NAME=VALUES(SOURCE_NAME), BASE_URL=VALUES(BASE_URL)`,
    [config.sourceCode, config.sourceName, config.baseUrl],
  );
  const [[source]] = await conn.execute('SELECT BENCHMARK_SOURCE_ID AS sourceId FROM benchmark_sources WHERE SOURCE_CODE = ?', [config.sourceCode]);

  const result = [];
  for (const [gpuModel, gpuRecords] of byGpu) {
    const gpu = GPU_DEFINITIONS[gpuModel];
    const comboKey = `computerbase-${TEST_CPU.model}-${gpuModel}`;
    const externalBuildId = `${config.articleKey}-${gpuModel}`;
    const title = `${TEST_CPU.name} + ${gpu.name}`;
    const gameCount = new Set(gpuRecords.map((record) => record.gameName)).size;
    await conn.execute(
      `INSERT INTO benchmark_builds
         (BENCHMARK_SOURCE_ID, EXTERNAL_BUILD_ID, TITLE, COMBO_KEY,
          CPU_NAME, CPU_MODEL, GPU_NAME, GPU_MODEL, GAME_COUNT, FPS_RECORD_COUNT, RAW_JSON)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE TITLE=VALUES(TITLE), COMBO_KEY=VALUES(COMBO_KEY),
         GAME_COUNT=VALUES(GAME_COUNT), FPS_RECORD_COUNT=VALUES(FPS_RECORD_COUNT),
         RAW_JSON=VALUES(RAW_JSON), UPDATED_DT=NOW()`,
      [source.sourceId, externalBuildId, title, comboKey, TEST_CPU.name, TEST_CPU.model,
       gpu.name, gpuModel, gameCount, gpuRecords.length,
       JSON.stringify({ source: config.sourceName, sourceUrl: `${config.baseUrl}/artikel/grafikkarten/${config.articleKey}`, testSystem: TEST_CPU.name, evidenceType: 'SOURCE_REPORTED', capturedAt: new Date().toISOString() })],
    );
    const [[build]] = await conn.execute('SELECT BENCHMARK_BUILD_ID AS buildId FROM benchmark_builds WHERE BENCHMARK_SOURCE_ID = ? AND EXTERNAL_BUILD_ID = ?', [source.sourceId, externalBuildId]);
    await conn.execute('DELETE FROM benchmark_fps_results WHERE BENCHMARK_BUILD_ID = ?', [build.buildId]);

    for (const record of gpuRecords) {
      const gameId = await ensureGame(conn, record.gameName, gameCache);
      const roundedFps = Math.round(record.fps);
      await conn.execute(
        `INSERT INTO benchmark_fps_results
           (BENCHMARK_BUILD_ID, BENCHMARK_GAME_ID, RESOLUTION,
            RAW_OPTION_PRESET, NORMALIZED_QUALITY, RAW_FPS,
            DISPLAY_FPS_MIN, DISPLAY_FPS_MAX, COMFORT_GRADE, PLAYABLE, RAW_TEXT)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [build.buildId, gameId, record.resolution, record.optionPreset, normalizeQuality(record.optionPreset), roundedFps,
         roundedFps, roundedFps, comfortGrade(record.fps), record.fps >= 30 ? 'Y' : 'N',
         `${record.rawText} | 출처: ${record.pageUrl} | 테스트 시스템: ${TEST_CPU.name}`.slice(0, 100)],
      );
    }
    const comboResultCount = await syncComboResults(conn, { comboKey, cpuModel: TEST_CPU.model, gpuModel });
    result.push({ gpuModel, recordCount: gpuRecords.length, comboResultCount });
  }
  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const envArg = args.find((arg) => arg.startsWith('--env='));
  const envPath = envArg ? path.resolve(envArg.slice('--env='.length)) : path.resolve('../JHSComputer_Server/.env');
  const allRecords = [];
  for (const config of SOURCE_CONFIGS) {
    const records = await fetchRecords(config);
    allRecords.push({ config, records });
    console.log(`[computerbase] ${config.articleKey}: ${records.length}개 원본 행`);
  }

  if (!apply) {
    console.log('[computerbase] dry-run — DB 반영은 --apply 옵션이 필요합니다.');
    for (const { config, records } of allRecords) {
      const byGpu = new Map();
      records.forEach((record) => byGpu.set(record.gpuModel, (byGpu.get(record.gpuModel) ?? 0) + 1));
      console.log(`  ${config.articleKey}:`, Object.fromEntries(byGpu));
    }
    return;
  }

  const conn = await mysql.createConnection(dbConfig(envPath));
  try {
    const gameCache = new Map();
    const summary = [];
    for (const { config, records } of allRecords) {
      summary.push(...await syncConfig(conn, config, records, gameCache, true));
    }
    console.log('[computerbase] DB 반영 완료', summary);
  } finally {
    await conn.end();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => { console.error(error); process.exitCode = 1; });
}
