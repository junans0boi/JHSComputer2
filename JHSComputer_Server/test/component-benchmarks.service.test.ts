import assert from 'node:assert/strict';
import test from 'node:test';
import type { DataSource } from 'typeorm';
import { ComponentBenchmarksService } from '../src/benchmarks/component-benchmarks.service';

const parts = [
  {
    partId: 21,
    partName: '[AMD] 라이젠7 그래니트 9800X3D',
    manufacturer: 'AMD',
    modelName: '[AMD] 라이젠7 그래니트 9800X3D',
    modelKey: 'compuzone:1187400',
    categoryId: 1,
  },
  {
    partId: 35,
    partName: '[AMD] 라이젠9 그래니트 9950X3D',
    manufacturer: 'AMD',
    modelName: '[AMD] 라이젠9 그래니트 9950X3D',
    modelKey: 'compuzone:1220480',
    categoryId: 1,
  },
];

const observations = [
  {
    observationId: 1,
    observationPartId: 21,
    normalizedModelKey: 'cpu:amd:ryzen-7-9800x3d',
    score: '1003.0000',
    evidenceType: 'SOURCE_REPORTED',
    sourceName: 'ComputerBase 공개 벤치마크',
    sourceUrl: 'https://www.computerbase.de/cpu',
    capturedAt: '2024-11-06 14:00:00',
    conditionsJson: JSON.stringify({ rowCondition: '120/162 W, SMT off' }),
    testId: 1,
    benchmarkCode: 'CINEBENCH',
    testName: 'Cinebench 2024',
    testVersion: '2024.1@2024-11-06',
    scoreMetric: 'MULTI_CORE',
    deviceType: 'CPU',
    scoreUnit: 'pts',
    comparableGroupKey: 'CINEBENCH:2024.1@2024-11-06:MULTI_CORE:CPU:pts',
  },
  {
    observationId: 2,
    observationPartId: 35,
    normalizedModelKey: 'cpu:amd:ryzen-9-9950x3d',
    score: '1400.0000',
    evidenceType: 'SOURCE_REPORTED',
    sourceName: 'ComputerBase 공개 벤치마크',
    sourceUrl: 'https://www.computerbase.de/cpu',
    capturedAt: '2024-11-06 14:00:00',
    conditionsJson: JSON.stringify({ rowCondition: '170/200 W, DDR5-5600CL32' }),
    testId: 1,
    benchmarkCode: 'CINEBENCH',
    testName: 'Cinebench 2024',
    testVersion: '2024.1@2024-11-06',
    scoreMetric: 'MULTI_CORE',
    deviceType: 'CPU',
    scoreUnit: 'pts',
    comparableGroupKey: 'CINEBENCH:2024.1@2024-11-06:MULTI_CORE:CPU:pts',
  },
  {
    observationId: 3,
    observationPartId: 21,
    normalizedModelKey: 'cpu:amd:ryzen-7-9800x3d',
    score: '133.0000',
    evidenceType: 'SOURCE_REPORTED',
    sourceName: 'ComputerBase 공개 벤치마크',
    sourceUrl: 'https://www.computerbase.de/cpu',
    capturedAt: '2024-11-06 14:00:00',
    conditionsJson: JSON.stringify({ rowCondition: '120/162 W, SMT off' }),
    testId: 2,
    benchmarkCode: 'CINEBENCH',
    testName: 'Cinebench 2024',
    testVersion: '2024.1@2024-11-06',
    scoreMetric: 'SINGLE_CORE',
    deviceType: 'CPU',
    scoreUnit: 'pts',
    comparableGroupKey: 'CINEBENCH:2024.1@2024-11-06:SINGLE_CORE:CPU:pts',
  },
];

