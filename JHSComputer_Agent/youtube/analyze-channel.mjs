#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  return [key, rest.join('=') || 'true'];
}));

const env = loadEnv(args.env ?? '../JHSComputer_Server/.env');
const apiKey = args.apiKey ?? env.YOUTUBE_API_KEY ?? process.env.YOUTUBE_API_KEY;
const channelUrl = args.channel ?? env.YOUTUBE_CHANNEL_URL ?? 'https://www.youtube.com/wjdgytjd2002';
const out = path.resolve(process.cwd(), args.out ?? '../project/analysis/jhs-youtube-profile.json');
const publishedAfter = args.publishedAfter ?? oneYearAgoIso();

if (!apiKey) {
  console.error('Missing YOUTUBE_API_KEY. Add it to env or pass --apiKey=...');
  process.exit(1);
}

const channelId = await resolveChannelId(channelUrl);
if (!channelId) {
  console.error(`Could not resolve YouTube channel id from ${channelUrl}`);
  process.exit(1);
}

const videos = await loadRecentVideos(channelId, publishedAfter);
const profile = buildPreferenceProfile(channelUrl, channelId, videos);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(profile, null, 2));
console.log(`Saved ${videos.length} videos profile to ${out}`);

async function resolveChannelId(url) {
  const raw = String(url).trim();
  const channelMatch = raw.match(/youtube\.com\/channel\/([^/?#]+)/);
  if (channelMatch) return channelMatch[1];

  const handleMatch = raw.match(/youtube\.com\/@([^/?#]+)/);
  if (handleMatch) {
    const byHandle = await youtube('channels', { part: 'snippet', forHandle: handleMatch[1], maxResults: '1' }).catch(() => null);
    if (byHandle?.items?.[0]?.id) return byHandle.items[0].id;
  }

  const customName = raw
    .replace(/^https?:\/\/(www\.)?youtube\.com\//, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0];
  const search = await youtube('search', { part: 'snippet', type: 'channel', q: customName, maxResults: '5' });
  return search.items?.[0]?.snippet?.channelId ?? null;
}

async function loadRecentVideos(channelId, afterIso) {
  const videoIds = [];
  let pageToken;
  do {
    const data = await youtube('search', {
      part: 'snippet',
      channelId,
      type: 'video',
      order: 'date',
      publishedAfter: afterIso,
      maxResults: '50',
      pageToken,
    });
    videoIds.push(...(data.items ?? []).map((item) => item.id.videoId).filter(Boolean));
    pageToken = data.nextPageToken;
  } while (pageToken);

  const videos = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const data = await youtube('videos', {
      part: 'snippet,statistics',
      id: batch.join(','),
      maxResults: '50',
    });
    videos.push(...(data.items ?? []));
  }
  return videos;
}

function buildPreferenceProfile(url, channelId, videos) {
  const partHits = new Map();
  const comboHits = new Map();
  const gameHits = new Map();

  for (const video of videos) {
    const text = `${video.snippet?.title ?? ''}\n${video.snippet?.description ?? ''}`;
    for (const token of extractPartTokens(text)) {
      partHits.set(token, (partHits.get(token) ?? 0) + 1);
    }
    for (const game of extractGames(text)) {
      gameHits.set(game, (gameHits.get(game) ?? 0) + 1);
    }
    const cpuBrand = inferCpuBrand(text);
    const gpuBrand = inferGpuBrand(text);
    if (cpuBrand && gpuBrand) {
      const combo = `${cpuBrand}_${gpuBrand}`;
      comboHits.set(combo, (comboHits.get(combo) ?? 0) + 1);
    }
  }

  return {
    channelUrl: url,
    channelId,
    analyzedAt: new Date().toISOString(),
    videoCount: videos.length,
    topParts: topEntries(partHits, 50),
    topGames: topEntries(gameHits, 30),
    comboPreference: topEntries(comboHits, 10),
    videos: videos.map((video) => ({
      videoId: video.id,
      title: video.snippet?.title,
      publishedAt: video.snippet?.publishedAt,
      viewCount: Number(video.statistics?.viewCount ?? 0),
      extractedParts: extractPartTokens(`${video.snippet?.title ?? ''}\n${video.snippet?.description ?? ''}`),
    })),
  };
}

function extractPartTokens(text) {
  const patterns = [
    /(?:Ryzen|라이젠)\s*[0-9]\s*[0-9A-Z]{3,6}(?:X3D|X|F)?/gi,
    /(?:Intel\s*)?(?:Core\s*)?i[3579][-\s]?[0-9]{4,5}[A-Z]{0,3}/gi,
    /RTX\s*[0-9]{4}(?:\s*Ti| SUPER)?/gi,
    /GTX\s*[0-9]{4}/gi,
    /RX\s*[0-9]{4}\s*(?:XT|GRE)?/gi,
    /(?:B650|B760|A620|X670|X870|Z790|Z890)[A-Z0-9\-\s]*/gi,
    /DDR[45]\s*[0-9]{1,3}GB(?:\s*[0-9]{4,5}MHz)?/gi,
    /NVMe\s*(?:Gen[345]\s*)?[0-9]{1,2}TB/gi,
    /[0-9]{3,4}W\s*(?:Bronze|Gold|Platinum|브론즈|골드|플래티넘)?/gi,
  ];
  return unique(patterns.flatMap((pattern) => [...text.matchAll(pattern)].map((match) => normalizeToken(match[0]))));
}

function extractGames(text) {
  const games = ['배틀그라운드', '배그', '발로란트', '롤', '리그오브레전드', '로스트아크', '오버워치', '메이플', '피파', 'FC 온라인'];
  return unique(games.filter((game) => text.includes(game)).map((game) => game === '배그' ? '배틀그라운드' : game));
}

function inferCpuBrand(text) {
  const upper = text.toUpperCase();
  if (upper.includes('INTEL') || /I[3579][-\s]?[0-9]{4,5}/i.test(text)) return 'INTEL';
  if (upper.includes('RYZEN') || upper.includes('라이젠')) return 'RYZEN';
  return null;
}

function inferGpuBrand(text) {
  const upper = text.toUpperCase();
  if (upper.includes('RADEON') || /\bRX\s*[0-9]{4}/i.test(text)) return 'RADEON';
  if (upper.includes('RTX') || upper.includes('GTX') || upper.includes('NVIDIA')) return 'NVIDIA';
  return null;
}

function normalizeToken(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function topEntries(map, limit) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

async function youtube(resource, params) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, String(value));
  });
  url.searchParams.set('key', apiKey);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube API ${resource} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

function oneYearAgoIso() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString();
}

function loadEnv(filePath) {
  const absolute = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolute)) return process.env;
  const parsed = {};
  for (const line of fs.readFileSync(absolute, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    parsed[trimmed.slice(0, index)] = trimmed.slice(index + 1).replace(/^['"]|['"]$/g, '');
  }
  return { ...process.env, ...parsed };
}
