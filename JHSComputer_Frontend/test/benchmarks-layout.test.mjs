import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const frontendRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

test('benchmarks page stays focused on FPS evidence and component scores', async () => {
  const page = await readFile(join(frontendRoot, 'src/app/benchmarks/page.tsx'), 'utf8');

  assert.doesNotMatch(page, /BenchmarkRecommendationSection/);
  assert.doesNotMatch(page, /loadRecommendationCombo/);
});

test('FPS table does not repeat source audit details in every cell', async () => {
  const table = await readFile(join(frontendRoot, 'src/components/benchmarks/BenchmarkGameTable.tsx'), 'utf8');

  assert.doesNotMatch(table, /evidenceLabel|sampleCount|evidenceNote|sourceNames|testSystem|sourceUrl/);
});
