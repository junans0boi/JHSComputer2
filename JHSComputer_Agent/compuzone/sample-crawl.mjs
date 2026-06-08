import * as cheerio from 'cheerio';
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import iconv from 'iconv-lite';

const COMP_BASE_URL = 'https://www.compuzone.co.kr';
const LIST_ENDPOINT = `${COMP_BASE_URL}/product/product_list.php`;
const LIST_REFERER = `${COMP_BASE_URL}/product/product_list.htm`;

const CATEGORY_MAP = {
  CPU: { name: 'CPU', bigDivNo: '4', mediumDivNo: '1012', divNo: '0', ourCategory: 'CPU' },
  CPU_AMD: { name: 'AMD CPU', bigDivNo: '4', mediumDivNo: '1012', divNo: '2033', ourCategory: 'CPU' },
  CPU_INTEL_OFFICIAL: { name: '인텔 정품', bigDivNo: '4', mediumDivNo: '1012', divNo: '2032', ourCategory: 'CPU' },
  CPU_INTEL_PARALLEL: { name: '인텔 병행수입', bigDivNo: '4', mediumDivNo: '1012', divNo: '3452', ourCategory: 'CPU' },
  CPU_SERVER: { name: '서버 CPU', bigDivNo: '4', mediumDivNo: '1012', divNo: '3280', ourCategory: 'CPU' },

  MAINBOARD: { name: '메인보드', bigDivNo: '4', mediumDivNo: '1013', divNo: '0', ourCategory: 'MAINBOARD' },
  MAINBOARD_AMD: { name: 'AMD 소켓', bigDivNo: '4', mediumDivNo: '1013', divNo: '2035', ourCategory: 'MAINBOARD' },
  MAINBOARD_INTEL_1851: { name: '인텔 소켓 1851', bigDivNo: '4', mediumDivNo: '1013', divNo: '4724', ourCategory: 'MAINBOARD' },
  MAINBOARD_INTEL_1700: { name: '인텔 소켓 1700', bigDivNo: '4', mediumDivNo: '1013', divNo: '4560', ourCategory: 'MAINBOARD' },
  MAINBOARD_INTEL_1200: { name: '인텔 소켓 1200', bigDivNo: '4', mediumDivNo: '1013', divNo: '4421', ourCategory: 'MAINBOARD' },
  MAINBOARD_INTEL_1151_V2: { name: '인텔 소켓 1151-V2', bigDivNo: '4', mediumDivNo: '1013', divNo: '3480', ourCategory: 'MAINBOARD' },
  MAINBOARD_INTEL_1151: { name: '인텔 소켓 1151', bigDivNo: '4', mediumDivNo: '1013', divNo: '3209', ourCategory: 'MAINBOARD' },
  MAINBOARD_INTEL_1150_1155: { name: '인텔 소켓 1150/1155', bigDivNo: '4', mediumDivNo: '1013', divNo: '2953', ourCategory: 'MAINBOARD' },

  RAM: { name: '메모리', bigDivNo: '4', mediumDivNo: '1014', divNo: '0', ourCategory: 'RAM' },
  RAM_PC: { name: 'PC용 메모리', bigDivNo: '4', mediumDivNo: '1014', divNo: '2036', ourCategory: 'RAM' },
  RAM_XMP_EXPO: { name: 'XMP/EXPO 메모리', bigDivNo: '4', mediumDivNo: '1014', divNo: '2474', ourCategory: 'RAM' },

  SSD: { name: 'SSD', bigDivNo: '4', mediumDivNo: '1276', divNo: '0', ourCategory: 'SSD' },
  SSD_2_5: { name: '2.5형 SSD', bigDivNo: '4', mediumDivNo: '1276', divNo: '3399', ourCategory: 'SSD' },
  SSD_M2_NVME: { name: 'M.2 NVMe SSD', bigDivNo: '4', mediumDivNo: '1276', divNo: '3400', ourCategory: 'SSD' },

  GPU: { name: '그래픽카드', bigDivNo: '4', mediumDivNo: '1016', divNo: '0', ourCategory: 'GPU' },
  GPU_NVIDIA: { name: 'NVIDIA 그래픽카드', bigDivNo: '4', mediumDivNo: '1016', divNo: '2043', ourCategory: 'GPU' },
  GPU_AMD: { name: 'AMD 그래픽카드', bigDivNo: '4', mediumDivNo: '1016', divNo: '2042', ourCategory: 'GPU' },
  GPU_INTEL: { name: 'INTEL 그래픽카드', bigDivNo: '4', mediumDivNo: '1016', divNo: '4682', ourCategory: 'GPU' },

  CASE: { name: '케이스', bigDivNo: '4', mediumDivNo: '1147', divNo: '0', ourCategory: 'CASE' },
  CASE_MIDDLE: { name: '미들타워', bigDivNo: '4', mediumDivNo: '1147', divNo: '2750', ourCategory: 'CASE' },
  CASE_MINI: { name: '미니타워', bigDivNo: '4', mediumDivNo: '1147', divNo: '2751', ourCategory: 'CASE' },
  CASE_BIG: { name: '빅타워', bigDivNo: '4', mediumDivNo: '1147', divNo: '2749', ourCategory: 'CASE' },
  CASE_ITX_HTPC: { name: 'ITX/HTPC', bigDivNo: '4', mediumDivNo: '1147', divNo: '2752', ourCategory: 'CASE' },

  PSU: { name: '파워', bigDivNo: '4', mediumDivNo: '1148', divNo: '0', ourCategory: 'PSU' },
  PSU_ATX: { name: 'ATX 파워', bigDivNo: '4', mediumDivNo: '1148', divNo: '2754', ourCategory: 'PSU' },
  PSU_MATX: { name: 'M-ATX 파워', bigDivNo: '4', mediumDivNo: '1148', divNo: '2755', ourCategory: 'PSU' },

  COOLER: { name: '쿨러/튜닝용품', bigDivNo: '4', mediumDivNo: '1020', divNo: '0', ourCategory: 'COOLER' },
  COOLER_AIR: { name: 'CPU쿨러(공랭)', bigDivNo: '4', mediumDivNo: '1020', divNo: '2054', ourCategory: 'COOLER' },
  COOLER_LIQUID: { name: 'CPU쿨러(수랭)', bigDivNo: '4', mediumDivNo: '1020', divNo: '4582', ourCategory: 'COOLER' },
  CASE_FAN: { name: '케이스 쿨러', bigDivNo: '4', mediumDivNo: '1020', divNo: '2649', ourCategory: 'COOLER' },
  TUNING: { name: '튜닝용품', bigDivNo: '4', mediumDivNo: '1020', divNo: '2055', ourCategory: 'COOLER' },
};

