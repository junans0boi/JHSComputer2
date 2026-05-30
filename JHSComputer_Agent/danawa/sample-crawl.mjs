import * as cheerio from 'cheerio';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DANAWA_BASE_URL = 'https://prod.danawa.com';
const SEARCH_URL = 'https://search.danawa.com/dsearch.php';
const DESCRIPTION_AJAX_URL = `${DANAWA_BASE_URL}/info/ajax/getProductDescription.ajax.php`;

const DEFAULT_ARGS = {
  queries: ['AMD 라이젠7 9800X3D', 'MSI 지포스 RTX 5060 벤투스 2X OC D7 8GB'],
  results: 3,
  details: 1,
  delayMs: 1500,
  outDir: 'project/samples/danawa',
};

function parseArgs(argv) {
  const args = { ...DEFAULT_ARGS };

  for (const rawArg of argv) {
    const [key, value = ''] = rawArg.replace(/^--/, '').split('=');
    if (key === 'query') args.queries = [value].filter(Boolean);
    if (key === 'queries') args.queries = value.split('|').map((item) => item.trim()).filter(Boolean);
    if (key === 'results') args.results = Number(value);
    if (key === 'details') args.details = Number(value);
    if (key === 'delay-ms') args.delayMs = Number(value);
    if (key === 'out') args.outDir = value;
    if (key === 'help') args.help = true;
  }

  return args;
}

function printHelp() {
  console.log(`
Danawa sample crawler

Usage:
  npm run crawl:danawa:samples
  npm run crawl:danawa:samples -- --query="AMD 라이젠7 9800X3D"
  npm run crawl:danawa:samples -- --queries="AMD 라이젠7 9800X3D|MSI 지포스 RTX 5060 벤투스 2X OC D7 8GB" --results=2 --details=1

Options:
  --query="..."          One search query
  --queries="A|B"        Multiple search queries, separated by |
  --results=3            Search results to save per query
  --details=1            Detail/spec pages to fetch per query
  --delay-ms=1500        Delay between HTTP requests
  --out=project/samples/danawa
`);
}

function cleanText(value = '') {
  return value.replace(/\s+/g, ' ').trim();
}

function parseNumber(value) {
  if (value == null) return null;
  const digits = String(value).replace(/[^\d.-]/g, '');
  if (!digits) return null;
  return Number(digits);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toAbsoluteUrl(value, baseUrl = SEARCH_URL) {
  if (!value) return null;
  if (value.startsWith('//')) return `https:${value}`;
  return new URL(value, baseUrl).toString();
}

function getUrlParam(url, key) {
  if (!url) return null;
  try {
    return new URL(url).searchParams.get(key);
  } catch {
    return null;
  }
}

async function fetchText(url, { method = 'GET', body, referer = SEARCH_URL } = {}) {
  const headers = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.7,en;q=0.6',
    'Cache-Control': 'no-cache',
    Referer: referer,
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36 JHSComputerDanawaSampler/0.1',
  };

  if (method === 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    headers['X-Requested-With'] = 'XMLHttpRequest';
  }

  const response = await fetch(url, { method, body, headers });
  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    url: response.url,
    text,
    textHash: sha256(text),
  };
}

function extractJsonLdResults($) {
  const items = [];

  $('script[type="application/ld+json"]').each((_, script) => {
    const raw = $(script).text();
    if (!raw.includes('"ItemList"')) return;

    try {
      const json = JSON.parse(raw);
      const elements = Array.isArray(json.itemListElement) ? json.itemListElement : [];
      for (const element of elements) {
        const item = element.item ?? element;
        const url = toAbsoluteUrl(item.url);
        const pcode = getUrlParam(url, 'pcode');
        if (!pcode) continue;
        items.push({
          pcode,
          name: cleanText(item.name),
          productUrl: url,
          imageUrl: toAbsoluteUrl(item.image),
          price: parseNumber(item.offers?.price),
          cate: getUrlParam(url, 'cate'),
          source: 'json_ld',
        });
      }
    } catch {
      // Search pages sometimes include incomplete JSON-LD during experiments.
    }
  });

  return items;
}

