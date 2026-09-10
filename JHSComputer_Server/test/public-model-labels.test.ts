import assert from 'node:assert/strict';
import test from 'node:test';
import { formatPublicComboName, formatPublicCpuModel, formatPublicGpuModel } from '../src/benchmarks/public-model-labels';

test('formats collected CPU and GPU model keys for customer-facing screens', () => {
  assert.equal(formatPublicCpuModel('ryzen7-9800x3d', 'AMD 라이젠7 9800X3D'), 'Ryzen7 9800X3D');
  assert.equal(formatPublicGpuModel('rx9070xt', 'AMD Radeon RX 9070 XT 16GB'), 'RX 9070XT');
  assert.equal(formatPublicComboName('ryzen7-9800x3d', 'rx9070xt', 'AMD 라이젠7 9800X3D', 'AMD Radeon RX 9070 XT 16GB'), 'Ryzen7 9800X3D + RX 9070XT');
});

test('keeps readable fallback text when a model is not in a known family', () => {
  assert.equal(formatPublicCpuModel('core-ultra-7-265k', 'Intel Core Ultra 7 265K'), 'Core Ultra 7 265K');
  assert.equal(formatPublicGpuModel('custom-gpu', 'Custom GPU'), 'Custom GPU');
});

test('removes generation and marketing text from Korean Ryzen model names', () => {
  assert.equal(
    formatPublicCpuModel(
      'AMD 라이젠5 6세대 9600X 6코어 12쓰레드 터보5.4G',
      'AMD 라이젠5-6세대 9600X 6코어 12쓰레드 터보5.4G',
    ),
    'Ryzen5 9600X',
  );
});

test('merges Korean and English Core Ultra naming variants by model number', () => {
  const canonical = formatPublicCpuModel(
    '코어 울트라7 시리즈2 270K',
    '코어 울트라7 시리즈2 270K',
  );
  const marketingName = formatPublicCpuModel(
    '인텔 15세대 애로우 울트라7 270K Plus 24코어 24스레드 터보5.5G',
    '인텔 15세대 애로우 울트라7 270K Plus 24코어 24스레드 터보5.5G',
  );

  assert.equal(canonical, 'Core Ultra 7 270K');
  assert.equal(marketingName, canonical);
});
