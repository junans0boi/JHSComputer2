import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = 'https://kjwwang.com';

function parseArgs(argv) {
  const args = {
    seedFile: 'data/pc_estimate.html',
    urls: '',
    limit: 30,
    delayMs: 3000,
    out: '../project/samples/kjwwang/html',
  };
  for (const rawArg of argv) {
    const [key, value = ''] = rawArg.replace(/^--/, '').split('=');
    if (key === 'seed-file') args.seedFile = value;
    if (key === 'urls') args.urls = value;
    if (key === 'limit') args.limit = Number(value);
    if (key === 'delay-ms') args.delayMs = Number(value);
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

async function fetchHtml(url) {
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
  return { ok: response.ok, status: response.status, html };
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

  return [...urls].filter(Boolean).slice(0, args.limit);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const urls = await extractUrls(args);
  const runDir = path.resolve(args.out, timestampForPath());
  await mkdir(runDir, { recursive: true });
  const results = [];

  for (const [index, url] of urls.entries()) {
    const estimateId = estimateIdFromUrl(url);
    console.log(`[kjwwang] fetch ${index + 1}/${urls.length} es_sn=${estimateId} ${url}`);
    const result = await fetchHtml(url);
    const fileName = `estimate_${estimateId ?? index + 1}.html`;
    await writeFile(path.join(runDir, fileName), result.html, 'utf8');
    results.push({ url, estimateId, status: result.status, ok: result.ok, fileName, bytes: result.html.length });
    await sleep(args.delayMs);
  }

  await writeFile(
    path.join(runDir, 'summary.json'),
    JSON.stringify({ collectedAt: new Date().toISOString(), args, count: results.length, results }, null, 2),
    'utf8',
  );
  console.log(`[kjwwang] done out=${runDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
