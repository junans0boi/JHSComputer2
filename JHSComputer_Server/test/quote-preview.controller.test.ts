import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { validate } from 'class-validator';
import { IS_PUBLIC_KEY } from '../src/auth';
import { QuotesController } from '../src/quotes/quotes.controller';
import { QuotePreviewDto } from '../src/quotes/dto/quote-preview.dto';

test('preview controller forwards the profile through the public API seam', async () => {
  let received: unknown;
  const previewService = {
    preview: async (profile: unknown) => {
      received = profile;
      return { status: 'READY', candidates: [] };
    },
  };
  const constructorArgs = QuotesController.length >= 3
    ? ([{}, {}, previewService] as unknown[])
    : ([{}, previewService] as unknown[]);
  const controller = Reflect.construct(QuotesController, constructorArgs) as QuotesController;
  const dto = Object.assign(new QuotePreviewDto(), { profile: { profileVersion: 2 } });

  const result = await controller.previewQuote(dto);

  assert.deepEqual(received, dto.profile);
  assert.deepEqual(result, { status: 'READY', candidates: [] });
  assert.equal(Reflect.getMetadata(IS_PUBLIC_KEY, QuotesController.prototype.previewQuote), true);
});

test('preview DTO requires an object profile', async () => {
  const valid = Object.assign(new QuotePreviewDto(), { profile: { profileVersion: 2 } });
  const invalid = Object.assign(new QuotePreviewDto(), { profile: 'not-an-object' });

  assert.deepEqual(await validate(valid), []);
  assert.ok((await validate(invalid)).length > 0);
});
