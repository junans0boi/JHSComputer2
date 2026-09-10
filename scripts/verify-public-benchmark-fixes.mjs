#!/usr/bin/env node

import assert from 'node:assert/strict';

const baseUrl = process.env.PUBLIC_BASE_URL ?? 'https://jhspc.kro.kr';

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  assert.equal(response.ok, true, `${path} returned HTTP ${response.status}: ${text.slice(0, 240)}`);
  return body;
}

const combos = await get('/api/benchmarks/combos?limit=200&includeNoFps=true');
const comboNames = combos.items.map((item) => item.publicComboName);
assert.equal(new Set(comboNames).size, comboNames.length, 'public benchmark combo names must be unique');
assert.ok(comboNames.includes('Ryzen5 9600X + RTX 5060'), '9600X public combo name is missing');

const fpsCombo = combos.items.find((item) => item.hasFpsEvidence);
if (fpsCombo) {
  const games = await get(`/api/benchmarks/combos/${encodeURIComponent(fpsCombo.publicComboRef)}/games?limit=500`);
  const byGame = new Map();
  for (const item of games.items) {
    const values = `${item.displayFpsMin}-${item.displayFpsMax}`;
    const list = byGame.get(item.gameName) ?? [];
    list.push(values);
    byGame.set(item.gameName, list);
  }
  for (const [gameName, values] of byGame) {
    assert.ok(values.length === 1 || new Set(values).size > 1, `${gameName} repeats one FPS range for every resolution`);
  }
}

const recommendations = await get('/api/recommendation-posts?limit=50');
assert.ok(new Set(recommendations.items.map((item) => item.thumbnailImageUrl)).size > 1, 'recommendation thumbnails are all identical');
for (const item of recommendations.items) {
  const detail = await get(`/api/recommendation-posts/${encodeURIComponent(item.slug)}`);
  const casePart = detail.parts.find((part) => part.category === 'CASE' || part.label === '케이스');
  assert.ok(casePart, `${item.slug} has no case part`);
  assert.equal(item.thumbnailImageUrl, casePart.imageUrl, `${item.slug} thumbnail does not match its selected case`);
}

const detailImages = await get('/compuzone-detail?productNo=1062764');
assert.ok(Array.isArray(detailImages.images) && detailImages.images.length > 0, 'Compuzone detail image endpoint returned no images');

console.log(`PASS combos=${combos.total} recommendations=${recommendations.total} detailImages=${detailImages.images.length}`);
