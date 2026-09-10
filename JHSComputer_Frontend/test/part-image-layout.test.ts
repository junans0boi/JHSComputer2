import assert from 'node:assert/strict';
import test from 'node:test';
import { PART_PRODUCT_CARD_GRID_CLASS, PART_PRODUCT_IMAGE_CLASS, PART_PRODUCT_IMAGE_FRAME_CLASS } from '../src/lib/part-image-layout';

test('부품 쇼핑 카드 이미지는 모바일 고정 프레임 안에서 전체가 보여야 한다', () => {
  assert.match(PART_PRODUCT_CARD_GRID_CLASS, /grid-cols-\[96px_minmax\(0,1fr\)\]/);
  assert.match(PART_PRODUCT_IMAGE_FRAME_CLASS, /h-24/);
  assert.match(PART_PRODUCT_IMAGE_FRAME_CLASS, /w-24/);
  assert.match(PART_PRODUCT_IMAGE_FRAME_CLASS, /min-w-0/);
  assert.match(PART_PRODUCT_IMAGE_FRAME_CLASS, /overflow-hidden/);
  assert.deepEqual(PART_PRODUCT_IMAGE_CLASS.split(' ').sort(), ['block', 'h-full', 'object-contain', 'w-full'].sort());
});
