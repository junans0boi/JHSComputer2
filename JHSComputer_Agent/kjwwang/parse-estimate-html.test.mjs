import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEstimateHtml } from './parse-estimate-html.mjs';

const fixture = `
<!doctype html>
<html>
  <head>
    <title>라이젠 9600X + RTX 5060 Ti 8GB 게이밍용도 추천견적</title>
    <meta property="og:title" content="라이젠 9600X + RTX 5060 Ti 8GB 게이밍용도 추천견적">
  </head>
  <body>
    <a href="/shop/pc_estimate.html?action=view&es_sn=27192">원문</a>
    <table class="part_basic">
      <tr><td class="cate">CPU</td><td><a class="selected"><span>AMD 라이젠5-6세대 9600X (멀티팩)</span></a></td></tr>
      <tr><td class="cate">그래픽카드</td><td><a class="selected"><span>ZOTAC GAMING 지포스 RTX 5060 Ti Twin Edge OC D7 8GB</span></a></td></tr>
    </table>
    <h3>FHD 해상도 (1920 X 1080)</h3>
    <ul class="game_list">
      <li><span class="gname">샘플 게임</span> : 상옵으로 120 FPS 가능합니다.</li>
      <li><span class="gname">샘플 게임</span> : 최상옵으로 90 FPS 가능합니다.</li>
      <li><span class="gname">숫자 없는 게임</span> : 상옵으로 FPS 가능합니다.</li>
    </ul>
    <h3>QHD 해상도 (2560 X 1440)</h3>
    <ul class="game_list">
      <li><span class="gname">샘플 게임</span> : 중옵으로 90 FPS 가능합니다.</li>
    </ul>
  </body>
</html>`;

test('견적 상세 HTML에서 CPU/GPU와 해상도별 FPS를 추출한다', () => {
  const parsed = parseEstimateHtml(fixture, 'estimate_27192.html');

  assert.equal(parsed.estimateId, '27192');
  assert.equal(parsed.parts.find((part) => part.category === 'CPU')?.name, 'AMD 라이젠5-6세대 9600X (멀티팩)');
  assert.match(parsed.parts.find((part) => part.category === 'GPU')?.name ?? '', /RTX 5060 Ti/);
  assert.equal(parsed.recordCount, 3);
  assert.deepEqual(
    parsed.games.find((game) => game.gameName === '샘플 게임')?.resolutions,
    {
      FHD: [
        { optionPreset: '상옵', fps: 120, playable: true, rawText: '상옵 120 FPS' },
        { optionPreset: '최상옵', fps: 90, playable: true, rawText: '최상옵 90 FPS' },
      ],
      QHD: [{ optionPreset: '중옵', fps: 90, playable: true, rawText: '중옵 90 FPS' }],
    },
  );
});

test('동일 게임·해상도의 서로 다른 옵션 FPS를 덮어쓰지 않는다', () => {
  const parsed = parseEstimateHtml(fixture, 'estimate_27192.html');
  const sample = parsed.games.find((game) => game.gameName === '샘플 게임');

  assert.equal(sample?.resolutions.FHD.length, 2);
  assert.deepEqual(sample?.resolutions.FHD.map((item) => item.optionPreset), ['상옵', '최상옵']);
});

test('숫자 FPS가 없는 추천 문장은 FPS 관측값으로 만들지 않는다', () => {
  const parsed = parseEstimateHtml(fixture, 'estimate_27192.html');

  assert.equal(parsed.games.some((game) => game.gameName === '숫자 없는 게임'), false);
});
