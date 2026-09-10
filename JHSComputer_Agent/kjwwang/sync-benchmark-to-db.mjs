/**
 * kjwwang_md.md 게임 벤치마크 → DB 동기화
 * 견적왕.com에서 복사한 마크다운 파일을 파싱해 benchmark 테이블에 upsert
 *
 * 사용법: node sync-benchmark-to-db.mjs [--md=../../kjwwang_md.md] [--import-source-reported]
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

const envPath = path.resolve('../JHSComputer_Server/.env');
dotenv.config({ path: envPath });

const DB_CONFIG = {
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USERNAME ?? 'jhs_dev',
  password: process.env.DB_PASSWORD ?? 'hollywood',
  database: process.env.DB_DATABASE ?? 'jhs_computer_dev',
  charset: 'utf8mb4',
};

const SOURCE_CODE = 'KJWWANG';

/**
 * 테이블 파싱: "번호\t게임\t평균프레임\t옵션단계\tFHD해상도\tQHD해상도\tUHD해상도"
 * Returns [{gameNo, gameName, avgFps, optionStage, fhd, qhd, uhd}].
 *
 * The three resolution columns in this source are support/quality notes, not
 * three independent FPS measurements. The importer deliberately keeps those
 * notes in RAW_TEXT and creates one source-reported FPS row per game.
 */
function parseGameTable(mdText) {
  const lines = mdText.split(/\r?\n/);
  const headerIdx = lines.findIndex(l => l.includes('번호') && l.includes('게임') && l.includes('평균프레임'));
  if (headerIdx === -1) throw new Error('게임 테이블 헤더를 찾을 수 없습니다');

  const games = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = line.split('\t');
    if (cols.length < 7) continue;
    const [no, name, fpsRaw, optionStage, fhd, qhd, uhd] = cols;
    const gameNo = parseInt(no, 10);
    if (isNaN(gameNo)) continue;

    const fpsMatch = fpsRaw.match(/(\d+)\s*FPS/i);
    const avgFps = fpsMatch ? parseInt(fpsMatch[1], 10) : null;

    games.push({ gameNo, gameName: name.trim(), avgFps, optionStage: optionStage.trim(), fhd: fhd.trim(), qhd: qhd.trim(), uhd: uhd.trim() });
  }
  return games;
}

/**
 * 지원 텍스트에서 NORMALIZED_QUALITY 추출
 * "최상옵까지 지원" → "ULTRA", "상옵까지 지원" → "HIGH", "중옵까지 지원" → "MEDIUM"
 */
function normalizeQuality(supportText) {
  if (!supportText) return 'UNKNOWN';
  if (supportText.includes('최상') || supportText.includes('풀옵') || supportText.includes('울트라')) return 'ULTRA';
  if (supportText.includes('상옵') || supportText.includes('상까지')) return 'HIGH';
  if (supportText.includes('중옵') || supportText.includes('중까지')) return 'MEDIUM';
  return 'LOW';
}

function comfortGrade(fps) {
  if (fps === null) return '지원';
  if (fps >= 144) return '쾌적';
  if (fps >= 100) return '좋음';
  if (fps >= 60) return '보통';
  if (fps >= 30) return '플레이 가능';
  return '비추천';
}

function slugify(name) {
  return name.toLowerCase()
    .replace(/[:\(\)\[\]&®™✓，。/\\]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 140);
}

