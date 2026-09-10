import type { CatalogPart, PartCategory } from './v1-types';

const categoryNameMap: Record<string, PartCategory> = {
  CPU: 'CPU',
  MAINBOARD: '메인보드',
  RAM: 'RAM',
  SSD: 'SSD',
  GPU: '그래픽카드',
  PSU: '파워',
  CASE: '케이스',
  CPU_COOLER: '쿨러',
};

type ApiCategory = { id: string; code: string };

type ApiPart = {
  id: string;
  category: { code: string };
  canonicalName: string;
  thumbnailUrl: string | null;
  status?: string;
  isAdminApproved?: boolean;
  adminPriority?: number;
  popularityScore?: string | number;
  specStatus?: string;
  primaryOffer?: {
    supplierProduct?: {
      externalProductId: string;
      productUrl: string;
      imageUrl: string | null;
      summarySpecText: string | null;
      detailImages?: string[];
      badges?: string[];
      reviewCount: number | null;
      rating: string | null;
    } | null;
    latestPrice?: { benefitPrice: number | null; publicPrice: number; stockStatus: string } | null;
  } | null;
};

type ApiPartsResponse = { items?: ApiPart[]; totalPages?: number };

export type CatalogLoadOptions = {
  priorityCategory?: PartCategory;
  onCategoryLoaded?: (category: PartCategory, items: CatalogPart[]) => void;
  onCategoryError?: (category: PartCategory, error: unknown) => void;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';
const categoryCache = new Map<PartCategory, CatalogPart[]>();
const categoryRequests = new Map<PartCategory, Promise<CatalogPart[]>>();
let categoriesRequest: Promise<ApiCategory[]> | undefined;

export async function loadServerCategory(category: PartCategory) {
  const cached = categoryCache.get(category);
  if (cached) return cached;

  const running = categoryRequests.get(category);
  if (running) return running;

  const request = (async () => {
    const categories = await loadApiCategories();
    const apiCategory = categories.find((item) => categoryNameMap[item.code] === category);
    if (!apiCategory) throw new Error(`Unknown part category: ${category}`);
    const items = await fetchCategory(apiCategory);
    categoryCache.set(category, items);
    return items;
  })();

  categoryRequests.set(category, request);
  try {
    return await request;
  } finally {
    categoryRequests.delete(category);
  }
}

/** Selected category is ready first; the rest is filled in parallel. */
export async function loadServerCatalog(options: CatalogLoadOptions = {}) {
  const categories = await loadApiCategories();
  const entries = categories
    .map((category) => ({ category, name: categoryNameMap[category.code] }))
    .filter((entry): entry is { category: ApiCategory; name: PartCategory } => Boolean(entry.name));
  const priority = options.priorityCategory ?? 'CPU';
  const ordered = [...entries].sort((a, b) => Number(b.name === priority) - Number(a.name === priority));
  const loaded = new Map<PartCategory, CatalogPart[]>();

  const loadOne = async (entry: { category: ApiCategory; name: PartCategory }) => {
    try {
      const items = await loadServerCategory(entry.name);
      loaded.set(entry.name, items);
      options.onCategoryLoaded?.(entry.name, items);
      return items;
    } catch (error) {
      options.onCategoryError?.(entry.name, error);
      return [];
    }
  };

  if (ordered[0]) await loadOne(ordered[0]);
  await Promise.all(ordered.slice(1).map(loadOne));
  return entries.flatMap((entry) => loaded.get(entry.name) ?? categoryCache.get(entry.name) ?? []);
}

async function loadApiCategories() {
  if (!categoriesRequest) {
    categoriesRequest = fetch(`${apiBaseUrl}/parts/categories`)
      .then(assertResponse)
      .then((response) => response.json() as Promise<ApiCategory[]>)
      .catch((error) => {
        categoriesRequest = undefined;
        throw error;
      });
  }
  return categoriesRequest;
}

async function fetchCategory(category: ApiCategory) {
  const allItems: CatalogPart[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await fetch(`${apiBaseUrl}/parts?categoryId=${encodeURIComponent(category.id)}&page=${page}&limit=500`);
    const data = (await assertResponse(response).then((result) => result.json())) as ApiPartsResponse;
    allItems.push(...(data.items ?? []).map(toCatalogPart));
    totalPages = Math.max(totalPages, Number(data.totalPages ?? 1));
    page += 1;
  } while (page <= totalPages);

  return allItems;
}

function toCatalogPart(part: ApiPart): CatalogPart {
  const product = part.primaryOffer?.supplierProduct;
  const price = part.primaryOffer?.latestPrice;
  const detailImages = product?.detailImages ?? [];
  return {
    id: `DB-${part.id}`,
    category: categoryNameMap[part.category.code],
    productNo: product?.externalProductId ?? part.id,
    name: part.canonicalName,
    price: price?.benefitPrice ?? price?.publicPrice ?? 0,
    imageUrl: product?.imageUrl ?? part.thumbnailUrl ?? '',
    detailUrl: product?.productUrl ?? '#',
    detailImages,
    spec: product?.summarySpecText ?? '',
    reviewCount: product?.reviewCount ?? 0,
    reviewRate: Number(product?.rating ?? 0),
    badges: product?.badges ?? [],
    status: part.status,
    isAdminApproved: part.isAdminApproved,
    adminPriority: Number(part.adminPriority ?? 0),
    popularityScore: Number(part.popularityScore ?? 0),
    specStatus: part.specStatus,
    stockStatus: price?.stockStatus,
  };
}

async function assertResponse(response: Response) {
  if (!response.ok) throw new Error(`Part API request failed: ${response.status}`);
  return response;
}
