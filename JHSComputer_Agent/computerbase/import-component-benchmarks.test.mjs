import test from 'node:test';
import assert from 'node:assert/strict';
import {
  dedupeComponentRecords,
  matchPart,
  normalizeComponentModelKey,
  parseComputerBaseComponentPage,
  syncRecords,
} from './import-component-benchmarks.mjs';

const CPU_FIXTURE = `
<html><head>
<script type="application/ld+json">{"@type":"Article","headline":"CPU application benchmarks","datePublished":"2024-11-06T15:00:00+01:00","dateModified":"2024-11-06T15:00:00+01:00"}</script>
</head><body>
<div class="chart" data-title="Cinebench 2024.1 – Multi-Core">
  <ul class="chart__group"><li class="chart__row"><div class="chart__item">AMD Ryzen 7 9800X3D Turbo Mode<br><span class="chart__item-title-addtl">120/162 W, SMT off</span></div><div class="chart__label" data-value="1003">1.003</div></li></ul>
</div>
<div class="chart" data-title="Cinebench 2024.1 – Single-Core">
  <ul class="chart__group"><li class="chart__row"><div class="chart__item">Intel Core i9-14900K (Perf.)<br><span class="chart__item-title-addtl">253/253 W</span></div><div class="chart__label" data-value="134">134</div></li></ul>
</div>
</body></html>`;

const GPU_FIXTURE = `
<html><head>
<script type="application/ld+json">{"@type":"Article","headline":"3DMark Time Spy","datePublished":"2024-07-15T10:45:00+02:00","dateModified":"2025-08-26T10:45:00+02:00"}</script>
</head><body>
<div class="chart" data-title="3DMark – Time Spy">
  <ul class="chart__group"><div class="chart__group-header">Graphics Score:</div><li class="chart__row"><div class="chart__item">Nvidia GeForce RTX 5090</div><div class="chart__label" data-value="47760">47.760</div></li></ul>
  <ul class="chart__group"><div class="chart__group-header">CPU Score:</div><li class="chart__row"><div class="chart__item">AMD Ryzen 7 9800X3D</div><div class="chart__label" data-value="16000">16.000</div></li></ul>
</div>
</body></html>`;

const R23_FIXTURE = `
<html><head>
<script type="application/ld+json">{"@type":"Article","headline":"Cinebench R23","datePublished":"2023-01-02T10:00:00+01:00"}</script>
</head><body>
<div class="chart" data-title="Cinebench R23 – Multi-Core">
  <ul class="chart__group"><li class="chart__row"><div class="chart__item">AMD Ryzen 7 9800X3D</div><div class="chart__label" data-value="22500">22.500</div></li></ul>
</div>
<div class="chart" data-title="Cinebench R23 – Single Core">
  <ul class="chart__group"><li class="chart__row"><div class="chart__item">Intel Core i5-14400F</div><div class="chart__label" data-value="1800">1.800</div></li></ul>
</div>
</body></html>`;

const FIRE_STRIKE_FIXTURE = `
<html><head>
<script type="application/ld+json">{"@type":"Article","headline":"3DMark Fire Strike","datePublished":"2016-01-02T10:00:00+01:00"}</script>
</head><body>
<div class="chart" data-title="3DMark">
  <ul class="chart__group"><div class="chart__group-header">Fire Strike:</div><li class="chart__row"><div class="chart__item">Nvidia GeForce GTX 1080 Ti FE</div><div class="chart__label" data-value="21694">21.694</div></li></ul>
  <ul class="chart__group"><div class="chart__group-header">Fire Strike Ultra:</div><li class="chart__row"><div class="chart__item">Nvidia GeForce GTX 1080 Ti FE</div><div class="chart__label" data-value="9000">9.000</div></li></ul>
</div>
</body></html>`;

test('ComputerBase Cinebench 차트를 테스트 버전·조건과 함께 CPU 관측값으로 변환한다', () => {
  const records = parseComputerBaseComponentPage(CPU_FIXTURE, {
    pageUrl: 'https://example.test/cpu/seite-3',
    articleKey: 'cpu.1',
  });

  assert.equal(records.length, 2);
  assert.deepEqual(records.map((record) => record.score), [1003, 134]);
  assert.equal(records[0].testVersion, '2024.1');
  assert.equal(records[0].scoreMetric, 'MULTI_CORE');
  assert.equal(records[0].deviceType, 'CPU');
  assert.equal(records[0].normalizedModelKey, 'cpu:amd:ryzen-7-9800x3d');
  assert.equal(records[0].conditions.rowCondition, '120/162 W, SMT off');
  assert.equal(records[1].normalizedModelKey, 'cpu:intel:core-i9-14900k');
});

test('ComputerBase Time Spy는 Graphics Score 그룹만 GPU 점수로 변환한다', () => {
  const records = parseComputerBaseComponentPage(GPU_FIXTURE, {
    pageUrl: 'https://example.test/time-spy',
    articleKey: 'timespy.1',
  });

  assert.equal(records.length, 1);
  assert.equal(records[0].benchmarkCode, '3DMARK_TIME_SPY');
  assert.equal(records[0].scoreMetric, 'GRAPHICS_SCORE');
  assert.equal(records[0].score, 47760);
  assert.equal(records[0].normalizedModelKey, 'gpu:nvidia:rtx-5090');
  assert.match(records[0].conditions.scoreScope, /Graphics Score/);
  assert.equal(records[0].testVersion, 'UNSPECIFIED@timespy.1');
});

