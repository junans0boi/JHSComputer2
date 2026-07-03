'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { compuzoneCatalog } from '@/lib/compuzone-catalog';
import { getIncompatibilityReason } from '@/lib/part-filters';
import { loadServerCatalog } from '@/lib/server-parts';
import type { CatalogPart, ManualSelection, PartCategory } from '@/lib/v1-types';

export function PartSearchDialog({
  category,
  manualSelection = {},
  onClose,
  onSelect,
}: {
  category: PartCategory;
  manualSelection?: ManualSelection;
  onClose: () => void;
  onSelect: (part: CatalogPart) => void;
}) {
  const [catalog, setCatalog] = useState<CatalogPart[]>(compuzoneCatalog);
  const [keyword, setKeyword] = useState('');
  const [compatibleOnly, setCompatibleOnly] = useState(false);

  useEffect(() => {
    loadServerCatalog()
      .then((items) => {
        if (items.length) setCatalog(items);
      })
      .catch(() => {});
  }, []);

  const parts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return catalog
      .filter((part) => part.category === category)
      .filter((part) => !normalizedKeyword || `${part.name} ${part.spec}`.toLowerCase().includes(normalizedKeyword))
      .filter((part) => !compatibleOnly || !getIncompatibilityReason(part, manualSelection))
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 80);
  }, [catalog, category, compatibleOnly, keyword, manualSelection]);

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/45 p-3 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-line p-4">
          <div>
            <h2 className="text-xl font-black">{category} 부품 검색</h2>
            <p className="mt-1 text-sm text-slate-500">실제 DB 상품에서 {category} 부품을 검색해 선택합니다.</p>
          </div>
          <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onClose} type="button">
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-3 border-b border-line bg-panel p-4 md:grid-cols-[minmax(0,1fr)_auto]">
          <label className="flex h-12 items-center gap-2 rounded-xl border border-line bg-white px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-teal-100">
            <Search className="shrink-0 text-slate-400" size={18} />
            <input
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={`${category} 검색`}
              value={keyword}
            />
          </label>
          <label className="flex h-12 items-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-black text-slate-600">
            <input
              checked={compatibleOnly}
              className="h-4 w-4 accent-teal-700"
              onChange={(event) => setCompatibleOnly(event.target.checked)}
              type="checkbox"
            />
            호환 부품만
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="grid gap-3">
            {parts.map((part) => {
              const incompatibilityReason = getIncompatibilityReason(part, manualSelection);
              return (
                <button
                  className="grid gap-3 rounded-2xl border border-line bg-white p-3 text-left transition hover:border-brand hover:shadow-soft sm:grid-cols-[88px_minmax(0,1fr)_auto]"
                  key={part.id}
                  onClick={() => {
                    onSelect(part);
                    onClose();
                  }}
                  type="button"
                >
                  <div className="grid h-20 w-20 place-items-center rounded-xl bg-panel p-2">
                    <img alt={part.name} className="max-h-full max-w-full object-contain" src={part.imageUrl} />
                  </div>
                  <div className="min-w-0">
                    <div className="part-name text-sm font-black text-slate-900">{part.name}</div>
                    <div className="part-spec mt-1 text-xs text-slate-500">{part.spec}</div>
                    {incompatibilityReason && (
                      <div className="mt-1 text-xs font-black text-red-500">주의: {incompatibilityReason}</div>
                    )}
                  </div>
                  <div className="self-center text-right">
                    <div className="text-lg font-black text-brand">{part.price.toLocaleString()}원</div>
                    <div className="mt-1 text-xs font-bold text-slate-500">후기 {part.reviewCount.toLocaleString()}개</div>
                  </div>
                </button>
              );
            })}
          </div>

          {!parts.length && (
            <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-line text-center text-sm font-bold text-slate-500">
              조건에 맞는 부품이 없습니다.
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-line p-4">
          <Button onClick={onClose} type="button" variant="outline">
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
