import { AppShell } from '@/components/AppShell';
import { BenchmarkGameTable } from '@/components/benchmarks/BenchmarkGameTable';
import { BenchmarkSelector } from '@/components/benchmarks/BenchmarkSelector';
import { BenchmarkScoreComparison } from '@/components/benchmarks/BenchmarkScoreComparison';
import { BenchmarkSummaryCards } from '@/components/benchmarks/BenchmarkSummaryCards';
import { loadBenchmarkSelectorOptions, loadBenchmarkSummary, loadComboGameResults, loadComponentBenchmarkComparison } from '@/lib/server-benchmarks';

export default async function BenchmarksPage(props: { searchParams: Promise<{ comboKey?: string; cpu?: string; gpu?: string }> }) {
  const searchParams = await props.searchParams;
  const [summary, selectorOptions] = await Promise.all([
    loadBenchmarkSummary(),
    loadBenchmarkSelectorOptions(),
  ]);
  const selectedComboInfo = selectorOptions.combos.find((combo) => combo.publicComboRef === searchParams.comboKey)
    ?? selectorOptions.combos.find((combo) => combo.publicCpuModel === searchParams.cpu && combo.publicGpuModel === searchParams.gpu)
    ?? (!searchParams.cpu && !searchParams.gpu ? selectorOptions.combos[0] : undefined);
  const selectedCombo = selectedComboInfo?.publicComboRef;
  const [games, cpuBenchmarks, gpuBenchmarks] = await Promise.all([
    selectedCombo ? loadComboGameResults(selectedCombo, 999) : Promise.resolve({ items: [], total: 0 }),
    loadComponentBenchmarkComparison([selectedComboInfo?.cpuPartId ?? 0]),
    loadComponentBenchmarkComparison([selectedComboInfo?.gpuPartId ?? 0]),
  ]);

  return (
    <AppShell>
      <section className="space-y-5">
        <div className="rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-6">
          <p className="text-sm font-black text-brand">JHS 게임 성능 데이터</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">CPU + GPU 조합별 게임 체감 성능</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            실제 FPS 원본과 부품 벤치마크를 CPU·GPU 조합별로 확인합니다.
          </p>
          <div className="mt-5">
            <BenchmarkSummaryCards summary={summary} />
          </div>
        </div>

        <div className="grid min-w-0 gap-5">
          <section className="min-w-0 rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-5">
            <div className="mb-4">
              <p className="text-sm font-black text-brand">FPS 조합 선택</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">CPU와 GPU를 골라 성능 확인</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">게임 FPS 원본이 있는 CPU·GPU 조합만 선택할 수 있습니다.</p>
            </div>
            <BenchmarkSelector options={selectorOptions} selectedCpu={searchParams.cpu ?? selectedComboInfo?.publicCpuModel} selectedGpu={searchParams.gpu ?? selectedComboInfo?.publicGpuModel} />
          </section>
          <BenchmarkGameTable comboName={selectedComboInfo?.publicComboName} hasFpsEvidence={Boolean(selectedComboInfo)} games={games.items} />
        </div>
        {selectedComboInfo?.cpuPartId && (
          <section className="grid min-w-0 gap-5 lg:grid-cols-2">
            <BenchmarkScoreComparison data={cpuBenchmarks} title="Cinebench 2024 · 싱글코어" testName="Cinebench 2024" metric="SINGLE_CORE" compact />
            <BenchmarkScoreComparison data={cpuBenchmarks} title="Cinebench 2024 · 멀티코어" testName="Cinebench 2024" metric="MULTI_CORE" compact />
          </section>
        )}
        {selectedComboInfo?.gpuPartId && <BenchmarkScoreComparison data={gpuBenchmarks} title="선택 GPU 벤치마크 비교" />}
      </section>
    </AppShell>
  );
}
