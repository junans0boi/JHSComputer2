import type { BenchmarkCombo } from '@/lib/server-benchmarks';
import Link from 'next/link';

export function BenchmarkComboList({ combos, total }: { combos: BenchmarkCombo[]; total: number }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black">수집된 조합</h2>
        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{total}개 표시</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {combos.map((combo) => (
          <Link href={`/benchmarks?comboKey=${encodeURIComponent(combo.comboKey)}`} className="block rounded-2xl border border-line p-4 transition hover:border-brand/40 hover:bg-teal-50/30" key={combo.comboKey}>
            <p className="text-sm font-black text-slate-900">
              {combo.cpuModel} + {combo.gpuModel}
            </p>
            <p className="mt-1 break-all text-xs text-slate-500">{combo.comboKey}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-teal-50 px-2 py-1 text-brand">샘플 {combo.buildSampleCount ?? combo.sampleCount ?? 0}</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">게임 {combo.gameCount ?? 0}</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">결과 {combo.resultCount ?? 0}</span>
            </div>
          </Link>
        ))}
        {combos.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">아직 표시할 조합이 없습니다.</p>}
      </div>
    </div>
  );
}
