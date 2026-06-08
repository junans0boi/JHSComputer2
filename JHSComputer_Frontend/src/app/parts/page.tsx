'use client';

import { Plus, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { PartDetailModal } from '@/components/PartDetailModal';
import { compuzoneCatalog, partCategories } from '@/lib/compuzone-catalog';
import { getPartBadges, getProductStatus, statusClass } from '@/lib/common-codes';
import { emptyPartFilters, filterParts, getCompatibilityHint, getFilterOptions, getPartAttributes, type PartFilterState } from '@/lib/part-filters';
import { loadServerCatalog } from '@/lib/server-parts';
import { loadManualSelection, selectManualPart } from '@/lib/v1-storage';
import type { CatalogPart, ManualSelection, PartCategory } from '@/lib/v1-types';

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
    return filterParts(categoryParts, filters, manualSelection)
      .filter((part) => !normalizedKeyword || `${part.name} ${part.spec}`.toLowerCase().includes(normalizedKeyword))
      .sort((a, b) => a.price - b.price);
  }, [categoryParts, filters, keyword, manualSelection]);

  const handleAdd = (part: CatalogPart) => {
    setManualSelection(selectManualPart(part));
    setLastAdded(part.id);
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
      <section className="grid gap-5">
        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <div className="flex flex-col justify-between gap-4 border-b border-line pb-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-black">카테고리별 부품</h2>
              <p className="mt-1 text-sm text-slate-600">
                {catalogSource === 'DB' ? 'DB에 적재된 컴퓨존 최신 수집 가격 기준입니다.' : '컴퓨존 수집 샘플 가격 기준입니다.'}
              </p>
            </div>
            <Link className="rounded-xl bg-brand px-4 py-3 text-sm font-black text-white hover:bg-ink" href="/quote?mode=manual">
              수동 견적 보기
            </Link>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="flex flex-wrap gap-2">
              {partCategories.map((category) => (
                <button
                  className={`rounded-xl border px-4 py-2 text-sm font-black transition ${
                    selectedCategory === category ? 'border-brand bg-teal-50 text-brand' : 'border-line bg-white hover:border-brand'
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

            <label className="flex h-12 items-center gap-2 rounded-xl border border-line bg-panel px-3">
              <Search className="text-slate-400" size={18} />
              <input
                className="h-full flex-1 bg-transparent outline-none"
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={`${selectedCategory} 안에서 검색`}
                value={keyword}
              />
            </label>

            <div className="rounded-2xl border border-line bg-panel p-4">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h3 className="font-black">{selectedCategory} 필터</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedCount ? getCompatibilityHint(selectedCategory, manualSelection) : '제조사, 소켓, 메모리, 가격, W 수로 좁혀보세요.'}
                  </p>
                </div>
                <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-black">
                  <input
                    checked={filters.compatibleOnly}
                    className="accent-teal-700"
                    onChange={(event) => setFilters({ ...filters, compatibleOnly: event.target.checked })}
                    type="checkbox"
                  />
                  수동 견적 호환만
                </label>
              </div>

              <div className="mt-4 grid gap-4">
                <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
                  <div className="grid gap-3">
                    {currentFilterLayout.chips.map((key) => (
                      <FilterChips
                        key={key}
                        label={chipLabels[key]}
                        options={options[key]}
                        selected={filters[key]}
                        onChange={(selected) => setFilters({ ...filters, [key]: selected })}
                      />
                    ))}
                  </div>

                  <div className="grid gap-3 rounded-xl bg-white p-3">
                    {currentFilterLayout.price && (
                      <div className="grid grid-cols-2 gap-2">
                        <NumberInput label="최소 가격" value={filters.minPrice} onChange={(minPrice) => setFilters({ ...filters, minPrice })} />
                        <NumberInput label="최대 가격" value={filters.maxPrice} onChange={(maxPrice) => setFilters({ ...filters, maxPrice })} />
                      </div>
                    )}
                    {currentFilterLayout.watt && (
                      <div className="grid grid-cols-2 gap-2">
                        <NumberInput label="최소 W" value={filters.minWatt} onChange={(minWatt) => setFilters({ ...filters, minWatt })} />
                        <NumberInput label="최대 W" value={filters.maxWatt} onChange={(maxWatt) => setFilters({ ...filters, maxWatt })} />
                      </div>
                    )}
                    <div className="rounded-lg bg-panel px-3 py-2 text-xs font-bold text-slate-600">
                      {categoryFilterTip(selectedCategory)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {options.wattages.length > 0 && selectedCategory === '파워' && (
                    <>
                      {options.wattages.slice(0, 8).map((wattage) => (
                        <button
                          className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-black hover:border-brand hover:text-brand"
                          key={wattage}
                          onClick={() => setFilters({ ...filters, minWatt: String(wattage), maxWatt: '' })}
                          type="button"
                        >
                          {wattage}W 이상
                        </button>
                      ))}
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-slate-600">
                    {parts.length.toLocaleString()}개 표시 / 전체 {categoryParts.length.toLocaleString()}개
                  </span>
                  <button className="text-sm font-black text-brand" onClick={() => setFilters(emptyPartFilters)} type="button">
                    필터 초기화
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {compareParts.length > 0 && (
          <div className="rounded-2xl border border-brand bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-black">부품 비교</h3>
                <p className="mt-1 text-sm text-slate-600">최대 3개까지 가격, 재고, 주요 스펙을 비교합니다.</p>
              </div>
              <button className="rounded-xl border border-line px-3 py-2 text-sm font-black text-slate-500" onClick={() => setCompareParts([])} type="button">
                비우기
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {compareParts.map((part) => {
                const status = getProductStatus(part);
                return (
                  <div className="rounded-xl border border-line bg-panel p-3" key={part.id}>
                    <div className="flex items-start justify-between gap-2">
                      <strong className="line-clamp-2 text-sm">{part.name}</strong>
                      <button className="text-slate-400" onClick={() => toggleCompare(part)} type="button">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="mt-3 text-xl font-black text-brand">{part.price.toLocaleString()}원</div>
                    <span className={`mt-2 inline-flex rounded-full border px-2 py-1 text-xs font-black ${statusClass(status.code)}`}>{status.nameKo}</span>
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{part.spec}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {parts.map((part) => {
            const status = getProductStatus(part);
            const badges = getPartBadges(part);
            const compared = compareParts.some((item) => item.id === part.id);
            return (
            <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft" key={part.id}>
              <div className="grid grid-cols-[120px_1fr] gap-4 p-4">
                <div className="grid h-28 place-items-center rounded-xl bg-panel p-2">
                  <img alt={part.name} className="max-h-full max-w-full object-contain" src={part.imageUrl} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-brand">{part.category}</span>
                    <span className="text-xs text-slate-500">상품번호 {part.productNo}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className={`rounded-full border px-2 py-1 text-[11px] font-black ${statusClass(status.code)}`}>{status.nameKo}</span>
                    {badges.map((badge) => (
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-black text-amber-700" key={badge.code}>
                        {badge.nameKo}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-sm font-black leading-5">{part.name}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{part.spec}</p>
                  <SpecBadges part={part} />
                </div>
              </div>

              <div className="border-t border-line bg-panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-500">컴퓨존 기준가</div>
                    <div className="text-xl font-black text-brand">{part.price.toLocaleString()}원</div>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    후기 {part.reviewCount.toLocaleString()}개
                    <br />
                    평점 {part.reviewRate || '-'}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    className="flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-white text-sm font-black hover:border-brand hover:text-brand"
                    onClick={() => setDetailPart(part)}
                    type="button"
                  >
                    상세 스펙
                  </button>
                  <button
                    className={`flex h-10 items-center justify-center rounded-xl border text-sm font-black ${
                      compared ? 'border-brand bg-teal-50 text-brand' : 'border-line bg-white hover:border-brand hover:text-brand'
                    }`}
                    onClick={() => toggleCompare(part)}
                    type="button"
                  >
                    비교
                  </button>
                  <button
                    className={`flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-black text-white transition ${
                      lastAdded === part.id ? 'bg-accent' : 'bg-ink hover:bg-brand'
                    }`}
                    onClick={() => handleAdd(part)}
                    type="button"
                  >
                    <Plus size={15} />
                    {lastAdded === part.id ? '담김' : '수동 견적 담기'}
                  </button>
                </div>
              </div>
            </article>
            );
          })}
        </div>
        {!parts.length && (
          <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-slate-600">
            조건에 맞는 부품이 없습니다. 필터를 줄이거나 `수동 견적 호환만`을 꺼보세요.
          </div>
        )}
      </section>
    </AppShell>
  );
}

function FilterChips({
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
    <div className="grid gap-2">
      <span className="text-sm font-black">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              className={`rounded-full border px-3 py-1.5 text-xs font-black transition ${
                active ? 'border-brand bg-teal-50 text-brand' : 'border-line bg-white hover:border-brand'
              }`}
              key={option}
              onClick={() => onChange(active ? selected.filter((item) => item !== option) : [...selected, option])}
              type="button"
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black">{label}</span>
      <input
        className="h-11 rounded-xl border border-line bg-white px-3 outline-none focus:border-brand"
        min={0}
        onChange={(event) => onChange(event.target.value)}
        placeholder="전체"
        type="number"
        value={value}
      />
    </label>
  );
}

function SpecBadges({ part }: { part: CatalogPart }) {
  const attrs = getPartAttributes(part);
  const badges = [
    ...attrs.sockets,
    ...attrs.memoryTypes,
    ...attrs.formFactors,
    attrs.wattage ? `${attrs.wattage}W` : undefined,
    attrs.gpuLengthMm ? `GPU ${attrs.gpuLengthMm}mm` : undefined,
    attrs.coolerHeightMm ? `쿨러 ${attrs.coolerHeightMm}mm` : undefined,
    attrs.maxGpuLengthMm ? `VGA ${attrs.maxGpuLengthMm}mm` : undefined,
    attrs.maxCoolerHeightMm ? `쿨러 ${attrs.maxCoolerHeightMm}mm` : undefined,
  ].filter(Boolean);
  if (!badges.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {badges.slice(0, 4).map((badge) => (
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600" key={badge}>
          {badge}
        </span>
      ))}
    </div>
  );
}

function categoryFilterTip(category: PartCategory) {
  const tips: Record<PartCategory, string> = {
    CPU: 'CPU는 제조사와 소켓 중심으로 고르면 됩니다.',
    메인보드: 'CPU를 먼저 담으면 같은 소켓과 메모리 규격만 추천됩니다.',
    RAM: '메인보드/CPU 선택 후 DDR4·DDR5가 자동으로 좁혀집니다.',
    그래픽카드: '케이스를 먼저 담으면 장착 가능한 길이만 남깁니다.',
    SSD: 'M.2, SATA 같은 폼팩터와 가격 중심으로 확인하세요.',
    파워: '그래픽카드 권장 파워보다 여유 있게 선택하세요.',
    케이스: '그래픽카드 길이, CPU 쿨러 높이, 보드 규격을 함께 봅니다.',
    쿨러: 'CPU 소켓과 케이스 쿨러 높이를 함께 확인합니다.',
  };
  return tips[category];
}
