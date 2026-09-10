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
};

export type BenchmarkGameResult = {
  gameId: string;
  gameName: string;
  resolution: 'FHD' | 'QHD' | 'UHD';
  sampleCount: number;
  rawFpsAvg: string;
  rawFpsMin: number;
  rawFpsMax: number;
  displayFpsMin: number | null;
  displayFpsMax: number | null;
  bestQuality: string;
  comfortGrade: string;
  isEstimated?: boolean;
  evidenceType?: 'MEASURED' | 'SOURCE_REPORTED' | 'DERIVED' | 'NONE';
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceNote?: string;
};

const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3010/api';

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { next: { revalidate: 60 } });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
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

export async function loadComboGameResults(comboKey: string, limit = 18) {
  return getJson<{ items: BenchmarkGameResult[]; total: number }>(
    `/benchmarks/combos/${encodeURIComponent(comboKey)}/games?limit=${limit}`,
    { items: [], total: 0 },
  );
}
