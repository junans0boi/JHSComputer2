import { Search, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export type QuotePartListItem = {
  id: string;
  category: string;
  name: string;
  spec?: string | null;
  imageUrl?: string | null;
  detailImages?: string[];
  detailUrl?: string;
  productNo?: string | null;
  price?: number | null;
  quantity?: number;
  manufacturer?: string | null;
  trustLabel?: string | null;
  reviewCount?: number | null;
  rating?: number | null;
  stockStatus?: string | null;
  supplier?: string | null;
  metadata?: string | null;
};

type Props = {
  parts: QuotePartListItem[];
  variant?: 'quote' | 'candidate';
  onOpenPart?: (part: QuotePartListItem) => void;
  onRequestReplace?: (part: QuotePartListItem) => void;
  onRemovePart?: (part: QuotePartListItem) => void;
};

export function QuotePartList({ parts, variant = 'quote', onOpenPart, onRequestReplace, onRemovePart }: Props) {
  return (
    <div className="grid min-w-0 gap-2 rounded-xl border border-line p-2">
      <div className="grid gap-2 sm:hidden">
        {parts.map((part) => <MobilePartCard key={part.id} onOpenPart={onOpenPart} onRemovePart={onRemovePart} onRequestReplace={onRequestReplace} part={part} variant={variant} />)}
      </div>
      <div className="hidden min-w-0 gap-2 sm:grid">
        {variant === 'candidate' ? <CandidateDesktopList onOpenPart={onOpenPart} parts={parts} /> : <QuoteDesktopList onOpenPart={onOpenPart} onRemovePart={onRemovePart} onRequestReplace={onRequestReplace} parts={parts} />}
      </div>
    </div>
  );
}

function MobilePartCard({ part, variant, onOpenPart, onRequestReplace, onRemovePart }: Pick<Props, 'variant' | 'onOpenPart' | 'onRequestReplace' | 'onRemovePart'> & { part: QuotePartListItem }) {
  const spec = part.spec || '상세 스펙 확인 필요';
  return (
    <article className="grid min-w-0 gap-3 rounded-xl border border-line bg-white p-3">
      <div className="grid min-w-0 grid-cols-[64px_minmax(0,1fr)] gap-3">
        <PartImage alt={part.name} onClick={onOpenPart ? () => onOpenPart(part) : undefined} src={part.imageUrl} />
        <div className="min-w-0">
          <div className="mb-1"><Badge>{part.category}</Badge></div>
          <PartNameButton onClick={onOpenPart ? () => onOpenPart(part) : undefined} part={part} />
          {part.price != null && <div className="mt-2 text-sm font-black text-slate-900">{part.price.toLocaleString()}원 <span className="text-xs font-bold text-slate-500">· 수량 {part.quantity ?? 1}</span></div>}
        </div>
      </div>
      <div className="safe-break rounded-lg bg-blue-500 px-3 py-2 text-[11px] font-bold leading-4 text-white">{spec}</div>
      <div className="grid min-w-0 gap-1 text-[11px] font-bold text-slate-500">
        {variant === 'candidate' ? <><div className="flex flex-wrap justify-between gap-x-3 gap-y-1"><span className="break-words">{part.manufacturer ?? '제조사 정보 없음'} · <TrustLabel label={part.trustLabel} /></span><span>{reviewText(part)}</span></div><span>{part.stockStatus ?? '재고 확인 필요'}</span></> : <><span>{part.supplier ?? '공급처 확인 필요'}</span>{part.metadata && <span className="safe-break">{part.metadata}</span>}</>}
      </div>
      {(onRequestReplace || onRemovePart) && <div className="flex justify-end gap-2 border-t border-line pt-2">{onRequestReplace && <button className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-2 text-xs font-black text-slate-600" onClick={() => onRequestReplace(part)} type="button"><Search size={14} /> 부품 변경</button>}{onRemovePart && <button className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-black text-red-600" onClick={() => onRemovePart(part)} type="button"><Trash2 size={14} /> 삭제</button>}</div>}
    </article>
  );
}

function CandidateDesktopList({ parts, onOpenPart }: Pick<Props, 'parts' | 'onOpenPart'>) {
  return (
    <>
      <div className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)_120px] gap-3 rounded-lg bg-panel px-3 py-2 text-[11px] font-black text-slate-600"><span /><span>부품명·상세스펙 · 제조사·신뢰 · 후기·재고</span><span className="text-right">가격</span></div>
      {parts.map((part) => <div className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)_120px] items-start gap-3 rounded-lg border border-line px-3 py-3 text-xs" key={part.id}>
        <PartImage alt={part.name} small onClick={onOpenPart ? () => onOpenPart(part) : undefined} src={part.imageUrl} />
        <div className="min-w-0"><div className="mb-1"><Badge>{part.category}</Badge></div><PartNameButton onClick={onOpenPart ? () => onOpenPart(part) : undefined} part={part} /><div className="safe-break mt-1 leading-5 text-slate-600">{part.spec || '상세 스펙 확인 필요'}</div><div className="mt-2 flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500"><span className="break-words">{part.manufacturer ?? '제조사 정보 없음'}{part.trustLabel ? <> · <TrustLabel label={part.trustLabel} /></> : null}</span><span>{reviewText(part)}</span><span className="font-bold">{part.stockStatus ?? '확인 필요'}</span><span className="break-words">{part.supplier ?? 'JHS 판매 데이터'}{part.productNo ? ` · 상품번호 ${part.productNo}` : ''}</span></div></div>
        <div className="break-words text-right font-black">{part.price?.toLocaleString() ?? '-'}원</div>
      </div>)}
    </>
  );
}

