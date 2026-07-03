import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    seed: '../data',
    urls: '',
    limit: 30,
    delayMs: 1500,
    out: '../project/samples/wanggapc/html',
  };
  for (const rawArg of argv) {
    const normalizedArg = rawArg.replace(/^--/, '');
    const separatorIndex = normalizedArg.indexOf('=');
    const key = separatorIndex >= 0 ? normalizedArg.slice(0, separatorIndex) : normalizedArg;
    const value = separatorIndex >= 0 ? normalizedArg.slice(separatorIndex + 1) : '';
    if (key === 'seed') args.seed = value;
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

function extractProductUrls(html) {
  const normalized = html.replaceAll('\\/', '/').replaceAll('&amp;', '&');
  const urls = new Set();
  for (const match of normalized.matchAll(/https?:\/\/wanggapc\.com\/products\/[^"'<>\\\s]+/g)) urls.add(match[0]);
  for (const match of normalized.matchAll(/href=["']([^"']*\/products\/[^"']+)["']/g)) {
    urls.add(new URL(match[1], 'https://wanggapc.com').toString());
  }
  for (const match of normalized.matchAll(/\/products\/(\d+)/g)) urls.add(`https://wanggapc.com/products/${match[1]}`);
  return [...urls];
}

async function seedUrls(seed) {
  const stat = await import('node:fs/promises').then((fs) => fs.stat(seed).catch(() => null));
  const files = [];
  if (stat?.isFile()) files.push(seed);
  else if (stat?.isDirectory()) {
    const entries = await import('node:fs/promises').then((fs) => fs.readdir(seed, { withFileTypes: true }));
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.html') && entry.name.includes('왕가PC')) files.push(path.join(seed, entry.name));
    }
  }
  const urls = new Set();
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    extractProductUrls(html).forEach((url) => urls.add(url));
  }
  return [...urls];
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9',
      Referer: 'https://wanggapc.com/',
      'User-Agent': 'JHSComputerWanggaCollector/0.1 (+local development; polite sample collector)',
    },
  });
  return {
    ok: response.ok,
    status: response.status,
    html: await response.text(),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const urls = [
    ...new Set([
      ...args.urls.split(',').map((item) => item.trim()).filter(Boolean),
      ...(await seedUrls(path.resolve(args.seed))),
    ]),
  ].slice(0, args.limit);

  const runDir = path.resolve(args.out, timestampForPath());
  await mkdir(runDir, { recursive: true });
  const results = [];
  for (const [index, url] of urls.entries()) {
    const productId = url.match(/\/products\/(\d+)/)?.[1] ?? String(index + 1);
    console.log(`[wanggapc] fetch ${index + 1}/${urls.length} product=${productId} ${url}`);
    const result = await fetchHtml(url);
    const fileName = `product_${productId}.html`;
    await writeFile(path.join(runDir, fileName), result.html, 'utf8');
    results.push({ url, productId, status: result.status, ok: result.ok, fileName, bytes: result.html.length });
    await sleep(args.delayMs);
  }
  await writeFile(path.join(runDir, 'summary.json'), JSON.stringify({ collectedAt: new Date().toISOString(), args, count: results.length, results }, null, 2));
  console.log(`[wanggapc] done out=${runDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
