'use client';

import { Check, CircleAlert, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PartDetailModal } from '@/components/PartDetailModal';
import { PanelCard, SectionHeader } from '@/components/ui/PanelCard';
import { QuotePartList, type QuotePartListItem } from '@/components/ui/QuotePartList';
import { strategyLabel, type QuotePreviewCandidate, type QuotePreviewPart, type QuotePreviewResponse } from '@/lib/quote-preview-client';
import type { CatalogPart } from '@/lib/v1-types';

export function QuotePreviewCandidates({ preview, selectedId, onSelect }: { preview: QuotePreviewResponse; selectedId?: string; onSelect: (candidate: QuotePreviewCandidate) => void }) {
  const [activePart, setActivePart] = useState<CatalogPart | null>(null);

  return (
    <PanelCard>
      {activePart && <PartDetailModal onClose={() => setActivePart(null)} part={activePart} />}
      <SectionHeader
        description={preview.status === 'READY' ? '실제 판매 단위와 현재 가격·재고를 확인한 후보입니다. 선택 후 주문 단계에서 가격·재고를 다시 확인합니다.' : '현재 조건을 모두 만족하는 후보가 없어 부족한 조건과 완화 방법을 확인해야 합니다.'}
        title="서버 검증 후보 비교"
      />
      {preview.status === 'REVIEW_REQUIRED' && preview.review && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800"><p className="font-black">추가 확인이 필요합니다</p>{preview.review.shortfallWon ? <p className="mt-2">현재 최대 예산보다 최소 {preview.review.shortfallWon.toLocaleString()}원이 더 필요합니다. (필요 최소 약 {preview.review.requiredMinimumWon?.toLocaleString()}원)</p> : null}<ul className="mt-2 grid gap-1">{preview.review.reasons.map((reason) => <li key={reason}>· {reason}</li>)}{preview.review.relaxations.map((relaxation) => <li className="text-amber-950" key={relaxation}>완화 가능: {relaxation}</li>)}</ul></div>}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {preview.candidates.map((candidate) => {
          const passed = candidate.compatibility.filter((check) => check.passed).length;
          const failed = candidate.compatibility.length - passed;
          const selected = selectedId === candidate.id;
          return (
            <article className={`grid gap-3 rounded-2xl border p-4 ${selected ? 'border-brand bg-teal-50/50 shadow-md' : 'border-line bg-white'}`} key={candidate.id}>
              <div className="flex items-start justify-between gap-2"><div><p className="text-xs font-black text-brand">{candidate.id}</p><h3 className="mt-1 text-lg font-black">{strategyLabel(candidate.strategy)}</h3></div>{selected && <span className="rounded-full bg-brand px-2 py-1 text-xs font-black text-white">선택됨</span>}</div>
              <p className="text-2xl font-black text-slate-950">{candidate.totalWon.toLocaleString()}원</p>
              <div className="grid gap-1 text-xs font-bold text-slate-600"><span>{candidate.parts.length}개 판매 단위 · {new Date(candidate.priceCheckedAt).toLocaleDateString('ko-KR')} 확인</span><span className="flex items-center gap-1 text-emerald-700"><ShieldCheck size={14} /> 호환 통과 {passed}개{failed ? ` · 실패 ${failed}개` : ''}</span></div>
              <div className="rounded-xl border border-line bg-panel p-3 text-xs font-bold"><p className="flex items-center gap-1 text-brand"><EvidenceIcon type={candidate.performanceEvidence.evidenceType} /> {evidenceLabel(candidate.performanceEvidence.evidenceType)} · 신뢰도 {confidenceLabel(candidate.performanceEvidence.confidence)} · 표본 {candidate.performanceEvidence.sampleCount}회</p><p className="mt-1 text-slate-600">{candidate.performanceEvidence.note}</p>{candidate.performanceEvidence.results.filter((result) => Number.isFinite(result.fpsMin) && Number.isFinite(result.fpsMax)).slice(0, 3).map((result) => <p className="mt-1 text-slate-700" key={`${result.game}-${result.resolution}`}>{result.game} · {result.resolution} {result.fpsMin}~{result.fpsMax} FPS</p>)}</div>
              <div className="grid gap-1 text-xs font-bold text-slate-600">{candidate.selectionReasons.slice(0, 2).map((reason) => <p className="flex gap-1" key={reason}><Check className="shrink-0 text-emerald-600" size={14} />{reason}</p>)}{candidate.unmetConditions.slice(0, 2).map((reason) => <p className="flex gap-1 text-amber-700" key={reason}><CircleAlert className="shrink-0" size={14} />{reason}</p>)}</div>
              <details className="min-w-0 rounded-xl border border-line bg-white p-3 text-xs"><summary className="cursor-pointer font-black text-brand">판매 단위 상세 ({candidate.parts.length}개)</summary><QuotePartList onOpenPart={(part) => setActivePart(previewPartToCatalog(part))} parts={candidate.parts.map(candidatePartToDisplay)} variant="candidate" /><p className="mt-2 text-slate-500">부품명을 클릭하면 상품 이미지와 원본 상세 스펙 이미지를 확인할 수 있습니다. · 가격 확인 {new Date(candidate.priceCheckedAt).toLocaleString('ko-KR')}</p></details>
              <Button className="mt-1 w-full" onClick={() => onSelect(candidate)} type="button" variant={selected ? 'outline' : 'primary'}>{selected ? '선택한 후보 다시 저장' : '이 후보 선택하기'}</Button>
            </article>
          );
        })}
      </div>
    </PanelCard>
  );
}

