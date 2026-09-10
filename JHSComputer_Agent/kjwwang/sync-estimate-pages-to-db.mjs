/**
 * 견적왕 개별 견적 상세 HTML 파싱 결과를 공용 FPS 관측값 테이블에 동기화한다.
 * 기본은 dry-run이며, 실제 DB 반영은 --apply가 필요하다.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { buildEstimateObservation } from './fps-observation.mjs';

const SOURCE_CODE = 'KJWWANG';
const SOURCE_NAME = '견적왕';
const BASE_URL = 'https://kjwwang.com';

function parseArgs(argv) {
  const args = {
    input: '../project/samples/kjwwang/parsed',
    env: '../JHSComputer_Server/.env',
    apply: false,
  };
  for (const rawArg of argv) {
    const normalized = rawArg.replace(/^--/, '');
    const separator = normalized.indexOf('=');
    const key = separator >= 0 ? normalized.slice(0, separator) : normalized;
    const value = separator >= 0 ? normalized.slice(separator + 1) : 'true';
    if (key === 'input') args.input = value;
    if (key === 'env') args.env = value;
    if (key === 'apply') args.apply = value !== 'false';
  }
  return args;
}

function clean(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return clean(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 150);
}

function normalizeQuality(value) {
  const text = clean(value);
  if (/최상|울트라|풀옵/i.test(text)) return 'ULTRA';
  if (/상옵|높음|하이/i.test(text)) return 'HIGH';
  if (/중옵|중간|미디엄/i.test(text)) return 'MEDIUM';
  if (/하옵|낮음|로우/i.test(text)) return 'LOW';
  return 'UNKNOWN';
}

function comfortGrade(fps) {
  if (!Number.isFinite(Number(fps))) return '지원';
  if (fps >= 144) return '쾌적';
  if (fps >= 100) return '좋음';
  if (fps >= 60) return '보통';
  if (fps >= 30) return '플레이 가능';
  return '비추천';
}

async function loadEnv(envPath) {
  const content = await readFile(envPath, 'utf8');
  return Object.fromEntries(content.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    }));
}

function connectionConfig(env) {
  return {
    host: env.DB_HOST ?? '127.0.0.1',
    port: Number(env.DB_PORT ?? 3306),
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    charset: 'utf8mb4',
  };
}

async function readParsedEstimates(input) {
  const dir = path.resolve(input);
  const files = (await readdir(dir)).filter((file) => /^estimate_\d+\.json$/.test(file)).sort();
  return Promise.all(files.map(async (file) => JSON.parse(await readFile(path.join(dir, file), 'utf8'))));
}

export function buildSyncPlan(parsedEstimates) {
  return parsedEstimates
    .map((parsed) => buildEstimateObservation(parsed, `${BASE_URL}/shop/pc_estimate.html?action=view&es_sn=${parsed.estimateId}`))
    .filter((observation) => observation && observation.records.length > 0);
}

async function scalar(conn, sql, params = []) {
  const [rows] = await conn.execute(sql, params);
  return rows[0] ? Object.values(rows[0])[0] : null;
}

async function ensureSource(conn) {
  await conn.execute(
    `INSERT INTO benchmark_sources (SOURCE_CODE, SOURCE_NAME, BASE_URL)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE SOURCE_NAME=VALUES(SOURCE_NAME), BASE_URL=VALUES(BASE_URL)`,
    [SOURCE_CODE, SOURCE_NAME, BASE_URL],
  );
  return scalar(conn, 'SELECT BENCHMARK_SOURCE_ID FROM benchmark_sources WHERE SOURCE_CODE = ?', [SOURCE_CODE]);
}

async function ensureGame(conn, gameName, cache) {
  if (cache.has(gameName)) return cache.get(gameName);
  await conn.execute(
    `INSERT INTO benchmark_games (GAME_NAME, SLUG, IS_ACTIVE)
     VALUES (?, ?, 'Y')
     ON DUPLICATE KEY UPDATE GAME_NAME=VALUES(GAME_NAME), IS_ACTIVE='Y'`,
    [gameName, `kjwwang-${slugify(gameName)}`],
  );
  const gameId = await scalar(conn, 'SELECT BENCHMARK_GAME_ID FROM benchmark_games WHERE GAME_NAME = ?', [gameName]);
  cache.set(gameName, gameId);
  return gameId;
}

async function upsertBuild(conn, sourceId, observation) {
  const capturedAt = observation.collection?.collectedAt ?? new Date().toISOString();
  const raw = {
    source: SOURCE_NAME,
    sourceUrl: observation.sourceUrl,
    estimateId: observation.estimateId,
    sourceUpdatedAt: observation.sourceUpdatedAt,
    contentHash: observation.contentHash,
    capturedAt,
    httpStatus: observation.collection?.status ?? null,
    attempts: observation.collection?.attempts ?? null,
    collection: observation.collection,
    evidenceType: observation.evidenceType,
  };
  await conn.execute(
    `INSERT INTO benchmark_builds
       (BENCHMARK_SOURCE_ID, EXTERNAL_BUILD_ID, TITLE, COMBO_KEY,
        CPU_NAME, CPU_MODEL, GPU_NAME, GPU_MODEL, GAME_COUNT, FPS_RECORD_COUNT, RAW_JSON)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       TITLE=VALUES(TITLE), COMBO_KEY=VALUES(COMBO_KEY), CPU_NAME=VALUES(CPU_NAME), CPU_MODEL=VALUES(CPU_MODEL),
       GPU_NAME=VALUES(GPU_NAME), GPU_MODEL=VALUES(GPU_MODEL), GAME_COUNT=VALUES(GAME_COUNT),
       FPS_RECORD_COUNT=VALUES(FPS_RECORD_COUNT), RAW_JSON=VALUES(RAW_JSON), UPDATED_DT=NOW()`,
    [sourceId, observation.externalBuildId, observation.title, observation.comboKey,
      observation.cpuName, observation.cpuModel, observation.gpuName, observation.gpuModel,
      new Set(observation.records.map((record) => record.gameName)).size, observation.records.length, JSON.stringify(raw)],
  );
  return scalar(conn,
    'SELECT BENCHMARK_BUILD_ID FROM benchmark_builds WHERE BENCHMARK_SOURCE_ID = ? AND EXTERNAL_BUILD_ID = ?',
    [sourceId, observation.externalBuildId]);
}

async function replaceBuildParts(conn, buildId, parsed) {
  await conn.execute('DELETE FROM benchmark_build_parts WHERE BENCHMARK_BUILD_ID = ?', [buildId]);
  for (const part of parsed.parts ?? []) {
    await conn.execute(
      `INSERT INTO benchmark_build_parts
         (BENCHMARK_BUILD_ID, PART_CATEGORY, PART_LABEL, PART_NAME, QUANTITY,
          EXTERNAL_PRODUCT_CODE, IMAGE_URL, SPEC_TEXT)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [buildId, part.category, part.label ?? null, part.name, part.quantity ?? null,
        part.productCode ?? null, part.imageUrl ?? null, part.specText ?? null],
    );
  }
}

async function replaceFpsRows(conn, buildId, observation, gameCache) {
  await conn.execute('DELETE FROM benchmark_fps_results WHERE BENCHMARK_BUILD_ID = ?', [buildId]);
  for (const record of observation.records) {
    const gameId = await ensureGame(conn, record.gameName, gameCache);
    const fps = Math.round(record.fps);
    await conn.execute(
      `INSERT INTO benchmark_fps_results
         (BENCHMARK_BUILD_ID, BENCHMARK_GAME_ID, RESOLUTION, OPTION_KEY, SOURCE_CONDITION_KEY, EVIDENCE_TYPE,
          RAW_OPTION_PRESET, NORMALIZED_QUALITY, RAW_FPS, DISPLAY_FPS_MIN, DISPLAY_FPS_MAX,
          COMFORT_GRADE, PLAYABLE, RAW_TEXT)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [buildId, gameId, record.resolution, record.optionPreset, observation.sourceConditionKey, observation.evidenceType,
        record.optionPreset, normalizeQuality(record.optionPreset), fps, fps, fps,
        comfortGrade(record.fps), record.playable && record.fps >= 30 ? 'Y' : 'N', record.rawText.slice(0, 100)],
    );
  }
}

function evidencePriority(value) {
  return { MEASURED: 0, SOURCE_BENCHMARK: 1, SOURCE_REPORTED: 1, SOURCE_RECOMMENDATION: 2 }[value] ?? 9;
}

async function rebuildComboResults(conn, comboKey) {
  const [rows] = await conn.execute(
    `SELECT r.BENCHMARK_GAME_ID AS gameId, r.RESOLUTION AS resolution, r.OPTION_KEY AS optionKey,
            r.EVIDENCE_TYPE AS evidenceType, r.RAW_OPTION_PRESET AS rawOptionPreset,
            r.NORMALIZED_QUALITY AS normalizedQuality, r.RAW_FPS AS rawFps,
            r.DISPLAY_FPS_MIN AS displayFpsMin, r.DISPLAY_FPS_MAX AS displayFpsMax,
            r.COMFORT_GRADE AS comfortGrade, b.EXTERNAL_BUILD_ID AS sourceConditionKey,
            b.UPDATED_DT AS buildUpdatedAt,
            JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.sourceUpdatedAt')) AS sourceUpdatedAt,
            JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.capturedAt')) AS capturedAt,
            JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.estimateId')) AS estimateId,
            b.BENCHMARK_BUILD_ID AS buildId
       FROM benchmark_fps_results r
       JOIN benchmark_builds b ON b.BENCHMARK_BUILD_ID = r.BENCHMARK_BUILD_ID
      WHERE b.COMBO_KEY = ?`,
    [comboKey],
  );
  const selected = new Map();
  for (const row of rows) {
    const key = `${row.gameId}|${row.resolution}|${row.optionKey}|${row.evidenceType}`;
    const current = selected.get(key);
    if (!current || evidencePriority(row.evidenceType) < evidencePriority(current.evidenceType)
      || (evidencePriority(row.evidenceType) === evidencePriority(current.evidenceType)
        && compareFreshness(row, current) > 0)) {
      selected.set(key, row);
    }
  }

  await conn.execute('DELETE FROM benchmark_combo_game_results WHERE COMBO_KEY = ?', [comboKey]);
  for (const row of selected.values()) {
    const fps = row.rawFps == null ? null : Number(row.rawFps);
    await conn.execute(
      `INSERT INTO benchmark_combo_game_results
         (COMBO_KEY, CPU_MODEL, GPU_MODEL, BENCHMARK_GAME_ID, RESOLUTION, OPTION_KEY, SOURCE_CONDITION_KEY, EVIDENCE_TYPE,
          SAMPLE_COUNT, RAW_FPS_AVG, RAW_FPS_MIN, RAW_FPS_MAX, DISPLAY_FPS_MIN, DISPLAY_FPS_MAX,
          BEST_QUALITY, COMFORT_GRADE)
       SELECT b.COMBO_KEY, b.CPU_MODEL, b.GPU_MODEL, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?
         FROM benchmark_builds b
        WHERE b.COMBO_KEY = ?
        ORDER BY b.BENCHMARK_BUILD_ID DESC LIMIT 1`,
      [row.gameId, row.resolution, row.optionKey, row.sourceConditionKey, row.evidenceType,
        fps, fps, fps, row.displayFpsMin, row.displayFpsMax,
        row.normalizedQuality ?? 'UNKNOWN', row.comfortGrade ?? '지원', comboKey],
    );
  }
  return selected.size;
}

function compareFreshness(left, right) {
  for (const field of ['sourceUpdatedAt']) {
    const leftValue = String(left?.[field] ?? '');
    const rightValue = String(right?.[field] ?? '');
    if (leftValue !== rightValue) return leftValue.localeCompare(rightValue);
  }
  const estimateDifference = Number(left?.estimateId ?? 0) - Number(right?.estimateId ?? 0);
  if (estimateDifference !== 0) return estimateDifference;
  for (const field of ['capturedAt', 'buildUpdatedAt']) {
    const leftValue = String(left?.[field] ?? '');
    const rightValue = String(right?.[field] ?? '');
    if (leftValue !== rightValue) return leftValue.localeCompare(rightValue);
  }
  return Number(left?.buildId ?? 0) - Number(right?.buildId ?? 0);
}

export async function syncEstimates(parsedEstimates, { envPath, apply = false } = {}) {
  const plan = buildSyncPlan(parsedEstimates);
  const summary = {
    estimates: parsedEstimates.length,
    validEstimates: plan.length,
    recordCount: plan.reduce((sum, item) => sum + item.records.length, 0),
    comboCount: new Set(plan.map((item) => item.comboKey)).size,
    applied: false,
  };
  if (!apply) return summary;

  const env = await loadEnv(path.resolve(envPath));
  const conn = await mysql.createConnection(connectionConfig(env));
  await conn.beginTransaction();
  try {
    const sourceId = await ensureSource(conn);
    const gameCache = new Map();
    const comboKeys = new Set();
    for (const [index, parsed] of parsedEstimates.entries()) {
      const observation = buildEstimateObservation(parsed, `${BASE_URL}/shop/pc_estimate.html?action=view&es_sn=${parsed.estimateId}`);
      if (!observation || observation.records.length === 0) continue;
      const buildId = await upsertBuild(conn, sourceId, observation);
      await replaceBuildParts(conn, buildId, parsed);
      await replaceFpsRows(conn, buildId, observation, gameCache);
      comboKeys.add(observation.comboKey);
      console.log(`[kjwwang-db] ${index + 1}/${parsedEstimates.length} es_sn=${observation.estimateId} records=${observation.records.length}`);
    }
    for (const comboKey of comboKeys) await rebuildComboResults(conn, comboKey);
    await conn.commit();
    summary.applied = true;
    summary.comboResults = comboKeys.size;
    return summary;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    await conn.end();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const parsed = await readParsedEstimates(args.input);
  const summary = await syncEstimates(parsed, { envPath: path.resolve(args.env), apply: args.apply });
  console.log(`[kjwwang-db] ${args.apply ? 'apply' : 'dry-run'} ${JSON.stringify(summary)}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { comfortGrade, normalizeQuality, rebuildComboResults };
