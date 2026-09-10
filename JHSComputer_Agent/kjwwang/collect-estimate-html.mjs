import * as cheerio from 'cheerio';
import { createHash } from 'node:crypto';
import iconv from 'iconv-lite';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://kjwwang.com';

function parseArgs(argv) {
  const args = {
    seedFile: 'data/pc_estimate.html',
    urls: '',
    fromId: null,
    toId: null,
    limit: 30,
    delayMs: 6000,
    jitterMs: 2000,
    restEvery: 5,
    restMs: 30000,
    retry: 3,
    backoffMs: 3000,
    progress: '',
    out: '../project/samples/kjwwang/html',
  };
  for (const rawArg of argv) {
    const normalizedArg = rawArg.replace(/^--/, '');
    const separatorIndex = normalizedArg.indexOf('=');
    const key = separatorIndex >= 0 ? normalizedArg.slice(0, separatorIndex) : normalizedArg;
    const value = separatorIndex >= 0 ? normalizedArg.slice(separatorIndex + 1) : '';
    if (key === 'seed-file') args.seedFile = value;
    if (key === 'urls') args.urls = value;
    if (key === 'from-id') args.fromId = Number(value);
    if (key === 'to-id') args.toId = Number(value);
    if (key === 'limit') args.limit = Number(value);
    if (key === 'delay-ms') args.delayMs = Number(value);
    if (key === 'jitter-ms') args.jitterMs = Number(value);
    if (key === 'rest-every') args.restEvery = Number(value);
    if (key === 'rest-ms') args.restMs = Number(value);
    if (key === 'retry') args.retry = Number(value);
    if (key === 'backoff-ms') args.backoffMs = Number(value);
    if (key === 'progress') args.progress = value;
    if (key === 'out') args.out = value;
  }
  return args;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timestampForPath(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
}

function normalizeUrl(value) {
  if (!value) return null;
  const decoded = value.replaceAll('&amp;', '&');
  if (decoded.startsWith('http')) return decoded;
  return new URL(decoded, BASE_URL).toString();
}

function estimateIdFromUrl(url) {
  return new URL(url).searchParams.get('es_sn');
}

export function buildEstimateUrls({ fromId, toId, baseUrl = BASE_URL } = {}) {
  if (!Number.isInteger(fromId) || !Number.isInteger(toId)) return [];
  const step = fromId >= toId ? -1 : 1;
  const urls = [];
  for (let id = fromId; step < 0 ? id >= toId : id <= toId; id += step) {
    urls.push(`${baseUrl}/shop/pc_estimate.html?action=view&es_sn=${id}`);
  }
  return urls;
}

async function fetchHtml(url, args) {
  let lastError = null;
  for (let attempt = 0; attempt <= args.retry; attempt += 1) {
    let retryAfterMs = 0;
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9',
          Referer: `${BASE_URL}/shop/pc_estimate.html`,
          'User-Agent': 'JHSComputerBenchmarkCollector/0.1 (+local development; polite sample collector)',
        },
      });
      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get('content-type') ?? '';
      const html = /euc-kr|ks_c_5601/i.test(contentType) ? iconv.decode(buffer, 'euc-kr') : buffer.toString('utf8');
      const result = {
        ok: response.ok,
        status: response.status,
        html,
        contentHash: createHash('sha256').update(buffer).digest('hex'),
        attempts: attempt + 1,
      };
      const retryableStatus = response.status === 429 || (response.status >= 500 && response.status <= 599);
      if (response.ok || !retryableStatus || attempt >= args.retry) return result;

      const retryAfter = Number(response.headers.get('retry-after'));
      retryAfterMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : 0;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      if (attempt >= args.retry) {
        return {
          ok: false,
          status: 0,
          html: '',
          contentHash: createHash('sha256').update('').digest('hex'),
          attempts: attempt + 1,
          error: lastError,
        };
      }
    }

    const exponentialMs = Math.min(120000, args.backoffMs * (2 ** attempt));
    const waitMs = Math.max(retryAfterMs, exponentialMs);
    console.warn(`[kjwwang] retry ${attempt + 1}/${args.retry} reason=${lastError} waitMs=${waitMs}`);
    await sleep(waitMs);
  }
}

