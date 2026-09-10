import assert from 'node:assert/strict';
import test from 'node:test';
import { candidateToQuote } from '../src/lib/quote-preview-client';
import { quoteInputToProfile } from '../src/lib/quote-profile';

const input = {
  budget: 180,
  purpose: '게임' as const,
  games: ['APEX'],
  resolution: 'QHD' as const,
  storage: '1TB' as const,
  windows: 'NONE' as const,
  priority: '성능 우선' as const,
};

test('converts a server candidate into the legacy quote shape without losing evidence', () => {
  const profile = quoteInputToProfile(input);
  const quote = candidateToQuote({
    id: 'CANDIDATE-1',
    strategy: 'VALUE_UPGRADE',
    status: 'READY',
    parts: [{
      offerId: 'offer-1', externalProductId: 'product-1', productName: 'GPU', productUrl: 'https://example.test/gpu', imageUrl: null,
      offerName: 'GPU', priceWon: 300_000, publicPriceWon: 320_000, stockStatus: 'AVAILABLE', priceCheckedAt: '2026-09-08T00:00:00.000Z',
      isDefault: true, partId: 'part-1', category: 'GPU', partName: 'GPU', displaySpecText: '12GB / PCIe 4.0', detailImages: ['https://example.test/detail.jpg'],
    }],
    subtotalWon: 300_000,
    assemblyFeeWon: 50_000,
    shippingFeeWon: 10_000,
    windowsFeeWon: 0,
    totalWon: 360_000,
    priceCheckedAt: '2026-09-08T00:00:00.000Z',
    selectionReasons: ['가성비'],
    unmetConditions: [],
    compatibility: [{ rule: 'GPU_PRESENT', passed: true, detail: 'GPU' }],
    performanceEvidence: {
      evidenceType: 'MEASURED',
      confidence: 'MEDIUM',
      sampleCount: 3,
      results: [
        { game: 'APEX', resolution: 'QHD', grade: '쾌적', fpsMin: 90, fpsMax: 120, evidenceType: 'MEASURED', confidence: 'MEDIUM', sampleCount: 3 },
        { game: 'UNKNOWN', resolution: 'QHD', grade: '비추천', fpsMin: null as unknown as number, fpsMax: null as unknown as number, evidenceType: 'MEASURED', confidence: 'LOW', sampleCount: 0 },
      ],
      note: '원본 FPS 집계값입니다.',
    },
  }, profile, input);

  assert.equal(quote.total, 360_000);
  assert.equal(quote.parts[0]?.category, '그래픽카드');
  assert.equal(quote.parts[0]?.productNo, 'product-1');
  assert.equal(quote.parts[0]?.offerId, 'offer-1');
  assert.equal(quote.parts[0]?.offerName, 'GPU');
  assert.equal(quote.parts[0]?.specSummary, '12GB / PCIe 4.0');
  assert.deepEqual(quote.parts[0]?.detailImages, ['https://example.test/detail.jpg']);
  assert.equal(quote.performance[0]?.evidenceType, 'MEASURED');
  assert.equal(quote.performance[0]?.sampleCount, 3);
  assert.equal(quote.performance.length, 1);
  assert.deepEqual(quote.performanceEvidence, {
    evidenceType: 'MEASURED',
    confidence: 'MEDIUM',
    sampleCount: 3,
    note: '원본 FPS 집계값입니다.',
  });
  assert.match(quote.compatibility[0] ?? '', /^통과:/);
});
