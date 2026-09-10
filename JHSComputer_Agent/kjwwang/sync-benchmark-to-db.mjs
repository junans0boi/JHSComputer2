/**
 * Legacy compatibility helpers for the old kjwwang_md.md importer.
 *
 * The old Markdown file contains support prose, not per-resolution FPS
 * measurements. The mutating importer was intentionally removed after the
 * estimate-detail HTML importer became the single KJWWANG write path.
 * Use sync-estimate-pages-to-db.mjs for numeric FPS observations.
 */
import { fileURLToPath } from 'node:url';

/**
 * Parse the legacy tab-separated game table without treating its support
 * notes as independent FHD/QHD/UHD measurements.
 */
function parseGameTable(mdText) {
  const lines = mdText.split(/\r?\n/);
  const headerIdx = lines.findIndex((line) => line.includes('번호') && line.includes('게임') && line.includes('평균프레임'));
  if (headerIdx === -1) throw new Error('게임 테이블 헤더를 찾을 수 없습니다');

  const games = [];
  for (let index = headerIdx + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) continue;
    const columns = line.split('\t');
    if (columns.length < 7) continue;
    const [no, name, fpsRaw, optionStage, fhd, qhd, uhd] = columns;
    const gameNo = Number.parseInt(no, 10);
    if (Number.isNaN(gameNo)) continue;

    const fpsMatch = fpsRaw.match(/(\d+)\s*FPS/i);
    games.push({
      gameNo,
      gameName: name.trim(),
      avgFps: fpsMatch ? Number.parseInt(fpsMatch[1], 10) : null,
      optionStage: optionStage.trim(),
      fhd: fhd.trim(),
      qhd: qhd.trim(),
      uhd: uhd.trim(),
    });
  }
  return games;
}

function normalizeQuality(supportText) {
  if (!supportText) return 'UNKNOWN';
  if (/최상|풀옵|울트라/.test(supportText)) return 'ULTRA';
  if (/상옵|상까지/.test(supportText)) return 'HIGH';
  if (/중옵|중까지/.test(supportText)) return 'MEDIUM';
  return 'LOW';
}

function comfortGrade(fps) {
  if (fps === null || fps === undefined || !Number.isFinite(Number(fps))) return '지원';
  if (fps >= 144) return '쾌적';
  if (fps >= 100) return '좋음';
  if (fps >= 60) return '보통';
  if (fps >= 30) return '플레이 가능';
  return '비추천';
}

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[:\(\)\[\]&®™✓，。/\\]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 140);
}

async function main() {
  console.error('[sync] legacy Markdown importer is disabled; use sync-estimate-pages-to-db.mjs');
  process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { comfortGrade, normalizeQuality, parseGameTable, slugify };