function previewPartToCatalog(part: QuotePartListItem): CatalogPart {
  return {
    id: part.id,
    category: categoryLabel(part.category) as CatalogPart['category'],
    productNo: part.productNo ?? part.id,
    name: part.name,
    price: part.price ?? 0,
    imageUrl: part.imageUrl ?? '',
    detailUrl: part.detailUrl ?? '',
    detailImages: part.detailImages ?? [],
    spec: part.spec ?? '',
    reviewCount: part.reviewCount ?? 0,
    reviewRate: part.rating ?? 0,
    badges: [],
    stockStatus: part.stockStatus ?? undefined,
  };
}

function candidatePartToDisplay(part: QuotePreviewPart): QuotePartListItem {
  return {
    id: part.offerId,
    category: categoryLabel(part.category),
    name: part.partName,
    spec: part.displaySpecText ?? part.summarySpecText,
    imageUrl: part.imageUrl,
    detailImages: part.detailImages,
    detailUrl: part.productUrl,
    productNo: part.externalProductId,
    price: part.priceWon,
    quantity: 1,
    manufacturer: part.manufacturer,
    trustLabel: part.trustLabel,
    reviewCount: part.reviewCount,
    rating: part.rating,
    stockStatus: part.stockStatus,
    supplier: 'JHS 판매 데이터',
  };
}

function categoryLabel(category: string) {
  return {
    MAINBOARD: '메인보드',
    GPU: '그래픽카드',
    PSU: '파워',
    CASE: '케이스',
    CPU_COOLER: '쿨러',
  }[category] ?? category;
}

function evidenceLabel(type: QuotePreviewCandidate['performanceEvidence']['evidenceType']) {
  return { MEASURED: '실측', SOURCE_REPORTED: '출처 보고값', DERIVED: '해상도 추정값', NONE: '데이터 없음' }[type];
}

function EvidenceIcon({ type }: { type: QuotePreviewCandidate['performanceEvidence']['evidenceType'] }) {
  return type === 'NONE' ? <CircleAlert size={14} /> : <ShieldCheck size={14} />;
}

function confidenceLabel(confidence: QuotePreviewCandidate['performanceEvidence']['confidence']) {
  return { HIGH: '높음', MEDIUM: '중간', LOW: '낮음', NONE: '없음' }[confidence];
}
