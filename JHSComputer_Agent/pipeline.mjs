#!/usr/bin/env node
/**
 * JHS 크롤링 파이프라인
 * Usage: node pipeline.mjs [--mode=samples|full|auto]
 *
 * auto (기본값): 매월 첫째 주 일요일이면 full, 나머지는 samples
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../JHSComputer_Server/.env') });

const WEBHOOK_URL = process.env.DISCORD_AGENT_WEBHOOK_URL;

function isFirstSundayOfMonth() {
  const d = new Date();
  return d.getDay() === 0 && d.getDate() <= 7;
}

const modeArg = process.argv.find(a => a.startsWith('--mode='))?.split('=')[1] ?? 'auto';
const isFull = modeArg === 'full' || (modeArg === 'auto' && isFirstSundayOfMonth());
const modeName = isFull ? '전체 크롤링 (월 1회)' : '샘플 크롤링 (주 1회)';

const PIPELINE_STEPS = [
  isFull ? 'crawl:compuzone:full' : 'crawl:compuzone:samples',
  'sync:compuzone:db',
  'sync:kjwwang:benchmark-db',
  'crawl:wanggapc:html',
  'parse:wanggapc:latest',
  'sync:wanggapc:builds-db',
  'generate:jhs-recommendations',
];

async function notify(embed) {
  if (!WEBHOOK_URL) return;
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch {}
}

function kst() {
  return new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}

function runAgent(scriptName) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['run-agent.mjs', scriptName], {
      cwd: __dirname,
      stdio: 'inherit',
    });
    child.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptName} 실패 (exit ${code})`));
    });
    child.on('error', reject);
  });
}

async function main() {
  const startMs = Date.now();

  await notify({
    title: `🚀 파이프라인 시작: ${modeName}`,
    description: PIPELINE_STEPS.map((s, i) => `${i + 1}. \`${s}\``).join('\n'),
    color: 0x3498db,
    footer: { text: `시작: ${kst()} (KST)` },
  });

  for (const step of PIPELINE_STEPS) {
    try {
      await runAgent(step);
    } catch (err) {
      const duration = ((Date.now() - startMs) / 1000).toFixed(1);
      await notify({
        title: `❌ 파이프라인 중단: ${modeName}`,
        description: `**실패 단계:** \`${step}\`\n${err.message}`,
        color: 0xe74c3c,
        fields: [
          { name: '⏱ 소요시간', value: `${duration}초`, inline: true },
          { name: '🕐 실패 (KST)', value: kst(), inline: true },
        ],
      });
      process.exit(1);
    }
  }

  const duration = ((Date.now() - startMs) / 1000).toFixed(1);
  await notify({
    title: `✅ 파이프라인 완료: ${modeName}`,
    description: `전체 ${PIPELINE_STEPS.length}개 에이전트 정상 완료`,
    color: 0x27ae60,
    fields: [
      { name: '⏱ 총 소요시간', value: `${duration}초`, inline: true },
      { name: '🕐 완료 (KST)', value: kst(), inline: true },
    ],
  });
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
