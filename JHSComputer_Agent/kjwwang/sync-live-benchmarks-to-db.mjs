/**
 * 견적왕 게임별 추천 견적 JSON → benchmark 테이블 동기화
 *
 * crawl-game-benchmarks.mjs가 수집한 game_*.json을 읽어
 * 게임별·해상도별·옵션별 추천 조합을 benchmark_builds로 저장한다.
 * 게임별 추천 조합 원본에는 FPS 숫자가 없으므로 benchmark_fps_results는 만들지 않는다.
 * 견적 상세 HTML의 숫자 FPS는 sync-estimate-pages-to-db.mjs가 별도로 적재한다.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import {
  dedupeRecommendationRecords,
  getRecommendationContextKey,
  shouldApplyLatestSnapshot,
} from './incremental-collection.mjs';

function parseArgs(argv) {
  const args = {
    input: '../project/samples/kjwwang/benchmarks',
    env: '../JHSComputer_Server/.env',
    dryRun: false,
  };
  for (const rawArg of argv) {
    const normalizedArg = rawArg.replace(/^--/, '');
    const separatorIndex = normalizedArg.indexOf('=');
    const key = separatorIndex >= 0 ? normalizedArg.slice(0, separatorIndex) : normalizedArg;
    const value = separatorIndex >= 0 ? normalizedArg.slice(separatorIndex + 1) : 'true';
    if (key === 'input') args.input = value;
    if (key === 'env') args.env = value;
    if (key === 'dry-run') args.dryRun = value !== 'false';
  }
  return args;
}

async function loadEnv(envPath) {
  const content = await readFile(envPath, 'utf8');
  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

function clean(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function slug(value = '') {
  return clean(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function modelKey(value = '') {
  return slug(value)
    .replace(/^코어-?/i, '')
    .replace(/^intel-/i, '')
    .replace(/^amd-/i, '')
    .replace(/^라이젠-?/i, 'ryzen-')
    .replace(/^라데온-?/i, 'radeon-')
    .replace(/^지포스-?/i, 'geforce-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitCombo(value) {
  const combo = clean(value).replace(/\s*조합\s*$/, '');
  const [cpuName, ...gpuParts] = combo.split(/\s*\+\s*/);
  const gpuName = gpuParts.join(' + ').trim();
  if (!cpuName || !gpuName) return null;
  return {
    cpuName,
    gpuName,
    cpuModel: modelKey(cpuName),
    gpuModel: modelKey(gpuName),
  };
}

function priceToWon(value) {
  const match = clean(value).match(/(\d+)\s*만원\s*(초반|중반|후반)?/i);
  if (!match) return null;
  const base = Number(match[1]) * 10_000;
  const offset = { 초반: 20_000, 중반: 50_000, 후반: 80_000 }[match[2]] ?? 0;
  return base + offset;
}

async function readGames(input) {
  const dir = path.resolve(input);
  const files = (await readdir(dir)).filter((file) => /^game_\d+\.json$/.test(file));
  let allowedGameIds = null;
  try {
    const summary = JSON.parse(await readFile(path.join(dir, 'summary.json'), 'utf8'));
    if (Array.isArray(summary.games)) {
      allowedGameIds = new Set(summary.games.map((game) => Number(game.gameId)).filter(Number.isInteger));
    }
  } catch {
    // summary.json이 없는 기존 샘플은 game_*.json 전체를 읽는다.
  }
  const games = [];
  for (const file of files) {
    const data = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
    if (!data.gameId || !data.gameName) continue;
    if (allowedGameIds && !allowedGameIds.has(Number(data.gameId))) continue;
    games.push(data);
  }
  return games;
}

async function scalar(connection, sql, params = []) {
  const [rows] = await connection.query(sql, params);
  return rows[0] ? Object.values(rows[0])[0] : null;
}

async function ensureSource(connection) {
  await connection.execute(
    `INSERT INTO benchmark_sources (SOURCE_CODE, SOURCE_NAME, BASE_URL)
     VALUES ('KJWWANG', '견적왕', 'https://kjwwang.com')
     ON DUPLICATE KEY UPDATE SOURCE_NAME=VALUES(SOURCE_NAME), BASE_URL=VALUES(BASE_URL)`,
  );
  return scalar(connection, `SELECT BENCHMARK_SOURCE_ID FROM benchmark_sources WHERE SOURCE_CODE='KJWWANG'`);
}

async function upsertGame(connection, game) {
  const gameSlug = `kjwwang-${game.gameId}-${slug(game.gameName)}`.slice(0, 160);
  await connection.execute(
    `INSERT INTO benchmark_games (GAME_NAME, SLUG, IS_ACTIVE)
     VALUES (?, ?, 'Y')
     ON DUPLICATE KEY UPDATE GAME_NAME=VALUES(GAME_NAME), SLUG=VALUES(SLUG), IS_ACTIVE='Y'`,
    [clean(game.gameName), gameSlug],
  );
  return scalar(connection, 'SELECT BENCHMARK_GAME_ID FROM benchmark_games WHERE GAME_NAME = ?', [clean(game.gameName)]);
}

