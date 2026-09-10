/**
 * kjwwang.com 게임별 FPS 벤치마크 크롤러
 * action=detail&game=<id> 페이지에서 CPU/GPU 조합 및 가격대 데이터 수집
 */
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  DEFAULT_COLLECTION_POLICY,
  calculateRequestDelay,
  planIncrementalTargets,
} from './incremental-collection.mjs';

const BASE_URL = 'https://kjwwang.com';
const HOME_URL = `${BASE_URL}/`;

// 주요 게임 목록 (게임ID: 게임명)
const TARGET_GAMES = {
  569: 'APEX 레전드',
  2084: '드래곤볼 스파킹 제로',
  711: 'GTA5',
  2024: '갓 오브 워 라그나로크',
  1668: '검은 신화: 오공',
  430: '검은사막',
  1011: '더 파이널스',
  935: '던전앤파이터',
  1476: '데드 바이 데이라이트',
  1948: 'EA SPORTS FC 25',
  2100: 'Metaphor: ReFantazio',
  1420: '나 혼자만 레벨업: 어라이즈',
  1932: 'NBA 2K25',
  795: 'P의 거짓',
  1164: '그랑블루 판타지 리링크',
  1356: '노 레스트 포 더 위키드',
  1288: '다크 소울 3',
  2344: '셰이프 오브 드림즈',
  422: '월드 오브 워크래프트',
  1464: '고스트 오브 쓰시마',
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function clean(value = '') {
  return value.replace(/\s+/g, ' ').trim();
}

function parseArgs(argv) {
  const args = {
    homeUrl: HOME_URL,
    gameIds: '',
    limit: 10,
    delayMs: DEFAULT_COLLECTION_POLICY.delayMs,
    jitterMs: DEFAULT_COLLECTION_POLICY.jitterMs,
    restEvery: DEFAULT_COLLECTION_POLICY.restEvery,
    restMs: DEFAULT_COLLECTION_POLICY.restMs,
    retry: DEFAULT_COLLECTION_POLICY.maxRetries,
    retryBaseMs: DEFAULT_COLLECTION_POLICY.retryBaseMs,
    refreshAfterMs: DEFAULT_COLLECTION_POLICY.refreshAfterMs,
    force: false,
    out: '../project/samples/kjwwang/benchmarks',
    progress: '',
  };
  for (const rawArg of argv) {
    const normalizedArg = rawArg.replace(/^--/, '');
    const separatorIndex = normalizedArg.indexOf('=');
    const key = separatorIndex >= 0 ? normalizedArg.slice(0, separatorIndex) : normalizedArg;
    const value = separatorIndex >= 0 ? normalizedArg.slice(separatorIndex + 1) : '';
    if (key === 'home-url') args.homeUrl = value || HOME_URL;
    if (key === 'game-ids') args.gameIds = value;
    if (key === 'limit') args.limit = Number(value);
    if (key === 'delay-ms') args.delayMs = Number(value);
    if (key === 'jitter-ms') args.jitterMs = Number(value);
    if (key === 'rest-every') args.restEvery = Number(value);
    if (key === 'rest-ms') args.restMs = Number(value);
    if (key === 'retry') args.retry = Number(value);
    if (key === 'retry-base-ms') args.retryBaseMs = Number(value);
    if (key === 'refresh-after-ms') args.refreshAfterMs = Number(value);
    if (key === 'force') args.force = value !== 'false';
    if (key === 'out') args.out = value;
    if (key === 'progress') args.progress = value;
  }
  return args;
}

function decodeResponse(buffer, contentType) {
  return /euc-kr|ks_c_5601/i.test(contentType)
    ? iconv.decode(buffer, 'euc-kr')
    : iconv.decode(buffer, 'euc-kr'); // kjwwang은 항상 euc-kr
}

async function fetchGamePage(gameId, { etag, lastModified } = {}) {
  const url = `${BASE_URL}/shop/pc_estimate.html?action=detail&game=${gameId}`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9',
    'Accept': 'text/html,application/xhtml+xml',
    'Referer': `${BASE_URL}/shop/pc_estimate.html`,
  };
  if (etag) headers['If-None-Match'] = etag;
  if (lastModified) headers['If-Modified-Since'] = lastModified;
  const response = await fetch(url, {
    headers,
  });
  if (response.status === 304) {
    return { ok: true, notModified: true, status: response.status, html: null, url, etag, lastModified };
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') ?? '';
  return {
    ok: response.ok,
    status: response.status,
    html: decodeResponse(buffer, contentType),
    url,
    etag: response.headers.get('etag') ?? etag ?? null,
    lastModified: response.headers.get('last-modified') ?? lastModified ?? null,
    retryAfter: response.headers.get('retry-after'),
  };
}

async function fetchHome(url, { etag, lastModified } = {}) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9',
    Accept: 'text/html,application/xhtml+xml',
  };
  if (etag) headers['If-None-Match'] = etag;
  if (lastModified) headers['If-Modified-Since'] = lastModified;
  const response = await fetch(url, {
    headers,
  });
  if (response.status === 304) {
    return { ok: true, notModified: true, status: response.status, html: null, etag, lastModified };
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') ?? '';
  return {
    ok: response.ok,
    status: response.status,
    html: decodeResponse(buffer, contentType),
    etag: response.headers.get('etag') ?? etag ?? null,
    lastModified: response.headers.get('last-modified') ?? lastModified ?? null,
    retryAfter: response.headers.get('retry-after'),
  };
}

