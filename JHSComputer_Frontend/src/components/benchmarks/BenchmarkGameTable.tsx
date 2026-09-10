import type { BenchmarkGameResult } from '@/lib/server-benchmarks';
import { getGameLogo } from '@/lib/game-assets';
import { comfortGradeLabels, qualityLabels, resolutionLabel } from './benchmark-labels';

export function BenchmarkGameTable({ comboName, hasFpsEvidence, games }: { comboName?: string; hasFpsEvidence?: boolean; games: BenchmarkGameResult[] }) {
  const groupedGames = games.reduce<Record<string, BenchmarkGameResult[]>>((acc, item) => {
    acc[item.gameName] = [...(acc[item.gameName] ?? []), item];
    return acc;
  }, {});

  return (
    <div className="rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-5">
      <div>
        <p className="text-sm font-bold text-slate-500">대표 조합</p>
        <h2 className="mt-1 break-all text-xl font-black">{comboName ?? '데이터 없음'}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {hasFpsEvidence ? '수집된 성능 근거를 게임별 예상 범위와 체감 등급으로 정리했습니다.' : '이 조합은 수집되었지만 아직 연결된 FPS 근거가 없습니다.'}
        </p>
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
                      {formatFps(item)}
                    </div>
                    <div className="mt-1 text-xs font-bold text-slate-500">
                      옵션 {qualityLabels[item.bestQuality] ?? item.bestQuality}
                    </div>
                    <div className="mt-1 text-[11px] font-bold text-slate-400">
                      근거 {evidenceLabel(item.evidenceType)} · 표본 {item.sampleCount ?? 0}회
                    </div>
                    {item.evidenceNote && (
                      <div className="mt-2 text-[11px] leading-4 text-slate-500">{item.evidenceNote}</div>
                    )}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
        {games.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm font-bold text-slate-500">
            {hasFpsEvidence ? '아직 표시할 게임 성능 데이터가 없습니다.' : '이 조합의 성능 데이터는 준비 중입니다. 수집 조합 자체는 왼쪽 목록에서 확인할 수 있습니다.'}
          </div>
        )}
      </div>
    </div>
  );
}

function formatFps(item: BenchmarkGameResult) {
  if (!item.displayFpsMin || !item.displayFpsMax) {
    return item.rawFpsAvg ? `${Math.round(Number(item.rawFpsAvg))} FPS` : '-';
  }
  if (item.displayFpsMin === item.displayFpsMax) return `${item.displayFpsMin} FPS`;
  return `${item.displayFpsMin}~${item.displayFpsMax} FPS`;
}

function evidenceLabel(type?: BenchmarkGameResult['evidenceType']) {
  if (type === 'MEASURED') return '측정 집계값';
  if (type === 'SOURCE_REPORTED') return '출처 보고값';
  if (type === 'DERIVED') return '추정값';
  return '없음';
}
