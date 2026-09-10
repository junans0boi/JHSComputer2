import assert from 'node:assert/strict';
import test from 'node:test';
import {
  generateQuotePreview,
  summarizePerformanceEvidence,
  type CatalogOffer,
  type CatalogPart,
} from '../src/quotes/quote-preview.engine';
import { QUOTE_RULESET_VERSION, type QuoteProfileV2 } from '../src/quotes/quote-profile';

const profile: QuoteProfileV2 = {
  profileVersion: 2,
  rulesetVersion: QUOTE_RULESET_VERSION,
  workloadProfile: {
    workloads: [{ type: 'GAMING', weight: 100, details: { games: ['APEX'], resolution: 'QHD', refreshRate: 144 } }],
  },
  budgetProfile: { minimumWon: 1_000_000, targetWon: 1_700_000, maximumWon: 2_500_000, includes: ['PARTS', 'ASSEMBLY', 'SHIPPING'] },
  preferenceProfile: { preset: 'BALANCED', performance: 35, value: 25, aesthetics: 15, upgradeability: 25 },
  storageDemand: { systemGb: 1024, activeProjectGb: 0, archiveGb: 0, growthGbPerYear: 0, redundancy: 'NONE' },
  windowsOption: 'NONE',
};

test('returns up to three distinct ready candidates from exact sellable units', () => {
  const result = generateQuotePreview(profile, fixtureCatalog());

  assert.equal(result.status, 'READY');
  assert.equal(result.candidates.length, 3);
  for (const candidate of result.candidates) {
    assert.equal(candidate.parts.length, 8);
    assert.ok(candidate.totalWon <= profile.budgetProfile.maximumWon);
    assert.ok(candidate.parts.every((part) => part.offerId && part.externalProductId && part.priceWon > 0));
    assert.ok(candidate.compatibility.every((check) => check.passed));
    assert.equal(candidate.performanceEvidence.evidenceType, 'NONE');
  }
  assert.equal(new Set(result.candidates.map((candidate) => candidate.parts.map((part) => part.offerId).join('|'))).size, 3);
});

test('summarizes evidence without hiding derived or low-confidence results', () => {
  const result = summarizePerformanceEvidence([
    {
      game: 'APEX',
      resolution: 'QHD',
      fpsMin: 90,
      fpsMax: 120,
      sampleCount: 3,
      evidenceType: 'MEASURED',
      confidence: 'MEDIUM',
      evidenceNote: '원본 FPS 집계값입니다.',
    },
    {
      game: 'Cyberpunk 2077',
      resolution: '4K',
      fpsMin: 50,
      fpsMax: 65,
      sampleCount: 1,
      evidenceType: 'DERIVED',
      confidence: 'LOW',
      evidenceNote: '해상도별 독립 실측값이 없어 보정했습니다.',
    },
  ]);

  assert.equal(result.evidenceType, 'DERIVED');
  assert.equal(result.confidence, 'LOW');
  assert.equal(result.sampleCount, 4);
  assert.match(result.note, /원본 FPS/);
  assert.match(result.note, /보정했습니다/);
});

test('returns REVIEW_REQUIRED instead of inventing parts when the budget cannot fit', () => {
  const result = generateQuotePreview({
    ...profile,
    budgetProfile: { ...profile.budgetProfile, minimumWon: 1, targetWon: 1, maximumWon: 1 },
  }, fixtureCatalog());

  assert.equal(result.status, 'REVIEW_REQUIRED');
  assert.deepEqual(result.candidates, []);
  assert.match(result.review?.reasons[0] ?? '', /예산|호환성/);
  assert.ok((result.review?.shortfallWon ?? 0) > 0);
});

test('excludes hard-incompatible combinations before scoring', () => {
  const catalog = fixtureCatalog().map((part) => part.category === 'MAINBOARD'
    ? { ...part, spec: { ...part.spec, mainboard: { ...part.spec.mainboard!, socket: 'LGA1700' } } }
    : part);
  const result = generateQuotePreview(profile, catalog);

  assert.equal(result.status, 'REVIEW_REQUIRED');
  assert.match(result.review?.reasons[0] ?? '', /호환성|예산/);
});

