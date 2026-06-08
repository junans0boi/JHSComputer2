export type Purpose = '게임' | '방송' | '영상편집' | '사무' | 'AI';
export type Resolution = 'FHD' | 'QHD' | '4K';
export type Priority = '성능 우선' | '가성비 우선' | '감성 우선' | '업그레이드 우선';
export type PartCategory = 'CPU' | '메인보드' | 'RAM' | '그래픽카드' | 'SSD' | '파워' | '케이스' | '쿨러';

export type CatalogPart = {
  id: string;
  category: PartCategory;
  productNo: string;
  name: string;
  price: number;
  imageUrl: string;
  detailUrl: string;
  detailImages?: string[];
  spec: string;
  reviewCount: number;
  reviewRate: number;
  badges: string[];
};

export type QuoteInput = {
  budget: number;
  purpose: Purpose;
  games: string[];
  resolution: Resolution;
  storage: '500GB' | '1TB' | '2TB';
  windows: '포함' | '설치만' | '미포함';
  priority: Priority;
};

export type QuotePart = {
  category: string;
  name: string;
  memo: string;
  price: number;
  supplier: string;
  productNo?: string;
  imageUrl?: string;
  detailUrl?: string;
};

export type PerformanceResult = {
  game: string;
  resolution: Resolution;
  grade: '쾌적' | '좋음' | '플레이 가능' | '비추천';
  fpsMin: number;
  fpsMax: number;
};

export type Quote = {
  id: string;
  createdAt: string;
  title?: string;
  mode?: 'AUTO' | 'MANUAL';
  input: QuoteInput;
  parts: QuotePart[];
  performance: PerformanceResult[];
  compatibility: string[];
  subtotal: number;
  assemblyFee: number;
  shippingFee: number;
  windowsFee: number;
  total: number;
  status: 'DRAFT' | 'ORDERED';
};

export type ManualSelection = Partial<Record<PartCategory, CatalogPart>>;

export type CartQuote = {
  id: string;
  quote: Quote;
  addedAt: string;
};

export type OrderStatus =
  | 'ADMIN_REVIEW'
  | 'WAITING_DEPOSIT'
  | 'DEPOSIT_CONFIRMED'
  | 'PARTS_ORDERING'
  | 'PARTS_ARRIVED'
  | 'ASSEMBLING'
  | 'TESTING'
  | 'PREPARING_DELIVERY'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'ON_HOLD'
  | 'CANCELLED';

export type Order = {
  id: string;
  orderNo: string;
  quote: Quote;
  status: OrderStatus;
  createdAt: string;
  recipientName: string;
  recipientPhone: string;
  postalCode: string;
  address1: string;
  address2: string;
  deliveryMemo: string;
  trackingCompany?: string;
  trackingNo?: string;
  histories: Array<{
    status: OrderStatus;
    message: string;
    at: string;
  }>;
};
