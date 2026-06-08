import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

const CATEGORY_CODE_MAP = {
  CPU: 'CPU',
  MAINBOARD: 'MAINBOARD',
  RAM: 'RAM',
  SSD: 'SSD',
  GPU: 'GPU',
  CASE: 'CASE',
  PSU: 'PSU',
  COOLER: 'CPU_COOLER',
};

function parseArgs(argv) {
  const args = { root: '../project/samples/compuzone', dir: null, env: '../JHSComputer_Server/.env', limit: 0 };
  for (const rawArg of argv) {
    const [key, value = ''] = rawArg.replace(/^--/, '').split('=');
    if (key === 'root') args.root = value;
    if (key === 'dir') args.dir = value;
    if (key === 'env') args.env = value;
    if (key === 'limit') args.limit = Number(value);
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

async function latestSampleDir(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const dirs = entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(root, entry.name)).sort();
  for (const dir of dirs.toReversed()) {
    try {
      await readFile(path.join(dir, 'summary.json'), 'utf8');
      return dir;
    } catch {}
  }
  throw new Error(`No sample dir with summary.json: ${root}`);
}

async function readProducts(dir) {
  const files = (await readdir(dir)).filter((file) => file.endsWith('.json') && file !== 'summary.json');
  const products = [];
  for (const file of files) {
    const data = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
    for (const product of data.products ?? []) {
      products.push({ ...product, categoryKey: data.category?.key ?? path.basename(file, '.json') });
    }
  }
  return products;
}

function json(value) {
  return value == null ? null : JSON.stringify(value);
}

function manufacturerOf(name = '') {
  return name.match(/^\[([^\]]+)\]/)?.[1] ?? name.split(/\s+/)[0] ?? null;
}

function modelKey(product) {
  return `compuzone:${product.productNo}`;
}

function normalizeSocket(text) {
  return text.match(/\b(AM3|AM4|AM5|LGA\s?1155|LGA\s?1200|LGA\s?1700|LGA\s?1851|LGA\s?1800)\b/i)?.[1]?.replace(/\s+/g, '').toUpperCase() ?? null;
}

function memoryType(text) {
  return text.match(/\bDDR[3-5]\b/i)?.[0].toUpperCase() ?? null;
}

function numberMatch(text, regex) {
  const match = text.match(regex);
  return match ? Number(match[1]) : null;
}

function forms(text) {
  return [...new Set(['E-ATX', 'ATX', 'M-ATX', 'M-ITX', 'ITX', 'Mini-ITX'].filter((form) => text.toUpperCase().includes(form.toUpperCase())))];
}

function parseAttrs(product) {
  const text = `${product.name ?? ''} ${product.summarySpecText ?? ''}`;
  return {
    socket: normalizeSocket(text),
    memoryType: memoryType(text),
    capacityGb: numberMatch(text, /(\d+)\s?GB/i),
    wattage: numberMatch(text, /(\d{3,4})\s?W/i),
    gpuLengthMm: numberMatch(text, /(?:VGA|그래픽카드).*?(?:길이|최대길이).*?(\d{2,3})\s?m/i),
    coolerHeightMm: numberMatch(text, /(?:CPU쿨러|쿨러).*?(?:높이|최대길이).*?(\d{2,3})\s?m/i),
    forms: forms(text),
    color: text.includes('화이트') ? 'WHITE' : text.includes('블랙') ? 'BLACK' : null,
  };
}

async function scalar(connection, sql, params = []) {
  const [rows] = await connection.query(sql, params);
  return rows[0] ? Object.values(rows[0])[0] : null;
}

async function upsertPart(connection, product, categoryId) {
  const attrs = parseAttrs(product);
  const existingPartId = await scalar(connection, 'SELECT PART_ID FROM parts WHERE MODEL_KEY = ? LIMIT 1', [modelKey(product)]);
  if (existingPartId) {
    await connection.execute(
      `UPDATE parts
       SET PART_CATEGORY_ID=?, CANONICAL_NAME=?, MANUFACTURER=?, MODEL_NAME=?, THUMBNAIL_URL=?, STATUS='ACTIVE', SPEC_STATUS='PARSED_FROM_CRAWL', UPDATED_DT=NOW()
       WHERE PART_ID=?`,
      [categoryId, product.name, manufacturerOf(product.name), product.name, product.imageUrl, existingPartId],
    );
  } else {
    await connection.execute(
      `INSERT INTO parts
        (PART_CATEGORY_ID, CANONICAL_NAME, MANUFACTURER, MODEL_NAME, MODEL_KEY, THUMBNAIL_URL, STATUS, IS_ADMIN_APPROVED, SPEC_STATUS)
       VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', 'N', 'PARSED_FROM_CRAWL')`,
      [categoryId, product.name, manufacturerOf(product.name), product.name, modelKey(product), product.imageUrl],
    );
  }
  const partId = existingPartId ?? (await scalar(connection, 'SELECT PART_ID FROM parts WHERE MODEL_KEY = ? LIMIT 1', [modelKey(product)]));
  await upsertSpec(connection, partId, product.ourCategory, attrs);
  return partId;
}

