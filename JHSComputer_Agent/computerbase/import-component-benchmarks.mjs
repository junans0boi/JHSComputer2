/**
 * ComputerBase 공개 CPU/GPU 컴포넌트 벤치마크 수집기.
 *
 * 이 수집기는 ComputerBase 차트에 표시된 값을 `SOURCE_REPORTED` 관측값으로
 * 보존한다. 차트의 테스트 조건·행별 조건·원문 URL을 함께 저장하며, JHS가
 * 직접 측정한 값처럼 포장하지 않는다.
 *
 * 기본 동작은 dry-run이다. 원격 DB에는 --apply를 명시했을 때만 반영한다.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as cheerio from 'cheerio';

export const COMPONENT_SOURCE_CONFIGS = [
  {
    sourceCode: 'COMPUTERBASE',
    sourceName: 'ComputerBase 공개 벤치마크',
    baseUrl: 'https://www.computerbase.de',
    articleKey: 'amd-ryzen-7-9800x3d-test.90151',
    pages: [3],
    pathPrefix: '/artikel/prozessoren/',
    kind: 'CPU',
  },
  {
    sourceCode: 'COMPUTERBASE',
    sourceName: 'ComputerBase 공개 벤치마크',
    baseUrl: 'https://www.computerbase.de',
    articleKey: 'cinebench-r23-community-benchmarks.74276',
    pages: [null],
    pathPrefix: '/artikel/prozessoren/',
    kind: 'CPU',
  },
  {
    sourceCode: 'COMPUTERBASE',
    sourceName: 'ComputerBase 공개 벤치마크',
    baseUrl: 'https://www.computerbase.de',
    articleKey: '3dmark-time-spy-benchmark.88185',
    pages: [null],
    pathPrefix: '/artikel/grafikkarten/',
    kind: 'GPU',
  },
  {
    sourceCode: 'COMPUTERBASE',
    sourceName: 'ComputerBase 공개 벤치마크',
    baseUrl: 'https://www.computerbase.de',
    articleKey: 'radeon-rx-580-570-test.59085',
    pages: [null],
    pathPrefix: '/artikel/grafikkarten/',
    kind: 'GPU',
  },
];

const CINEBENCH_CHARTS = new Map([
  [
    'Cinebench 2024.1 – Multi-Core',
    {
      benchmarkCode: 'CINEBENCH',
      testName: 'Cinebench 2024',
      testVersion: '2024.1',
      scoreMetric: 'MULTI_CORE',
      deviceType: 'CPU',
      scoreUnit: 'pts',
    },
  ],
  [
    'Cinebench 2024.1 – Single-Core',
    {
      benchmarkCode: 'CINEBENCH',
      testName: 'Cinebench 2024',
      testVersion: '2024.1',
      scoreMetric: 'SINGLE_CORE',
      deviceType: 'CPU',
      scoreUnit: 'pts',
    },
  ],
  [
    'Cinebench R23 – Multi-Core',
    {
      benchmarkCode: 'CINEBENCH',
      testName: 'Cinebench R23',
      testVersion: 'R23',
      scoreMetric: 'MULTI_CORE',
      deviceType: 'CPU',
      scoreUnit: 'pts',
    },
  ],
  [
    'Cinebench R23 – Single Core',
    {
      benchmarkCode: 'CINEBENCH',
      testName: 'Cinebench R23',
      testVersion: 'R23',
      scoreMetric: 'SINGLE_CORE',
      deviceType: 'CPU',
      scoreUnit: 'pts',
    },
  ],
]);

const TIME_SPY_CHART = {
  benchmarkCode: '3DMARK_TIME_SPY',
  testName: '3DMark Time Spy Graphics Score',
  scoreMetric: 'GRAPHICS_SCORE',
  deviceType: 'GPU',
  scoreUnit: 'points',
};

const FIRE_STRIKE_CHART = {
  benchmarkCode: '3DMARK_FIRE_STRIKE',
  testName: '3DMark Fire Strike',
  // ComputerBase exposes the chart and score but not a 3DMark build number.
  scoreMetric: 'OVERALL_SCORE',
  deviceType: 'GPU',
  scoreUnit: 'points',
};

const ARTICLE_DATE_PATTERN = /(\d{4})-(\d{2})-(\d{2})/;

function unspecifiedTestVersion(articleKey) {
  // The article scope prevents two unknown benchmark builds from being merged.
  // It is a comparison scope, not a claim about the benchmark's real version.
  return `UNSPECIFIED@${articleKey}`;
}

function cleanText(value) {
  return String(value ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseScore(value) {
  const score = Number.parseFloat(String(value ?? '').replace(',', '.'));
  return Number.isFinite(score) && score > 0 ? score : null;
}

function normalizeLanguageAliases(value) {
  return cleanText(value)
    .replace(/라이젠/gi, 'Ryzen')
    .replace(/지포스/gi, 'GeForce')
    .replace(/라데온/gi, 'Radeon')
    .replace(/인텔/gi, 'Intel')
    .replace(/코어/gi, 'Core')
    .replace(/울트라/gi, 'Ultra')
    .replace(/엔비디아/gi, 'Nvidia')
    .replace(/에이엠디/gi, 'AMD');
}

/**
 * 같은 칩/CPU 모델의 판매 SKU가 달라도 비교할 수 있도록 모델군 키를 만든다.
 * 행의 `Turbo Mode`, `(Perf.)` 같은 실행 조건은 키에서 제거하고 conditions에
 * 남긴다. 그래야 같은 부품의 조건별 점수를 숨기지 않으면서도 모델군을 찾을 수 있다.
 */
