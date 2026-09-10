import assert from 'node:assert/strict';
import test from 'node:test';
import type { DataSource } from 'typeorm';
import { BenchmarksService } from '../src/benchmarks/benchmarks.service';

test('returns only selected games from an exact CPU/GPU combo with evidence metadata', async () => {
  const calls: Array<{ sql: string; values: unknown[] }> = [];
  const service = new BenchmarksService(fakeDataSource(async (sql, values = []) => {
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

test('selector options contain only FPS-evidence CPU/GPU combos', async () => {
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('GROUP BY b.COMBO_KEY')) {
      return [
        {
          comboKey: 'fps-combo',
          cpuModel: 'ryzen7-9800x3d',
          gpuModel: 'rx9070xt',
          cpuName: 'AMD Ryzen 7 9800X3D',
          gpuName: 'AMD Radeon RX 9070 XT 16GB',
          buildSampleCount: 2,
          gameCount: 14,
          resultCount: 42,
        },
        {
          comboKey: 'recommendation-only',
          cpuModel: 'i5-14400f',
          gpuModel: 'rtx5060',
          cpuName: 'Intel Core i5-14400F',
          gpuName: 'NVIDIA RTX 5060',
          buildSampleCount: 10,
          gameCount: 0,
          resultCount: 0,
        },
      ];
    }
    return [];
  }));

  const result = await service.getSelectorOptions();

  assert.deepEqual(result.cpus.map((option) => option.value), ['Ryzen7 9800X3D']);
  assert.deepEqual(result.gpus.map((option) => option.value), ['RX 9070XT']);
  assert.equal(result.total, 1);
  assert.equal(result.combos[0]?.publicComboName, 'Ryzen7 9800X3D + RX 9070XT');
});

test('does not attach an arbitrary SKU when a benchmark-backed model family is ambiguous', async () => {
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('GROUP BY b.COMBO_KEY')) {
      return [{ comboKey: '9800-5070ti', cpuModel: 'ryzen7-9800x3d', gpuModel: 'rtx5070ti', buildSampleCount: 1, gameCount: 0, resultCount: 0 }];
    }
    if (sql.includes('FROM parts p')) {
      return [
        { partId: 21, categoryId: 1, partName: 'Ryzen 7 9800X3D', modelName: 'Ryzen 7 9800X3D', manufacturer: 'AMD' },
        { partId: 84, categoryId: 5, partName: 'RTX 5070 Ti A', modelName: 'RTX 5070 Ti', manufacturer: 'NVIDIA' },
        { partId: 100, categoryId: 5, partName: 'RTX 5070 Ti B', modelName: 'RTX 5070 Ti', manufacturer: 'NVIDIA' },
      ];
    }
    return [];
  }));

  const result = await service.getCombos({ includeNoFps: true, limit: 20 });

  assert.equal(result.items[0]?.cpuPartId, 21);
  assert.equal(result.items[0]?.gpuPartId, undefined);
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

