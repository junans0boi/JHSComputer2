'use client';

import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { PartDetailModal } from '@/components/PartDetailModal';
import { ComparePartsPanel } from '@/components/parts/ComparePartsPanel';
import { PartProductCard } from '@/components/parts/PartProductCard';
import { Button, LinkButton } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageStack, PanelCard, SectionHeader } from '@/components/ui/PanelCard';
import { SelectInput } from '@/components/ui/FormField';
import { compuzoneCatalog, partCategories } from '@/lib/compuzone-catalog';
import { emptyPartFilters, filterParts, getCompatibilityHint, getFilterOptions, type PartFilterState } from '@/lib/part-filters';
import { syncCartQuoteToServer } from '@/lib/server-cart';
import { loadServerCatalog } from '@/lib/server-parts';
import { withDbPerformance } from '@/lib/server-performance';
import { addQuoteToCart, loadManualQuantities, loadManualSelection, saveManualQuantities, selectManualPart } from '@/lib/v1-storage';
import { buildCompatibility, defaultInput } from '@/lib/v1-estimator';
import type { CatalogPart, ManualSelection, PartCategory, Quote } from '@/lib/v1-types';

const filterLayout: Record<
  PartCategory,
  {
    chips: Array<'manufacturers' | 'sockets' | 'memoryTypes' | 'formFactors'>;
    price: boolean;
    watt: boolean;
  }