function parseBundleValue(value) {
  if (!value) return [];

  const [variantBlock] = value.split('//');
  if (!variantBlock?.includes('^')) return [];

  return variantBlock
    .split('**')
    .map((pair) => {
      const [variantName, pcode] = pair.split('^');
      return {
        variantName: cleanText(variantName),
        pcode: cleanText(pcode),
      };
    })
    .filter((variant) => variant.variantName && variant.pcode);
}

function parseSearchResults(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const byPcode = new Map();

  for (const item of extractJsonLdResults($)) {
    byPcode.set(item.pcode, item);
  }

  $('li.prod_item, div.prod_item').each((_, element) => {
    const $item = $(element);
    const $nameLink = $item.find('.prod_name a[href*="pcode="], .prod_name a[href*="/info/"]').first();
    const productUrl = toAbsoluteUrl($nameLink.attr('href'));
    const pcode =
      $item.attr('id')?.match(/(\d+)/)?.[1] ??
      getUrlParam(productUrl, 'pcode') ??
      $nameLink.attr('href')?.match(/pcode=(\d+)/)?.[1] ??
      null;

    if (!pcode) return;

    const imageUrl = toAbsoluteUrl(
      $item.find('.thumb_image img').first().attr('data-original') ??
        $item.find('.thumb_image img').first().attr('src') ??
        $item.find('img').first().attr('src'),
    );
    const bundleValue =
      $item.find(`input[id="wishListBundleVal_${pcode}"]`).attr('value') ??
      $item.find('input[id^="wishListBundleVal_"]').first().attr('value') ??
      null;

    const parsed = {
      pcode,
      name: cleanText($nameLink.text()),
      productUrl,
      imageUrl,
      price: parseNumber($item.find('.price_sect strong, .prod_pricelist .price').first().text()),
      cate: getUrlParam(productUrl, 'cate'),
      variants: parseBundleValue(bundleValue),
      source: 'search_dom',
    };

    byPcode.set(pcode, { ...(byPcode.get(pcode) ?? {}), ...parsed });
  });

  return [...byPcode.values()].filter((item) => item.pcode && item.name);
}

function extractGlobalField(html, fieldName) {
  const patterns = [
    new RegExp(`${fieldName}\\s*:\\s*'([^']*)'`),
    new RegExp(`${fieldName}\\s*:\\s*"([^"]*)"`),
    new RegExp(`${fieldName}\\s*:\\s*(\\d+)`),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return cleanText(match[1]);
  }

  return null;
}

function extractProductDescriptionInfo(html) {
  const match = html.match(/oProductDescriptionInfo\s*=\s*(\{[\s\S]*?\});/);
  if (!match) return {};

  try {
    return JSON.parse(match[1]);
  } catch {
    return {};
  }
}

function parseDetailMetadata(html, fallback) {
  const descriptionInfo = extractProductDescriptionInfo(html);
  const productUrl = fallback.productUrl;

  return {
    pcode: extractGlobalField(html, 'nProductCode') ?? fallback.pcode,
    categoryCode: extractGlobalField(html, 'nCategoryCode') ?? fallback.cate,
    category1: extractGlobalField(html, 'nCategoryCode1'),
    category2: extractGlobalField(html, 'nCategoryCode2'),
    category3: extractGlobalField(html, 'nCategoryCode3'),
    category4: extractGlobalField(html, 'nCategoryCode4') ?? '0',
    productFullName:
      extractGlobalField(html, 'sProductFullName') ??
      extractGlobalField(html, 'sProductName') ??
      fallback.name,
    makerName: descriptionInfo.makerName ?? extractGlobalField(html, 'makerName'),
    brandName: descriptionInfo.brandName ?? '',
    makerUrl: descriptionInfo.makerUrl ?? '',
    kccode: descriptionInfo.kccode ?? '',
    kpscode: descriptionInfo.kpscode ?? '',
    circulName: descriptionInfo.circulName ?? '',
    productName: descriptionInfo.productName ?? fallback.name,
    prodType: descriptionInfo.prodType ?? '',
    displayMakeDate: descriptionInfo.displayMakeDate ?? '',
    productUrl,
  };
}