function QuoteDesktopList({ parts, onOpenPart, onRequestReplace, onRemovePart }: Pick<Props, 'parts' | 'onOpenPart' | 'onRequestReplace' | 'onRemovePart'>) {
  return (
    <>
      <div className="grid min-w-0 grid-cols-[88px_minmax(0,1fr)_72px_120px_auto] gap-3 bg-panel px-3 py-2 text-xs font-black text-slate-600"><span>구분</span><span>부품명·상세스펙</span><span className="text-center">수량</span><span className="text-right">가격</span><span /></div>
      {parts.map((part) => <div className="grid min-w-0 grid-cols-[88px_minmax(0,1fr)_72px_120px_auto] items-start gap-3 border-t border-line px-3 py-3 text-sm" key={part.id}>
        <Badge>{part.category}</Badge>
        <div className="min-w-0"><PartNameButton onClick={onOpenPart ? () => onOpenPart(part) : undefined} part={part} /><div className="safe-break mt-1 text-xs font-semibold leading-5 text-slate-500">{part.spec || '상세 스펙 확인 필요'}</div><div className="mt-1 break-words text-xs text-slate-400">{part.supplier ?? '공급처 확인 필요'}{part.metadata ? ` · ${part.metadata}` : ''}</div></div>
        <div className="text-center font-black">{part.quantity ?? 1}</div>
        <div className="text-right font-bold">{part.price?.toLocaleString() ?? '-'}원</div>
        <div className="flex justify-end gap-1">{onRequestReplace && <button className="grid h-9 w-9 place-items-center rounded-lg border border-line text-slate-500 hover:border-brand hover:bg-teal-50 hover:text-brand" onClick={() => onRequestReplace(part)} title="부품 검색/교체" type="button"><Search size={15} /></button>}{onRemovePart && <button className="grid h-9 w-9 place-items-center rounded-lg border border-line text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600" onClick={() => onRemovePart(part)} title="부품 삭제" type="button"><Trash2 size={15} /></button>}</div>
      </div>)}
    </>
  );
}

function PartNameButton({ part, onClick }: { part: QuotePartListItem; onClick?: () => void }) {
  if (!onClick) return <div className="safe-break text-sm font-black leading-5 text-slate-900">{part.name}</div>;
  return <button className="safe-break max-w-full text-left text-sm font-black leading-5 text-slate-900 hover:text-brand hover:underline" onClick={onClick} type="button">{part.name}</button>;
}

function PartImage({ src, alt, small = false, onClick }: { src?: string | null; alt: string; small?: boolean; onClick?: () => void }) {
  const content = src ? <img alt={alt} className="h-full w-full object-contain" src={src} /> : <span className="px-1 text-center text-[10px] font-bold text-slate-400">이미지 없음</span>;
  return onClick ? <button aria-label={`${alt} 상세 보기`} className={`grid shrink-0 place-items-center overflow-hidden rounded-lg bg-panel ${small ? 'h-12 w-12' : 'h-16 w-16'}`} onClick={onClick} type="button">{content}</button> : <div className={`grid shrink-0 place-items-center overflow-hidden rounded-lg bg-panel ${small ? 'h-12 w-12' : 'h-16 w-16'}`}>{content}</div>;
}

function TrustLabel({ label }: { label?: string | null }) {
  if (!label) return null;
  const text = { VERIFIED_MANUFACTURER: '검증 제조사', ADMIN_APPROVED: '관리자 승인', POPULAR: '인기 근거', SPEC_VERIFIED: '스펙 검증', UNVERIFIED: '검토 필요' }[label] ?? label;
  return <span className={label === 'UNVERIFIED' ? 'text-amber-700' : 'text-emerald-700'}>{text}</span>;
}

function reviewText(part: QuotePartListItem) {
  return `${part.reviewCount?.toLocaleString() ?? '후기 없음'}${part.rating ? `개 · ${part.rating.toFixed(1)}점` : '개'}`;
}