test('returns representative component scores with provenance and conditions', async () => {
  const service = new ComponentBenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('FROM parts')) return parts;
    if (sql.includes('FROM benchmark_component_observations')) return observations;
    return [];
  }));

  const result = await service.getScores(21);

  assert.equal(result.total, 2);
  assert.equal(result.items[0]?.test.metric, 'MULTI_CORE');
  assert.equal(result.items[0]?.score, 1003);
  assert.equal(result.items[0]?.evidenceType, 'SOURCE_REPORTED');
  assert.equal(result.items[0]?.conditions?.rowCondition, '120/162 W, SMT off');
  assert.deepEqual(result.items[0]?.sourceNames, ['ComputerBase 공개 벤치마크']);
});

test('compares only the same test group and calculates deltas against the first selected part', async () => {
  const service = new ComponentBenchmarksService(fakeDataSource(async (sql, values) => {
    if (sql.includes('FROM parts')) return parts;
    if (sql.includes('FROM benchmark_component_observations')) {
      return sql.includes('BENCHMARK_COMPONENT_TEST_ID = ?')
        ? observations.filter((observation) => observation.testId === Number(values.at(-1)))
        : observations;
    }
    return [];
  }));

  const result = await service.compare([21, 35], 1);
  const selected = result.items.find((item) => item.partId === 21);
  const candidate = result.items.find((item) => item.partId === 35);

  assert.equal(result.selectedPartId, 21);
  assert.equal(result.total, 2);
  assert.equal(selected?.deltaFromSelected, undefined);
  assert.equal(candidate?.deltaFromSelected, 397);
  assert.equal(candidate?.deltaPercentFromSelected, 39.58);
  assert.equal(result.items.some((item) => item.test.metric === 'SINGLE_CORE'), false);
});

test('returns an explicit empty state for a part without observations', async () => {
  const service = new ComponentBenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('FROM parts')) return [parts[0]];
    if (sql.includes('FROM benchmark_component_observations')) return [];
    return [];
  }));

  const result = await service.getScores(21);
  assert.equal(result.total, 0);
  assert.match(result.reason ?? '', /아직 없습니다/);
});

test('does not show candidate scores when the selected part has no matching score', async () => {
  const service = new ComponentBenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('FROM parts')) return parts;
    if (sql.includes('SELECT DISTINCT p.PART_ID')) return [{ partId: 35 }];
    if (sql.includes('FROM benchmark_component_observations')) return [observations[1]];
    return [];
  }));

  const result = await service.compare([21]);

  assert.equal(result.selectedPartId, 21);
  assert.equal(result.total, 0);
  assert.deepEqual(result.items, []);
  assert.match(result.reason ?? '', /비교 숫자를 생성하지 않았습니다/);
});

test('does not expose an ambiguous NULL PART_ID observation as a catalog part score', async () => {
  const ambiguousObservation = { ...observations[0], observationPartId: null };
  const service = new ComponentBenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('FROM parts')) return [parts[0]];
    if (sql.includes('FROM benchmark_component_observations')) return [ambiguousObservation];
    return [];
  }));

  const result = await service.getScores(21);

  assert.equal(result.total, 0);
  assert.match(result.reason ?? '', /아직 없습니다/);
});

test('returns every condition sample used by a representative score', async () => {
  const secondObservation = {
    ...observations[0],
    observationId: 4,
    score: '1100.0000',
    sourceName: 'ComputerBase 재검증 행',
    conditionsJson: JSON.stringify({ rowCondition: 'PBO enabled' }),
  };
  let observationSql = '';
  const service = new ComponentBenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('FROM parts')) return [parts[0]];
    if (sql.includes('FROM benchmark_component_observations')) {
      observationSql = sql;
      return [observations[0], secondObservation];
    }
    return [];
  }));

  const result = await service.getScores(21);

  assert.equal(result.items[0]?.observationCount, 2);
  assert.equal(result.items[0]?.conditionSamples?.length, 2);
  assert.match(observationSql, /t\.IS_ACTIVE = 'Y'/);
});

function fakeDataSource(query: (sql: string, values: unknown[]) => Promise<unknown[]>) {
  return { query } as unknown as DataSource;
}
