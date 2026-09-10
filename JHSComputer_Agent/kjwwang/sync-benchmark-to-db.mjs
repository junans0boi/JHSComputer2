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
      games.length, 0,
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

  await conn.execute('DELETE FROM benchmark_combo_game_results WHERE COMBO_KEY = ?', [buildKey]);
  await conn.execute('UPDATE benchmark_builds SET FPS_RECORD_COUNT = 0 WHERE BENCHMARK_BUILD_ID = ?', [buildId]);
  await conn.end();
  console.log('[sync] 원본 표의 평균 FPS는 해상도별 측정값이 아니므로 FPS 행을 만들지 않았습니다.');
  if (importSourceReported) console.log('[sync] --import-source-reported는 안전한 해상도별 원본이 없어 무시했습니다.');
  return;

}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch(err => { console.error(err); process.exitCode = 1; });
}

export { comfortGrade, normalizeQuality, parseGameTable, slugify };
