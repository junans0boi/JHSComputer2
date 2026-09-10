#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { parseSpecAttributes } from '../compuzone/spec-parser.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  return [key, rest.join('=') || 'true'];
}));

const env = loadEnv(args.env ?? '../JHSComputer_Server/.env');
const dryRun = args['dry-run'] === 'true';
const approvalRequired = env.PUBLIC_PART_APPROVAL_REQUIRED === 'true'
  || (env.PUBLIC_PART_APPROVAL_REQUIRED !== 'false' && env.NODE_ENV === 'production');

const db = await mysql.createConnection({
  host: env.DB_HOST ?? 'localhost',
  port: Number(env.DB_PORT ?? 3306),
  user: env.DB_USERNAME ?? 'jhs_dev',
  password: env.DB_PASSWORD ?? 'jhs_dev_password',
  database: env.DB_DATABASE ?? 'jhs_computer_dev',
  charset: 'utf8mb4',
});

const recipes = [
  {
    slug: 'jhs-real-qhd-7500f-rtx5060ti',
    title: '실상품 기준 QHD 가성비 게이밍 PC',
    subtitle: '현재 판매 목록과 JHS 기준으로 정리한 라이젠 + 엔비디아 추천 견적',
    summary: '라이젠 5 7500F와 RTX 5060 Ti 계열을 중심으로 QHD 게임 입문에 맞춘 실상품 추천 견적입니다.',
    budget: 1400000,
    purpose: 'GAME',
    cpuBrand: 'RYZEN',
    gpuBrand: 'NVIDIA',
    comboType: 'RYZEN_NVIDIA',
    selectors: [
      { category: 'CPU', label: 'CPU', include: ['7500F'], prefer: ['대리점정품', '멀티팩'], maxPrice: 230000 },
      { category: 'CPU_COOLER', label: '쿨러', includeAny: ['PALADIN', 'RC', 'AG400', '공랭'], maxPrice: 70000, optional: true },
      { category: 'MAINBOARD', label: '메인보드', include: ['B650'], includeAny: ['DDR5', 'M'], maxPrice: 220000 },
      { category: 'RAM', label: 'RAM', include: ['DDR5'], maxPrice: 200000 },
      { category: 'GPU', label: '그래픽카드', include: ['5060'], includeAny: ['Ti', 'TI'], maxPrice: 750000 },
      { category: 'SSD', label: 'SSD', includeAny: ['M.2', 'NVMe'], maxPrice: 180000 },
      { category: 'PSU', label: '파워', includeAny: ['750W', '700W'], maxPrice: 160000 },
      { category: 'CASE', label: '케이스', includeAny: ['미들타워', 'MIDDLE', '메쉬', '메시'], prefer: ['Master M60'], maxPrice: 130000, requireImage: true },
    ],
  },
  {
    slug: 'jhs-real-fhd-i5-rtx5060-popular',
    title: '실상품 기준 FHD 144Hz 인기 게이밍 PC',
    subtitle: 'DB 인기 상품 위주로 구성한 인텔 + 엔비디아 표준 추천 견적',
    summary: 'FHD 환경에서 롤, 발로란트, 오버워치 2를 안정적으로 즐기기 위한 RTX 5060급 실상품 기반 인기 구성입니다.',
    budget: 1200000,
    purpose: 'GAME',
    cpuBrand: 'INTEL',
    gpuBrand: 'NVIDIA',
    comboType: 'INTEL_NVIDIA',
    selectors: [
      { category: 'CPU', label: 'CPU', includeAny: ['12400F', '14400F', '13400F'], prefer: ['정품', '쿨러포함'], maxPrice: 270000 },
      { category: 'CPU_COOLER', label: '쿨러', includeAny: ['PALADIN', 'RC', 'AG400', '공랭'], maxPrice: 60000, optional: true },
      { category: 'MAINBOARD', label: '메인보드', includeAny: ['B760', 'H610'], maxPrice: 170000 },
      { category: 'RAM', label: 'RAM', includeAny: ['DDR5', 'DDR4'], maxPrice: 160000 },
      { category: 'GPU', label: '그래픽카드', includeAny: ['5060', '4060'], maxPrice: 900000 },
      { category: 'SSD', label: 'SSD', includeAny: ['M.2', 'NVMe'], maxPrice: 180000 },
      { category: 'PSU', label: '파워', includeAny: ['700W', '650W', '600W'], maxPrice: 200000 },
      { category: 'CASE', label: '케이스', includeAny: ['미들타워', 'MIDDLE', '메쉬', '메시'], prefer: ['R150'], maxPrice: 100000, requireImage: true },
    ],
  },
  {
    slug: 'jhs-real-benchmark-9800x3d-rx9070xt',
    title: '성능 데이터 기반 QHD 고성능 게이밍 PC',
    subtitle: 'JHS 성능 데이터와 실상품 가격을 함께 확인하는 라이젠 + 라데온 구성',
    summary: '라이젠 7 9800X3D와 RX 9070 XT 조합을 기준으로 QHD 고주사율 게임을 겨냥한 고성능 구성입니다.',
    budget: 3200000,
    purpose: 'GAME',
    cpuBrand: 'RYZEN',
    gpuBrand: 'AMD',
    comboType: 'RYZEN_AMD',
    selectors: [
      { category: 'CPU', label: 'CPU', include: ['9800X3D'], maxPrice: 900000 },
      { category: 'CPU_COOLER', label: '쿨러', includeAny: ['PA120', 'RC', '공랭', '수랭'], maxPrice: 200000, optional: true },
      { category: 'MAINBOARD', label: '메인보드', includeAny: ['B850', 'X870'], maxPrice: 500000 },
      { category: 'RAM', label: 'RAM', include: ['DDR5'], maxPrice: 350000 },
      { category: 'GPU', label: '그래픽카드', include: ['9070 XT'], maxPrice: 1900000 },
      { category: 'SSD', label: 'SSD', includeAny: ['M.2', 'NVMe'], maxPrice: 250000 },
      { category: 'PSU', label: '파워', includeAny: ['850W', '1000W', '1200W'], maxPrice: 250000 },
      { category: 'CASE', label: '케이스', includeAny: ['미들타워', 'MIDDLE', '메쉬', '메시'], prefer: ['D6 MESH'], maxPrice: 200000, requireImage: true },
    ],
  },
  {
    slug: 'jhs-real-fhd-i3-12100f-rtx3050',
    title: '실상품 기준 FHD 입문 게이밍 PC',
    subtitle: '가벼운 온라인 게임과 일상 작업을 위한 인텔 + 엔비디아 구성',
    summary: 'i3-12100F와 RTX 3050을 중심으로 FHD 게임을 처음 시작하는 사용자에게 맞춘 현실적인 입문 구성입니다.',
    budget: 900000,
    purpose: 'GAME',
    cpuBrand: 'INTEL',
    gpuBrand: 'NVIDIA',
    comboType: 'INTEL_NVIDIA',
    selectors: [
      { category: 'CPU', label: 'CPU', include: ['12100F'], maxPrice: 220000 },
      { category: 'CPU_COOLER', label: '쿨러', includeAny: ['PALADIN', 'RC', '공랭'], maxPrice: 50000, optional: true },
      { category: 'MAINBOARD', label: '메인보드', includeAny: ['H610'], maxPrice: 130000 },
      { category: 'RAM', label: 'RAM', include: ['DDR4'], maxPrice: 160000 },
      { category: 'GPU', label: '그래픽카드', include: ['RTX 3050'], maxPrice: 550000 },
      { category: 'SSD', label: 'SSD', includeAny: ['M.2', 'NVMe'], maxPrice: 180000 },
      { category: 'PSU', label: '파워', includeAny: ['600W', '650W', '700W'], maxPrice: 150000 },
      { category: 'CASE', label: '케이스', includeAny: ['미들타워', 'MIDDLE', '메쉬', '메시'], prefer: ['NCORE G30'], maxPrice: 100000, requireImage: true },
    ],
  },
  {
    slug: 'jhs-real-fhd-7600-rtx5060',
    title: '실상품 기준 FHD 고주사율 게이밍 PC',
    subtitle: '라이젠 플랫폼의 업그레이드 여지와 RTX 5060의 균형을 맞춘 구성',
    summary: '라이젠 5 7600과 RTX 5060을 조합해 FHD 고주사율 게임과 다음 세대 업그레이드를 함께 고려했습니다.',
    budget: 1500000,
    purpose: 'GAME',
    cpuBrand: 'RYZEN',
    gpuBrand: 'NVIDIA',
    comboType: 'RYZEN_NVIDIA',
    selectors: [
      { category: 'CPU', label: 'CPU', include: ['7600'], maxPrice: 360000 },
      { category: 'CPU_COOLER', label: '쿨러', includeAny: ['PALADIN', 'RC', 'AG400', '공랭'], maxPrice: 70000, optional: true },
      { category: 'MAINBOARD', label: '메인보드', includeAny: ['B650', 'A620'], maxPrice: 220000 },
      { category: 'RAM', label: 'RAM', include: ['DDR5'], maxPrice: 240000 },
      { category: 'GPU', label: '그래픽카드', include: ['RTX 5060'], maxPrice: 850000 },
      { category: 'SSD', label: 'SSD', includeAny: ['M.2', 'NVMe'], maxPrice: 180000 },
      { category: 'PSU', label: '파워', includeAny: ['650W', '700W', '750W'], maxPrice: 170000 },
      { category: 'CASE', label: '케이스', includeAny: ['미들타워', 'MIDDLE', '메쉬', '메시'], prefer: ['DS900'], maxPrice: 130000, requireImage: true },
    ],
  },
  {
    slug: 'jhs-real-qhd-7800x3d-rx9070xt',
    title: '실상품 기준 QHD 상급 게이밍 PC',
    subtitle: '높은 게임 프레임과 AM5 플랫폼 확장성을 함께 보는 구성',
    summary: '라이젠 7 7800X3D와 RX 9070 XT를 중심으로 QHD 고주사율 게임에 초점을 맞춘 상급 구성입니다.',
    budget: 3000000,
    purpose: 'GAME',
    cpuBrand: 'RYZEN',
    gpuBrand: 'AMD',
    comboType: 'RYZEN_AMD',
    selectors: [
      { category: 'CPU', label: 'CPU', include: ['7800X3D'], maxPrice: 650000 },
      { category: 'CPU_COOLER', label: '쿨러', includeAny: ['PA120', 'RC', '공랭', '수랭'], maxPrice: 180000, optional: true },
      { category: 'MAINBOARD', label: '메인보드', includeAny: ['B650', 'B850', 'X870'], maxPrice: 360000 },
      { category: 'RAM', label: 'RAM', include: ['DDR5'], maxPrice: 350000 },
      { category: 'GPU', label: '그래픽카드', include: ['9070 XT'], maxPrice: 1900000 },
      { category: 'SSD', label: 'SSD', includeAny: ['M.2', 'NVMe'], maxPrice: 250000 },
      { category: 'PSU', label: '파워', includeAny: ['850W', '1000W', '1200W'], maxPrice: 250000 },
      { category: 'CASE', label: '케이스', includeAny: ['미들타워', 'MIDDLE', '메쉬', '메시'], prefer: ['D4 MESH'], maxPrice: 200000, requireImage: true },
    ],
  },
  {
    slug: 'jhs-real-qhd-i5-14400f-rtx5060',
    title: '실상품 기준 QHD 균형 게이밍 PC',
    subtitle: '게임·작업을 함께 고려한 인텔 + 엔비디아 균형 구성',
    summary: 'i5-14400F와 RTX 5060을 기반으로 게임과 일반 작업을 한 대에서 처리하려는 사용자에게 맞춘 균형형입니다.',
    budget: 1700000,
    purpose: 'GAME',
    cpuBrand: 'INTEL',
    gpuBrand: 'NVIDIA',
    comboType: 'INTEL_NVIDIA',
    selectors: [
      { category: 'CPU', label: 'CPU', include: ['14400F'], maxPrice: 300000 },
      { category: 'CPU_COOLER', label: '쿨러', includeAny: ['PALADIN', 'RC', 'AG400', '공랭'], maxPrice: 70000, optional: true },
      { category: 'MAINBOARD', label: '메인보드', includeAny: ['B760', 'H610'], maxPrice: 200000 },
      { category: 'RAM', label: 'RAM', includeAny: ['DDR4', 'DDR5'], maxPrice: 240000 },
      { category: 'GPU', label: '그래픽카드', include: ['RTX 5060'], maxPrice: 850000 },
      { category: 'SSD', label: 'SSD', includeAny: ['M.2', 'NVMe'], maxPrice: 180000 },
      { category: 'PSU', label: '파워', includeAny: ['650W', '700W', '750W'], maxPrice: 170000 },
      { category: 'CASE', label: '케이스', includeAny: ['미들타워', 'MIDDLE', '메쉬', '메시'], prefer: ['NCORE 커넬'], maxPrice: 130000, requireImage: true },
    ],
  },
  {
    slug: 'jhs-real-ai-9800x3d-rtx5090',
    title: 'AI 추론용 VRAM 우선 워크스테이션',
    subtitle: 'CUDA 활용과 32GB VRAM 여유를 먼저 보는 JHS 작업용 구성',
    summary: '라이젠 7 9800X3D와 RTX 5090을 중심으로 로컬 AI 추론과 고해상도 작업을 함께 고려한 구성입니다.',
    budget: 8500000,
    purpose: 'AI',
    cpuBrand: 'RYZEN',
    gpuBrand: 'NVIDIA',
    comboType: 'RYZEN_NVIDIA',
    selectors: [
      { category: 'CPU', label: 'CPU', include: ['9800X3D'], maxPrice: 900000 },
      { category: 'CPU_COOLER', label: '쿨러', includeAny: ['PA120', 'RC', '공랭', '수랭'], maxPrice: 220000, optional: true },
      { category: 'MAINBOARD', label: '메인보드', includeAny: ['B850', 'X870'], maxPrice: 550000 },
      { category: 'RAM', label: 'RAM', include: ['DDR5'], maxPrice: 550000 },
      { category: 'GPU', label: '그래픽카드', include: ['RTX 5090'], maxPrice: 9000000 },
      { category: 'SSD', label: 'SSD', includeAny: ['M.2', 'NVMe'], maxPrice: 300000 },
      { category: 'PSU', label: '파워', includeAny: ['1000W', '1200W', '1600W'], maxPrice: 350000 },
      { category: 'CASE', label: '케이스', includeAny: ['미들타워', 'MIDDLE', '메쉬', '메시'], prefer: ['DLX21'], maxPrice: 250000, requireImage: true },
    ],
  },
];
const legacyDemoSlugs = ['gaming-entry-2026', 'gaming-standard-2026', 'gaming-premium-2026', 'office-budget-2026'];