function extractGameTargets(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const targets = [];
  const seen = new Set();
  $('a[href*="pc_estimate.html"][href*="action=detail"][href*="game="]').each((_, anchor) => {
    const href = $(anchor).attr('href');
    if (!href) return;
    const url = new URL(href.replaceAll('&amp;', '&'), BASE_URL);
    const gameId = Number(url.searchParams.get('game'));
    if (!Number.isInteger(gameId) || seen.has(gameId)) return;
    seen.add(gameId);
    targets.push({ gameId, gameName: clean($(anchor).text()) || TARGET_GAMES[gameId] || `game-${gameId}` });
  });
  return targets;
}

function parseGamePage(html, gameId, fallbackName) {
  // 게임명
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1].trim() : fallbackName;
  const gameName = rawTitle.replace(/\s*사양.*$/i, '').trim() || fallbackName;

  // 최소/권장 사양
  const minSpec = extractSpecSection(html, '최소사양');
  const recSpec = extractSpecSection(html, '권장사양');

  // 해상도별 견적 파싱
  const fhdBuilds = extractBuilds(html, 'FHD');
  const qhdBuilds = extractBuilds(html, 'QHD');
  const uhdBuilds = extractBuilds(html, '4K');

  return {
    gameId,
    gameName,
    minSpec,
    recSpec,
    builds: { FHD: fhdBuilds, QHD: qhdBuilds, '4K': uhdBuilds },
    crawledAt: new Date().toISOString(),
  };
}

