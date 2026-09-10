'use client';

import { Check, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PanelCard, SectionHeader } from '@/components/ui/PanelCard';
import { windowsOptions } from '@/lib/windows-options';
import type { BudgetInclude, QuoteProfileV2, PreferencePreset, Workload, WorkloadType } from '@/lib/quote-profile';

const workloadOptions: Array<{ type: WorkloadType; label: string; description: string }> = [
  { type: 'GAMING', label: '게임', description: '게임별 성능과 목표 해상도' },
  { type: 'STREAMING', label: '방송', description: '인코딩과 출력 해상도' },
  { type: 'VIDEO_EDITING', label: '영상편집', description: '편집 프로그램과 타임라인' },
  { type: 'AI', label: 'AI', description: '추론·학습 모델 조건' },
  { type: 'OFFICE', label: '사무', description: '문서·브라우저 멀티태스킹' },
  { type: 'DEVELOPMENT', label: '개발', description: '컨테이너·가상 머신' },
];

const softwareOptions = ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Blender'];
const presetWeights: Record<PreferencePreset, QuoteProfileV2['preferenceProfile']> = {
  BALANCED: { preset: 'BALANCED', performance: 35, value: 25, aesthetics: 15, upgradeability: 25 },
  PERFORMANCE: { preset: 'PERFORMANCE', performance: 45, value: 15, aesthetics: 10, upgradeability: 30 },
  VALUE: { preset: 'VALUE', performance: 25, value: 45, aesthetics: 10, upgradeability: 20 },
  AESTHETICS: { preset: 'AESTHETICS', performance: 30, value: 15, aesthetics: 40, upgradeability: 15 },
  UPGRADE: { preset: 'UPGRADE', performance: 30, value: 15, aesthetics: 10, upgradeability: 45 },
};

const workloadPresets: Array<{ label: string; types: Array<{ type: WorkloadType; weight: number }> }> = [
  { label: '게임 중심', types: [{ type: 'GAMING', weight: 100 }] },
  { label: '게임 + 방송', types: [{ type: 'GAMING', weight: 70 }, { type: 'STREAMING', weight: 30 }] },
  { label: '영상 + 방송', types: [{ type: 'VIDEO_EDITING', weight: 70 }, { type: 'STREAMING', weight: 30 }] },
  { label: 'AI + 개발', types: [{ type: 'AI', weight: 60 }, { type: 'DEVELOPMENT', weight: 40 }] },
];