try {
  if (!dryRun) {
    const placeholders = recipes.map(() => '?').join(', ');
    await db.query(`DELETE FROM recommendation_posts WHERE SOURCE_TYPE = 'JHS_REAL_DB' OR SLUG IN (${placeholders})`, recipes.map((recipe) => recipe.slug));
    const legacyPlaceholders = legacyDemoSlugs.map(() => '?').join(', ');
    await db.query(
      `UPDATE recommendation_posts SET STATUS = 'DRAFT', PUBLISHED_DT = NULL WHERE SLUG IN (${legacyPlaceholders}) AND SOURCE_TYPE <> 'JHS_REAL_DB'`,
      legacyDemoSlugs,
    );
  }

  const seenRecommendationKeys = new Set();
  for (const recipe of recipes) {
    const parts = [];
    for (const selector of recipe.selectors) {
      const part = await selectRealPart(selector);
      if (!part && !selector.optional) throw new Error(`No real part found for ${recipe.slug} / ${selector.category}`);
      if (part) parts.push({ ...part, label: selector.label });
    }

    assertCompatibleParts(parts, recipe.slug);

    const total = parts.reduce((sum, part) => sum + part.price * part.quantity, 0);
    const casePart = parts.find((part) => part.category === 'CASE');
    const cpu = parts.find((part) => part.category === 'CPU');
    const gpu = parts.find((part) => part.category === 'GPU');
    const post = {
      ...recipe,
      total,
      targetBudget: Math.ceil((total + 60000) / 100000) * 100000,
      cpuModel: simplifyCpuModel(cpu?.name ?? ''),
      gpuModel: simplifyGpuModel(gpu?.name ?? ''),
      thumbnailImageUrl: casePart?.imageUrl ?? casePart?.thumbnailUrl ?? null,
      casePartName: casePart?.name ?? null,
      bodyMd: buildBody(recipe, parts, total),
      games: [],
    };

    const recommendationKey = `${post.purpose}:${post.cpuModel}:${post.gpuModel}:${Math.round(post.targetBudget / 100000)}`;
    if (seenRecommendationKeys.has(recommendationKey)) {
      console.log(`Skipped duplicate recommendation: ${recipe.slug}`);
      continue;
    }
    seenRecommendationKeys.add(recommendationKey);

    post.games = await loadBenchmarkGames(post.cpuModel, post.gpuModel);

    if (dryRun) {
      console.log(JSON.stringify({ post, parts }, null, 2));
    } else {
      await upsertPost(post, parts);
      console.log(`Created ${post.slug}: ${post.title} (${(total + 60000).toLocaleString('ko-KR')}원)`);
    }
  }
} finally {
  await db.end();
}

