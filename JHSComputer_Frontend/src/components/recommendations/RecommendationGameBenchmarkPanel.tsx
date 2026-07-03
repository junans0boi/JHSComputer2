'use client';

import { Gamepad2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PanelCard } from '@/components/ui/PanelCard';
import type { RecommendationPostGame } from '@/lib/recommendation-posts';

const resolutionOrder = ['FHD', 'QHD', '4K', 'UHD'];

export function RecommendationGameBenchmarkPanel({ games }: { games: RecommendationPostGame[] }) {
  const [keyword, setKeyword] = useState('');
  const [resolution, setResolution] = useState<'ALL' | 'FHD' | 'QHD' | '4K'>('ALL');
  const grouped = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return groupGames(games).filter((row) => {
      const matchesKeyword = !normalizedKeyword || row.gameName.toLowerCase().includes(normalizedKeyword);
      const matchesResolution = resolution === 'ALL' || Boolean(row.byResolution[resolution]);
      return matchesKeyword && matchesResolution;
    });
  }, [games, keyword, resolution]);
  const totalGames = useMemo(() => groupGames(games).length, [games]);

  return (
    <PanelCard>
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <Gamepad2 className="text-accent" size={20} />
          <div>
            <h2 className="text-lg font-black">게임 성능</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              실제 벤치마크 DB 기준 · {grouped.length.toLocaleString()} / {totalGames.toLocaleString()}개 게임
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
        <label className="flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-teal-100">
          <Search className="shrink-0 text-slate-400" size={17} />
          <input
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="게임명 검색 예: 배그, GTA, 롤"
            value={keyword}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'FHD', 'QHD', '4K'] as const).map((item) => (
            <button
              className={`h-11 rounded-xl border px-4 text-sm font-black transition ${
                resolution === item ? 'border-brand bg-teal-50 text-brand' : 'border-line bg-white text-slate-600 hover:border-brand hover:text-brand'
              }`}
              key={item}
              onClick={() => setResolution(item)}
              type="button"
            >
              {item === 'ALL' ? '전체' : item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 max-h-[640px] overflow-auto rounded-xl border border-line">
        {grouped.length ? (
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-panel text-slate-600">
              <tr>
                <th className="px-3 py-3">게임</th>
                <th className="w-44 px-3 py-3">FHD</th>
                <th className="w-44 px-3 py-3">QHD</th>
                <th className="w-44 px-3 py-3">4K</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map((row) => (
                <tr className="border-t border-line" key={row.gameName}>
                  <td className="px-3 py-3 font-black text-slate-900">{row.gameName}</td>
                  <td className="px-3 py-3">{renderCell(row.byResolution.FHD)}</td>
                  <td className="px-3 py-3">{renderCell(row.byResolution.QHD)}</td>
                  <td className="px-3 py-3">{renderCell(row.byResolution['4K'] ?? row.byResolution.UHD)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid min-h-40 place-items-center p-8 text-center text-sm font-bold text-slate-500">
            검색 조건에 맞는 게임 성능 데이터가 없습니다.
          </div>
        )}
      </div>
    </PanelCard>
  );
}

function renderCell(game?: RecommendationPostGame) {
  if (!game) return <span className="text-xs font-bold text-slate-400">데이터 없음</span>;
  return (
    <div>
      <div className="font-black text-brand">{Number(game.fpsMin ?? 0)}~{Number(game.fpsMax ?? 0)} FPS</div>
      <div className="mt-0.5 text-xs font-bold text-slate-500">
        {qualityLabel(game.qualityPreset)} · {gradeLabel(game.comfortGrade)}
      </div>
    </div>
  );
}

function groupGames(games: RecommendationPostGame[]) {
  const map = new Map<string, { gameName: string; byResolution: Record<string, RecommendationPostGame> }>();
  for (const game of games) {
    const gameName = game.gameName;
    if (!map.has(gameName)) map.set(gameName, { gameName, byResolution: {} });
    const normalizedResolution = game.resolution === 'UHD' ? '4K' : game.resolution;
    map.get(gameName)!.byResolution[normalizedResolution] = game;
  }
  return [...map.values()].sort((a, b) => {
    const aScore = bestFps(a.byResolution);
    const bScore = bestFps(b.byResolution);
    return bScore - aScore || a.gameName.localeCompare(b.gameName, 'ko');
  });
}

function bestFps(values: Record<string, RecommendationPostGame>) {
  return Math.max(...resolutionOrder.map((resolution) => Number(values[resolution]?.fpsMax ?? 0)));
}

function qualityLabel(value?: string | null) {
  const labels: Record<string, string> = {
    ULTRA: '최상옵',
    HIGH: '높음',
    MEDIUM: '중간',
    LOW: '낮음',
    PERFORMANCE: '성능옵션',
  };
  return value ? labels[value] ?? value : '옵션 정보';
}

function gradeLabel(value?: string | null) {
  const labels: Record<string, string> = {
    EXCELLENT: '매우 쾌적',
    VERY_SMOOTH: '매우 쾌적',
    GOOD: '쾌적',
    SMOOTH: '쾌적',
    PLAYABLE: '플레이 가능',
  };
  return value ? labels[value] ?? value : '등급 정보';
}