test('requires two exact storage units for a redundancy request', () => {
  const result = generateQuotePreview({
    ...profile,
    storageDemand: { ...profile.storageDemand, redundancy: 'MIRROR' },
  }, fixtureCatalog());

  assert.equal(result.status, 'READY');
  assert.equal(result.candidates[0].parts.filter((part) => part.category === 'SSD').length, 2);
  assert.ok(result.candidates[0].compatibility.some((check) => check.rule === 'STORAGE_REDUNDANCY'));
});

test('includes the selected Windows license in the budget boundary', () => {
  const result = generateQuotePreview({
    ...profile,
    budgetProfile: {
      minimumWon: 1_000_000,
      targetWon: 1_100_000,
      maximumWon: 1_200_000,
      includes: ['PARTS', 'ASSEMBLY', 'SHIPPING', 'WINDOWS'],
    },
    windowsOption: 'WINDOWS_11_HOME_FPP',
  }, fixtureCatalog());

  assert.equal(result.status, 'REVIEW_REQUIRED');
  assert.deepEqual(result.candidates, []);
});

test('uses workload details as hard minimums instead of returning an undersized AI build', () => {
  const result = generateQuotePreview({
    ...profile,
    workloadProfile: {
      workloads: [{ type: 'AI', weight: 100, details: { mode: 'INFERENCE', modelSize: '70B', quantization: 'Q4' } }],
    },
  }, fixtureCatalog());

  assert.equal(result.status, 'REVIEW_REQUIRED');
  assert.deepEqual(result.candidates, []);
});

test('searches all compatible board and cooler choices before declaring the budget infeasible', () => {
  const catalog = [
    ...fixtureCatalog(),
    part('board-expensive', 'MAINBOARD', 'Board AM5 Expensive', { mainboard: { socket: 'AM5', memoryType: 'DDR5', formFactor: 'ATX' } }, [300_000]),
    part('board-cheap', 'MAINBOARD', 'Board AM5 Cheap', { mainboard: { socket: 'AM5', memoryType: 'DDR5', formFactor: 'ATX' } }, [50_000]),
  ];
  const result = generateQuotePreview({
    ...profile,
    budgetProfile: { minimumWon: 1_000_000, targetWon: 1_050_000, maximumWon: 1_100_000, includes: ['PARTS', 'ASSEMBLY', 'SHIPPING'] },
  }, catalog);

  assert.equal(result.status, 'READY');
  assert.equal(result.candidates[0].parts.find((part) => part.category === 'MAINBOARD')?.externalProductId, 'board-cheap-product-1');
});

test('skips a cheaper board when its form factor cannot fit the case', () => {
  const catalog = [
    ...fixtureCatalog().filter((part) => part.category !== 'MAINBOARD'),
    part('board-cheap-incompatible', 'MAINBOARD', 'Board AM5 Cheap mATX', { mainboard: { socket: 'AM5', memoryType: 'DDR5', formFactor: 'M-ATX' } }, [50_000]),
    part('board-expensive-compatible', 'MAINBOARD', 'Board AM5 Expensive', { mainboard: { socket: 'AM5', memoryType: 'DDR5', formFactor: 'ATX' } }, [300_000]),
    part('board-feasible', 'MAINBOARD', 'Board AM5 Feasible', { mainboard: { socket: 'AM5', memoryType: 'DDR5', formFactor: 'ATX' } }, [180_000]),
  ];
  const result = generateQuotePreview({
    ...profile,
    budgetProfile: { minimumWon: 1_000_000, targetWon: 1_150_000, maximumWon: 1_200_000, includes: ['PARTS', 'ASSEMBLY', 'SHIPPING'] },
  }, catalog);

  assert.equal(result.status, 'READY');
  assert.equal(result.candidates[0].parts.find((part) => part.category === 'MAINBOARD')?.externalProductId, 'board-feasible-product-1');
});