async function selectRealPart(selector) {
  const where = [
    'c.CATEGORY_CODE = ?',
    "p.STATUS = 'ACTIVE'",
    "so.CURRENT_PRICE_DT IS NOT NULL",
    "so.CURRENT_STOCK_STATUS IN ('AVAILABLE', 'IN_STOCK', 'LOW_STOCK')",
    'price.PRICE > 0',
    "p.CANONICAL_NAME NOT LIKE '%합본%'",
    "p.CANONICAL_NAME NOT LIKE '%+%'",
    "sp.PRODUCT_NAME NOT LIKE '%합본%'",
  ];
  const values = [selector.category];

  where.push("(p.IS_ADMIN_APPROVED = 'Y' OR p.POPULARITY_SCORE > 0 OR COALESCE(sp.REVIEW_COUNT, 0) > 0 OR p.SPEC_STATUS IN ('VERIFIED', 'PARSED_FROM_CRAWL'))");
  if (approvalRequired) where.push("p.IS_ADMIN_APPROVED = 'Y'");

  if (selector.include?.length) {
    for (const keyword of selector.include) {
      where.push('(p.CANONICAL_NAME LIKE ? OR sp.PRODUCT_NAME LIKE ? OR so.OFFER_NAME LIKE ?)');
      values.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }
  }
  if (selector.includeAny?.length) {
    where.push(`(${selector.includeAny.map(() => '(p.CANONICAL_NAME LIKE ? OR sp.PRODUCT_NAME LIKE ? OR so.OFFER_NAME LIKE ?)').join(' OR ')})`);
    for (const keyword of selector.includeAny) values.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }
  if (selector.maxPrice) {
    where.push('price.PRICE <= ?');
    values.push(selector.maxPrice);
  }
  if (selector.requireImage) {
    where.push('(sp.IMAGE_URL IS NOT NULL OR p.THUMBNAIL_URL IS NOT NULL)');
  }

  const preferCases = (selector.prefer ?? []).map((keyword) => `WHEN p.CANONICAL_NAME LIKE ${db.escape(`%${keyword}%`)} THEN 0`).join(' ');
  const preferSql = preferCases ? `CASE ${preferCases} ELSE 1 END` : '1';
  const [rows] = await db.query(
    `
    SELECT
      c.CATEGORY_CODE AS category,
      p.PART_ID AS partId,
      p.CANONICAL_NAME AS name,
      p.MANUFACTURER AS manufacturer,
      p.MODEL_NAME AS modelName,
      p.THUMBNAIL_URL AS thumbnailUrl,
      sp.EXTERNAL_PRODUCT_ID AS productNo,
      sp.IMAGE_URL AS imageUrl,
      sp.PRODUCT_URL AS productUrl,
      sp.SUMMARY_SPEC_TEXT AS specText,
      COALESCE(sp.REVIEW_COUNT, 0) AS reviewCount,
      price.PRICE AS price
    FROM parts p
    JOIN part_categories c ON c.PART_CATEGORY_ID = p.PART_CATEGORY_ID
    JOIN supplier_offers so ON so.PART_ID = p.PART_ID AND so.IS_ACTIVE = 'Y'
    JOIN supplier_products sp ON sp.SUPPLIER_PRODUCT_ID = so.SUPPLIER_PRODUCT_ID AND sp.IS_ACTIVE = 'Y'
    JOIN (
        SELECT SUPPLIER_OFFER_ID, COALESCE(BENEFIT_PRICE, PUBLIC_PRICE) AS PRICE
      FROM (
        SELECT SUPPLIER_OFFER_ID, BENEFIT_PRICE, PUBLIC_PRICE,
               ROW_NUMBER() OVER (PARTITION BY SUPPLIER_OFFER_ID ORDER BY CAPTURED_DT DESC) AS rowNumber
        FROM supplier_offer_prices
      ) latest
      WHERE latest.rowNumber = 1
    ) price ON price.SUPPLIER_OFFER_ID = so.SUPPLIER_OFFER_ID
    WHERE ${where.join(' AND ')}
    ORDER BY
      ${preferSql},
      p.ADMIN_PRIORITY DESC,
      p.POPULARITY_SCORE DESC,
      COALESCE(sp.REVIEW_COUNT, 0) DESC,
      price.PRICE ASC
    LIMIT 1
    `,
    values,
  );

  if (!rows[0]) return null;
  return {
    category: rows[0].category,
    partId: rows[0].partId,
    label: selector.label,
    name: rows[0].name,
    price: Number(rows[0].price),
    quantity: 1,
    productNo: rows[0].productNo,
    imageUrl: rows[0].imageUrl ?? rows[0].thumbnailUrl,
    specText: rows[0].specText,
    reviewCount: rows[0].reviewCount,
  };
}

