import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SaveQuoteSnapshotDto } from '../src/quotes/dto/quote.dto';

test('save snapshot accepts the full compatibility and provenance payload from a preview candidate', async () => {
  const dto = plainToInstance(SaveQuoteSnapshotDto, {
    compatibility: Array.from({ length: 9 }, (_, index) => `통과: RULE_${index}`),
    profile: { profileVersion: 2, budgetProfile: { includes: ['PARTS'] } },
    preview: { candidateId: 'CANDIDATE-1', rulesetVersion: 'quote-preview-v1' },
    performance: [{ game: 'APEX', fpsMin: 90, fpsMax: 120, evidenceType: 'MEASURED' }],
    parts: [{
      category: 'GPU',
      name: 'GPU',
      productNo: 'product-1',
      offerId: '42',
      offerName: 'GPU 기본 판매 단위',
      supplier: 'COMPUZONE',
      stockStatus: 'AVAILABLE',
      priceCheckedAt: '2026-09-08T00:00:00.000Z',
      quantity: 1,
    }],
  });

  const errors = await validate(dto);
  assert.deepEqual(errors, []);
});