async function upsertSpec(connection, partId, category, attrs) {
  if (category === 'CPU' && attrs.socket) {
    await connection.execute(`INSERT INTO cpu_specs (PART_ID, SOCKET, MEMORY_TYPES_JSON) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE SOCKET=VALUES(SOCKET), MEMORY_TYPES_JSON=VALUES(MEMORY_TYPES_JSON)`, [partId, attrs.socket, json(attrs.memoryType ? [attrs.memoryType] : [])]);
  } else if (category === 'MAINBOARD' && attrs.socket) {
    await connection.execute(`INSERT INTO mainboard_specs (PART_ID, SOCKET, FORM_FACTOR, MEMORY_TYPE) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE SOCKET=VALUES(SOCKET), FORM_FACTOR=VALUES(FORM_FACTOR), MEMORY_TYPE=VALUES(MEMORY_TYPE)`, [partId, attrs.socket, attrs.forms[0] ?? null, attrs.memoryType]);
  } else if (category === 'RAM' && attrs.memoryType && attrs.capacityGb) {
    await connection.execute(`INSERT INTO ram_specs (PART_ID, MEMORY_TYPE, CAPACITY_GB) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE MEMORY_TYPE=VALUES(MEMORY_TYPE), CAPACITY_GB=VALUES(CAPACITY_GB)`, [partId, attrs.memoryType, attrs.capacityGb]);
  } else if (category === 'SSD') {
    await connection.execute(`INSERT INTO storage_specs (PART_ID, STORAGE_TYPE, FORM_FACTOR, INTERFACE_TEXT, CAPACITY_GB) VALUES (?, 'SSD', ?, ?, ?) ON DUPLICATE KEY UPDATE FORM_FACTOR=VALUES(FORM_FACTOR), INTERFACE_TEXT=VALUES(INTERFACE_TEXT), CAPACITY_GB=VALUES(CAPACITY_GB)`, [partId, attrs.forms[0] ?? 'M.2', 'NVMe', attrs.capacityGb ?? 0]);
  } else if (category === 'PSU' && attrs.wattage) {
    await connection.execute(`INSERT INTO psu_specs (PART_ID, FORM_FACTOR, RATED_WATTAGE) VALUES (?, 'ATX', ?) ON DUPLICATE KEY UPDATE RATED_WATTAGE=VALUES(RATED_WATTAGE)`, [partId, attrs.wattage]);
  } else if (category === 'CASE') {
    await connection.execute(`INSERT INTO case_specs (PART_ID, CASE_TYPE, COLOR, SUPPORTED_BOARD_FORMS_JSON, MAX_GPU_LENGTH_MM, MAX_COOLER_HEIGHT_MM) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE SUPPORTED_BOARD_FORMS_JSON=VALUES(SUPPORTED_BOARD_FORMS_JSON), MAX_GPU_LENGTH_MM=VALUES(MAX_GPU_LENGTH_MM), MAX_COOLER_HEIGHT_MM=VALUES(MAX_COOLER_HEIGHT_MM)`, [partId, attrs.forms.includes('ATX') ? 'ATX' : null, attrs.color, json(attrs.forms), attrs.gpuLengthMm, attrs.coolerHeightMm]);
  } else if (category === 'COOLER') {
    await connection.execute(`INSERT INTO cooler_specs (PART_ID, COOLER_TYPE, COLOR, SUPPORTED_SOCKETS_JSON, HEIGHT_MM) VALUES (?, 'AIR', ?, ?, ?) ON DUPLICATE KEY UPDATE SUPPORTED_SOCKETS_JSON=VALUES(SUPPORTED_SOCKETS_JSON), HEIGHT_MM=VALUES(HEIGHT_MM)`, [partId, attrs.color, json(attrs.socket ? [attrs.socket] : []), attrs.coolerHeightMm]);
  } else if (category === 'GPU') {
    await connection.execute(`INSERT INTO gpu_specs (PART_ID, CHIPSET_MAKER, CHIPSET_NAME, MEMORY_GB, LENGTH_MM) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE MEMORY_GB=VALUES(MEMORY_GB), LENGTH_MM=VALUES(LENGTH_MM)`, [partId, productMaker(attrs), null, attrs.capacityGb, attrs.gpuLengthMm]);
  }
}

function productMaker() {
  return null;
}

