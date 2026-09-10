export type ComponentBenchmarkEvidenceType = 'SOURCE_REPORTED' | 'MEASURED';
export type ComponentBenchmarkDeviceType = 'CPU' | 'GPU';

export type ComponentBenchmarkDefinition = {
  testId: string;
  comparableGroupKey: string;
  deviceType: ComponentBenchmarkDeviceType;
  unit: string;
};

export type ComponentBenchmarkObservation = ComponentBenchmarkDefinition & {
  observationId: string;
  partId: string;
  partName: string;
  manufacturer?: string | null;
  score: number;
  evidenceType: ComponentBenchmarkEvidenceType;
  sourceName: string;
  sourceUrl: string;
  capturedAt: string;
  conditions?: Record<string, unknown> | null;
};

export type RepresentativeComponentBenchmarkScore = ComponentBenchmarkDefinition & {
  partId: string;
  partName: string;
  manufacturer?: string | null;
  score: number;
  minimumScore: number;
  maximumScore: number;
  observationCount: number;
  evidenceType: ComponentBenchmarkEvidenceType;
  sourceNames: string[];
  sourceUrls: string[];
  conditions: Record<string, unknown>[];
};

export function normalizeComponentModelKey(value: string, deviceType: ComponentBenchmarkDeviceType): string {
  const normalized = String(value ?? '')
    .replace(/[™®]/g, '')
    .replace(/라이젠/gi, 'Ryzen')
    .replace(/지포스/gi, 'GeForce')
    .replace(/라데온/gi, 'Radeon')
    .replace(/인텔/gi, 'Intel')
    .replace(/코어/gi, 'Core')
    .replace(/울트라/gi, 'Ultra')
    .replace(/엔비디아/gi, 'Nvidia')
    .replace(/에이엠디/gi, 'AMD')
    .replace(/\s+/g, ' ')
    .trim();

  if (deviceType === 'CPU') {
    const ryzen = normalized.match(/\bRyzen\s*([3579])[\s\-A-Za-z가-힣]*?(\d{4,5}[A-Za-z0-9]*)/i);
    if (ryzen) return `cpu:amd:ryzen-${ryzen[1]}-${ryzen[2].toLowerCase()}`;

    const coreUltra = normalized.match(/\bCore\s+Ultra\s+([3579])\s*[- ]?\s*(\d{3,5}[A-Za-z0-9]*)/i);
    if (coreUltra) return `cpu:intel:core-ultra-${coreUltra[1]}-${coreUltra[2].toLowerCase()}`;

    const core = normalized.match(/\bCore\s+(i[3579])\s*[- ]?\s*(\d{4,5}[A-Za-z0-9]*)/i);
    if (core) return `cpu:intel:core-${core[1].toLowerCase()}-${core[2].toLowerCase()}`;

    const genericIntel = normalized.match(/\b(i[3579])\s*[- ]?\s*(\d{4,5}[A-Za-z0-9]*)/i);
    if (genericIntel) return `cpu:intel:core-${genericIntel[1].toLowerCase()}-${genericIntel[2].toLowerCase()}`;

    const genericCoreUltra = normalized.match(/\bUltra\s*([3579])\s*[- ]?\s*(\d{3,5}[A-Za-z0-9]*)/i);
    if (genericCoreUltra) return `cpu:intel:core-ultra-${genericCoreUltra[1]}-${genericCoreUltra[2].toLowerCase()}`;
  }

  if (deviceType === 'GPU') {
    const gpu = normalized.match(/\b(RTX|GTX|RX)\s*([2-9]\d{2,3})\s*(Ti|SUPER|XT|XTX|GRE)?\b/i);
    if (gpu) {
      const family = gpu[1].toUpperCase();
      const suffix = gpu[3] ? `-${gpu[3].toLowerCase()}` : '';
      return `gpu:${family === 'RX' ? 'amd' : 'nvidia'}:${family.toLowerCase()}-${gpu[2]}${suffix}`;
    }
  }

  return `${deviceType.toLowerCase()}:unknown:${normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export function isComparableBenchmark(
  left: ComponentBenchmarkDefinition,
  right: ComponentBenchmarkDefinition,
): boolean {
  return left.testId === right.testId
    && left.comparableGroupKey === right.comparableGroupKey
    && left.deviceType === right.deviceType
    && left.unit === right.unit;
}

export function summarizeObservations(
  observations: ComponentBenchmarkObservation[],
): RepresentativeComponentBenchmarkScore[] {
  const groups = new Map<string, ComponentBenchmarkObservation[]>();

  for (const observation of observations) {
    const key = [observation.partId, observation.testId, observation.evidenceType].join(':');
    const group = groups.get(key) ?? [];
    group.push(observation);
    groups.set(key, group);
  }

  return [...groups.values()]
    .map((group) => {
      const orderedScores = group.map((observation) => observation.score).sort((left, right) => left - right);
      const middle = Math.floor(orderedScores.length / 2);
      const score = orderedScores.length % 2 === 0
        ? (orderedScores[middle - 1] + orderedScores[middle]) / 2
        : orderedScores[middle];
      const first = group[0];
      const sourceNames = [...new Set(group.map((observation) => observation.sourceName))].sort();
      const sourceUrls = [...new Set(group.map((observation) => observation.sourceUrl))].sort();
      const conditions = group
        .map((observation) => observation.conditions)
        .filter((condition): condition is Record<string, unknown> => Boolean(condition));

      return {
        testId: first.testId,
        comparableGroupKey: first.comparableGroupKey,
        deviceType: first.deviceType,
        unit: first.unit,
        partId: first.partId,
        partName: first.partName,
        manufacturer: first.manufacturer,
        score,
        minimumScore: orderedScores[0],
        maximumScore: orderedScores[orderedScores.length - 1],
        observationCount: group.length,
        evidenceType: first.evidenceType,
        sourceNames,
        sourceUrls,
        conditions,
      } satisfies RepresentativeComponentBenchmarkScore;
    })
    .sort((left, right) => left.evidenceType.localeCompare(right.evidenceType) || left.partName.localeCompare(right.partName));
}

export function calculateScoreDelta(selectedScore: number, candidateScore: number) {
  const delta = candidateScore - selectedScore;
  const percent = selectedScore === 0
    ? null
    : Number(((delta / selectedScore) * 100).toFixed(2));

  return { delta, percent };
}
