import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

async function listDirectories(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(rootDir, entry.name));
}

async function listJsonFiles(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(rootDir, entry.name));
}

function normalizeCategory(category) {
  const categoryMap = {
    CASE: '케이스',
    COOLER: '쿨러',
    GPU: '그래픽카드',
    MAINBOARD: '메인보드',
    PSU: '파워',
  };

  return categoryMap[category] ?? category;
}

async function syncCatalog() {
  const root = '../project/samples/compuzone';
  const dirs = await listDirectories(root);
  const dirsWithSummary = [];

  for (const dir of dirs) {
    const files = await listJsonFiles(dir);
    if (files.some((file) => path.basename(file) === 'summary.json')) {
      dirsWithSummary.push(dir);
    }
  }

  if (!dirsWithSummary.length) {
    throw new Error('No Compuzone sample directory with summary.json found.');
  }

  const latestDir = dirsWithSummary.sort().at(-1);
  const files = (await listJsonFiles(latestDir)).filter((file) => path.basename(file) !== 'summary.json');
  
  const catalogParts = [];
  
  for (const file of files) {
    const data = JSON.parse(await readFile(file, 'utf8'));
    const products = data.products ?? [];
    
    for (const product of products) {
      catalogParts.push({
        id: `${product.ourCategory}-${product.productNo}`,
        category: normalizeCategory(product.ourCategory),
        productNo: product.productNo,
        name: product.name,
        price: product.pricing?.discountPrice ?? product.pricing?.listPrice ?? 0,
        imageUrl: product.imageUrl,
        detailUrl: product.detailUrl,
        detailImages: product.detailSample?.parsed?.detailImages ?? [],
        spec: product.summarySpecText ?? '',
        reviewCount: product.review?.count ?? 0,
        reviewRate: product.review?.rate ?? 0,
        badges: product.badges ?? [],
      });
    }
  }

  const outputContent = `import type { CatalogPart, PartCategory } from './v1-types';

export const partCategories: PartCategory[] = ['CPU', '메인보드', 'RAM', '그래픽카드', 'SSD', '파워', '케이스', '쿨러'];

export const compuzoneCatalog: CatalogPart[] = ${JSON.stringify(catalogParts, null, 2)};

export function getPartsByCategory(category: PartCategory) {
  return compuzoneCatalog.filter((part) => part.category === category);
}

export function getRecommendedPart(category: PartCategory, tier = 0) {
  const parts = getPartsByCategory(category).sort((a, b) => a.price - b.price);
  if (!parts.length) return undefined;
  const index = Math.max(0, Math.min(parts.length - 1, tier * 2));
  return parts[index];
}
`;

  await writeFile('../JHSComputer_Frontend/src/lib/compuzone-catalog.ts', outputContent, 'utf8');
  console.log(`Successfully synced catalog to JHSComputer_Frontend/src/lib/compuzone-catalog.ts with ${catalogParts.length} parts from ${latestDir}`);
}

syncCatalog().catch(console.error);