async function loadBenchmarkGames(cpuModel, gpuModel) {
  const cpuKeys = modelKeys(cpuModel);
  const gpuKeys = modelKeys(gpuModel);
  if (!cpuKeys.length || !gpuKeys.length) return [];

  const [rows] = await db.query(
    `SELECT g.GAME_NAME AS gameName,
            c.RESOLUTION AS resolution,
            c.BEST_QUALITY AS qualityPreset,
            c.DISPLAY_FPS_MIN AS fpsMin,
            c.DISPLAY_FPS_MAX AS fpsMax,
            c.COMFORT_GRADE AS comfortGrade
     FROM benchmark_combo_game_results c
     JOIN benchmark_games g ON g.BENCHMARK_GAME_ID = c.BENCHMARK_GAME_ID
     WHERE (${cpuKeys.map(() => "REPLACE(LOWER(c.CPU_MODEL), '-', '') LIKE ?").join(' OR ')})
       AND (${gpuKeys.map(() => "REPLACE(LOWER(c.GPU_MODEL), '-', '') LIKE ?").join(' OR ')})
     ORDER BY g.GAME_NAME ASC, FIELD(c.RESOLUTION, 'FHD', 'QHD', 'UHD')`,
    [...cpuKeys, ...gpuKeys].map((key) => `%${key}%`),
  );
  return rows;
}

