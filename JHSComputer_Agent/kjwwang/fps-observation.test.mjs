import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEstimateObservation } from './fps-observation.mjs';

test('견적 상세를 공용 FPS 관측 입력으로 변환한다', () => {
  const observation = buildEstimateObservation({
    estimateId: '27192',
    title: '라이젠 9600X + RTX 5060 Ti 8GB 게이밍용도 추천견적',
    parts: [
      { category: 'CPU', name: 'AMD 라이젠5-6세대 9600X (멀티팩)' },
      { category: 'GPU', name: 'ZOTAC GAMING 지포스 RTX 5060 Ti Twin Edge OC D7 8GB' },
    ],
    games: [{
      gameName: '샘플 게임',
      resolutions: {
        FHD: [{ optionPreset: '상옵', fps: 120, playable: true, rawText: '상옵 120 FPS' }],
        QHD: [{ optionPreset: '중옵', fps: 90, playable: true, rawText: '중옵 90 FPS' }],
      },
    }],
  }, 'https://kjwwang.com/shop/pc_estimate.html?action=view&es_sn=27192');

  assert.equal(observation.cpuModel, 'ryzen5-9600x');
  assert.equal(observation.gpuModel, 'rtx5060ti');
  assert.equal(observation.comboKey, 'kjwwang-ryzen5-9600x-rtx5060ti');
  assert.equal(observation.evidenceType, 'SOURCE_RECOMMENDATION');
  assert.equal(observation.records.length, 2);
  assert.equal(observation.records[1].resolution, 'QHD');
  assert.equal(observation.records[1].fps, 90);
  assert.equal(observation.sourceConditionKey, 'estimate-27192');
});

test('CPU 또는 GPU가 없는 견적은 FPS 관측으로 변환하지 않는다', () => {
  assert.equal(buildEstimateObservation({ estimateId: 'missing', parts: [], games: [] }, null), null);
});
