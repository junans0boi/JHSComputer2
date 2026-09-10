import assert from 'node:assert/strict';
import test from 'node:test';
import { parseComputerBasePage } from './import-benchmarks.mjs';

const page = `
  <div data-title="Black Myth: Wukong, 1.920 × 1.080, TAA Native – Rasterizer">
    <div class="chart__group"><div class="chart__group-header">FPS, Durchschnitt</div>
      <div class="chart__row"><span class="chart__item">GeForce RTX 5060 (8 GB)</span><span class="chart__label" data-value="120"></span></div>
    </div>
  </div>
  <div data-title="Black Myth: Wukong, 1.920 × 1.080, DLSS Quality – Raytracing">
    <div class="chart__group"><div class="chart__group-header">FPS, Durchschnitt</div>
      <div class="chart__row"><span class="chart__item">GeForce RTX 5060 (8 GB)</span><span class="chart__label" data-value="82"></span></div>
    </div>
  </div>
`;

test('keeps distinct option presets for the same game and resolution', () => {
  const records = parseComputerBasePage(page, {
    pageUrl: 'https://example.test/page',
    targetModels: ['rtx5060'],
  });

  assert.equal(records.length, 2);
  assert.deepEqual(records.map((record) => record.optionPreset), ['TAA Native – Rasterizer', 'DLSS Quality – Raytracing']);
  assert.deepEqual(records.map((record) => record.fps), [120, 82]);
});
