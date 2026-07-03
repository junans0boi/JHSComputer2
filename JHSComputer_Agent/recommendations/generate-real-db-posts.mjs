#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  return [key, rest.join('=') || 'true'];
}));

const env = loadEnv(args.env ?? '../JHSComputer_Server/.env');
const dryRun = args['dry-run'] === 'true';

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
    title: '실상품 기준 120만원대 QHD 가성비 게이밍 PC',
    subtitle: 'DB에 저장된 실제 컴퓨존 상품으로 구성한 라이젠 + 엔비디아 추천 견적',
    summary: '라이젠 5 7500F와 RTX 5060 Ti 계열을 중심으로 QHD 게임 입문에 맞춘 실상품 추천 견적입니다.',
    budget: 1400000,
    purpose: 'GAME',
    cpuBrand: 'RYZEN',
    gpuBrand: 'NVIDIA',
    comboType: 'RYZEN_NVIDIA',
    games: [
      ['배틀그라운드', 'QHD', '높음', 95, 135, 'GOOD'],
      ['로스트아크', 'QHD', '높음', 120, 165, 'EXCELLENT'],
      ['발로란트', 'QHD', '높음', 220, 300, 'EXCELLENT'],
    ],
    selectors: [
      { category: 'CPU', label: 'CPU', include: ['7500F'], prefer: ['대리점정품', '멀티팩'], maxPrice: 230000 },
      { category: 'CPU_COOLER', label: '쿨러', includeAny: ['PALADIN', 'RC', 'AG400', '공랭'], maxPrice: 70000, optional: true },
      { category: 'MAINBOARD', label: '메인보드', include: ['B650'], includeAny: ['DDR5', 'M'], maxPrice: 220000 },
      { category: 'RAM', label: 'RAM', include: ['DDR5'], maxPrice: 200000 },
      { category: 'GPU', label: '그래픽카드', include: ['5060'], includeAny: ['Ti', 'TI'], maxPrice: 750000 },
      { category: 'SSD', label: 'SSD', includeAny: ['M.2', 'NVMe'], maxPrice: 180000 },
      { category: 'PSU', label: '파워', includeAny: ['750W', '700W'], maxPrice: 160000 },
      { category: 'CASE', label: '케이스', includeAny: ['미들타워', 'MIDDLE', '메쉬', '메시'], maxPrice: 130000, requireImage: true },
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
    games: [
      ['롤', 'FHD', '매우 높음', 240, 320, 'EXCELLENT'],
      ['발로란트', 'FHD', '높음', 240, 320, 'EXCELLENT'],
      ['오버워치 2', 'FHD', '높음', 150, 220, 'GOOD'],
    ],
    selectors: [
      { category: 'CPU', label: 'CPU', includeAny: ['12400F', '14400F', '13400F'], prefer: ['정품', '쿨러포함'], maxPrice: 270000 },
      { category: 'CPU_COOLER', label: '쿨러', includeAny: ['PALADIN', 'RC', 'AG400', '공랭'], maxPrice: 60000, optional: true },
      { category: 'MAINBOARD', label: '메인보드', includeAny: ['B760', 'H610'], maxPrice: 170000 },
      { category: 'RAM', label: 'RAM', includeAny: ['DDR5', 'DDR4'], maxPrice: 160000 },
      { category: 'GPU', label: '그래픽카드', includeAny: ['5060', '4060'], maxPrice: 550000 },
      { category: 'SSD', label: 'SSD', includeAny: ['M.2', 'NVMe'], maxPrice: 180000 },
      { category: 'PSU', label: '파워', includeAny: ['700W', '650W', '600W'], maxPrice: 120000 },
      { category: 'CASE', label: '케이스', includeAny: ['미들타워', 'MIDDLE', '메쉬', '메시'], maxPrice: 100000, requireImage: true },
    ],
  },
];

try {
  if (!dryRun) {
    await db.query(`DELETE FROM recommendation_posts WHERE SOURCE_TYPE IN ('JHS_MANUAL', 'JHS_REAL_DB') OR SLUG IN (?, ?)`, recipes.map((recipe) => recipe.slug));
  }

  for (const recipe of recipes) {
    const parts = [];
    for (const selector of recipe.selectors) {
      const part = await selectRealPart(selector);
      if (!part && !selector.optional) throw new Error(`No real part found for ${recipe.slug} / ${selector.category}`);
      if (part) parts.push({ ...part, label: selector.label });
    }

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
    };

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
  const where = ['c.CATEGORY_CODE = ?', "p.STATUS = 'ACTIVE'", 'price.PRICE > 0'];
  const values = [selector.category];

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
      SELECT SUPPLIER_OFFER_ID, MIN(COALESCE(BENEFIT_PRICE, PUBLIC_PRICE)) AS PRICE
      FROM supplier_offer_prices
      GROUP BY SUPPLIER_OFFER_ID
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
        [saved.id, ...game],
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
    `- ${recipe.budget.toLocaleString('ko-KR')}원 안팎에서 실제 판매 중인 부품으로 견적을 보고 싶은 분`,
    `- ${cpu?.name ?? 'CPU'}와 ${gpu?.name ?? 'GPU'} 조합을 기준으로 게임 PC를 맞추려는 분`,
    '- 가짜 대표명이 아니라 DB에 저장된 실제 상품명/가격/이미지 기준으로 확인하고 싶은 분',
    '',
    '## JHS 코멘트',
    `이 견적은 현재 DB의 실제 부품 상품과 최저 수집 가격을 기준으로 구성했습니다. 부품 합계는 ${subtotal.toLocaleString('ko-KR')}원, 조립/배송 예상 60,000원을 포함한 안내가는 ${(subtotal + 60000).toLocaleString('ko-KR')}원입니다.`,
    pcCase ? `썸네일은 실제 선택된 케이스인 ${pcCase.name} 이미지를 사용합니다.` : '케이스 이미지는 실제 DB 이미지가 있는 상품으로 보강할 수 있습니다.',
    '주문 전에는 재고, 가격 변동, 장착 호환성을 한 번 더 확인합니다.',
  ].join('\n');
}

function simplifyCpuModel(name) {
  const ryzen = name.match(/라이젠\s*\d+\s*[가-힣A-Za-z]*\s*([0-9]{4,5}(?:X3D|X|F|G|GT)?|[0-9]{4,5}[A-Z]*)/i);
  const intel = name.match(/(?:i[3579]|Ultra\s*\d)[- ]?[0-9]{3,5}[A-Z]*/i);
  if (ryzen) return `Ryzen ${ryzen[1]}`;
  if (intel) return intel[0].replace(/\s+/g, ' ');
  return name.slice(0, 80);
}

function simplifyGpuModel(name) {
  const rtx = name.match(/RTX\s*[0-9]{4}(?:\s*Ti|\s*SUPER)?/i);
  const rx = name.match(/RX\s*[0-9]{4}(?:\s*XT|\s*GRE)?/i);
  if (rtx) return rtx[0].replace(/\s+/g, ' ');
  if (rx) return rx[0].replace(/\s+/g, ' ');
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