async function main() {
  const args = process.argv.slice(2);
  const importSourceReported = args.includes('--import-source-reported');
  const mdArg = args.find(a => a.startsWith('--md='));
  const mdPath = mdArg ? path.resolve(mdArg.replace('--md=', '')) : path.resolve('../../kjwwang_md.md');

  console.log(`[sync] 파일: ${mdPath}`);
  const mdText = await readFile(mdPath, 'utf8');
  const games = parseGameTable(mdText);
  console.log(`[sync] 파싱된 게임 수: ${games.length}`);

  const conn = await mysql.createConnection(DB_CONFIG);
  console.log(`[sync] DB 연결 성공 (${DB_CONFIG.database})`);

  // 1. benchmark_sources 확인
  const [[sourceRow]] = await conn.execute(
    'SELECT BENCHMARK_SOURCE_ID FROM benchmark_sources WHERE SOURCE_CODE = ?',
    [SOURCE_CODE],
  );
  if (!sourceRow) {
    await conn.execute(
      `INSERT INTO benchmark_sources (SOURCE_CODE, SOURCE_NAME, BASE_URL)
       VALUES (?, '견적왕', 'https://kjwwang.com')`,
      [SOURCE_CODE],
    );
  }
  const [[srcRow]] = await conn.execute(
    'SELECT BENCHMARK_SOURCE_ID FROM benchmark_sources WHERE SOURCE_CODE = ?',
    [SOURCE_CODE],
  );
  const sourceId = srcRow.BENCHMARK_SOURCE_ID;

  // 2. benchmark_build upsert (라이젠7 9800X3D + RX 9070 XT)
  const buildKey = 'kjwwang-9800x3d-rx9070xt';
  const buildTitle = 'AMD 라이젠7 9800X3D + RX 9070 XT 16GB';
  await conn.execute(
    `INSERT INTO benchmark_builds
       (BENCHMARK_SOURCE_ID, EXTERNAL_BUILD_ID, TITLE, COMBO_KEY,
        CPU_NAME, CPU_MODEL, GPU_NAME, GPU_MODEL, GAME_COUNT, FPS_RECORD_COUNT, RAW_JSON)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       TITLE=VALUES(TITLE), GAME_COUNT=VALUES(GAME_COUNT),
      FPS_RECORD_COUNT=VALUES(FPS_RECORD_COUNT), UPDATED_DT=NOW()`,
    [
      sourceId, buildKey, buildTitle, buildKey,
      'AMD 라이젠7 9800X3D', 'ryzen7-9800x3d',
      'AMD Radeon RX 9070 XT 16GB', 'rx9070xt',
      games.length, importSourceReported ? games.filter((game) => game.avgFps !== null).length : 0,
      JSON.stringify({ source: 'kjwwang_md.md', parsedAt: new Date().toISOString() }),
    ],
  );
  const [[buildRow]] = await conn.execute(
    'SELECT BENCHMARK_BUILD_ID FROM benchmark_builds WHERE EXTERNAL_BUILD_ID = ?',
    [buildKey],
  );
  const buildId = buildRow.BENCHMARK_BUILD_ID;
  console.log(`[sync] benchmark_builds ID: ${buildId}`);

  // 이전 버전은 한 평균값을 FHD/QHD/UHD에 복제했다. 이 빌드의 FPS 원본을
  // 재동기화할 때 기존 3배 행을 먼저 지워야 가공 결과에도 복제값이 남지 않는다.
  await conn.execute('DELETE FROM benchmark_fps_results WHERE BENCHMARK_BUILD_ID = ?', [buildId]);

  if (!importSourceReported) {
    await conn.execute('DELETE FROM benchmark_combo_game_results WHERE COMBO_KEY = ?', [buildKey]);
    await conn.execute('UPDATE benchmark_builds SET FPS_RECORD_COUNT = 0 WHERE BENCHMARK_BUILD_ID = ?', [buildId]);
    await conn.end();
    console.log('[sync] 원본 표의 평균 FPS는 해상도별 측정값이 아니므로 FPS 행을 만들지 않았습니다.');
    console.log('[sync] 이 값을 명시적으로 source-reported로 가져오려면 --import-source-reported를 사용하세요.');
    return;
  }

  // 3. 게임별 upsert
  let insertedGames = 0, insertedFps = 0;

  for (const game of games) {
    const slug = `kjwwang-${slugify(game.gameName)}`;

    // benchmark_games upsert (GAME_NAME과 SLUG 모두 unique → 둘 다 업데이트)
    await conn.execute(
      `INSERT INTO benchmark_games (GAME_NAME, SLUG, IS_ACTIVE)
       VALUES (?, ?, 'Y')
       ON DUPLICATE KEY UPDATE GAME_NAME=VALUES(GAME_NAME), SLUG=VALUES(SLUG), IS_ACTIVE='Y'`,
      [game.gameName, slug],
    );
    const [[gameRow]] = await conn.execute(
      'SELECT BENCHMARK_GAME_ID FROM benchmark_games WHERE GAME_NAME = ?',
      [game.gameName],
    );
    const gameId = gameRow.BENCHMARK_GAME_ID;
    insertedGames++;

    // FHD/QHD/UHD는 지원 옵션 설명일 뿐 FPS 측정값이 아니므로 FHD 한 행만
    // 저장한다. 해상도별 독립값이 없다는 사실은 API/UI의 근거 문구로 표시한다.
    const quality = normalizeQuality(game.fhd || game.qhd || game.uhd);
    const fps = game.avgFps;
    const grade = comfortGrade(fps);
    const rawText = [
      game.optionStage,
      `FHD ${game.fhd}`,
      `QHD ${game.qhd}`,
      `UHD ${game.uhd}`,
      '해상도별 독립 FPS 측정값 없음',
    ].filter(Boolean).join(' | ').slice(0, 100);

    await conn.execute(
      `INSERT INTO benchmark_fps_results
         (BENCHMARK_BUILD_ID, BENCHMARK_GAME_ID, RESOLUTION,
          RAW_OPTION_PRESET, NORMALIZED_QUALITY,
          RAW_FPS, DISPLAY_FPS_MIN, DISPLAY_FPS_MAX,
          COMFORT_GRADE, PLAYABLE, RAW_TEXT)
       VALUES (?, ?, 'FHD', ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         NORMALIZED_QUALITY=VALUES(NORMALIZED_QUALITY),
         RAW_FPS=VALUES(RAW_FPS), DISPLAY_FPS_MIN=VALUES(DISPLAY_FPS_MIN),
         DISPLAY_FPS_MAX=VALUES(DISPLAY_FPS_MAX),
         COMFORT_GRADE=VALUES(COMFORT_GRADE), PLAYABLE=VALUES(PLAYABLE), RAW_TEXT=VALUES(RAW_TEXT)`,
      [buildId, gameId, game.optionStage, quality,
       fps, fps, fps, grade, fps !== null && fps >= 30 ? 'Y' : 'N', rawText],
    );
    insertedFps++;

    if (insertedGames % 30 === 0) {
      console.log(`  [진행] ${insertedGames}/${games.length} 게임 처리됨`);
    }
  }

  const comboRows = await syncComboResults(conn, {
    buildId,
    comboKey: buildKey,
    cpuModel: 'ryzen7-9800x3d',
    gpuModel: 'rx9070xt',
  });

  await conn.end();
  console.log(`\n[sync] 완료 — 게임 ${insertedGames}개, FPS레코드 ${insertedFps}건, combo집계 ${comboRows}건`);
}

