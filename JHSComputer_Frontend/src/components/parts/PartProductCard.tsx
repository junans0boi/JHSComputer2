'use client';

import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPartBadges } from '@/lib/common-codes';
import { getPartAttributes } from '@/lib/part-filters';
import type { CatalogPart } from '@/lib/v1-types';

export function PartProductCard({
  part,
  compared,
  lastAdded,
  quantity,
  onAdd,
  onCompare,
  onDetail,
  onQuantityChange,
}: {
  part: CatalogPart;
  compared: boolean;
  lastAdded: boolean;
  quantity: number;
  onAdd: (part: CatalogPart) => void;
  onCompare: (part: CatalogPart) => void;
  onDetail: (part: CatalogPart) => void;
  onQuantityChange: (quantity: number) => void;
}) {
  const badges = getPartBadges(part).map((badge) => badge.nameKo);

  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-shadow hover:shadow-md">
      <div className="grid gap-4 p-4 sm:grid-cols-[120px_1fr]">
        <div className="grid h-40 place-items-center rounded-xl bg-panel p-2 transition-colors group-hover:bg-white sm:h-28">
          <img alt={part.name} className="max-h-full max-w-full object-contain" src={part.imageUrl} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <Badge className="px-2.5 py-0.5 text-[11px]">{part.category}</Badge>
            <span className="text-[10px] text-slate-400">No.{part.productNo}</span>
          </div>
          <h3 className="part-name mt-2 text-sm transition-colors group-hover:text-brand">{part.name}</h3>
          <p className="part-spec mt-1.5 text-xs text-slate-500">{part.spec}</p>
          <SpecBadges part={part} extraBadges={badges} />
        </div>
      </div>

      <div className="border-t border-line bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold text-slate-500">컴퓨존 기준가</div>
            <div className="text-xl font-black tracking-tight text-brand">{part.price.toLocaleString()}원</div>
          </div>
          <div className="flex flex-col gap-0.5 text-right">
            <span className="text-[11px] font-bold text-slate-600">후기 {part.reviewCount.toLocaleString()}개</span>
            <span className="text-[11px] font-bold text-slate-500">평점 {part.reviewRate || '-'}</span>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_1fr]">
          <Button className="h-10 text-xs shadow-sm" onClick={() => onDetail(part)} type="button" variant="outline">
            상세 스펙
          </Button>
          <Button
            className={compared ? 'h-10 border-brand bg-teal-50 text-xs text-brand shadow-sm' : 'h-10 text-xs shadow-sm'}
            onClick={() => onCompare(part)}
            type="button"
            variant="outline"
          >
            비교
          </Button>
          <Button
            className={lastAdded ? 'h-10 bg-accent text-xs shadow-sm hover:bg-accent/90' : 'h-10 bg-ink text-xs shadow-sm hover:bg-brand'}
            onClick={() => onAdd(part)}
            type="button"
            variant="dark"
          >
            <Plus size={14} />
            {lastAdded ? '담김' : '담기'}
          </Button>
        </div>
        <QuantityControl quantity={quantity} onChange={onQuantityChange} />
      </div>
    </article>
  );
}

function QuantityControl({ quantity, onChange }: { quantity: number; onChange: (quantity: number) => void }) {
  return (
    <div className="mt-2 flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2 text-xs font-black text-slate-600">
      <span>수량</span>
      <div className="flex items-center gap-2">
        <button
          className="grid h-7 w-7 place-items-center rounded-lg border border-line text-sm hover:border-brand hover:text-brand"
          onClick={() => onChange(Math.max(1, quantity - 1))}
          type="button"
        >
          -
        </button>
        <input
          className="h-7 w-12 rounded-lg border border-line text-center outline-none focus:border-brand"
          min={1}
          onChange={(event) => onChange(Math.max(1, Number(event.target.value) || 1))}
          type="number"
          value={quantity}
        />
        <button
          className="grid h-7 w-7 place-items-center rounded-lg border border-line text-sm hover:border-brand hover:text-brand"
          onClick={() => onChange(quantity + 1)}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}

function SpecBadges({ part, extraBadges }: { part: CatalogPart; extraBadges: string[] }) {
  const attrs = getPartAttributes(part);
  const badges = [
    ...extraBadges,
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
    <div className="mt-2.5 flex flex-wrap gap-1">
      {badges.slice(0, 4).map((badge) => (
        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-500" key={badge}>
          {badge}
        </span>
      ))}
    </div>
  );
}
