import type { BenchmarkGameResult } from '@/lib/server-benchmarks';
import { getGameLogo } from '@/lib/game-assets';
import { comfortGradeLabels, qualityLabels } from './benchmark-labels';

const RESOLUTIONS: BenchmarkGameResult['resolution'][] = ['FHD', 'QHD', 'UHD'];

export function BenchmarkGameTable({ comboName, hasFpsEvidence, games }: { comboName?: string; hasFpsEvidence?: boolean; games: BenchmarkGameResult[] }) {
  const rows = groupGames(games);

  return (
    <section className="min-w-0 rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-5">
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-500">선택한 FPS 근거 조합</p>
        <h2 className="mt-1 safe-break text-xl font-black text-slate-950">{comboName ?? 'CPU와 GPU 조합을 선택하세요'}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {hasFpsEvidence ? '게임과 옵션별로 실제 확인된 해상도 FPS만 표시합니다. 빈 칸은 해당 해상도 원본이 없다는 뜻입니다.' : '선택한 CPU·GPU 조합의 해상도별 FPS 근거가 없습니다. 다른 FPS 근거 조합을 선택해 주세요.'}
        </p>
      </div>

      {rows.length ? (
        <div className="mt-5 min-w-0 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-slate-50 text-xs font-black text-slate-600">
              <tr>
                <th className="w-16 px-3 py-3" scope="col">로고</th>
                <th className="min-w-48 px-3 py-3" scope="col">게임명</th>
                <th className="min-w-28 px-3 py-3" scope="col">옵션</th>
                <th className="min-w-36 px-3 py-3" scope="col">FHD</th>
                <th className="min-w-36 px-3 py-3" scope="col">QHD</th>
                <th className="min-w-36 px-3 py-3" scope="col">4K</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => {
                const logo = getGameLogo(row.gameName);
                return (
                  <tr className="align-top" key={row.key}>
                    <td className="px-3 py-3">
                      <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${logo.tone} text-[10px] font-black text-white shadow-sm`} title={row.gameName}>{logo.initials}</span>
                    </td>
                    <th className="safe-break px-3 py-3 text-sm font-black text-slate-950" scope="row">{row.gameName}</th>
                    <td className="safe-break px-3 py-3 text-xs font-bold text-slate-600">{formatOption(row.quality)}</td>
                    {RESOLUTIONS.map((resolution) => <td className="px-3 py-3" key={resolution}>{renderCell(row.cells[resolution])}</td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-line bg-slate-50 p-8 text-center text-sm font-bold leading-6 text-slate-500">
          {hasFpsEvidence ? '선택한 조합에 연결된 게임별 FPS 원본이 아직 없습니다.' : 'FPS 근거가 있는 CPU·GPU 조합을 선택하면 게임 표가 표시됩니다.'}
        </div>
      )}
    </section>
  );
}

type GameRow = {
  key: string;
  gameName: string;
  quality: string;
  cells: Partial<Record<BenchmarkGameResult['resolution'], BenchmarkGameResult>>;
};

function groupGames(games: BenchmarkGameResult[]): GameRow[] {
  const grouped = new Map<string, GameRow>();
  for (const game of games) {
    const quality = game.optionPreset || game.bestQuality || 'UNKNOWN';
    const key = `${game.gameId}:${quality}:${game.sourceConditionKey ?? 'UNKNOWN'}`;
    const row = grouped.get(key) ?? { key, gameName: game.gameName, quality, cells: {} };
    row.cells[game.resolution] = game;
    grouped.set(key, row);
  }
  return [...grouped.values()].sort((left, right) => left.gameName.localeCompare(right.gameName, 'ko') || left.quality.localeCompare(right.quality));
}

function renderCell(item?: BenchmarkGameResult) {
  if (!item) return <span className="text-sm font-bold text-slate-300">—</span>;
  return (
    <div className="min-w-0">
      <strong className="block whitespace-nowrap text-sm font-black text-slate-950">{formatFps(item)} <span className="text-xs text-brand">({comfortGradeLabels[item.comfortGrade] ?? item.comfortGrade})</span></strong>
      <span className="mt-1 block text-[11px] font-bold text-slate-400">{evidenceLabel(item.evidenceType)} · {item.sampleCount ?? 0}회</span>
      {item.evidenceNote && <span className="mt-1 block safe-break text-[11px] leading-4 text-slate-500">{item.evidenceNote}</span>}
      {(item.sourceNames || item.testSystem) && <span className="mt-1 block safe-break text-[10px] leading-4 text-slate-400">{item.sourceNames ?? '원본'}{item.testSystem ? ` · 테스트 ${item.testSystem}` : ''}</span>}
      {item.sourceUrl && <a className="mt-1 block break-all text-[10px] font-bold text-brand underline" href={item.sourceUrl} rel="noreferrer" target="_blank">원본 조건 보기</a>}
    </div>
  );
}

function formatFps(item: BenchmarkGameResult) {
  const average = Number(item.rawFpsAvg);
  if (Number.isFinite(average) && average > 0) return `${Math.round(average)} FPS`;
  if (item.displayFpsMin && item.displayFpsMax) {
    return item.displayFpsMin === item.displayFpsMax ? `${item.displayFpsMin} FPS` : `${item.displayFpsMin}~${item.displayFpsMax} FPS`;
  }
  return '—';
}

function evidenceLabel(type?: BenchmarkGameResult['evidenceType']) {
  if (type === 'MEASURED') return '직접 측정';
  if (type === 'SOURCE_REPORTED') return '출처 보고';
  if (type === 'DERIVED') return '파생값';
  return '근거 없음';
}

function formatOption(value: string) {
  const normalized = value.replace(/^\s*[–-]\s*/, '').trim();
  return (qualityLabels[value] ?? normalized) || '옵션 미상';
}