function modelKeys(value) {
  const normalized = String(value ?? '').toLowerCase();
  const compact = normalized.replace(/[^a-z0-9]/g, '');
  const modelNumber = normalized.match(/\b\d{4,5}(?:x3d|xt|gre|ti|super|f|k)?\b/i)?.[0]?.toLowerCase();
  return [...new Set([compact, modelNumber].filter(Boolean))];
}

function assertCompatibleParts(parts, recipeSlug) {
  const cpu = parts.find((part) => part.category === 'CPU');
  const board = parts.find((part) => part.category === 'MAINBOARD');
  const ram = parts.find((part) => part.category === 'RAM');
  const gpu = parts.find((part) => part.category === 'GPU');
  const psu = parts.find((part) => part.category === 'PSU');
  const pcCase = parts.find((part) => part.category === 'CASE');
  const cooler = parts.find((part) => part.category === 'CPU_COOLER');
  const cpuAttrs = cpu ? parseSpecAttributes({ name: cpu.name, summarySpecText: cpu.specText }) : null;
  const boardAttrs = board ? parseSpecAttributes({ name: board.name, summarySpecText: board.specText }) : null;
  const ramAttrs = ram ? parseSpecAttributes({ name: ram.name, summarySpecText: ram.specText }) : null;
  const gpuAttrs = gpu ? parseSpecAttributes({ name: gpu.name, summarySpecText: gpu.specText }) : null;
  const psuAttrs = psu ? parseSpecAttributes({ name: psu.name, summarySpecText: psu.specText }) : null;
  const caseAttrs = pcCase ? parseSpecAttributes({ name: pcCase.name, summarySpecText: pcCase.specText }) : null;
  const coolerAttrs = cooler ? parseSpecAttributes({ name: cooler.name, summarySpecText: cooler.specText }) : null;

  if (!cpuAttrs?.socket || !boardAttrs?.socket || !ramAttrs?.memoryType) {
    throw new Error(`Insufficient CPU/mainboard/RAM specs in ${recipeSlug}`);
  }

  if (cpuAttrs?.socket && boardAttrs?.socket && cpuAttrs.socket !== boardAttrs.socket) {
    throw new Error(`Incompatible CPU/mainboard in ${recipeSlug}: ${cpuAttrs.socket} vs ${boardAttrs.socket}`);
  }
  if (boardAttrs?.memoryType && ramAttrs?.memoryType && boardAttrs.memoryType !== ramAttrs.memoryType) {
    throw new Error(`Incompatible mainboard/RAM in ${recipeSlug}: ${boardAttrs.memoryType} vs ${ramAttrs.memoryType}`);
  }
  if (gpuAttrs?.gpuLengthMm && caseAttrs?.gpuLengthMm && gpuAttrs.gpuLengthMm > caseAttrs.gpuLengthMm) {
    throw new Error(`GPU is too long for case in ${recipeSlug}: ${gpuAttrs.gpuLengthMm}mm > ${caseAttrs.gpuLengthMm}mm`);
  }
  if (gpuAttrs?.recommendedPsuW && psuAttrs?.wattage && psuAttrs.recommendedPsuW > psuAttrs.wattage) {
    throw new Error(`PSU is undersized in ${recipeSlug}: ${psuAttrs.wattage}W < ${gpuAttrs.recommendedPsuW}W`);
  }
  if (coolerAttrs?.coolerHeightMm && caseAttrs?.coolerHeightMm && coolerAttrs.coolerHeightMm > caseAttrs.coolerHeightMm) {
    throw new Error(`CPU cooler is too tall for case in ${recipeSlug}: ${coolerAttrs.coolerHeightMm}mm > ${caseAttrs.coolerHeightMm}mm`);
  }
}

