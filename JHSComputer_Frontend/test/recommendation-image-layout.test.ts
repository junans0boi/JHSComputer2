import assert from 'node:assert/strict';
import test from 'node:test';

import {
  RECOMMENDATION_CARD_IMAGE_CLASS,
  RECOMMENDATION_CARD_IMAGE_FRAME_CLASS,
  RECOMMENDATION_HERO_IMAGE_CLASS,
  RECOMMENDATION_HERO_IMAGE_FRAME_CLASS,
} from '../src/lib/recommendation-image-layout';

test('recommendation card images stay inside a bounded frame', () => {
  assert.match(RECOMMENDATION_CARD_IMAGE_FRAME_CLASS, /\bmin-w-0\b/);
  assert.match(RECOMMENDATION_CARD_IMAGE_FRAME_CLASS, /\bmin-h-0\b/);
  assert.match(RECOMMENDATION_CARD_IMAGE_FRAME_CLASS, /\boverflow-hidden\b/);
  assert.match(RECOMMENDATION_CARD_IMAGE_CLASS, /\bh-full\b/);
  assert.match(RECOMMENDATION_CARD_IMAGE_CLASS, /\bw-full\b/);
  assert.match(RECOMMENDATION_CARD_IMAGE_CLASS, /\bobject-contain\b/);
});

test('recommendation hero images use the same bounded-image contract', () => {
  assert.match(RECOMMENDATION_HERO_IMAGE_FRAME_CLASS, /\bmin-w-0\b/);
  assert.match(RECOMMENDATION_HERO_IMAGE_FRAME_CLASS, /\bmin-h-0\b/);
  assert.match(RECOMMENDATION_HERO_IMAGE_FRAME_CLASS, /\boverflow-hidden\b/);
  assert.match(RECOMMENDATION_HERO_IMAGE_CLASS, /\bh-full\b/);
  assert.match(RECOMMENDATION_HERO_IMAGE_CLASS, /\bw-full\b/);
  assert.match(RECOMMENDATION_HERO_IMAGE_CLASS, /\bobject-contain\b/);
});
