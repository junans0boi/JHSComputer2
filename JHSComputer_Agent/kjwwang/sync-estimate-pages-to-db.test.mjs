import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSyncPlan } from './sync-estimate-pages-to-db.mjs';

test('동기화 계획은 서로 다른 견적의 CPU/GPU 조합을 보존한다', () => {
  const plan = buildSyncPlan([
    {
      estimateId: '27192',
      title: '9600X + RTX 5060 Ti',
      parts: [
        { category: 'CPU', name: 'AMD 라이젠5-6세대 9600X' },
        { category: 'GPU', name: '지포스 RTX 5060 Ti 8GB' },
      ],
      games: [{ gameName: '샘플 게임', resolutions: { FHD: [{ optionPreset: '상옵', fps: 120 }] } }],
    },
    {
      estimateId: '27193',
      title: '9800X3D + RTX 5070 Ti',
      parts: [
        { category: 'CPU', name: 'AMD 라이젠7 9800X3D' },
        { category: 'GPU', name: '지포스 RTX 5070 Ti 16GB' },
      ],
      games: [{ gameName: '샘플 게임', resolutions: { FHD: [{ optionPreset: '최상옵', fps: 144 }] } }],
    },
  ]);

  assert.equal(plan.length, 2);
  assert.deepEqual(plan.map((item) => item.comboKey), [
    'kjwwang-ryzen5-9600x-rtx5060ti',
    'kjwwang-ryzen7-9800x3d-rtx5070ti',
  ]);
  assert.ok(plan.every((item) => item.evidenceType === 'SOURCE_RECOMMENDATION'));
});
