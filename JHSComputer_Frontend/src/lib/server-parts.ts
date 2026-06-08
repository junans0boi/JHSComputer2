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

type ApiCategory = {
  id: string;
  code: string;
};

type ApiPart = {
  id: string;
  category: { code: string };
  canonicalName: string;
  thumbnailUrl: string | null;
  primaryOffer?: {
    supplierProduct?: {
      externalProductId: string;
      productUrl: string;
      imageUrl: string | null;
      summarySpecText: string | null;
      rawSpecJson?: { detailImages?: string[]; detailSample?: { parsed?: { detailImages?: string[] } }; badges?: string[] };
      reviewCount: number | null;
      rating: string | null;
    } | null;
    latestPrice?: { benefitPrice: number | null; publicPrice: number; stockStatus: string } | null;
  } | null;
};

export async function loadServerCatalog() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';
  const categories = (await fetch(`${baseUrl}/parts/categories`).then((res) => res.json())) as ApiCategory[];
  const items: CatalogPart[] = [];

  for (const category of categories) {
    const categoryName = categoryNameMap[category.code];
    if (!categoryName) continue;
    const data = (await fetch(`${baseUrl}/parts?categoryId=${category.id}&limit=500`).then((res) => res.json())) as { items: ApiPart[] };
    for (const part of data.items ?? []) {
      const product = part.primaryOffer?.supplierProduct;
      const price = part.primaryOffer?.latestPrice;
      const detailImages = product?.rawSpecJson?.detailImages ?? product?.rawSpecJson?.detailSample?.parsed?.detailImages ?? [];
      items.push({
        id: `DB-${part.id}`,
        category: categoryName,
        productNo: product?.externalProductId ?? part.id,
        name: part.canonicalName,
        price: price?.benefitPrice ?? price?.publicPrice ?? 0,
        imageUrl: product?.imageUrl ?? part.thumbnailUrl ?? '',
        detailUrl: product?.productUrl ?? '#',
        detailImages,
        spec: product?.summarySpecText ?? '',
        reviewCount: product?.reviewCount ?? 0,
        reviewRate: Number(product?.rating ?? 0),
        badges: product?.rawSpecJson?.badges ?? [],
      });
    }
  }

  return items;
}
