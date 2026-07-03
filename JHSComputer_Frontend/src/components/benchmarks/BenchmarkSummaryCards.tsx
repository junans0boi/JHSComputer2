import type { BenchmarkSummary } from '@/lib/server-benchmarks';

export function BenchmarkSummaryCards({ summary }: { summary: BenchmarkSummary }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard label="견적 샘플" value={summary.buildCount} />
      <StatCard label="전체 조합" value={summary.totalComboCount} />
      <StatCard label="FPS 조합" value={summary.fpsComboCount} />
      <StatCard label="게임" value={summary.gameCount} />
      <StatCard label="FPS 원본" value={summary.fpsResultCount} />
      <StatCard label="가공 결과" value={summary.comboGameResultCount} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-slate-50 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{Number(value).toLocaleString()}</p>
    </div>
  );
}
