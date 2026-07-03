#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  return [key, rest.join('=') || 'true'];
}));

const env = loadEnv(args.env ?? '../JHSComputer_Server/.env');
const limit = Number(args.limit ?? 20);
const dryRun = args['dry-run'] === 'true';
const source = args.source ?? 'WANGGAPC';
const ollamaBaseUrl = args.ollama ?? process.env.OLLAMA_BASE_URL;
const ollamaModel = args.model ?? process.env.OLLAMA_MODEL ?? 'llama3.1:8b';

const connection = await mysql.createConnection({
  host: env.DB_HOST ?? 'localhost',
  port: Number(env.DB_PORT ?? 3306),
  user: env.DB_USERNAME ?? 'jhs_dev',
  password: env.DB_PASSWORD ?? 'jhs_dev_password',
  database: env.DB_DATABASE ?? 'jhs_computer_dev',
  charset: 'utf8mb4',
});

try {
  const builds = await loadSourceBuilds(connection, source, limit);
  console.log(`Loaded ${builds.length} source builds from ${source}`);

  for (const build of builds) {
    const parts = await loadBuildParts(connection, build.buildId);
    const post = await createJhsPost(build, parts);
    if (dryRun) {
      console.log(JSON.stringify(post, null, 2));
      continue;
    }
    await upsertPost(connection, post, parts, build.buildId);
    console.log(`Published/updated ${post.slug}`);
  }
} finally {
  await connection.end();
}

async function loadSourceBuilds(db, sourceCode, rowLimit) {
  const [rows] = await db.query(
    `
    SELECT
      b.BENCHMARK_BUILD_ID AS buildId,
      b.EXTERNAL_BUILD_ID AS externalBuildId,
      b.TITLE AS title,
      b.CPU_NAME AS cpuName,
      b.CPU_MODEL AS cpuModel,
      b.GPU_NAME AS gpuName,
      b.GPU_MODEL AS gpuModel,
      b.COMBO_KEY AS comboKey,
      CAST(JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.price')) AS UNSIGNED) AS price,
      JSON_UNQUOTE(JSON_EXTRACT(b.RAW_JSON, '$.url')) AS sourceUrl
    FROM benchmark_builds b
    JOIN benchmark_sources s ON s.BENCHMARK_SOURCE_ID = b.BENCHMARK_SOURCE_ID
    WHERE s.SOURCE_CODE = ?
      AND NOT EXISTS (
        SELECT 1 FROM recommendation_posts p
        WHERE p.SOURCE_BENCHMARK_BUILD_ID = b.BENCHMARK_BUILD_ID
      )
    ORDER BY price ASC, b.BENCHMARK_BUILD_ID DESC
    LIMIT ?
    `,
    [sourceCode, rowLimit],
  );
  return rows;
}

async function loadBuildParts(db, buildId) {
  const [rows] = await db.query(
    `
    SELECT
      PART_CATEGORY AS category,
      PART_LABEL AS label,
      PART_NAME AS name,
      PART_PRICE AS price,
      QUANTITY AS quantity,
      EXTERNAL_PRODUCT_CODE AS productNo,
      IMAGE_URL AS imageUrl,
      SPEC_TEXT AS specText
    FROM benchmark_build_parts
    WHERE BENCHMARK_BUILD_ID = ?
    ORDER BY
      CASE
        WHEN FIELD(PART_CATEGORY, 'CPU', 'COOLER', 'MAINBOARD', 'RAM', 'GPU', 'SSD', 'HDD', 'POWER', 'CASE', 'OS', 'SERVICE') = 0 THEN 99
        ELSE FIELD(PART_CATEGORY, 'CPU', 'COOLER', 'MAINBOARD', 'RAM', 'GPU', 'SSD', 'HDD', 'POWER', 'CASE', 'OS', 'SERVICE')
      END,
      BENCHMARK_BUILD_PART_ID
    `,
    [buildId],
  );
  return rows;
}

