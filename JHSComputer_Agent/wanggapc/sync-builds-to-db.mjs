import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

function parseArgs(argv) {
  const args = { input: '../project/samples/wanggapc/parsed-30', env: '../JHSComputer_Server/.env', dryRun: false };
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

async function scalar(connection, sql, params = []) {
  const [rows] = await connection.query(sql, params);
  return rows[0] ? Object.values(rows[0])[0] : null;
}

function json(value) {
  return value == null ? null : JSON.stringify(value);
}

async function readBuilds(input) {
  const dir = path.resolve(input);
  const files = (await readdir(dir)).filter((file) => /^wanggapc_.*\.json$/.test(file));
  const builds = [];
  const seen = new Set();
  for (const file of files) {
    const build = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
    if (!build.externalBuildId || !build.comboKey || build.comboKey.includes('선택해주세요')) continue;
    if (seen.has(build.externalBuildId)) continue;
    seen.add(build.externalBuildId);
    builds.push(build);
  }
  return builds;
}

async function ensureSource(connection) {
  await connection.execute(
    `INSERT INTO benchmark_sources (SOURCE_CODE, SOURCE_NAME, BASE_URL)
     VALUES ('WANGGAPC', '왕가PC', 'https://wanggapc.com')
     ON DUPLICATE KEY UPDATE SOURCE_NAME=VALUES(SOURCE_NAME), BASE_URL=VALUES(BASE_URL)`,
  );
  return scalar(connection, `SELECT BENCHMARK_SOURCE_ID FROM benchmark_sources WHERE SOURCE_CODE='WANGGAPC'`);
}

async function upsertBuild(connection, sourceId, build) {
  await connection.execute(
    `INSERT INTO benchmark_builds
      (BENCHMARK_SOURCE_ID, EXTERNAL_BUILD_ID, TITLE, COMBO_KEY, CPU_NAME, CPU_MODEL, MAINBOARD_NAME, GPU_NAME, GPU_MODEL, GAME_COUNT, FPS_RECORD_COUNT, RAW_JSON)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)
     ON DUPLICATE KEY UPDATE
      TITLE=VALUES(TITLE), COMBO_KEY=VALUES(COMBO_KEY), CPU_NAME=VALUES(CPU_NAME), CPU_MODEL=VALUES(CPU_MODEL),
      MAINBOARD_NAME=VALUES(MAINBOARD_NAME), GPU_NAME=VALUES(GPU_NAME), GPU_MODEL=VALUES(GPU_MODEL), RAW_JSON=VALUES(RAW_JSON), UPDATED_DT=NOW()`,
    [
      sourceId,
      build.externalBuildId,
      build.title,
      build.comboKey,
      build.cpuName,
      build.cpuModel,
      build.parts.find((part) => part.category === 'MAINBOARD')?.name ?? null,
      build.gpuName,
      build.gpuModel,
      json(build),
    ],
  );
  return scalar(connection, 'SELECT BENCHMARK_BUILD_ID FROM benchmark_builds WHERE BENCHMARK_SOURCE_ID = ? AND EXTERNAL_BUILD_ID = ?', [sourceId, build.externalBuildId]);
}

async function replaceParts(connection, buildId, parts) {
  await connection.execute('DELETE FROM benchmark_build_parts WHERE BENCHMARK_BUILD_ID = ?', [buildId]);
  for (const part of parts ?? []) {
    await connection.execute(
      `INSERT INTO benchmark_build_parts
       (BENCHMARK_BUILD_ID, PART_CATEGORY, PART_LABEL, PART_NAME, PART_PRICE, QUANTITY, EXTERNAL_PRODUCT_CODE, IMAGE_URL, SPEC_TEXT)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        buildId,
        part.category,
        part.label ?? null,
        part.name,
        Number.isFinite(part.price) ? part.price : null,
        1,
        part.externalProductCode ?? null,
        part.imageUrl ?? null,
        part.specText ?? null,
      ],
    );
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const builds = await readBuilds(args.input);
  const uniqueCombos = new Set(builds.map((build) => build.comboKey)).size;
  console.log(`[wanggapc-db] loaded builds=${builds.length} uniqueCombos=${uniqueCombos}`);
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
  for (const build of builds) {
    const buildId = await upsertBuild(connection, sourceId, build);
    await replaceParts(connection, buildId, build.parts);
    synced += 1;
  }
  const summary = {
    sourceBuilds: await scalar(connection, `SELECT COUNT(*) FROM benchmark_builds WHERE BENCHMARK_SOURCE_ID = ?`, [sourceId]),
    totalBuilds: await scalar(connection, 'SELECT COUNT(*) FROM benchmark_builds'),
    totalCombos: await scalar(connection, 'SELECT COUNT(DISTINCT COMBO_KEY) FROM benchmark_builds'),
  };
  await connection.end();
  console.log(`[wanggapc-db] done synced=${synced} ${JSON.stringify(summary)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
