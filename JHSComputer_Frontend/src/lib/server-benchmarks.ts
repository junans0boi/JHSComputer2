export type BenchmarkSummary = {
  buildCount: string;
  totalComboCount: string;
  fpsComboCount: string;
  gameCount: string;
  fpsResultCount: string;
  comboGameResultCount: string;
  sourceComboCount?: string;
  topCombos: BenchmarkCombo[];
};

export type BenchmarkCombo = {
  comboKey: string;
  cpuModel: string;
  gpuModel: string;
  cpuName?: string;
  gpuName?: string;
  buildSampleCount?: string;
  gameCount?: string;
  resultCount?: string;
  sampleCount?: string;
  publicCpuModel?: string;
  publicGpuModel?: string;
  publicComboName?: string;
  publicComboRef?: string;
  hasFpsEvidence?: boolean;
  cpuPartId?: number;
  gpuPartId?: number;
};

export type BenchmarkSelectorOptions = {
  cpus: Array<{ value: string; label: string; comboCount: number }>;
  gpus: Array<{ value: string; label: string; comboCount: number }>;
  combos: Array<Pick<BenchmarkCombo, 'publicComboRef' | 'publicComboName' | 'publicCpuModel' | 'publicGpuModel' | 'cpuPartId' | 'gpuPartId' | 'gameCount' | 'resultCount'>>;
  total: number;
};

export type BenchmarkGameResult = {
  gameId: string;
  gameName: string;
  resolution: 'FHD' | 'QHD' | 'UHD';
  optionPreset?: string;
  sourceConditionKey?: string;
  sourceNames?: string;
  sourceUrl?: string;
  testSystem?: string;
  sampleCount: number;
  rawFpsAvg: string;
  rawFpsMin: number;
  rawFpsMax: number;
  displayFpsMin: number | null;
  displayFpsMax: number | null;
  bestQuality: string;
  comfortGrade: string;
  isEstimated?: boolean;
  evidenceType?: 'MEASURED' | 'SOURCE_BENCHMARK' | 'SOURCE_RECOMMENDATION' | 'SOURCE_REPORTED' | 'DERIVED' | 'NONE';
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceNote?: string;
};

export type RecommendationCombo = {
  comboKey: string;
  publicComboKey: string;
  publicComboRef: string;
  publicCpuModel: string;
  publicGpuModel: string;
  publicComboName: string;
  cpuModel: string;
  gpuModel: string;
  sourceCode: string;
  sourceName: string;
  recommendationCount: number;
  gameCount: number;
  latestCapturedAt: string | null;
};

export type RecommendationContext = {
  gameId: string;
  gameName: string;
  resolution: 'FHD' | 'QHD' | 'UHD';
  tier: string;
  platform: string;
  priceRange: string | null;
  price: number | null;
  sourceUrl: string | null;
  capturedAt: string | null;
  sourceCode: string;
  sourceName: string;
};

export type RecommendationComboDetail = {
  combo: RecommendationCombo | null;
  contexts: RecommendationContext[];
  total: number;
  error?: boolean;
};

const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3010/api';

async function getJsonWithStatus<T>(path: string, fallback: T): Promise<{ data: T; failed: boolean }> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { next: { revalidate: 60 } });
    if (!response.ok) return { data: fallback, failed: true };
    return { data: (await response.json()) as T, failed: false };
  } catch {
    return { data: fallback, failed: true };
  }
}

async function getJson<T>(path: string, fallback: T): Promise<T> {
  return (await getJsonWithStatus(path, fallback)).data;
}

export async function loadBenchmarkSummary() {
  return getJson<BenchmarkSummary>('/benchmarks/summary', {
    buildCount: '0',
    totalComboCount: '0',
    fpsComboCount: '0',
    gameCount: '0',
    fpsResultCount: '0',
    comboGameResultCount: '0',
    topCombos: [],
  });
}

export async function loadBenchmarkCombos(limit = 200, includeNoFps = true) {
  return getJson<{ items: BenchmarkCombo[]; total: number }>(
    `/benchmarks/combos?limit=${limit}&includeNoFps=${includeNoFps ? 'true' : 'false'}`,
    { items: [], total: 0 },
  );
}

export async function loadBenchmarkSelectorOptions() {
  return getJson<BenchmarkSelectorOptions>('/benchmarks/selector-options', {
    cpus: [],
    gpus: [],
    combos: [],
    total: 0,
  });
}

export async function loadComboGameResults(comboKey: string, limit = 18) {
  return getJson<{ items: BenchmarkGameResult[]; total: number }>(
    `/benchmarks/combos/${encodeURIComponent(comboKey)}/games?limit=${limit}`,
    { items: [], total: 0 },
  );
}

export async function loadRecommendationCombos(limit = 200) {
  const result = await getJsonWithStatus<{ items: RecommendationCombo[]; total: number }>(
    `/benchmarks/recommendation-combos?limit=${limit}`,
    { items: [], total: 0 },
  );
  return { ...result.data, error: result.failed };
}

export async function loadRecommendationComboDetail(comboRef: string | undefined, limit = 120) {
  const fallback: RecommendationComboDetail = { combo: null, contexts: [], total: 0 };
  if (!comboRef) return fallback;
  const result = await getJsonWithStatus<RecommendationComboDetail>(
    `/benchmarks/recommendation-combos/${encodeURIComponent(comboRef)}?limit=${limit}`,
    fallback,
  );
  return { ...result.data, error: result.failed };
}

export async function loadComponentBenchmarkComparison(partIds: Array<number | string>) {
  const ids = [...new Set(partIds.map((partId) => Number(partId)).filter((partId) => Number.isInteger(partId) && partId > 0))];
  if (!ids.length) {
    return { selectedPartId: null, parts: [], items: [], total: 0, reason: '선택 조합과 연결된 CPU/GPU 부품을 찾지 못했습니다.' } satisfies ComponentBenchmarkComparison;
  }
  return getJson<ComponentBenchmarkComparison>(
    `/benchmarks/components/compare?partIds=${ids.join(',')}`,
    { selectedPartId: null, parts: [], items: [], total: 0, reason: '벤치마크 비교 데이터를 불러오지 못했습니다.' },
  );
}
import type { ComponentBenchmarkComparison } from './component-benchmarks';
