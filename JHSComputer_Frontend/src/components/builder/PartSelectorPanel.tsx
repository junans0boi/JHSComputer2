'use client';

import { Search, X, Plus, Cpu, Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useBuilderStore } from '@/lib/builder-store';
import { loadServerCatalog } from '@/lib/server-parts';
import { filterParts, getFilterOptions, getIncompatibilityReason, getCompatibilityHint } from '@/lib/part-filters';
import { getProductStatus, statusClass } from '@/lib/common-codes';
import type { CatalogPart, PartCategory } from '@/lib/v1-types';

const filterLayout: Record<PartCategory, { chips: Array<'manufacturers' | 'sockets' | 'memoryTypes' | 'formFactors'>; price: boolean; watt: boolean; }> = {
  CPU: { chips: ['manufacturers', 'sockets'], price: true, watt: false },
  메인보드: { chips: ['manufacturers', 'sockets', 'memoryTypes', 'formFactors'], price: true, watt: false },
  RAM: { chips: ['manufacturers', 'memoryTypes'], price: true, watt: false },
  그래픽카드: { chips: ['manufacturers'], price: true, watt: false },
  SSD: { chips: ['manufacturers', 'formFactors'], price: true, watt: false },
  파워: { chips: ['manufacturers'], price: true, watt: true },
  케이스: { chips: ['manufacturers', 'formFactors'], price: true, watt: false },
  쿨러: { chips: ['manufacturers', 'sockets'], price: true, watt: false },
};

const chipLabels = {
  manufacturers: '제조사',
  sockets: '소켓',
  memoryTypes: '메모리',
  formFactors: '규격',
};

type SortOrder = 'POPULAR' | 'PRICE_LOW' | 'PRICE_HIGH' | 'NEW' | 'REVIEW';

