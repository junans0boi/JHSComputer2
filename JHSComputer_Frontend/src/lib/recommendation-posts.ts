import type { Quote, QuotePart } from './v1-types';
import { defaultInput } from './v1-estimator';

const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3010/api';

export type RecommendationPostListItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  targetBudget: number | null;
  totalPrice: number;
  purpose: string;
  cpuBrand: string | null;
  gpuBrand: string | null;
  cpuModel: string | null;
  gpuModel: string | null;
  publicCpuModel?: string;
  publicGpuModel?: string;
  publicComboName?: string;
  comboType: string | null;
  thumbnailImageUrl: string | null;
  casePartName: string | null;
  popularityScore: number;
  orderCount: number;
  cartCount: number;
  publishedAt: string | null;
  gameTags: string[];
};

export type RecommendationPostPart = {
  partId: string;
  category: string;
  label: string | null;
  name: string;
  price: number;
  quantity: number;
  productNo: string | null;
  imageUrl: string | null;
  specText: string | null;
  sortOrder: number;
};

export type RecommendationPostGame = {
  gameName: string;
  resolution: 'FHD' | 'QHD' | '4K' | 'UHD';
  qualityPreset: string | null;
  fpsMin: number | null;
  fpsMax: number | null;
  comfortGrade: string | null;
  isEstimated?: boolean;
  evidenceType?: 'MEASURED' | 'SOURCE_BENCHMARK' | 'SOURCE_RECOMMENDATION' | 'SOURCE_REPORTED' | 'DERIVED' | 'NONE';
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  sampleCount?: number;
  evidenceNote?: string;
};

export type RecommendationPostDetail = RecommendationPostListItem & {
  bodyMd: string | null;
  parts: RecommendationPostPart[];
  games: RecommendationPostGame[];
};

export type RecommendationPostFilters = {
  q?: string;
  game?: string;
  resolution?: string;
  budgetMax?: string;
  part?: string;
  cpuBrand?: string;
  gpuBrand?: string;
  comboType?: string;
  sort?: string;
};

const recommendationComboLabels: Record<string, string> = {
  RYZEN_NVIDIA: '라이젠 + 엔비디아',
  INTEL_NVIDIA: '인텔 + 엔비디아',
  RYZEN_RADEON: '라이젠 + 라데온',
  INTEL_RADEON: '인텔 + 라데온',
  RYZEN_AMD: '라이젠 + 라데온',
  INTEL_AMD: '인텔 + 라데온',
};

export function recommendationComboLabel(comboType?: string | null) {
  if (!comboType) return 'JHS 추천 조합';
  return recommendationComboLabels[comboType] ?? comboType.replaceAll('_', ' + ');
}

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { next: { revalidate: 30 } });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function loadRecommendationPosts(filters: RecommendationPostFilters = {}, limit = 36) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  params.set('limit', String(limit));
  return getJson<{ items: RecommendationPostListItem[]; total: number }>(`/recommendation-posts?${params.toString()}`, { items: [], total: 0 });
}

export async function loadRecommendationPost(slug: string) {
  return getJson<RecommendationPostDetail | null>(`/recommendation-posts/${encodeURIComponent(slug)}`, null);
}

export function recommendationPostToQuote(post: RecommendationPostDetail): Quote {
  const parts = post.parts.map<QuotePart>((part) => ({
    category: normalizeRecommendationCategory(part.label ?? part.category),
    name: part.name,
    memo: part.specText ?? 'JHS 추천 구성',
    price: Number(part.price ?? 0) * Number(part.quantity ?? 1),
    quantity: Number(part.quantity ?? 1),
    supplier: 'JHS 추천 견적',
    productNo: part.productNo ?? undefined,
    imageUrl: part.imageUrl ?? undefined,
  }));
  const subtotal = parts.reduce((sum, part) => sum + part.price, 0);
  return {
    id: `Q-JHS-${post.slug}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: post.title,
    mode: 'AUTO',
    input: {
      ...defaultInput,
      budget: Math.round(Number(post.totalPrice ?? subtotal) / 10000),
      purpose: post.purpose === 'GAME' ? '게임' : defaultInput.purpose,
      games: post.games.length ? [...new Set(post.games.map((game) => game.gameName))].slice(0, 3) : defaultInput.games,
    },
    parts,
    performance: post.games.filter((game) => Number(game.fpsMin) > 0 && Number(game.fpsMax) > 0).map((game) => ({
      game: game.gameName,
      resolution: game.resolution === 'UHD' ? '4K' : game.resolution,
      grade: game.comfortGrade === 'EXCELLENT' ? '쾌적' : game.comfortGrade === 'GOOD' ? '좋음' : '플레이 가능',
      fpsMin: Number(game.fpsMin ?? 0),
      fpsMax: Number(game.fpsMax ?? 0),
      isEstimated: game.isEstimated,
      evidenceType: game.evidenceType,
      confidence: game.confidence,
      sampleCount: game.sampleCount,
      evidenceNote: game.evidenceNote,
    })),
    compatibility: ['JHS 추천 견적: 주문 전 가격/재고/호환성 최종 확인', `${post.publicComboName ?? `${post.cpuModel ?? 'CPU'} + ${post.gpuModel ?? 'GPU'}`} 조합`],
    subtotal,
    assemblyFee: 50000,
    shippingFee: 10000,
    windowsFee: 0,
    total: subtotal + 60000,
    status: 'DRAFT',
  };
}

export function normalizeRecommendationCategory(category?: string | null) {
  const categoryMap: Record<string, string> = {
    CPU: 'CPU',
    MAINBOARD: '메인보드',
    MOTHERBOARD: '메인보드',
    메인보드: '메인보드',
    RAM: 'RAM',
    MEMORY: 'RAM',
    GPU: '그래픽카드',
    VGA: '그래픽카드',
    그래픽카드: '그래픽카드',
    SSD: 'SSD',
    PSU: '파워',
    POWER: '파워',
    파워: '파워',
    CASE: '케이스',
    케이스: '케이스',
    CPU_COOLER: '쿨러',
    COOLER: '쿨러',
    쿨러: '쿨러',
  };
  return categoryMap[String(category ?? '').trim()] ?? String(category ?? '');
}
