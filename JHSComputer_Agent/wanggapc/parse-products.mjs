import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function parseArgs(argv) {
  const args = { input: '../data', out: '../project/samples/wanggapc/parsed' };
  for (const rawArg of argv) {
    const normalizedArg = rawArg.replace(/^--/, '');
    const separatorIndex = normalizedArg.indexOf('=');
    const key = separatorIndex >= 0 ? normalizedArg.slice(0, separatorIndex) : normalizedArg;
    const value = separatorIndex >= 0 ? normalizedArg.slice(separatorIndex + 1) : '';
    if (key === 'input') args.input = value;
    if (key === 'out') args.out = value;
  }
  return args;
}

async function listHtmlFiles(input) {
  const stat = await import('node:fs/promises').then((fs) => fs.stat(input));
  if (stat.isFile()) return [input];
  const entries = await readdir(input, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => path.join(input, entry.name));
}

function clean(value = '') {
  return String(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function extractAssignedObject(text, token) {
  const start = text.indexOf(token);
  if (start < 0) return null;
  const brace = text.indexOf('{', start);
  if (brace < 0) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let index = brace; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escape) escape = false;
      else if (char === '\\\\') escape = true;
      else if (char === '"') inString = false;
    } else if (char === '"') {
      inString = true;
    } else if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) return text.slice(brace, index + 1);
    }
  }
  return null;
}

function normalizeCategory(title = '') {
  const text = clean(title);
  if (/CPU$/i.test(text) || text === 'CPU') return 'CPU';
  if (/쿨러/i.test(text)) return 'COOLER';
  if (/메모리|램/i.test(text)) return 'RAM';
  if (/그래픽|VGA/i.test(text)) return 'GPU';
  if (/메인보드|보드/i.test(text)) return 'MAINBOARD';
  if (/SSD|저장/i.test(text)) return 'SSD';
  if (/하드|HDD/i.test(text)) return 'HDD';
  if (/케이스/i.test(text)) return 'CASE';
  if (/파워/i.test(text)) return 'POWER';
  if (/운영체제|윈도우/i.test(text)) return 'OS';
  if (/사은품|서비스|조립/i.test(text)) return 'SERVICE';
  return text || 'ETC';
}

function shortCpu(name = '') {
  const patterns = [
    /(울트라\s*\d\s*(?:시리즈\s*2)?\s*\d{3}K?F?(?:\s*PLUS)?)/i,
    /(CORE\s*ULTRA\s*\d\s*\d{3}K?F?(?:\s*PLUS)?)/i,
    /([0-9]{4,5}X3D)/i,
    /([0-9]{4,5}KF)/i,
    /([0-9]{4,5}K)/i,
    /([0-9]{4,5}F)/i,
    /([0-9]{4,5}G?T?)/i,
  ];
  for (const pattern of patterns) {
    const match = clean(name).match(pattern);
    if (match) return match[0].replace(/\s+/g, ' ');
  }
  return clean(name);
}

function shortGpu(name = '') {
  const match = clean(name).match(/(RTX\s*\d{4}\s*Ti|RTX\s*\d{4}|RX\s*\d{4}\s*XT|RX\s*\d{4}|GTX\s*\d{4}\s*SUPER|GTX\s*\d{4})/i);
  return match ? match[1].replace(/\s+/g, ' ') : clean(name);
}

function specText(part) {
  return (part.detailspec?.items ?? [])
    .map((item) => `${clean(item.name)}: ${clean(item.content ?? '')}`)
    .filter((line) => line.length > 3)
    .join(' / ');
}

function parseProductOptions(data) {
  const categoryById = new Map(Object.values(data.ComputerCategory ?? {}).map((category) => [String(category.id), clean(category.title)]));
  const parts = [];
  for (const selected of data.ComputerParts?.base ?? []) {
    const partId = selected.parts || selected.basic;
    if (!partId) continue;
    const part = data.ComputerBasic?.[String(partId)];
    if (!part) continue;
    const rootCategoryId = String(selected.category);
    const categoryLabel = categoryById.get(rootCategoryId) ?? part.category ?? rootCategoryId;
    parts.push({
      category: normalizeCategory(categoryLabel),
      label: categoryLabel,
      externalProductCode: String(part.id),
      name: clean(part.title),
      brand: clean(part.brand),
      price: Number(part.price ?? 0),
      quantity: Number(part.quantity ?? 0),
      specText: specText(part),
      imageUrl: part.images?.[0]?.source ? `https:${part.images[0].source}` : null,
    });
  }

  const cpuName = parts.find((part) => part.category === 'CPU')?.name ?? '';
  const gpuName = parts.find((part) => part.category === 'GPU')?.name ?? '';
  return {
    source: 'WANGGAPC',
    externalBuildId: String(data.id),
    url: `https://wanggapc.com/products/${data.id}`,
    title: clean(data.title),
    categoryTitle: clean(data.category_title),
    price: Number(data.show_sale_price ?? data.show_price ?? 0),
    listPrice: Number(data.show_price ?? 0),
    keywords: data.keyword ?? [],
    cpuName,
    gpuName,
    cpuModel: shortCpu(cpuName),
    gpuModel: shortGpu(gpuName),
    comboKey: cpuName && gpuName ? `${shortCpu(cpuName)}-${shortGpu(gpuName)}`.replace(/[^a-zA-Z0-9가-힣]+/g, '-').replace(/^-+|-+$/g, '').toUpperCase() : null,
    parts,
  };
}

async function parseFile(file) {
  const html = await readFile(file, 'utf8');
  const raw = extractAssignedObject(html, 'SHOP.PRODUCTS_OPTIONS');
  if (!raw) return null;
  return {
    sourceFile: file,
    parsedAt: new Date().toISOString(),
    ...parseProductOptions(JSON.parse(raw)),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = await listHtmlFiles(path.resolve(args.input));
  const outDir = path.resolve(args.out);
  await mkdir(outDir, { recursive: true });
  const summaries = [];
  for (const file of files) {
    const parsed = await parseFile(file);
    if (!parsed?.externalBuildId || !parsed.parts?.length) continue;
    const output = `wanggapc_${parsed.externalBuildId}.json`;
    await writeFile(path.join(outDir, output), JSON.stringify(parsed, null, 2), 'utf8');
    summaries.push({
      file,
      externalBuildId: parsed.externalBuildId,
      title: parsed.title,
      comboKey: parsed.comboKey,
      partCount: parsed.parts.length,
      output,
    });
    console.log(`[wanggapc] ${path.basename(file)} parts=${parsed.parts.length} combo=${parsed.comboKey ?? '-'}`);
  }
  await writeFile(path.join(outDir, 'summary.json'), JSON.stringify({ parsedAt: new Date().toISOString(), summaries }, null, 2), 'utf8');
  console.log(`[wanggapc] done out=${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
