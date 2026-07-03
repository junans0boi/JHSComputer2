'use client';

import { Check, ChevronRight, ShoppingCart, Sparkles, Cpu, Settings2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { QuoteSummary } from '@/components/QuoteSummary';
import { PartSearchDialog } from '@/components/builder/PartSearchDialog';
import { CurrentBuildPanel } from '@/components/builder/CurrentBuildPanel';
import { PartSelectorPanel } from '@/components/builder/PartSelectorPanel';
import { Button, LinkButton } from '@/components/ui/Button';
import { FormField, SelectInput } from '@/components/ui/FormField';
import { PanelCard, SectionHeader } from '@/components/ui/PanelCard';
import { useBuilderStore } from '@/lib/builder-store';
import { loadServerCatalog } from '@/lib/server-parts';
import { loadBenchmarkGameNames, withDbPerformance } from '@/lib/server-performance';
import { defaultInput, generateManualQuote, generateQuote, priorities, purposes, resolutions } from '@/lib/v1-estimator';
import { generateDynamicQuote } from '@/lib/dynamic-engine';
import { getSession } from '@/lib/auth-client';
import { syncCartQuoteToServer } from '@/lib/server-cart';
import { addQuoteToCart, loadLatestQuote, loadManualQuantities, loadManualSelection, saveQuote } from '@/lib/v1-storage';
import { applyWindowsOptionToQuote, normalizeWindowsOption, windowsOptions } from '@/lib/windows-options';
import type { CatalogPart, ManualQuantities, ManualSelection, PartCategory, Priority, Purpose, Quote, QuoteInput, QuotePart, Resolution, WindowsOptionValue } from '@/lib/v1-types';

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

  const { manualSelection, manualQuantities, catalog, setCatalog, setManualSelection, setManualQuantities } = useBuilderStore();

  useEffect(() => {
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
    
    if (modeParam === 'manual') return;

    const latestQuote = loadLatestQuote();
    if (!latestQuote && modeParam !== 'manual') {
      // Use fallback static generator on initial load if no catalog is ready
      void hydrateAndSetQuote(generateQuote(updatedInput), { showResult: false, persist: false });
    } else if (latestQuote) {
      void hydrateAndSetQuote(normalizeQuoteWindows(latestQuote), { showResult: true });
    }
  }, []);

  useEffect(() => {
    void loadServerCatalog()
      .then((items) => {
        if (items.length) setCatalog(items);
      })
      .catch(() => {});
  }, [setCatalog]);

  useEffect(() => {
    const loadGames = async () => {
      const names = await loadBenchmarkGameNames();
      setGameOptions(names);
      if (!names.length) return;
      setInput((current) => {
        const selectedDbGames = current.games.filter((game) => names.includes(game));
        return selectedDbGames.length ? { ...current, games: selectedDbGames.slice(0, 3) } : { ...current, games: names.slice(0, 3) };
      });
    };
    void loadGames();
  }, []);

  const selectedGames = new Set(input.games);
  const hasCompatibilityFail = quote?.compatibility.some((item) => item.startsWith('실패:')) ?? false;

  const hydrateAndSetQuote = async (
    nextQuote: Quote,
    options: { showResult?: boolean; persist?: boolean } = {},
  ) => {
    const hydratedQuote = await withDbPerformance(nextQuote);
    if (options.persist !== false) saveQuote(hydratedQuote);
    setQuote(hydratedQuote);
    if (options.showResult !== undefined) setShowResult(options.showResult);
    return hydratedQuote;
  };

  const handleGenerateAuto = async () => {
    // Generate dynamically using DB catalog if available
    const nextQuote = catalog.length > 0 ? generateDynamicQuote(input, catalog) : generateQuote(input);
    await hydrateAndSetQuote(nextQuote, { showResult: true });
    setCartMessage('');
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
    addQuoteToCart(quote);
    await syncCartQuoteToServer(quote).catch(() => false);
    setCartMessage('장바구니에 견적을 담았습니다.');
    setServerSaved(false);

    const session = getSession();
    if (session?.accessToken) {
      try {
        const res = await fetch(`${apiBaseUrl}/quotes/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            title: quote.title,
            purpose: quote.input.purpose,
            budget: quote.input.budget,
            subtotal: quote.subtotal,
            assemblyFee: quote.assemblyFee,
            shippingFee: quote.shippingFee,
            windowsFee: quote.windowsFee,
            total: quote.total,
            parts: quote.parts,
            input: quote.input,
            compatibility: quote.compatibility,
          }),
        });
        if (res.ok) setServerSaved(true);
      } catch {
        // 서버 저장 실패 시 무시 (로컬 저장은 됨)
      }
    }
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
                href="/order"
              >
                바로 주문하기
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
      ) : mode === 'AUTO' ? (
        <PanelCard className="mx-auto w-full max-w-4xl md:p-6">
          <SectionHeader
            action={<Sparkles className="text-accent" size={28} />}
            description="예산, 용도, 게임만 정해도 JHS Computer 견적이 바로 생성됩니다."
            title="자동 견적 설문"
          />

          <div className="mt-6 grid gap-6">
            <label className="grid gap-2 bg-panel p-4 rounded-2xl border border-line">
              <span className="text-sm font-black text-brand">예산</span>
              <div className="flex items-center gap-3">
                <input
                  className="h-2 flex-1 accent-teal-700"
                  max={450}
                  min={80}
                  onChange={(event) => setInput({ ...input, budget: Number(event.target.value) })}
                  step={10}
                  type="range"
                  value={input.budget}
                />
                <output className="w-24 rounded-xl border border-line bg-white px-3 py-2 text-right font-black shadow-sm">
                  {input.budget}만원
                </output>
              </div>
            </label>

            <ChoiceGroup label="용도" options={purposes} value={input.purpose} onChange={(purpose) => setInput({ ...input, purpose })} />
            <ChoiceGroup label="목표 해상도" options={resolutions} value={input.resolution} onChange={(resolution) => setInput({ ...input, resolution })} />
            <ChoiceGroup label="부품 우선순위" options={priorities} value={input.priority} onChange={(priority) => setInput({ ...input, priority })} />

            <div className="grid gap-2">
              <span className="text-sm font-black">주로 하는 게임</span>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {gameOptions.map((game) => (
                  <button
                    className={`rounded-xl border px-3 py-2 text-sm font-bold transition shadow-sm ${
                      selectedGames.has(game) ? 'border-accent bg-amber-50 text-accent' : 'border-line bg-white hover:border-accent hover:text-accent'
                    }`}
                    key={game}
                    onClick={() => {
                      const nextGames = selectedGames.has(game)
                        ? input.games.filter((item) => item !== game)
                        : [...input.games, game].slice(-3);
                      setInput({ ...input, games: nextGames.length ? nextGames : [game] });
                    }}
                    type="button"
                  >
                    {game}
                  </button>
                ))}
              </div>
              {!gameOptions.length && (
                <div className="rounded-xl border border-dashed border-line bg-panel p-4 text-sm font-bold text-slate-500">
                  벤치마크 DB 게임 목록을 불러오는 중입니다. DB 연결이 없으면 더미 게임 목록은 표시하지 않습니다.
                </div>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2 border-t border-line/50 pt-6">
              <FormField label="저장 용량">
                <SelectInput
                  className="h-12 shadow-sm"
                  onChange={(event) => setInput({ ...input, storage: event.target.value as QuoteInput['storage'] })}
                  value={input.storage}
                >
                  <option>500GB</option>
                  <option>1TB</option>
                  <option>2TB</option>
                </SelectInput>
              </FormField>
              <FormField label="윈도우 설치 여부">
                <WindowsOptionGroup
                  value={normalizeWindowsOption(input.windows)}
                  onChange={(windows) => setInput({ ...input, windows })}
                />
              </FormField>
            </div>

            <Button
              className="mt-2 h-14 w-full text-lg shadow-md"
              onClick={handleGenerateAuto}
              type="button"
              variant="dark"
            >
              자동 견적 생성하기
              <ChevronRight size={20} />
            </Button>
          </div>
        </PanelCard>
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
          onUpdateInput={(newInput) => setInput({ ...input, ...newInput })}
          onGenerate={handleGenerateAuto}
        />
      )}
    </AppShell>
  );
}

function WindowsOptionGroup({
  value,
  onChange,
}: {
  value: WindowsOptionValue;
  onChange: (value: WindowsOptionValue) => void;
}) {
  return (
    <div className="grid gap-2">
      {windowsOptions.map((option) => {
        const selected = value === option.value;
        return (
          <button
            className={`grid gap-1 rounded-xl border p-3 text-left transition ${
              selected ? 'border-brand bg-teal-50 text-brand shadow-sm' : 'border-line bg-white text-slate-700 hover:border-brand'
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <span className="flex items-start gap-2">
              <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${selected ? 'border-brand bg-brand' : 'border-slate-300 bg-white'}`}>
                {selected && <Check size={12} className="text-white" />}
              </span>
              <span className="min-w-0">
                <span className="safe-break block text-sm font-black">{option.label}</span>
                <span className="safe-break mt-0.5 block text-xs font-bold text-slate-500">{option.description}</span>
              </span>
            </span>
            <span className="pl-6 text-sm font-black">{option.price ? `+${option.price.toLocaleString()}원` : '추가금 없음'}</span>
          </button>
        );
      })}
    </div>
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
      spec: part.memo ?? '',
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

function ChoiceGroup<T extends Purpose | Resolution | Priority>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-black">{label}</span>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {options.map((option) => (
          <button
            className={`min-w-0 rounded-xl border px-2 py-2.5 text-sm font-bold leading-5 transition shadow-sm sm:px-3 ${
              value === option ? 'border-brand bg-brand text-white' : 'border-line bg-white text-slate-700 hover:border-brand hover:text-brand'
            }`}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
