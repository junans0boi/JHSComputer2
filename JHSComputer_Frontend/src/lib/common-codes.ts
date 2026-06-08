import type { CatalogPart } from './v1-types';

export type CommonCode = {
  group: string;
  code: string;
  name: string;
  nameKo: string;
  description?: string;
  attributes?: Record<string, unknown>;
};

export const productStatusCodes: CommonCode[] = [
  { group: 'productStatus', code: 'AVAILABLE', name: 'Available', nameKo: '구매가능', attributes: { color: 'green' } },
  { group: 'productStatus', code: 'LOW_STOCK', name: 'Low stock', nameKo: '재고부족', attributes: { color: 'amber' } },
  { group: 'productStatus', code: 'OUT_OF_STOCK', name: 'Out of stock', nameKo: '품절', attributes: { color: 'red' } },
  { group: 'productStatus', code: 'ADMIN_CHECK_REQUIRED', name: 'Admin check required', nameKo: '관리자 확인 필요', attributes: { color: 'slate' } },
];

export const badgeCodes: CommonCode[] = [
  { group: 'badge', code: 'VALUE', name: 'Value', nameKo: '가성비' },
  { group: 'badge', code: 'GAME_RECOMMENDED', name: 'Game recommended', nameKo: '게임 추천' },
  { group: 'badge', code: 'LOW_NOISE', name: 'Low noise', nameKo: '저소음' },
  { group: 'badge', code: 'WHITE_AESTHETIC', name: 'White aesthetic', nameKo: '화이트 감성' },
  { group: 'badge', code: 'STOCK_STABLE', name: 'Stock stable', nameKo: '재고안정' },
];

export function getProductStatus(part: CatalogPart) {
  if (part.price <= 0) return productStatusCodes.find((code) => code.code === 'OUT_OF_STOCK')!;
  if (part.badges.some((badge) => badge.includes('현장구매') || badge.includes('1시간픽업'))) {
    return productStatusCodes.find((code) => code.code === 'AVAILABLE')!;
  }
  if (part.reviewCount < 20) return productStatusCodes.find((code) => code.code === 'ADMIN_CHECK_REQUIRED')!;
  if (part.reviewCount < 100) return productStatusCodes.find((code) => code.code === 'LOW_STOCK')!;
  return productStatusCodes.find((code) => code.code === 'AVAILABLE')!;
}

export function getPartBadges(part: CatalogPart) {
  const text = `${part.name} ${part.spec}`.toLowerCase();
  const badges: CommonCode[] = [];
  if (part.price < categoryValuePrice(part.category)) badges.push(badgeCodes.find((code) => code.code === 'VALUE')!);
  if (part.category === 'CPU' || part.category === '그래픽카드') badges.push(badgeCodes.find((code) => code.code === 'GAME_RECOMMENDED')!);
  if (text.includes('저소음') || text.includes('silent') || text.includes('non-led')) badges.push(badgeCodes.find((code) => code.code === 'LOW_NOISE')!);
  if (text.includes('화이트') || text.includes('white')) badges.push(badgeCodes.find((code) => code.code === 'WHITE_AESTHETIC')!);
  if (getProductStatus(part).code === 'AVAILABLE') badges.push(badgeCodes.find((code) => code.code === 'STOCK_STABLE')!);
  return badges.filter(Boolean).slice(0, 3);
}

export function statusClass(statusCode: string) {
  const classes: Record<string, string> = {
    AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    LOW_STOCK: 'bg-amber-50 text-amber-700 border-amber-100',
    OUT_OF_STOCK: 'bg-red-50 text-red-700 border-red-100',
    ADMIN_CHECK_REQUIRED: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return classes[statusCode] ?? classes.ADMIN_CHECK_REQUIRED;
}

function categoryValuePrice(category: string) {
  const values: Record<string, number> = {
    CPU: 220000,
    메인보드: 140000,
    RAM: 90000,
    그래픽카드: 450000,
    SSD: 90000,
    파워: 90000,
    케이스: 50000,
    쿨러: 30000,
  };
  return values[category] ?? 100000;
}
