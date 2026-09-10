import test from 'node:test';
import assert from 'node:assert/strict';
import {
  gpuChipsetMaker,
  gpuChipsetName,
  memoryTypes,
  normalizeSocket,
  parseSpecAttributes,
} from './spec-parser.mjs';

test('normalizes Korean and spaced LGA socket names', () => {
  assert.equal(normalizeSocket('인텔(소켓1700) / 14코어'), 'LGA1700');
  assert.equal(normalizeSocket('인텔 LGA 1851 / DDR5'), 'LGA1851');
  assert.equal(normalizeSocket('AMD 소켓 AM5'), 'AM5');
  assert.equal(normalizeSocket('AMD(소켓sTR5) / Threadripper'), 'STR5');
  assert.equal(normalizeSocket('FCLGA4677 / Xeon'), 'LGA4677');
});

test('keeps all CPU memory types from a mixed support string', () => {
  assert.deepEqual(memoryTypes('메모리 규격: DDR4 / 3200MHz / DDR5 / 5600MHz'), ['DDR4', 'DDR5']);
});

test('extracts GPU chipset from summary text before board details', () => {
  const attrs = parseSpecAttributes({
    name: '[Colorful] 지포스 RTX 5070 Ti BATTLE AX SFF D7 16GB',
    summarySpecText: 'RTX 5070 Ti / PCIe5.0x16 / 정격파워 750W 이상 / GDDR7',
  });
  assert.equal(attrs.gpuChipsetName, 'RTX 5070 TI');
  assert.equal(attrs.gpuChipsetMaker, 'NVIDIA');
  assert.equal(gpuChipsetName('RX 9070 XT / PCIe5.0x16'), 'RX 9070 XT');
  assert.equal(gpuChipsetMaker('Radeon RX 9070 XT'), 'AMD');
});

test('parses CPU fields from compact Korean summary text', () => {
  const attrs = parseSpecAttributes({
    name: '인텔 코어i7-14700K',
    summarySpecText: '14세대 / 랩터레이크 / 소켓1700 / 20코어 28스레드 / 기본 3.4GHz / 최대 5.6GHz / L2 28MB / L3 33MB / TDP 125W / PBP 125W / MTP 253W / DDR5-5600, DDR4-3200 / PCIe 5.0 / UHD 770',
  });

  assert.deepEqual(
    {
      family: attrs.family,
      generation: attrs.generation,
      codename: attrs.codename,
      coreCount: attrs.coreCount,
      threadCount: attrs.threadCount,
      baseClockGhz: attrs.baseClockGhz,
      boostClockGhz: attrs.boostClockGhz,
      l2CacheMb: attrs.l2CacheMb,
      l3CacheMb: attrs.l3CacheMb,
      tdpW: attrs.tdpW,
      pbpW: attrs.pbpW,
      mtpW: attrs.mtpW,
      memoryTypes: attrs.memoryTypes,
      pcieVersions: attrs.pcieVersions,
      hasIntegratedGraphics: attrs.hasIntegratedGraphics,
      integratedGraphicsName: attrs.integratedGraphicsName,
    },
    {
      family: 'Core i7',
      generation: '14세대',
      codename: '랩터레이크',
      coreCount: 20,
      threadCount: 28,
      baseClockGhz: 3.4,
      boostClockGhz: 5.6,
      l2CacheMb: 28,
      l3CacheMb: 33,
      tdpW: 125,
      pbpW: 125,
      mtpW: 253,
      memoryTypes: ['DDR5', 'DDR4'],
      pcieVersions: ['5.0'],
      hasIntegratedGraphics: true,
      integratedGraphicsName: 'UHD 770',
    },
  );
});

test('parses GPU and mainboard fields including dimensions and ports', () => {
  const gpu = parseSpecAttributes({
    name: 'MSI 지포스 RTX 5070 Ti 16GB',
    summarySpecText: 'RTX 5070 Ti / GDDR7 / PCIe 5.0 x16 / 권장파워 750W / 소비전력 300W / 보조전원 16핀 x1 / HDMI 2.1 1개, DP 2.1 3개 / 304 x 137 x 49mm',
  });
  assert.deepEqual(
    {
      seriesName: gpu.seriesName,
      memoryType: gpu.gpuMemoryType,
      interfaceText: gpu.gpuInterfaceText,
      recommendedPsuW: gpu.recommendedPsuW,
      powerConsumptionW: gpu.powerConsumptionW,
      powerPorts: gpu.powerPorts,
      heightMm: gpu.gpuHeightMm,
      thicknessMm: gpu.gpuThicknessMm,
      displayOutputs: gpu.displayOutputs,
    },
    {
      seriesName: 'RTX 50',
      memoryType: 'GDDR7',
      interfaceText: 'PCIe 5.0 x16',
      recommendedPsuW: 750,
      powerConsumptionW: 300,
      powerPorts: ['보조전원 16핀 x1'],
      heightMm: 137,
      thicknessMm: 49,
      displayOutputs: ['HDMI 2.1', 'DP 2.1'],
    },
  );

  const board = parseSpecAttributes({
    name: 'MSI PRO B650M-P AMD B650 M-ATX',
    summarySpecText: '소켓 AM5 / DDR5 / 메모리 슬롯 4개 / 최대 192GB / M.2 2개 / SATA 4개 / PCI Express x16 2개 / Wi-Fi 6E',
  });
  assert.deepEqual(
    {
      chipset: board.chipset,
      memorySlotCount: board.memorySlotCount,
      maxMemoryGb: board.maxMemoryGb,
      m2SlotCount: board.m2SlotCount,
      sataPortCount: board.sataPortCount,
      pcieX16SlotCount: board.pcieX16SlotCount,
      wifiBuiltin: board.wifiBuiltin,
    },
    {
      chipset: 'B650',
      memorySlotCount: 4,
      maxMemoryGb: 192,
      m2SlotCount: 2,
      sataPortCount: 4,
      pcieX16SlotCount: 2,
      wifiBuiltin: true,
    },
  );
});