async function upsertBuild(connection, sourceId, game, recommendation) {
  const combo = splitCombo(recommendation.combo);
  if (!combo?.cpuModel || !combo?.gpuModel) return null;
  const resolution = recommendation.resolution === '4K' ? 'UHD' : recommendation.resolution;
  const comboKey = `${combo.cpuModel}-${combo.gpuModel}`.slice(0, 160);
  const externalBuildId = slug(
    `kjwwang-${game.gameId}-${resolution}-${recommendation.tier}-${recommendation.platform}-${comboKey}`,
  ).slice(0, 80);
  const raw = {
    source: 'kjwwang',
    sourceUrl: `https://kjwwang.com/shop/pc_estimate.html?action=detail&game=${game.gameId}`,
    gameId: game.gameId,
    gameName: game.gameName,
    resolution,
    tier: recommendation.tier,
    platform: recommendation.platform,
    combo: recommendation.combo,
    priceRange: recommendation.priceRange,
    price: priceToWon(recommendation.priceRange),
    crawledAt: game.crawledAt,
  };
  const title = `${clean(game.gameName)} ${resolution} ${clean(recommendation.tier)} · ${clean(recommendation.combo)}`;
  const [existingRows] = await connection.execute(
    `SELECT RAW_JSON AS rawJson
       FROM benchmark_builds
      WHERE BENCHMARK_SOURCE_ID = ? AND EXTERNAL_BUILD_ID = ?
      LIMIT 1`,
    [sourceId, externalBuildId],
  );
  const existingRaw = existingRows[0]?.rawJson;
  const existingCapturedAt = typeof existingRaw === 'string'
    ? (() => { try { return JSON.parse(existingRaw).crawledAt; } catch { return null; } })()
    : existingRaw?.crawledAt;
  if (!shouldApplyLatestSnapshot(existingCapturedAt, game.crawledAt)) {
    return { externalBuildId, updated: false, contextKey: getRecommendationContextKey({
      source: 'KJWWANG',
      gameId: game.gameId,
      resolution,
      tier: recommendation.tier,
      platform: recommendation.platform,
      cpuModel: combo.cpuModel,
      gpuModel: combo.gpuModel,
    }) };
  }
  await connection.execute(
    `INSERT INTO benchmark_builds
      (BENCHMARK_SOURCE_ID, EXTERNAL_BUILD_ID, TITLE, COMBO_KEY,
       CPU_NAME, CPU_MODEL, GPU_NAME, GPU_MODEL, GAME_COUNT, FPS_RECORD_COUNT, RAW_JSON)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?)
     ON DUPLICATE KEY UPDATE
       TITLE=VALUES(TITLE), COMBO_KEY=VALUES(COMBO_KEY), CPU_NAME=VALUES(CPU_NAME),
       CPU_MODEL=VALUES(CPU_MODEL), GPU_NAME=VALUES(GPU_NAME), GPU_MODEL=VALUES(GPU_MODEL),
       GAME_COUNT=VALUES(GAME_COUNT), FPS_RECORD_COUNT=0, RAW_JSON=VALUES(RAW_JSON), UPDATED_DT=NOW()`,
    [sourceId, externalBuildId, title, comboKey, combo.cpuName, combo.cpuModel, combo.gpuName, combo.gpuModel, JSON.stringify(raw)],
  );
  return { externalBuildId, updated: true, contextKey: getRecommendationContextKey({
    source: 'KJWWANG',
    gameId: game.gameId,
    resolution,
    tier: recommendation.tier,
    platform: recommendation.platform,
    cpuModel: combo.cpuModel,
    gpuModel: combo.gpuModel,
  }) };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const games = await readGames(args.input);
  const recommendationRecords = games.flatMap((game) =>
    Object.values(game.builds ?? {}).flatMap((items) => items.map((recommendation) => {
      const combo = splitCombo(recommendation.combo);
      if (!combo?.cpuModel || !combo?.gpuModel) return null;
      return {
        ...recommendation,
        source: 'KJWWANG',
        game,
        gameId: game.gameId,
        cpuModel: combo.cpuModel,
        gpuModel: combo.gpuModel,
        crawledAt: game.crawledAt,
      };
    })),
  ).filter(Boolean);
  const recommendations = dedupeRecommendationRecords(recommendationRecords)
    .map((recommendation) => ({ game: recommendation.game, recommendation }));
  console.log(`[kjwwang-db] games=${games.length} recommendations=${recommendationRecords.length} deduped=${recommendations.length}`);
  if (args.dryRun) return;

  const env = await loadEnv(path.resolve(args.env));
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    port: Number(env.DB_PORT ?? 3306),
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    charset: 'utf8mb4',
  });
  const sourceId = await ensureSource(connection);
  let synced = 0;
  let skipped = 0;
  for (const game of games) await upsertGame(connection, game);
  for (const { game, recommendation } of recommendations) {
    const result = await upsertBuild(connection, sourceId, game, recommendation);
    if (result?.updated) synced += 1;
    else skipped += 1;
  }
  const summary = {
    sourceBuilds: await scalar(connection, 'SELECT COUNT(*) FROM benchmark_builds WHERE BENCHMARK_SOURCE_ID = ?', [sourceId]),
    sourceGames: await scalar(connection, "SELECT COUNT(*) FROM benchmark_games WHERE SLUG LIKE 'kjwwang-%'"),
  };
  await connection.end();
  console.log(`[kjwwang-db] done synced=${synced} skipped=${skipped} ${JSON.stringify(summary)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