export function QuoteSurveyPanel({
  profile,
  gameOptions,
  loading,
  error,
  onChange,
  onSubmit,
}: {
  profile: QuoteProfileV2;
  gameOptions: string[];
  loading: boolean;
  error: string | null;
  onChange: (profile: QuoteProfileV2) => void;
  onSubmit: () => void;
}) {
  const weightTotal = profile.workloadProfile.workloads.reduce((sum, workload) => sum + workload.weight, 0);
  const gaming = profile.workloadProfile.workloads.find((workload) => workload.type === 'GAMING');
  const games = stringArray(gaming?.details.games);
  const canSubmit = Math.abs(weightTotal - 100) < 0.001 && (!gaming || games.length > 0) && !loading;

  const toggleWorkload = (type: WorkloadType) => {
    const current = profile.workloadProfile.workloads;
    if (current.some((workload) => workload.type === type)) {
      if (current.length === 1) return;
      onChange(withDistributedWeights(profile, current.filter((workload) => workload.type !== type)));
      return;
    }
    onChange(withDistributedWeights(profile, [...current, { type, weight: 0, details: defaultDetails(type) }]));
  };

  const updateWorkload = (type: WorkloadType, update: (workload: Workload) => Workload) => {
    onChange({
      ...profile,
      workloadProfile: {
        workloads: profile.workloadProfile.workloads.map((workload) => workload.type === type ? update(workload) : workload),
      },
    });
  };

  const updateWeight = (type: WorkloadType, weight: number) => {
    const safeWeight = Math.max(0, Math.min(100, Math.round(weight)));
    const others = profile.workloadProfile.workloads.filter((workload) => workload.type !== type);
    if (!others.length) {
      onChange({ ...profile, workloadProfile: { workloads: profile.workloadProfile.workloads.map((workload) => ({ ...workload, weight: 100 })) } });
      return;
    }
    const remaining = Math.max(0, 100 - safeWeight);
    const otherTotal = others.reduce((sum, workload) => sum + workload.weight, 0);
    const workloads = profile.workloadProfile.workloads.map((workload) => {
      if (workload.type === type) return { ...workload, weight: safeWeight };
      const share = otherTotal ? Math.round((workload.weight / otherTotal) * remaining) : Math.floor(remaining / Math.max(1, others.length));
      return { ...workload, weight: share };
    });
    const correction = 100 - workloads.reduce((sum, workload) => sum + workload.weight, 0);
    if (others.length) workloads.find((workload) => workload.type !== type)!.weight += correction;
    onChange({ ...profile, workloadProfile: { workloads } });
  };

  const updateBudget = (key: 'minimumWon' | 'targetWon' | 'maximumWon', value: number) => {
    const next = Math.max(0, Math.round(value) * 10_000);
    const budget = { ...profile.budgetProfile, [key]: next };
    onChange({ ...profile, budgetProfile: { ...budget, minimumWon: Math.min(budget.minimumWon, budget.targetWon), maximumWon: Math.max(budget.maximumWon, budget.targetWon) } });
  };

  return (
    <PanelCard className="mx-auto w-full max-w-5xl md:p-6">
      <SectionHeader
        action={<Sparkles className="text-accent" size={28} />}
        description="선택한 작업만 질문하고, 서버가 현재 판매 단위·가격·호환성을 검증해 후보를 만듭니다."
        title="조건부 자동 견적 설문"
      />

      <div className="mt-6 grid gap-6">
        <section className="grid gap-3">
          <SurveyHeading title="1. 작업 비중" description="여러 작업을 고르고 비중 합계 100%를 맞춥니다." />
          <div className="flex flex-wrap gap-2">
            {workloadPresets.map((preset) => <button className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-black hover:border-brand" key={preset.label} onClick={() => onChange(applyWorkloadPreset(profile, preset.types))} type="button">{preset.label}</button>)}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {workloadOptions.map((option) => {
              const selected = profile.workloadProfile.workloads.some((workload) => workload.type === option.type);
              return (
                <button
                  className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-brand bg-teal-50 text-brand shadow-sm' : 'border-line bg-white hover:border-brand'}`}
                  key={option.type}
                  onClick={() => toggleWorkload(option.type)}
                  type="button"
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-black">{option.label}</span>
                    <span className={`grid h-5 w-5 place-items-center rounded-full border ${selected ? 'border-brand bg-brand text-white' : 'border-slate-300'}`}>{selected && <Check size={13} />}</span>
                  </span>
                  <span className="mt-1 block text-xs font-bold text-slate-500">{option.description}</span>
                </button>
              );
            })}
          </div>
          <div className="grid gap-3 rounded-2xl border border-line bg-panel p-4">
            {profile.workloadProfile.workloads.map((workload) => (
              <label className="grid gap-1 sm:grid-cols-[130px_minmax(0,1fr)_70px] sm:items-center" key={workload.type}>
                <span className="text-sm font-black">{workloadLabel(workload.type)}</span>
                <input className="accent-teal-700" disabled={profile.workloadProfile.workloads.length === 1} max={100} min={0} onChange={(event) => updateWeight(workload.type, Number(event.target.value))} type="range" value={workload.weight} />
                <span className="text-right text-sm font-black">{workload.weight}%</span>
              </label>
            ))}
            <div className={`flex items-center justify-between border-t border-line pt-3 text-sm font-black ${Math.abs(weightTotal - 100) < 0.001 ? 'text-emerald-700' : 'text-amber-700'}`}>
              <span>비중 합계</span><span>{weightTotal}%</span>
            </div>
          </div>
        </section>

        <section className="grid gap-3">
          <SurveyHeading title="2. 예산 범위" description="최소·목표·최대 예산을 분리해 조건 완화 여지를 남깁니다." />
          <div className="grid gap-3 sm:grid-cols-3">
            {(['minimumWon', 'targetWon', 'maximumWon'] as const).map((key) => (
              <label className="grid gap-1" key={key}>
                <span className="text-sm font-black">{budgetLabel(key)}</span>
                <div className="flex items-center gap-2"><input className="w-full rounded-xl border border-line px-3 py-3 font-black" min={0} onChange={(event) => updateBudget(key, Number(event.target.value))} type="number" value={Math.round(profile.budgetProfile[key] / 10_000)} /><span className="text-sm font-bold">만원</span></div>
              </label>
            ))}
          </div>
        </section>

        {profile.workloadProfile.workloads.map((workload) => (
          <WorkloadDetails key={workload.type} workload={workload} gameOptions={gameOptions} onChange={(nextWorkload) => updateWorkload(workload.type, () => nextWorkload)} />
        ))}

        <section className="grid gap-3">
          <SurveyHeading title="3. 선호와 저장장치" description="후보 생성 가중치와 실제 필요한 저장 용량을 함께 반영합니다." />
          <div className="flex flex-wrap gap-2">
            {(Object.keys(presetWeights) as PreferencePreset[]).map((preset) => (
              <button className={`rounded-xl border px-3 py-2 text-sm font-black ${profile.preferenceProfile.preset === preset ? 'border-brand bg-brand text-white' : 'border-line bg-white hover:border-brand'}`} key={preset} onClick={() => onChange({ ...profile, preferenceProfile: presetWeights[preset] })} type="button">{preferenceLabel(preset)}</button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {(['systemGb', 'activeProjectGb', 'archiveGb', 'growthGbPerYear'] as const).map((key) => (
              <label className="grid gap-1" key={key}><span className="text-xs font-black">{storageLabel(key)}</span><input className="rounded-xl border border-line px-3 py-3 font-black" min={0} onChange={(event) => onChange({ ...profile, storageDemand: { ...profile.storageDemand, [key]: Math.max(0, Number(event.target.value)) } })} type="number" value={profile.storageDemand[key]} /></label>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1"><span className="text-sm font-black">저장장치 중복 보관</span><select className="rounded-xl border border-line bg-white px-3 py-3 font-bold" onChange={(event) => onChange({ ...profile, storageDemand: { ...profile.storageDemand, redundancy: event.target.value as QuoteProfileV2['storageDemand']['redundancy'] } })} value={profile.storageDemand.redundancy}><option value="NONE">필요 없음</option><option value="MIRROR">미러링</option><option value="BACKUP_REQUIRED">백업 필수</option></select></label>
            <label className="grid gap-1"><span className="text-sm font-black">Windows</span><select className="rounded-xl border border-line bg-white px-3 py-3 font-bold" onChange={(event) => onChange(withWindowsOption(profile, event.target.value as QuoteProfileV2['windowsOption']))} value={profile.windowsOption}>{windowsOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['ASSEMBLY', 'SHIPPING'] as BudgetInclude[]).map((include) => <button className={`rounded-xl border px-3 py-2 text-sm font-black ${profile.budgetProfile.includes.includes(include) ? 'border-brand bg-brand text-white' : 'border-line bg-white text-slate-600'}`} key={include} onClick={() => onChange({ ...profile, budgetProfile: { ...profile.budgetProfile, includes: toggleInclude(profile.budgetProfile.includes, include) } })} type="button">{include === 'ASSEMBLY' ? '조립비 포함' : '배송비 포함'}</button>)}
          </div>
        </section>

        {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">{error}</div>}
        <Button className="h-14 w-full text-lg shadow-md" disabled={!canSubmit} onClick={onSubmit} type="button" variant={canSubmit ? 'dark' : 'disabled'}>
          {loading ? '현재 상품·호환성 확인 중...' : '서버에서 후보 3개 만들기'}
          {loading ? <SlidersHorizontal className="animate-pulse" size={20} /> : <ChevronRight size={20} />}
        </Button>
        {!gaming && <p className="text-center text-xs font-bold text-slate-500">게임을 선택하지 않아 게임·FPS 질문은 표시하지 않습니다.</p>}
        {gaming && !games.length && <p className="text-center text-xs font-bold text-amber-700">게임 workload를 선택했으므로 게임을 하나 이상 골라주세요.</p>}
      </div>
    </PanelCard>
  );
}

function WorkloadDetails({ workload, gameOptions, onChange }: { workload: Workload; gameOptions: string[]; onChange: (update: Workload) => void }) {
  const details = workload.details;
  if (workload.type === 'GAMING') {
    const games = stringArray(details.games);
    return <section className="grid gap-3 rounded-2xl border border-brand/20 bg-teal-50/40 p-4"><SurveyHeading title="게임 조건" description="게임 workload를 선택한 경우에만 표시됩니다." /><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{gameOptions.map((game) => <button className={`rounded-xl border px-3 py-2 text-left text-sm font-bold ${games.includes(game) ? 'border-accent bg-amber-50 text-accent' : 'border-line bg-white'}`} key={game} onClick={() => onChange({ ...workload, details: { ...details, games: games.includes(game) ? games.filter((item) => item !== game) : [...games, game].slice(0, 5) } })} type="button">{game}</button>)}</div><div className="grid gap-3 sm:max-w-xs"><div className="grid gap-1"><span className="text-sm font-black">목표 해상도</span><select className="rounded-xl border border-line bg-white px-3 py-3 font-bold" onChange={(event) => onChange({ ...workload, details: { ...details, resolution: event.target.value } })} value={String(details.resolution ?? 'QHD')}><option>FHD</option><option>QHD</option><option>4K</option><option>8K</option></select></div><TextSelect label="목표 주사율" value={String(details.refreshRate ?? 144)} options={['60', '144', '165', '240']} onChange={(value) => onChange({ ...workload, details: { ...details, refreshRate: Number(value) } })} /></div></section>;
  }
  if (workload.type === 'STREAMING') return <section className="grid gap-3 rounded-2xl border border-brand/20 bg-teal-50/40 p-4"><SurveyHeading title="방송 조건" description="방송 workload에 필요한 질문입니다." /><div className="grid gap-1 sm:max-w-xs"><span className="text-sm font-black">출력 해상도</span><select className="rounded-xl border border-line bg-white px-3 py-3 font-bold" onChange={(event) => onChange({ ...workload, details: { ...details, outputResolution: event.target.value } })} value={String(details.outputResolution ?? 'QHD')}><option>FHD</option><option>QHD</option><option>4K</option></select></div><BooleanField label="하드웨어 인코딩 사용" value={Boolean(details.hardwareEncoding)} onChange={(value) => onChange({ ...workload, details: { ...details, hardwareEncoding: value } })} /></section>;
  if (workload.type === 'VIDEO_EDITING') { const software = stringArray(details.software); return <section className="grid gap-3 rounded-2xl border border-brand/20 bg-teal-50/40 p-4"><SurveyHeading title="영상편집 조건" description="사용 프로그램과 타임라인을 반영합니다." /><div className="flex flex-wrap gap-2">{softwareOptions.map((item) => <button className={`rounded-xl border px-3 py-2 text-sm font-bold ${software.includes(item) ? 'border-brand bg-brand text-white' : 'border-line bg-white'}`} key={item} onClick={() => onChange({ ...workload, details: { ...details, software: software.includes(item) ? software.filter((value) => value !== item) : [...software, item] } })} type="button">{item}</button>)}</div><TextSelect label="타임라인" value={String(details.timeline ?? 'QHD')} options={['FHD', 'QHD', '4K']} onChange={(value) => onChange({ ...workload, details: { ...details, timeline: value } })} /><TextSelect label="코덱" value={String(details.codec ?? 'H.264')} options={['H.264', 'H.265', 'ProRes', 'AV1']} onChange={(value) => onChange({ ...workload, details: { ...details, codec: value } })} /></section>; }
  if (workload.type === 'AI') return <section className="grid gap-3 rounded-2xl border border-brand/20 bg-teal-50/40 p-4"><SurveyHeading title="AI 조건" description="AI 단독 workload에서는 게임 질문을 요구하지 않습니다." /><div className="grid gap-3 sm:grid-cols-3"><TextSelect label="모드" value={String(details.mode ?? 'INFERENCE')} options={['INFERENCE', 'TRAINING', 'FINE_TUNING']} onChange={(value) => onChange({ ...workload, details: { ...details, mode: value } })} /><TextSelect label="모델 크기" value={String(details.modelSize ?? '13B')} options={['7B', '13B', '34B', '70B']} onChange={(value) => onChange({ ...workload, details: { ...details, modelSize: value } })} /><TextSelect label="양자화" value={String(details.quantization ?? 'Q4')} options={['NONE', 'Q4', 'Q8']} onChange={(value) => onChange({ ...workload, details: { ...details, quantization: value } })} /></div></section>;
  if (workload.type === 'OFFICE') return <section className="grid gap-3 rounded-2xl border border-brand/20 bg-teal-50/40 p-4"><SurveyHeading title="사무 조건" description="동시에 사용하는 앱 수를 반영합니다." /><TextSelect label="멀티태스킹" value={String(details.multitasking ?? 'STANDARD')} options={['LIGHT', 'STANDARD', 'HEAVY']} onChange={(value) => onChange({ ...workload, details: { ...details, multitasking: value } })} /></section>;
  return <section className="grid gap-3 rounded-2xl border border-brand/20 bg-teal-50/40 p-4"><SurveyHeading title="개발 조건" description="개발 workload의 가상화 수요입니다." /><div className="grid gap-2 sm:grid-cols-2"><BooleanField label="컨테이너 사용" value={Boolean(details.containers)} onChange={(value) => onChange({ ...workload, details: { ...details, containers: value } })} /><BooleanField label="가상 머신 사용" value={Boolean(details.virtualMachines)} onChange={(value) => onChange({ ...workload, details: { ...details, virtualMachines: value } })} /></div></section>;
}

function withDistributedWeights(profile: QuoteProfileV2, workloads: Workload[]) {
  const base = Math.floor(100 / workloads.length);
  const remainder = 100 - base * workloads.length;
  return { ...profile, workloadProfile: { workloads: workloads.map((workload, index) => ({ ...workload, weight: base + (index === 0 ? remainder : 0) })) } };
}

function applyWorkloadPreset(profile: QuoteProfileV2, preset: Array<{ type: WorkloadType; weight: number }>) {
  return {
    ...profile,
    workloadProfile: {
      workloads: preset.map(({ type, weight }) => ({
        type,
        weight,
        details: profile.workloadProfile.workloads.find((workload) => workload.type === type)?.details ?? defaultDetails(type),
      })),
    },
  };
}

function toggleInclude(includes: BudgetInclude[], value: BudgetInclude) {
  return includes.includes(value) ? includes.filter((include) => include !== value) : [...includes, value];
}

function withWindowsOption(profile: QuoteProfileV2, windowsOption: QuoteProfileV2['windowsOption']) {
  const includes: BudgetInclude[] = windowsOption === 'NONE'
    ? profile.budgetProfile.includes.filter((include) => include !== 'WINDOWS')
    : profile.budgetProfile.includes.includes('WINDOWS') ? profile.budgetProfile.includes : [...profile.budgetProfile.includes, 'WINDOWS'];
  return { ...profile, windowsOption, budgetProfile: { ...profile.budgetProfile, includes } };
}

function defaultDetails(type: WorkloadType): Record<string, unknown> {
  return { GAMING: { games: [], resolution: 'QHD', refreshRate: 144 }, STREAMING: { outputResolution: 'QHD', hardwareEncoding: true }, VIDEO_EDITING: { software: ['Premiere Pro'], timeline: 'QHD', codec: 'H.264' }, AI: { mode: 'INFERENCE', modelSize: '13B', quantization: 'Q4' }, OFFICE: { multitasking: 'STANDARD' }, DEVELOPMENT: { containers: true, virtualMachines: false } }[type];
}

function stringArray(value: unknown): string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []; }
function workloadLabel(type: WorkloadType) { return workloadOptions.find((option) => option.type === type)?.label ?? type; }
function preferenceLabel(preset: PreferencePreset) { return { BALANCED: '균형형', PERFORMANCE: '성능 우선', VALUE: '가성비형', AESTHETICS: '감성 우선', UPGRADE: '확장형' }[preset]; }
function budgetLabel(key: 'minimumWon' | 'targetWon' | 'maximumWon') { return key === 'minimumWon' ? '최소 예산' : key === 'targetWon' ? '목표 예산' : '최대 예산'; }
function storageLabel(key: 'systemGb' | 'activeProjectGb' | 'archiveGb' | 'growthGbPerYear') { return { systemGb: 'OS', activeProjectGb: '현재 작업', archiveGb: '보관 자료', growthGbPerYear: '연간 증가량' }[key]; }
function SurveyHeading({ title, description }: { title: string; description: string }) { return <div><h3 className="font-black text-brand">{title}</h3><p className="mt-1 text-xs font-bold text-slate-500">{description}</p></div>; }
function TextSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="grid gap-1 sm:max-w-xs"><span className="text-sm font-black">{label}</span><select className="rounded-xl border border-line bg-white px-3 py-3 font-bold" onChange={(event) => onChange(event.target.value)} value={value}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function BooleanField({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) { return <button className={`flex items-center justify-between rounded-xl border px-3 py-3 text-left text-sm font-black ${value ? 'border-brand bg-white text-brand' : 'border-line bg-white text-slate-600'}`} onClick={() => onChange(!value)} type="button"><span>{label}</span>{value && <Check size={16} />}</button>; }
