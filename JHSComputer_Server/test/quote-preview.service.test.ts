import assert from 'node:assert/strict';
import test from 'node:test';
import type { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { BenchmarksService } from '../src/benchmarks/benchmarks.service';
import { QuotePreviewService } from '../src/quotes/quote-preview.service';
import { QUOTE_RULESET_VERSION } from '../src/quotes/quote-profile';

test('preview service loads only active sellable catalog units and returns candidate evidence', async () => {
  const sourceParts = [
    sourcePart('cpu', 'CPU', { cpuSpec: { socket: 'AM5', tdpW: 65, coreCount: 6, threadCount: 12, boostClockGhz: '4.5' } }),
    sourcePart('board', 'MAINBOARD', { mainboardSpec: { socket: 'AM5', memoryType: 'DDR5', formFactor: 'ATX' } }),
    sourcePart('ram', 'RAM', { ramSpec: { memoryType: 'DDR5', capacityGb: 32 } }),
    sourcePart('gpu', 'GPU', { gpuSpec: { memoryGb: 8, recommendedPsuW: 550, powerConsumptionW: 170, lengthMm: '220' } }),
    sourcePart('ssd', 'SSD', { storageSpec: { capacityGb: 1024 } }),
    sourcePart('psu', 'PSU', { psuSpec: { ratedWattage: 750, certification: '80PLUS GOLD' } }),
    sourcePart('case', 'CASE', { caseSpec: { supportedBoardFormsJson: ['ATX'], maxGpuLengthMm: '400', maxCoolerHeightMm: '170' } }),
    sourcePart('cooler', 'CPU_COOLER', { coolerSpec: { supportedSocketsJson: ['AM5'], heightMm: '160' } }),
  ];
  Object.assign(sourceParts[0], {
    manufacturer: 'AMD',
    popularityScore: '900',
    specStatus: 'PARSED_FROM_CRAWL',
    isAdminApproved: true,
  });
  Object.assign(sourceParts[0].supplierOffers[0].product, { reviewCount: 900, rating: '4.9' });
  const service = new QuotePreviewService(fakeRepository(sourceParts), fakeConfig(), fakeBenchmarks({
    items: [{
      game: 'APEX',
      resolution: 'QHD',
      fpsMin: 90,
      fpsMax: 120,
      sampleCount: 3,
      evidenceType: 'MEASURED',
      confidence: 'MEDIUM',
      evidenceNote: '원본 FPS 집계값입니다.',
    }],
    total: 1,
  }));

  const result = await service.preview({
    profileVersion: 2,
    rulesetVersion: QUOTE_RULESET_VERSION,
    workloadProfile: { workloads: [{ type: 'GAMING', weight: 100, details: { games: ['APEX'], resolution: 'QHD', refreshRate: 144 } }] },
    budgetProfile: { minimumWon: 500_000, targetWon: 1_000_000, maximumWon: 2_000_000, includes: ['PARTS', 'ASSEMBLY', 'SHIPPING'] },
    preferenceProfile: { preset: 'BALANCED', performance: 35, value: 25, aesthetics: 15, upgradeability: 25 },
    storageDemand: { systemGb: 1024, activeProjectGb: 0, archiveGb: 0, growthGbPerYear: 0, redundancy: 'NONE' },
    windowsOption: 'NONE',
  });

  assert.equal(result.status, 'READY');
  assert.equal(result.candidates[0].parts.length, 8);
  assert.equal(result.candidates[0].parts[0].externalProductId, 'product-cpu');
  assert.equal(result.candidates[0].parts[0].manufacturer, 'AMD');
  assert.equal(result.candidates[0].parts[0].reviewCount, 900);
  assert.equal(result.candidates[0].parts[0].rating, 4.9);
  assert.equal(result.candidates[0].parts[0].summarySpecText, 'CPU product spec');
  assert.match(result.candidates[0].parts[0].displaySpecText ?? '', /6코어/);
  assert.deepEqual(result.candidates[0].parts[0].detailImages, ['https://example.test/detail.jpg']);
  assert.equal(result.candidates[0].performanceEvidence.evidenceType, 'MEASURED');
  assert.equal(result.candidates[0].performanceEvidence.sampleCount, 3);
  assert.equal(result.candidates[0].performanceEvidence.results[0]?.game, 'APEX');
});

test('preview service rejects an invalid profile at the API seam', async () => {
  const service = new QuotePreviewService(fakeRepository([]), fakeConfig(), fakeBenchmarks());
  await assert.rejects(
    service.preview({ profileVersion: 1 }),
    (error: unknown) => error instanceof BadRequestException,
  );
});

test('does not expose a paused supplier product as a sellable catalog unit', async () => {
  const sourceParts = [
    sourcePart('cpu', 'CPU', { cpuSpec: { socket: 'AM5', tdpW: 65, coreCount: 6, threadCount: 12, boostClockGhz: '4.5' } }),
  ];
  sourceParts[0].supplierOffers[0].product.supplier.status = 'PAUSED';
  const service = new QuotePreviewService(fakeRepository(sourceParts), fakeConfig(), fakeBenchmarks());

  const result = await service.preview(validProfile());

  assert.equal(result.status, 'REVIEW_REQUIRED');
  assert.match(result.review?.reasons[0] ?? '', /CPU/);
});

function fakeRepository(parts: unknown[]) {
  const queryBuilder = {
    select() { return this; },
    leftJoinAndSelect() { return this; },
    where() { return this; },
    andWhere() { return this; },
    getMany: async () => parts,
  };
  return {
    createQueryBuilder: () => queryBuilder,
  } as unknown as Repository<any>;
}

function fakeConfig() {
  return { get: (key: string) => key === 'NODE_ENV' ? 'development' : undefined } as unknown as ConfigService;
}

function fakeBenchmarks(response = { items: [], total: 0, reason: 'no exact combo' }) {
  return { getQuotePerformance: async () => response } as unknown as BenchmarksService;
}

function validProfile() {
  return {
    profileVersion: 2,
    rulesetVersion: QUOTE_RULESET_VERSION,
    workloadProfile: { workloads: [{ type: 'GAMING', weight: 100, details: { games: ['APEX'], resolution: 'QHD', refreshRate: 144 } }] },
    budgetProfile: { minimumWon: 500_000, targetWon: 1_000_000, maximumWon: 2_000_000, includes: ['PARTS', 'ASSEMBLY', 'SHIPPING'] },
    preferenceProfile: { preset: 'BALANCED', performance: 35, value: 25, aesthetics: 15, upgradeability: 25 },
    storageDemand: { systemGb: 1024, activeProjectGb: 0, archiveGb: 0, growthGbPerYear: 0, redundancy: 'NONE' },
    windowsOption: 'NONE',
  };
}

function sourcePart(partId: string, code: string, specs: Record<string, unknown>) {
  return {
    id: partId,
    canonicalName: `${code} name`,
    manufacturer: 'TEST',
    popularityScore: '0',
    specStatus: 'PARSED_FROM_CRAWL',
    isAdminApproved: true,
    category: { code },
    ...specs,
    supplierOffers: [{
      id: `offer-${partId}`,
      offerName: `${code} offer`,
      isActive: true,
      isDefault: true,
      currentPriceDt: new Date('2026-09-08T00:00:00.000Z'),
      currentStockStatus: 'AVAILABLE',
      currentBenefitPrice: 100_000,
      currentPublicPrice: 100_000,
      product: {
        isActive: true,
        supplier: { status: 'ACTIVE' },
        externalProductId: `product-${partId}`,
        productName: `${code} product`,
        productUrl: `https://example.test/${partId}`,
        imageUrl: null,
        summarySpecText: `${code} product spec`,
        rawSpecJson: { detailImages: ['https://example.test/detail.jpg'] },
        reviewCount: 0,
        rating: null,
      },
    }],
  };
}
