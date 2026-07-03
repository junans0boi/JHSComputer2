'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PanelCard } from '@/components/ui/PanelCard';
import { getProductStatus, statusClass } from '@/lib/common-codes';
import type { CatalogPart } from '@/lib/v1-types';

export function ComparePartsPanel({
  parts,
  onClear,
  onToggle,
}: {
  parts: CatalogPart[];
  onClear: () => void;
  onToggle: (part: CatalogPart) => void;
}) {
  if (!parts.length) return null;

  return (
    <PanelCard className="border-brand">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-black">부품 비교</h3>
          <p className="mt-1 text-sm text-slate-600">최대 3개까지 가격, 재고, 주요 스펙을 비교합니다.</p>
        </div>
        <Button onClick={onClear} type="button" variant="outline">
          비우기
        </Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {parts.map((part) => {
          const status = getProductStatus(part);
          return (
            <div className="group relative rounded-xl border border-line bg-panel p-3" key={part.id}>
              <div className="flex items-start justify-between gap-2">
                <strong className="part-name pr-6 text-sm">{part.name}</strong>
                <button
                  className="absolute right-3 top-3 rounded-full bg-white p-0.5 text-slate-400 opacity-0 shadow-sm transition hover:text-red-500 group-hover:opacity-100"
                  onClick={() => onToggle(part)}
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mt-3 text-xl font-black text-brand">{part.price.toLocaleString()}원</div>
              <span className={`mt-2 inline-flex rounded-full border px-2 py-1 text-xs font-black ${statusClass(status.code)}`}>{status.nameKo}</span>
              <p className="part-spec mt-2 text-xs text-slate-600">{part.spec}</p>
            </div>
          );
        })}
      </div>
    </PanelCard>
  );
}
