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

test('does not expand a repeated source-reported quote value into fake QHD and 4K values', async () => {
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('GROUP BY b.COMBO_KEY')) {
      return [{ comboKey: 'exact-combo', cpuModel: 'ryzen7-9800x3d', gpuModel: 'rx9070xt' }];
    }
    return ['FHD', 'QHD', 'UHD'].map((resolution) => ({
      gameName: 'APEX 레전드',
      resolution,
      sampleCount: 1,
      rawFpsAvg: 144,
      rawFpsMin: 144,
      rawFpsMax: 144,
      displayFpsMin: 122,
      displayFpsMax: 166,
      bestQuality: 'ULTRA',
      comfortGrade: 'EXCELLENT',
    }));
  }));

  const result = await service.getQuotePerformance({
    parts: [{ category: 'CPU', name: 'AMD Ryzen 7 9800X3D' }, { category: 'GPU', name: 'AMD Radeon RX 9070 XT 16GB' }],
    games: ['APEX'],
    limit: 200,
  });

  assert.equal(result.items.length, 1);
  assert.equal(result.items[0]?.resolution, 'FHD');
  assert.equal(result.items[0]?.evidenceType, 'SOURCE_REPORTED');
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

test('returns collected combos without FPS and marks the evidence state separately', async () => {
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('GROUP BY b.COMBO_KEY')) {
      return [
        {
          comboKey: 'ryzen7-9800x3d-rx9070xt',
          cpuModel: 'ryzen7-9800x3d',
          gpuModel: 'rx9070xt',
          buildSampleCount: 3,
          gameCount: 154,
          resultCount: 462,
        },
        {
          comboKey: 'i5-12400f-rtx5060',
          cpuModel: 'i5-12400f',
          gpuModel: 'rtx5060',
          buildSampleCount: 6,
          gameCount: 0,
          resultCount: 0,
        },
      ];
    }
    return [];
  }));

  const result = await service.getCombos({ includeNoFps: true, limit: 200 });

  assert.equal(result.total, 2);
  assert.equal(result.items[0]?.publicComboName, 'Ryzen7 9800X3D + RX 9070XT');
  assert.equal(result.items[0]?.hasFpsEvidence, true);
  assert.equal(result.items[1]?.publicComboName, 'i5-12400F + RTX 5060');
  assert.equal(result.items[1]?.hasFpsEvidence, false);
});

test('normalizes summary top-combo fields for the public benchmark page', async () => {
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('COUNT(*) FROM benchmark_builds')) {
      return [{ buildCount: '2199', totalComboCount: '147', fpsComboCount: '1', gameCount: '160', fpsResultCount: '462', comboGameResultCount: '462' }];
    }
    return [{
      comboKey: 'kjwwang-9800x3d-rx9070xt',
      cpuModel: 'ryzen7-9800x3d',
      gpuModel: 'rx9070xt',
      buildSampleCount: 1,
      gameCount: 154,
      resultCount: 462,
    }];
  }));

  const result = await service.getSummary();

  assert.equal(result.topCombos[0]?.buildSampleCount, 1);
  assert.equal(result.topCombos[0]?.publicComboName, 'Ryzen7 9800X3D + RX 9070XT');
});

test('merges source combo keys that resolve to the same public CPU/GPU combination', async () => {
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('GROUP BY b.COMBO_KEY')) {
      return [
        {
          comboKey: '9600-RTX-5060',
          cpuModel: 'AMD 라이젠5 6세대 9600X 6코어 12쓰레드 터보5.4G',
          gpuModel: 'RTX 5060',
          buildSampleCount: 1,
          gameCount: 0,
          resultCount: 0,
        },
        {
          comboKey: 'ryzen-5-9600x-rtx-5060',
          cpuModel: 'Ryzen5 9600X',
          gpuModel: 'RTX 5060',
          buildSampleCount: 7,
          gameCount: 0,
          resultCount: 0,
        },
      ];
    }
    return [];
  }));

  const result = await service.getCombos({ includeNoFps: true, limit: 200 });

  assert.equal(result.total, 1);
  assert.equal(result.items[0]?.publicComboName, 'Ryzen5 9600X + RTX 5060');
  assert.equal(result.items[0]?.buildSampleCount, 8);
  assert.match(result.items[0]?.publicComboRef ?? '', /^combo_/);
});

test('does not present duplicated source-reported resolution values as independent FPS data', async () => {
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('FROM benchmark_combo_game_results r')) {
      return ['FHD', 'QHD', 'UHD'].map((resolution) => ({
        gameId: 'game-1',
        gameName: 'APEX 레전드',
        resolution,
        sampleCount: 1,
        rawFpsAvg: 144,
        rawFpsMin: 144,
        rawFpsMax: 144,
        displayFpsMin: 122,
        displayFpsMax: 166,
        bestQuality: 'ULTRA',
        comfortGrade: 'EXCELLENT',
      }));
    }
    if (sql.includes('FROM benchmark_builds')) {
      return [{ comboKey: '9600-RTX-5060', cpuModel: 'cpu', gpuModel: 'gpu' }];
    }
    return [];
  }));

  const result = await service.getComboGames({ comboKey: 'combo_9600', limit: 200 });

  assert.equal(result.total, 1);
  assert.equal(result.items[0]?.resolution, 'FHD');
  assert.equal(result.items[0]?.evidenceType, 'SOURCE_REPORTED');
  assert.match(result.items[0]?.evidenceNote ?? '', /해상도별 독립/);
});

test('returns no detail for an unknown public combo reference', async () => {
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('COUNT(*) AS buildSampleCount')) {
      return [{ comboKey: 'missing', buildSampleCount: 0 }];
    }
    return [];
  }));

  assert.equal(await service.getComboDetail('combo_missing'), null);
});

function fakeDataSource(query: (sql: string, values: unknown[]) => Promise<unknown[]>) {
  return { query } as unknown as DataSource;
}