test('parses PSU, RAM, storage, case, and cooler fields', () => {
  const psu = parseSpecAttributes({
    name: '마이크로닉스 850W 80PLUS GOLD 풀모듈러 ATX3.1',
    summarySpecText: 'PCIe 5.1 / PCI-E 8핀 x4 / 12V-2x6 x1',
  });
  assert.deepEqual(
    { certification: psu.certification, modularType: psu.modularType, pcie5Ready: psu.pcie5Ready, connectors: psu.connectors },
    { certification: '80PLUS GOLD', modularType: 'FULL', pcie5Ready: true, connectors: ['PCI-E 8핀 x4', '12V-2x6 x1'] },
  );

  const ram = parseSpecAttributes({
    name: 'G.SKILL DDR5-6000 32GB (16GBx2) XMP 3.0',
    summarySpecText: 'PC5-48000',
  });
  assert.deepEqual(
    { moduleCount: ram.moduleCount, speedMhz: ram.speedMhz, profileType: ram.profileType },
    { moduleCount: 2, speedMhz: 6000, profileType: 'XMP' },
  );

  const storage = parseSpecAttributes({
    name: '삼성전자 990 EVO Plus M.2 NVMe 1TB',
    detailSpecs: [{ key: '순차 읽기', value: '7,450 MB/s' }, { key: '순차 쓰기', value: '6,900 MB/s' }],
  });
  assert.deepEqual(
    { capacityGb: storage.capacityGb, seqReadMbps: storage.seqReadMbps, seqWriteMbps: storage.seqWriteMbps },
    { capacityGb: 1024, seqReadMbps: 7450, seqWriteMbps: 6900 },
  );

  assert.equal(parseSpecAttributes({ summarySpecText: '기본 제공 팬: 4개' }).fanCount, 4);
  assert.equal(parseSpecAttributes({ detailSpecs: [{ key: '팬 크기', value: '120mm' }] }).fanSizeMm, 120);
});

test('handles compact supplier variants without guessing absent values', () => {
  const cpu = parseSpecAttributes({
    name: '[AMD] EPYC 4585PX',
    summarySpecText: 'EPYC / 16코어 / 32쓰레드 / 120W TDP / 내장그래픽 탑재 / AMD 라데온 그래픽 / PCIe Gen5',
  });
  assert.deepEqual(
    {
      family: cpu.family,
      coreCount: cpu.coreCount,
      threadCount: cpu.threadCount,
      tdpW: cpu.tdpW,
      hasIntegratedGraphics: cpu.hasIntegratedGraphics,
      integratedGraphicsName: cpu.integratedGraphicsName,
      pcieVersions: cpu.pcieVersions,
    },
    {
      family: 'EPYC',
      coreCount: 16,
      threadCount: 32,
      tdpW: 120,
      hasIntegratedGraphics: true,
      integratedGraphicsName: '라데온 그래픽',
      pcieVersions: ['5.0'],
    },
  );

  const gpu = parseSpecAttributes({
    name: 'MSI 지포스 RTX 5090 32GB',
    summarySpecText: 'RTX 5090 / 16Pin / 1000W / DisplayPortx3개 / HDMIx1개',
  });
  assert.deepEqual(
    { recommendedPsuW: gpu.recommendedPsuW, powerPorts: gpu.powerPorts, displayOutputs: gpu.displayOutputs },
    { recommendedPsuW: 1000, powerPorts: ['16Pin'], displayOutputs: ['DP', 'HDMI'] },
  );

  const ram = parseSpecAttributes({ name: '삼성 DDR5 PC5-44800', summarySpecText: 'DDR5 / 16GB / 5600MHz / 1개' });
  assert.equal(ram.moduleCount, 1);
});

test('identifies the GPU maker from the detected chipset before generic product text', () => {
  assert.equal(gpuChipsetMaker('GIGABYTE Radeon RX 9070 GAMING OC RX 9070'), 'AMD');
  assert.equal(gpuChipsetMaker('ASUS TUF Gaming GeForce RTX 5090'), 'NVIDIA');
});