async function upsertPost(post, parts) {
  await db.beginTransaction();
  try {
    await db.query(
      `
      INSERT INTO recommendation_posts
        (SLUG, TITLE, SUBTITLE, SUMMARY, BODY_MD, STATUS, SOURCE_TYPE, TARGET_BUDGET, TOTAL_PRICE, PURPOSE, CPU_BRAND, GPU_BRAND, CPU_MODEL, GPU_MODEL, COMBO_TYPE, THUMBNAIL_IMAGE_URL, CASE_PART_NAME, POPULARITY_SCORE, PUBLISHED_DT, RAW_JSON)
      VALUES (?, ?, ?, ?, ?, 'PUBLISHED', 'JHS_REAL_DB', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      `,
      [
        post.slug,
        post.title,
        post.subtitle,
        post.summary,
        post.bodyMd,
        post.targetBudget,
        post.total + 60000,
        post.purpose,
        post.cpuBrand,
        post.gpuBrand,
        post.cpuModel,
        post.gpuModel,
        post.comboType,
        post.thumbnailImageUrl,
        post.casePartName,
        1500,
        JSON.stringify({ generatedFrom: 'real-db-parts', generatedAt: new Date().toISOString() }),
      ],
    );
    const [[saved]] = await db.query('SELECT RECOMMENDATION_POST_ID AS id FROM recommendation_posts WHERE SLUG = ?', [post.slug]);
    await db.query('DELETE FROM recommendation_post_parts WHERE RECOMMENDATION_POST_ID = ?', [saved.id]);
    await db.query('DELETE FROM recommendation_post_games WHERE RECOMMENDATION_POST_ID = ?', [saved.id]);

    for (const [index, part] of parts.entries()) {
      await db.query(
        `
        INSERT INTO recommendation_post_parts
          (RECOMMENDATION_POST_ID, PART_CATEGORY, PART_LABEL, PART_NAME, PART_PRICE, QUANTITY, PRODUCT_NO, IMAGE_URL, SPEC_TEXT, SORT_ORDER)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [saved.id, part.category, part.label, part.name, part.price, part.quantity, part.productNo, part.imageUrl, part.specText, (index + 1) * 10],
      );
    }

    for (const game of post.games) {
      await db.query(
        `
        INSERT INTO recommendation_post_games
          (RECOMMENDATION_POST_ID, GAME_NAME, RESOLUTION, QUALITY_PRESET, FPS_MIN, FPS_MAX, COMFORT_GRADE)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [saved.id, game.gameName, game.resolution, game.qualityPreset, game.fpsMin, game.fpsMax, game.comfortGrade],
      );
    }

    await db.commit();
  } catch (error) {
    await db.rollback();
    throw error;
  }
}

