import type { QuoteProfileV2 } from './quote-profile';
import type { PerformanceResult, Quote, QuoteInput, QuotePart } from './v1-types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

export type QuotePreviewPart = {
  offerId: string;
  externalProductId: string;
  productName: string;
  productUrl: string;
  imageUrl: string | null;
  offerName: string;
  supplierCode?: string;
  priceWon: number;
  publicPriceWon: number | null;
  stockStatus: string;
  priceCheckedAt: string;
  isDefault: boolean;
  reviewCount?: number | null;
  rating?: number | null;
  summarySpecText?: string | null;
  displaySpecText?: string;
  detailImages?: string[];
  partId: string;
  category: string;
  partName: string;
  manufacturer?: string | null;
  trustScore?: number;
  trustLabel?: 'VERIFIED_MANUFACTURER' | 'ADMIN_APPROVED' | 'POPULAR' | 'SPEC_VERIFIED' | 'UNVERIFIED';
};

export type QuotePerformanceEvidence = {
  evidenceType: 'MEASURED' | 'SOURCE_BENCHMARK' | 'SOURCE_RECOMMENDATION' | 'SOURCE_REPORTED' | 'DERIVED' | 'NONE';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  sampleCount: number;
  results: Array<PerformanceResult & { evidenceNote?: string }>;
  note: string;
};

export type QuotePreviewCandidate = {
  id: string;
  strategy: 'BALANCED' | 'PERFORMANCE' | 'VALUE_UPGRADE';
  status: 'READY' | 'REVIEW_REQUIRED';
  parts: QuotePreviewPart[];
  subtotalWon: number;
  assemblyFeeWon: number;
  shippingFeeWon: number;
  windowsFeeWon: number;
  totalWon: number;
  priceCheckedAt: string;
  selectionReasons: string[];
  unmetConditions: string[];
  compatibility: Array<{ rule: string; passed: boolean; detail: string }>;
  performanceEvidence: QuotePerformanceEvidence;
};

export type QuotePreviewResponse = {
  profileVersion: number;
  rulesetVersion: string;
  status: 'READY' | 'REVIEW_REQUIRED';
  candidates: QuotePreviewCandidate[];
  review?: { reasons: string[]; relaxations: string[]; requiredMinimumWon?: number; shortfallWon?: number };
};

export async function requestQuotePreview(profile: QuoteProfileV2): Promise<QuotePreviewResponse> {
  const response = await fetch(`${apiBaseUrl}/quotes/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    throw new Error(message || '자동 견적을 생성하지 못했습니다.');
  }
  return body as QuotePreviewResponse;
}

export function candidateToQuote(candidate: QuotePreviewCandidate, profile: QuoteProfileV2, input: QuoteInput): Quote {
  const parts = candidate.parts.map((part): QuotePart => ({
    partId: part.partId,
    category: toLegacyCategory(part.category),
    name: part.partName,
    memo: `${part.offerName} · ${part.stockStatus} · ${new Date(part.priceCheckedAt).toLocaleDateString('ko-KR')} 가격 확인`,
    price: part.priceWon,
    quantity: 1,
    supplier: 'JHS 판매 데이터',
    productNo: part.externalProductId,
    imageUrl: part.imageUrl ?? undefined,
    detailUrl: part.productUrl,
    detailImages: part.detailImages ?? [],
    specSummary: part.displaySpecText ?? part.summarySpecText ?? undefined,
    offerId: part.offerId,
    offerName: part.offerName,
    stockStatus: part.stockStatus,
    priceCheckedAt: part.priceCheckedAt,
    publicPrice: part.publicPriceWon ?? undefined,
  }));
  const performance = candidate.performanceEvidence.results.filter((result) => hasFps(result)).map((result) => ({
    ...result,
    resolution: normalizeResolution(result.resolution),
    isEstimated: result.evidenceType !== 'MEASURED',
  }));
  const compatibility = candidate.compatibility.map((check) => `${check.passed ? '통과' : '실패'}: ${check.rule} · ${check.detail}`);
  const now = new Date().toISOString();
  return {
    id: `Q-${candidate.id}-${Date.now()}`,
    createdAt: now,
    title: `자동 견적 · ${strategyLabel(candidate.strategy)} · ${profile.workloadProfile.workloads.length}개 작업`,
    mode: 'AUTO',
    input,
    parts,
    performance,
    performanceEvidence: {
      evidenceType: candidate.performanceEvidence.evidenceType,
      confidence: candidate.performanceEvidence.confidence,
      sampleCount: candidate.performanceEvidence.sampleCount,
      note: candidate.performanceEvidence.note,
    },
    compatibility,
    subtotal: candidate.subtotalWon,
    assemblyFee: candidate.assemblyFeeWon,
    shippingFee: candidate.shippingFeeWon,
    windowsFee: candidate.windowsFeeWon,
    total: candidate.totalWon,
    status: 'DRAFT',
  };
}

function hasFps(result: PerformanceResult) {
  return Number.isFinite(result.fpsMin) && Number.isFinite(result.fpsMax);
}

export function strategyLabel(strategy: QuotePreviewCandidate['strategy']) {
  return {
    BALANCED: '균형형',
    PERFORMANCE: '성능 우선',
    VALUE_UPGRADE: '가성비·확장형',
  }[strategy];
}

function toLegacyCategory(category: string): QuotePart['category'] {
  return {
    MAINBOARD: '메인보드',
    GPU: '그래픽카드',
    PSU: '파워',
    CASE: '케이스',
    CPU_COOLER: '쿨러',
  }[category] ?? category;
}

function normalizeResolution(resolution: string): QuoteInput['resolution'] {
  return resolution === 'UHD' ? '4K' : resolution === 'FHD' || resolution === 'QHD' || resolution === '4K' ? resolution : 'QHD';
}