export function PartSelectorPanel() {
  const { activeCategory, keyword, filters, manualSelection, catalog, setKeyword, setFilters, selectPart, setActiveCategory, setCatalog } = useBuilderStore();
  const [sortOrder, setSortOrder] = useState<SortOrder>('POPULAR');

  useEffect(() => {
    loadServerCatalog()
      .then((items) => {
        if (items.length) setCatalog(items);
      })
      .catch(() => {});
  }, [setCatalog]);

  const categoryParts = useMemo(() => activeCategory ? catalog.filter((part) => part.category === activeCategory) : [], [catalog, activeCategory]);
  const options = useMemo(() => getFilterOptions(categoryParts), [categoryParts]);
  const currentFilterLayout = activeCategory ? filterLayout[activeCategory] : null;

  const parts = useMemo(() => {
    if (!activeCategory) return [];
    const normalizedKeyword = keyword.trim().toLowerCase();
    const filtered = filterParts(categoryParts, filters, manualSelection)
      .filter((part) => !normalizedKeyword || `${part.name} ${part.spec}`.toLowerCase().includes(normalizedKeyword));
      
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'PRICE_LOW': return a.price - b.price;
        case 'PRICE_HIGH': return b.price - a.price;
        case 'REVIEW': return b.reviewCount - a.reviewCount;
        case 'NEW': return Number(b.productNo) - Number(a.productNo);
        case 'POPULAR': return b.reviewCount - a.reviewCount;
        default: return 0;
      }
    });
  }, [activeCategory, categoryParts, filters, keyword, manualSelection, sortOrder]);

  if (!activeCategory || !currentFilterLayout) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-2xl border-2 border-dashed border-line bg-slate-50/50">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <Cpu size={32} className="text-slate-300" />
        </div>
        <p className="text-slate-500 font-bold text-sm">좌측에서 부품 카테고리를 선택해주세요.</p>
      </div>
    );
  }

  const compatibilityHint = getCompatibilityHint(activeCategory, manualSelection);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header & Search */}
      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft sticky top-2 z-10">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-black flex items-center gap-2">
            {activeCategory} 선택
            <span className="text-xs font-bold bg-teal-50 text-brand px-2 py-1 rounded-full border border-brand/20">
              {parts.length.toLocaleString()}개
            </span>
          </h2>
          <button 
            onClick={() => setActiveCategory(null)}
            className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <label className="flex h-12 items-center gap-2 rounded-xl border border-line bg-panel px-3 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition">
          <Search className="text-slate-400" size={18} />
          <input
            className="h-full flex-1 bg-transparent outline-none font-bold placeholder-slate-400 text-sm"
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={`${activeCategory} 검색 (예: RTX 4060)`}
            value={keyword}
          />
        </label>
        
        {compatibilityHint && (
          <div className="mt-3 flex items-start gap-2 bg-blue-50 text-blue-700 p-2.5 rounded-xl border border-blue-100 text-xs font-bold leading-relaxed">
            <Info size={14} className="shrink-0 mt-0.5" />
            {compatibilityHint}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-sm text-slate-800">상세 필터</h3>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input
                checked={filters.compatibleOnly}
                className="accent-teal-700 w-3.5 h-3.5 cursor-pointer"
                onChange={(event) => setFilters({ ...filters, compatibleOnly: event.target.checked })}
                type="checkbox"
              />
              <span className="text-xs font-black text-slate-600 group-hover:text-brand transition">호환되는 부품만</span>
            </label>
            <div className="w-px h-3 bg-line"></div>
            <button className="text-xs font-black text-slate-400 hover:text-slate-600 transition" onClick={() => setFilters((prev) => ({ compatibleOnly: prev.compatibleOnly, ...getEmptyFilters() }))}>
              초기화
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentFilterLayout.chips.map((key) => (
            <FilterSelect
              key={key}
              label={chipLabels[key]}
              options={options[key]}
              selected={filters[key]}
              onChange={(selected) => setFilters({ ...filters, [key]: selected })}
            />
          ))}
          {/* Prices/Watts can be added here if needed, keeping it minimal for builder UX */}
        </div>
      </div>

      {/* Part List Controls */}
      <div className="flex justify-end">
        <select 
          className="h-9 rounded-xl border border-line bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-brand cursor-pointer hover:border-brand transition shadow-sm"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
        >
          <option value="POPULAR">인기상품순</option>
          <option value="PRICE_LOW">낮은 가격순</option>
          <option value="PRICE_HIGH">높은 가격순</option>
          <option value="NEW">신상품순</option>
          <option value="REVIEW">리뷰 많은 순</option>
        </select>
      </div>

      {/* Part List */}
      <div className="grid gap-3">
        {parts.map((part) => {
          const status = getProductStatus(part);
          const isSelected = manualSelection[activeCategory]?.id === part.id;
          const incompatibilityReason = !filters.compatibleOnly ? getIncompatibilityReason(part, manualSelection) : null;
          const isBlocked = incompatibilityReason !== null;

          return (
            <div 
              key={part.id} 
              className={`flex gap-4 p-3 rounded-2xl border transition-all group relative ${
                isSelected ? 'border-brand bg-teal-50 shadow-sm' : 
                isBlocked ? 'border-line/50 bg-slate-50/50 opacity-60' :
                'border-line bg-white hover:border-brand hover:shadow-md cursor-pointer'
              }`}
              onClick={() => !isBlocked && selectPart(activeCategory, part)}
            >
              <div className="w-20 h-20 shrink-0 bg-white rounded-xl p-1 border border-line flex items-center justify-center">
                <img src={part.imageUrl} alt={part.name} className={`max-w-full max-h-full object-contain mix-blend-multiply ${isBlocked ? 'grayscale' : ''}`} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={`part-name text-sm ${isSelected ? 'text-brand' : isBlocked ? 'text-slate-500' : 'group-hover:text-brand transition-colors'}`}>
                      {part.name}
                    </h4>
                    {isSelected && <span className="shrink-0 bg-brand text-white text-[10px] px-2 py-0.5 rounded-full font-black">선택됨</span>}
                  </div>
                  <p className="part-spec text-[11px] font-bold text-slate-500">{part.spec}</p>
                  {isBlocked && (
                    <div className="part-spec mt-1 text-[11px] font-black text-red-500">
                      불가: {incompatibilityReason}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className={`text-base font-black tracking-tight ${isBlocked ? 'text-slate-500' : 'text-slate-900'}`}>
                    {part.price.toLocaleString()}원
                  </div>
                  <div className="flex gap-2">
                     <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-black ${isBlocked ? 'border-slate-200 text-slate-400 bg-white' : statusClass(status.code)}`}>
                        {status.nameKo}
                      </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {parts.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed border-line rounded-2xl bg-white">
             <p className="text-sm font-bold text-slate-500">조건에 맞는 부품이 없습니다.</p>
             <button 
               className="mt-3 text-xs font-black text-brand bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition"
               onClick={() => setFilters((prev) => ({ ...getEmptyFilters(), compatibleOnly: false }))}
             >
               필터 및 호환성 체크 해제
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

function getEmptyFilters() {
  return {
    manufacturers: [], sockets: [], memoryTypes: [], formFactors: [],
    minPrice: '', maxPrice: '', minWatt: '', maxWatt: ''
  };
}

function FilterSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  if (!options.length) return null;
  return (
    <div className="relative group/select">
      <select 
        className="h-8 appearance-none rounded-lg border border-line bg-slate-50 px-3 pr-7 text-xs font-bold text-slate-600 outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition cursor-pointer hover:bg-white"
        onChange={(e) => {
          const val = e.target.value;
          if (val === '') onChange([]);
          else if (!selected.includes(val)) onChange([...selected, val]);
        }}
        value=""
      >
        <option value="">{label} {selected.length ? `(${selected.length})` : ''}</option>
        {options.map(opt => (
          <option key={opt} value={opt} disabled={selected.includes(opt)}>{opt}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 group-hover/select:text-brand transition">
        <svg className="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
}
