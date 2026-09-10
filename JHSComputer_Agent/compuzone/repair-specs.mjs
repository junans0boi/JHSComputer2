#!/usr/bin/env node
import path from 'node:path';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { parseSpecAttributes } from './spec-parser.mjs';
import { hasRequiredSpecKey, upsertSpec } from './spec-db-upsert.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  return [key, rest.join('=') || 'true'];
}));

dotenv.config({ path: path.resolve(args.env ?? '../JHSComputer_Server/.env') });
const dryRun = args['dry-run'] === 'true';
const connection = await mysql.createConnection({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USERNAME ?? 'jhs_dev',
  password: process.env.DB_PASSWORD ?? 'hollywood',
  database: process.env.DB_DATABASE ?? 'jhs_computer_dev',
  charset: 'utf8mb4',
});

const upserted = new Map();
const skipped = new Map();

try {
  const [rows] = await connection.query(`
    SELECT part.PART_ID AS partId,
           category.CATEGORY_CODE AS category,
           COALESCE(source.PRODUCT_NAME, part.CANONICAL_NAME) AS name,
           source.SUMMARY_SPEC_TEXT AS summarySpecText,
           cpu.SOCKET AS currentSocket,
           mainboard.SOCKET AS currentMainboardSocket,
           ram.MEMORY_TYPE AS currentMemoryType,
           ram.CAPACITY_GB AS currentRamCapacityGb,
           storage.CAPACITY_GB AS currentStorageCapacityGb,
           storage.FORM_FACTOR AS currentStorageFormFactor,
           psu.RATED_WATTAGE AS currentRatedWattage,
           psu.FORM_FACTOR AS currentPsuFormFactor,
           cooler.COOLER_TYPE AS currentCoolerType
    FROM parts part
    JOIN part_categories category ON category.PART_CATEGORY_ID = part.PART_CATEGORY_ID
    JOIN (
      SELECT offer.PART_ID,
             product.PRODUCT_NAME,
             product.SUMMARY_SPEC_TEXT,
             ROW_NUMBER() OVER (
               PARTITION BY offer.PART_ID
               ORDER BY product.SPEC_CAPTURED_DT DESC, product.SUPPLIER_PRODUCT_ID DESC
             ) AS rowNumber
      FROM supplier_offers offer
      JOIN supplier_products product ON product.SUPPLIER_PRODUCT_ID = offer.SUPPLIER_PRODUCT_ID
      WHERE offer.IS_ACTIVE = 'Y'
        AND product.IS_ACTIVE = 'Y'
    ) source ON source.PART_ID = part.PART_ID AND source.rowNumber = 1
    LEFT JOIN cpu_specs cpu ON cpu.PART_ID = part.PART_ID
    LEFT JOIN mainboard_specs mainboard ON mainboard.PART_ID = part.PART_ID
    LEFT JOIN ram_specs ram ON ram.PART_ID = part.PART_ID
    LEFT JOIN storage_specs storage ON storage.PART_ID = part.PART_ID
    LEFT JOIN psu_specs psu ON psu.PART_ID = part.PART_ID
    LEFT JOIN cooler_specs cooler ON cooler.PART_ID = part.PART_ID
    WHERE part.STATUS = 'ACTIVE'
      AND category.CATEGORY_CODE IN ('CPU', 'MAINBOARD', 'RAM', 'SSD', 'GPU', 'PSU', 'CASE', 'CPU_COOLER')
    ORDER BY part.PART_ID
  `);

  console.log(`[repair] 대상 부품: ${rows.length}개${dryRun ? ' (dry-run)' : ''}`);
  for (const row of rows) {
    const attrs = parseSpecAttributes(row);
    const changed = dryRun
      ? hasRequiredSpecKey(row.category, attrs, currentSpec(row))
      : await upsertSpec(connection, row.partId, row.category, attrs, currentSpec(row));
    const bucket = changed ? upserted : skipped;
    bucket.set(row.category, (bucket.get(row.category) ?? 0) + 1);
  }
} finally {
  await connection.end();
}

console.log(`[repair] upsert 대상: ${formatCounts(upserted) || '없음'}`);
console.log(`[repair] 파싱 불충분: ${formatCounts(skipped) || '없음'}`);

function currentSpec(row) {
  if (row.category === 'CPU') return { socket: row.currentSocket };
  if (row.category === 'MAINBOARD') return { socket: row.currentMainboardSocket };
  if (row.category === 'RAM') return { memoryType: row.currentMemoryType, capacityGb: row.currentRamCapacityGb };
  if (row.category === 'SSD') return { capacityGb: row.currentStorageCapacityGb, formFactor: row.currentStorageFormFactor };
  if (row.category === 'PSU') return { ratedWattage: row.currentRatedWattage, formFactor: row.currentPsuFormFactor };
  if (row.category === 'CPU_COOLER') return { coolerType: row.currentCoolerType };
  return {};
}

function formatCounts(counts) {
  return [...counts.entries()].map(([category, count]) => `${category}=${count}`).join(', ');
}
