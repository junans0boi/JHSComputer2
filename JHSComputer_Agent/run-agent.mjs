#!/usr/bin/env node
/**
 * 에이전트 Discord 알림 래퍼
 * Usage: node run-agent.mjs <npm-script-name>
 * Example: node run-agent.mjs crawl:compuzone:samples
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../JHSComputer_Server/.env') });

const WEBHOOK_URL = process.env.DISCORD_AGENT_WEBHOOK_URL;

const AGENT_LABELS = {
  'crawl:compuzone:samples':     { label: '컴퓨존 샘플 크롤링',         emoji: '🕷️' },
  'crawl:compuzone:full':        { label: '컴퓨존 전체 크롤링',         emoji: '🕷️' },
  'sync:compuzone:db':           { label: '컴퓨존 → DB 동기화',         emoji: '🗄️' },
  'crawl:kjwwang:html':          { label: '견적왕 HTML 수집',            emoji: '📥' },
  'parse:kjwwang:html':          { label: '견적왕 HTML 파싱',            emoji: '🔍' },
  'sync:kjwwang:benchmark-db':   { label: '게임 벤치마크 → DB 동기화',  emoji: '🎮' },
  'crawl:wanggapc:html':         { label: '왕가PC 수집',                emoji: '📥' },
  'parse:wanggapc:html':         { label: '왕가PC 파싱',                emoji: '🔍' },
  'sync:wanggapc:builds-db':     { label: '왕가PC 빌드 → DB 동기화',    emoji: '🗄️' },
  'generate:jhs-recommendations':{ label: '추천 포스트 자동 생성',       emoji: '✍️' },
  'generate:jhs-real-db-posts':  { label: 'DB 포스트 재생성',            emoji: '✍️' },
  'analyze:jhs-youtube':         { label: 'YouTube 채널 분석',           emoji: '📊' },
  'crawl:danawa:samples':        { label: '다나와 샘플 크롤링',          emoji: '🕷️' },
  'analyze:samples':             { label: '샘플 데이터 분석',            emoji: '📊' },
  'sync:catalog':                { label: '카탈로그 동기화',             emoji: '🗄️' },
};

async function notify(embed) {
  if (!WEBHOOK_URL) {
    console.warn('[run-agent] DISCORD_AGENT_WEBHOOK_URL 미설정 — 알림 생략');
    return;
  }
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });
    if (!res.ok) console.warn('[run-agent] Discord 알림 실패:', res.status);
  } catch (e) {
    console.warn('[run-agent] Discord 알림 오류:', e.message);
  }
}

function kstNow() {
  return new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}

async function main() {
  const scriptName = process.argv[2];
  if (!scriptName) {
    console.error('Usage: node run-agent.mjs <npm-script-name>');
    console.error('Available:', Object.keys(AGENT_LABELS).join(', '));
    process.exit(1);
  }

  const { label, emoji } = AGENT_LABELS[scriptName] ?? { label: scriptName, emoji: '⚙️' };
  const startMs = Date.now();

  await notify({
    title: `${emoji} 에이전트 시작`,
    description: `**${label}**\n\`npm run ${scriptName}\``,
    color: 0xf0a500,
    footer: { text: `시작: ${kstNow()} (KST)` },
  });

  const lines = [];
  const child = spawn('npm', ['run', scriptName], {
    cwd: __dirname,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: false,
  });

  const collect = (stream, prefix = '') => {
    stream.on('data', chunk => {
      process[prefix ? 'stderr' : 'stdout'].write(chunk);
      chunk.toString().split('\n').filter(Boolean).forEach(l => lines.push(l));
    });
  };
  collect(child.stdout);
  collect(child.stderr, 'err');

  child.on('close', async code => {
    const duration = ((Date.now() - startMs) / 1000).toFixed(1);
    // 마지막 8줄만 요약으로
    const summary = lines.slice(-8).join('\n') || '(출력 없음)';

    if (code === 0) {
      await notify({
        title: `✅ 에이전트 완료`,
        description: `**${label}**\n\`\`\`\n${summary.slice(0, 1000)}\n\`\`\``,
        color: 0x2ecc71,
        fields: [
          { name: '⏱ 소요시간', value: `${duration}초`, inline: true },
          { name: '🕐 완료 (KST)', value: kstNow(), inline: true },
        ],
      });
    } else {
      await notify({
        title: `❌ 에이전트 실패`,
        description: `**${label}** (exit code: ${code})\n\`\`\`\n${summary.slice(0, 1000)}\n\`\`\``,
        color: 0xe74c3c,
        fields: [
          { name: '⏱ 소요시간', value: `${duration}초`, inline: true },
          { name: '🕐 실패 (KST)', value: kstNow(), inline: true },
        ],
      });
    }
    process.exit(code ?? 0);
  });
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