export function normalizeComponentModelKey(value, deviceType) {
  const normalized = normalizeLanguageAliases(value).replace(/[™®]/g, '');
  if (deviceType === 'CPU') {
    const ryzen = normalized.match(/\bRyzen\s*([3579])[\s\-A-Za-z가-힣]*?(\d{4,5}[A-Za-z0-9]*)/i);
    if (ryzen) return `cpu:amd:ryzen-${ryzen[1]}-${ryzen[2].toLowerCase()}`;

    const coreUltra = normalized.match(/\bCore\s+Ultra\s+([3579])\s*[- ]?\s*(\d{3,5}[A-Za-z0-9]*)/i);
    if (coreUltra) return `cpu:intel:core-ultra-${coreUltra[1]}-${coreUltra[2].toLowerCase()}`;

    const core = normalized.match(/\bCore\s+(i[3579])\s*[- ]?\s*(\d{4,5}[A-Za-z0-9]*)/i);
    if (core) return `cpu:intel:core-${core[1].toLowerCase()}-${core[2].toLowerCase()}`;

    const genericIntel = normalized.match(/\b(i[3579])\s*[- ]?\s*(\d{4,5}[A-Za-z0-9]*)/i);
    if (genericIntel) return `cpu:intel:core-${genericIntel[1].toLowerCase()}-${genericIntel[2].toLowerCase()}`;

    const genericCoreUltra = normalized.match(/\bUltra\s*([3579])\s*[- ]?\s*(\d{3,5}[A-Za-z0-9]*)/i);
    if (genericCoreUltra) return `cpu:intel:core-ultra-${genericCoreUltra[1]}-${genericCoreUltra[2].toLowerCase()}`;
  }

  if (deviceType === 'GPU') {
    const gpu = normalized.match(/\b(RTX|GTX|RX)\s*([2-9]\d{2,3})\s*(Ti|SUPER|XT|XTX|GRE)?\b/i);
    if (gpu) {
      const family = gpu[1].toUpperCase();
      const suffix = gpu[3] ? `-${gpu[3].toLowerCase()}` : '';
      return `gpu:${family === 'RX' ? 'amd' : 'nvidia'}:${family.toLowerCase()}-${gpu[2]}${suffix}`;
    }
  }

  return `${deviceType.toLowerCase()}:unknown:${normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

function parseArticleMetadata($) {
  let metadata = null;
  $('script[type="application/ld+json"]').each((_, script) => {
    if (metadata) return;
    try {
      const parsed = JSON.parse($(script).text());
      if (parsed && parsed['@type'] === 'Article') metadata = parsed;
    } catch {
      // 광고/페이지의 다른 JSON-LD는 벤치마크 원본과 무관하므로 무시한다.
    }
  });

  const rawDate = metadata?.dateModified ?? metadata?.datePublished ?? '';
  const articleDate = rawDate.match(ARTICLE_DATE_PATTERN)?.[0] ?? null;
  return {
    articleTitle: cleanText(metadata?.headline),
    articlePublishedAt: metadata?.datePublished ?? null,
    articleModifiedAt: metadata?.dateModified ?? null,
    articleDate,
  };
}

function extractRows($, chart, { groupHeader } = {}) {
  let scope = $(chart);
  if (groupHeader) {
    scope = $(chart).find('.chart__group').filter((_, group) => (
      cleanText($(group).find('.chart__group-header').first().text()) === groupHeader
    )).first();
  }

  const rows = [];
  scope.find('.chart__row').each((_, row) => {
    const item = $(row).find('.chart__item').first();
    const rawComponentName = cleanText(item.clone().children().remove().end().text());
    const rowCondition = cleanText(item.find('.chart__item-title-addtl').first().text());
    const score = parseScore($(row).find('.chart__label[data-value]').first().attr('data-value'));
    if (!rawComponentName || score === null) return;
    rows.push({ rawComponentName, rowCondition: rowCondition || null, score });
  });
  return rows;
}

export function parseComputerBaseComponentPage(html, { pageUrl, articleKey }) {
  const $ = cheerio.load(html);
  const metadata = parseArticleMetadata($);
  const records = [];

  $('[data-title]').each((_, chart) => {
    const chartTitle = cleanText($(chart).attr('data-title'));
    const cinebench = CINEBENCH_CHARTS.get(chartTitle);
    if (cinebench) {
      for (const row of extractRows($, chart)) {
        records.push({
          ...cinebench,
          testVersion: cinebench.testVersion,
          comparableGroupKey: `${cinebench.benchmarkCode}:${cinebench.testVersion}:${cinebench.scoreMetric}:${cinebench.deviceType}:${cinebench.scoreUnit}`,
          rawComponentName: row.rawComponentName,
          normalizedModelKey: normalizeComponentModelKey(row.rawComponentName, cinebench.deviceType),
          score: row.score,
          evidenceType: 'SOURCE_REPORTED',
          sourceUrl: pageUrl,
          articleKey,
          chartTitle,
          conditions: {
            articleTitle: metadata.articleTitle,
            articlePublishedAt: metadata.articlePublishedAt,
            articleModifiedAt: metadata.articleModifiedAt,
            rowCondition: row.rowCondition,
            testSystem: {
              cpu: null,
              mainboard: null,
              memory: null,
              gpu: null,
              os: null,
              driver: null,
              // Power/SMT row conditions are not proof of overclocking.
              overclock: null,
            },
            conditionCompleteness: 'PARTIAL',
            unavailableConditionFields: ['testSystem', 'os', 'driver'],
          },
        });
      }
      return;
    }

    if (chartTitle === '3DMark – Time Spy') {
      for (const row of extractRows($, chart, { groupHeader: 'Graphics Score:' })) {
        const testVersion = unspecifiedTestVersion(articleKey);
        records.push({
          ...TIME_SPY_CHART,
          testVersion,
          comparableGroupKey: `${TIME_SPY_CHART.benchmarkCode}:${testVersion}:${TIME_SPY_CHART.scoreMetric}:${TIME_SPY_CHART.deviceType}:${TIME_SPY_CHART.scoreUnit}`,
          rawComponentName: row.rawComponentName,
          normalizedModelKey: normalizeComponentModelKey(row.rawComponentName, TIME_SPY_CHART.deviceType),
          score: row.score,
          evidenceType: 'SOURCE_REPORTED',
          sourceUrl: pageUrl,
          articleKey,
          chartTitle,
          conditions: {
            articleTitle: metadata.articleTitle,
            articlePublishedAt: metadata.articlePublishedAt,
            articleModifiedAt: metadata.articleModifiedAt,
            rowCondition: row.rowCondition,
            scoreScope: 'Graphics Score (CPU와 분리된 GPU 점수)',
            testSystem: {
              cpu: null,
              mainboard: null,
              memory: null,
              gpu: null,
              os: null,
              driver: null,
              overclock: null,
            },
            conditionCompleteness: 'PARTIAL',
            testVersionStatus: 'ComputerBase 원문에 3DMark 빌드 버전 미표기',
            comparisonScope: articleKey,
            unavailableConditionFields: ['testSystem', 'os', 'driver'],
          },
        });
      }
      return;
    }

    if (chartTitle === '3DMark' || chartTitle === '3DMark – Fire Strike (DX11)') {
      const groupHeader = chartTitle === '3DMark'
        ? 'Fire Strike:'
        : 'Fire Strike (DX11, Gaming-PC):';
      const testVersion = unspecifiedTestVersion(articleKey);
      for (const row of extractRows($, chart, { groupHeader })) {
        records.push({
          ...FIRE_STRIKE_CHART,
          testVersion,
          comparableGroupKey: `${FIRE_STRIKE_CHART.benchmarkCode}:${testVersion}:${FIRE_STRIKE_CHART.scoreMetric}:${FIRE_STRIKE_CHART.deviceType}:${FIRE_STRIKE_CHART.scoreUnit}`,
          rawComponentName: row.rawComponentName,
          normalizedModelKey: normalizeComponentModelKey(row.rawComponentName, FIRE_STRIKE_CHART.deviceType),
          score: row.score,
          evidenceType: 'SOURCE_REPORTED',
          sourceUrl: pageUrl,
          articleKey,
          chartTitle,
          conditions: {
            articleTitle: metadata.articleTitle,
            articlePublishedAt: metadata.articlePublishedAt,
            articleModifiedAt: metadata.articleModifiedAt,
            rowCondition: row.rowCondition,
            scoreScope: '3DMark overall score (Graphics Score와 별도)',
            testVersionStatus: 'ComputerBase 원문에 빌드 버전 미표기',
            comparisonScope: articleKey,
            testSystem: {
              cpu: null,
              mainboard: null,
              memory: null,
              gpu: null,
              os: null,
              driver: null,
              overclock: null,
            },
            conditionCompleteness: 'PARTIAL',
            unavailableConditionFields: ['testSystem', 'os', 'driver'],
          },
        });
      }
    }
  });

  return records;
}

export function dedupeComponentRecords(records) {
  const unique = new Map();
  for (const record of records) {
    const key = [
      record.articleKey,
      record.chartTitle,
      record.normalizedModelKey,
      record.score,
      record.conditions?.rowCondition ?? '',
    ].join(':');
    if (!unique.has(key)) unique.set(key, record);
  }
  return [...unique.values()];
}

async function fetchRecords(config) {
  const records = [];
  for (const page of config.pages) {
    const suffix = page === null ? '' : `/seite-${page}`;
    const pageUrl = `${config.baseUrl}${config.pathPrefix}${config.articleKey}${suffix}`;
    const response = await fetch(pageUrl, {
      headers: { 'user-agent': 'JHSComputer-BenchmarkCollector/1.0' },
    });
    if (!response.ok) throw new Error(`ComputerBase 요청 실패: ${response.status} ${pageUrl}`);
    records.push(...parseComputerBaseComponentPage(await response.text(), {
      pageUrl,
      articleKey: config.articleKey,
    }));
  }
  return dedupeComponentRecords(records);
}

function dbConfig(envPath) {
  dotenv.config({ path: envPath });
  return {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USERNAME ?? 'jhs_dev',
    password: process.env.DB_PASSWORD ?? 'hollywood',
    database: process.env.DB_DATABASE ?? 'jhs_computer_dev',
    charset: 'utf8mb4',
  };
}

function toMysqlDateTime(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function currentMysqlDateTime() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

async function ensureSource(conn, config) {
  await conn.execute(
    `INSERT INTO benchmark_sources (SOURCE_CODE, SOURCE_NAME, BASE_URL)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE SOURCE_NAME=VALUES(SOURCE_NAME), BASE_URL=VALUES(BASE_URL)`,
    [config.sourceCode, config.sourceName, config.baseUrl],
  );
  const [[source]] = await conn.execute(
    'SELECT BENCHMARK_SOURCE_ID AS sourceId FROM benchmark_sources WHERE SOURCE_CODE = ?',
    [config.sourceCode],
  );
  return source.sourceId;
}

async function loadParts(conn) {
  const [rows] = await conn.execute(
    `SELECT PART_ID AS partId, PART_CATEGORY_ID AS categoryId, CANONICAL_NAME AS canonicalName,
            MODEL_NAME AS modelName, MODEL_KEY AS modelKey, MANUFACTURER AS manufacturer,
            IS_ADMIN_APPROVED AS isAdminApproved, POPULARITY_SCORE AS popularityScore
     FROM parts
     WHERE PART_CATEGORY_ID IN (1, 5) AND STATUS = 'ACTIVE'`,
  );
  return rows.map((row) => ({
    ...row,
    normalizedModelKey: normalizeComponentModelKey(
      `${row.manufacturer ?? ''} ${row.modelName ?? row.canonicalName ?? ''}`,
      Number(row.categoryId) === 1 ? 'CPU' : 'GPU',
    ),
  }));
}

export function matchPart(parts, record) {
  const candidates = parts.filter((part) => part.normalizedModelKey === record.normalizedModelKey);
  if (!candidates.length) return { partId: null, matchCount: 0 };
  if (candidates.length > 1) return { partId: null, matchCount: candidates.length };
  candidates.sort((left, right) => (
    Number(right.isAdminApproved === 'Y') - Number(left.isAdminApproved === 'Y')
    || Number(right.popularityScore ?? 0) - Number(left.popularityScore ?? 0)
    || Number(left.partId) - Number(right.partId)
  ));
  return { partId: candidates[0].partId, matchCount: candidates.length };
}

function resultIdPart(value) {
  return String(value ?? 'unknown')
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 70);
}

function buildExternalResultId(record) {
  return [
    record.articleKey,
    resultIdPart(record.chartTitle),
    resultIdPart(record.rawComponentName),
    resultIdPart(record.conditions?.rowCondition || 'default'),
    String(record.score),
  ].join(':').slice(0, 180);
}

async function ensureTest(conn, record) {
  await conn.execute(
    `INSERT INTO benchmark_component_tests
       (BENCHMARK_CODE, TEST_NAME, TEST_VERSION, SCORE_METRIC, DEVICE_TYPE,
        SCORE_UNIT, COMPARABLE_GROUP_KEY, IS_ACTIVE)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'Y')
     ON DUPLICATE KEY UPDATE TEST_NAME=VALUES(TEST_NAME), SCORE_UNIT=VALUES(SCORE_UNIT),
       COMPARABLE_GROUP_KEY=VALUES(COMPARABLE_GROUP_KEY), IS_ACTIVE='Y'`,
    [record.benchmarkCode, record.testName, record.testVersion, record.scoreMetric,
      record.deviceType, record.scoreUnit, record.comparableGroupKey],
  );
  const [[test]] = await conn.execute(
    `SELECT BENCHMARK_COMPONENT_TEST_ID AS testId
     FROM benchmark_component_tests
     WHERE BENCHMARK_CODE = ? AND TEST_VERSION = ? AND SCORE_METRIC = ? AND DEVICE_TYPE = ?`,
    [record.benchmarkCode, record.testVersion, record.scoreMetric, record.deviceType],
  );
  return test.testId;
}

export async function syncRecords(conn, config, records, parts) {
  await conn.beginTransaction();
  try {
    const sourceId = await ensureSource(conn, config);
    const testCache = new Map();
    let matched = 0;

    // 원본 행 ID 규칙이 바뀌거나 기사에서 행이 제거되어도 이전 스냅샷을
    // 대표 점수를 오염시키지 않도록 이 기사 범위만 교체한다.
    await conn.execute(
      `DELETE FROM benchmark_component_observations
       WHERE BENCHMARK_SOURCE_ID = ?
         AND JSON_UNQUOTE(JSON_EXTRACT(RAW_JSON, '$.articleKey')) = ?`,
      [sourceId, config.articleKey],
    );

    for (const record of records) {
      const testKey = [record.benchmarkCode, record.testVersion, record.scoreMetric, record.deviceType].join(':');
      const testId = testCache.get(testKey) ?? await ensureTest(conn, record);
      testCache.set(testKey, testId);
      const match = matchPart(parts, record);
      if (match.partId) matched += 1;
      const externalResultId = buildExternalResultId(record);

      await conn.execute(
        `INSERT INTO benchmark_component_observations
           (BENCHMARK_COMPONENT_TEST_ID, BENCHMARK_SOURCE_ID, PART_ID,
            EXTERNAL_RESULT_ID, RAW_COMPONENT_NAME, NORMALIZED_MODEL_KEY, SCORE,
            EVIDENCE_TYPE, SOURCE_URL, TEST_SYSTEM_JSON, DRIVER_VERSION,
            OS_VERSION, OVERCLOCK_STATUS, RAW_JSON, CAPTURED_DT)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, NOW()))
         ON DUPLICATE KEY UPDATE PART_ID=VALUES(PART_ID), RAW_COMPONENT_NAME=VALUES(RAW_COMPONENT_NAME),
           NORMALIZED_MODEL_KEY=VALUES(NORMALIZED_MODEL_KEY), SCORE=VALUES(SCORE),
           EVIDENCE_TYPE=VALUES(EVIDENCE_TYPE), SOURCE_URL=VALUES(SOURCE_URL),
           TEST_SYSTEM_JSON=VALUES(TEST_SYSTEM_JSON), DRIVER_VERSION=VALUES(DRIVER_VERSION),
           OS_VERSION=VALUES(OS_VERSION), OVERCLOCK_STATUS=VALUES(OVERCLOCK_STATUS),
           RAW_JSON=VALUES(RAW_JSON),
           CAPTURED_DT=VALUES(CAPTURED_DT), UPDATED_DT=NOW()`,
        [testId, sourceId, match.partId, externalResultId, record.rawComponentName,
          record.normalizedModelKey, record.score, record.evidenceType, record.sourceUrl,
          JSON.stringify({
            ...(record.conditions?.testSystem ?? {}),
            unavailableConditionFields: record.conditions?.unavailableConditionFields ?? [],
          }), record.conditions?.testSystem?.driver ?? null,
          record.conditions?.testSystem?.os ?? null,
          record.conditions?.testSystem?.overclock ? 'REPORTED_IN_ROW' : 'UNKNOWN',
          JSON.stringify({
            ...record,
            modelFamilyMatchCount: match.matchCount,
          }), currentMysqlDateTime()],
      );
    }

    await conn.commit();
    return { recordCount: records.length, matchedPartCount: matched };
  } catch (error) {
    await conn.rollback();
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const envArg = args.find((arg) => arg.startsWith('--env='));
  const envPath = envArg ? path.resolve(envArg.slice('--env='.length)) : path.resolve('../JHSComputer_Server/.env');
  const allRecords = [];

  for (const config of COMPONENT_SOURCE_CONFIGS) {
    const records = await fetchRecords(config);
    allRecords.push({ config, records });
    console.log(`[computerbase/component] ${config.articleKey}: ${records.length}개 원본 행`);
  }

  if (!apply) {
    console.log('[computerbase/component] dry-run — DB 반영은 --apply 옵션이 필요합니다.');
    for (const { config, records } of allRecords) {
      const byTest = Object.groupBy(records, (record) => `${record.testName} ${record.scoreMetric}`);
      console.log(`  ${config.articleKey}:`, Object.fromEntries(Object.entries(byTest).map(([key, rows]) => [key, rows.length])));
    }
    return;
  }

  const conn = await mysql.createConnection(dbConfig(envPath));
  try {
    const parts = await loadParts(conn);
    const summary = [];
    for (const { config, records } of allRecords) {
      summary.push({ articleKey: config.articleKey, ...(await syncRecords(conn, config, records, parts)) });
    }
    console.log('[computerbase/component] DB 반영 완료', summary);
  } finally {
    await conn.end();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
