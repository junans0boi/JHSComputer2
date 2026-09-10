import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { parseSpecAttributes } from './spec-parser.mjs';
import { upsertSpec as upsertParsedSpec } from './spec-db-upsert.mjs';

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

function parseAttrs(product) {
  return parseSpecAttributes({
    name: product.name ?? '',
    summarySpecText: product.summarySpecText ?? '',
  });
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
  return upsertParsedSpec(connection, partId, category, attrs);
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
      (SUPPLIER_ID, CRAWL_TARGET_ID, EXTERNAL_PRODUCT_ID, PRODUCT_NAME, PRODUCT_URL, IMAGE_URL, SUMMARY_SPEC_TEXT, RAW_SPEC_JSON, SPEC_PARSE_STATUS, SPEC_CAPTURED_DT, REVIEW_COUNT, RATING, MATCH_STATUS, MATCH_CONFIDENCE, LAST_SEEN_DT)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PARSED', NOW(), ?, ?, 'AUTO_MATCHED', 100, NOW())
     ON DUPLICATE KEY UPDATE
      PRODUCT_NAME=VALUES(PRODUCT_NAME), PRODUCT_URL=VALUES(PRODUCT_URL), IMAGE_URL=VALUES(IMAGE_URL), SUMMARY_SPEC_TEXT=VALUES(SUMMARY_SPEC_TEXT),
      RAW_SPEC_JSON=VALUES(RAW_SPEC_JSON), SPEC_PARSE_STATUS='PARSED', SPEC_CAPTURED_DT=NOW(), REVIEW_COUNT=VALUES(REVIEW_COUNT), RATING=VALUES(RATING), MATCH_STATUS='AUTO_MATCHED', MATCH_CONFIDENCE=100, LAST_SEEN_DT=NOW(), UPDATED_DT=NOW()`,
    [supplierId, crawlTargetId, product.productNo, product.name, product.detailUrl, product.imageUrl, product.summarySpecText, json(rawSpec), product.review?.count ?? null, product.review?.rate ?? null],
  );
  return scalar(connection, 'SELECT SUPPLIER_PRODUCT_ID FROM supplier_products WHERE SUPPLIER_ID = ? AND EXTERNAL_PRODUCT_ID = ?', [supplierId, product.productNo]);
}

async function upsertOfferAndPrice(connection, product, supplierProductId, partId) {
  const publicPrice = product.pricing?.listPrice ?? product.pricing?.discountPrice ?? null;
  const benefitPrice = product.pricing?.discountPrice ?? product.pricing?.listPrice ?? null;
  const discountAmount = publicPrice != null && benefitPrice != null
    ? Math.max(Number(publicPrice) - Number(benefitPrice), 0)
    : null;
  const stockStatus = product.flags?.isBuyable ? 'AVAILABLE' : 'UNKNOWN';
  await connection.execute(
    `INSERT INTO supplier_offers
      (SUPPLIER_PRODUCT_ID, PART_ID, EXTERNAL_OFFER_ID, OFFER_NAME, OFFER_KIND, ATTRIBUTES_JSON, IS_DEFAULT, IS_ACTIVE, LAST_SEEN_DT, RAW_JSON)
     VALUES (?, ?, ?, ?, 'DEFAULT', ?, 'Y', 'Y', NOW(), ?)
     ON DUPLICATE KEY UPDATE PART_ID=VALUES(PART_ID), OFFER_NAME=VALUES(OFFER_NAME), ATTRIBUTES_JSON=VALUES(ATTRIBUTES_JSON), IS_ACTIVE='Y', LAST_SEEN_DT=NOW(), RAW_JSON=VALUES(RAW_JSON), UPDATED_DT=NOW()`,
    [supplierProductId, partId, product.productNo, product.name, json(parseAttrs(product)), json(product)],
  );
  const offerId = await scalar(connection, 'SELECT SUPPLIER_OFFER_ID FROM supplier_offers WHERE SUPPLIER_PRODUCT_ID = ? AND EXTERNAL_OFFER_ID = ?', [supplierProductId, product.productNo]);
  if (publicPrice == null && benefitPrice == null) {
    await connection.execute(
      `UPDATE supplier_offers
       SET CURRENT_PUBLIC_PRICE = NULL,
           CURRENT_BENEFIT_PRICE = NULL,
           CURRENT_STOCK_STATUS = 'UNKNOWN',
           CURRENT_PRICE_DT = NULL,
           UPDATED_DT = NOW()
       WHERE SUPPLIER_OFFER_ID = ?`,
      [offerId],
    );
    return;
  }
  await connection.execute(
    `INSERT INTO supplier_offer_prices
      (SUPPLIER_OFFER_ID, PUBLIC_PRICE, BENEFIT_PRICE, DISCOUNT_AMOUNT, STOCK_STATUS, SOURCE_TYPE, CAPTURED_DT, RAW_JSON)
     VALUES (?, ?, ?, ?, ?, 'CRAWL', NOW(), ?)`,
    [offerId, publicPrice ?? 0, benefitPrice, discountAmount, stockStatus, json(product.pricing)],
  );
  await connection.execute(
    `UPDATE supplier_offers
     SET CURRENT_PUBLIC_PRICE = ?,
         CURRENT_BENEFIT_PRICE = ?,
         CURRENT_STOCK_STATUS = ?,
         CURRENT_PRICE_DT = NOW(),
         UPDATED_DT = NOW()
     WHERE SUPPLIER_OFFER_ID = ?`,
    [publicPrice, benefitPrice, stockStatus, offerId],
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
    await connection.beginTransaction();
    try {
      const partId = await upsertPart(connection, product, categoryId);
      const supplierProductId = await upsertSupplierProduct(connection, product, supplierId, crawlTargetId);
      await upsertOfferAndPrice(connection, product, supplierProductId, partId);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    }
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
