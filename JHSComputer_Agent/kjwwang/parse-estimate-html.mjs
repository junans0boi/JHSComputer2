import * as cheerio from 'cheerio';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RESOLUTIONS = ['FHD', 'QHD', 'UHD'];

function parseArgs(argv) {
  const args = { input: 'data', out: '../project/samples/kjwwang/parsed' };
  for (const rawArg of argv) {
    const [key, value = ''] = rawArg.replace(/^--/, '').split('=');
    if (key === 'input') args.input = value;
    if (key === 'out') args.out = value;
  }
  return args;
}

async function listHtmlFiles(input) {
  const inputStat = await stat(input);
  if (inputStat.isFile()) return [input];
  const files = [];
  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(entryPath);
      else if (entry.isFile() && entry.name.endsWith('.html')) files.push(entryPath);
    }
  }
  await visit(input);
  return files;
}

async function loadCollectionMetadata(input) {
  try {
    const root = (await stat(input)).isFile() ? path.dirname(input) : input;
    const metadata = new Map();
    async function visit(directory) {
      const entries = await readdir(directory, { withFileTypes: true });
      for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          await visit(entryPath);
        } else if (entry.isFile() && entry.name === 'summary.json') {
          const summary = JSON.parse(await readFile(entryPath, 'utf8'));
          for (const item of summary.results ?? []) {
            metadata.set(String(item.estimateId), {
              url: item.url ?? null,
              status: item.status ?? null,
              collectedAt: item.collectedAt ?? null,
              contentHash: item.contentHash ?? null,
              attempts: item.attempts ?? null,
              fileName: item.fileName ?? null,
            });
          }
        }
      }
    }
    await visit(root);
    return metadata;
  } catch {
    return new Map();
  }
}

function clean(value = '') {
  return value.replace(/\s+/g, ' ').trim();
}

function parseFpsText(value) {
  const text = clean(value);
  const match = text.match(/^(.+?)\s*(\d+)\s*FPS/i);
  return {
    rawText: text,
    optionPreset: match?.[1]?.trim() ?? null,
    fps: match?.[2] ? Number(match[2]) : null,
    playable: !text.includes('미지원'),
  };
}

function parseResolutionFromText(text) {
  if (/FHD|1920/i.test(text)) return 'FHD';
  if (/QHD|2560/i.test(text)) return 'QHD';
  if (/UHD|4K|3840/i.test(text)) return 'UHD';
  return null;
}

function parseEstimateId(html, file) {
  return (
    html.match(/es_sn=(\d+)/)?.[1] ??
    path.basename(file).match(/estimate_(\d+)/)?.[1] ??
    null
  );
}

