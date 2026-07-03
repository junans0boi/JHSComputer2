import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

const DEFAULT_INPUTS = [
  '../project/samples/kjwwang/parsed-40',
  '../project/samples/kjwwang/parsed-extra-50',
  '../project/samples/kjwwang/parsed-unique-candidates',
  '../project/samples/kjwwang/parsed',
];

function parseArgs(argv) {
  const args = {
    inputs: DEFAULT_INPUTS.join(','),
    env: '../JHSComputer_Server/.env',
    dryRun: false,
    reset: false,
  };
  for (const rawArg of argv) {
    const normalizedArg = rawArg.replace(/^--/, '');
    const separatorIndex = normalizedArg.indexOf('=');
    const key = separatorIndex >= 0 ? normalizedArg.slice(0, separatorIndex) : normalizedArg;
    const value = separatorIndex >= 0 ? normalizedArg.slice(separatorIndex + 1) : 'true';
    if (key === 'inputs') args.inputs = value;
    if (key === 'env') args.env = value;
    if (key === 'dry-run') args.dryRun = value !== 'false';
    if (key === 'reset') args.reset = value !== 'false';
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

async function readParsedBuilds(inputDirs) {
  const seen = new Set();
  const builds = [];
  for (const inputDir of inputDirs) {
    const dir = path.resolve(inputDir);
    const files = await readdir(dir).catch(() => []);
    for (const file of files.filter((name) => /^estimate_.*\.json$/.test(name))) {
      const build = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
      if (!build.estimateId || seen.has(build.estimateId)) continue;
      seen.add(build.estimateId);
      builds.push(build);
    }
  }
  return builds;
}

function clean(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function slug(value = '') {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function shortCpu(name = '') {
  const patterns = [
    /([0-9]{4,5}X3D)/i,
    /([0-9]{4,5}KF)/i,
    /([0-9]{4,5}K)/i,
    /([0-9]{4,5}F)/i,
    /([0-9]{4,5}G?T?)/i,
    /울트라\d\s*시리즈2\s*\d+K(?:F)?(?:\s*Plus)?/i,
    /i[3579]-?\d{4,5}[A-Z]*/i,
  ];
  for (const pattern of patterns) {
    const match = name.match(pattern);
    if (match) return match[0].replace(/\s+/g, ' ');
  }
  return clean(name.split(/[()]/)[0]);
}

function shortGpu(name = '') {
  const match = name.match(/(RTX\s*\d{4}\s*Ti|RTX\s*\d{4}|RX\s*\d{4}\s*XT|RX\s*\d{4}|GTX\s*\d{4}\s*SUPER|GTX\s*\d{4})/i);
  return match ? match[1].replace(/\s+/g, ' ') : clean(name.split(/[()]/)[0]);
}

function partOf(build, category) {
  return build.parts?.find((part) => part.category === category)?.name ?? '';
}

function comboKey(cpuModel, gpuModel) {
  return slug(`${cpuModel} ${gpuModel}`).toUpperCase();
}

function qualityPreset(raw = '') {
  if (raw.includes('미지원')) return 'UNSUPPORTED';
  if (/최상|울트라|풀옵|리마스터|XBOX|PC방|선수/i.test(raw)) return 'ULTRA';
  if (/권장|상옵|높음/i.test(raw)) return 'HIGH';
  if (raw.includes('최상')) return 'ULTRA';
  if (raw.includes('상')) return 'HIGH';
  if (raw.includes('중')) return 'BALANCED';
  if (raw.includes('하')) return 'PERFORMANCE';
  if (raw.includes('미지원')) return 'UNSUPPORTED';
  return 'UNKNOWN';
}

function comfortGrade(fps, playable) {
  if (!playable) return 'UNSUPPORTED';
  if (fps == null) return 'UNKNOWN';
  if (fps >= 144) return 'VERY_SMOOTH';
  if (fps >= 100) return 'SMOOTH';
  if (fps >= 60) return 'PLAYABLE';
  if (fps >= 30) return 'OPTION_TUNING';
  return 'DIFFICULT';
}

function displayRange(fps, playable) {
  if (fps == null || !playable) return { min: null, max: null };
  const spread = fps >= 120 ? 0.1 : fps >= 60 ? 0.08 : 0.12;
  return {
    min: Math.max(1, Math.floor((fps * (1 - spread)) / 5) * 5),
    max: Math.ceil((fps * (1 + spread)) / 5) * 5,
  };
}

function json(value) {
  return value == null ? null : JSON.stringify(value);
}

function buildRows(builds) {
  const rows = [];
  for (const build of builds) {
    const cpuName = partOf(build, 'CPU');
    const mainboardName = partOf(build, 'MAINBOARD');
    const gpuName = partOf(build, 'GPU');
    if (!cpuName || !gpuName) continue;
    const cpuModel = shortCpu(cpuName);
    const gpuModel = shortGpu(gpuName);
    rows.push({
      ...build,
      cpuName,
      mainboardName,
      gpuName,
      cpuModel,
      gpuModel,
      comboKey: comboKey(cpuModel, gpuModel),
    });
  }
  return rows;
}

function buildStats(rows) {
  const games = new Set();
  const combos = new Set();
  let fpsRecords = 0;
  for (const build of rows) {
    combos.add(build.comboKey);
    for (const game of build.games ?? []) {
      games.add(game.gameName);
      fpsRecords += Object.keys(game.resolutions ?? {}).length;
    }
  }
  return {
    builds: rows.length,
    uniqueCombos: combos.size,
    games: games.size,
    fpsRecords,
  };
}

async function ensureSchema(connection, reset) {
  if (reset) {
    await connection.query('SET FOREIGN_KEY_CHECKS=0');
    for (const table of ['benchmark_combo_game_results', 'benchmark_fps_results', 'benchmark_build_parts', 'benchmark_builds', 'benchmark_games', 'benchmark_sources']) {
      await connection.query(`DROP TABLE IF EXISTS ${table}`);
    }
    await connection.query('SET FOREIGN_KEY_CHECKS=1');
  }

  await connection.query(`
    CREATE TABLE IF NOT EXISTS benchmark_sources (
      BENCHMARK_SOURCE_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
      SOURCE_CODE VARCHAR(50) NOT NULL UNIQUE,
      SOURCE_NAME VARCHAR(100) NOT NULL,
      BASE_URL VARCHAR(255) NULL,
      CREATED_DT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UPDATED_DT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS benchmark_builds (
      BENCHMARK_BUILD_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
      BENCHMARK_SOURCE_ID BIGINT NOT NULL,
      EXTERNAL_BUILD_ID VARCHAR(80) NOT NULL,
      TITLE VARCHAR(255) NOT NULL,
      COMBO_KEY VARCHAR(160) NOT NULL,
      CPU_NAME VARCHAR(255) NOT NULL,
      CPU_MODEL VARCHAR(100) NOT NULL,
      MAINBOARD_NAME VARCHAR(255) NULL,
      GPU_NAME VARCHAR(255) NOT NULL,
      GPU_MODEL VARCHAR(100) NOT NULL,
      GAME_COUNT INT NOT NULL DEFAULT 0,
      FPS_RECORD_COUNT INT NOT NULL DEFAULT 0,
      RAW_JSON JSON NULL,
      CREATED_DT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UPDATED_DT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY UK_BENCHMARK_BUILD_SOURCE_EXTERNAL (BENCHMARK_SOURCE_ID, EXTERNAL_BUILD_ID),
      KEY IDX_BENCHMARK_BUILD_COMBO (COMBO_KEY),
      CONSTRAINT FK_BENCHMARK_BUILD_SOURCE FOREIGN KEY (BENCHMARK_SOURCE_ID) REFERENCES benchmark_sources(BENCHMARK_SOURCE_ID)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS benchmark_build_parts (
      BENCHMARK_BUILD_PART_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
      BENCHMARK_BUILD_ID BIGINT NOT NULL,
      PART_CATEGORY VARCHAR(50) NOT NULL,
      PART_LABEL VARCHAR(80) NULL,
      PART_NAME VARCHAR(255) NOT NULL,
      QUANTITY INT NULL,
      EXTERNAL_PRODUCT_CODE VARCHAR(80) NULL,
      IMAGE_URL VARCHAR(500) NULL,
      SPEC_TEXT TEXT NULL,
      UNIQUE KEY UK_BENCHMARK_BUILD_PART (BENCHMARK_BUILD_ID, PART_CATEGORY, PART_NAME),
      CONSTRAINT FK_BENCHMARK_BUILD_PART_BUILD FOREIGN KEY (BENCHMARK_BUILD_ID) REFERENCES benchmark_builds(BENCHMARK_BUILD_ID) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS benchmark_games (
      BENCHMARK_GAME_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
      GAME_NAME VARCHAR(160) NOT NULL,
      SLUG VARCHAR(160) NOT NULL,
      IS_ACTIVE CHAR(1) NOT NULL DEFAULT 'Y',
      CREATED_DT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UPDATED_DT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY UK_BENCHMARK_GAME_NAME (GAME_NAME),
      UNIQUE KEY UK_BENCHMARK_GAME_SLUG (SLUG)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS benchmark_fps_results (
      BENCHMARK_FPS_RESULT_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
      BENCHMARK_BUILD_ID BIGINT NOT NULL,
      BENCHMARK_GAME_ID BIGINT NOT NULL,
      RESOLUTION VARCHAR(20) NOT NULL,
      RAW_OPTION_PRESET VARCHAR(50) NULL,
      NORMALIZED_QUALITY VARCHAR(30) NOT NULL,
      RAW_FPS INT NULL,
      DISPLAY_FPS_MIN INT NULL,
      DISPLAY_FPS_MAX INT NULL,
      COMFORT_GRADE VARCHAR(30) NOT NULL,
      PLAYABLE CHAR(1) NOT NULL DEFAULT 'Y',
      RAW_TEXT VARCHAR(100) NULL,
      UNIQUE KEY UK_BENCHMARK_FPS (BENCHMARK_BUILD_ID, BENCHMARK_GAME_ID, RESOLUTION),
      KEY IDX_BENCHMARK_FPS_GAME_RES (BENCHMARK_GAME_ID, RESOLUTION),
      CONSTRAINT FK_BENCHMARK_FPS_BUILD FOREIGN KEY (BENCHMARK_BUILD_ID) REFERENCES benchmark_builds(BENCHMARK_BUILD_ID) ON DELETE CASCADE,
      CONSTRAINT FK_BENCHMARK_FPS_GAME FOREIGN KEY (BENCHMARK_GAME_ID) REFERENCES benchmark_games(BENCHMARK_GAME_ID)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS benchmark_combo_game_results (
      BENCHMARK_COMBO_GAME_RESULT_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
      COMBO_KEY VARCHAR(160) NOT NULL,
      CPU_MODEL VARCHAR(100) NOT NULL,
      GPU_MODEL VARCHAR(100) NOT NULL,
      BENCHMARK_GAME_ID BIGINT NOT NULL,
      RESOLUTION VARCHAR(20) NOT NULL,
      SAMPLE_COUNT INT NOT NULL,
      RAW_FPS_AVG DECIMAL(8,2) NULL,
      RAW_FPS_MIN INT NULL,
      RAW_FPS_MAX INT NULL,
      DISPLAY_FPS_MIN INT NULL,
      DISPLAY_FPS_MAX INT NULL,
      BEST_QUALITY VARCHAR(30) NOT NULL,
      COMFORT_GRADE VARCHAR(30) NOT NULL,
      UPDATED_DT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY UK_BENCHMARK_COMBO_GAME (COMBO_KEY, BENCHMARK_GAME_ID, RESOLUTION),
      KEY IDX_BENCHMARK_COMBO (COMBO_KEY),
      CONSTRAINT FK_BENCHMARK_COMBO_GAME FOREIGN KEY (BENCHMARK_GAME_ID) REFERENCES benchmark_games(BENCHMARK_GAME_ID)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function scalar(connection, sql, params = []) {
  const [rows] = await connection.query(sql, params);
  return rows[0] ? Object.values(rows[0])[0] : null;
}

async function upsertSource(connection) {
  await connection.execute(
    `INSERT INTO benchmark_sources (SOURCE_CODE, SOURCE_NAME, BASE_URL)
     VALUES ('KJWWANG', '견적왕', 'https://kjwwang.com')
     ON DUPLICATE KEY UPDATE SOURCE_NAME=VALUES(SOURCE_NAME), BASE_URL=VALUES(BASE_URL)`,
  );
  return scalar(connection, `SELECT BENCHMARK_SOURCE_ID FROM benchmark_sources WHERE SOURCE_CODE='KJWWANG'`);
}

async function upsertGame(connection, gameName) {
  const gameSlug = slug(gameName);
  await connection.execute(
    `INSERT INTO benchmark_games (GAME_NAME, SLUG)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE GAME_NAME=VALUES(GAME_NAME), UPDATED_DT=NOW()`,
    [gameName, gameSlug],
  );
  return scalar(connection, 'SELECT BENCHMARK_GAME_ID FROM benchmark_games WHERE GAME_NAME = ?', [gameName]);
}

async function upsertBuild(connection, sourceId, build) {
  const fpsRecordCount = (build.games ?? []).reduce((sum, game) => sum + Object.keys(game.resolutions ?? {}).length, 0);
  await connection.execute(
    `INSERT INTO benchmark_builds
      (BENCHMARK_SOURCE_ID, EXTERNAL_BUILD_ID, TITLE, COMBO_KEY, CPU_NAME, CPU_MODEL, MAINBOARD_NAME, GPU_NAME, GPU_MODEL, GAME_COUNT, FPS_RECORD_COUNT, RAW_JSON)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      TITLE=VALUES(TITLE), COMBO_KEY=VALUES(COMBO_KEY), CPU_NAME=VALUES(CPU_NAME), CPU_MODEL=VALUES(CPU_MODEL),
      MAINBOARD_NAME=VALUES(MAINBOARD_NAME), GPU_NAME=VALUES(GPU_NAME), GPU_MODEL=VALUES(GPU_MODEL),
      GAME_COUNT=VALUES(GAME_COUNT), FPS_RECORD_COUNT=VALUES(FPS_RECORD_COUNT), RAW_JSON=VALUES(RAW_JSON), UPDATED_DT=NOW()`,
    [sourceId, build.estimateId, build.title, build.comboKey, build.cpuName, build.cpuModel, build.mainboardName, build.gpuName, build.gpuModel, build.gameCount, fpsRecordCount, json(build)],
  );
  return scalar(connection, 'SELECT BENCHMARK_BUILD_ID FROM benchmark_builds WHERE BENCHMARK_SOURCE_ID = ? AND EXTERNAL_BUILD_ID = ?', [sourceId, build.estimateId]);
}

async function replaceBuildParts(connection, buildId, parts) {
  await connection.execute('DELETE FROM benchmark_build_parts WHERE BENCHMARK_BUILD_ID = ?', [buildId]);
  for (const part of parts ?? []) {
    await connection.execute(
      `INSERT INTO benchmark_build_parts
       (BENCHMARK_BUILD_ID, PART_CATEGORY, PART_LABEL, PART_NAME, QUANTITY, EXTERNAL_PRODUCT_CODE, IMAGE_URL, SPEC_TEXT)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [buildId, part.category, part.label ?? null, part.name, part.quantity ?? null, part.productCode ?? null, part.imageUrl ?? null, part.specText ?? null],
    );
  }
}

async function replaceFpsResults(connection, buildId, build, gameIdCache) {
  await connection.execute('DELETE FROM benchmark_fps_results WHERE BENCHMARK_BUILD_ID = ?', [buildId]);
  for (const game of build.games ?? []) {
    let gameId = gameIdCache.get(game.gameName);
    if (!gameId) {
      gameId = await upsertGame(connection, game.gameName);
      gameIdCache.set(game.gameName, gameId);
    }
    for (const [resolution, result] of Object.entries(game.resolutions ?? {})) {
      const fps = result.fps ?? null;
      const display = displayRange(fps, result.playable);
      await connection.execute(
        `INSERT INTO benchmark_fps_results
         (BENCHMARK_BUILD_ID, BENCHMARK_GAME_ID, RESOLUTION, RAW_OPTION_PRESET, NORMALIZED_QUALITY, RAW_FPS, DISPLAY_FPS_MIN, DISPLAY_FPS_MAX, COMFORT_GRADE, PLAYABLE, RAW_TEXT)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          buildId,
          gameId,
          resolution,
          result.optionPreset ?? null,
          qualityPreset(result.optionPreset ?? result.rawText ?? ''),
          fps,
          display.min,
          display.max,
          comfortGrade(fps, result.playable),
          result.playable ? 'Y' : 'N',
          result.rawText ?? null,
        ],
      );
    }
  }
}

async function refreshComboSummary(connection) {
  await connection.execute('DELETE FROM benchmark_combo_game_results');
  await connection.execute(`
    INSERT INTO benchmark_combo_game_results
      (COMBO_KEY, CPU_MODEL, GPU_MODEL, BENCHMARK_GAME_ID, RESOLUTION, SAMPLE_COUNT, RAW_FPS_AVG, RAW_FPS_MIN, RAW_FPS_MAX, DISPLAY_FPS_MIN, DISPLAY_FPS_MAX, BEST_QUALITY, COMFORT_GRADE)
    SELECT
      b.COMBO_KEY,
      MIN(b.CPU_MODEL),
      MIN(b.GPU_MODEL),
      r.BENCHMARK_GAME_ID,
      r.RESOLUTION,
      COUNT(*),
      AVG(r.RAW_FPS),
      MIN(r.RAW_FPS),
      MAX(r.RAW_FPS),
      MIN(r.DISPLAY_FPS_MIN),
      MAX(r.DISPLAY_FPS_MAX),
      SUBSTRING_INDEX(GROUP_CONCAT(r.NORMALIZED_QUALITY ORDER BY FIELD(r.NORMALIZED_QUALITY, 'ULTRA', 'HIGH', 'BALANCED', 'PERFORMANCE', 'UNSUPPORTED', 'UNKNOWN')), ',', 1),
      SUBSTRING_INDEX(GROUP_CONCAT(r.COMFORT_GRADE ORDER BY FIELD(r.COMFORT_GRADE, 'VERY_SMOOTH', 'SMOOTH', 'PLAYABLE', 'OPTION_TUNING', 'DIFFICULT', 'UNSUPPORTED', 'UNKNOWN')), ',', 1)
    FROM benchmark_fps_results r
    JOIN benchmark_builds b ON b.BENCHMARK_BUILD_ID = r.BENCHMARK_BUILD_ID
    GROUP BY b.COMBO_KEY, r.BENCHMARK_GAME_ID, r.RESOLUTION
  `);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputDirs = args.inputs.split(',').map((item) => item.trim()).filter(Boolean);
  const builds = buildRows(await readParsedBuilds(inputDirs));
  const stats = buildStats(builds);
  console.log(`[benchmark] loaded ${JSON.stringify(stats)}`);
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

  await ensureSchema(connection, args.reset);
  const sourceId = await upsertSource(connection);
  const gameIdCache = new Map();
  let synced = 0;
  for (const build of builds) {
    const buildId = await upsertBuild(connection, sourceId, build);
    await replaceBuildParts(connection, buildId, build.parts);
    await replaceFpsResults(connection, buildId, build, gameIdCache);
    synced += 1;
    if (synced % 20 === 0) console.log(`[benchmark] synced ${synced}/${builds.length}`);
  }
  await refreshComboSummary(connection);
  const summary = {
    builds: await scalar(connection, 'SELECT COUNT(*) FROM benchmark_builds'),
    combos: await scalar(connection, 'SELECT COUNT(DISTINCT COMBO_KEY) FROM benchmark_builds'),
    games: await scalar(connection, 'SELECT COUNT(*) FROM benchmark_games'),
    fpsResults: await scalar(connection, 'SELECT COUNT(*) FROM benchmark_fps_results'),
    comboGameResults: await scalar(connection, 'SELECT COUNT(*) FROM benchmark_combo_game_results'),
  };
  await connection.end();
  console.log(`[benchmark] done ${JSON.stringify(summary)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
