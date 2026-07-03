import type { PerformanceResult, Quote, Resolution } from './v1-types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

type QuotePerformanceResponse = {
  items?: PerformanceResult[];
  total?: number;
};

type BenchmarkGamesResponse = {
  items?: Array<{ gameName?: string }>;
};

export async function loadBenchmarkGameNames(limit = 120): Promise<string[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/benchmarks/games?limit=${limit}`);
    if (!response.ok) return [];
    const data = (await response.json()) as BenchmarkGamesResponse;
    return (data.items ?? []).map((item) => item.gameName).filter((name): name is string => Boolean(name));
  } catch {
    return [];
  }
}

export async function loadQuotePerformance(quote: Quote): Promise<PerformanceResult[]> {
  try {
    const response = await fetch(`${apiBaseUrl}/benchmarks/quote-performance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parts: quote.parts.map((part) => ({ category: part.category, name: part.name })),
        games: quote.input.games,
        limit: 180,
      }),
    });
    if (!response.ok) return [];
    const data = (await response.json()) as QuotePerformanceResponse;
    return (data.items ?? []).map(normalizePerformanceResult);
  } catch {
    return [];
  }
}

export async function withDbPerformance(quote: Quote): Promise<Quote> {
  const performance = await loadQuotePerformance(quote);
  return { ...quote, performance };
}

function normalizePerformanceResult(result: PerformanceResult): PerformanceResult {
  return {
    ...result,
    resolution: normalizeResolution(result.resolution),
    fpsMin: Number(result.fpsMin) || 0,
    fpsMax: Number(result.fpsMax) || 0,
    isEstimated: false,
  };
}

function normalizeResolution(resolution: string): Resolution {
  if (resolution === 'UHD') return '4K';
  if (resolution === 'FHD' || resolution === 'QHD' || resolution === '4K') return resolution;
  return 'FHD';
}
