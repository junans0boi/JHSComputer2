'use client';

import { Search, Trash2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import { PartSearchDialog } from '@/components/builder/PartSearchDialog';
import { useBuilderStore } from '@/lib/builder-store';
import { partCategories } from '@/lib/compuzone-catalog';
import { generateManualQuote } from '@/lib/v1-estimator';
import type { PartCategory, QuoteInput } from '@/lib/v1-types';

export function CurrentBuildPanel({
  input,
  onGenerate,
}: {
  input: QuoteInput;
  onGenerate: () => void;
}) {
  const { manualSelection, manualQuantities, activeCategory, setActiveCategory, removePart, replacePart, setPartQuantity } = useBuilderStore();
  const [replaceCategory, setReplaceCategory] = useState<PartCategory | null>(null);

  const handleRemove = (e: MouseEvent, category: typeof partCategories[number]) => {
    e.stopPropagation();
    removePart(category);
  };

  const totalPrice = Object.values(manualSelection).reduce((sum, part) => sum + (part?.price || 0) * (manualQuantities[part?.category as PartCategory] ?? 1), 0);
  const selectedCount = Object.keys(manualSelection).length;
  const isComplete = selectedCount > 0; // Or define minimum required parts (CPU, MB, RAM, PW, Case)

  // Generate a temporary quote to check compatibility
  const tempQuote = generateManualQuote(manualSelection, input, manualQuantities);
  const hasCompatibilityFail = tempQuote.compatibility.some((item) => item.startsWith('실패:'));

  return (
    <div className="flex flex-col gap-4">
      {replaceCategory && (
        <PartSearchDialog
          category={replaceCategory}
          manualSelection={manualSelection}
          onClose={() => setReplaceCategory(null)}
          onSelect={(part) => {
            replacePart(replaceCategory, part);
            setReplaceCategory(null);
          }}
        />
      )}
      <div className="rounded-2xl border border-line bg-white shadow-soft overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-line flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-800">현재 구성</h3>
            <p className="text-xs font-bold text-slate-500 mt-1">{selectedCount}개 부품 선택됨</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-slate-500">부품 합계</div>
            <div className="text-xl font-black text-brand tracking-tight">{totalPrice.toLocaleString()}원</div>
          </div>
        </div>

        <div className="p-2 grid gap-1">
          {partCategories.map((category) => {
            const part = manualSelection[category];
            const isActive = activeCategory === category;
            
            return (
              <div
                key={category}
                role="button"
                tabIndex={0}
                onClick={() => setActiveCategory(category)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveCategory(category);
                  }
                }}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all border ${
                  isActive
                    ? 'border-brand bg-teal-50 ring-1 ring-brand/20 shadow-sm'
                    : part
                    ? 'border-transparent bg-white hover:bg-slate-50 hover:border-line'
                    : 'border-dashed border-line bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className={`w-12 text-xs font-black shrink-0 ${isActive ? 'text-brand' : 'text-slate-500'}`}>
                  {category}
                </div>
                
                <div className="flex-1 min-w-0">
                  {part ? (
                    <>
                      <div className="part-name text-sm text-slate-800">{part.name}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                        <span>{(part.price * (manualQuantities[category] ?? 1)).toLocaleString()}원</span>
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5">{manualQuantities[category] ?? 1}개</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm font-bold text-slate-400">부품을 선택해주세요</div>
                  )}
                </div>

                {part ? (
                  <div className="flex shrink-0 items-center gap-1">
                    <div
                      onClick={(event) => event.stopPropagation()}
                      className="flex items-center gap-1 rounded-lg border border-line bg-white px-1 py-1"
                    >
                      <button
                        className="grid h-6 w-6 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          setPartQuantity(category, Math.max(1, (manualQuantities[category] ?? 1) - 1));
                        }}
                        type="button"
                      >
                        -
                      </button>
                      <input
                        className="h-6 w-10 text-center text-xs font-black outline-none"
                        min={1}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => setPartQuantity(category, Math.max(1, Number(event.target.value) || 1))}
                        type="number"
                        value={manualQuantities[category] ?? 1}
                      />
                      <button
                        className="grid h-6 w-6 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          setPartQuantity(category, (manualQuantities[category] ?? 1) + 1);
                        }}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setReplaceCategory(category);
                      }}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-teal-50 hover:text-brand"
                      title="부품 검색/교체"
                    >
                      <Search size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, category)}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      title="부품 삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div className={`p-1.5 rounded-full shrink-0 ${isActive ? 'bg-brand text-white' : 'bg-slate-200 text-white'}`}>
                    <ChevronRight size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={18} className={hasCompatibilityFail ? 'text-red-500' : 'text-emerald-500'} />
          <h4 className="font-black text-sm text-slate-800">호환성 체크</h4>
        </div>
        <div className="grid gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          {tempQuote.compatibility.length > 0 ? (
             tempQuote.compatibility.map((item, idx) => (
              <div 
                key={idx} 
                className={`text-xs font-bold p-2 rounded-lg ${
                  item.startsWith('실패:') ? 'bg-red-50 text-red-700' :
                  item.startsWith('확인필요:') ? 'bg-amber-50 text-amber-700' :
                  'bg-emerald-50 text-emerald-700'
                }`}
              >
                {item}
              </div>
            ))
          ) : (
            <div className="text-xs font-bold text-slate-400 text-center py-2">
              부품을 담으면 호환성을 검사합니다.
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={!isComplete || hasCompatibilityFail}
        className={`flex h-14 items-center justify-center gap-2 rounded-xl px-4 text-lg font-black transition shadow-md ${
          !isComplete
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : hasCompatibilityFail
            ? 'bg-red-100 text-red-500 cursor-not-allowed'
            : 'bg-ink text-white hover:bg-brand'
        }`}
      >
        견적 완성하기
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
