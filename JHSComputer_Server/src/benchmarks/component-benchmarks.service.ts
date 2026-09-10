import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  calculateScoreDelta,
  normalizeComponentModelKey,
  summarizeObservations,
  type ComponentBenchmarkDeviceType,
  type ComponentBenchmarkObservation,
  type RepresentativeComponentBenchmarkScore,
} from './component-benchmark';

type ComponentPart = {
  partId: number;
  partName: string;
  manufacturer?: string | null;
  modelName?: string | null;
  modelKey?: string | null;
  deviceType: ComponentBenchmarkDeviceType;
  normalizedModelKey: string;
};

type ObservationRow = {
  observationId: string | number;
  observationPartId?: string | number | null;
  normalizedModelKey?: string | null;
  score: string | number;
  evidenceType: 'SOURCE_REPORTED' | 'MEASURED';
  sourceName: string;
  sourceUrl: string;
  capturedAt: string;
  conditionsJson?: unknown;
  testId: string | number;
  benchmarkCode: string;
  testName: string;
  testVersion: string;
  scoreMetric: string;
  deviceType: ComponentBenchmarkDeviceType;
  scoreUnit: string;
  comparableGroupKey: string;
};

type TestMetadata = {
  id: number;
  code: string;
  name: string;
  version: string;
  metric: string;
  unit: string;
  comparableGroupKey: string;
};

export type ComponentBenchmarkScoreItem = {
  partId: number;
  partName: string;
  manufacturer?: string | null;
  deviceType: ComponentBenchmarkDeviceType;
  test: TestMetadata;
  score: number;
  representative: true;
  observationCount: number;
  evidenceType: 'SOURCE_REPORTED' | 'MEASURED';
  sourceNames: string[];
  sourceUrls: string[];
  deltaFromSelected?: number;
  deltaPercentFromSelected?: number | null;
  conditions?: Record<string, unknown>;
  conditionSamples?: Record<string, unknown>[];
  comparisonUnavailableReason?: string;
};

@Injectable()
export class ComponentBenchmarksService {
  constructor(private readonly dataSource: DataSource) {}

  async getScores(partId: number) {
    const part = (await this.loadParts([partId])).get(String(partId));
    if (!part) {
      return {
        part: null,
        items: [],
        total: 0,
        reason: '선택한 부품을 찾을 수 없습니다.',
      };
    }

    const rows = await this.loadObservationRows([part]);
    const { items } = this.buildItemsForPart(part, rows);
    return {
      part: this.toPublicPart(part),
      items,
      total: items.length,
      reason: items.length ? undefined : '이 부품과 일치하는 출처 보고값 또는 직접 측정값이 아직 없습니다.',
    };
  }

  async compare(partIds: number[], testId?: number) {
    const uniquePartIds = [...new Set(partIds.filter((partId) => Number.isInteger(partId) && partId > 0))];
    if (!uniquePartIds.length) {
      return {
        selectedPartId: null,
        parts: [],
        items: [],
        total: 0,
        reason: '비교할 부품이 없습니다.',
      };
    }

    const partsById = await this.loadParts(uniquePartIds);
    let parts = uniquePartIds
      .map((partId) => partsById.get(String(partId)))
      .filter((part): part is ComponentPart => Boolean(part));
    if (!parts.length) {
      return {
        selectedPartId: null,
        parts: [],
        items: [],
        total: 0,
        reason: '비교할 부품을 찾을 수 없습니다.',
      };
    }

    if (parts.length === 1) {
      const candidateIds: number[] = await this.loadComparisonCandidateIds(parts[0], testId);
      const candidateParts = await this.loadParts(candidateIds);
      parts = [
        parts[0],
        ...candidateIds
          .map((partId: number) => candidateParts.get(String(partId)))
          .filter((part: ComponentPart | undefined): part is ComponentPart => Boolean(part)),
      ];
    }

    const rows = await this.loadObservationRows(parts, testId);
    const partSummaries = new Map<number, RepresentativeComponentBenchmarkScore[]>();
    const testMetadata = new Map<string, TestMetadata>();

    for (const part of parts) {
      const partRows = rows.filter((row) => this.rowMatchesPart(row, part));
      const built = this.buildItemsForPart(part, partRows);
      partSummaries.set(part.partId, built.summaries);
      built.metadata.forEach((metadata) => testMetadata.set(String(metadata.id), metadata));
    }

    const selectedPart = parts[0];
    const selectedSummaries = partSummaries.get(selectedPart.partId) ?? [];
    if (!selectedSummaries.length) {
      return {
        selectedPartId: selectedPart.partId,
        parts: parts.map((part) => this.toPublicPart(part)),
        items: [],
        total: 0,
        reason: '선택 부품과 일치하는 출처 보고값 또는 직접 측정값이 아직 없습니다. 비교 숫자를 생성하지 않았습니다.',
      };
    }

    const selectedSummaryByGroup = new Map<string, RepresentativeComponentBenchmarkScore>();
    for (const summary of selectedSummaries) {
      selectedSummaryByGroup.set(this.summaryGroupKey(summary), summary);
    }

    const items = parts.flatMap((part) => (
      (partSummaries.get(part.partId) ?? []).map((summary) => {
        const selected = selectedSummaryByGroup.get(this.summaryGroupKey(summary));
        return selected
          ? this.toScoreItem(summary, testMetadata.get(summary.testId), selected, part.partId !== selectedPart.partId)
          : null;
      }).filter((item): item is ComponentBenchmarkScoreItem => Boolean(item))
    ));

    items.sort((left, right) => (
      left.test.name.localeCompare(right.test.name)
      || left.test.metric.localeCompare(right.test.metric)
      || left.evidenceType.localeCompare(right.evidenceType)
      || left.partName.localeCompare(right.partName)
    ));

    return {
      selectedPartId: selectedPart.partId,
      parts: parts.map((part) => this.toPublicPart(part)),
      items,
      total: items.length,
      reason: items.length ? undefined : '같은 테스트 조건으로 비교할 수 있는 점수가 아직 없습니다.',
    };
  }

