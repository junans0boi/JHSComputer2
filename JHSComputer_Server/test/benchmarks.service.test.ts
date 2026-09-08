import assert from 'node:assert/strict';
import test from 'node:test';
import type { DataSource } from 'typeorm';
import { BenchmarksService } from '../src/benchmarks/benchmarks.service';

test('returns only selected games from an exact CPU/GPU combo with evidence metadata', async () => {
  const calls: Array<{ sql: string; values: unknown[] }> = [];
  const service = new BenchmarksService(fakeDataSource(async (sql, values) => {
    calls.push({ sql, values });
    if (sql.includes('GROUP BY b.COMBO_KEY')) {
      return [{
        comboKey: 'exact-combo',
        cpuModel: 'ryzen7-9800x3d',
        gpuModel: 'rx9070xt',
        cpuName: 'AMD Ryzen 7 9800X3D',
        gpuName: 'AMD Radeon RX 9070 XT 16GB',
        buildSampleCount: 1,
        gameCount: 2,
      }];
    }
    return [{
      gameName: 'APEX 레전드',
      resolution: 'QHD',
      sampleCount: 3,
      rawFpsAvg: 140,
      rawFpsMin: 120,
      rawFpsMax: 160,
      displayFpsMin: 120,
      displayFpsMax: 160,
      bestQuality: 'ULTRA',
      comfortGrade: 'EXCELLENT',
    }];
  }));

  const result = await service.getQuotePerformance({
    parts: [
      { category: 'CPU', name: 'AMD Ryzen 7 9800X3D' },
      { category: 'GPU', name: 'AMD Radeon RX 9070 XT 16GB' },
    ],
    games: ['APEX'],
    resolution: 'QHD',
    limit: 200,
  });

  assert.equal(result.combo?.comboKey, 'exact-combo');
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0]?.game, 'APEX 레전드');
  assert.equal(result.items[0]?.evidenceType, 'MEASURED');
  assert.equal(result.items[0]?.confidence, 'MEDIUM');
  assert.match(calls[1]?.sql ?? '', /g\.GAME_NAME LIKE \?/);
  assert.deepEqual(calls[1]?.values.slice(0, 3), ['exact-combo', 'QHD', '%APEX%']);
});

test('does not fall back to a nearest combo or invent FPS when the exact combo is absent', async () => {
  const calls: string[] = [];
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    calls.push(sql);
    if (sql.includes('GROUP BY b.COMBO_KEY')) {
      return [{ comboKey: 'nearby-combo', cpuModel: 'ryzen7-9800x3d', gpuModel: 'rtx4070super' }];
    }
    return [];
  }));

  const result = await service.getQuotePerformance({
    parts: [
      { category: 'CPU', name: 'AMD Ryzen 7 9800X3D' },
      { category: 'GPU', name: 'NVIDIA RTX 4070' },
    ],
    games: ['APEX'],
    resolution: 'QHD',
    limit: 200,
  });

  assert.equal(result.items.length, 0);
  assert.equal(result.combo, null);
  assert.match(result.reason ?? '', /실측 벤치마크/);
  assert.equal(calls.length, 1);
});

test('drops benchmark rows that contain no FPS values', async () => {
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('GROUP BY b.COMBO_KEY')) {
      return [{ comboKey: 'exact-combo', cpuModel: 'cpu', gpuModel: 'gpu' }];
    }
    return [{
      gameName: 'APEX 레전드',
      resolution: 'QHD',
      sampleCount: 5,
      rawFpsAvg: null,
      rawFpsMin: null,
      rawFpsMax: null,
      displayFpsMin: null,
      displayFpsMax: null,
    }];
  }));

  const result = await service.getQuotePerformance({
    parts: [{ category: 'CPU', name: 'AMD Ryzen 7 9800X3D' }, { category: 'GPU', name: 'AMD Radeon RX 9070 XT 16GB' }],
    games: ['APEX'],
    resolution: 'QHD',
    limit: 200,
  });

  assert.deepEqual(result.items, []);
  assert.equal(result.total, 0);
});

test('labels a single source-reported FPS range as low-confidence evidence', async () => {
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('GROUP BY b.COMBO_KEY')) {
      return [{ comboKey: 'exact-combo', cpuModel: 'ryzen7-9800x3d', gpuModel: 'rx9070xt' }];
    }
    return [{
      gameName: 'APEX 레전드',
      resolution: 'QHD',
      sampleCount: 1,
      rawFpsAvg: 100,
      rawFpsMin: 100,
      rawFpsMax: 100,
      displayFpsMin: 85,
      displayFpsMax: 115,
    }];
  }));

  const result = await service.getQuotePerformance({
    parts: [{ category: 'CPU', name: 'AMD Ryzen 7 9800X3D' }, { category: 'GPU', name: 'AMD Radeon RX 9070 XT 16GB' }],
    games: ['APEX'],
    resolution: 'QHD',
    limit: 200,
  });

  assert.equal(result.items[0]?.evidenceType, 'SOURCE_REPORTED');
  assert.equal(result.items[0]?.confidence, 'LOW');
  assert.equal(result.items[0]?.sampleCount, 1);
});

test('returns no quote performance rows when no games were selected', async () => {
  const calls: string[] = [];
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    calls.push(sql);
    return [{ comboKey: 'exact-combo', cpuModel: 'ryzen7-9800x3d', gpuModel: 'rx9070xt' }];
  }));

  const result = await service.getQuotePerformance({
    parts: [{ category: 'CPU', name: 'AMD Ryzen 7 9800X3D' }, { category: 'GPU', name: 'AMD Radeon RX 9070 XT 16GB' }],
    games: [],
    resolution: 'QHD',
    limit: 200,
  });

  assert.deepEqual(result.items, []);
  assert.equal(result.total, 0);
  assert.equal(calls.length, 1);
});

function fakeDataSource(query: (sql: string, values: unknown[]) => Promise<unknown[]>) {
  return { query } as unknown as DataSource;
}
