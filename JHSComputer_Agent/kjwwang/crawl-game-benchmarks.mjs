/**
 * kjwwang.com 게임별 FPS 벤치마크 크롤러
 * action=detail&game=<id> 페이지에서 CPU/GPU 조합 및 가격대 데이터 수집
 */
import iconv from 'iconv-lite';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = 'https://kjwwang.com';

// 주요 게임 목록 (게임ID: 게임명)
const TARGET_GAMES = {
  569: 'APEX 레전드',
  2084: '드래곤볼 스파킹 제로',
  711: 'GTA5',
  2024: '갓 오브 워 라그나로크',
  1668: '검은 신화: 오공',
  430: '검은사막',
  1011: '더 파이널스',
  935: '던전앤파이터',
  1476: '데드 바이 데이라이트',
  1948: 'EA SPORTS FC 25',
  2100: 'Metaphor: ReFantazio',
  1420: '나 혼자만 레벨업: 어라이즈',
  1932: 'NBA 2K25',
  795: 'P의 거짓',
  1164: '그랑블루 판타지 리링크',
  1356: '노 레스트 포 더 위키드',
  1288: '다크 소울 3',
  2344: '셰이프 오브 드림즈',
  422: '월드 오브 워크래프트',
  1464: '고스트 오브 쓰시마',
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchGamePage(gameId) {
  const url = `${BASE_URL}/shop/pc_estimate.html?action=detail&game=${gameId}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept-Language': 'ko-KR,ko;q=0.9',
      'Accept': 'text/html,application/xhtml+xml',
      'Referer': `${BASE_URL}/shop/pc_estimate.html`,
    },
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') ?? '';
  const html = /euc-kr|ks_c_5601/i.test(contentType)
    ? iconv.decode(buffer, 'euc-kr')
    : iconv.decode(buffer, 'euc-kr'); // kjwwang은 항상 euc-kr
  return { ok: response.ok, status: response.status, html, url };
}

function parseGamePage(html, gameId, fallbackName) {
  // 게임명
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1].trim() : fallbackName;
  const gameName = rawTitle.replace(/\s*사양.*$/i, '').trim() || fallbackName;

  // 최소/권장 사양
  const minSpec = extractSpecSection(html, '최소사양');
  const recSpec = extractSpecSection(html, '권장사양');

  // 해상도별 견적 파싱
  const fhdBuilds = extractBuilds(html, 'FHD');
  const qhdBuilds = extractBuilds(html, 'QHD');
  const uhdBuilds = extractBuilds(html, '4K');

  return {
    gameId,
    gameName,
    minSpec,
    recSpec,
    builds: { FHD: fhdBuilds, QHD: qhdBuilds, '4K': uhdBuilds },
    crawledAt: new Date().toISOString(),
  };
}

function extractSpecSection(html, label) {
  const regex = new RegExp(`${label}[^<]*<\\/h\\d>[\\s\\S]{0,50}<[^>]+>([\\s\\S]{0,500}?)<\\/(?:p|div|td)>`, 'i');
  const m = html.match(regex);
  if (!m) return null;
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractBuilds(html, resolution) {
  const resLabel = resolution === 'FHD' ? 'FHD 해상도' : resolution === 'QHD' ? 'QHD 해상도' : '4K UHD 해상도';
  const idx = html.indexOf(resLabel);
  if (idx < 0) return [];

  // 다음 해상도 섹션 전까지만 처리
  const nextLabels = ['FHD 해상도', 'QHD 해상도', '4K UHD 해상도'].filter(l => l !== resLabel);
  let end = html.length;
  for (const nl of nextLabels) {
    const ni = html.indexOf(nl, idx + 1);
    if (ni > idx && ni < end) end = ni;
  }

  const chunk = html.slice(idx, end);

  const builds = [];
  // <th> 내 tier 이름 추출
  const tierMatches = [...chunk.matchAll(/<th>([^<]+)<\/th>/gi)];

  for (const tierMatch of tierMatches) {
    const tier = tierMatch[1].replace('추천견적서', '').trim();
    const tierStart = tierMatch.index + tierMatch[0].length;
    const nextTier = tierMatches[tierMatches.indexOf(tierMatch) + 1];
    const tierEnd = nextTier ? nextTier.index : chunk.length;
    const cellChunk = chunk.slice(tierStart, tierEnd);

    // <li>인텔 : <a ...>combo</a><span class='price'>가격</span>
    const liMatches = [...cellChunk.matchAll(/<li>([^:]+):\s*<a[^>]*>([^<]+)<\/a><span[^>]*>([^<]+)<\/span>/gi)];
    for (const li of liMatches) {
      const platform = li[1].trim().includes('AMD') || li[2].trim().startsWith('라이젠') ? 'AMD' : 'Intel';
      const combo = li[2].trim();
      const priceRange = li[3].trim();
      builds.push({ tier, platform, combo, priceRange, resolution });
    }
  }
  return builds;
}

async function main() {
  const outDir = path.resolve('../project/samples/kjwwang/benchmarks');
  await mkdir(outDir, { recursive: true });

  const allResults = [];
  const gameIds = Object.keys(TARGET_GAMES).map(Number);

  for (const [i, gameId] of gameIds.entries()) {
    const gameName = TARGET_GAMES[gameId];
    console.log(`[kjwwang] ${i + 1}/${gameIds.length} 크롤링: ${gameName} (game=${gameId})`);

    try {
      const { ok, status, html } = await fetchGamePage(gameId);
      if (!ok) {
        console.warn(`  [SKIP] HTTP ${status}`);
        continue;
      }
      const parsed = parseGamePage(html, gameId, gameName);
      allResults.push(parsed);

      const filename = `game_${gameId}.json`;
      await writeFile(path.join(outDir, filename), JSON.stringify(parsed, null, 2), 'utf8');
      console.log(`  [OK] 견적 수집: FHD=${parsed.builds.FHD.length} QHD=${parsed.builds.QHD.length} 4K=${parsed.builds['4K'].length}`);
    } catch (err) {
      console.error(`  [ERR] ${err.message}`);
    }

    if (i < gameIds.length - 1) {
      await sleep(2000);
    }
  }

  await writeFile(
    path.join(outDir, 'summary.json'),
    JSON.stringify({
      crawledAt: new Date().toISOString(),
      totalGames: allResults.length,
      games: allResults.map(r => ({ gameId: r.gameId, gameName: r.gameName, buildCounts: Object.fromEntries(Object.entries(r.builds).map(([k, v]) => [k, v.length])) })),
    }, null, 2),
    'utf8',
  );

  console.log(`\n[kjwwang] 완료 — ${allResults.length}개 게임 데이터 수집 → ${outDir}`);
}

main().catch(err => { console.error(err); process.exitCode = 1; });