function parseSourceUpdatedAt($) {
  const text = clean($('body').text());
  const match = text.match(/(20\d{2})년\s*(\d{1,2})월\s*(\d{1,2})일\s*업데이트/);
  if (!match) return null;
  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000+09:00`;
}

function parseParts($) {
  const parts = [];
  const seen = new Set();

  const normalizeCategory = (category) => {
    const text = clean(category);
    if (/그래픽|VGA/i.test(text)) return 'GPU';
    if (/메모리|RAM/i.test(text)) return 'RAM';
    if (/파워|서플라이|PSU/i.test(text)) return 'POWER';
    if (/쿨러/i.test(text)) return 'COOLER';
    if (/케이스/i.test(text)) return 'CASE';
    if (/메인보드|M\/B|Main/i.test(text)) return 'MAINBOARD';
    if (/CPU/i.test(text)) return 'CPU';
    if (/SSD/i.test(text)) return 'SSD';
    if (/HDD/i.test(text)) return 'HDD';
    return text;
  };

  const pushPart = (part) => {
    const category = normalizeCategory(part.category);
    const name = clean(part.name);
    if (!category || !name || /^(기본사양|상품정보|변동내역)$/.test(name)) return;
    const comparableName = name.replace(/\s*x\s*\d+\s*개?$/i, '').trim();
    const existing = parts.find((item) => {
      if (item.category !== category) return false;
      const existingName = item.name.replace(/\s*x\s*\d+\s*개?$/i, '').trim();
      return existingName.includes(comparableName) || comparableName.includes(existingName);
    });
    if (existing) {
      existing.name = name.length > existing.name.length ? name : existing.name;
      existing.quantity ??= part.quantity ? Number(part.quantity) : undefined;
      existing.productCode ??= part.productCode || undefined;
      existing.imageUrl ??= part.imageUrl || undefined;
      existing.specText ??= part.specText ? clean(part.specText) : undefined;
      return;
    }
    const key = `${category}::${name}`;
    if (seen.has(key)) return;
    seen.add(key);
    parts.push({
      category,
      label: clean(part.category),
      name,
      quantity: part.quantity ? Number(part.quantity) : undefined,
      productCode: part.productCode || undefined,
      imageUrl: part.imageUrl || undefined,
      specText: part.specText ? clean(part.specText) : undefined,
    });
  };

  $('.assembly_spec .cont.basic dl').each((_, dl) => {
    const children = $(dl).children().toArray();
    for (let index = 0; index < children.length; index += 1) {
      const node = children[index];
      if (node.tagName !== 'dt') continue;
      const next = children[index + 1];
      if (!next || next.tagName !== 'dd') continue;
      pushPart({
        category: $(node).text(),
        name: $(next).text(),
      });
    }
  });

  $('table.part_basic tr, table.part tr').each((_, row) => {
    const category = clean($(row).find('td.cate').first().text());
    const selected = $(row).find('a.selected span').first();
    const name = clean(selected.text() || $(row).find('.item_basic').first().text());
    if (!category || !name) return;
    pushPart({
      category,
      name,
      quantity: $(row).find('input[name^="pcount"]').first().attr('value'),
      productCode: $(row).find('input[name^="pcode"]').first().attr('value') || $(row).find('.pdno').first().text(),
      imageUrl: $(row).find('td.mg img').first().attr('src') || $(row).find('a.selected').first().attr('data'),
      specText: $(row).find('.select_box > .spec').first().text() || $(row).find('.spec').first().text(),
    });
  });

  $('a.pd_name').each((_, anchor) => {
    const category = clean($(anchor).find('.cate').first().text()).replace(/^\[|\]$/g, '');
    if (!category) return;
    const name = clean(
      $(anchor)
        .clone()
        .find('.cate, .thumb_layer')
        .remove()
        .end()
        .text(),
    );
    const productCode = $(anchor).attr('onclick')?.match(/db_detail_view\([^,]+,'?(\d+)'?\)/)?.[1];
    pushPart({
      category,
      name,
      productCode,
      imageUrl: $(anchor).find('.thumb_layer img').first().attr('src'),
    });
  });

  return parts;
}

function parsePerformanceGrid($) {
  const records = [];
  $('.performance .body .flex').each((_, row) => {
    const children = $(row).children().toArray();
    const gameName = clean($(children[0]).text());
    if (!gameName || children.length < 4) return;
    for (let index = 1; index <= 3; index += 1) {
      records.push({
        gameName,
        resolution: RESOLUTIONS[index - 1],
        ...parseFpsText($(children[index]).text()),
      });
    }
  });
  return records;
}

function parseGameLists($) {
  const records = [];
  $('.game_list').each((_, list) => {
    const heading = $(list).prevAll('h1,h2,h3,h4').first();
    const resolution = parseResolutionFromText(clean(heading.text() || $(list).prev().text()));
    if (!resolution) return;
    $(list)
      .find('li')
      .each((__, item) => {
        const text = clean($(item).clone().children('.spec_layer').remove().end().text());
        const gameName = clean($(item).find('.gname').first().text())
          || clean(text.split(':')[0].replace(/^-+/, ''));
        if (!gameName) return;
        const gameSuffix = text.slice(text.indexOf(gameName) + gameName.length);
        const match = gameSuffix.match(/:\s*(.+?)으로\s*(\d+)?\s*FPS\s*가능/i);
        if (!match || !match[2]) return;
        records.push({
          gameName,
          resolution,
          rawText: `${clean(match[1])} ${match[2]} FPS`,
          optionPreset: clean(match[1]),
          fps: Number(match[2]),
          playable: !match[1].includes('미지원'),
        });
      });
  });
  return records;
}

function dedupe(records) {
  const map = new Map();
  for (const record of records) {
    const key = `${record.gameName}__${record.resolution}__${record.optionPreset ?? 'UNKNOWN'}__${record.fps ?? 'NONE'}`;
    if (!map.has(key)) map.set(key, record);
  }
  return [...map.values()];
}

export function parseEstimateHtml(html, file = '', collection = null) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const title = clean($('meta[property="og:title"]').attr('content') || $('title').text());
  const performanceRecords = dedupe([...parsePerformanceGrid($), ...parseGameLists($)]);
  const games = Object.values(
    performanceRecords.reduce((acc, record) => {
      acc[record.gameName] ??= { gameName: record.gameName, resolutions: {} };
      const resolutionRecords = acc[record.gameName].resolutions[record.resolution] ?? [];
      resolutionRecords.push({
        optionPreset: record.optionPreset,
        fps: record.fps,
        playable: record.playable,
        rawText: record.rawText,
      });
      acc[record.gameName].resolutions[record.resolution] = resolutionRecords;
      return acc;
    }, {}),
  );

  return {
    sourceFile: file,
    contentHash: createHash('sha256').update(html, 'utf8').digest('hex'),
    collection,
    estimateId: parseEstimateId(html, file),
    title,
    sourceUpdatedAt: parseSourceUpdatedAt($),
    parsedAt: new Date().toISOString(),
    parts: parseParts($),
    gameCount: games.length,
    recordCount: performanceRecords.length,
    games,
  };
}

async function parseFile(file) {
  return parseEstimateHtml(await readFile(file, 'utf8'), file);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = await listHtmlFiles(path.resolve(args.input));
  const collectionMetadata = await loadCollectionMetadata(path.resolve(args.input));
  const outDir = path.resolve(args.out);
  await mkdir(outDir, { recursive: true });
  const summaries = [];

  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const estimateId = parseEstimateId(html, file);
    const parsed = parseEstimateHtml(html, file, collectionMetadata.get(String(estimateId)) ?? null);
    if (!parsed.recordCount) continue;
    const name = parsed.estimateId ? `estimate_${parsed.estimateId}.json` : `${path.basename(file, '.html')}.json`;
    await writeFile(path.join(outDir, name), JSON.stringify(parsed, null, 2), 'utf8');
    summaries.push({ file, estimateId: parsed.estimateId, title: parsed.title, gameCount: parsed.gameCount, recordCount: parsed.recordCount, output: name });
    console.log(`[kjwwang] ${path.basename(file)} games=${parsed.gameCount} records=${parsed.recordCount}`);
  }

  await writeFile(path.join(outDir, 'summary.json'), JSON.stringify({ parsedAt: new Date().toISOString(), summaries }, null, 2), 'utf8');
  console.log(`[kjwwang] done out=${outDir}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { parseResolutionFromText, parseParts, parseGameLists, dedupe, parseSourceUpdatedAt };
