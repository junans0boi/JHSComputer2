import type { BenchmarkSelectorOptions } from '@/lib/server-benchmarks';

export function BenchmarkSelector({ options, selectedCpu, selectedGpu }: {
  options: BenchmarkSelectorOptions;
  selectedCpu?: string;
  selectedGpu?: string;
}) {
  return (
    <form action="/benchmarks" className="grid min-w-0 gap-3 rounded-2xl border border-line bg-slate-50 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end" method="get">
      <label className="grid min-w-0 gap-1 text-xs font-black text-slate-600">
        CPU 고르기
        <select className="min-w-0 rounded-xl border border-line bg-white px-3 py-3 text-sm font-black text-slate-950 outline-none focus:border-brand" defaultValue={selectedCpu ?? ''} name="cpu">
          <option value="">CPU를 선택하세요</option>
          {options.cpus.map((option) => <option key={option.value} value={option.value}>{option.label} · {option.comboCount}개 조합</option>)}
        </select>
      </label>
      <label className="grid min-w-0 gap-1 text-xs font-black text-slate-600">
        GPU 고르기
        <select className="min-w-0 rounded-xl border border-line bg-white px-3 py-3 text-sm font-black text-slate-950 outline-none focus:border-brand" defaultValue={selectedGpu ?? ''} name="gpu">
          <option value="">GPU를 선택하세요</option>
          {options.gpus.map((option) => <option key={option.value} value={option.value}>{option.label} · {option.comboCount}개 조합</option>)}
        </select>
      </label>
      <button className="rounded-xl bg-brand px-5 py-3 text-sm font-black text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50" disabled={!options.cpus.length || !options.gpus.length} type="submit">
        제출
      </button>
    </form>
  );
}
