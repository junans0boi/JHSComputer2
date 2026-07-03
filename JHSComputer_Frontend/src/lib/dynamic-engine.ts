import type { CatalogPart, ManualSelection, PartCategory, Quote, QuoteInput, QuotePart } from './v1-types';
import { isCompatibleWithSelection } from './part-filters';
import { pickTier, buildCompatibility, categories } from './v1-estimator';
import { getWindowsFee } from './windows-options';

const CATEGORY_ORDER: PartCategory[] = ['CPU', '메인보드', 'RAM', '그래픽카드', '쿨러', '케이스', '파워', 'SSD'];

// Approximate budget allocation per tier (0 to 4)
// [CPU, MB, RAM, GPU, Cooler, Case, Power, SSD]
const TIER_BUDGET_TARGETS: Record<number, Record<PartCategory, [number, number]>> = {
  0: { // ~80만원
    CPU: [100000, 200000], 메인보드: [80000, 130000], RAM: [40000, 70000], 그래픽카드: [200000, 350000],
    쿨러: [20000, 40000], 케이스: [30000, 60000], 파워: [40000, 70000], SSD: [50000, 80000]
  },
  1: { // ~130만원
    CPU: [150000, 280000], 메인보드: [120000, 180000], RAM: [70000, 120000], 그래픽카드: [350000, 500000],
    쿨러: [30000, 60000], 케이스: [50000, 90000], 파워: [60000, 90000], SSD: [70000, 120000]
  },
  2: { // ~190만원
    CPU: [250000, 450000], 메인보드: [150000, 250000], RAM: [100000, 160000], 그래픽카드: [500000, 800000],
    쿨러: [50000, 100000], 케이스: [70000, 120000], 파워: [80000, 140000], SSD: [100000, 150000]
  },
  3: { // ~280만원
    CPU: [400000, 650000], 메인보드: [200000, 350000], RAM: [140000, 250000], 그래픽카드: [800000, 1400000],
    쿨러: [80000, 180000], 케이스: [90000, 180000], 파워: [120000, 200000], SSD: [150000, 250000]
  },
  4: { // 390만원 이상
    CPU: [600000, 1000000], 메인보드: [300000, 600000], RAM: [200000, 400000], 그래픽카드: [1400000, 3000000],
    쿨러: [150000, 300000], 케이스: [150000, 350000], 파워: [180000, 350000], SSD: [250000, 500000]
  }
};

