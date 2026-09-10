import { PartDetailModal } from '@/components/PartDetailModal';
import { QuotePartList, type QuotePartListItem } from '@/components/ui/QuotePartList';
import type { CatalogPart, PartCategory, QuotePart } from '@/lib/v1-types';

function quotePartToDisplay(part: QuotePart, index: number): QuotePartListItem {
  return {
    id: `${part.category}-${part.productNo ?? part.name}-${index}`,
    category: part.category,
    name: part.name,
    spec: part.specSummary ?? part.memo ?? '',
    imageUrl: part.imageUrl,
    detailImages: part.detailImages,
    detailUrl: part.detailUrl,
    productNo: part.productNo,
    price: part.price,
    quantity: part.quantity ?? 1,
    supplier: part.supplier,
    metadata: [part.stockStatus, part.priceCheckedAt ? `${new Date(part.priceCheckedAt).toLocaleDateString('ko-KR')} 가격 확인` : undefined].filter(Boolean).join(' · '),
  };
}

function displayPartToCatalog(part: QuotePartListItem): CatalogPart {
  return {
    id: part.id,
    category: part.category as PartCategory,
    productNo: part.productNo ?? part.id,
    name: part.name,
    price: part.price ?? 0,
    imageUrl: part.imageUrl ?? '',
    detailUrl: part.detailUrl ?? '',
    detailImages: part.detailImages ?? [],
    spec: part.spec ?? '',
    reviewCount: part.reviewCount ?? 0,
    reviewRate: part.rating ?? 0,
    badges: [],
    stockStatus: part.stockStatus ?? undefined,
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
  const displayParts = parts.map(quotePartToDisplay);
  return (
    <>
      {activePart && onClosePart && <PartDetailModal onClose={onClosePart} part={activePart} />}
      <QuotePartList
        onOpenPart={onOpenPart ? (part) => onOpenPart(displayPartToCatalog(part)) : undefined}
        onRemovePart={onRemovePart ? (part) => {
          const index = displayParts.findIndex((item) => item.id === part.id);
          if (index >= 0) onRemovePart(parts[index]);
        } : undefined}
        onRequestReplace={onRequestReplace ? (part) => {
          const index = displayParts.findIndex((item) => item.id === part.id);
          if (index >= 0) onRequestReplace(parts[index]);
        } : undefined}
        parts={displayParts}
        variant="quote"
      />
    </>
  );
}

export function QuotePartsRows({ parts, rowKeyPrefix: _rowKeyPrefix = 'parts' }: { parts: QuotePart[]; rowKeyPrefix?: string }) {
  return <QuotePartList parts={parts.map(quotePartToDisplay)} variant="quote" />;
}