function extractSpecSection(html, label) {
  const regex = new RegExp(`${label}[^<]*<\\/h\\d>[\\s\\S]{0,50}<[^>]+>([\\s\\S]{0,500}?)<\\/(?:p|div|td)>`, 'i');
  const m = html.match(regex);
  if (!m) return null;
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractBuilds(html, resolution) {
  const resLabel = resolution === 'FHD' ? 'FHD 해상도' : resolution === 'QHD' ? 'QHD 해상도' : '4K UHD 해상도';
  const idx = html.indexOf(resLabel);
  if (idx < 0) return [];

  // 다음 해상도 섹션 전까지만 처리
  const nextLabels = ['FHD 해상도', 'QHD 해상도', '4K UHD 해상도'].filter(l => l !== resLabel);
  let end = html.length;
  for (const nl of nextLabels) {
    const ni = html.indexOf(nl, idx + 1);
    if (ni > idx && ni < end) end = ni;
  }

  const chunk = html.slice(idx, end);

  const builds = [];
  // <th> 내 tier 이름 추출
  const tierMatches = [...chunk.matchAll(/<th>([^<]+)<\/th>/gi)];

  for (const tierMatch of tierMatches) {
    const tier = tierMatch[1].replace('추천견적서', '').trim();
    const tierStart = tierMatch.index + tierMatch[0].length;
    const nextTier = tierMatches[tierMatches.indexOf(tierMatch) + 1];
    const tierEnd = nextTier ? nextTier.index : chunk.length;
    const cellChunk = chunk.slice(tierStart, tierEnd);

    // <li>인텔 : <a ...>combo</a><span class='price'>가격</span>
    const liMatches = [...cellChunk.matchAll(/<li>([^:]+):\s*<a[^>]*>([^<]+)<\/a><span[^>]*>([^<]+)<\/span>/gi)];
    for (const li of liMatches) {
      const platform = li[1].trim().includes('AMD') || li[2].trim().startsWith('라이젠') ? 'AMD' : 'Intel';
      const combo = li[2].trim();
      const priceRange = li[3].trim();
      builds.push({ tier, platform, combo, priceRange, resolution });
    }
  }
  return builds;
}

function hashContent(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

async function loadCheckpoint(progressPath) {
  try {
    const parsed = JSON.parse(await readFile(progressPath, 'utf8'));
    return {
      version: 1,
      source: 'KJWWANG',
      discoveredTargets: Array.isArray(parsed.discoveredTargets) ? parsed.discoveredTargets : [],
      games: parsed.games && typeof parsed.games === 'object' ? parsed.games : {},
      home: parsed.home && typeof parsed.home === 'object' ? parsed.home : {},
    };
  } catch {
    return { version: 1, source: 'KJWWANG', discoveredTargets: [], games: {}, home: {} };
  }
}

async function saveCheckpoint(progressPath, checkpoint) {
  await mkdir(path.dirname(progressPath), { recursive: true });
  const tempPath = `${progressPath}.tmp-${process.pid}`;
  await writeFile(tempPath, JSON.stringify(checkpoint, null, 2), 'utf8');
  await rename(tempPath, progressPath);
}

async function readStoredGame(outDir, gameId) {
  try {
    return JSON.parse(await readFile(path.join(outDir, `game_${gameId}.json`), 'utf8'));
  } catch {
    return null;
  }
}

function parseRetryAfterMs(value, now = Date.now()) {
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1_000);
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - now) : null;
}

function isRetryableStatus(status) {
  return status === 429 || status >= 500;
}

