'use client';

import { AlertTriangle, CheckCircle2, Cpu, Gauge, HelpCircle, ShieldCheck } from 'lucide-react';
import type { Quote } from '@/lib/v1-types';

export function QuoteSummary({ quote, compact = false }: { quote: Quote; compact?: boolean }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h2 className="text-xl font-black">추천 견적</h2>
            <p className="mt-1 text-sm text-slate-600">
              {quote.input.purpose} · {quote.input.resolution} · {quote.input.priority}
            </p>
          </div>
          <div className="rounded-xl bg-teal-50 p-3 text-brand">
            <Cpu />
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-panel text-slate-600">
              <tr>
                <th className="px-3 py-3">구분</th>
                <th className="px-3 py-3">부품</th>
                <th className="hidden px-3 py-3 md:table-cell">메모</th>
                <th className="px-3 py-3 text-right">가격</th>
              </tr>
            </thead>
            <tbody>
              {quote.parts.map((part) => (
                <tr className="border-t border-line" key={part.category}>
                  <td className="px-3 py-3 font-black text-brand">{part.category}</td>
                  <td className="px-3 py-3">
                    <div className="font-bold">{part.name}</div>
                    <div className="text-xs text-slate-500">{part.supplier}</div>
                  </td>
                  <td className="hidden px-3 py-3 text-slate-600 md:table-cell">{part.memo}</td>
                  <td className="px-3 py-3 text-right font-bold">{part.price.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="grid gap-5">
        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <div className="flex items-center gap-2">
            <Gauge className="text-accent" size={20} />
            <h2 className="text-lg font-black">게임 성능 예상</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {quote.performance.map((result) => (
              <div className="rounded-xl border border-line bg-panel p-3" key={result.game}>
                <div className="flex items-center justify-between">
                  <strong>{result.game}</strong>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-brand">{result.grade}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {result.resolution} 기준 약 {result.fpsMin}~{result.fpsMax} FPS
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-brand" size={20} />
            <h2 className="text-lg font-black">호환성 체크</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {quote.compatibility.slice(0, compact ? 4 : undefined).map((item) => (
              <div className={`flex gap-2 rounded-xl p-2 text-sm ${compatibilityClass(item)}`} key={item}>
                <CompatibilityIcon item={item} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-ink p-4 text-white shadow-soft md:p-5">
          <PriceLine label="부품 합계" value={quote.subtotal} />
          <PriceLine label="조립비" value={quote.assemblyFee} />
          <PriceLine label="배송비" value={quote.shippingFee} />
          <PriceLine label="윈도우" value={quote.windowsFee} />
          <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
            <span className="font-bold">최종 금액</span>
            <strong className="text-2xl text-teal-200">{quote.total.toLocaleString()}원</strong>
          </div>
        </div>
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
