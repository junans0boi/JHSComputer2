import type { ComponentBenchmarkComparison, ComponentBenchmarkDeviceType, ComponentBenchmarkScoreItem } from '@/lib/component-benchmarks';

const DEVICE_LABELS: Record<ComponentBenchmarkDeviceType, string> = { CPU: 'CPU 점수', GPU: 'GPU 점수' };

export function BenchmarkScoreComparison({ data, title = '부품 벤치마크 비교', testName, metric, compact = false }: { data: ComponentBenchmarkComparison; title?: string; testName?: string; metric?: string; compact?: boolean }) {
  const filteredItems = data.items.filter((item) => (!testName || item.test.name === testName) && (!metric || item.test.metric === metric));
  const groups = groupScores(filteredItems);
  const devices = (['CPU', 'GPU'] as ComponentBenchmarkDeviceType[]).filter((device) => Boolean(groups.get(device)?.length));

  return (
    <section className="min-w-0 rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-5">
      <div className="min-w-0">
        <p className="text-sm font-black text-brand">동일 테스트·동일 단위만 비교</p>
        <h2 className="mt-1 break-words text-xl font-black text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          출처 보고값과 JHS 직접 측정값을 섞지 않고, 테스트 버전과 점수 지표별로 나누어 보여줍니다.
        </p>
      </div>

      {devices.length ? compact ? (
        <CompactScoreTable data={data} items={filteredItems} />
      ) : (
        <div className="mt-5 grid min-w-0 gap-5">
          {devices.map((device) => (
            <div className="min-w-0" key={device}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h3 className="text-base font-black text-slate-900">{DEVICE_LABELS[device]}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">CPU/GPU 분리</span>
              </div>
              <div className="grid min-w-0 gap-4">
                {groups.get(device)?.map((group) => <BenchmarkScoreGroup data={data} group={group} key={group.key} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-line bg-slate-50 p-6 text-sm font-bold leading-6 text-slate-500">
          {testName || metric ? '선택한 테스트 조건의 점수가 아직 없습니다.' : data.reason ?? '이 부품과 일치하는 벤치마크 데이터가 아직 없습니다.'}
        </div>
      )}
    </section>
  );
}

function CompactScoreTable({ data, items }: { data: ComponentBenchmarkComparison; items: ComponentBenchmarkScoreItem[] }) {
  return (
    <div className="mt-5 min-w-0 overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[620px] border-collapse text-left">
        <thead className="bg-slate-50 text-xs font-black text-slate-600">
          <tr>
            <th className="px-3 py-3" scope="col">부품</th>
            <th className="px-3 py-3" scope="col">점수</th>
            <th className="px-3 py-3" scope="col">선택 부품 대비</th>
            <th className="px-3 py-3" scope="col">근거</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((item) => {
            const isSelected = item.partId === data.selectedPartId;
            return (
              <tr className="align-top" key={`${item.partId}-${item.test.id}-${item.evidenceType}`}>
                <th className="safe-break px-3 py-3 text-sm font-black text-slate-950" scope="row">
                  {isSelected && <span className="mr-2 inline-block rounded-full bg-teal-50 px-2 py-1 text-[10px] text-brand">선택</span>}
                  {item.partName}
                </th>
                <td className="whitespace-nowrap px-3 py-3 text-sm font-black text-slate-950">{formatScore(item.score)} {item.test.unit}</td>
                <td className={`whitespace-nowrap px-3 py-3 text-xs font-black ${item.deltaFromSelected == null ? 'text-slate-400' : item.deltaFromSelected >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {item.deltaFromSelected == null ? '기준' : formatDelta(item.deltaFromSelected, item.deltaPercentFromSelected)}
                </td>
                <td className="px-3 py-3 text-xs font-bold text-slate-500">{evidenceLabel(item.evidenceType)} · {item.observationCount}회</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BenchmarkScoreGroup({ data, group }: { data: ComponentBenchmarkComparison; group: ScoreGroup }) {
  const maxScore = Math.max(...group.items.map((item) => item.score), 1);
  const first = group.items[0];
  const selectedPartId = data.selectedPartId;

  return (
    <article className="min-w-0 rounded-2xl border border-line bg-slate-50 p-3 sm:p-4">
      <div className="min-w-0">
        <h4 className="break-words text-sm font-black text-slate-950">{first.test.name} · {first.test.metric}</h4>
        <p className="mt-1 break-words text-xs font-bold text-slate-500">버전 {first.test.version} · 단위 {first.test.unit} · {evidenceLabel(first.evidenceType)}</p>
      </div>
      <div className="mt-4 grid min-w-0 gap-3">
        {group.items.map((item) => {
          const isSelected = item.partId === selectedPartId;
          const width = Math.max(4, Math.round((item.score / maxScore) * 100));
          return (
            <div className="min-w-0 rounded-xl border border-line bg-white p-3" key={`${item.partId}-${item.evidenceType}`}>
              <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {isSelected && <span className="shrink-0 rounded-full bg-teal-50 px-2 py-1 text-[10px] font-black text-brand">선택 부품</span>}
                    <strong className="safe-break min-w-0 text-sm font-black text-slate-900">{item.partName}</strong>
                  </div>
                  <p className="mt-1 break-words text-[11px] font-bold text-slate-500">
                    {item.manufacturer ?? '제조사 정보 없음'} · 표본 {item.observationCount}회 · {evidenceLabel(item.evidenceType)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <strong className="text-base font-black text-slate-950">{formatScore(item.score)} {item.test.unit}</strong>
                  {item.deltaFromSelected !== undefined && (
                    <p className={`mt-1 text-[11px] font-black ${item.deltaFromSelected >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {formatDelta(item.deltaFromSelected, item.deltaPercentFromSelected)}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100" aria-label={`${item.partName} 점수 막대`}>
                <div className={`h-full rounded-full ${isSelected ? 'bg-brand' : 'bg-slate-400'}`} style={{ width: `${width}%` }} />
              </div>
              {item.comparisonUnavailableReason && (
                <p className="mt-2 break-words text-[11px] font-bold leading-4 text-slate-500">{item.comparisonUnavailableReason}</p>
              )}
              <details className="mt-3 min-w-0 text-[11px] text-slate-500">
                <summary className="cursor-pointer font-black text-slate-600">출처·조건 보기</summary>
                <div className="mt-2 grid min-w-0 gap-1 leading-4">
                  {item.sourceNames.map((source, index) => <span className="break-words" key={`${source}-${index}`}>{source}</span>)}
                  {item.sourceUrls.map((url) => <a className="break-all text-brand underline" href={url} key={url} rel="noreferrer" target="_blank">{url}</a>)}
                  {item.conditionSamples?.length ? (
                    <div className="grid min-w-0 gap-1">
                      <span className="font-black text-slate-600">조건 표본 {item.conditionSamples.length}건</span>
                      {item.conditionSamples.map((conditions, index) => (
                        <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-2" key={index}>{JSON.stringify(conditions, null, 2)}</pre>
                      ))}
                    </div>
                  ) : item.conditions ? <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-2">{JSON.stringify(item.conditions, null, 2)}</pre> : null}
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </article>
  );
}

type ScoreGroup = { key: string; items: ComponentBenchmarkScoreItem[] };

function groupScores(items: ComponentBenchmarkScoreItem[]) {
  const groups = new Map<string, ScoreGroup>();
  for (const item of items) {
    const key = `${item.deviceType}:${item.test.id}:${item.test.comparableGroupKey}:${item.evidenceType}`;
    const group = groups.get(key) ?? { key, items: [] };
    group.items.push(item);
    groups.set(key, group);
  }
  return new Map<ComponentBenchmarkDeviceType, ScoreGroup[]>([
    ['CPU', [...groups.values()].filter((group) => group.items[0]?.deviceType === 'CPU')],
    ['GPU', [...groups.values()].filter((group) => group.items[0]?.deviceType === 'GPU')],
  ]);
}

function evidenceLabel(type: ComponentBenchmarkScoreItem['evidenceType']) {
  return type === 'MEASURED' ? 'JHS 직접 측정' : '출처 보고값';
}

function formatScore(score: number) {
  return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 }).format(score);
}

function formatDelta(delta: number, percent?: number | null) {
  const sign = delta > 0 ? '+' : '';
  return percent == null ? `${sign}${formatScore(delta)}` : `${sign}${formatScore(delta)} (${percent > 0 ? '+' : ''}${percent.toFixed(2)}%)`;
}
