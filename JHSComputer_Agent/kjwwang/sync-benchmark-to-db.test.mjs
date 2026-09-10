import test from 'node:test';
import assert from 'node:assert/strict';
import { comfortGrade, parseGameTable } from './sync-benchmark-to-db.mjs';

test('견적왕 표의 해상도별 지원 문구를 FPS 측정값으로 오해하지 않는다', () => {
  const games = parseGameTable([
    '번호\t게임\t평균프레임\t옵션단계\tFHD해상도\tQHD해상도\tUHD해상도',
    '1\t샘플 게임\t144 FPS\t최상옵\t최상옵까지 지원\t상옵까지 지원\t중옵까지 지원',
  ].join('\n'));

  assert.equal(games.length, 1);
  assert.equal(games[0].avgFps, 144);
  assert.equal(games[0].fhd, '최상옵까지 지원');
  assert.equal(games[0].qhd, '상옵까지 지원');
  assert.equal(games[0].uhd, '중옵까지 지원');
});

test('FPS 체감 등급은 한 곳에서 결정한다', () => {
  assert.equal(comfortGrade(null), '지원');
  assert.equal(comfortGrade(144), '쾌적');
  assert.equal(comfortGrade(60), '보통');
  assert.equal(comfortGrade(30), '플레이 가능');
  assert.equal(comfortGrade(29), '비추천');
});