async function syncComboResults(conn, { buildId, comboKey, cpuModel, gpuModel }) {
  const [rows] = await conn.execute(
    `SELECT BENCHMARK_GAME_ID AS gameId,
            RESOLUTION AS resolution,
            COUNT(RAW_FPS) AS sampleCount,
            AVG(RAW_FPS) AS rawFpsAvg,
            MIN(RAW_FPS) AS rawFpsMin,
            MAX(RAW_FPS) AS rawFpsMax,
            MIN(DISPLAY_FPS_MIN) AS displayFpsMin,
            MAX(DISPLAY_FPS_MAX) AS displayFpsMax,
            MAX(NORMALIZED_QUALITY) AS bestQuality,
            MAX(COMFORT_GRADE) AS comfortGrade
     FROM benchmark_fps_results
     WHERE BENCHMARK_BUILD_ID = ?
     GROUP BY BENCHMARK_GAME_ID, RESOLUTION`,
    [buildId],
  );

  await conn.execute('DELETE FROM benchmark_combo_game_results WHERE COMBO_KEY = ?', [comboKey]);
  for (const row of rows) {
    await conn.execute(
      `INSERT INTO benchmark_combo_game_results
         (COMBO_KEY, CPU_MODEL, GPU_MODEL, BENCHMARK_GAME_ID, RESOLUTION,
          SAMPLE_COUNT, RAW_FPS_AVG, RAW_FPS_MIN, RAW_FPS_MAX,
          DISPLAY_FPS_MIN, DISPLAY_FPS_MAX, BEST_QUALITY, COMFORT_GRADE)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         CPU_MODEL=VALUES(CPU_MODEL), GPU_MODEL=VALUES(GPU_MODEL),
         SAMPLE_COUNT=VALUES(SAMPLE_COUNT), RAW_FPS_AVG=VALUES(RAW_FPS_AVG),
         RAW_FPS_MIN=VALUES(RAW_FPS_MIN), RAW_FPS_MAX=VALUES(RAW_FPS_MAX),
         DISPLAY_FPS_MIN=VALUES(DISPLAY_FPS_MIN), DISPLAY_FPS_MAX=VALUES(DISPLAY_FPS_MAX),
         BEST_QUALITY=VALUES(BEST_QUALITY), COMFORT_GRADE=VALUES(COMFORT_GRADE), UPDATED_DT=NOW()`,
      [
        comboKey,
        cpuModel,
        gpuModel,
        row.gameId,
        row.resolution,
        Number(row.sampleCount ?? 0),
        row.rawFpsAvg,
        row.rawFpsMin,
        row.rawFpsMax,
        row.displayFpsMin,
        row.displayFpsMax,
        row.bestQuality ?? 'UNKNOWN',
        row.comfortGrade ?? '지원',
      ],
    );
  }
  return rows.length;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch(err => { console.error(err); process.exitCode = 1; });
}

export { comfortGrade, normalizeQuality, parseGameTable, slugify };
