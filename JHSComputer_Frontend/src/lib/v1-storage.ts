import type { CartQuote, CatalogPart, ManualQuantities, ManualSelection, Order, OrderStatus, PartCategory, Quote } from './v1-types';
import { bankTransferInfo } from './payment-config';

const quoteKey = 'jhscomputer.v1.quotes';
const orderKey = 'jhscomputer.v1.orders';
const cartKey = 'jhscomputer.v1.cartQuotes';
const manualSelectionKey = 'jhscomputer.v1.manualSelection';
const manualQuantitiesKey = 'jhscomputer.v1.manualQuantities';

export const statusLabels: Record<OrderStatus, string> = {
  ADMIN_REVIEW: '관리자 검토',
  WAITING_DEPOSIT: '입금 대기',
  DEPOSIT_CONFIRMED: '입금 확인',
  PARTS_ORDERING: '부품 주문 중',
  PARTS_ARRIVED: '부품 도착',
  ASSEMBLING: '조립 중',
  TESTING: '테스트 중',
  PREPARING_DELIVERY: '배송 준비',
  SHIPPING: '배송 중',
  DELIVERED: '배송 완료',
  ON_HOLD: '보류',
  CANCELLED: '취소',
};

export const orderFlow: OrderStatus[] = [
  'WAITING_DEPOSIT',
  'DEPOSIT_CONFIRMED',
  'PARTS_ORDERING',
  'PARTS_ARRIVED',
  'ASSEMBLING',
  'TESTING',
  'PREPARING_DELIVERY',
  'SHIPPING',
  'DELIVERED',
];

export function loadQuotes(): Quote[] {
  return readJson<Quote[]>(quoteKey, []);
}

export function saveQuote(quote: Quote) {
  const quotes = [quote, ...loadQuotes().filter((item) => item.id !== quote.id)].slice(0, 20);
  writeJson(quoteKey, quotes);
}

export function loadLatestQuote() {
  return loadQuotes()[0];
}

export function setActiveQuote(quote: Quote) {
  saveQuote(quote);
}

export function loadManualSelection(): ManualSelection {
  return readJson<ManualSelection>(manualSelectionKey, {});
}

export function saveManualSelection(selection: ManualSelection) {
  writeJson(manualSelectionKey, selection);
}

export function loadManualQuantities(): ManualQuantities {
  return readJson<ManualQuantities>(manualQuantitiesKey, {});
}

export function saveManualQuantities(quantities: ManualQuantities) {
  writeJson(manualQuantitiesKey, quantities);
}

export function selectManualPart(part: CatalogPart) {
  const selection = loadManualSelection();
  selection[part.category] = part;
  writeJson(manualSelectionKey, selection);
  return selection;
}

export function removeManualPart(category: PartCategory) {
  const selection = loadManualSelection();
  delete selection[category];
  writeJson(manualSelectionKey, selection);
  return selection;
}

export function clearManualSelection() {
  writeJson(manualSelectionKey, {});
  writeJson(manualQuantitiesKey, {});
}

export function loadCartQuotes(): CartQuote[] {
  return readJson<CartQuote[]>(cartKey, []);
}

export function addQuoteToCart(quote: Quote) {
  const currentCartQuotes = loadCartQuotes();
  const existingCartQuote = currentCartQuotes.find((item) => isSameCartQuote(item.quote.id, quote.id));
  const cartQuote: CartQuote = existingCartQuote
    ? { ...existingCartQuote, quote, addedAt: new Date().toISOString() }
    : {
        id: `C-${Date.now()}`,
        quote,
        addedAt: new Date().toISOString(),
      };
  const cartQuotes = [
    cartQuote,
    ...currentCartQuotes.filter((item) => item.id !== cartQuote.id && !isSameCartQuote(item.quote.id, quote.id)),
  ].slice(0, 30);
  writeJson(cartKey, cartQuotes);
  saveQuote(quote);
  return cartQuote;
}

function isSameCartQuote(leftQuoteId: string, rightQuoteId: string) {
  if (leftQuoteId === rightQuoteId) return true;
  return isPartsShoppingQuote(leftQuoteId) && isPartsShoppingQuote(rightQuoteId);
}

function isPartsShoppingQuote(quoteId: string) {
  return quoteId === 'Q-PARTS-ACTIVE' || quoteId.startsWith('Q-PARTS-');
}

export function removeCartQuote(cartQuoteId: string) {
  writeJson(
    cartKey,
    loadCartQuotes().filter((item) => item.id !== cartQuoteId),
  );
}

export function loadOrders(): Order[] {
  return readJson<Order[]>(orderKey, []);
}

export function saveOrder(order: Order) {
  const orders = [order, ...loadOrders().filter((item) => item.id !== order.id)].slice(0, 50);
  writeJson(orderKey, orders);
}

export function createOrderFromQuote(
  quote: Quote,
  delivery: Pick<Order, 'recipientName' | 'recipientPhone' | 'postalCode' | 'address1' | 'address2' | 'deliveryMemo'>,
): Order {
  const now = new Date().toISOString();
  const orderNo = `JHS-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${String(Date.now()).slice(-5)}`;
  const order: Order = {
    id: `O-${Date.now()}`,
    orderNo,
    quote: { ...quote, status: 'ORDERED' },
    status: 'WAITING_DEPOSIT',
    createdAt: now,
    paymentBankName: bankTransferInfo.bankName,
    paymentAccountNo: bankTransferInfo.accountNo,
    paymentAccountHolder: bankTransferInfo.accountHolder,
    paymentAmount: quote.total,
    ...delivery,
    histories: [
      {
        status: 'WAITING_DEPOSIT',
        message: '주문이 접수되었습니다. 안내된 계좌로 입금해주시면 확인 후 조립을 시작합니다.',
        at: now,
      },
    ],
  };

  saveQuote(order.quote);
  saveOrder(order);
  return order;
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const orders = loadOrders();
  const target = orders.find((order) => order.id === orderId);
  if (!target) return undefined;

  const updated: Order = {
    ...target,
    status,
    trackingCompany: status === 'SHIPPING' || status === 'DELIVERED' ? target.trackingCompany ?? 'CJ대한통운' : target.trackingCompany,
    trackingNo: status === 'SHIPPING' || status === 'DELIVERED' ? target.trackingNo ?? `59${String(Date.now()).slice(-10)}` : target.trackingNo,
    histories: [
      {
        status,
        message: `${statusLabels[status]} 단계로 변경되었습니다.`,
        at: new Date().toISOString(),
      },
      ...target.histories,
    ],
  };

  writeJson(
    orderKey,
    orders.map((order) => (order.id === orderId ? updated : order)),
  );
  return updated;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