function buildBody(recipe, parts, subtotal) {
  const cpu = parts.find((part) => part.category === 'CPU');
  const gpu = parts.find((part) => part.category === 'GPU');
  const pcCase = parts.find((part) => part.category === 'CASE');
  return [
    '## 이런 분께 추천합니다',
    `- ${recipe.budget.toLocaleString('ko-KR')}원 안팎에서 현재 판매 목록을 기준으로 견적을 비교하고 싶은 분`,
    `- ${cpu?.name ?? 'CPU'}와 ${gpu?.name ?? 'GPU'} 조합을 기준으로 게임 PC를 맞추려는 분`,
    '- 실제 판매 단위의 상품명·가격·이미지를 바탕으로 구성 근거를 확인하고 싶은 분',
    '',
    '## JHS 코멘트',
    `이 견적은 JHS가 정한 용도·호환성·가격 기준과 현재 판매 단위를 바탕으로 구성했습니다. 부품 합계는 ${subtotal.toLocaleString('ko-KR')}원, 조립/배송 예상 60,000원을 포함한 안내가는 ${(subtotal + 60000).toLocaleString('ko-KR')}원입니다.`,
    pcCase ? `썸네일은 실제 선택된 케이스인 ${pcCase.name} 이미지를 사용합니다.` : '케이스 이미지는 실제 DB 이미지가 있는 상품으로 보강할 수 있습니다.',
    '주문 전에는 재고, 가격 변동, 장착 호환성을 한 번 더 확인합니다.',
  ].join('\n');
}

