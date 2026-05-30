import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_ARGS = {
  compuzoneDir: null,
  compuzoneRoot: 'project/samples/compuzone',
  danawaRoot: 'project/samples/danawa',
  outDir: 'project/analysis/data-shape',
};

function parseArgs(argv) {
  const args = { ...DEFAULT_ARGS };

  for (const rawArg of argv) {
    const [key, value = ''] = rawArg.replace(/^--/, '').split('=');
    if (key === 'compuzone') args.compuzoneDir = value;
    if (key === 'compuzone-root') args.compuzoneRoot = value;
    if (key === 'danawa-root') args.danawaRoot = value;
    if (key === 'out') args.outDir = value;
    if (key === 'help') args.help = true;
  }

  return args;
}

function printHelp() {
  console.log(`
Sample data shape analyzer

Usage:
  npm run analyze:samples
  npm run analyze:samples -- --compuzone=project/samples/compuzone/2026-05-23_07-48-44

Options:
  --compuzone=...       Compuzone sample directory. Defaults to latest summary directory
  --compuzone-root=...  Compuzone sample root. Defaults to project/samples/compuzone
  --danawa-root=...     Danawa sample root. Defaults to project/samples/danawa
  --out=...             Report root. Defaults to project/analysis/data-shape
`);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

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

async function resolveLatestCompuzoneDir(explicitDir, compuzoneRoot) {
  if (explicitDir) return explicitDir;

  const root = compuzoneRoot;
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

  return dirsWithSummary.sort().at(-1);
}

function cleanExampleProduct(product) {
  return {
    externalProductId: product.productNo,
    name: product.name,
    price: product.pricing?.listPrice ?? null,
    discountPrice: product.pricing?.discountPrice ?? null,
    reviewCount: product.review?.count ?? null,
    rating: product.review?.rate ?? null,
    variantCount: product.variants?.length ?? 0,
    summarySpecText: product.summarySpecText ?? null,
    detailUrl: product.detailUrl ?? null,
  };
}

async function analyzeCompuzone(compuzoneDir) {
  const files = (await listJsonFiles(compuzoneDir)).filter((file) => path.basename(file) !== 'summary.json');
  const categories = [];
  let totalProducts = 0;
  let totalVariantRows = 0;

  for (const file of files.sort()) {
    const data = await readJson(file);
    const products = data.products ?? [];
    const productsWithVariants = products.filter((product) => (product.variants?.length ?? 0) > 0);
    const variantRows = products.reduce((sum, product) => sum + (product.variants?.length ?? 0), 0);
    const priceMissing = products.filter((product) => product.pricing?.listPrice == null).length;

    totalProducts += products.length;
    totalVariantRows += variantRows;

    categories.push({
      categoryFile: path.basename(file),
      ourCategory: data.category?.ourCategory ?? products[0]?.ourCategory ?? null,
      categoryName: data.category?.name ?? null,
      productCount: products.length,
      productsWithVariants: productsWithVariants.length,
      variantRows,
      priceMissing,
      example: products[0] ? cleanExampleProduct(products[0]) : null,
    });
  }

  return {
    sourceDir: compuzoneDir,
    categoryCount: categories.length,
    totalProducts,
    totalVariantRows,
    categories,
  };
}

function summarizeSpecKeys(specs = []) {
  const bySection = new Map();

  for (const spec of specs) {
    const section = spec.section ?? '(기본)';
    if (!bySection.has(section)) bySection.set(section, []);
    bySection.get(section).push(spec.key);
  }

  return [...bySection.entries()].map(([section, keys]) => ({
    section,
    keys: [...new Set(keys)],
  }));
}

async function analyzeDanawa(danawaRoot) {
  const dirs = (await listDirectories(danawaRoot)).sort();
  const queryReports = [];

  for (const dir of dirs) {
    const files = (await listJsonFiles(dir)).filter((file) => path.basename(file) !== 'summary.json');

    for (const file of files.sort()) {
      const data = await readJson(file);
      const top = data.results?.[0] ?? null;
      if (!top) continue;

      const specs = top.detail?.specs ?? [];
      queryReports.push({
        sourceDir: dir,
        query: data.query,
        topResult: {
          pcode: top.pcode,
          name: top.name,
          price: top.price ?? null,
          productUrl: top.productUrl ?? null,
          variantCount: top.variants?.length ?? 0,
          variants: top.variants ?? [],
          specCount: specs.length,
          specSections: summarizeSpecKeys(specs),
        },
      });
    }
  }

  return {
    sourceRoot: danawaRoot,
    sampleDirCount: dirs.length,
    queryCount: queryReports.length,
    queries: queryReports,
  };
}

function findQuery(danawa, includes) {
  return danawa.queries.find((query) => includes.every((part) => query.query.includes(part)));
}

function buildRecommendations(compuzone, danawa) {
  const compCpu = compuzone.categories.find((category) => category.ourCategory === 'CPU');
  const danawaCpu = findQuery(danawa, ['9800X3D']);
  const packageSignals = [];

  if (danawaCpu?.topResult?.variants?.length) {
    packageSignals.push({
      supplier: 'danawa',
      product: danawaCpu.topResult.name,
      variants: danawaCpu.topResult.variants,
    });
  }

  if (compCpu?.example?.variantCount) {
    packageSignals.push({
      supplier: 'compuzone',
      product: compCpu.example.name,
      variantCount: compCpu.example.variantCount,
    });
  }

  return [
    {
      topic: '표준 부품과 판매 단위 분리',
      decision:
        '`parts`는 기술 모델, `supplier_listings`/`supplier_listing_variants`는 실제 판매 페이지와 패키지 단위로 둔다.',
      evidence: packageSignals,
    },
    {
      topic: 'external_product_id 단일화',
      decision:
        '컴퓨존 ProductNo와 다나와 pcode는 모두 `supplier_listings.external_product_id`에 저장하고 `supplier_id + external_product_id`로 유니크 처리한다.',
      evidence: [
        '컴퓨존 샘플은 ProductNo를 안정적으로 제공한다.',
        '다나와 샘플은 pcode를 검색/상세/묶음 옵션의 키로 제공한다.',
      ],
    },
    {
      topic: '스펙 저장 2단계',
      decision:
        '다나와/컴퓨존 원본 스펙은 `part_spec_sources`에 저장하고, 호환성 판단 값만 카테고리별 정규화 테이블로 승격한다.',
      evidence: danawa.queries.map((query) => ({
        query: query.query,
        specCount: query.topResult.specCount,
        sections: query.topResult.specSections.map((section) => section.section),
      })),
    },
    {
      topic: 'part_spec_values 역할 축소',
      decision:
        '`part_spec_values`는 검색/필터용 보조 인덱스로 유지하고, 정답 스펙과 호환성 판단은 `cpu_specs`, `gpu_specs`, `mainboard_specs` 등에서 수행한다.',
      evidence: '다나와 스펙은 카테고리마다 키와 단위가 크게 달라 범용 key-value만으로 호환성 로직을 안정적으로 만들기 어렵다.',
    },
  ];
}

function renderMarkdown(report) {
  const lines = [];
  lines.push('# 데이터 모양 분석 리포트');
  lines.push('');
  lines.push(`- 생성 시각: ${report.createdAt}`);
  lines.push(`- 컴퓨존 샘플: \`${report.compuzone.sourceDir}\``);
  lines.push(`- 다나와 샘플 루트: \`${report.danawa.sourceRoot}\``);
  lines.push('');
  lines.push('## 컴퓨존 샘플 요약');
  lines.push('');
  lines.push('| 카테고리 | 상품 수 | 옵션 포함 상품 | 옵션 행 | 가격 누락 | 예시 상품 |');
  lines.push('|---|---:|---:|---:|---:|---|');
  for (const category of report.compuzone.categories) {
    lines.push(
      `| ${category.ourCategory ?? category.categoryFile} | ${category.productCount} | ${category.productsWithVariants} | ${category.variantRows} | ${category.priceMissing} | ${category.example?.name ?? ''} |`,
    );
  }
  lines.push('');
  lines.push('## 다나와 샘플 요약');
  lines.push('');
  lines.push('| 검색어 | 대표 pcode | 대표 상품 | 묶음 옵션 | 스펙 수 | 주요 섹션 |');
  lines.push('|---|---|---|---:|---:|---|');
  for (const query of report.danawa.queries) {
    lines.push(
      `| ${query.query} | ${query.topResult.pcode} | ${query.topResult.name} | ${query.topResult.variantCount} | ${query.topResult.specCount} | ${query.topResult.specSections
        .map((section) => section.section)
        .join(', ')} |`,
    );
  }
  lines.push('');
  lines.push('## DB 설계 반영점');
  lines.push('');
  for (const recommendation of report.recommendations) {
    lines.push(`### ${recommendation.topic}`);
    lines.push('');
    lines.push(recommendation.decision);
    lines.push('');
  }
  lines.push('## 다음 확인');
  lines.push('');
  lines.push('- 컴퓨존 상품명과 다나와 pcode 자동 매칭 점수식을 별도 샘플로 검증한다.');
  lines.push('- 스펙 정규화 파서는 CPU/GPU/메인보드부터 시작하고, 주문 호환성에 필요한 필드만 먼저 만든다.');
  lines.push('- 가격 이력은 매번 insert하고 현재가는 최신 `captured_at` 기준으로 조회한다.');
  lines.push('');

  return `${lines.join('\n')}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const compuzoneDir = await resolveLatestCompuzoneDir(args.compuzoneDir, args.compuzoneRoot);
  const compuzone = await analyzeCompuzone(compuzoneDir);
  const danawa = await analyzeDanawa(args.danawaRoot);
  const report = {
    createdAt: new Date().toISOString(),
    compuzone,
    danawa,
    recommendations: buildRecommendations(compuzone, danawa),
  };

  const timestamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
  const outDir = path.join(args.outDir, timestamp);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
  await writeFile(path.join(outDir, 'report.md'), renderMarkdown(report));

  console.log(JSON.stringify({ outDir, reportJson: path.join(outDir, 'report.json'), reportMd: path.join(outDir, 'report.md') }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
