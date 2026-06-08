'use client';

import { ChevronRight, ShoppingCart, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { QuoteSummary } from '@/components/QuoteSummary';
import { partCategories } from '@/lib/compuzone-catalog';
import { defaultInput, games, generateManualQuote, generateQuote, priorities, purposes, resolutions } from '@/lib/v1-estimator';
import { addQuoteToCart, loadLatestQuote, loadManualSelection, removeManualPart, saveQuote } from '@/lib/v1-storage';
import type { ManualSelection, PartCategory, Priority, Purpose, Quote, QuoteInput, Resolution } from '@/lib/v1-types';

export default function QuotePage() {
  const [input, setInput] = useState<QuoteInput>(defaultInput);
  const [quote, setQuote] = useState<Quote>();
  const [mode, setMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [manualSelection, setManualSelection] = useState<ManualSelection>({});
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'manual') setMode('MANUAL');
    const latestQuote = loadLatestQuote();
    setQuote(latestQuote ?? generateQuote(defaultInput));
    setManualSelection(loadManualSelection());
  }, []);

  const selectedGames = new Set(input.games);
  const hasCompatibilityFail = quote?.compatibility.some((item) => item.startsWith('실패:')) ?? false;

  const handleGenerate = () => {
    const nextQuote = generateQuote(input);
    saveQuote(nextQuote);
    setQuote(nextQuote);
  };

  const handleBuildManualQuote = () => {
    const nextQuote = generateManualQuote(manualSelection, input);
    saveQuote(nextQuote);
    setQuote(nextQuote);
    setMode('MANUAL');
  };

  const handleRemoveManualPart = (category: PartCategory) => {
    setManualSelection(removeManualPart(category));
  };

  const handleAddCart = () => {
    if (!quote) return;
    addQuoteToCart(quote);
    setCartMessage('장바구니에 견적을 담았습니다.');
  };

  return (
    <AppShell>
      <section className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <h2 className="text-xl font-black">견적 설문</h2>
              <p className="mt-1 text-sm text-slate-600">예산, 용도, 게임만 정해도 v1 견적이 바로 생성됩니다.</p>
            </div>
            <Sparkles className="text-accent" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-panel p-2">
            <button
              className={`rounded-xl px-4 py-3 font-black transition ${mode === 'AUTO' ? 'bg-white text-brand shadow-sm' : 'text-slate-600'}`}
              onClick={() => setMode('AUTO')}
              type="button"
            >
              자동 견적
            </button>
            <button
              className={`rounded-xl px-4 py-3 font-black transition ${mode === 'MANUAL' ? 'bg-white text-brand shadow-sm' : 'text-slate-600'}`}
              onClick={() => {
                setManualSelection(loadManualSelection());
                setMode('MANUAL');
              }}
              type="button"
            >
              수동 견적
            </button>
          </div>

          <div className="mt-5 grid gap-5">
            {mode === 'AUTO' && (
              <label className="grid gap-2">
                <span className="text-sm font-black">예산</span>
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
                  <output className="w-24 rounded-xl border border-line bg-panel px-3 py-2 text-right font-black">
                    {input.budget}만원
                  </output>
                </div>
              </label>
            )}

            <ChoiceGroup
              label="용도"
              options={purposes}
              value={input.purpose}
              onChange={(purpose) => setInput({ ...input, purpose })}
            />
            <ChoiceGroup
              label="해상도"
              options={resolutions}
              value={input.resolution}
              onChange={(resolution) => setInput({ ...input, resolution })}
            />
            <ChoiceGroup
              label="우선순위"
              options={priorities}
              value={input.priority}
              onChange={(priority) => setInput({ ...input, priority })}
            />

            <div className="grid gap-2">
              <span className="text-sm font-black">게임</span>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {games.map((game) => (
                  <button
                    className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                      selectedGames.has(game) ? 'border-accent bg-amber-50 text-accent' : 'border-line bg-white hover:border-accent'
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
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-black">저장 용량</span>
                <select
                  className="h-12 rounded-xl border border-line bg-white px-3"
                  onChange={(event) => setInput({ ...input, storage: event.target.value as QuoteInput['storage'] })}
                  value={input.storage}
                >
                  <option>500GB</option>
                  <option>1TB</option>
                  <option>2TB</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-black">윈도우</span>
                <select
                  className="h-12 rounded-xl border border-line bg-white px-3"
                  onChange={(event) => setInput({ ...input, windows: event.target.value as QuoteInput['windows'] })}
                  value={input.windows}
                >
                  <option>포함</option>
                  <option>설치만</option>
                  <option>미포함</option>
                </select>
              </label>
            </div>

            {mode === 'MANUAL' && (
              <div className="rounded-2xl border border-line bg-panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black">선택한 부품</h3>
                    <p className="mt-1 text-sm text-slate-600">부품 페이지에서 카테고리별로 하나씩 담아 구성합니다.</p>
                  </div>
                  <Link className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-black hover:border-brand hover:text-brand" href="/parts">
                    부품 고르기
                  </Link>
                </div>
                <div className="mt-4 grid gap-2">
                  {partCategories.map((category) => {
                    const part = manualSelection[category];
                    return (
                      <div className="grid grid-cols-[84px_1fr_auto] items-center gap-3 rounded-xl border border-line bg-white p-3" key={category}>
                        <strong className="text-sm text-brand">{category}</strong>
                        {part ? (
                          <>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-black">{part.name}</div>
                              <div className="text-xs text-slate-500">{part.price.toLocaleString()}원</div>
                            </div>
                            <button className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" onClick={() => handleRemoveManualPart(category)} type="button">
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-slate-400">미선택</span>
                            <Link className="text-xs font-black text-brand" href={`/parts?category=${encodeURIComponent(category)}`}>
                              선택
                            </Link>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-ink px-4 font-black text-white transition hover:bg-brand"
              onClick={mode === 'AUTO' ? handleGenerate : handleBuildManualQuote}
              type="button"
            >
              {mode === 'AUTO' ? '자동 견적 생성하기' : '수동 견적 구성하기'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid gap-5">
          {quote && (
            <>
              <QuoteSummary compact quote={quote} />
              <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
                <h3 className="font-black">견적 총평</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{buildQuoteSummary(quote)}</p>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <button
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-brand bg-white px-4 font-black text-brand shadow-soft transition hover:bg-teal-50"
                  onClick={handleAddCart}
                  type="button"
                >
                  장바구니 담기
                  <ShoppingCart size={18} />
                </button>
                {hasCompatibilityFail ? (
                  <button
                    className="flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-300 px-4 font-black text-white shadow-soft"
                    disabled
                    type="button"
                  >
                    호환 실패로 주문 불가
                  </button>
                ) : (
                  <Link
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-4 font-black text-white shadow-soft transition hover:bg-ink"
                    href="/order"
                  >
                    바로 주문하기
                    <ChevronRight size={18} />
                  </Link>
                )}
              </div>
              {cartMessage && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-bold text-emerald-700">{cartMessage}</div>}
            </>
          )}
        </div>
      </section>
    </AppShell>
  );
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
            className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
              value === option ? 'border-brand bg-teal-50 text-brand' : 'border-line bg-white hover:border-brand'
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