const PRESETS = {
  minimal: ['CPU'],
  core: ['CPU', 'MAINBOARD', 'RAM', 'SSD', 'GPU', 'CASE', 'PSU', 'COOLER_AIR'],
  cpu: ['CPU', 'CPU_AMD', 'CPU_INTEL_OFFICIAL', 'CPU_INTEL_PARALLEL'],
  all: ['CPU', 'MAINBOARD', 'RAM', 'SSD', 'GPU', 'CASE', 'PSU', 'COOLER_AIR'],
};

const DEFAULT_ARGS = {
  preset: 'minimal',
  categories: null,
  pages: 1,
  maxPages: 200,
  pageCount: 20,
  details: 2,
  delayMs: 1500,
  jitterMs: 1000,
  retry: 3,
  restEveryPages: 10,
  restMs: 30000,
  categoryRestMs: 60000,
  emptyStop: 2,
  reuseDetails: true,
  sort: 'recommand',
  outDir: 'project/samples/compuzone',
};

function parseArgs(argv) {
  const args = { ...DEFAULT_ARGS };

  for (const rawArg of argv) {
    const [key, value = ''] = rawArg.replace(/^--/, '').split('=');
    if (key === 'categories') args.categories = value.split(',').map((item) => item.trim()).filter(Boolean);
    if (key === 'preset') args.preset = value;
    if (key === 'pages') args.pages = value === 'auto' || value === 'all' ? value : Number(value);
    if (key === 'max-pages') args.maxPages = Number(value);
    if (key === 'page-count') args.pageCount = Number(value);
    if (key === 'details') args.details = value === 'all' ? value : Number(value);
    if (key === 'delay-ms') args.delayMs = Number(value);
    if (key === 'jitter-ms') args.jitterMs = Number(value);
    if (key === 'retry') args.retry = Number(value);
    if (key === 'rest-every-pages') args.restEveryPages = Number(value);
    if (key === 'rest-ms') args.restMs = Number(value);
    if (key === 'category-rest-ms') args.categoryRestMs = Number(value);
    if (key === 'empty-stop') args.emptyStop = Number(value);
    if (key === 'reuse-details') args.reuseDetails = value !== 'false';
    if (key === 'sort') args.sort = value;
    if (key === 'out') args.outDir = value;
    if (key === 'help') args.help = true;
  }

  return args;
}