async function createJhsPost(build, parts) {
  const cpuBrand = inferCpuBrand(`${build.cpuName} ${build.cpuModel}`);
  const gpuBrand = inferGpuBrand(`${build.gpuName} ${build.gpuModel}`);
  const comboType = `${cpuBrand}_${gpuBrand}`;
  const casePart = parts.find((part) => ['CASE', '케이스'].includes(part.category));
  const totalPrice = Number(build.price || parts.reduce((sum, part) => sum + Number(part.price || 0) * Number(part.quantity || 1), 0));
  const title = makeTitle(build, totalPrice, cpuBrand, gpuBrand);
  const slug = slugify(`jhs-${build.externalBuildId}-${build.cpuModel}-${build.gpuModel}`);
  const generated = await generateBodyWithOllama({ build, parts, title, totalPrice, cpuBrand, gpuBrand, comboType }).catch(() => null);
  const bodyMd = generated?.bodyMd ?? templateBody({ build, parts, totalPrice, cpuBrand, gpuBrand });
  const summary = generated?.summary ?? `JHS 기준으로 ${build.cpuModel} + ${build.gpuModel} 조합을 재구성한 추천 견적입니다.`;

  return {
    slug,
    title,
    subtitle: `${build.cpuModel} + ${build.gpuModel} · ${formatWon(totalPrice)}`,
    summary,
    bodyMd,
    sourceType: 'GENERATED_FROM_MARKET',
    targetBudget: roundBudget(totalPrice),
    totalPrice,
    purpose: 'GAME',
    cpuBrand,
    gpuBrand,
    cpuModel: build.cpuModel,
    gpuModel: build.gpuModel,
    comboType,
    thumbnailImageUrl: casePart?.imageUrl ?? parts.find((part) => part.imageUrl)?.imageUrl ?? null,
    casePartName: casePart?.name ?? null,
    popularityScore: scoreBuild(build, totalPrice),
  };
}

async function generateBodyWithOllama(context) {
  if (!ollamaBaseUrl) return null;
  const prompt = [
    '너는 JHS Computer의 PC 추천 견적 작성자다.',
    '왕가PC 원본을 그대로 언급하지 말고, JHS가 검수해 추천하는 말투로 작성한다.',
    '과장하지 말고 고객이 이해하기 쉬운 한국어로 쓴다.',
    '출력은 JSON: {"summary":"...", "bodyMd":"..."}',
    '',
    JSON.stringify(context, null, 2),
  ].join('\n');

  const response = await fetch(`${ollamaBaseUrl.replace(/\/$/, '')}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: ollamaModel, prompt, stream: false, format: 'json' }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return JSON.parse(data.response);
}

async function upsertPost(db, post, parts, sourceBuildId) {
  await db.beginTransaction();
  try {
    await db.query(
      `
      INSERT INTO recommendation_posts
        (SLUG, TITLE, SUBTITLE, SUMMARY, BODY_MD, STATUS, SOURCE_TYPE, SOURCE_BENCHMARK_BUILD_ID, TARGET_BUDGET, TOTAL_PRICE, PURPOSE, CPU_BRAND, GPU_BRAND, CPU_MODEL, GPU_MODEL, COMBO_TYPE, THUMBNAIL_IMAGE_URL, CASE_PART_NAME, POPULARITY_SCORE, PUBLISHED_DT, RAW_JSON)
      VALUES (?, ?, ?, ?, ?, 'PUBLISHED', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      ON DUPLICATE KEY UPDATE
        TITLE = VALUES(TITLE),
        SUBTITLE = VALUES(SUBTITLE),
        SUMMARY = VALUES(SUMMARY),
        BODY_MD = VALUES(BODY_MD),
        TARGET_BUDGET = VALUES(TARGET_BUDGET),
        TOTAL_PRICE = VALUES(TOTAL_PRICE),
        CPU_BRAND = VALUES(CPU_BRAND),
        GPU_BRAND = VALUES(GPU_BRAND),
        CPU_MODEL = VALUES(CPU_MODEL),
        GPU_MODEL = VALUES(GPU_MODEL),
        COMBO_TYPE = VALUES(COMBO_TYPE),
        THUMBNAIL_IMAGE_URL = VALUES(THUMBNAIL_IMAGE_URL),
        CASE_PART_NAME = VALUES(CASE_PART_NAME),
        POPULARITY_SCORE = VALUES(POPULARITY_SCORE),
        RAW_JSON = VALUES(RAW_JSON)
      `,
      [
        post.slug,
        post.title,
        post.subtitle,
        post.summary,
        post.bodyMd,
        post.sourceType,
        sourceBuildId,
        post.targetBudget,
        post.totalPrice,
        post.purpose,
        post.cpuBrand,
        post.gpuBrand,
        post.cpuModel,
        post.gpuModel,
        post.comboType,
        post.thumbnailImageUrl,
        post.casePartName,
        post.popularityScore,
        JSON.stringify({ generatedAt: new Date().toISOString(), source: 'benchmark_builds' }),
      ],
    );

    const [[saved]] = await db.query('SELECT RECOMMENDATION_POST_ID AS id FROM recommendation_posts WHERE SLUG = ?', [post.slug]);
    await db.query('DELETE FROM recommendation_post_parts WHERE RECOMMENDATION_POST_ID = ?', [saved.id]);
    for (const [index, part] of parts.filter((part) => part.category !== 'SERVICE').entries()) {
      await db.query(
        `
        INSERT INTO recommendation_post_parts
          (RECOMMENDATION_POST_ID, PART_CATEGORY, PART_LABEL, PART_NAME, PART_PRICE, QUANTITY, PRODUCT_NO, IMAGE_URL, SPEC_TEXT, SORT_ORDER)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [saved.id, part.category, part.label, part.name, Number(part.price ?? 0), Number(part.quantity ?? 1), part.productNo, part.imageUrl, part.specText, (index + 1) * 10],
      );
    }

    await db.commit();
  } catch (error) {
    await db.rollback();
    throw error;
  }
}