function buildDescriptionBody(metadata) {
  return new URLSearchParams({
    nProductCode: metadata.pcode,
    productCode: metadata.pcode,
    pcode: metadata.pcode,
    cate1: metadata.category1 ?? '',
    cate2: metadata.category2 ?? '',
    cate3: metadata.category3 ?? '',
    cate4: metadata.category4 ?? '0',
    nCategoryCode: metadata.categoryCode ?? '',
    makerName: metadata.makerName ?? '',
    brandName: metadata.brandName ?? '',
    makerUrl: metadata.makerUrl ?? '',
    kccode: metadata.kccode ?? '',
    kpscode: metadata.kpscode ?? '',
    circulName: metadata.circulName ?? '',
    productName: metadata.productName ?? '',
    prodType: metadata.prodType ?? '',
    displayMakeDate: metadata.displayMakeDate ?? '',
    productFullName: metadata.productFullName ?? '',
  });
}

function parseSpecPairs(descriptionHtml) {
  const $ = cheerio.load(descriptionHtml, { decodeEntities: false });
  const specs = [];
  let section = null;

  $('.prod_spec table.spec_tbl tr, table.spec_tbl tr').each((_, row) => {
    const $row = $(row);
    const cells = $row.children('th, td');

    if (cells.length === 1) {
      const onlyText = cleanText(cells.first().text());
      if (onlyText) section = onlyText;
      return;
    }

    let pendingKey = null;
    cells.each((__, cell) => {
      const $cell = $(cell);
      const text = cleanText($cell.text());
      if (!text) return;

      if (cell.tagName?.toLowerCase() === 'th') {
        if ($cell.attr('colspan')) {
          section = text;
          pendingKey = null;
          return;
        }
        pendingKey = text;
        return;
      }

      if (pendingKey) {
        specs.push({
          section,
          key: pendingKey,
          value: text,
        });
        pendingKey = null;
      }
    });
  });

  return specs;
}

async function crawlQuery(query, args, outDir) {
  const searchUrl = `${SEARCH_URL}?${new URLSearchParams({ query }).toString()}`;
  console.log(`[danawa] search: ${query}`);
  const searchResponse = await fetchText(searchUrl);
  const allResults = parseSearchResults(searchResponse.text);
  const results = allResults.slice(0, args.results);

  await sleep(args.delayMs);

  for (const result of results.slice(0, args.details)) {
    if (!result.productUrl) continue;
    console.log(`[danawa] detail: ${result.pcode} ${result.name}`);
    const detailResponse = await fetchText(result.productUrl, { referer: searchUrl });
    const metadata = parseDetailMetadata(detailResponse.text, result);

    await sleep(args.delayMs);

    const descriptionResponse = await fetchText(DESCRIPTION_AJAX_URL, {
      method: 'POST',
      body: buildDescriptionBody(metadata),
      referer: result.productUrl,
    });

    result.detail = {
      httpStatus: detailResponse.status,
      htmlHash: detailResponse.textHash,
      metadata,
      descriptionHttpStatus: descriptionResponse.status,
      descriptionHtmlHash: descriptionResponse.textHash,
      specs: parseSpecPairs(descriptionResponse.text),
    };

    await sleep(args.delayMs);
  }

  const safeName = query.replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_+|_+$/g, '').slice(0, 80);
  const filePath = path.join(outDir, `${safeName || 'query'}.json`);
  await writeFile(
    filePath,
    JSON.stringify(
      {
        query,
        searchUrl,
        capturedAt: new Date().toISOString(),
        searchHttpStatus: searchResponse.status,
        searchHtmlHash: searchResponse.textHash,
        resultCount: results.length,
        results,
      },
      null,
      2,
    ),
  );

  return {
    query,
    file: filePath,
    resultCount: results.length,
    detailedCount: results.filter((result) => result.detail).length,
    topResults: results.map((result) => ({
      pcode: result.pcode,
      name: result.name,
      price: result.price,
      variantCount: result.variants?.length ?? 0,
      specCount: result.detail?.specs?.length ?? 0,
    })),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
  const outDir = path.join(args.outDir, timestamp);
  await mkdir(outDir, { recursive: true });

  const summaries = [];
  for (const query of args.queries) {
    summaries.push(await crawlQuery(query, args, outDir));
  }

  const summary = {
    capturedAt: new Date().toISOString(),
    outDir,
    args,
    queryCount: args.queries.length,
    summaries,
  };

  await writeFile(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
