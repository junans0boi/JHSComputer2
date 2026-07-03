import { Search, Trash2 } from 'lucide-react';
import { PartDetailModal } from '@/components/PartDetailModal';
import { Badge } from '@/components/ui/Badge';
import type { CatalogPart, PartCategory, QuotePart } from '@/lib/v1-types';

function quotepartToCatalog(part: QuotePart): CatalogPart {
  return {
    id: part.productNo ?? part.name,
    category: part.category as PartCategory,
    productNo: part.productNo ?? '',
    name: part.name,
    price: part.price,
    imageUrl: part.imageUrl ?? '',
    detailUrl: part.detailUrl ?? '',
    spec: '',
    reviewCount: 0,
    reviewRate: 0,
    badges: [],
  };
}

export function QuotePartsTable({
  parts,
  activePart,
  onOpenPart,
  onClosePart,
  onRequestReplace,
  onRemovePart,
}: {
  parts: QuotePart[];
  activePart?: CatalogPart | null;
  onOpenPart?: (part: CatalogPart) => void;
  onClosePart?: () => void;
  onRequestReplace?: (part: QuotePart) => void;
  onRemovePart?: (part: QuotePart) => void;
}) {
  const editable = Boolean(onRequestReplace || onRemovePart);

  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-line">
      {activePart && onClosePart && <PartDetailModal onClose={onClosePart} part={activePart} />}
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-panel text-slate-600">
          <tr>
            <th className="w-28 px-3 py-3">구분</th>
            <th className="px-3 py-3">부품</th>
            <th className="w-16 px-3 py-3 text-center">수량</th>
            <th className="w-32 px-3 py-3 text-right">가격</th>
            {editable && <th className="w-24 px-3 py-3 text-right">수정</th>}
          </tr>
        </thead>
        <tbody>
          {parts.map((part, index) => {
            const key = `${part.category}-${part.productNo ?? part.name}-${index}`;
            return (
              <tr className="border-t border-line" key={key}>
                <td className="px-3 py-3 align-top">
                  <Badge>{part.category}</Badge>
                </td>
                <td className="px-3 py-3 align-top">
                  {onOpenPart ? (
                    <button
                      className="part-name cursor-pointer text-left text-sm font-bold text-slate-900 hover:text-brand hover:underline"
                      onClick={() => onOpenPart(quotepartToCatalog(part))}
                      type="button"
                    >
                      {part.name}
                    </button>
                  ) : (
                    <span className="part-name text-sm font-bold text-slate-900">{part.name}</span>
                  )}
                  {part.supplier && <div className="text-xs text-slate-400">{part.supplier}</div>}
                  {part.memo && <div className="mt-0.5 text-xs text-slate-500">{part.memo}</div>}
                </td>
                <td className="px-3 py-3 text-center font-black">{part.quantity ?? 1}</td>
                <td className="px-3 py-3 text-right font-bold">{part.price.toLocaleString()}원</td>
                {editable && (
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      {onRequestReplace && (
                        <button
                          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-slate-500 transition hover:border-brand hover:bg-teal-50 hover:text-brand"
                          onClick={() => onRequestReplace(part)}
                          title="부품 검색/교체"
                          type="button"
                        >
                          <Search size={15} />
                        </button>
                      )}
                      {onRemovePart && (
                        <button
                          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          onClick={() => onRemovePart(part)}
                          title="부품 삭제"
                          type="button"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function QuotePartsRows({ parts, rowKeyPrefix = 'parts' }: { parts: QuotePart[]; rowKeyPrefix?: string }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-line">
      {parts.map((part, index) => (
        <div
          className="grid min-w-[760px] gap-2 border-t border-line px-3 py-3 text-sm first:border-t-0 sm:grid-cols-[92px_minmax(360px,1fr)_70px_auto] sm:gap-3"
          key={`${rowKeyPrefix}-${part.category}-${part.productNo ?? part.name}-${index}`}
        >
          <Badge>{part.category}</Badge>
          <span className="part-name min-w-0 text-sm">{part.name}</span>
          <span className="text-center font-black text-slate-600">{part.quantity ?? 1}개</span>
          <span className="font-black sm:text-right">{part.price.toLocaleString()}원</span>
        </div>
      ))}
    </div>
  );
}