test('AI candidates reject accessory PSUs, weak platform parts, and non-CUDA GPUs', () => {
  const aiProfile: QuoteProfileV2 = {
    ...profile,
    workloadProfile: {
      workloads: [{ type: 'AI', weight: 100, details: { mode: 'INFERENCE', modelSize: '13B', quantization: 'Q4' } }],
    },
    budgetProfile: { minimumWon: 1_000_000, targetWon: 2_000_000, maximumWon: 3_000_000, includes: ['PARTS', 'ASSEMBLY', 'SHIPPING'] },
    preferenceProfile: { preset: 'PERFORMANCE', performance: 45, value: 15, aesthetics: 10, upgradeability: 30 },
  };
  const catalog = [
    part('ai-cpu', 'CPU', 'Ryzen 9 9950X', { cpu: { socket: 'AM5', tdpW: 170, coreCount: 16, threadCount: 32, boostClockGhz: 5.7 } }, [450_000]),
    part('ai-board-bad', 'MAINBOARD', 'A620 entry board', { mainboard: { socket: 'AM5', memoryType: 'DDR5', formFactor: 'M-ATX' } }, [50_000]),
    part('ai-board-good', 'MAINBOARD', 'B650 creator board', { mainboard: { socket: 'AM5', memoryType: 'DDR5', formFactor: 'ATX' } }, [180_000]),
    part('ai-ram', 'RAM', 'DDR5 64GB kit', { ram: { memoryType: 'DDR5', capacityGb: 64 } }, [150_000]),
    part('ai-gpu-amd', 'GPU', 'AMD Radeon RX 7900 16GB', { gpu: { chipsetMaker: 'NVIDIA', memoryGb: 16, recommendedPsuW: 750, powerConsumptionW: 300, lengthMm: 320 } }, [700_000]),
    part('ai-gpu-nvidia', 'GPU', 'NVIDIA RTX 4080 16GB', { gpu: { memoryGb: 16, recommendedPsuW: 750, powerConsumptionW: 320, lengthMm: 320 } }, [1_000_000]),
    part('ai-ssd', 'SSD', 'NVMe SSD 1TB', { storage: { capacityGb: 1024 } }, [100_000]),
    part('ai-psu-cable', 'PSU', '600W 12VHPWR 전원 케이블', { psu: { ratedWattage: 600 } }, [10_000]),
    part('ai-psu-good', 'PSU', '850W 80PLUS GOLD 파워', { psu: { ratedWattage: 850, certification: '80PLUS GOLD' } }, [100_000]),
    part('ai-case-bad', 'CASE', 'ATX 미니 케이스', { case: { supportedBoardForms: ['M-ATX', 'ATX'], maxGpuLengthMm: 400, maxCoolerHeightMm: 170, fanCount: 1 } }, [10_000]),
    part('ai-case-good', 'CASE', 'ATX airflow case', { case: { supportedBoardForms: ['ATX'], maxGpuLengthMm: 400, maxCoolerHeightMm: 170, fanCount: 3 } }, [80_000]),
    part('ai-cooler-bad', 'CPU_COOLER', '45mm 알루미늄 CPU 쿨러', { cooler: { supportedSockets: ['AM5'], heightMm: 45 } }, [5_000]),
    part('ai-cooler-good', 'CPU_COOLER', '155mm 듀얼타워 CPU 쿨러', { cooler: { supportedSockets: ['AM5'], heightMm: 155 } }, [80_000]),
  ];

  const result = generateQuotePreview(aiProfile, catalog);

  assert.equal(result.status, 'READY');
  assert.ok(result.candidates.length >= 1);
  for (const candidate of result.candidates) {
    const selectedIds = candidate.parts.map((part) => part.partId);
    assert.ok(selectedIds.includes('ai-board-good'));
    assert.ok(selectedIds.includes('ai-gpu-nvidia'));
    assert.ok(selectedIds.includes('ai-psu-good'));
    assert.ok(selectedIds.includes('ai-case-good'));
    assert.ok(selectedIds.includes('ai-cooler-good'));
    assert.equal(selectedIds.includes('ai-board-bad'), false);
    assert.equal(selectedIds.includes('ai-gpu-amd'), false);
    assert.equal(selectedIds.includes('ai-psu-cable'), false);
    assert.equal(selectedIds.includes('ai-cooler-bad'), false);
  }
});

test('does not let an unverified low-price core part outrank a trusted popular product', () => {
  const catalog = fixtureCatalog().map((part) => {
    if (part.category !== 'GPU') return part;
    const trusted = part.partId !== 'gpu-1';
    return {
      ...part,
      manufacturer: trusted ? 'MSI' : 'UNKNOWN OEM',
      popularityScore: trusted ? 900 : 0,
      specStatus: trusted ? 'PARSED_FROM_CRAWL' : 'UNVERIFIED',
      isAdminApproved: trusted,
      offers: part.offers.map((offer) => ({
        ...offer,
        reviewCount: trusted ? 900 : 0,
        rating: trusted ? 4.9 : null,
      })),
    };
  });

  const result = generateQuotePreview(profile, catalog);

  assert.equal(result.status, 'READY');
  assert.ok(result.candidates.every((candidate) => candidate.parts.find((part) => part.category === 'GPU')?.partId !== 'gpu-1'));
  assert.ok(result.candidates.every((candidate) => candidate.parts.find((part) => part.category === 'GPU')?.trustLabel === 'VERIFIED_MANUFACTURER'));
  assert.ok(result.candidates[0].selectionReasons.some((reason) => /검증 제조사/.test(reason)));
});