function templateBody({ build, parts, totalPrice, cpuBrand, gpuBrand }) {
  const casePart = parts.find((part) => ['CASE', '케이스'].includes(part.category));
  return [
    '## 이런 분께 추천합니다',
    `- ${formatWon(totalPrice)} 전후 예산으로 게임용 PC를 찾는 분`,
    `- ${build.cpuModel} + ${build.gpuModel} 조합의 성능 균형을 원하는 분`,
    `- ${cpuBrandLabel(cpuBrand)} + ${gpuBrandLabel(gpuBrand)} 조합을 선호하는 분`,
    '',
    '## JHS 코멘트',
    '시장 데이터를 참고하되, 사용자에게 보여주는 견적은 JHS 기준으로 다시 정리했습니다.',
    casePart ? `케이스는 ${casePart.name} 기준으로 썸네일과 장착성을 함께 확인합니다.` : '케이스 이미지는 추후 매칭되는 DB 이미지로 보강할 수 있습니다.',
    '주문 전 현재 가격, 재고, 호환성은 한 번 더 확인합니다.',
  ].join('\n');
}

function makeTitle(build, totalPrice) {
  const budget = Math.round(totalPrice / 100000) * 10;
  return `${budget}만원대 ${build.cpuModel} + ${build.gpuModel} JHS 추천 PC`;
}

function scoreBuild(build, price) {
  const lower = `${build.title} ${build.cpuName} ${build.gpuName}`.toLowerCase();
  let score = 500;
  if (lower.includes('rtx')) score += 120;
  if (lower.includes('4060') || lower.includes('5060')) score += 100;
  if (lower.includes('7500f') || lower.includes('i5')) score += 80;
  if (price <= 1500000) score += 120;
  return score;
}

function inferCpuBrand(text) {
  const upper = text.toUpperCase();
  if (upper.includes('INTEL') || upper.includes('CORE I')) return 'INTEL';
  if (upper.includes('RYZEN') || upper.includes('AMD')) return 'RYZEN';
  return 'UNKNOWN';
}

function inferGpuBrand(text) {
  const upper = text.toUpperCase();
  if (upper.includes('RADEON') || upper.includes('RX ')) return 'RADEON';
  if (upper.includes('GEFORCE') || upper.includes('RTX') || upper.includes('GTX') || upper.includes('NVIDIA')) return 'NVIDIA';
  return 'UNKNOWN';
}

function roundBudget(price) {
  return Math.ceil(Number(price || 0) / 100000) * 100000;
}

function formatWon(value) {
  return `${Number(value || 0).toLocaleString('ko-KR')}원`;
}

function cpuBrandLabel(value) {
  return value === 'INTEL' ? '인텔' : value === 'RYZEN' ? '라이젠' : 'CPU';
}

function gpuBrandLabel(value) {
  return value === 'RADEON' ? '라데온' : value === 'NVIDIA' ? '엔비디아' : 'GPU';
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 150);
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