  private async loadParts(partIds: number[]) {
    const ids = [...new Set(partIds)].filter((partId) => Number.isInteger(partId) && partId > 0);
    if (!ids.length) return new Map<string, ComponentPart>();
    const placeholders = ids.map(() => '?').join(', ');
    const rows = await this.dataSource.query(
      `SELECT PART_ID AS partId, CANONICAL_NAME AS partName, MANUFACTURER AS manufacturer,
              MODEL_NAME AS modelName, MODEL_KEY AS modelKey, PART_CATEGORY_ID AS categoryId
       FROM parts
       WHERE PART_ID IN (${placeholders}) AND PART_CATEGORY_ID IN (1, 5) AND STATUS = 'ACTIVE'`,
      ids,
    );

    return new Map<string, ComponentPart>(rows.map((row: any) => {
      const deviceType: ComponentBenchmarkDeviceType = Number(row.categoryId) === 1 ? 'CPU' : 'GPU';
      return [String(row.partId), {
        partId: Number(row.partId),
        partName: String(row.partName ?? ''),
        manufacturer: row.manufacturer ?? null,
        modelName: row.modelName ?? null,
        modelKey: row.modelKey ?? null,
        deviceType,
        normalizedModelKey: normalizeComponentModelKey(
          `${row.manufacturer ?? ''} ${row.modelName ?? row.partName ?? ''}`,
          deviceType,
        ),
      } satisfies ComponentPart];
    }));
  }

  private async loadObservationRows(parts: ComponentPart[], testId?: number) {
    const partIds = [...new Set(parts.map((part) => part.partId))];
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (partIds.length) {
      // Ambiguous model-family matches are intentionally stored with PART_ID = NULL.
      // They remain auditable source observations, but cannot masquerade as a
      // specific catalog SKU in a public comparison.
      conditions.push(`o.PART_ID IN (${partIds.map(() => '?').join(', ')})`);
      values.push(...partIds);
    }
    if (testId !== undefined) {
      conditions.push('t.BENCHMARK_COMPONENT_TEST_ID = ?');
      values.push(testId);
    }

    return this.dataSource.query(
      `SELECT
         o.BENCHMARK_COMPONENT_OBSERVATION_ID AS observationId,
         o.PART_ID AS observationPartId,
         o.NORMALIZED_MODEL_KEY AS normalizedModelKey,
         o.SCORE AS score,
         o.EVIDENCE_TYPE AS evidenceType,
         s.SOURCE_NAME AS sourceName,
         o.SOURCE_URL AS sourceUrl,
         o.CAPTURED_DT AS capturedAt,
         JSON_EXTRACT(o.RAW_JSON, '$.conditions') AS conditionsJson,
         t.BENCHMARK_COMPONENT_TEST_ID AS testId,
         t.BENCHMARK_CODE AS benchmarkCode,
         t.TEST_NAME AS testName,
         t.TEST_VERSION AS testVersion,
         t.SCORE_METRIC AS scoreMetric,
         t.DEVICE_TYPE AS deviceType,
         t.SCORE_UNIT AS scoreUnit,
         t.COMPARABLE_GROUP_KEY AS comparableGroupKey
       FROM benchmark_component_observations o
       JOIN benchmark_component_tests t ON t.BENCHMARK_COMPONENT_TEST_ID = o.BENCHMARK_COMPONENT_TEST_ID
       JOIN benchmark_sources s ON s.BENCHMARK_SOURCE_ID = o.BENCHMARK_SOURCE_ID
       WHERE t.IS_ACTIVE = 'Y' AND ${conditions.length ? conditions.join(' AND ') : '1 = 0'}
       ORDER BY t.DEVICE_TYPE ASC, t.TEST_NAME ASC, o.SCORE DESC, o.BENCHMARK_COMPONENT_OBSERVATION_ID ASC`,
      values,
    ) as Promise<ObservationRow[]>;
  }