async function extractUrls(args) {
  const urls = new Set();
  for (const url of args.urls.split(',').map((item) => item.trim()).filter(Boolean)) {
    urls.add(normalizeUrl(url));
  }

  const seedHtml = await readFile(path.resolve(args.seedFile), 'utf8').catch(() => '');
  if (seedHtml) {
    const $ = cheerio.load(seedHtml, { decodeEntities: false });
    $('a[href*="pc_estimate.html"][href*="action=view"][href*="es_sn="]').each((_, anchor) => {
      const url = normalizeUrl($(anchor).attr('href'));
      if (url) urls.add(url);
    });
  }

  const rangeUrls = buildEstimateUrls({ fromId: args.fromId, toId: args.toId });
  rangeUrls.forEach((url) => urls.add(url));
  const collected = [...urls].filter(Boolean);
  return args.limit > 0 ? collected.slice(0, args.limit) : collected;
}

async function loadProgress(progressPath) {
  if (!progressPath) return { completed: {}, failed: {}, runDir: null };
  try {
    const parsed = JSON.parse(await readFile(progressPath, 'utf8'));
    return {
      completed: parsed.completed && typeof parsed.completed === 'object' ? parsed.completed : {},
      failed: parsed.failed && typeof parsed.failed === 'object' ? parsed.failed : {},
      runDir: parsed.runDir ?? null,
    };
  } catch {
    return { completed: {}, failed: {}, runDir: null };
  }
}

async function saveProgress(progressPath, progress) {
  if (!progressPath) return;
  await mkdir(path.dirname(progressPath), { recursive: true });
  const tempPath = `${progressPath}.tmp-${process.pid}`;
  await writeFile(tempPath, JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }, null, 2), 'utf8');
  await rename(tempPath, progressPath);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const urls = await extractUrls(args);
  const progressPath = path.resolve(args.progress || path.join(args.out, '_estimate-progress.json'));
  const progress = await loadProgress(progressPath);
  const runDir = progress.runDir ? path.resolve(progress.runDir) : path.resolve(args.out, timestampForPath());
  await mkdir(runDir, { recursive: true });
  progress.runDir = runDir;
  const results = [];

  for (const [index, url] of urls.entries()) {
    const estimateId = estimateIdFromUrl(url);
    if (estimateId && progress.completed[estimateId]) continue;
    console.log(`[kjwwang] fetch ${index + 1}/${urls.length} es_sn=${estimateId} ${url}`);
    const collectedAt = new Date().toISOString();
    const result = await fetchHtml(url, args);
    const fileName = `estimate_${estimateId ?? index + 1}.html`;
    await writeFile(path.join(runDir, fileName), result.html, 'utf8');
    results.push({
      url,
      estimateId,
      status: result.status,
      ok: result.ok,
      fileName,
      bytes: result.html.length,
      contentHash: result.contentHash,
      attempts: result.attempts,
      collectedAt,
    });
    if (estimateId) {
      if (result.ok) {
        progress.completed[estimateId] = {
          url,
          status: result.status,
          fileName,
          contentHash: result.contentHash,
          attempts: result.attempts,
          collectedAt,
        };
        delete progress.failed[estimateId];
      } else {
        progress.failed[estimateId] = { url, status: result.status, fileName, contentHash: result.contentHash, attempts: result.attempts, collectedAt };
      }
      await saveProgress(progressPath, progress);
    }
    if (index < urls.length - 1) {
      const jitter = Math.floor(Math.random() * (args.jitterMs + 1));
      await sleep(args.delayMs + jitter);
      if (args.restEvery > 0 && (index + 1) % args.restEvery === 0) await sleep(args.restMs);
    }
  }

  const completedResults = Object.entries(progress.completed).map(([estimateId, item]) => ({
    estimateId,
    ...item,
    ok: true,
  }));
  const failedResults = Object.entries(progress.failed).map(([estimateId, item]) => ({
    estimateId,
    ...item,
    ok: false,
  }));
  await writeFile(
    path.join(runDir, 'summary.json'),
    JSON.stringify({
      collectedAt: new Date().toISOString(),
      args,
      count: completedResults.length + failedResults.length,
      results: [...completedResults, ...failedResults],
    }, null, 2),
    'utf8',
  );
  console.log(`[kjwwang] done out=${runDir}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
