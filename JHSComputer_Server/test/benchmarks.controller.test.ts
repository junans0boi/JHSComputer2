import assert from 'node:assert/strict';
import test from 'node:test';
import { NotFoundException } from '@nestjs/common';
import { BenchmarksController } from '../src/benchmarks/benchmarks.controller';

test('returns 404 when a recommendation combo reference does not exist', async () => {
  const controller = new BenchmarksController(
    { getRecommendationComboDetail: async () => null } as any,
    {} as any,
  );

  await assert.rejects(
    controller.getRecommendationComboDetail('combo_missing'),
    (error) => error instanceof NotFoundException,
  );
});
