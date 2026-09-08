import assert from 'node:assert/strict';
import test from 'node:test';
import { generateQuotePreview, type CatalogOffer, type CatalogPart } from '../src/quotes/quote-preview.engine';
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

test('returns REVIEW_REQUIRED instead of inventing parts when the budget cannot fit', () => {
  const result = generateQuotePreview({
    ...profile,
    budgetProfile: { ...profile.budgetProfile, minimumWon: 1, targetWon: 1, maximumWon: 1 },
  }, fixtureCatalog());

  assert.equal(result.status, 'REVIEW_REQUIRED');
  assert.deepEqual(result.candidates, []);
  assert.match(result.review?.reasons[0] ?? '', /예산|호환성/);
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
    part('psu-1', 'PSU', 'PSU 750W', { psu: { ratedWattage: 750 } }, [120_000]),
    part('psu-2', 'PSU', 'PSU 850W', { psu: { ratedWattage: 850 } }, [180_000]),
    part('case-1', 'CASE', 'Case ATX', { case: { supportedBoardForms: ['ATX'], maxGpuLengthMm: 400, maxCoolerHeightMm: 170 } }, [100_000]),
    part('cooler-1', 'CPU_COOLER', 'Cooler AM5', { cooler: { supportedSockets: ['AM5'], heightMm: 160 } }, [80_000]),
  ];
}

function part(partId: string, category: string, canonicalName: string, spec: CatalogPart['spec'], prices: number[]): CatalogPart {
  return {
    partId,
    category,
    canonicalName,
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
