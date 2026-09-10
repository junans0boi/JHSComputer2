import Link from 'next/link';
import type { RecommendationCombo, RecommendationComboDetail, RecommendationContext } from '@/lib/server-benchmarks';
import { resolutionLabel } from './benchmark-labels';

type Props = {
  combos: RecommendationCombo[];
  total: number;
  error?: boolean;
  selectedRef?: string;
  selectedComboKey?: string;
  detail: RecommendationComboDetail;
};

export function BenchmarkRecommendationSection({ combos, total, error = false, selectedRef, selectedComboKey, detail }: Props) {
  return (
    <section className="min-w-0 rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-5">
      <div className="min-w-0">
        <p className="text-sm font-black text-brand">JHS 추천 맥락</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-black text-slate-950">게임별 추천 조합</h2>
            <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-slate-600">
              실제 FPS 측정값과 분리해, 같은 CPU·GPU가 어떤 게임·해상도·등급에서 추천됐는지 보여줍니다.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-brand">{total}개 조합</span>
        </div>
      </div>

      {error || detail.error ? (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm font-bold leading-6 text-amber-800">
          추천 조합 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      ) : combos.length ? (
        <div className="mt-5 grid min-w-0 gap-5 xl:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
          <RecommendationComboList combos={combos} selectedRef={selectedRef} selectedComboKey={selectedComboKey} />
          <RecommendationContextPanel detail={detail} />
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-line bg-slate-50 p-6 text-sm font-bold leading-6 text-slate-500">
          현재 표시할 추천 조합 맥락이 없습니다. 데이터 수집 상태를 확인해 주세요.
        </div>
      )}
    </section>
  );
}

function RecommendationComboList({ combos, selectedRef, selectedComboKey }: { combos: RecommendationCombo[]; selectedRef?: string; selectedComboKey?: string }) {
  return (
    <nav aria-label="추천 조합 목록" className="grid max-h-[720px] min-w-0 gap-3 overflow-y-auto pr-1 content-start">
      {combos.map((combo) => {
        const isSelected = combo.publicComboRef === selectedRef;
        const href = buildRecommendationHref(selectedComboKey, combo.publicComboRef);
        return (
          <Link
            aria-current={isSelected ? 'true' : undefined}
            className={`min-w-0 rounded-2xl border p-4 transition ${isSelected ? 'border-brand bg-teal-50/60 shadow-sm' : 'border-line hover:border-brand/40 hover:bg-teal-50/30'}`}
            href={href}
            key={combo.publicComboRef}
          >
            <p className="safe-break text-sm font-black text-slate-900">{combo.publicComboName}</p>
            <div className="mt-3 flex min-w-0 flex-wrap gap-2 text-[11px] font-bold">
              <span className="rounded-full bg-white px-2 py-1 text-slate-600">맥락 {combo.recommendationCount}개</span>
              <span className="rounded-full bg-white px-2 py-1 text-slate-600">게임 {combo.gameCount}개</span>
            </div>
            <p className="mt-3 break-words text-[11px] font-bold text-slate-500">최근 확인 {formatDate(combo.latestCapturedAt)}</p>
          </Link>
        );
      })}
    </nav>
  );
}

function RecommendationContextPanel({ detail }: { detail: RecommendationComboDetail }) {
  if (!detail.combo) {
    return <div className="rounded-2xl border border-dashed border-line bg-slate-50 p-6 text-sm font-bold leading-6 text-slate-500">선택한 추천 조합의 상세 맥락을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="min-w-0">
      <div className="min-w-0 rounded-2xl border border-line bg-slate-50 p-4">
        <p className="text-xs font-bold text-slate-500">선택한 추천 조합</p>
        <h3 className="safe-break mt-1 text-lg font-black text-slate-950">{detail.combo.publicComboName}</h3>
        <div className="mt-3 flex min-w-0 flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-white px-2 py-1 text-brand">추천 맥락 {detail.contexts.length}/{detail.total}개 표시</span>
          <span className="rounded-full bg-white px-2 py-1 text-slate-600">게임 {detail.combo.gameCount}개</span>
          <span className="rounded-full bg-white px-2 py-1 text-slate-600">FPS 수치 아님</span>
        </div>
      </div>
      {detail.contexts.length < detail.total && (
        <p className="mt-2 text-xs font-bold leading-5 text-slate-500">최신 맥락 일부를 먼저 표시합니다.</p>
      )}
      <div className="mt-3 grid min-w-0 gap-3">
        {detail.contexts.map((context) => <RecommendationContextCard context={context} key={`${context.gameId}-${context.resolution}-${context.tier}-${context.capturedAt}`} />)}
        {!detail.contexts.length && <div className="rounded-2xl border border-dashed border-line p-6 text-sm font-bold text-slate-500">표시할 추천 맥락이 없습니다.</div>}
      </div>
    </div>
  );
}

function RecommendationContextCard({ context }: { context: RecommendationContext }) {
  return (
    <article className="min-w-0 rounded-2xl border border-line bg-white p-4">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="safe-break text-base font-black text-slate-950">{context.gameName}</h4>
          <p className="mt-1 break-words text-xs font-bold text-slate-500">{resolutionLabel(context.resolution)} · {context.tier} · {context.platform}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs font-bold text-slate-500">추천 예산</p>
          <p className="mt-1 text-sm font-black text-slate-900">{context.priceRange ?? formatPrice(context.price)}</p>
        </div>
      </div>
      <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-[11px] font-bold text-slate-500">
        <span>확인 {formatDate(context.capturedAt)}</span>
        {isSafeSourceUrl(context.sourceUrl) ? (
          <details className="min-w-0 max-w-full text-right">
            <summary className="cursor-pointer list-none break-words text-brand underline">근거 보기</summary>
            <a className="mt-1 block max-w-full break-all font-medium text-brand underline" href={context.sourceUrl} rel="noreferrer" target="_blank">원문 링크 열기</a>
          </details>
        ) : <span>원문 링크 없음</span>}
      </div>
    </article>
  );
}

function isSafeSourceUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

function buildRecommendationHref(selectedComboKey: string | undefined, recommendationRef: string) {
  const params = new URLSearchParams();
  if (selectedComboKey) params.set('comboKey', selectedComboKey);
  params.set('recommendationComboRef', recommendationRef);
  return `/benchmarks?${params.toString()}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return '확인 시각 없음';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
}

function formatPrice(value: number | null) {
  return value == null ? '예산 정보 없음' : `${value.toLocaleString('ko-KR')}원`;
}
