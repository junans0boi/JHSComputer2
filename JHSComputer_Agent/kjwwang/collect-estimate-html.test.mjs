import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEstimateUrls } from './collect-estimate-html.mjs';

test('견적 ID 범위를 최신에서 과거 방향으로 만든다', () => {
  assert.deepEqual(buildEstimateUrls({ fromId: 27192, toId: 27190 }), [
    'https://kjwwang.com/shop/pc_estimate.html?action=view&es_sn=27192',
    'https://kjwwang.com/shop/pc_estimate.html?action=view&es_sn=27191',
    'https://kjwwang.com/shop/pc_estimate.html?action=view&es_sn=27190',
  ]);
});

test('범위가 없으면 자동으로 전체 ID를 만들지 않는다', () => {
  assert.deepEqual(buildEstimateUrls({}), []);
});
