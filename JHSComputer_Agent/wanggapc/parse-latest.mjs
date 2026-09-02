#!/usr/bin/env node
/**
 * 최신 wanggapc HTML 수집 디렉토리를 자동으로 찾아 parse-products.mjs 실행
 */
import { readdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlRoot = path.resolve(__dirname, '../../project/samples/wanggapc/html');
const parsedOut = path.resolve(__dirname, '../../project/samples/wanggapc/parsed');

async function main() {
  let entries;
  try {
    entries = await readdir(htmlRoot);
  } catch {
    console.error(`[parse-latest] HTML 디렉토리 없음: ${htmlRoot}`);
    console.error('[parse-latest] 먼저 crawl:wanggapc:html 를 실행하세요.');
    process.exit(1);
  }

  const dirs = entries.filter(e => /^\d{4}-/.test(e)).sort();
  if (dirs.length === 0) {
    console.error('[parse-latest] 수집된 HTML 없음. crawl:wanggapc:html 먼저 실행하세요.');
    process.exit(1);
  }

  const latest = dirs[dirs.length - 1];
  const inputDir = path.join(htmlRoot, latest);
  console.log(`[parse-latest] 파싱 대상: ${inputDir}`);
  console.log(`[parse-latest] 출력: ${parsedOut}`);

  const child = spawn(
    'node',
    ['parse-products.mjs', `--input=${inputDir}`, `--out=${parsedOut}`],
    { cwd: __dirname, stdio: 'inherit' },
  );

  child.on('close', code => {
    if (code !== 0) process.exit(code ?? 1);
  });
  child.on('error', err => {
    console.error(err);
    process.exit(1);
  });
}

main().catch(err => { console.error(err); process.exit(1); });
