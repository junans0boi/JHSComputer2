import { AppShell } from '@/components/AppShell';
import { BenchmarkComboList } from '@/components/benchmarks/BenchmarkComboList';
import { BenchmarkGameTable } from '@/components/benchmarks/BenchmarkGameTable';
import { BenchmarkSummaryCards } from '@/components/benchmarks/BenchmarkSummaryCards';
import { loadBenchmarkCombos, loadBenchmarkSummary, loadComboGameResults } from '@/lib/server-benchmarks';

export default async function BenchmarksPage(props: { searchParams: Promise<{ comboKey?: string }> }) {
  const searchParams = await props.searchParams;
  const summary = await loadBenchmarkSummary();
  const combos = await loadBenchmarkCombos(12);
  const selectedCombo = searchParams.comboKey ?? combos.items[0]?.comboKey;
  const games = selectedCombo ? await loadComboGameResults(selectedCombo, 999) : { items: [], total: 0 };

  return (
    <AppShell>
      <section className="space-y-5">
        <div className="rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-6">
          <p className="text-sm font-black text-brand">JHS 게임 성능 데이터</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">CPU + GPU 조합별 게임 체감 성능</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            수집된 견적 데이터를 조합 단위로 묶어 고객이 이해하기 쉬운 FPS 범위, 추천 옵션, 체감 등급으로 가공합니다.
          </p>
          <div className="mt-5">
            <BenchmarkSummaryCards summary={summary} />
          </div>
        </div>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(300px,420px)_minmax(0,1fr)]">
          <BenchmarkComboList combos={combos.items} total={combos.total} />
          <BenchmarkGameTable comboKey={selectedCombo} games={games.items} />
        </div>
      </section>
    </AppShell>
  );
}
