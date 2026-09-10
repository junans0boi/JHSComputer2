export type ComponentBenchmarkDeviceType = 'CPU' | 'GPU';
export type ComponentBenchmarkEvidenceType = 'SOURCE_REPORTED' | 'MEASURED';

export type ComponentBenchmarkScoreItem = {
  partId: number;
  partName: string;
  manufacturer?: string | null;
  deviceType: ComponentBenchmarkDeviceType;
  test: {
    id: number;
    code: string;
    name: string;
    version: string;
    metric: string;
    unit: string;
    comparableGroupKey: string;
  };
  score: number;
  representative: boolean;
  observationCount: number;
  evidenceType: ComponentBenchmarkEvidenceType;
  sourceNames: string[];
  sourceUrls: string[];
  deltaFromSelected?: number;
  deltaPercentFromSelected?: number | null;
  conditions?: Record<string, unknown>;
  conditionSamples?: Array<Record<string, unknown>>;
  comparisonUnavailableReason?: string;
};

export type ComponentBenchmarkComparison = {
  selectedPartId: number | null;
  parts: Array<{
    partId: number;
    partName: string;
    manufacturer?: string | null;
    deviceType: ComponentBenchmarkDeviceType;
  }>;
  items: ComponentBenchmarkScoreItem[];
  total: number;
  reason?: string;
};

const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

export async function loadComponentBenchmarkComparison(partIds: Array<number | string>, testId?: number) {
  const ids = [...new Set(partIds.map((partId) => Number(partId)).filter((partId) => Number.isInteger(partId) && partId > 0))];
  if (!ids.length) return emptyComparison('견적에 연결된 CPU/GPU 부품 ID가 없습니다.');
  const query = new URLSearchParams({ partIds: ids.join(',') });
  if (testId) query.set('testId', String(testId));

  try {
    const response = await fetch(`${apiBaseUrl}/benchmarks/components/compare?${query.toString()}`, { next: { revalidate: 60 } });
    if (!response.ok) return emptyComparison('벤치마크 비교 데이터를 불러오지 못했습니다.');
    return (await response.json()) as ComponentBenchmarkComparison;
  } catch {
    return emptyComparison('벤치마크 비교 데이터를 불러오지 못했습니다.');
  }
}

function emptyComparison(reason: string): ComponentBenchmarkComparison {
  return { selectedPartId: null, parts: [], items: [], total: 0, reason };
}