function printHelp() {
  console.log(`
Compuzone sample crawler

Usage:
  npm run crawl:compuzone:samples
  npm run crawl:compuzone:samples -- --categories=CPU,GPU --pages=1 --details=2
  npm run crawl:compuzone:samples -- --preset=core --pages=1 --details=0 --delay-ms=2000
  npm run crawl:compuzone:full

Options:
  --preset=minimal|core|cpu|all  Category preset. Default: minimal
  --categories=CPU,GPU           Explicit category keys. Overrides preset
  --pages=1|auto                 Scroll pages per category. auto stops after empty pages
  --max-pages=200                Safety limit for --pages=auto
  --page-count=20                Server page count hint
  --details=2|all                Detail pages to fetch per category
  --delay-ms=1500                Delay between HTTP requests
  --jitter-ms=1000               Random extra delay
  --retry=3                      Retry count per request
  --rest-every-pages=10          Rest after N list pages
  --rest-ms=30000                Rest duration after page batch
  --category-rest-ms=60000       Rest duration between categories
  --empty-stop=2                 Stop auto mode after N empty pages
  --reuse-details=false          Disable cached detail reuse
  --sort=recommand               recommand, sale_order, low_price, hi_price, used_count
  --out=project/samples/compuzone

Available category keys:
  ${Object.keys(CATEGORY_MAP).join(', ')}
`);
}

function resolveCategories(args) {
  const keys = args.categories ?? PRESETS[args.preset];
  if (!keys) {
    throw new Error(`Unknown preset "${args.preset}". Available presets: ${Object.keys(PRESETS).join(', ')}`);
  }

  return keys.map((key) => {
    const category = CATEGORY_MAP[key];
    if (!category) {
      throw new Error(`Unknown category "${key}". Run with --help to see category keys.`);
    }
    return { key, ...category };
  });
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

function toAbsoluteUrl(value, baseUrl = LIST_REFERER) {
  if (!value) return null;
  if (value.startsWith('//')) return `https:${value}`;
  return new URL(value, baseUrl).toString();
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.max(0, max + 1));
}

async function politeSleep(args, multiplier = 1) {
  await sleep(args.delayMs * multiplier + randomInt(args.jitterMs));
}

async function fetchEucKr(url, { method = 'GET', body, referer } = {}) {
  const headers = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.7,en;q=0.6',
    'Cache-Control': 'no-cache',
    Referer: referer ?? LIST_REFERER,
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36 JHSComputerSampleCrawler/0.1',
  };

  if (method === 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    headers['X-Requested-With'] = 'XMLHttpRequest';
  }

  const response = await fetch(url, {
    method,
    body,
    headers,
  });

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const html = iconv.decode(buffer, 'euc-kr');

  return {
    ok: response.ok,
    status: response.status,
    url: response.url,
    html,
    htmlHash: sha256(html),
  };
}