  private async loadComparisonCandidateIds(part: ComponentPart, testId?: number) {
    const values: unknown[] = [part.partId, part.deviceType === 'CPU' ? 1 : 5];
    const testCondition = testId === undefined ? '' : ' AND o.BENCHMARK_COMPONENT_TEST_ID = ?';
    if (testId !== undefined) values.push(testId);
    const rows = await this.dataSource.query(
      `SELECT DISTINCT p.PART_ID AS partId
       FROM benchmark_component_observations o
       JOIN benchmark_component_tests t ON t.BENCHMARK_COMPONENT_TEST_ID = o.BENCHMARK_COMPONENT_TEST_ID
       JOIN parts p ON p.PART_ID = o.PART_ID
       WHERE t.IS_ACTIVE = 'Y' AND p.PART_ID <> ? AND p.PART_CATEGORY_ID = ? AND p.STATUS = 'ACTIVE'${testCondition}
       ORDER BY p.POPULARITY_SCORE DESC, p.ADMIN_PRIORITY DESC, p.PART_ID ASC
       LIMIT 5`,
      values,
    );
    return rows.map((row: any) => Number(row.partId)).filter((partId: number) => Number.isInteger(partId) && partId > 0);
  }

  private buildItemsForPart(part: ComponentPart, rows: ObservationRow[]) {
    const observations: ComponentBenchmarkObservation[] = rows
      .filter((row) => this.rowMatchesPart(row, part))
      .map((row) => ({
        observationId: String(row.observationId),
        partId: String(part.partId),
        partName: part.partName,
        manufacturer: part.manufacturer,
        testId: String(row.testId),
        comparableGroupKey: row.comparableGroupKey,
        deviceType: row.deviceType,
        unit: row.scoreUnit,
        score: Number(row.score),
        evidenceType: row.evidenceType,
        sourceName: row.sourceName,
        sourceUrl: row.sourceUrl,
        capturedAt: String(row.capturedAt ?? ''),
        conditions: parseConditions(row.conditionsJson),
      }));
    const summaries = summarizeObservations(observations);
    const metadata = rows
      .filter((row) => this.rowMatchesPart(row, part))
      .map((row) => this.toTestMetadata(row))
      .filter((metadata, index, all) => all.findIndex((candidate) => candidate.id === metadata.id) === index);
    const items = summaries.map((summary) => this.toScoreItem(summary, metadata.find((candidate) => String(candidate.id) === summary.testId)));
    return { summaries, metadata, items };
  }

  private rowMatchesPart(row: ObservationRow, part: ComponentPart) {
    return String(row.observationPartId ?? '') === String(part.partId);
  }

  private toTestMetadata(row: ObservationRow): TestMetadata {
    return {
      id: Number(row.testId),
      code: row.benchmarkCode,
      name: row.testName,
      version: row.testVersion,
      metric: row.scoreMetric,
      unit: row.scoreUnit,
      comparableGroupKey: row.comparableGroupKey,
    };
  }

  private toScoreItem(
    summary: RepresentativeComponentBenchmarkScore,
    metadata?: TestMetadata,
    selected?: RepresentativeComponentBenchmarkScore,
    isCandidate = false,
  ): ComponentBenchmarkScoreItem {
    const test = metadata ?? {
      id: Number(summary.testId),
      code: summary.testId,
      name: summary.testId,
      version: summary.testId,
      metric: summary.testId,
      unit: summary.unit,
      comparableGroupKey: summary.comparableGroupKey,
    };
    const delta = isCandidate && selected
      ? calculateScoreDelta(selected.score, summary.score)
      : undefined;

    return {
      partId: Number(summary.partId),
      partName: summary.partName,
      manufacturer: summary.manufacturer,
      deviceType: summary.deviceType,
      test,
      score: summary.score,
      representative: true,
      observationCount: summary.observationCount,
      evidenceType: summary.evidenceType,
      sourceNames: summary.sourceNames,
      sourceUrls: summary.sourceUrls,
      ...(delta ? { deltaFromSelected: delta.delta, deltaPercentFromSelected: delta.percent } : {}),
      ...(summary.conditions[0] ? { conditions: summary.conditions[0] } : {}),
      ...(summary.conditions.length > 0 ? { conditionSamples: summary.conditions } : {}),
    };
  }

  private summaryGroupKey(summary: RepresentativeComponentBenchmarkScore) {
    return [summary.testId, summary.comparableGroupKey, summary.evidenceType].join(':');
  }

  private toPublicPart(part: ComponentPart) {
    return {
      partId: part.partId,
      partName: part.partName,
      manufacturer: part.manufacturer,
      deviceType: part.deviceType,
    };
  }
}

function parseConditions(value: unknown): Record<string, unknown> | null {
  if (!value) return null;
  if (typeof value === 'object') return value as Record<string, unknown>;
  if (typeof value !== 'string') return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}
