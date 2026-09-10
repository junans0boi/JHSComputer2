import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_COLLECTION_POLICY,
  calculateRequestDelay,
  dedupeRecommendationRecords,
  getRecommendationContextKey,
  planIncrementalTargets,
  shouldApplyLatestSnapshot,
  shouldRefreshCheckpoint,
} from './incremental-collection.mjs';

test('기본 견적왕 수집 정책은 느린 요청·jitter·휴식 값을 사용한다', () => {
  assert.ok(DEFAULT_COLLECTION_POLICY.delayMs >= 6000);
  assert.ok(DEFAULT_COLLECTION_POLICY.jitterMs > 0);
  assert.ok(DEFAULT_COLLECTION_POLICY.restEvery > 0);
  assert.ok(DEFAULT_COLLECTION_POLICY.restMs >= 30000);
  assert.equal(calculateRequestDelay(DEFAULT_COLLECTION_POLICY, () => 0.5), 7250);
});

test('같은 추천 맥락은 하나로 dedupe하고 다른 해상도·등급은 보존한다', () => {
  const records = [
    { source: 'KJWWANG', gameId: 569, resolution: 'FHD', tier: '최상옵', platform: 'AMD', cpuModel: 'ryzen-7-9800x3d', gpuModel: 'rx-9070-xt', crawledAt: '2026-09-10T01:00:00.000Z', marker: 'old' },
    { source: 'KJWWANG', gameId: 569, resolution: 'FHD', tier: '최상옵', platform: 'AMD', cpuModel: 'ryzen-7-9800x3d', gpuModel: 'rx-9070-xt', crawledAt: '2026-09-10T02:00:00.000Z', marker: 'latest' },
    { source: 'KJWWANG', gameId: 569, resolution: 'QHD', tier: '최상옵', platform: 'AMD', cpuModel: 'ryzen-7-9800x3d', gpuModel: 'rx-9070-xt', crawledAt: '2026-09-10T02:00:00.000Z', marker: 'different-context' },
  ];

  const deduped = dedupeRecommendationRecords(records);

  assert.equal(deduped.length, 2);
  assert.ok(deduped.some((record) => record.marker === 'latest'));
  assert.ok(deduped.some((record) => record.marker === 'different-context'));
  assert.equal(
    getRecommendationContextKey(records[0]),
    'KJWWANG|569|FHD|최상옵|AMD|ryzen-7-9800x3d|rx-9070-xt',
  );
});

test('출처가 다른 추천 맥락은 같은 게임·부품이어도 합치지 않는다', () => {
  const records = [
    { source: 'KJWWANG', gameId: 569, resolution: 'FHD', tier: '최상옵', platform: 'AMD', cpuModel: 'ryzen-7-9800x3d', gpuModel: 'rx-9070-xt', crawledAt: '2026-09-10T02:00:00.000Z' },
    { source: 'OTHER_SOURCE', gameId: 569, resolution: 'FHD', tier: '최상옵', platform: 'AMD', cpuModel: 'ryzen-7-9800x3d', gpuModel: 'rx-9070-xt', crawledAt: '2026-09-10T03:00:00.000Z' },
  ];

  assert.equal(dedupeRecommendationRecords(records).length, 2);
});

test('완료된 최신 체크포인트는 건너뛰고 오래된 체크포인트만 새 배치로 계획한다', () => {
  const now = Date.parse('2026-09-10T12:00:00.000Z');
  const checkpoint = {
    '569': { status: 'completed', checkedAt: '2026-09-10T11:00:00.000Z' },
    '711': { status: 'completed', checkedAt: '2026-09-01T11:00:00.000Z' },
  };
  const targets = [{ gameId: 569 }, { gameId: 711 }, { gameId: 795 }];

  assert.equal(shouldRefreshCheckpoint(checkpoint['569'], now, 86_400_000), false);
  assert.equal(shouldRefreshCheckpoint(checkpoint['711'], now, 86_400_000), true);
  assert.deepEqual(
    planIncrementalTargets(targets, checkpoint, { now, refreshAfterMs: 86_400_000, limit: 1 }),
    [{ gameId: 711, reason: 'stale' }],
  );
});

test('오래된 추천 스냅샷은 최신값을 덮어쓰지 않는다', () => {
  assert.equal(
    shouldApplyLatestSnapshot('2026-09-10T02:00:00.000Z', '2026-09-10T03:00:00.000Z'),
    true,
  );
  assert.equal(
    shouldApplyLatestSnapshot('2026-09-10T03:00:00.000Z', '2026-09-10T02:00:00.000Z'),
    false,
  );
  assert.equal(shouldApplyLatestSnapshot(null, '2026-09-10T03:00:00.000Z'), true);
});
