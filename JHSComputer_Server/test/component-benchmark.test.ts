import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateScoreDelta,
  isComparableBenchmark,
  normalizeComponentModelKey,
  summarizeObservations,
  type ComponentBenchmarkObservation,
} from '../src/benchmarks/component-benchmark';
import { parseComponentPartIds } from '../src/benchmarks/benchmarks.controller';

const testDefinition = {
  testId: 'cinebench-r23-multi-cpu',
  comparableGroupKey: 'CINEBENCH:R23:MULTI:CPU',
  deviceType: 'CPU' as const,
  unit: 'pts',
};

test('summarizes same-test observations without mixing evidence types', () => {
  const rows: ComponentBenchmarkObservation[] = [
    {
      observationId: '1',
      partId: '101',
      partName: 'JHS CPU A',
      manufacturer: 'JHS',
      score: 22_000,
      evidenceType: 'SOURCE_REPORTED',
      sourceName: 'ComputerBase',
      sourceUrl: 'https://example.test/a',
      capturedAt: '2026-09-10T00:00:00.000Z',
      ...testDefinition,
    },
    {
      observationId: '2',
      partId: '101',
      partName: 'JHS CPU A',
      manufacturer: 'JHS',
      score: 23_000,
      evidenceType: 'SOURCE_REPORTED',
      sourceName: 'Review B',
      sourceUrl: 'https://example.test/b',
      capturedAt: '2026-09-10T00:00:00.000Z',
      ...testDefinition,
    },
    {
      observationId: '3',
      partId: '101',
      partName: 'JHS CPU A',
      manufacturer: 'JHS',
      score: 24_000,
      evidenceType: 'MEASURED',
      sourceName: 'JHS Lab',
      sourceUrl: 'https://example.test/lab',
      capturedAt: '2026-09-10T00:00:00.000Z',
      ...testDefinition,
    },
  ];

  const summaries = summarizeObservations(rows);

  assert.equal(summaries.length, 2);
  assert.deepEqual(
    summaries.map((summary) => [summary.evidenceType, summary.score, summary.observationCount]),
    [
      ['MEASURED', 24_000, 1],
      ['SOURCE_REPORTED', 22_500, 2],
    ],
  );
  assert.equal(summaries[1]?.minimumScore, 22_000);
  assert.equal(summaries[1]?.maximumScore, 23_000);
});

test('rejects comparisons across benchmark version, metric, device, or unit', () => {
  assert.equal(
    isComparableBenchmark(testDefinition, { ...testDefinition }),
    true,
  );
  assert.equal(
    isComparableBenchmark(testDefinition, { ...testDefinition, comparableGroupKey: 'CINEBENCH:R24:MULTI:CPU' }),
    false,
  );
  assert.equal(
    isComparableBenchmark(testDefinition, { ...testDefinition, deviceType: 'GPU' }),
    false,
  );
  assert.equal(
    isComparableBenchmark(testDefinition, { ...testDefinition, unit: 'score' }),
    false,
  );
});

test('calculates candidate delta relative to the selected score', () => {
  assert.deepEqual(calculateScoreDelta(10_000, 12_500), { delta: 2_500, percent: 25 });
  assert.deepEqual(calculateScoreDelta(10_000, 7_500), { delta: -2_500, percent: -25 });
  assert.deepEqual(calculateScoreDelta(0, 100), { delta: 100, percent: null });
});

test('normalizes Korean catalog names to the same CPU/GPU model family key', () => {
  assert.equal(
    normalizeComponentModelKey('[AMD] 라이젠7 그래니트 9800X3D (8코어/16스레드)', 'CPU'),
    'cpu:amd:ryzen-7-9800x3d',
  );
  assert.equal(
    normalizeComponentModelKey('[GIGABYTE] 라데온 RX 9070 XT GAMING OC D6 16GB', 'GPU'),
    'gpu:amd:rx-9070-xt',
  );
});

test('limits public component comparison input to prevent oversized queries', () => {
  assert.deepEqual(parseComponentPartIds('1, 2, 2, 3'), [1, 2, 2, 3]);
  assert.throws(
    () => parseComponentPartIds(Array.from({ length: 13 }, (_, index) => String(index + 1)).join(',')),
    /최대 12개/,
  );
});