function simplifyCpuModel(name) {
  const ryzen = name.match(/라이젠\s*([3579])\s*[가-힣A-Za-z]*\s*([0-9]{4,5}(?:X3D|X|F|G|GT)?|[0-9]{4,5}[A-Z]*)/i);
  const intel = name.match(/(?:i[3579]|Ultra\s*\d)[- ]?[0-9]{3,5}[A-Z]*/i);
  if (ryzen) return `Ryzen${ryzen[1]} ${ryzen[2].toUpperCase()}`;
  if (intel) return intel[0].replace(/\s+/g, ' ');
  return name.slice(0, 80);
}

function simplifyGpuModel(name) {
  const rtx = name.match(/RTX\s*[0-9]{4}(?:\s*Ti|\s*SUPER)?/i);
  const rx = name.match(/RX\s*[0-9]{4}(?:\s*XT|\s*GRE)?/i);
  if (rtx) return rtx[0].replace(/\s+/g, ' ');
  if (rx) return rx[0].replace(/\s+/g, '').replace(/^RX/, 'RX ');
  return name.slice(0, 80);
}

function loadEnv(filePath) {
  const absolute = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolute)) return process.env;
  const parsed = {};
  for (const line of fs.readFileSync(absolute, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    parsed[trimmed.slice(0, index)] = trimmed.slice(index + 1).replace(/^['"]|['"]$/g, '');
  }
  return { ...process.env, ...parsed };
}