function fixtureCatalog(): CatalogPart[] {
  return [
    part('cpu-1', 'CPU', 'CPU Basic', { cpu: { socket: 'AM5', tdpW: 65, coreCount: 6, threadCount: 12, boostClockGhz: 4.5 } }, [100_000, 150_000, 200_000]),
    part('cpu-2', 'CPU', 'CPU Pro', { cpu: { socket: 'AM5', tdpW: 105, coreCount: 8, threadCount: 16, boostClockGhz: 5.0 } }, [250_000]),
    part('cpu-3', 'CPU', 'CPU Ultra', { cpu: { socket: 'AM5', tdpW: 120, coreCount: 12, threadCount: 24, boostClockGhz: 5.2 } }, [400_000]),
    part('board-1', 'MAINBOARD', 'Board AM5', { mainboard: { socket: 'AM5', memoryType: 'DDR5', formFactor: 'ATX' } }, [180_000]),
    part('ram-1', 'RAM', 'RAM 32GB', { ram: { memoryType: 'DDR5', capacityGb: 32 } }, [100_000]),
    part('ram-2', 'RAM', 'RAM 64GB', { ram: { memoryType: 'DDR5', capacityGb: 64 } }, [200_000]),
    part('gpu-1', 'GPU', 'GPU 8GB', { gpu: { memoryGb: 8, recommendedPsuW: 550, powerConsumptionW: 170, lengthMm: 220 } }, [300_000]),
    part('gpu-2', 'GPU', 'GPU 12GB', { gpu: { memoryGb: 12, recommendedPsuW: 650, powerConsumptionW: 220, lengthMm: 280 } }, [500_000]),
    part('gpu-3', 'GPU', 'GPU 16GB', { gpu: { memoryGb: 16, recommendedPsuW: 750, powerConsumptionW: 300, lengthMm: 320 } }, [700_000]),
    part('ssd-1', 'SSD', 'SSD 1TB', { storage: { capacityGb: 1024 } }, [100_000]),
    part('ssd-2', 'SSD', 'SSD 2TB', { storage: { capacityGb: 2048 } }, [180_000]),
    part('psu-1', 'PSU', 'PSU 750W', { psu: { ratedWattage: 750, certification: '80PLUS GOLD' } }, [120_000]),
    part('psu-2', 'PSU', 'PSU 850W', { psu: { ratedWattage: 850, certification: '80PLUS GOLD' } }, [180_000]),
    part('case-1', 'CASE', 'Case ATX', { case: { supportedBoardForms: ['ATX'], maxGpuLengthMm: 400, maxCoolerHeightMm: 170 } }, [100_000]),
    part('cooler-1', 'CPU_COOLER', 'Cooler AM5', { cooler: { supportedSockets: ['AM5'], heightMm: 160 } }, [80_000]),
  ];
}

function part(partId: string, category: string, canonicalName: string, spec: CatalogPart['spec'], prices: number[]): CatalogPart {
  return {
    partId,
    category,
    canonicalName,
    manufacturer: 'TEST',
    popularityScore: 0,
    specStatus: 'PARSED_FROM_CRAWL',
    isAdminApproved: true,
    spec,
    offers: prices.map((priceWon, index) => offer(`${partId}-offer-${index + 1}`, `${partId}-product-${index + 1}`, priceWon)),
  };
}

function offer(offerId: string, externalProductId: string, priceWon: number): CatalogOffer {
  return {
    offerId,
    externalProductId,
    productName: externalProductId,
    productUrl: `https://example.test/${externalProductId}`,
    imageUrl: null,
    offerName: externalProductId,
    priceWon,
    publicPriceWon: priceWon,
    stockStatus: 'AVAILABLE',
    priceCheckedAt: '2026-09-08T00:00:00.000Z',
    isDefault: true,
  };
}