async function fetchEucKrWithRetry(url, options, args) {
  let lastError;
  for (let attempt = 1; attempt <= Math.max(1, args.retry); attempt += 1) {
    try {
      const result = await fetchEucKr(url, options);
      if (result.ok || result.status < 500) return result;
      lastError = new Error(`HTTP ${result.status}`);
    } catch (error) {
      lastError = error;
    }

    const waitMs = args.delayMs * attempt * 2 + randomInt(args.jitterMs);
    console.log(`[sample] retry ${attempt}/${args.retry} wait=${waitMs}ms url=${url}`);
    await sleep(waitMs);
  }
  throw lastError;
}

function buildListBody(category, { scrollPage, pageCount, sort }) {
  return new URLSearchParams({
    actype: 'getList',
    BigDivNo: category.bigDivNo,
    MediumDivNo: category.mediumDivNo,
    DivNo: category.divNo,
    PageCount: String(pageCount),
    StartNum: '0',
    PageNum: '1',
    PreOrder: sort,
    lvm: 'L',
    ScrollPage: String(scrollPage),
    ProductType: 'list',
    setPricechk: 'N',
  });
}

function parseListHtml(html, category) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const products = [];

  $('li.li-obj[id^="li-pno-"]').each((_, element) => {
    const $item = $(element);
    const productNoFromId = $item.attr('id')?.replace('li-pno-', '') ?? null;
    const $price = $item.find('.prd_price').first();
    const $compare = $item.find('.compare_bt').first();
    const $name = $item.find('.prd_info_name.prdTxt').first();
    const detailHref = $name.attr('href') ?? $item.find('.prd_info_main_img').first().attr('href') ?? null;
    const productNo =
      productNoFromId ??
      $price.attr('data-pricetable') ??
      $compare.attr('data-idx') ??
      detailHref?.match(/ProductNo=(\d+)/)?.[1] ??
      null;
    const rawBadges = [];

    $item.find('.evtIco_obj, .evtFix_tag, .quick_pickUP_icon > b').each((__, badge) => {
      const text = cleanText($(badge).text());
      if (text) rawBadges.push(text);
    });

    const variants = [];
    $item.find('.prd_option_wrap .prd_option').each((__, option) => {
      const $option = $(option);
      const $input = $option.find('input.SelGroupProductNo').first();
      const variantProductNo = $input.attr('value') ?? null;
      const variantName = cleanText($option.find('.opt_name').first().text());
      const variantPrice = parseNumber($option.find('.op_price').first().text());

      if (variantProductNo || variantName || variantPrice != null) {
        variants.push({
          variantProductNo,
          originalProductNo: $input.attr('oriprd') ?? null,
          requiredOption: $input.attr('reqopt') === '1',
          variantName: variantName || null,
          price: variantPrice,
        });
      }
    });

    const product = {
      productNo,
      idx: parseNumber($item.attr('idx')),
      supplierCategory: {
        bigDivNo: category.bigDivNo,
        mediumDivNo: category.mediumDivNo,
        divNo: $price.attr('data-div') ?? $compare.attr('data-div') ?? category.divNo,
        sourceDivNo: category.divNo,
      },
      ourCategory: category.ourCategory,
      name: cleanText($name.text()),
      detailUrl: toAbsoluteUrl(detailHref, `${COMP_BASE_URL}/product/product_list.htm`),
      imageUrl: toAbsoluteUrl($item.find('.prd_info_main_img img').first().attr('src')),
      summarySpecText: cleanText($item.find('.prd_subTxt').first().text()),
      pricing: {
        listPrice: parseNumber($price.attr('data-price') ?? $compare.attr('data-price')),
        discountPrice: parseNumber($price.attr('data-discountprice') ?? $compare.attr('data-discountprice')),
        customPrice: parseNumber($price.attr('data-customprice') ?? $compare.attr('data-customprice')),
        discountRate: parseNumber($price.attr('data-discount') ?? $compare.attr('data-discount')),
      },
      review: {
        count: parseNumber($price.attr('data-review') ?? $compare.attr('data-review')),
        rate: parseNumber($price.attr('data-rate') ?? $compare.attr('data-rate')),
      },
      badges: [...new Set(rawBadges)],
      variants,
      flags: {
        isGroupProduct: variants.length > 0,
        isOptionRequired: variants.some((variant) => variant.requiredOption),
        isBuyable: $item.find('.prd_btn_list').text().includes('구매하기'),
        hasCartButton: $item.find('.prd_btn_list').text().includes('장바구니'),
      },
    };

    if (product.productNo && product.name) {
      products.push(product);
    }
  });

  return products;
}

