import type { BenchmarkGameResult } from '@/lib/server-benchmarks';
import { getGameLogo } from '@/lib/game-assets';
import { comfortGradeLabels, qualityLabels, resolutionLabel } from './benchmark-labels';

export function BenchmarkGameTable({ comboKey, games }: { comboKey?: string; games: BenchmarkGameResult[] }) {
  const groupedGames = games.reduce<Record<string, BenchmarkGameResult[]>>((acc, item) => {
    acc[item.gameName] = [...(acc[item.gameName] ?? []), item];
    return acc;
  }, {});

  return (
    <div className="rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-5">
      <div>
        <p className="text-sm font-bold text-slate-500">대표 조합</p>
        <h2 className="mt-1 break-all text-xl font-black">{comboKey ?? '데이터 없음'}</h2>
        <p className="mt-2 text-sm text-slate-600">고객 화면에서는 원본 FPS 대신 예상 범위와 체감 등급 중심으로 보여줍니다.</p>
      </div>
      <div className="mt-5 grid gap-3">
        {Object.entries(groupedGames).map(([gameName, results]) => {
          const logo = getGameLogo(gameName);
          return (
            <article className="rounded-2xl border border-line bg-slate-50 p-4" key={gameName}>
              <div className="flex items-center gap-3">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${logo.tone} text-xs font-black text-white shadow-sm`}>
                  {logo.initials}
                </span>
                <div>
                  <h3 className="safe-break font-black text-slate-950">{gameName}</h3>
                  <p className="text-xs font-bold text-slate-500">해상도별 추천 옵션과 예상 FPS</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-3">
                {results.map((item) => (
                  <div className="rounded-xl border border-line bg-white p-3" key={`${item.gameId}-${item.resolution}`}>
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-sm">{resolutionLabel(item.resolution)}</strong>
                      <span className="rounded-full bg-teal-50 px-2 py-1 text-[11px] font-black text-brand">
                        {comfortGradeLabels[item.comfortGrade] ?? item.comfortGrade}
                      </span>
                    </div>
                    <div className="mt-2 text-lg font-black text-slate-950">
                      {item.displayFpsMin && item.displayFpsMax ? `${item.displayFpsMin}~${item.displayFpsMax} FPS` : '-'}
                    </div>
                    <div className="mt-1 text-xs font-bold text-slate-500">
                      옵션 {qualityLabels[item.bestQuality] ?? item.bestQuality}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
        {games.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm font-bold text-slate-500">
            아직 표시할 게임 성능 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