async function upsertSupplierProduct(connection, product, supplierId, crawlTargetId) {
  const rawSpec = {
    supplierCategory: product.supplierCategory,
    detailSample: product.detailSample ?? null,
    detailImages: product.detailSample?.parsed?.detailImages ?? [],
    badges: product.badges ?? [],
    htmlHash: product.detailSample?.htmlHash ?? null,
  };
  await connection.execute(
    `INSERT INTO supplier_products
      (SUPPLIER_ID, CRAWL_TARGET_ID, EXTERNAL_PRODUCT_ID, PRODUCT_NAME, PRODUCT_URL, IMAGE_URL, SUMMARY_SPEC_TEXT, RAW_SPEC_JSON, SPEC_PARSE_STATUS, SPEC_CAPTURED_DT, REVIEW_COUNT, RATING, LAST_SEEN_DT)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PARSED', NOW(), ?, ?, NOW())
     ON DUPLICATE KEY UPDATE
      PRODUCT_NAME=VALUES(PRODUCT_NAME), PRODUCT_URL=VALUES(PRODUCT_URL), IMAGE_URL=VALUES(IMAGE_URL), SUMMARY_SPEC_TEXT=VALUES(SUMMARY_SPEC_TEXT),
      RAW_SPEC_JSON=VALUES(RAW_SPEC_JSON), SPEC_PARSE_STATUS='PARSED', SPEC_CAPTURED_DT=NOW(), REVIEW_COUNT=VALUES(REVIEW_COUNT), RATING=VALUES(RATING), LAST_SEEN_DT=NOW(), UPDATED_DT=NOW()`,
    [supplierId, crawlTargetId, product.productNo, product.name, product.detailUrl, product.imageUrl, product.summarySpecText, json(rawSpec), product.review?.count ?? null, product.review?.rate ?? null],
  );
  return scalar(connection, 'SELECT SUPPLIER_PRODUCT_ID FROM supplier_products WHERE SUPPLIER_ID = ? AND EXTERNAL_PRODUCT_ID = ?', [supplierId, product.productNo]);
}

async function upsertOfferAndPrice(connection, product, supplierProductId, partId) {
  const price = product.pricing?.discountPrice ?? product.pricing?.listPrice ?? 0;
  await connection.execute(
    `INSERT INTO supplier_offers
      (SUPPLIER_PRODUCT_ID, PART_ID, EXTERNAL_OFFER_ID, OFFER_NAME, OFFER_KIND, ATTRIBUTES_JSON, IS_DEFAULT, IS_ACTIVE, LAST_SEEN_DT, RAW_JSON)
     VALUES (?, ?, ?, ?, 'DEFAULT', ?, 'Y', 'Y', NOW(), ?)
     ON DUPLICATE KEY UPDATE PART_ID=VALUES(PART_ID), OFFER_NAME=VALUES(OFFER_NAME), ATTRIBUTES_JSON=VALUES(ATTRIBUTES_JSON), IS_ACTIVE='Y', LAST_SEEN_DT=NOW(), RAW_JSON=VALUES(RAW_JSON), UPDATED_DT=NOW()`,
    [supplierProductId, partId, product.productNo, product.name, json(parseAttrs(product)), json(product)],
  );
  const offerId = await scalar(connection, 'SELECT SUPPLIER_OFFER_ID FROM supplier_offers WHERE SUPPLIER_PRODUCT_ID = ? AND EXTERNAL_OFFER_ID = ?', [supplierProductId, product.productNo]);
  await connection.execute(
    `INSERT INTO supplier_offer_prices
      (SUPPLIER_OFFER_ID, PUBLIC_PRICE, BENEFIT_PRICE, DISCOUNT_AMOUNT, STOCK_STATUS, SOURCE_TYPE, CAPTURED_DT, RAW_JSON)
     VALUES (?, ?, ?, ?, ?, 'CRAWL', NOW(), ?)`,
    [offerId, product.pricing?.listPrice ?? price, price, product.pricing?.discountRate ?? null, product.flags?.isBuyable ? 'AVAILABLE' : 'UNKNOWN', json(product.pricing)],
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = await loadEnv(path.resolve(args.env));
  const dir = path.resolve(args.dir ?? (await latestSampleDir(path.resolve(args.root))));
  const products = (await readProducts(dir)).slice(0, args.limit || undefined);
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    port: Number(env.DB_PORT ?? 3306),
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    charset: 'utf8mb4',
  });

  const supplierId = await scalar(connection, `SELECT SUPPLIER_ID FROM suppliers WHERE SUPPLIER_CODE = 'compuzone'`);
  if (!supplierId) throw new Error('Missing supplier: compuzone');

  let synced = 0;
  for (const product of products) {
    const categoryCode = CATEGORY_CODE_MAP[product.ourCategory];
    const categoryId = await scalar(connection, 'SELECT PART_CATEGORY_ID FROM part_categories WHERE CATEGORY_CODE = ?', [categoryCode]);
    if (!categoryId) {
      console.log(`[db] skip missing category ${product.ourCategory} ${product.name}`);
      continue;
    }
    const crawlTargetId = await scalar(
      connection,
      'SELECT CRAWL_TARGET_ID FROM supplier_crawl_targets WHERE SUPPLIER_ID = ? AND PART_CATEGORY_ID = ? ORDER BY CRAWL_PRIORITY ASC LIMIT 1',
      [supplierId, categoryId],
    );
    const partId = await upsertPart(connection, product, categoryId);
    const supplierProductId = await upsertSupplierProduct(connection, product, supplierId, crawlTargetId);
    await upsertOfferAndPrice(connection, product, supplierProductId, partId);
    synced += 1;
    if (synced % 50 === 0) console.log(`[db] synced ${synced}/${products.length}`);
  }
  await connection.end();
  console.log(`[db] done dir=${dir} products=${synced}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