function parseDetailHtml(html, productNo) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const priceCandidates = new Set();
  const regexes = [
    new RegExp(`Add_Order\\([^\\)]*['"]${productNo}['"][^\\)]*?['"](\\d{3,})['"]`, 'g'),
    new RegExp(`todayCookie\\(['"]${productNo}['"][^\\)]*?['"](\\d{3,})['"]`, 'g'),
    /var\s+produc_price\s*=\s*["'](\d{3,})["']/g,
    /regularPrice\s*:\s*(\d{3,})/g,
  ];

  for (const regex of regexes) {
    for (const match of html.matchAll(regex)) {
      priceCandidates.add(Number(match[1]));
    }
  }

  return {
    productNo,
    detailTitle:
      cleanText($('meta[property="og:title"]').attr('content') ?? '') ||
      cleanText($('title').text()) ||
      null,
    metaKeywords: cleanText($('meta[name="keywords"]').attr('content') ?? '') || null,
    metaDescription: cleanText($('meta[name="description"]').attr('content') ?? '') || null,
    priceCandidates: [...priceCandidates],
    hasOptionLayerRequest: html.includes('getProductOptionLayer'),
    hasGroupInfoRequest: html.includes('chk_product_group_info'),
    rawSignals: {
      addOrderCount: (html.match(/Add_Order\(/g) ?? []).length,
      todayCookieCount: (html.match(/todayCookie\(/g) ?? []).length,
      productOptionLayerCount: (html.match(/getProductOptionLayer/g) ?? []).length,
    },
  };
}

async function crawlCategory(category, args, detailCache = new Map()) {
  const listPages = [];
  const products = [];
  const seen = new Set();
  const maxPages = args.pages === 'auto' || args.pages === 'all' ? args.maxPages : args.pages;
  let emptyPages = 0;

  for (let page = 1; page <= maxPages; page += 1) {
    const body = buildListBody(category, {
      scrollPage: page,
      pageCount: args.pageCount,
      sort: args.sort,
    });
    const result = await fetchEucKrWithRetry(LIST_ENDPOINT, {
      method: 'POST',
      body,
      referer: `${LIST_REFERER}?BigDivNo=${category.bigDivNo}&MediumDivNo=${category.mediumDivNo}&DivNo=${category.divNo}`,
    }, args);
    const pageProducts = parseListHtml(result.html, category);
    emptyPages = pageProducts.length === 0 ? emptyPages + 1 : 0;

    for (const product of pageProducts) {
      if (!seen.has(product.productNo)) {
        seen.add(product.productNo);
        products.push(product);
      }
    }

    listPages.push({
      scrollPage: page,
      request: Object.fromEntries(body.entries()),
      status: result.status,
      htmlHash: result.htmlHash,
      parsedCount: pageProducts.length,
    });

    console.log(`[sample] ${category.key} page=${page} parsed=${pageProducts.length} total=${products.length}`);
    await writeProgress(args, {
      runStatus: 'RUNNING',
      phase: 'list',
      category: category.key,
      categoryName: category.name,
      page,
      parsedOnPage: pageProducts.length,
      categoryProducts: products.length,
    });

    if ((args.pages === 'auto' || args.pages === 'all') && emptyPages >= args.emptyStop) {
      console.log(`[sample] ${category.key} auto stop after ${emptyPages} empty pages`);
      break;
    }

    if (args.restEveryPages > 0 && page % args.restEveryPages === 0) {
      console.log(`[sample] ${category.key} rest ${args.restMs}ms after ${page} pages`);
      await sleep(args.restMs);
    } else {
      await politeSleep(args);
    }
  }

  const detailTargets = args.details === 'all' ? products : products.slice(0, Math.max(0, args.details));
  for (const [index, product] of detailTargets.entries()) {
    if (!product.detailUrl) continue;

    const cachedDetail = args.reuseDetails ? detailCache.get(product.productNo) : null;
    if (cachedDetail) {
      product.detailSample = cachedDetail;
      console.log(`[sample] ${category.key} detail=${index + 1}/${detailTargets.length} productNo=${product.productNo} cached`);
      await writeProgress(args, {
        runStatus: 'RUNNING',
        phase: 'detail',
        category: category.key,
        categoryName: category.name,
        detailIndex: index + 1,
        detailTotal: detailTargets.length,
        productNo: product.productNo,
        cached: true,
        categoryProducts: products.length,
      });
      continue;
    }

    console.log(`[sample] ${category.key} detail=${index + 1}/${detailTargets.length} productNo=${product.productNo}`);
    await writeProgress(args, {
      runStatus: 'RUNNING',
      phase: 'detail',
      category: category.key,
      categoryName: category.name,
      detailIndex: index + 1,
      detailTotal: detailTargets.length,
      productNo: product.productNo,
      cached: false,
      categoryProducts: products.length,
    });

    const detailResult = await fetchEucKrWithRetry(product.detailUrl, {
      referer: `${LIST_REFERER}?BigDivNo=${category.bigDivNo}&MediumDivNo=${category.mediumDivNo}&DivNo=${category.divNo}`,
    }, args);
    
    // Extract detail spec images from AJAX response
    const ajaxUrls = [
      `https://www.compuzone.co.kr/product/product_detail_ajax.php?actype=getProductDetail&productNo=${product.productNo}`,
      `https://www.compuzone.co.kr/product/product_detail_ajax.php?actype=getGraphicProductDetail&productNo=${product.productNo}&DivNo=${category.divNo}`,
      `https://www.compuzone.co.kr/product/product_detail_ajax.php?actype=getIworksProductDetail&productNo=${product.productNo}`
    ];
    
    let detailImages = [];
    for (const ajaxUrl of ajaxUrls) {
      if (detailImages.length > 0) break;
      try {
        const ajaxResult = await fetchEucKrWithRetry(ajaxUrl, {}, args);
        const imgMatches =
          ajaxResult.html.match(
            /https?:\/\/image\d*\.compuzone\.co\.kr\/img\/(?:product_img_detail|pr_early_image)\/[^'"\s>)]+\.(?:jpg|jpeg|png|gif|webp)/gi
          ) || [];
        if (imgMatches.length > 0) {
          detailImages = [...new Set(imgMatches)];
        }
      } catch (e) {
        // ignore
      }
    }

    product.detailSample = {
      status: detailResult.status,
      htmlHash: detailResult.htmlHash,
      parsed: {
        ...parseDetailHtml(detailResult.html, product.productNo),
        detailImages,
      },
    };

    await politeSleep(args);
  }

  return {
    category,
    requestedAt: new Date().toISOString(),
    listPages,
    products,
    observations: summarizeProducts(products),
  };
}

function summarizeProducts(products) {
  const detailPriceMismatches = products
    .filter((product) => product.detailSample)
    .filter((product) => {
      const listPrice = product.pricing.discountPrice ?? product.pricing.listPrice;
      const detailPrices = product.detailSample.parsed.priceCandidates;
      return listPrice != null && detailPrices.length > 0 && !detailPrices.includes(listPrice);
    })
    .map((product) => ({
      productNo: product.productNo,
      name: product.name,
      listPrice: product.pricing.discountPrice ?? product.pricing.listPrice,
      detailPrices: product.detailSample.parsed.priceCandidates,
    }));

  return {
    totalProducts: products.length,
    buyableProducts: products.filter((product) => product.flags.isBuyable).length,
    groupOrVariantProducts: products.filter((product) => product.flags.isGroupProduct).length,
    priceMissingProducts: products.filter((product) => product.pricing.discountPrice == null).length,
    detailPriceMismatches,
  };
}

function timestampForPath(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
}

async function writeProgress(args, progress) {
  await writeFile(
    path.resolve(args.outDir, '_latest-progress.json'),
    JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }, null, 2),
    'utf8',
  ).catch(() => {});
}

async function loadDetailCache(outDir) {
  const cache = new Map();
  const dirs = (await readdir(outDir, { withFileTypes: true }).catch(() => []))
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(outDir, entry.name))
    .sort();

  for (const dir of dirs) {
    const files = (await readdir(dir).catch(() => [])).filter((file) => file.endsWith('.json') && file !== 'summary.json');
    for (const file of files) {
      const data = JSON.parse(await readFile(path.join(dir, file), 'utf8').catch(() => '{}'));
      for (const product of data.products ?? []) {
        if (product.productNo && product.detailSample) {
          cache.set(product.productNo, product.detailSample);
        }
      }
    }
  }

  return cache;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const categories = resolveCategories(args);
  const runStartedAt = new Date();
  const runId = timestampForPath(runStartedAt);
  const outputDir = path.resolve(args.outDir, runId);
  await mkdir(outputDir, { recursive: true });
  const detailCache = args.reuseDetails ? await loadDetailCache(path.resolve(args.outDir)) : new Map();
  if (detailCache.size > 0) {
    console.log(`[sample] loaded detail cache products=${detailCache.size}`);
  }

  const results = [];
  for (const category of categories) {
    console.log(`[sample] ${category.key} ${category.name} start`);
    const result = await crawlCategory(category, args, detailCache);
    for (const product of result.products) {
      if (product.productNo && product.detailSample) {
        detailCache.set(product.productNo, product.detailSample);
      }
    }
    results.push(result);
    await writeFile(path.join(outputDir, `${category.key}.json`), JSON.stringify(result, null, 2), 'utf8');
    console.log(
      `[sample] ${category.key} products=${result.products.length} variants=${result.observations.groupOrVariantProducts}`,
    );
    await writeProgress(args, {
      runStatus: 'RUNNING',
      phase: 'categoryDone',
      category: category.key,
      categoryName: category.name,
      categoryProducts: result.products.length,
      outputFile: path.join(outputDir, `${category.key}.json`),
    });
    if (args.categoryRestMs > 0) {
      console.log(`[sample] category rest ${args.categoryRestMs}ms`);
      await sleep(args.categoryRestMs);
    }
  }

  const summary = {
    runId,
    runStartedAt: runStartedAt.toISOString(),
    runFinishedAt: new Date().toISOString(),
    args,
    outputDir,
    categories: results.map((result) => ({
      key: result.category.key,
      name: result.category.name,
      productCount: result.products.length,
      observations: result.observations,
      outputFile: `${result.category.key}.json`,
    })),
    notes: [
      'This crawler supports slow auto mode with retries, jitter, page rests, and category rests.',
      'List pages come from /product/product_list.php POST responses.',
      'Use --details=all carefully because detail image requests multiply traffic.',
      'External site terms and operational blocking risk must be reviewed before production use.',
    ],
  };

  await writeFile(path.join(outputDir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf8');
  await writeProgress(args, {
    runStatus: 'DONE',
    phase: 'done',
    runId,
    outputDir,
    totalProducts: results.reduce((sum, result) => sum + result.products.length, 0),
    categories: summary.categories,
  });
  console.log(`[sample] done: ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