async function fetchWithRetry(fetcher, entry, args, label) {
  let lastError = null;
  for (let attempt = 0; attempt <= args.retry; attempt += 1) {
    try {
      const result = await fetcher({
        etag: entry?.etag ?? null,
        lastModified: entry?.lastModified ?? null,
      });
      if (!isRetryableStatus(result.status) || attempt >= args.retry) return { ...result, attempts: attempt + 1 };
      const retryAfterMs = parseRetryAfterMs(result.retryAfter);
      const backoffMs = args.retryBaseMs * (2 ** attempt);
      const waitMs = Math.max(retryAfterMs ?? 0, backoffMs);
      console.warn(`[kjwwang] ${label} HTTP ${result.status}; ${waitMs}ms 후 재시도 (${attempt + 1}/${args.retry})`);
      await sleep(waitMs);
    } catch (error) {
      lastError = error;
      if (attempt >= args.retry) break;
      const waitMs = args.retryBaseMs * (2 ** attempt);
      console.warn(`[kjwwang] ${label} 네트워크 오류; ${waitMs}ms 후 재시도 (${attempt + 1}/${args.retry}): ${error.message}`);
      await sleep(waitMs);
    }
  }
  throw lastError ?? new Error(`${label} 요청 실패`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = path.resolve(args.out);
  const progressPath = path.resolve(args.progress || path.join(args.out, 'progress.json'));
  await mkdir(outDir, { recursive: true });
  const checkpoint = await loadCheckpoint(progressPath);

  let targets = [];
  if (args.gameIds) {
    targets = args.gameIds
      .split(',')
      .map(value => Number(value.trim()))
      .filter(Number.isInteger)
      .map(gameId => ({ gameId, gameName: TARGET_GAMES[gameId] || `game-${gameId}` }));
  } else {
    try {
      const home = await fetchWithRetry(
        (conditional) => fetchHome(args.homeUrl, conditional),
        checkpoint.home,
        args,
        '게임 목록',
      );
      if (!home.ok) throw new Error(`게임 목록 HTTP ${home.status}`);
      targets = home.notModified
        ? checkpoint.discoveredTargets
        : extractGameTargets(home.html);
      checkpoint.home = {
        status: 'completed',
        checkedAt: new Date().toISOString(),
        etag: home.etag ?? checkpoint.home.etag ?? null,
        lastModified: home.lastModified ?? checkpoint.home.lastModified ?? null,
      };
      if (!home.notModified) checkpoint.discoveredTargets = targets;
      await saveCheckpoint(progressPath, checkpoint);
      console.log(`[kjwwang] 게임 목록 발견: ${targets.length}개 (HTTP ${home.status})`);
    } catch (err) {
      console.warn(`[kjwwang] 게임 목록 자동 발견 실패: ${err.message}`);
    }
  }
  if (targets.length === 0) throw new Error('게임 목록에서 상세 링크를 찾지 못해 수집을 중단합니다.');
  const plannedTargets = planIncrementalTargets(targets, checkpoint.games, {
    now: Date.now(),
    refreshAfterMs: args.refreshAfterMs,
    limit: args.limit,
    force: args.force,
  });
  console.log(`[kjwwang] 계획: ${plannedTargets.length}개 페이지 (progress=${progressPath})`);

  for (const [i, target] of plannedTargets.entries()) {
    const { gameId, gameName } = target;
    const checkpointKey = String(gameId);
    const previous = checkpoint.games[checkpointKey] ?? {};
    console.log(`[kjwwang] ${i + 1}/${plannedTargets.length} ${target.reason}: ${gameName} (game=${gameId})`);

    try {
      await sleep(calculateRequestDelay({ delayMs: args.delayMs, jitterMs: args.jitterMs }));
      const result = await fetchWithRetry(
        (conditional) => fetchGamePage(gameId, conditional),
        previous,
        args,
        `game=${gameId}`,
      );
      const { ok, status, html } = result;
      if (!ok) {
        console.warn(`  [SKIP] HTTP ${status}`);
        checkpoint.games[checkpointKey] = {
          ...previous,
          status: 'failed',
          lastStatus: status,
          checkedAt: new Date().toISOString(),
          attempts: result.attempts,
        };
        await saveCheckpoint(progressPath, checkpoint);
        continue;
      }
      const parsed = result.notModified
        ? await readStoredGame(outDir, gameId)
        : parseGamePage(html, gameId, gameName);
      if (!parsed) throw new Error('304 응답이지만 저장된 게임 JSON을 찾지 못했습니다.');

      const filename = `game_${gameId}.json`;
      if (!result.notModified) {
        await writeFile(path.join(outDir, filename), JSON.stringify(parsed, null, 2), 'utf8');
      }
      checkpoint.games[checkpointKey] = {
        ...previous,
        status: 'completed',
        checkedAt: new Date().toISOString(),
        etag: result.etag ?? previous.etag ?? null,
        lastModified: result.lastModified ?? previous.lastModified ?? null,
        contentHash: result.notModified ? previous.contentHash ?? null : hashContent(html),
        outputFile: filename,
        attempts: result.attempts,
      };
      await saveCheckpoint(progressPath, checkpoint);
      console.log(`  [OK] 견적 수집: FHD=${parsed.builds.FHD.length} QHD=${parsed.builds.QHD.length} 4K=${parsed.builds['4K'].length}`);
    } catch (err) {
      console.error(`  [ERR] ${err.message}`);
      checkpoint.games[checkpointKey] = {
        ...previous,
        status: 'failed',
        checkedAt: new Date().toISOString(),
        error: err.message,
      };
      await saveCheckpoint(progressPath, checkpoint);
    }

    if (i < plannedTargets.length - 1 && args.restEvery > 0 && (i + 1) % args.restEvery === 0) {
      console.log(`[kjwwang] ${args.restMs}ms 휴식`);
      await sleep(args.restMs);
    }
  }

  const allResults = [];
  for (const target of targets) {
    const stored = await readStoredGame(outDir, target.gameId);
    if (stored) allResults.push(stored);
  }
  await writeFile(
    path.join(outDir, 'summary.json'),
    JSON.stringify({
      crawledAt: new Date().toISOString(),
      requestedGames: targets.length,
      plannedGames: plannedTargets.length,
      totalGames: allResults.length,
      progressFile: progressPath,
      games: allResults.map(r => ({ gameId: r.gameId, gameName: r.gameName, buildCounts: Object.fromEntries(Object.entries(r.builds).map(([k, v]) => [k, v.length])) })),
    }, null, 2),
    'utf8',
  );

  console.log(`\n[kjwwang] 완료 — ${allResults.length}개 게임 데이터 수집 → ${outDir}`);
}

main().catch(err => { console.error(err); process.exitCode = 1; });