> = {
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

export default function PartsPage() {
  const [selectedCategory, setSelectedCategory] = useState<PartCategory>('CPU');
  const [keyword, setKeyword] = useState('');
  const [lastAdded, setLastAdded] = useState<string>();
  const [compareParts, setCompareParts] = useState<CatalogPart[]>([]);
  const [filters, setFilters] = useState<PartFilterState>(emptyPartFilters);
  const [manualSelection, setManualSelection] = useState<ManualSelection>({});
  const [detailPart, setDetailPart] = useState<CatalogPart | null>(null);
  const [catalog, setCatalog] = useState<CatalogPart[]>(compuzoneCatalog);
  const [catalogSource, setCatalogSource] = useState<'DB' | 'LOCAL'>('LOCAL');
  const [sortOrder, setSortOrder] = useState<SortOrder>('POPULAR');
  const [quantityByPartId, setQuantityByPartId] = useState<Record<string, number>>({});
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') as PartCategory | null;
    if (category && partCategories.includes(category)) setSelectedCategory(category);
    setManualSelection(loadManualSelection());
    loadServerCatalog()
      .then((items) => {
        if (!items.length) return;
        setCatalog(items);
        setCatalogSource('DB');
      })
      .catch(() => setCatalogSource('LOCAL'));
  }, []);

  useEffect(() => {
    setFilters((current) => ({ ...emptyPartFilters, compatibleOnly: current.compatibleOnly }));
  }, [selectedCategory]);

  const categoryParts = useMemo(() => catalog.filter((part) => part.category === selectedCategory), [catalog, selectedCategory]);
  const options = useMemo(() => getFilterOptions(categoryParts), [categoryParts]);
  const currentFilterLayout = filterLayout[selectedCategory];

  const parts = useMemo(() => {
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
  }, [categoryParts, filters, keyword, manualSelection, sortOrder]);

  const handleAdd = async (part: CatalogPart) => {
    const nextSelection = selectManualPart(part);
    const quantity = quantityByPartId[part.id] ?? 1;
    const nextQuantities = { ...quantityByPartId, [part.id]: quantity };
    saveManualQuantities({ ...loadManualQuantities(), [part.category]: quantity });
    setManualSelection(nextSelection);
    setLastAdded(part.id);
    setQuantityByPartId(nextQuantities);

    const quote = await withDbPerformance(buildPartsCartQuote(nextSelection, nextQuantities));
    addQuoteToCart(quote);
    await syncCartQuoteToServer(quote).catch(() => false);
    setCartMessage(`${part.name} ${quantity}개를 장바구니에 담았습니다.`);

    const currentIndex = partCategories.indexOf(part.category);
    const nextCategory = partCategories[currentIndex + 1];
    if (nextCategory) {
      setSelectedCategory(nextCategory);
      window.history.replaceState(null, '', `/parts?category=${encodeURIComponent(nextCategory)}`);
    }
  };

  const selectedCount = Object.keys(manualSelection).length;
  const toggleCompare = (part: CatalogPart) => {
    setCompareParts((current) => {
      if (current.some((item) => item.id === part.id)) return current.filter((item) => item.id !== part.id);
      return [...current, part].slice(-3);
    });
  };

  return (
    <AppShell>
      {detailPart && <PartDetailModal part={detailPart} onClose={() => setDetailPart(null)} />}
      <PageStack>
        <PanelCard>
          <div className="flex flex-col justify-between gap-4 border-b border-line pb-4 md:flex-row md:items-end">
            <SectionHeader
              action={<LinkButton href="/quote?mode=manual">수동 견적 보기</LinkButton>}
              description={catalogSource === 'DB' ? 'DB에 적재된 컴퓨존 최신 수집 가격 기준입니다.' : '컴퓨존 수집 샘플 가격 기준입니다.'}
              title="카테고리별 부품"
            />
          </div>

          <div className="mt-5 grid gap-4">
            <div className="flex flex-wrap gap-2">
              {partCategories.map((category) => (
                <button
                  className={`rounded-xl border px-4 py-2 text-sm font-black transition ${
                    selectedCategory === category ? 'border-brand bg-teal-50 text-brand shadow-sm' : 'border-line bg-white text-slate-600 hover:border-brand'
                  }`}
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    window.history.replaceState(null, '', `/parts?category=${encodeURIComponent(category)}`);
                  }}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>

            <label className="flex h-12 items-center gap-2 rounded-xl border border-line bg-panel px-3 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition">
              <Search className="text-slate-400" size={18} />
              <input
                className="h-full flex-1 bg-transparent outline-none font-bold placeholder-slate-400"
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={`${selectedCategory} 안에서 검색`}
                value={keyword}
              />
            </label>

            <div className="rounded-2xl border border-line bg-panel p-4">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h3 className="font-black">{selectedCategory} 필터</h3>
                  <p className="mt-1 text-xs text-slate-600">
                    {selectedCount ? getCompatibilityHint(selectedCategory, manualSelection) : '필터를 적용하여 원하는 부품을 빠르게 찾아보세요.'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-xs font-black text-brand hover:underline" onClick={() => setFilters(emptyPartFilters)} type="button">
                    필터 초기화
                  </button>
                  <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-black shadow-sm border border-line cursor-pointer hover:border-brand transition">
                    <input
                      checked={filters.compatibleOnly}
                      className="accent-teal-700 w-4 h-4 cursor-pointer"
                      onChange={(event) => setFilters({ ...filters, compatibleOnly: event.target.checked })}
                      type="checkbox"
                    />
                    수동 견적 호환만
                  </label>
                </div>
              </div>

              <div className="mt-4 flex flex-col lg:flex-row gap-4">
                {/* 칩 필터 영역 */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentFilterLayout.chips.map((key) => (
                    <FilterDropdown
                      key={key}
                      label={chipLabels[key]}
                      options={options[key]}
                      selected={filters[key]}
                      onChange={(selected) => setFilters({ ...filters, [key]: selected })}
                    />
                  ))}
                </div>

                {/* 가격/W 입력 영역 (더 콤팩트하게) */}
                <div className="flex flex-col gap-3 min-w-[280px]">
                  {currentFilterLayout.price && (
                    <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-xl border border-line">
                      <NumberInput label="최소 가격" value={filters.minPrice} onChange={(minPrice) => setFilters({ ...filters, minPrice })} />
                      <NumberInput label="최대 가격" value={filters.maxPrice} onChange={(maxPrice) => setFilters({ ...filters, maxPrice })} />
                    </div>
                  )}
                  {currentFilterLayout.watt && (
                    <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-xl border border-line">
                      <NumberInput label="최소 W" value={filters.minWatt} onChange={(minWatt) => setFilters({ ...filters, minWatt })} />
                      <NumberInput label="최대 W" value={filters.maxWatt} onChange={(maxWatt) => setFilters({ ...filters, maxWatt })} />
                    </div>
                  )}
                  {options.wattages.length > 0 && selectedCategory === '파워' && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {options.wattages.slice(0, 5).map((wattage) => (
                        <button
                          className="rounded-lg bg-white border border-line px-2 py-1 text-[11px] font-black hover:border-brand hover:text-brand transition"
                          key={wattage}
                          onClick={() => setFilters({ ...filters, minWatt: String(wattage), maxWatt: '' })}
                          type="button"
                        >
                          {wattage}W 이상
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </PanelCard>

        <ComparePartsPanel onClear={() => setCompareParts([])} onToggle={toggleCompare} parts={compareParts} />

        {cartMessage && (
          <PanelCard className="border-emerald-200 bg-emerald-50 text-sm font-black text-emerald-700">
            {cartMessage}
            <Link className="ml-2 underline underline-offset-2" href="/mypage/cart">
              장바구니 보기
            </Link>
          </PanelCard>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <span className="text-sm font-bold text-slate-600">
            <strong className="text-slate-900">{parts.length.toLocaleString()}개</strong> 표시 / 전체 {categoryParts.length.toLocaleString()}개
          </span>
          <SelectInput
            className="h-10 cursor-pointer text-slate-700 hover:border-brand"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          >
            <option value="POPULAR">인기상품순</option>
            <option value="PRICE_LOW">낮은 가격순</option>
            <option value="PRICE_HIGH">높은 가격순</option>
            <option value="NEW">신상품순</option>
            <option value="REVIEW">상품평 많은 순</option>
          </SelectInput>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {parts.map((part) => {
            const compared = compareParts.some((item) => item.id === part.id);
            return (
              <PartProductCard
                compared={compared}
                key={part.id}
                lastAdded={lastAdded === part.id}
                onAdd={handleAdd}
                onCompare={toggleCompare}
                onDetail={setDetailPart}
                onQuantityChange={(quantity) => setQuantityByPartId((current) => ({ ...current, [part.id]: quantity }))}
                part={part}
                quantity={quantityByPartId[part.id] ?? 1}
              />
            );
          })}
        </div>
        {!parts.length && (
          <EmptyState
            action={<Button onClick={() => setFilters(emptyPartFilters)} type="button" variant="outline">필터 초기화</Button>}
            description="필터를 줄이거나 `수동 견적 호환만`을 꺼보세요."
            icon={<Search size={32} />}
            title="조건에 맞는 부품이 없습니다."
          />
        )}
      </PageStack>
    </AppShell>
  );
}

function buildPartsCartQuote(selection: ManualSelection, quantities: Record<string, number>): Quote {
  const parts = partCategories.flatMap((category) => {
    const part = selection[category];
    if (!part) return [];
    const quantity = quantities[part.id] ?? 1;
    return [{
      category: part.category,
      name: part.name,
      memo: quantity > 1 ? `${part.spec || '컴퓨존 카탈로그 선택'} · 수량 ${quantity}개` : part.spec || '컴퓨존 카탈로그 선택',
      price: part.price * quantity,
      quantity,
      supplier: '컴퓨존 샘플 기준',
      productNo: part.productNo,
      imageUrl: part.imageUrl,
      detailUrl: part.detailUrl,
    }];
  });
  const subtotal = parts.reduce((sum, part) => sum + part.price, 0);
  const shippingFee = subtotal > 0 ? 10000 : 0;
  return {
    id: 'Q-PARTS-ACTIVE',
    createdAt: new Date().toISOString(),
    title: `부품 쇼핑 · ${parts.length}개 품목`,
    mode: 'MANUAL',
    input: defaultInput,
    parts,
    performance: [],
    compatibility: buildCompatibility(parts),
    subtotal,
    assemblyFee: 0,
    shippingFee,
    windowsFee: 0,
    total: subtotal + shippingFee,
    status: 'DRAFT',
  };
}

function FilterDropdown({
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
    <div className="grid gap-1.5">
      <span className="text-[11px] font-black text-slate-500 ml-1">{label}</span>
      <div className="relative">
        <select 
          className="w-full h-10 appearance-none rounded-xl border border-line bg-white px-3 pr-8 text-xs font-bold text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition cursor-pointer"
          onChange={(e) => {
            const val = e.target.value;
            if (val === '') onChange([]);
            else if (!selected.includes(val)) onChange([...selected, val]);
          }}
          value=""
        >
          <option value="">{selected.length ? `${selected.length}개 선택됨 (+ 추가)` : '전체 보기'}</option>
          {options.map(opt => (
            <option key={opt} value={opt} disabled={selected.includes(opt)}>{opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {selected.map((option) => (
            <span key={option} className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-1 text-[10px] font-black text-brand border border-brand/20">
              {option}
              <button 
                type="button" 
                className="hover:text-red-500 transition-colors"
                onClick={() => onChange(selected.filter(item => item !== option))}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-black text-slate-500 whitespace-nowrap min-w-[36px]">{label}</span>
      <input
        className="h-8 flex-1 w-full rounded-lg border border-line bg-slate-50 px-2 text-xs font-bold outline-none focus:border-brand focus:bg-white transition"
        min={0}
        onChange={(event) => onChange(event.target.value)}
        placeholder="입력"
        type="number"
        value={value}
      />
    </div>
  );
}
