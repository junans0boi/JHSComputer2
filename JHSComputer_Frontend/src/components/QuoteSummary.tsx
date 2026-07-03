'use client';

import { AlertTriangle, CheckCircle2, Cpu, Gauge, HelpCircle, Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { IconTitle, PanelCard } from '@/components/ui/PanelCard';
import { QuotePartsTable } from '@/components/ui/PartsList';
import { getGameLogo } from '@/lib/game-assets';
import type { CatalogPart, PerformanceResult, Quote, QuotePart, Resolution } from '@/lib/v1-types';

type QuoteEditActions = {
  onRequestReplacePart?: (part: QuotePart) => void;
  onRemovePart?: (part: QuotePart) => void;
};

export function QuotePartsPanel({ quote, onRequestReplacePart, onRemovePart }: { quote: Quote } & QuoteEditActions) {
  const [modalPart, setModalPart] = useState<CatalogPart | null>(null);

  return (
    <PanelCard>
      <IconTitle
        description={`${quote.input.purpose} · ${quote.input.resolution} · ${quote.input.priority}`}
        icon={<Cpu />}
        title="견적"
      />
      <QuotePartsTable
        activePart={modalPart}
        onClosePart={() => setModalPart(null)}
        onOpenPart={setModalPart}
        onRemovePart={onRemovePart}
        onRequestReplace={onRequestReplacePart}
        parts={quote.parts}
      />
    </PanelCard>
  );
}

export function QuoteSidePanel({ quote, compact = false }: { quote: Quote; compact?: boolean }) {
  return (
    <aside className="grid min-w-0 content-start gap-5">
      <QuoteGamePerformancePanel quote={quote} />
      <QuoteCompatibilityPanel compact={compact} quote={quote} />
    </aside>
  );
}

export function QuoteGamePerformancePanel({ quote }: { quote: Quote }) {
  const [keyword, setKeyword] = useState('');
  const groupedPerformance = groupPerformanceByGame(quote.performance);
  const hasResolutionAdjusted = quote.performance.some((result) => result.isResolutionAdjusted);
  const filteredPerformance = groupedPerformance.filter((group) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return !normalizedKeyword || group.game.toLowerCase().includes(normalizedKeyword);
  });

  return (
    <PanelCard>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Gauge className="text-accent" size={20} />
          <h2 className="text-lg font-black">게임 성능 예상</h2>
        </div>
        {groupedPerformance.length > 0 && (
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-brand">
            실제 DB {groupedPerformance.length}개 게임 · {hasResolutionAdjusted ? '해상도 보정 포함' : 'FHD/QHD/4K'}
          </span>
        )}
      </div>

      {groupedPerformance.length > 5 && (
        <label className="mt-4 flex h-10 items-center gap-2 rounded-xl border border-line bg-white px-3 focus-within:border-brand">
          <Search className="shrink-0 text-slate-400" size={16} />
          <input
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="게임명 검색"
            value={keyword}
          />
        </label>
      )}

      <div className="mt-4 grid max-h-[520px] gap-3 overflow-y-auto pr-1">
        {filteredPerformance.length ? filteredPerformance.map((group) => {
          const logo = getGameLogo(group.game);
          const preferredResult = group.byResolution[quote.input.resolution] ?? group.results[0];
          return (
            <div className="rounded-xl border border-line bg-panel p-3" key={group.game}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${logo.tone} text-[11px] font-black text-white shadow-sm`}>
                    {logo.initials}
                  </span>
                  <div className="min-w-0">
                    <strong className="safe-break block">{group.game}</strong>
                    {preferredResult?.bestQuality && (
                      <span className="text-[11px] font-bold text-slate-500">권장 옵션 {preferredResult.bestQuality}</span>
                    )}
                  </div>
                </div>
                {preferredResult && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-brand">{preferredResult.grade}</span>
                )}
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {(['FHD', 'QHD', '4K'] as Resolution[]).map((resolution) => {
                  const item = group.byResolution[resolution];
                  const isTarget = resolution === quote.input.resolution;
                  return (
                    <div
                      className={`rounded-xl border px-3 py-2 text-xs transition ${
                        item
                          ? isTarget
                            ? 'border-brand bg-white text-brand shadow-sm'
                            : 'border-line bg-white text-slate-700'
                          : 'border-dashed border-line bg-slate-50 text-slate-400'
                      }`}
                      key={resolution}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black">{resolution}</span>
                        {isTarget && <span className="rounded-full bg-teal-50 px-1.5 py-0.5 text-[10px] font-black">선택</span>}
                      </div>
                      {item ? (
                        <>
                          <div className="mt-1 text-sm font-black">{item.fpsMin}~{item.fpsMax} FPS</div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1 font-bold text-slate-500">
                            <span>{item.grade}</span>
                            {item.isResolutionAdjusted && <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-black text-amber-700">DB 기반 보정</span>}
                          </div>
                        </>
                      ) : (
                        <div className="mt-1 font-bold">데이터 없음</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }) : (
          <div className="rounded-xl border border-dashed border-line bg-panel p-4 text-sm font-bold text-slate-500">
            {quote.performance.length ? '검색 조건에 맞는 게임이 없습니다.' : '현재 CPU/GPU 조합에 연결된 실제 벤치마크 DB가 없습니다. 더미 성능은 표시하지 않습니다.'}
          </div>
        )}
      </div>
    </PanelCard>
  );
}

type PerformanceGroup = {
  game: string;
  results: PerformanceResult[];
  byResolution: Partial<Record<Resolution, PerformanceResult>>;
};

function groupPerformanceByGame(results: PerformanceResult[]): PerformanceGroup[] {
  const groupMap = new Map<string, PerformanceGroup>();
  results.forEach((result) => {
    const group = groupMap.get(result.game) ?? { game: result.game, results: [], byResolution: {} };
    group.results.push(result);
    group.byResolution[result.resolution] = result;
    groupMap.set(result.game, group);
  });
  return [...groupMap.values()];
}

export function QuoteCompatibilityPanel({ quote, compact = false }: { quote: Quote; compact?: boolean }) {
  return (
    <PanelCard>
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-brand" size={20} />
        <h2 className="text-lg font-black">호환성 체크</h2>
      </div>
      <div className="mt-4 grid gap-2">
        {quote.compatibility.slice(0, compact ? 4 : undefined).map((item, index) => (
          <div className={`flex gap-2 rounded-xl p-2 text-sm ${compatibilityClass(item)}`} key={`${item}-${index}`}>
            <CompatibilityIcon item={item} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}

export function QuotePricePanel({ quote }: { quote: Quote }) {
  return (
    <PanelCard className="bg-ink text-white">
      <PriceLine label="부품 합계" value={quote.subtotal} />
      <PriceLine label="조립비" value={quote.assemblyFee} />
      <PriceLine label="배송비" value={quote.shippingFee} />
      <PriceLine label="윈도우" value={quote.windowsFee} />
      <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
        <span className="font-bold">최종 금액</span>
        <strong className="text-2xl text-teal-200">{quote.total.toLocaleString()}원</strong>
      </div>
    </PanelCard>
  );
}

export function QuoteSummary({ quote, compact = false, onRequestReplacePart, onRemovePart }: { quote: Quote; compact?: boolean } & QuoteEditActions) {
  return (
    <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <QuotePartsPanel onRemovePart={onRemovePart} onRequestReplacePart={onRequestReplacePart} quote={quote} />
      <aside className="grid min-w-0 content-start gap-5">
        <QuoteSidePanel compact={compact} quote={quote} />
        <QuotePricePanel quote={quote} />
      </aside>
    </section>
  );
}

function CompatibilityIcon({ item }: { item: string }) {
  if (item.startsWith('실패:')) return <AlertTriangle className="mt-0.5 shrink-0 text-red-600" size={16} />;
  if (item.startsWith('주의:')) return <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={16} />;
  if (item.startsWith('확인필요:')) return <HelpCircle className="mt-0.5 shrink-0 text-slate-500" size={16} />;
  return <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={16} />;
}

function compatibilityClass(item: string) {
  if (item.startsWith('실패:')) return 'bg-red-50 text-red-900';
  if (item.startsWith('주의:')) return 'bg-amber-50 text-amber-900';
  if (item.startsWith('확인필요:')) return 'bg-slate-100 text-slate-700';
  return 'text-slate-700';
}

function PriceLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-slate-300">{label}</span>
      <span className="font-bold">{value.toLocaleString()}원</span>
    </div>
  );
}