export function generateDynamicQuote(input: QuoteInput, catalog: CatalogPart[]): Quote {
  const tier = pickTier(input);
  const targets = TIER_BUDGET_TARGETS[tier];

  // Modify targets based on specific input parameters
  if (input.purpose === '영상편집' || input.purpose === 'AI') {
    targets.RAM[0] *= 1.5;
    targets.RAM[1] *= 2.0;
  }
  if (input.storage === '2TB') {
    targets.SSD[0] = Math.max(150000, targets.SSD[0]);
    targets.SSD[1] = Math.max(250000, targets.SSD[1] * 1.5);
  }

  // Pre-sort catalog globally to favor parts with high review count (surrogate for "good/reliable/value")
  // and prioritize parts in the target price range.
  const scoredCatalog = catalog.map(part => {
    let score = part.reviewCount * 10;
    // Add extra score if "품절" is not in name (status is not reliably available here without common-codes)
    if (!part.name.includes('품절') && !part.name.includes('단종')) score += 10000;
    return { part, score };
  }).sort((a, b) => b.score - a.score);

  const bestSelection = backtrackBuild({}, 0, scoredCatalog, targets);
  
  // If backtracking fails to find a complete build (very rare), fallback to greedy
  const finalSelection = bestSelection || greedyBuild(scoredCatalog, targets);

  // Convert to QuotePart array matching 'categories' order
  const parts: QuotePart[] = categories.map((cat) => {
    const part = finalSelection[cat];
    if (!part) {
      return { category: cat, name: '부품을 찾을 수 없음', price: 0, memo: '수동으로 추가해주세요', supplier: '' };
    }
    return {
      category: part.category,
      name: part.name,
      memo: part.spec || '동적 엔진 자동 할당',
      price: part.price,
      supplier: '컴퓨존 카탈로그 기준',
      productNo: part.productNo,
      imageUrl: part.imageUrl,
      detailUrl: part.detailUrl,
    };
  });

  const subtotal = parts.reduce((sum, part) => sum + part.price, 0);
  const assemblyFee = input.purpose === '사무' ? 30000 : 50000;
  const shippingFee = 10000;
  const windowsFee = getWindowsFee(input.windows);

  return {
    id: `Q-DYN-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `실시간 맞춤 견적 · ${input.purpose} ${input.resolution}`,
    mode: 'AUTO',
    input,
    parts,
    performance: [],
    compatibility: buildCompatibility(parts),
    subtotal,
    assemblyFee,
    shippingFee,
    windowsFee,
    total: subtotal + assemblyFee + shippingFee + windowsFee,
    status: 'DRAFT',
  };
}

function backtrackBuild(
  currentSelection: ManualSelection,
  categoryIndex: number,
  scoredCatalog: { part: CatalogPart; score: number }[],
  targets: Record<PartCategory, [number, number]>
): ManualSelection | null {
  if (categoryIndex >= CATEGORY_ORDER.length) {
    return currentSelection; // Found a valid complete build
  }

  const category = CATEGORY_ORDER[categoryIndex];
  const [minPrice, maxPrice] = targets[category];

  // Find candidate parts for this category
  // Priorities:
  // 1. Fits in target price range
  // 2. Is compatible with current selection
  // 3. High score (review count)
  
  const candidates = scoredCatalog
    .filter(item => item.part.category === category)
    .filter(item => isCompatibleWithSelection(item.part, currentSelection))
    .sort((a, b) => {
      const aInPrice = a.part.price >= minPrice && a.part.price <= maxPrice;
      const bInPrice = b.part.price >= minPrice && b.part.price <= maxPrice;
      if (aInPrice && !bInPrice) return -1;
      if (!aInPrice && bInPrice) return 1;
      return b.score - a.score;
    })
    .map(item => item.part);

  // Try top 3 candidates to avoid massive search tree
  const maxTries = 3;
  for (let i = 0; i < Math.min(candidates.length, maxTries); i++) {
    const candidate = candidates[i];
    const nextSelection = { ...currentSelection, [category]: candidate };
    const result = backtrackBuild(nextSelection, categoryIndex + 1, scoredCatalog, targets);
    if (result !== null) {
      return result;
    }
  }

  // If top 3 failed (or no candidates), try allowing ANY price range as a fallback
  if (candidates.length === 0) {
     const fallbackCandidates = scoredCatalog
      .filter(item => item.part.category === category)
      .filter(item => isCompatibleWithSelection(item.part, currentSelection))
      .map(item => item.part);
      
     for (let i = 0; i < Math.min(fallbackCandidates.length, 3); i++) {
        const nextSelection = { ...currentSelection, [category]: fallbackCandidates[i] };
        const result = backtrackBuild(nextSelection, categoryIndex + 1, scoredCatalog, targets);
        if (result !== null) return result;
     }
  }

  return null; // Dead end
}

function greedyBuild(
  scoredCatalog: { part: CatalogPart; score: number }[],
  targets: Record<PartCategory, [number, number]>
): ManualSelection {
  const selection: ManualSelection = {};
  for (const category of CATEGORY_ORDER) {
    const [minPrice, maxPrice] = targets[category];
    const candidate = scoredCatalog
      .filter(item => item.part.category === category)
      .filter(item => isCompatibleWithSelection(item.part, selection))
      .sort((a, b) => {
        const aInPrice = a.part.price >= minPrice && a.part.price <= maxPrice;
        const bInPrice = b.part.price >= minPrice && b.part.price <= maxPrice;
        if (aInPrice && !bInPrice) return -1;
        if (!aInPrice && bInPrice) return 1;
        return b.score - a.score;
      })[0]?.part;
      
    if (candidate) {
      selection[category] = candidate;
    }
  }
  return selection;
}
