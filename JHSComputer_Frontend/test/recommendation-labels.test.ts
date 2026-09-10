import assert from 'node:assert/strict';
import test from 'node:test';
import { recommendationComboLabel } from '../src/lib/recommendation-posts';

test('추천 견적은 내부 조합 코드를 고객용 문구로 표시한다', () => {
  assert.equal(recommendationComboLabel('RYZEN_NVIDIA'), '라이젠 + 엔비디아');
  assert.equal(recommendationComboLabel('INTEL_RADEON'), '인텔 + 라데온');
  assert.equal(recommendationComboLabel('RYZEN_AMD'), '라이젠 + 라데온');
  assert.equal(recommendationComboLabel(null), 'JHS 추천 조합');
});