test('preserves source-reported rows when each resolution is explicitly present', async () => {
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

  assert.equal(result.total, 3);
  assert.equal(result.items[0]?.resolution, 'FHD');
  assert.equal(result.items[0]?.evidenceType, 'SOURCE_REPORTED');
  assert.equal(result.items[1]?.resolution, 'QHD');
  assert.equal(result.items[2]?.resolution, 'UHD');
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

test('groups KJWWANG recommendation snapshots into public CPU/GPU combo groups', async () => {
  const calls: Array<{ sql: string; values: unknown[] }> = [];
  const service = new BenchmarksService(fakeDataSource(async (sql, values = []) => {
    calls.push({ sql, values });
    if (sql.includes("AS gameId")) return [
      {
        comboKey: '9600-long-rtx-5060',
        cpuModel: 'AMD 라이젠5 6세대 9600X 6코어 12쓰레드 터보5.4G',
        gpuModel: 'RTX 5060',
        cpuName: 'AMD 라이젠5 6세대 9600X 6코어 12쓰레드 터보5.4G',
        gpuName: 'GeForce RTX 5060',
        gameId: '711',
        capturedAt: '2026-09-10T04:47:18.092Z',
      },
    ];
    return [
      {
        comboKey: '9600-long-rtx-5060',
        cpuModel: 'AMD 라이젠5 6세대 9600X 6코어 12쓰레드 터보5.4G',
        gpuModel: 'RTX 5060',
        cpuName: 'AMD 라이젠5 6세대 9600X 6코어 12쓰레드 터보5.4G',
        gpuName: 'GeForce RTX 5060',
        gameId: '711',
        capturedAt: '2026-09-10T04:47:18.092Z',
      },
      {
        comboKey: 'ryzen-5-9600x-rtx-5060',
        cpuModel: 'ryzen-5-9600x',
        gpuModel: 'rtx-5060',
        cpuName: 'Ryzen5 9600X',
        gpuName: 'RTX 5060',
        gameId: '795',
        capturedAt: '2026-09-09T04:47:18.092Z',
      },
    ];
  }));

  const result = await service.getRecommendationCombos({ q: 'RTX 5060', limit: 200 });

  assert.equal(result.total, 1);
  assert.equal(result.items[0]?.publicComboName, 'Ryzen5 9600X + RTX 5060');
  assert.equal(result.items[0]?.recommendationCount, 1);
  assert.equal(result.items[0]?.gameCount, 1);
  assert.equal(result.items[0]?.sourceCode, 'KJWWANG');
  assert.equal(result.items[0]?.sourceName, '견적왕');
  assert.ok(result.items[0]?.publicComboKey);
  const listQuery = calls[0];
  assert.match(listQuery?.sql ?? '', /SOURCE_CODE = 'KJWWANG'/);
  assert.deepEqual(listQuery?.values, ['%RTX 5060%', '%RTX 5060%', '%RTX 5060%', '%RTX 5060%', '%RTX 5060%', '%RTX 5060%']);
  const publicRef = result.items[0]?.publicComboRef ?? '';
  const decodedRef = Buffer.from(publicRef.replace(/^combo_/, ''), 'base64url').toString('utf8');
  assert.deepEqual(JSON.parse(decodedRef), ['9600-long-rtx-5060', 'ryzen-5-9600x-rtx-5060']);
});

test('applies CPU, GPU, game, and resolution filters at the recommendation boundary', async () => {
  let capturedSql = '';
  let capturedValues: unknown[] = [];
  const snapshots = [
    {
      comboKey: 'ryzen-5-9600x-rtx-5060',
      cpuModel: 'Ryzen5 9600X',
      gpuModel: 'RTX 5060',
      cpuName: 'Ryzen5 9600X',
      gpuName: 'RTX 5060',
      gameId: '711',
      gameName: 'GTA5',
      resolution: 'QHD',
      capturedAt: '2026-09-10T04:47:18.092Z',
    },
    {
      comboKey: 'ryzen-5-9600x-rtx-5060',
      cpuModel: 'Ryzen5 9600X',
      gpuModel: 'RTX 5060',
      cpuName: 'Ryzen5 9600X',
      gpuName: 'RTX 5060',
      gameId: '795',
      gameName: 'P의 거짓',
      resolution: 'FHD',
      capturedAt: '2026-09-09T04:47:18.092Z',
    },
    {
      comboKey: 'i5-12400f-rtx-5060',
      cpuModel: 'Core i5-12400F',
      gpuModel: 'RTX 5060',
      cpuName: 'Intel Core i5-12400F',
      gpuName: 'RTX 5060',
      gameId: '711',
      gameName: 'GTA5',
      resolution: 'QHD',
      capturedAt: '2026-09-08T04:47:18.092Z',
    },
    {
      comboKey: 'ryzen-5-9600x-rtx-5070',
      cpuModel: 'Ryzen5 9600X',
      gpuModel: 'RTX 5070',
      cpuName: 'Ryzen5 9600X',
      gpuName: 'RTX 5070',
      gameId: '711',
      gameName: 'GTA5',
      resolution: 'QHD',
      capturedAt: '2026-09-07T04:47:18.092Z',
    },
  ];
  const service = new BenchmarksService(fakeDataSource(async (sql, values = []) => {
    if (values.length) {
      capturedSql = sql;
      capturedValues = values;
    }
    if (!values.length) return snapshots.map(({ gameId: _gameId, gameName: _gameName, resolution: _resolution, capturedAt: _capturedAt, ...row }) => row);
    const requestedCpu = values.find((value) => String(value).includes('9600X'));
    const requestedGpu = values.find((value) => String(value).includes('RTX 5060'));
    const requestedGame = values.find((value) => String(value).includes('GTA5') || String(value).includes('없는 게임'));
    const requestedResolution = values.find((value) => value === 'QHD' || value === 'UHD');
    return snapshots.filter((row) => (
      (!requestedCpu || row.cpuModel.includes(String(requestedCpu).replace(/^%|%$/g, '')))
      && (!requestedGpu || row.gpuModel.includes(String(requestedGpu).replace(/^%|%$/g, '')))
      && (!requestedGame || row.gameName.includes(String(requestedGame).replace(/^%|%$/g, '')))
      && (!requestedResolution || row.resolution === requestedResolution)
    ));
  }));

  const result = await service.getRecommendationCombos({
    cpu: '9600X',
    gpu: 'RTX 5060',
    game: 'GTA5',
    resolution: 'QHD',
    limit: 20,
  });

  assert.equal(result.total, 1);
  assert.equal(result.items[0]?.recommendationCount, 1);
  assert.equal(result.items[0]?.gameCount, 1);
  assert.match(capturedSql, /SOURCE_CODE = 'KJWWANG'/);
  assert.match(capturedSql, /b\.CPU_MODEL LIKE \?/);
  assert.match(capturedSql, /b\.GPU_MODEL LIKE \?/);
  assert.match(capturedSql, /\$\.gameName/);
  assert.match(capturedSql, /\$\.resolution/);
  assert.deepEqual(capturedValues, ['%9600X%', '%9600X%', '%RTX 5060%', '%RTX 5060%', '%GTA5%', 'QHD']);

  const noMatch = await service.getRecommendationCombos({
    cpu: '9600X',
    gpu: 'RTX 5060',
    game: '없는 게임',
    resolution: 'QHD',
    limit: 20,
  });
  assert.deepEqual(noMatch, { items: [], total: 0 });
});

test('returns recommendation contexts without treating them as FPS rows', async () => {
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('SELECT COMBO_KEY AS comboKey')) {
      return [{ comboKey: 'i5-14400f-rtx-5060' }];
    }
    if (sql.includes('SELECT COUNT(*) AS total')) return [{ total: 2 }];
    if (sql.includes('COUNT(DISTINCT JSON_UNQUOTE')) {
      return [{
        comboKey: 'i5-14400f-rtx-5060',
        cpuModel: 'i5-14400f',
        gpuModel: 'rtx-5060',
        cpuName: '코어 i5-14400F',
        gpuName: 'GeForce RTX 5060',
        recommendationCount: 2,
        gameCount: 2,
        latestCapturedAt: '2026-09-10T04:47:18.092Z',
      }];
    }
    return [
      {
        gameId: '711',
        gameName: 'GTA5',
        resolution: 'FHD',
        tier: '권장',
        platform: 'Intel',
        priceRange: '100만원 초반',
        price: 1020000,
        sourceUrl: 'https://kjwwang.com/example',
        capturedAt: '2026-09-10T04:47:18.092Z',
      },
      {
        gameId: '795',
        gameName: 'P의 거짓',
        resolution: 'QHD',
        tier: '고급',
        platform: 'Intel',
        priceRange: '120만원 중반',
        price: 1250000,
        sourceUrl: 'https://kjwwang.com/example-2',
        capturedAt: '2026-09-10T04:47:18.092Z',
      },
    ];
  }));

  const result = await service.getRecommendationComboDetail('combo_aTU1LTE0NDBmLXJ0eC01MDYw');

  assert.equal(result?.combo.publicComboName, 'i5-14400F + RTX 5060');
  assert.equal(result?.total, 2);
  assert.equal(result?.contexts.length, 2);
  assert.equal(result?.contexts[0]?.gameName, 'GTA5');
  assert.equal(result?.contexts[1]?.resolution, 'QHD');
  assert.equal('rawFpsAvg' in (result?.contexts[0] ?? {}), false);
  assert.equal(result?.combo.sourceCode, 'KJWWANG');
});

test('rejects a recommendation reference that mixes different public CPU/GPU groups', async () => {
  const service = new BenchmarksService(fakeDataSource(async (sql) => {
    if (sql.includes('GROUP BY b.COMBO_KEY')) {
      return [
        { comboKey: 'ryzen-5-9600x-rtx-5060', cpuModel: 'Ryzen5 9600X', gpuModel: 'RTX 5060' },
        { comboKey: 'i5-14400f-rtx-5060', cpuModel: 'i5-14400F', gpuModel: 'RTX 5060' },
      ];
    }
    return [];
  }));
  const forgedRef = `combo_${Buffer.from(JSON.stringify([
    'ryzen-5-9600x-rtx-5060',
    'i5-14400f-rtx-5060',
  ]), 'utf8').toString('base64url')}`;

  assert.equal(await service.getRecommendationComboDetail(forgedRef), null);
});

function fakeDataSource(query: (sql: string, values: unknown[]) => Promise<unknown[]>) {
  return { query } as unknown as DataSource;
}