test('Cinebench R23 차트를 2024와 섞이지 않는 별도 테스트로 변환한다', () => {
  const records = parseComputerBaseComponentPage(R23_FIXTURE, {
    pageUrl: 'https://example.test/cinebench-r23',
    articleKey: 'r23.1',
  });

  assert.equal(records.length, 2);
  assert.deepEqual(records.map((record) => record.testVersion), ['R23', 'R23']);
  assert.deepEqual(records.map((record) => record.scoreMetric), ['MULTI_CORE', 'SINGLE_CORE']);
  assert.equal(records[0].conditions.testSystem.driver, null);
  assert.deepEqual(records[0].conditions.unavailableConditionFields, ['testSystem', 'os', 'driver']);
});

test('Fire Strike 전체 점수는 Graphics Score와 다른 비교 지표로 저장한다', () => {
  const records = parseComputerBaseComponentPage(FIRE_STRIKE_FIXTURE, {
    pageUrl: 'https://example.test/fire-strike',
    articleKey: 'fire-strike.1',
  });

  assert.equal(records.length, 1);
  assert.equal(records[0].benchmarkCode, '3DMARK_FIRE_STRIKE');
  assert.equal(records[0].scoreMetric, 'OVERALL_SCORE');
  assert.equal(records[0].testVersion, 'UNSPECIFIED@fire-strike.1');
  assert.match(records[0].conditions.scoreScope, /overall score/);
});

test('모델군 키는 판매사 SKU와 한글 제품명을 같은 GPU/CPU 계열로 정규화한다', () => {
  assert.equal(normalizeComponentModelKey('[AMD] 라이젠7 그래니트 9800X3D (8코어/16스레드)', 'CPU'), 'cpu:amd:ryzen-7-9800x3d');
  assert.equal(normalizeComponentModelKey('[GIGABYTE] 라데온 RX 9070 XT GAMING OC D6 16GB', 'GPU'), 'gpu:amd:rx-9070-xt');
  assert.equal(normalizeComponentModelKey('[ASUS] 지포스 RTX 5060 Ti OC D7 8GB', 'GPU'), 'gpu:nvidia:rtx-5060-ti');
});

test('동일 원본 행은 한 번만 남긴다', () => {
  const records = parseComputerBaseComponentPage(CPU_FIXTURE, {
    pageUrl: 'https://example.test/cpu/seite-3',
    articleKey: 'cpu.1',
  });
  assert.equal(dedupeComponentRecords([...records, ...records]).length, records.length);
});

test('같은 모델군의 판매 SKU가 여러 개면 임의 PART_ID에 연결하지 않는다', () => {
  const result = matchPart([
    { partId: 1, normalizedModelKey: 'gpu:nvidia:rtx-5060', isAdminApproved: 'Y', popularityScore: 100 },
    { partId: 2, normalizedModelKey: 'gpu:nvidia:rtx-5060', isAdminApproved: 'N', popularityScore: 1 },
  ], { normalizedModelKey: 'gpu:nvidia:rtx-5060' });

  assert.deepEqual(result, { partId: null, matchCount: 2 });
});

test('관측값 삽입 실패 시 기사 스냅샷 삭제를 rollback한다', async () => {
  const calls = [];
  const connection = {
    beginTransaction: async () => calls.push('begin'),
    commit: async () => calls.push('commit'),
    rollback: async () => calls.push('rollback'),
    execute: async (sql) => {
      if (sql.includes('SELECT BENCHMARK_SOURCE_ID')) return [[{ sourceId: 10 }]];
      if (sql.includes('SELECT BENCHMARK_COMPONENT_TEST_ID')) return [[{ testId: 20 }]];
      if (sql.includes('benchmark_component_observations') && sql.includes('INSERT')) throw new Error('insert-failed');
      return [[]];
    },
  };
  const record = {
    benchmarkCode: 'CINEBENCH', testName: 'Cinebench R23', testVersion: 'R23',
    scoreMetric: 'MULTI_CORE', deviceType: 'CPU', scoreUnit: 'pts',
    comparableGroupKey: 'CINEBENCH:R23:MULTI_CORE:CPU:pts',
    rawComponentName: 'AMD Ryzen 7 9800X3D', normalizedModelKey: 'cpu:amd:ryzen-7-9800x3d',
    score: 22500, evidenceType: 'SOURCE_REPORTED', sourceUrl: 'https://example.test',
    articleKey: 'article.1', chartTitle: 'Cinebench R23 – Multi-Core', conditions: {},
  };

  await assert.rejects(
    syncRecords(connection, { sourceCode: 'TEST', sourceName: 'Test', baseUrl: 'https://example.test' }, [record], []),
    /insert-failed/,
  );
  assert.deepEqual(calls, ['begin', 'rollback']);
});
