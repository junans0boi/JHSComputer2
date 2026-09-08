import type { CartQuote, CatalogPart, ManualQuantities, ManualSelection, Order, OrderStatus, PartCategory, Quote, QuoteInput } from './v1-types';
import { bankTransferInfo } from './payment-config';
import { quoteInputToProfile, QUOTE_RULESET_VERSION, WORKLOAD_TYPES, type QuoteProfileV2 } from './quote-profile';

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
  const existingQuotes = loadQuotes() as StoredQuote[];
  const existingProfile = existingQuotes.find((item) => item.id === quote.id)?.profile;
  const quoteToStore: StoredQuote = existingProfile && !(quote as StoredQuote).profile
    ? { ...quote, profile: existingProfile }
    : quote as StoredQuote;
  const quotes = [quoteToStore, ...existingQuotes.filter((item) => item.id !== quote.id)].slice(0, 20);
  writeJson(quoteKey, quotes);
}

export function loadLatestQuote() {
  return loadQuotes()[0];
}

/** Returns the profile associated with the latest quote, migrating its v1 input when needed. */
export function loadLatestQuoteProfile(): QuoteProfileV2 | undefined {
  const latestQuote = loadLatestQuote() as StoredQuote | undefined;
  if (!latestQuote) return undefined;
  return loadQuoteProfile(latestQuote.id) ?? quoteInputToProfile(latestQuote.input);
}

export function loadQuoteProfile(quoteId: string): QuoteProfileV2 | undefined {
  const quote = (loadQuotes() as StoredQuote[]).find((item) => item.id === quoteId);
  const storedProfile = quote?.profile as unknown;
  return isQuoteProfileV2(storedProfile) ? storedProfile : undefined;
}

export function saveQuoteProfile(quoteId: string, profile: QuoteProfileV2) {
  const quotes = loadQuotes() as StoredQuote[];
  if (!quotes.some((quote) => quote.id === quoteId)) return;
  writeJson(
    quoteKey,
    quotes.map((quote) => quote.id === quoteId ? { ...quote, profile } : quote),
  );
}

export function quoteInputToV2Profile(input: QuoteInput) {
  return quoteInputToProfile(input);
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

type StoredQuote = Quote & { profile?: QuoteProfileV2 };

function isQuoteProfileV2(value: unknown): value is QuoteProfileV2 {
  if (typeof value !== 'object' || value === null) return false;
  const profile = value as Record<string, unknown>;
  const workloadProfile = profile.workloadProfile;
  const budgetProfile = profile.budgetProfile;
  const preferenceProfile = profile.preferenceProfile;
  const storageDemand = profile.storageDemand;
  const workloads = workloadProfile && typeof workloadProfile === 'object'
    ? (workloadProfile as Record<string, unknown>).workloads
    : undefined;
  const includes = budgetProfile && typeof budgetProfile === 'object'
    ? (budgetProfile as Record<string, unknown>).includes
    : undefined;
  const workloadTypes = Array.isArray(workloads)
    ? workloads.map((workload) => isRecord(workload) ? workload.type : undefined)
    : [];
  const workloadDetailsAreValid = Array.isArray(workloads)
    && workloads.every((workload) => isRecord(workload)
      && isValidWorkloadType(workload.type)
      && isNumber(workload.weight)
      && workload.weight >= 0
      && workload.weight <= 100
      && isValidWorkloadDetails(workload.type, workload.details));
  const workloadWeightTotal = Array.isArray(workloads)
    ? workloads.reduce((sum, workload) => sum + (isRecord(workload) && isNumber(workload.weight) ? workload.weight : 0), 0)
    : 0;
  const budgetIsValid = isRecord(budgetProfile)
    && isNumber(budgetProfile.minimumWon)
    && Number.isSafeInteger(budgetProfile.minimumWon)
    && budgetProfile.minimumWon >= 0
    && isNumber(budgetProfile.targetWon)
    && Number.isSafeInteger(budgetProfile.targetWon)
    && budgetProfile.targetWon >= budgetProfile.minimumWon
    && isNumber(budgetProfile.maximumWon)
    && Number.isSafeInteger(budgetProfile.maximumWon)
    && budgetProfile.maximumWon >= budgetProfile.targetWon
    && Array.isArray(includes)
    && includes.length > 0
    && includes.every((item) => ['PARTS', 'ASSEMBLY', 'WINDOWS', 'SHIPPING'].includes(String(item)));
  const preferenceWeights: unknown[] = isRecord(preferenceProfile)
    ? [preferenceProfile.performance, preferenceProfile.value, preferenceProfile.aesthetics, preferenceProfile.upgradeability]
    : [];
  const preferenceTotal = preferenceWeights.reduce<number>((sum, item) => sum + (isNumber(item) ? item : 0), 0);
  const preferenceIsValid = isRecord(preferenceProfile)
    && ['BALANCED', 'PERFORMANCE', 'VALUE', 'AESTHETICS', 'UPGRADE'].includes(String(preferenceProfile.preset))
    && preferenceWeights.every((item) => isNumber(item) && item >= 0 && item <= 100)
    && Math.abs(preferenceTotal - 100) <= 0.001;
  const storageIsValid = isRecord(storageDemand)
    && [storageDemand.systemGb, storageDemand.activeProjectGb, storageDemand.archiveGb, storageDemand.growthGbPerYear]
      .every((item) => isNumber(item) && Number.isSafeInteger(item) && item >= 0)
    && ['NONE', 'MIRROR', 'BACKUP_REQUIRED'].includes(String(storageDemand.redundancy));
  return profile.profileVersion === 2
    && typeof profile.rulesetVersion === 'string'
    && profile.rulesetVersion === QUOTE_RULESET_VERSION
    && Array.isArray(workloads)
    && workloads.length > 0
    && workloads.length <= WORKLOAD_TYPES.length
    && new Set(workloadTypes).size === workloads.length
    && workloadDetailsAreValid
    && Math.abs(workloadWeightTotal - 100) <= 0.001
    && budgetIsValid
    && preferenceIsValid
    && storageIsValid
    && ['NONE', 'INSTALL_ONLY', 'WINDOWS_11_HOME_FPP', 'WINDOWS_11_PRO_FPP'].includes(String(profile.windowsOption))
    && typeof profile.windowsOption === 'string';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isValidWorkloadType(value: unknown): value is string {
  return typeof value === 'string' && (WORKLOAD_TYPES as readonly string[]).includes(value);
}

function isValidWorkloadDetails(type: string, value: unknown): boolean {
  if (!isRecord(value)) return false;
  switch (type) {
    case 'GAMING':
      return isStringArray(value.games)
        && isResolution(value.resolution)
        && isNumber(value.refreshRate)
        && Number.isSafeInteger(value.refreshRate)
        && value.refreshRate >= 30
        && value.refreshRate <= 1000;
    case 'STREAMING':
      return isResolution(value.outputResolution) && typeof value.hardwareEncoding === 'boolean';
    case 'VIDEO_EDITING':
      return isStringArray(value.software) && isNonEmptyString(value.timeline) && isNonEmptyString(value.codec);
    case 'AI':
      return isNonEmptyString(value.mode) && isNonEmptyString(value.modelSize) && isNonEmptyString(value.quantization);
    case 'OFFICE':
      return isNonEmptyString(value.multitasking);
    case 'DEVELOPMENT':
      return typeof value.containers === 'boolean' && typeof value.virtualMachines === 'boolean';
    default:
      return false;
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => isNonEmptyString(item));
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isResolution(value: unknown): boolean {
  return ['FHD', 'QHD', '4K', '8K'].includes(String(value));
}
