'use client';

import { Check, ChevronRight, ShoppingCart, Sparkles, Settings2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { QuoteSummary } from '@/components/QuoteSummary';
import { QuotePreviewCandidates } from '@/components/QuotePreviewCandidates';
import { QuoteSurveyPanel } from '@/components/QuoteSurveyPanel';
import { PartSearchDialog } from '@/components/builder/PartSearchDialog';
import { CurrentBuildPanel } from '@/components/builder/CurrentBuildPanel';
import { PartSelectorPanel } from '@/components/builder/PartSelectorPanel';
import { Button, LinkButton } from '@/components/ui/Button';
import { PanelCard } from '@/components/ui/PanelCard';
import { useBuilderStore } from '@/lib/builder-store';
import { loadServerCatalog } from '@/lib/server-parts';
import { loadBenchmarkGameNames, withDbPerformance } from '@/lib/server-performance';
import { defaultInput, generateManualQuote, purposes } from '@/lib/v1-estimator';
import { getSession } from '@/lib/auth-client';
import { candidateToQuote, requestQuotePreview, type QuotePreviewCandidate, type QuotePreviewResponse } from '@/lib/quote-preview-client';
import { quoteInputToProfile, type QuoteProfileV2 } from '@/lib/quote-profile';
import { syncCartQuoteToServer } from '@/lib/server-cart';
import { addQuoteToCart, loadLatestQuote, loadLatestQuoteProfile, loadManualQuantities, loadManualSelection, loadQuoteProfile, quoteInputToV2Profile, saveQuote, saveQuoteProfile } from '@/lib/v1-storage';
import { applyWindowsOptionToQuote, normalizeWindowsOption } from '@/lib/windows-options';
import type { CatalogPart, ManualQuantities, ManualSelection, PartCategory, Purpose, Quote, QuoteInput, QuotePart } from '@/lib/v1-types';

import { AiChatWidget } from '@/components/builder/AiChatWidget';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

export default function QuotePage() {
  const [input, setInput] = useState<QuoteInput>(defaultInput);
  const [quote, setQuote] = useState<Quote>();
  const [mode, setMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [showResult, setShowResult] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [serverSaved, setServerSaved] = useState(false);
  const [replaceQuotePart, setReplaceQuotePart] = useState<QuotePart | null>(null);
  const [gameOptions, setGameOptions] = useState<string[]>([]);
  const [gameLoading, setGameLoading] = useState(true);
  const [gameError, setGameError] = useState<string | null>(null);
  const [gameLoadAttempt, setGameLoadAttempt] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [surveyProfile, setSurveyProfile] = useState<QuoteProfileV2>(() => createSurveyProfile(defaultInput));
  const [serverPreview, setServerPreview] = useState<QuotePreviewResponse>();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>();
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const surveyProfileRef = useRef(surveyProfile);

  const { manualSelection, manualQuantities, setCatalog, setManualSelection, setManualQuantities } = useBuilderStore();
  const hasActiveGamingWorkload = surveyProfile.workloadProfile.workloads.some(
    (workload) => workload.type === 'GAMING' && Number(workload.weight) > 0,
  );

  useEffect(() => {
    surveyProfileRef.current = surveyProfile;
  }, [surveyProfile]);

  useEffect(() => {
    setIsAuthenticated(Boolean(getSession()?.accessToken));
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    if (modeParam === 'manual') {
      setMode('MANUAL');
      setShowResult(false);
      setManualSelection(loadManualSelection());
      setManualQuantities(loadManualQuantities());
    }
    const purposeParam = params.get('purpose') as Purpose | null;
    const updatedInput = purposeParam && purposes.includes(purposeParam)
      ? { ...defaultInput, purpose: purposeParam }
      : defaultInput;
    setInput(updatedInput);
    setSurveyProfile(createSurveyProfile(updatedInput));
    
    if (modeParam === 'manual') return;

    const latestQuote = loadLatestQuote();
    const latestProfile = loadLatestQuoteProfile();
    if (latestQuote && latestProfile) {
      const restoredQuote = latestProfile.legacyInput
        ? { ...latestQuote, input: latestProfile.legacyInput }
        : latestQuote;
      surveyProfileRef.current = latestProfile;
      setSurveyProfile(latestProfile);
      setInput(restoredQuote.input);
      void hydrateAndSetQuote(normalizeQuoteWindows(restoredQuote), { showResult: true });
    }
  }, []);

  useEffect(() => {
    if (mode !== 'MANUAL') return;
    void loadServerCatalog({
      onCategoryLoaded: (category, items) => {
        const current = useBuilderStore.getState().catalog;
        setCatalog([...current.filter((part) => part.category !== category), ...items]);
      },
      onCategoryError: () => undefined,
    })
    .then(() => undefined)
    .catch(() => {
      // Manual builder can still show an empty state when the catalog is unavailable.
    });
  }, [mode, setCatalog]);

  useEffect(() => {
    let cancelled = false;
    if (!hasActiveGamingWorkload) {
      setGameOptions([]);
      setGameError(null);
      setGameLoading(false);
      return () => { cancelled = true; };
    }
    const loadGames = async () => {
      setGameLoading(true);
      setGameError(null);
      const names = await loadBenchmarkGameNames();
      if (cancelled) return;
      setGameOptions(names);
      if (!names.length) {
        setGameError('게임 목록을 불러오지 못했습니다.');
        setGameLoading(false);
        return;
      }
      setInput((current) => {
        const selectedDbGames = current.games.filter((game) => names.includes(game));
        return selectedDbGames.length ? { ...current, games: selectedDbGames.slice(0, 3) } : { ...current, games: names.slice(0, 3) };
      });
      setSurveyProfile((current) => ({
        ...current,
        workloadProfile: {
          workloads: current.workloadProfile.workloads.map((workload) => workload.type === 'GAMING'
            ? { ...workload, details: { ...workload.details, games: stringArray(workload.details.games).filter((game) => names.includes(game)).length ? stringArray(workload.details.games).filter((game) => names.includes(game)).slice(0, 3) : names.slice(0, 3) } }
            : workload),
        },
      }));
      setGameLoading(false);
    };
    void loadGames();
    return () => { cancelled = true; };
  }, [gameLoadAttempt, hasActiveGamingWorkload]);

  const hasCompatibilityFail = quote?.compatibility.some((item) => item.startsWith('실패:')) ?? false;

  const hydrateAndSetQuote = async (
    nextQuote: Quote,
    options: { showResult?: boolean; persist?: boolean; profile?: QuoteProfileV2; refreshPerformance?: boolean } = {},
  ) => {
    const shouldRefreshPerformance = options.refreshPerformance ?? nextQuote.performance.length === 0;
    const hydratedQuote = shouldRefreshPerformance ? await withDbPerformance(nextQuote) : nextQuote;
    if (options.persist !== false) {
      saveQuote(hydratedQuote);
      saveQuoteProfile(hydratedQuote.id, options.profile ?? loadQuoteProfile(hydratedQuote.id) ?? quoteInputToV2Profile(hydratedQuote.input));
    }
    setQuote(hydratedQuote);
    if (options.showResult !== undefined) setShowResult(options.showResult);
    return hydratedQuote;
  };

  const persistQuoteToServer = async (nextQuote: Quote, candidate?: QuotePreviewCandidate) => {
    const session = getSession();
    if (!session?.accessToken) return nextQuote;
    if (nextQuote.serverQuoteId) {
      setServerSaved(true);
      return nextQuote;
    }
    const profile = nextQuote.mode === 'AUTO' ? surveyProfileRef.current : quoteInputToV2Profile(nextQuote.input);
    const selected = candidate ?? serverPreview?.candidates.find((item) => item.id === selectedCandidateId);
    try {
      const response = await fetch(`${apiBaseUrl}/quotes/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({
          title: nextQuote.title,
          purpose: nextQuote.input.purpose,
          budget: nextQuote.input.budget,
          parts: nextQuote.parts,
          input: nextQuote.input,
          profile,
          performance: nextQuote.performance,
          preview: selected ? {
            candidateId: selected.id,
            strategy: selected.strategy,
            rulesetVersion: serverPreview?.rulesetVersion,
            status: serverPreview?.status,
            selectionReasons: selected.selectionReasons,
            unmetConditions: selected.unmetConditions,
            compatibility: selected.compatibility,
            performanceEvidence: selected.performanceEvidence,
          } : undefined,
          compatibility: nextQuote.compatibility,
        }),
      });
      if (!response.ok) {
        setPreviewError('서버 견적 저장에 실패했습니다. 로그인 상태와 서버 연결을 확인해주세요.');
        return nextQuote;
      }
      const body = await response.json() as { quoteId?: string | number };
      if (!body.quoteId) {
        setPreviewError('서버가 견적 번호를 반환하지 않았습니다.');
        return nextQuote;
      }
      const persisted = { ...nextQuote, serverQuoteId: String(body.quoteId) };
      saveQuote(persisted);
      setServerSaved(true);
      return persisted;
    } catch {
      setPreviewError('서버 견적 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
      return nextQuote;
    }
  };

  const handleGenerateAuto = async () => {
    const currentProfile = surveyProfileRef.current;
    setPreviewLoading(true);
    setPreviewError(null);
    setQuote(undefined);
    try {
      const preview = await requestQuotePreview(currentProfile);
      setServerPreview(preview);
      setSelectedCandidateId(undefined);
      setInput(profileToLegacyInput(currentProfile));
      setShowResult(true);
      setCartMessage('');
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : '자동 견적을 생성하지 못했습니다.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSelectCandidate = async (candidate: QuotePreviewCandidate) => {
    const profile = surveyProfileRef.current;
    const nextQuote = candidateToQuote(candidate, profile, profileToLegacyInput(profile));
    const hydratedQuote = await hydrateAndSetQuote(nextQuote, { profile, refreshPerformance: false, showResult: true });
    setSelectedCandidateId(candidate.id);
    const persistedQuote = await persistQuoteToServer(hydratedQuote, candidate);
    setQuote(persistedQuote);
    setCartMessage(getSession()?.accessToken ? '선택한 후보를 서버 견적으로 저장했습니다.' : '선택한 후보를 이 브라우저에 임시 저장했습니다. 로그인하면 서버에도 저장됩니다.');
  };

  const handleBuildManualQuote = async () => {
    const nextQuote = generateManualQuote(manualSelection, input, manualQuantities);
    await hydrateAndSetQuote(nextQuote, { showResult: true });
    setCartMessage('');
  };

  const updateManualQuoteFromSelection = async (selection: ManualSelection, quantities: ManualQuantities) => {
    setManualSelection(selection);
    setManualQuantities(quantities);
    const nextQuote = generateManualQuote(selection, quote?.input ?? input, quantities);
    await hydrateAndSetQuote(nextQuote);
    setCartMessage('');
  };

  const handleReplaceQuotePart = async (nextPart: CatalogPart) => {
    if (!replaceQuotePart || !quote) return;
    const selection = quoteToManualSelection(quote);
    const quantities = quoteToManualQuantities(quote);
    const previousCategory = replaceQuotePart.category as PartCategory;
    selection[nextPart.category] = nextPart;
    quantities[nextPart.category] = quantities[previousCategory] ?? 1;
    await updateManualQuoteFromSelection(selection, quantities);
    setReplaceQuotePart(null);
  };

  const handleRemoveQuotePart = async (part: QuotePart) => {
    if (!quote) return;
    const selection = quoteToManualSelection(quote);
    const quantities = quoteToManualQuantities(quote);
    delete selection[part.category as PartCategory];
    delete quantities[part.category as PartCategory];
    await updateManualQuoteFromSelection(selection, quantities);
  };

  const handleAddCart = async () => {
    if (!quote) return;
    const persistedQuote = await persistQuoteToServer(quote);
    addQuoteToCart(persistedQuote);
    await syncCartQuoteToServer(persistedQuote).catch(() => false);
    setQuote(persistedQuote);
    setCartMessage(isAuthenticated ? '장바구니에 견적을 담았습니다.' : '장바구니에 이 브라우저 기준으로 저장했습니다. 로그인하면 다른 기기에서도 확인할 수 있습니다.');
  };

  return (
    <AppShell>
      {replaceQuotePart && (
        <PartSearchDialog
          category={replaceQuotePart.category as PartCategory}
          manualSelection={quote ? quoteToManualSelection(quote) : manualSelection}
          onClose={() => setReplaceQuotePart(null)}
          onSelect={handleReplaceQuotePart}
        />
      )}
      {!showResult && (
        <div className="mb-6 flex border-b border-line px-2 sm:px-0">
          <button
            className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-4 font-black transition text-sm sm:text-base border-b-2 ${
              mode === 'AUTO' ? 'border-brand text-brand bg-teal-50/50' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => setMode('AUTO')}
            type="button"
          >
            <Sparkles size={18} />
            자동 견적 구성
          </button>
          <button
            className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-4 font-black transition text-sm sm:text-base border-b-2 ${
              mode === 'MANUAL' ? 'border-brand text-brand bg-teal-50/50' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => setMode('MANUAL')}
            type="button"
          >
            <Settings2 size={18} />
            수동 견적 (내가 고르기)
          </button>
        </div>
      )}

      {showResult && quote ? (
        <section className="grid w-full min-w-0 gap-5">
          {serverPreview && <QuotePreviewCandidates onSelect={handleSelectCandidate} preview={serverPreview} selectedId={selectedCandidateId} />}
          <div>
            <button 
              onClick={() => setShowResult(false)} 
              className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand bg-white border border-line rounded-xl px-4 py-2 shadow-sm transition"
            >
              <ArrowLeft size={16} /> 다시 구성하기
            </button>
            <QuoteSummary
              compact
              onRemovePart={quote.mode === 'MANUAL' ? handleRemoveQuotePart : undefined}
              onRequestReplacePart={quote.mode === 'MANUAL' ? setReplaceQuotePart : undefined}
              quote={quote}
            />
          </div>

          <PanelCard>
            <h3 className="font-black text-brand">견적 총평</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700 font-bold">{buildQuoteSummary(quote)}</p>
          </PanelCard>

          <div className="grid gap-2 md:grid-cols-2">
            <Button
              className="h-14 border-2 border-brand shadow-soft hover:bg-teal-50"
              onClick={handleAddCart}
              type="button"
              variant="outline"
            >
              장바구니 담기
              <ShoppingCart size={18} />
            </Button>
            {hasCompatibilityFail ? (
              <Button
                className="h-14 shadow-soft"
                disabled
                type="button"
                variant="disabled"
              >
                호환 실패로 주문 불가
              </Button>
            ) : (
              <LinkButton
                className="h-14 shadow-soft"
                href={isAuthenticated ? '/order' : '/login?next=%2Forder'}
              >
                {isAuthenticated ? '바로 주문하기' : '로그인 후 주문하기'}
                <ChevronRight size={18} />
              </LinkButton>
            )}
          </div>
          {cartMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700 flex items-center gap-2 justify-center">
              <Check size={16} />
              {cartMessage}
              {serverSaved && <span className="text-xs font-normal text-emerald-600">· 서버에도 저장됨</span>}
            </div>
          )}
        </section>
      ) : showResult && serverPreview ? (
        <section className="grid w-full min-w-0 gap-5">
          <QuotePreviewCandidates onSelect={handleSelectCandidate} preview={serverPreview} selectedId={selectedCandidateId} />
          <button className="mx-auto text-sm font-black text-brand hover:underline" onClick={() => setShowResult(false)} type="button">← 설문으로 돌아가기</button>
        </section>
      ) : mode === 'AUTO' ? (
        <QuoteSurveyPanel error={previewError} gameError={gameError} gameLoading={gameLoading} gameOptions={gameOptions} isAuthenticated={isAuthenticated} loading={previewLoading} onChange={(nextProfile) => { surveyProfileRef.current = nextProfile; setSurveyProfile(nextProfile); }} onRetryGames={() => setGameLoadAttempt((attempt) => attempt + 1)} onSubmit={handleGenerateAuto} profile={surveyProfile} />
      ) : (
        <section className="grid min-w-0 gap-5 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)] items-start">
          <div className="lg:sticky lg:top-[120px] flex flex-col gap-4">
            <CurrentBuildPanel input={input} onGenerate={handleBuildManualQuote} />
          </div>
          <div className="min-w-0">
            <PartSelectorPanel />
          </div>
        </section>
      )}

      {mode === 'AUTO' && !showResult && (
        <AiChatWidget
          currentInput={input}
          onUpdateInput={(newInput) => {
            const updatedInput = { ...input, ...newInput };
            const updatedProfile = mergeAiInputIntoProfile(surveyProfileRef.current, updatedInput, newInput);
            setInput(updatedInput);
            surveyProfileRef.current = updatedProfile;
            setSurveyProfile(updatedProfile);
          }}
          onGenerate={handleGenerateAuto}
        />
      )}
    </AppShell>
  );
}

function normalizeQuoteWindows(quote: Quote) {
  return applyWindowsOptionToQuote(quote, normalizeWindowsOption(quote.input.windows));
}

function quoteToManualSelection(quote: Quote): ManualSelection {
  return quote.parts.reduce<ManualSelection>((selection, part) => {
    const category = part.category as PartCategory;
    selection[category] = {
      id: part.productNo ?? part.name,
      category,
      productNo: part.productNo ?? '',
      name: part.name,
      price: Math.round(part.price / (part.quantity ?? 1)),
      imageUrl: part.imageUrl ?? '',
      detailUrl: part.detailUrl ?? '',
      detailImages: part.detailImages ?? [],
      spec: part.specSummary ?? part.memo ?? '',
      reviewCount: 0,
      reviewRate: 0,
      badges: [],
    };
    return selection;
  }, {});
}

function quoteToManualQuantities(quote: Quote): ManualQuantities {
  return quote.parts.reduce<ManualQuantities>((quantities, part) => {
    quantities[part.category as PartCategory] = Math.max(1, part.quantity ?? 1);
    return quantities;
  }, {});
}

function buildQuoteSummary(quote: Quote) {
  const failCount = quote.compatibility.filter((item) => item.startsWith('실패:')).length;
  const unknownCount = quote.compatibility.filter((item) => item.startsWith('확인필요:')).length;
  const gpu = quote.parts.find((part) => part.category === '그래픽카드')?.name ?? '내장/미선택 그래픽';
  const casePart = quote.parts.find((part) => part.category === '케이스')?.name ?? '케이스 미선택';
  if (failCount > 0) return `${gpu}와 ${casePart} 조합에서 ${failCount}개의 호환 실패가 있습니다. 주문 전에 부품을 교체해야 합니다.`;
  if (unknownCount > 0) return `${quote.input.resolution} 기준 성능은 계산됐지만, ${unknownCount}개 항목은 스펙 데이터가 부족해 관리자 확인이 필요합니다.`;
  return `${quote.input.resolution} ${quote.input.games.join(', ')} 기준으로 무난한 구성입니다. 케이스 공간, 쿨러 높이, 메모리 규격까지 기본 호환 검사를 통과했습니다.`;
}

function createSurveyProfile(input: QuoteInput): QuoteProfileV2 {
  const profile = quoteInputToProfile(input);
  const targetWon = profile.budgetProfile.targetWon;
  return {
    ...profile,
    budgetProfile: {
      ...profile.budgetProfile,
      minimumWon: Math.max(0, targetWon - 300_000),
      maximumWon: targetWon + 500_000,
    },
    workloadProfile: {
      workloads: profile.workloadProfile.workloads.map((workload) => workload.type === 'GAMING'
        ? { ...workload, details: { ...workload.details, refreshRate: 144 } }
        : workload),
    },
  };
}

function profileToLegacyInput(profile: QuoteProfileV2): QuoteInput {
  const workload = [...profile.workloadProfile.workloads].sort((left, right) => right.weight - left.weight)[0];
  const details = workload?.details ?? {};
  const purpose = {
    GAMING: '게임',
    STREAMING: '방송',
    VIDEO_EDITING: '영상편집',
    AI: 'AI',
    OFFICE: '사무',
    DEVELOPMENT: '사무',
  }[workload?.type ?? 'GAMING'] as QuoteInput['purpose'];
  const resolution = String(details.resolution ?? details.outputResolution ?? details.timeline ?? 'QHD');
  const priority = {
    PERFORMANCE: '성능 우선',
    VALUE: '가성비 우선',
    AESTHETICS: '감성 우선',
    UPGRADE: '업그레이드 우선',
    BALANCED: '성능 우선',
  }[profile.preferenceProfile.preset] as QuoteInput['priority'];
  const systemGb = profile.storageDemand.systemGb;
  return {
    budget: Math.round(profile.budgetProfile.targetWon / 10_000),
    purpose,
    games: Array.isArray(details.games) ? details.games.filter((game): game is string => typeof game === 'string') : [],
    resolution: resolution === 'FHD' || resolution === '4K' ? resolution : 'QHD',
    storage: systemGb >= 2048 ? '2TB' : systemGb <= 500 ? '500GB' : '1TB',
    windows: profile.windowsOption,
    priority,
  };
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function mergeAiInputIntoProfile(profile: QuoteProfileV2, input: QuoteInput, changes: Partial<QuoteInput>): QuoteProfileV2 {
  let next: QuoteProfileV2 = { ...profile, legacyInput: { ...input, games: [...input.games] } };
  if (changes.purpose) {
    const type = { 게임: 'GAMING', 방송: 'STREAMING', 영상편집: 'VIDEO_EDITING', 사무: 'OFFICE', AI: 'AI' }[changes.purpose] as QuoteProfileV2['workloadProfile']['workloads'][number]['type'];
    const dominant = [...next.workloadProfile.workloads].sort((left, right) => right.weight - left.weight)[0];
    if (dominant) {
      const existingTarget = next.workloadProfile.workloads.find((workload) => workload !== dominant && workload.type === type);
      const workloads = existingTarget
        ? next.workloadProfile.workloads
          .filter((workload) => workload !== dominant && workload !== existingTarget)
          .concat({ ...existingTarget, weight: dominant.weight + existingTarget.weight })
        : next.workloadProfile.workloads.map((workload) => workload === dominant
          ? { ...workload, type, details: workload.type === type ? workload.details : defaultWorkloadDetails(type) }
          : workload);
      next = { ...next, workloadProfile: { workloads } };
    }
  }
  if (changes.budget !== undefined) {
    const targetWon = Math.max(0, Math.round(input.budget * 10_000));
    next = { ...next, budgetProfile: { ...next.budgetProfile, minimumWon: Math.max(0, targetWon - 300_000), targetWon, maximumWon: targetWon + 500_000 } };
  }
  if (changes.priority) {
    const preset = { '성능 우선': 'PERFORMANCE', '가성비 우선': 'VALUE', '감성 우선': 'AESTHETICS', '업그레이드 우선': 'UPGRADE' }[changes.priority] as QuoteProfileV2['preferenceProfile']['preset'];
    next = { ...next, preferenceProfile: preferenceForPreset(preset) };
  }
  if (changes.windows !== undefined) next = { ...next, windowsOption: input.windows };
  if (changes.storage) next = { ...next, storageDemand: { ...next.storageDemand, systemGb: input.storage === '500GB' ? 500 : input.storage === '2TB' ? 2048 : 1024 } };
  if (changes.resolution || changes.games) {
    next = {
      ...next,
      workloadProfile: {
        workloads: next.workloadProfile.workloads.map((workload) => workload.type === 'GAMING'
          ? { ...workload, details: { ...workload.details, ...(changes.resolution ? { resolution: input.resolution } : {}), ...(changes.games ? { games: [...input.games] } : {}) } }
          : workload),
      },
    };
  }
  return next;
}

function defaultWorkloadDetails(type: QuoteProfileV2['workloadProfile']['workloads'][number]['type']): Record<string, unknown> {
  return type === 'GAMING' ? { games: [], resolution: 'QHD', refreshRate: 144 }
    : type === 'STREAMING' ? { outputResolution: 'QHD', hardwareEncoding: true }
      : type === 'VIDEO_EDITING' ? { software: ['Premiere Pro'], timeline: 'QHD', codec: 'H.264' }
        : type === 'AI' ? { mode: 'INFERENCE', modelSize: '13B', quantization: 'Q4' }
          : type === 'DEVELOPMENT' ? { containers: true, virtualMachines: false }
            : { multitasking: 'STANDARD' };
}

function preferenceForPreset(preset: QuoteProfileV2['preferenceProfile']['preset']): QuoteProfileV2['preferenceProfile'] {
  const weights = {
    BALANCED: { performance: 35, value: 25, aesthetics: 15, upgradeability: 25 },
    PERFORMANCE: { performance: 45, value: 15, aesthetics: 10, upgradeability: 30 },
    VALUE: { performance: 25, value: 45, aesthetics: 10, upgradeability: 20 },
    AESTHETICS: { performance: 30, value: 15, aesthetics: 40, upgradeability: 15 },
    UPGRADE: { performance: 30, value: 15, aesthetics: 10, upgradeability: 45 },
  }[preset];
  return { preset, ...weights };
}
