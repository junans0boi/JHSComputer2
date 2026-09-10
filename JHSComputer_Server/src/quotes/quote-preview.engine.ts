import { validateQuoteProfile, type QuoteProfileV2 } from './quote-profile';

export const QUOTE_PREVIEW_RULESET_VERSION = 'quote-preview-v2' as const;

export type QuotePreviewStrategy = 'BALANCED' | 'PERFORMANCE' | 'VALUE_UPGRADE';

export type CatalogOffer = {
  offerId: string;
  externalProductId: string;
  productName: string;
  productUrl: string;
  imageUrl: string | null;
  offerName: string;
  supplierCode?: string;
  priceWon: number;
  publicPriceWon: number | null;
  stockStatus: string;
  priceCheckedAt: Date | string | null;
  isDefault: boolean;
  reviewCount?: number | null;
  rating?: number | null;
  summarySpecText?: string | null;
  displaySpecText?: string;
  detailImages?: string[];
};

export type CatalogPart = {
  partId: string;
  category: string;
  canonicalName: string;
  manufacturer?: string | null;
  popularityScore?: number | null;
  specStatus?: string | null;
  isAdminApproved?: boolean;
  spec: CatalogSpec;
  offers: CatalogOffer[];
};

export type CatalogSpec = {
  cpu?: { socket: string | null; tdpW: number | null; coreCount: number | null; threadCount: number | null; baseClockGhz?: number | null; boostClockGhz: number | null };
  gpu?: { chipsetMaker?: string | null; chipsetName?: string | null; memoryType?: string | null; memoryGb: number | null; interfaceText?: string | null; recommendedPsuW: number | null; powerConsumptionW: number | null; lengthMm: number | null };
  mainboard?: { socket: string | null; memoryType: string | null; formFactor: string | null; chipset?: string | null; memorySlotCount?: number | null; maxMemoryGb?: number | null; m2SlotCount?: number | null; sataPortCount?: number | null; pcieX16SlotCount?: number | null; wifiBuiltin?: boolean | null };
  ram?: { memoryType: string | null; capacityGb: number | null; moduleCount?: number | null; speedMhz?: number | null; profileType?: string | null };
  storage?: { storageType?: string | null; formFactor?: string | null; interfaceText?: string | null; capacityGb: number | null; seqReadMbps?: number | null; seqWriteMbps?: number | null };
  psu?: { formFactor?: string | null; ratedWattage: number | null; certification?: string | null; modularType?: string | null; pcie5Ready?: boolean | null };
  case?: { caseType?: string | null; supportedBoardForms: string[] | null; maxGpuLengthMm: number | null; maxCoolerHeightMm: number | null; fanCount?: number | null };
  cooler?: { supportedSockets: string[] | null; heightMm: number | null; coolerType?: string | null; fanSizeMm?: number | null; tdpRatingW?: number | null };
};

export type QuoteCandidatePart = CatalogOffer & {
  partId: string;
  category: string;
  partName: string;
  manufacturer?: string | null;
  trustScore: number;
  trustLabel: 'VERIFIED_MANUFACTURER' | 'ADMIN_APPROVED' | 'POPULAR' | 'SPEC_VERIFIED' | 'UNVERIFIED';
};

export type PerformanceEvidenceType = 'MEASURED' | 'SOURCE_BENCHMARK' | 'SOURCE_RECOMMENDATION' | 'SOURCE_REPORTED' | 'DERIVED' | 'NONE';

export type PerformanceEvidenceResult = {
  game: string;
  resolution: string;
  fpsMin: number | null;
  fpsMax: number | null;
  sampleCount: number;
  evidenceType: Exclude<PerformanceEvidenceType, 'NONE'>;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceNote: string;
};

export type PerformanceEvidence = {
  evidenceType: PerformanceEvidenceType;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  sampleCount: number;
  results: PerformanceEvidenceResult[];
  note: string;
};

export type CompatibilityCheck = {
  rule: string;
  passed: boolean;
  detail: string;
};

export type QuoteCandidate = {
  id: string;
  strategy: QuotePreviewStrategy;
  status: 'READY';
  parts: QuoteCandidatePart[];
  subtotalWon: number;
  assemblyFeeWon: number;
  shippingFeeWon: number;
  windowsFeeWon: number;
  totalWon: number;
  priceCheckedAt: string;
  selectionReasons: string[];
  unmetConditions: string[];
  compatibility: CompatibilityCheck[];
  performanceEvidence: PerformanceEvidence;
};

export type QuotePreviewResult = {
  profileVersion: 2;
  rulesetVersion: typeof QUOTE_PREVIEW_RULESET_VERSION;
  status: 'READY' | 'REVIEW_REQUIRED';
  candidates: QuoteCandidate[];
  review?: {
    reasons: string[];
    relaxations: string[];
    requiredMinimumWon?: number;
    shortfallWon?: number;
  };
};

export function emptyPerformanceEvidence(note = '선택한 CPU/GPU 조합의 성능 근거가 없습니다.'): PerformanceEvidence {
  return { evidenceType: 'NONE', confidence: 'NONE', sampleCount: 0, results: [], note };
}

export function summarizePerformanceEvidence(results: PerformanceEvidenceResult[]): PerformanceEvidence {
  if (!results.length) return emptyPerformanceEvidence();
  const evidenceType = results.some((result) => result.evidenceType === 'DERIVED')
    ? 'DERIVED'
    : results.some((result) => result.evidenceType === 'MEASURED')
      ? 'MEASURED'
      : results.some((result) => result.evidenceType === 'SOURCE_BENCHMARK')
        ? 'SOURCE_BENCHMARK'
        : results.some((result) => result.evidenceType === 'SOURCE_RECOMMENDATION')
          ? 'SOURCE_RECOMMENDATION'
          : 'SOURCE_REPORTED';
  const confidenceRank = { LOW: 1, MEDIUM: 2, HIGH: 3 } as const;
  const confidence = results.reduce<'LOW' | 'MEDIUM' | 'HIGH'>((lowest, result) => (
    confidenceRank[result.confidence] < confidenceRank[lowest] ? result.confidence : lowest
  ), 'HIGH');
  return {
    evidenceType,
    confidence,
    sampleCount: results.reduce((sum, result) => sum + result.sampleCount, 0),
    results,
    note: [...new Set(results.map((result) => result.evidenceNote))].join(' '),
  };
}

type WorkloadDemand = {
  minCpuCores: number;
  minCpuThreads: number;
  minGpuMemoryGb: number;
  minRamGb: number;
  minStorageGb: number;
  primaryWorkload?: QuoteProfileV2['workloadProfile']['workloads'][number]['type'];
};

type PlanScores = {
  performanceScore: number;
  valueScore: number;
  aestheticsScore: number;
  upgradeabilityScore: number;
  preferenceScore: number;
  workloadFitScore: number;
  trustScore: number;
};

const requiredCategories = ['CPU', 'MAINBOARD', 'RAM', 'GPU', 'SSD', 'PSU', 'CASE', 'CPU_COOLER'] as const;
const strategyOrder: QuotePreviewStrategy[] = ['BALANCED', 'PERFORMANCE', 'VALUE_UPGRADE'];
const trustRequiredCategories = new Set(['CPU', 'GPU', 'MAINBOARD', 'RAM', 'SSD', 'PSU', 'CASE', 'CPU_COOLER']);

const coreManufacturers: Record<string, string[]> = {
  CPU: ['AMD', 'INTEL'],
  GPU: ['NVIDIA', 'AMD', 'INTEL'],
};

const establishedManufacturers: Record<string, string[]> = {
  CPU: ['AMD', 'INTEL'],
  GPU: ['MSI', 'ASUS', 'GIGABYTE', 'ASROCK', 'ZOTAC', 'GALAX', 'GAINWARD', 'SAPPHIRE', 'XFX', 'POWERCOLOR', 'PNY', 'PALIT', 'INNO3D', 'COLORFUL', 'MANLI', 'EMTEK'],
  MAINBOARD: ['ASUS', 'MSI', 'GIGABYTE', 'ASROCK', 'BIOSTAR', 'COLORFUL', 'SUPERMICRO', 'NZXT'],
  RAM: ['SAMSUNG', 'SK HYNIX', 'SKHYNIX', 'MICRON', 'CRUCIAL', 'G.SKILL', 'GSKILL', 'KINGSTON', 'CORSAIR', 'TEAM GROUP', 'TEAMGROUP', 'ADATA', 'PATRIOT', 'APACER', 'KLEVV', 'ESSENCORE'],
  SSD: ['SAMSUNG', 'WESTERN DIGITAL', 'WESTERNDIGITAL', 'WD', 'CRUCIAL', 'SOLIDIGM', 'SK HYNIX', 'SKHYNIX', 'KIOXIA', 'KINGSTON', 'SEAGATE', 'LEXAR', 'SANDISK', 'TRANSCEND', 'PATRIOT', 'TEAM GROUP', 'TEAMGROUP', 'ADATA', 'KLEVV', 'MICRON', 'ESSENCORE'],
  PSU: ['SEASONIC', 'CORSAIR', 'SUPER FLOWER', 'SUPERFLOWER', 'FSP', 'BE QUIET', 'BEQUIET', 'ANTEC', 'EVGA', 'COOLER MASTER', 'COOLERMASTER', 'SILVERSTONE', 'THERMALTAKE', 'DEEPCOOL', 'MICRONICS', 'ENERMAX', 'MSI', '3RSYS', 'ABKO'],
  CASE: ['ASUS', 'MSI', 'GIGABYTE', 'ASROCK', 'CORSAIR', 'NZXT', 'FRACTAL DESIGN', 'LIAN LI', 'LIAN-LI', 'MONTECH', 'DARKFLASH', 'BRAVOTEC', 'DAVEN', '3RSYS', 'ABKO', '마이크로닉스', 'PHANTEKS'],
  CPU_COOLER: ['NOCTUA', 'ARCTIC', 'THERMALRIGHT', 'DEEPCOOL', 'COOLER MASTER', 'COOLERMASTER', 'CORSAIR', 'BE QUIET', 'BEQUIET', '3RSYS', 'JONSBO', 'PCCOOLER', 'JUSHAARK', 'JIUSHARK', '잘만', '마이크로닉스'],
};

const popularityReviewThreshold: Record<string, number> = {
  CPU: 100,
  GPU: 100,
  MAINBOARD: 100,
  RAM: 100,
  SSD: 100,
  PSU: 200,
  CASE: 50,
  CPU_COOLER: 50,
};

const candidateLimitByCategory: Record<string, number> = {
  CPU: 48,
  GPU: 64,
  MAINBOARD: 72,
  RAM: 72,
  SSD: 48,
  PSU: 64,
  CASE: 72,
  CPU_COOLER: 64,
};

const selectedOfferCache = new WeakMap<CatalogPart, CatalogOffer | undefined>();
const trustScoreCache = new WeakMap<CatalogPart, number>();

type Plan = {
  parts: CatalogPart[];
  offers: CatalogOffer[];
  compatibility: CompatibilityCheck[];
  subtotalWon: number;
  totalWon: number;
  qualityScore: number;
} & PlanScores;

export function generateQuotePreview(profile: QuoteProfileV2, catalog: CatalogPart[]): QuotePreviewResult {
  validateQuoteProfile(profile);

  const grouped = groupCatalog(catalog);
  const missingCategories = requiredCategories.filter((category) => !grouped.get(category)?.length);
  if (missingCategories.length) {
    return reviewRequired([
      `판매 가능한 ${missingCategories.join(', ')} 상품이 없습니다.`,
    ], ['누락 카테고리의 활성 판매 단위를 추가합니다.']);
  }
  if (isAiDominant(profile) && !grouped.get('GPU')!.some((part) => isCudaGpu(part) && isGpuSpecUsable(part))) {
    return reviewRequired(
      ['AI 추론에 사용할 CUDA 호환 GPU가 판매 카탈로그에 없습니다.'],
      ['CUDA 호환 NVIDIA GPU를 추가하거나 AI 가속기 조건을 명시적으로 완화합니다.'],
    );
  }
  const trustMissingCategories = requiredCategories.filter((category) => grouped.get(category)?.length && !trustEligibleParts(grouped.get(category)!, category).length);

  const candidates: QuoteCandidate[] = [];
  const usedFingerprints = new Set<string>();
  for (const strategy of strategyOrder) {
    const plan = findPlan(profile, grouped, strategy, usedFingerprints)
      ?? findPlan(profile, grouped, strategy, usedFingerprints, strategy, 2);
    if (!plan) continue;
    const candidate = toCandidate(profile, strategy, plan, candidates.length + 1);
    candidates.push(candidate);
    usedFingerprints.add(fingerprint(plan));
  }

  if (!candidates.length) {
    const unconstrained = {
      ...profile,
      budgetProfile: { ...profile.budgetProfile, maximumWon: Number.MAX_SAFE_INTEGER },
    };
    const feasiblePlan = findPlan(unconstrained, grouped, 'VALUE_UPGRADE', new Set<string>(), 'CHEAPEST', 2);
    const requiredMinimumWon = feasiblePlan?.totalWon;
    return reviewRequired(
      [
        ...(trustMissingCategories.length ? [`${trustMissingCategories.join(', ')} 카테고리에 검증 제조사 또는 충분한 판매 후기·평점 근거가 있는 상품이 없습니다.`] : []),
        '활성 판매 단위만으로 예산 상한과 호환성 조건을 동시에 만족하는 조합이 없습니다.',
      ],
      ['최대 예산을 높이거나 workload 비중·저장장치 요구를 완화합니다.'],
      requiredMinimumWon === undefined ? undefined : { requiredMinimumWon, shortfallWon: Math.max(0, requiredMinimumWon - profile.budgetProfile.maximumWon) },
    );
  }

  return {
    profileVersion: 2,
    rulesetVersion: QUOTE_PREVIEW_RULESET_VERSION,
    status: 'READY',
    candidates,
  };
}

function findPlan(
  profile: QuoteProfileV2,
  grouped: Map<string, CatalogPart[]>,
  strategy: QuotePreviewStrategy,
  usedFingerprints: Set<string>,
  sortStrategy: QuotePreviewStrategy | 'CHEAPEST' = strategy,
  limitFactor = 1,
): Plan | undefined {
  const demand = deriveWorkloadDemand(profile);
  const cpus = shortlist(ordered(trustEligibleParts(grouped.get('CPU')!, 'CPU'), strategy, 'CPU')
    .filter((part) => (part.spec.cpu?.coreCount ?? 0) >= demand.minCpuCores && (part.spec.cpu?.threadCount ?? 0) >= demand.minCpuThreads), 'CPU', limitFactor);
  const gpus = shortlist(preferredGpuCandidates(ordered(trustEligibleParts(grouped.get('GPU')!, 'GPU'), strategy, 'GPU'), profile)
    .filter((part) => (part.spec.gpu?.memoryGb ?? 0) >= demand.minGpuMemoryGb), 'GPU', limitFactor);
  const boards = shortlist(ordered(trustEligibleParts(grouped.get('MAINBOARD')!, 'MAINBOARD'), strategy, 'MAINBOARD'), 'MAINBOARD', limitFactor);
  const rams = shortlist(ordered(trustEligibleParts(grouped.get('RAM')!, 'RAM'), strategy, 'RAM')
    .filter((part) => meetsRamDemand(part, demand)), 'RAM', limitFactor);
  const storages = shortlist(ordered(trustEligibleParts(grouped.get('SSD')!, 'SSD'), strategy, 'SSD'), 'SSD', limitFactor);
  const psus = shortlist(ordered(trustEligibleParts(grouped.get('PSU')!, 'PSU'), strategy, 'PSU').filter(isPsuCatalogPart), 'PSU', limitFactor);
  const cases = shortlist(ordered(trustEligibleParts(grouped.get('CASE')!, 'CASE'), strategy, 'CASE'), 'CASE', limitFactor);
  const coolers = shortlist(ordered(trustEligibleParts(grouped.get('CPU_COOLER')!, 'CPU_COOLER'), strategy, 'CPU_COOLER'), 'CPU_COOLER', limitFactor);
  const boardRamBySocket = boardRamOptionsBySocket(boards, rams, demand);
  const priceOrderedPsus = [...psus].sort(comparePartPrice);
  const priceOrderedStorages = [...storages].sort(comparePartPrice);
  const selectedStorages = selectStorageParts(priceOrderedStorages, profile, demand);
  if (!selectedStorages) return undefined;
  const caseCoolerCache = new Map<string, { pcCase: CatalogPart; cooler: CatalogPart } | null>();
  const plans: Plan[] = [];

  for (const cpu of cpus) {
    for (const gpu of gpus) {
      if (!meetsProcessorDemand(cpu, gpu, demand)) continue;
      const boardCase = chooseCheapestBoardCase(
        boardRamBySocket.get(cpu.spec.cpu?.socket ?? '') ?? [],
        cases,
        coolers,
        cpu,
        gpu,
        caseCoolerCache,
      );
      if (!boardCase) continue;
      const psu = priceOrderedPsus.find((candidate) => isPsuCompatible(candidate, cpu, gpu));
      if (!psu) continue;
      const { board, ram, pcCase, cooler } = boardCase;

      const parts = [cpu, board, ram, gpu, ...selectedStorages, psu, pcCase, cooler];
      const offers = parts.map(selectOffer);
      if (offers.some((offer) => !offer)) continue;
      const selectedOffers = offers as CatalogOffer[];
      const subtotalWon = selectedOffers.reduce((sum, offer) => sum + offer.priceWon, 0);
      const totalWon = subtotalWon + totalFees(profile).totalWon;
      if (totalWon > profile.budgetProfile.maximumWon) continue;

      const workloadFitScore = workloadFitScoreFor(parts, demand);
      const planScores = scorePlan(parts, subtotalWon, totalWon, profile, demand, workloadFitScore);
      const plan: Plan = {
        parts,
        offers: selectedOffers,
        compatibility: compatibilityChecks(cpu, board, ram, gpu, selectedStorages, psu, pcCase, cooler),
        subtotalWon,
        totalWon,
        qualityScore: qualityScore(parts),
        ...planScores,
      };
      if (!usedFingerprints.has(fingerprint(plan))) plans.push(plan);
    }
  }

  return plans.sort((a, b) => comparePlans(a, b, sortStrategy, profile.budgetProfile.targetWon))[0];
}

function boardRamOptionsBySocket(boards: CatalogPart[], rams: CatalogPart[], demand: WorkloadDemand) {
  const result = new Map<string, { board: CatalogPart; ram: CatalogPart }[]>();
  for (const board of boards) {
    const socket = board.spec.mainboard?.socket;
    if (!socket) continue;
    const ram = rams
      .filter((candidate) => isMemoryCompatible(board, candidate) && meetsRamDemand(candidate, demand))
      .sort(comparePartPrice)[0];
    if (!ram) continue;
    const options = result.get(socket) ?? [];
    options.push({ board, ram });
    result.set(socket, options);
  }
  for (const options of result.values()) options.sort((left, right) => comparePartBundles(
    [left.board, left.ram],
    [right.board, right.ram],
  ));
  return result;
}

function chooseCheapestBoardCase(
  boardRamOptions: { board: CatalogPart; ram: CatalogPart }[],
  cases: CatalogPart[],
  coolers: CatalogPart[],
  cpu: CatalogPart,
  gpu: CatalogPart,
  cache: Map<string, { pcCase: CatalogPart; cooler: CatalogPart } | null>,
) {
  let best: { board: CatalogPart; ram: CatalogPart; pcCase: CatalogPart; cooler: CatalogPart } | undefined;
  for (const option of boardRamOptions) {
    if (!isBoardThermallySuitable(option.board, cpu)) continue;
    const caseCooler = chooseCaseCooler(cases, coolers, cpu, gpu, option.board, cache);
    if (!caseCooler) continue;
    if (!best || comparePartBundles(
      [option.board, option.ram, caseCooler.pcCase, caseCooler.cooler],
      [best.board, best.ram, best.pcCase, best.cooler],
    ) < 0) best = { ...option, ...caseCooler };
  }
  return best;
}

function chooseCaseCooler(
  cases: CatalogPart[],
  coolers: CatalogPart[],
  cpu: CatalogPart,
  gpu: CatalogPart,
  board: CatalogPart,
  cache: Map<string, { pcCase: CatalogPart; cooler: CatalogPart } | null>,
) {
  const formFactor = board.spec.mainboard?.formFactor ?? '';
  const key = `${cpu.partId}:${gpu.partId}:${board.partId}:${cpu.spec.cpu?.socket ?? ''}:${gpu.spec.gpu?.lengthMm ?? ''}:${gpu.spec.gpu?.powerConsumptionW ?? ''}:${cpu.spec.cpu?.coreCount ?? ''}:${formFactor}`;
  if (cache.has(key)) return cache.get(key) ?? undefined;
  let best: { pcCase: CatalogPart; cooler: CatalogPart } | undefined;
  const priceOrderedCoolers = [...coolers].sort(comparePartPrice);
  for (const pcCase of cases) {
    if (!isCaseCompatible(pcCase, board, gpu) || !isCaseAirflowSuitable(pcCase, gpu)) {
      continue;
    }
    const cooler = priceOrderedCoolers.find((candidate) => isCoolerCompatible(candidate, cpu, pcCase) && isCoolerThermallySuitable(candidate, cpu));
    if (!cooler) continue;
    if (!best || comparePartBundles([pcCase, cooler], [best.pcCase, best.cooler]) < 0) {
      best = { pcCase, cooler };
    }
  }
  cache.set(key, best ?? null);
  return best;
}

function comparePartPrice(left: CatalogPart, right: CatalogPart) {
  const priceDiff = partPrice(left) - partPrice(right);
  const priceTolerance = Math.max(25_000, Math.min(partPrice(left), partPrice(right)) * 0.15);
  if (Math.abs(priceDiff) > priceTolerance) return priceDiff;
  return trustScore(right) - trustScore(left) || priceDiff || qualityScore([right]) - qualityScore([left]);
}

function comparePartBundles(left: CatalogPart[], right: CatalogPart[]) {
  const leftPrice = left.reduce((sum, part) => sum + partPrice(part), 0);
  const rightPrice = right.reduce((sum, part) => sum + partPrice(part), 0);
  const priceDiff = leftPrice - rightPrice;
  const priceTolerance = Math.max(50_000, Math.min(leftPrice, rightPrice) * 0.12);
  if (Math.abs(priceDiff) > priceTolerance) return priceDiff;
  return right.reduce((sum, part) => sum + trustScore(part), 0)
    - left.reduce((sum, part) => sum + trustScore(part), 0)
    || priceDiff;
}

function partPrice(part: CatalogPart) {
  return selectOffer(part)?.priceWon ?? Number.MAX_SAFE_INTEGER;
}

function shortlist(parts: CatalogPart[], category: string, limitFactor = 1) {
  return parts.slice(0, (candidateLimitByCategory[category] ?? 100) * Math.max(1, limitFactor));
}

function groupCatalog(catalog: CatalogPart[]) {
  const grouped = new Map<string, CatalogPart[]>();
  for (const part of catalog) {
    if (!part.offers.length) continue;
    const current = grouped.get(part.category) ?? [];
    current.push(part);
    grouped.set(part.category, current);
  }
  return grouped;
}

function trustEligibleParts(parts: CatalogPart[], category: string) {
  if (!trustRequiredCategories.has(category)) return parts;
  return parts.filter((part) => isTrustEligible(part, category))
    .filter((part) => category !== 'GPU' || isGpuSpecUsable(part));
}

function hasTrustMetadata(part: CatalogPart) {
  return part.manufacturer != null
    || part.popularityScore != null
    || part.specStatus != null
    || part.isAdminApproved !== undefined
    || part.offers.some((offer) => offer.reviewCount != null || offer.rating != null);
}

function isTrustEligible(part: CatalogPart, category: string) {
  if (!hasTrustMetadata(part)) return false;
  const tier = manufacturerTrustTier(part, category);
  return tier > 0 || hasPopularityEvidence(part, category) || part.isAdminApproved === true;
}

function manufacturerTrustTier(part: CatalogPart, category: string) {
  const manufacturer = normalizeManufacturer(part.manufacturer);
  if (!manufacturer) return 0;
  if ((coreManufacturers[category] ?? []).some((candidate) => manufacturer === normalizeManufacturer(candidate))) return 2;
  if ((establishedManufacturers[category] ?? []).some((candidate) => manufacturer === normalizeManufacturer(candidate))) return 1;
  return 0;
}

function normalizeManufacturer(value: string | null | undefined) {
  return String(value ?? '').toUpperCase().replace(/[\s._-]+/g, '');
}

function bestReviewCount(part: CatalogPart) {
  return Number(selectOffer(part)?.reviewCount ?? 0) || 0;
}

function bestRating(part: CatalogPart) {
  const rating = Number(selectOffer(part)?.rating);
  return Number.isFinite(rating) && rating > 0 ? rating : 0;
}

function hasPopularityEvidence(part: CatalogPart, category: string) {
  const reviewThreshold = popularityReviewThreshold[category] ?? 100;
  const reviewCount = bestReviewCount(part);
  const rating = bestRating(part);
  const popularitySignal = Math.min(1, Math.log10((Number(part.popularityScore ?? 0) || 0) + 1) / 5);
  return (reviewCount >= reviewThreshold && rating >= 4.5) || popularitySignal >= 0.65;
}

function isVerifiedSpec(part: CatalogPart) {
  return Boolean(part.specStatus && !['UNVERIFIED', 'FAILED', 'UNKNOWN'].includes(String(part.specStatus).toUpperCase()));
}

function trustScore(part: CatalogPart) {
  const cached = trustScoreCache.get(part);
  if (cached !== undefined) return cached;
  const tier = manufacturerTrustTier(part, part.category);
  const reviewSignal = Math.min(1, Math.log10(bestReviewCount(part) + 1) / 4.5);
  const popularitySignal = Math.min(1, Math.log10((Number(part.popularityScore ?? 0) || 0) + 1) / 5);
  const rating = bestRating(part);
  const ratingSignal = rating > 0 ? Math.min(1, rating / 5) : 0;
  const manufacturerScore = tier >= 2 ? 55 : tier === 1 ? 45 : 10;
  const verificationScore = (part.isAdminApproved ? 5 : 0) + (isVerifiedSpec(part) ? 5 : 0);
  const score = Math.round(Math.min(100, manufacturerScore + reviewSignal * 20 + popularitySignal * 10 + ratingSignal * 10 + verificationScore));
  trustScoreCache.set(part, score);
  return score;
}

function trustLabel(part: CatalogPart): QuoteCandidatePart['trustLabel'] {
  if (manufacturerTrustTier(part, part.category) > 0) return 'VERIFIED_MANUFACTURER';
  if (part.isAdminApproved === true) return 'ADMIN_APPROVED';
  if (hasPopularityEvidence(part, part.category)) return 'POPULAR';
  return isVerifiedSpec(part) ? 'SPEC_VERIFIED' : 'UNVERIFIED';
}

function trustSummary(parts: CatalogPart[]) {
  const verifiedCount = parts.filter((part) => trustLabel(part) === 'VERIFIED_MANUFACTURER').length;
  const approvedCount = parts.filter((part) => trustLabel(part) === 'ADMIN_APPROVED').length;
  const popularCount = parts.filter((part) => trustLabel(part) === 'POPULAR').length;
  const specVerifiedCount = parts.filter((part) => trustLabel(part) === 'SPEC_VERIFIED').length;
  return `검증 제조사 ${verifiedCount}개, 관리자 승인 ${approvedCount}개, 인기 근거 ${popularCount}개, 검증 스펙 ${specVerifiedCount}개를 우선했습니다.`;
}

function preferredGpuCandidates(parts: CatalogPart[], profile: QuoteProfileV2) {
  if (!isAiDominant(profile)) return parts;
  const cudaCandidates = parts.filter(isCudaGpu);
  return cudaCandidates.length ? cudaCandidates : [];
}

function ordered(parts: CatalogPart[], strategy: QuotePreviewStrategy, _category: string) {
  return [...parts].sort((left, right) => {
    const leftOffer = selectOffer(left);
    const rightOffer = selectOffer(right);
    if (!leftOffer || !rightOffer) return 0;
    const qualityDiff = qualityScore([left]) - qualityScore([right]);
    const trustDiff = trustScore(left) - trustScore(right);
    if (strategy === 'PERFORMANCE') return (qualityDiff + trustDiff * 2) || rightOffer.priceWon - leftOffer.priceWon;
    if (strategy === 'VALUE_UPGRADE') return (leftOffer.priceWon - qualityScore([left]) * 100 - trustScore(left) * 300)
      - (rightOffer.priceWon - qualityScore([right]) * 100 - trustScore(right) * 300);
    return (Math.abs(leftOffer.priceWon - 300_000) - trustScore(left) * 500)
      - (Math.abs(rightOffer.priceWon - 300_000) - trustScore(right) * 500)
      || qualityDiff;
  });
}

function comparePlans(left: Plan, right: Plan, strategy: QuotePreviewStrategy | 'CHEAPEST', targetWon: number) {
  if (strategy === 'CHEAPEST') return left.totalWon - right.totalWon;
  if (strategy === 'PERFORMANCE') return right.performanceScore - left.performanceScore
    || right.workloadFitScore - left.workloadFitScore
    || right.trustScore - left.trustScore
    || left.totalWon - right.totalWon;
  if (strategy === 'VALUE_UPGRADE') {
    return (right.valueScore + right.upgradeabilityScore + right.trustScore * 0.5)
      - (left.valueScore + left.upgradeabilityScore + left.trustScore * 0.5)
      || right.workloadFitScore - left.workloadFitScore
      || right.trustScore - left.trustScore
      || left.totalWon - right.totalWon;
  }
  const leftTargetPenalty = Math.abs(left.totalWon - targetWon) / Math.max(1, targetWon);
  const rightTargetPenalty = Math.abs(right.totalWon - targetWon) / Math.max(1, targetWon);
  return (leftTargetPenalty - left.preferenceScore / 400) - (rightTargetPenalty - right.preferenceScore / 400)
    || right.preferenceScore - left.preferenceScore
    || right.trustScore - left.trustScore
    || right.workloadFitScore - left.workloadFitScore;
}

function selectOffer(part: CatalogPart): CatalogOffer | undefined {
  if (selectedOfferCache.has(part)) return selectedOfferCache.get(part);
  const selected = [...part.offers].sort((left, right) => Number(right.isDefault) - Number(left.isDefault) || left.priceWon - right.priceWon)[0];
  selectedOfferCache.set(part, selected);
  return selected;
}

function isSocketCompatible(cpu: CatalogPart, board: CatalogPart) {
  const cpuSocket = cpu.spec.cpu?.socket;
  const boardSocket = board.spec.mainboard?.socket;
  return Boolean(cpuSocket && boardSocket && cpuSocket === boardSocket);
}

function isMemoryCompatible(board: CatalogPart, ram: CatalogPart) {
  const boardMemory = board.spec.mainboard?.memoryType;
  const ramMemory = ram.spec.ram?.memoryType;
  return Boolean(boardMemory && ramMemory && boardMemory.toUpperCase() === ramMemory.toUpperCase());
}

function isCaseCompatible(pcCase: CatalogPart, board: CatalogPart, gpu: CatalogPart) {
  const boardForm = board.spec.mainboard?.formFactor;
  const supportedForms = pcCase.spec.case?.supportedBoardForms;
  const maxGpuLength = pcCase.spec.case?.maxGpuLengthMm;
  const gpuLength = gpu.spec.gpu?.lengthMm;
  return Boolean(boardForm && supportedForms?.includes(boardForm) && maxGpuLength && gpuLength && gpuLength <= maxGpuLength);
}

function isCoolerCompatible(cooler: CatalogPart, cpu: CatalogPart, pcCase: CatalogPart) {
  const socket = cpu.spec.cpu?.socket;
  const supportedSockets = cooler.spec.cooler?.supportedSockets;
  const height = cooler.spec.cooler?.heightMm;
  const maxHeight = pcCase.spec.case?.maxCoolerHeightMm;
  return Boolean(socket && supportedSockets?.includes(socket) && height && maxHeight && height <= maxHeight);
}

function isPsuCompatible(psu: CatalogPart, cpu: CatalogPart, gpu: CatalogPart) {
  const rated = psu.spec.psu?.ratedWattage;
  const recommended = gpu.spec.gpu?.recommendedPsuW;
  const tdp = cpu.spec.cpu?.tdpW;
  return Boolean(rated && recommended && tdp && rated >= Math.max(recommended, tdp + 250));
}

function isStorageCompatible(storage: CatalogPart, profile: QuoteProfileV2, demand: WorkloadDemand) {
  const capacity = storage.spec.storage?.capacityGb;
  const profileStorageDemand = profile.storageDemand.systemGb + profile.storageDemand.activeProjectGb + profile.storageDemand.archiveGb;
  const growth = profile.storageDemand.growthGbPerYear;
  return Boolean(capacity && capacity >= Math.max(profileStorageDemand + growth, demand.minStorageGb));
}

function selectStorageParts(storages: CatalogPart[], profile: QuoteProfileV2, demand: WorkloadDemand): CatalogPart[] | undefined {
  const requiredCount = profile.storageDemand.redundancy === 'NONE' ? 1 : 2;
  const selected: CatalogPart[] = [];
  for (const storage of storages) {
    if (!isStorageCompatible(storage, profile, demand)) continue;
    if (selected.some((candidate) => candidate.partId === storage.partId)) continue;
    selected.push(storage);
    if (selected.length === requiredCount) return selected;
  }
  return undefined;
}

function deriveWorkloadDemand(profile: QuoteProfileV2): WorkloadDemand {
  const demand = profile.workloadProfile.workloads.reduce((total, workload) => {
    const weight = workload.weight / 100;
    const item = demandForWorkload(workload.type, workload.details);
    return {
      minCpuCores: total.minCpuCores + item.minCpuCores * weight,
      minCpuThreads: total.minCpuThreads + item.minCpuThreads * weight,
      minGpuMemoryGb: total.minGpuMemoryGb + item.minGpuMemoryGb * weight,
      minRamGb: total.minRamGb + item.minRamGb * weight,
      minStorageGb: total.minStorageGb + item.minStorageGb * weight,
    };
  }, { minCpuCores: 0, minCpuThreads: 0, minGpuMemoryGb: 0, minRamGb: 0, minStorageGb: 0 });

  return {
    minCpuCores: Math.ceil(demand.minCpuCores),
    minCpuThreads: Math.ceil(demand.minCpuThreads),
    minGpuMemoryGb: Math.ceil(demand.minGpuMemoryGb),
    minRamGb: Math.ceil(demand.minRamGb),
    minStorageGb: Math.ceil(demand.minStorageGb),
    primaryWorkload: [...profile.workloadProfile.workloads].sort((left, right) => right.weight - left.weight)[0]?.type ?? 'OFFICE',
  };
}

function demandForWorkload(type: QuoteProfileV2['workloadProfile']['workloads'][number]['type'], details: Record<string, unknown>): WorkloadDemand {
  switch (type) {
    case 'GAMING': {
      const resolution = String(details.resolution);
      const resolutionDemand = resolution === '8K'
        ? { gpu: 24, cpu: 10, threads: 20, ram: 32 }
        : resolution === '4K'
          ? { gpu: 12, cpu: 8, threads: 16, ram: 32 }
          : resolution === 'QHD'
            ? { gpu: 8, cpu: 6, threads: 12, ram: 16 }
            : { gpu: 6, cpu: 4, threads: 8, ram: 16 };
      const refreshRate = Number(details.refreshRate);
      return {
        minCpuCores: resolutionDemand.cpu + (refreshRate >= 165 ? 2 : 0),
        minCpuThreads: resolutionDemand.threads + (refreshRate >= 165 ? 4 : 0),
        minGpuMemoryGb: resolutionDemand.gpu + (Array.isArray(details.games) && details.games.length >= 3 ? 2 : 0),
        minRamGb: resolutionDemand.ram,
        minStorageGb: 0,
      };
    }
    case 'STREAMING': {
      const resolution = String(details.outputResolution);
      const highResolution = resolution === '4K' || resolution === '8K';
      const hardwareEncoding = details.hardwareEncoding === true;
      return {
        minCpuCores: hardwareEncoding ? 6 : 8,
        minCpuThreads: hardwareEncoding ? 12 : 16,
        minGpuMemoryGb: highResolution ? 12 : 8,
        minRamGb: highResolution ? 32 : 16,
        minStorageGb: highResolution ? 1024 : 0,
      };
    }
    case 'VIDEO_EDITING': {
      const timeline = String(details.timeline);
      const highResolution = timeline === '4K' || timeline === '8K';
      return {
        minCpuCores: highResolution ? 8 : 6,
        minCpuThreads: highResolution ? 16 : 12,
        minGpuMemoryGb: highResolution ? 8 : 6,
        minRamGb: highResolution ? 32 : 16,
        minStorageGb: highResolution ? 2048 : 1024,
      };
    }
    case 'AI': {
      const modelSize = parseModelSize(String(details.modelSize));
      const quantizationBits = parseQuantizationBits(String(details.quantization));
      const modelMemory = modelSize > 0 ? Math.ceil(modelSize * quantizationBits / 8) : 8;
      return {
        minCpuCores: modelSize >= 30 ? 12 : 8,
        minCpuThreads: modelSize >= 30 ? 24 : 16,
        minGpuMemoryGb: Math.max(8, modelMemory + 4),
        minRamGb: modelSize >= 30 ? 64 : 32,
        minStorageGb: modelSize >= 30 ? 4096 : 1024,
      };
    }
    case 'OFFICE':
      return {
        minCpuCores: String(details.multitasking).toUpperCase() === 'HEAVY' ? 6 : 4,
        minCpuThreads: String(details.multitasking).toUpperCase() === 'HEAVY' ? 12 : 8,
        minGpuMemoryGb: 2,
        minRamGb: String(details.multitasking).toUpperCase() === 'HEAVY' ? 32 : 16,
        minStorageGb: 0,
      };
    case 'DEVELOPMENT': {
      const virtualMachines = details.virtualMachines === true;
      const containers = details.containers === true;
      return {
        minCpuCores: virtualMachines ? 10 : containers ? 8 : 6,
        minCpuThreads: virtualMachines ? 20 : containers ? 16 : 12,
        minGpuMemoryGb: 2,
        minRamGb: virtualMachines ? 64 : containers ? 32 : 16,
        minStorageGb: virtualMachines || containers ? 2048 : 1024,
      };
    }
  }
}

function parseModelSize(value: string) {
  const match = value.match(/(\d+(?:\.\d+)?)\s*B/i);
  return match ? Number(match[1]) : 0;
}

function parseQuantizationBits(value: string) {
  const match = value.match(/Q?(\d+)/i);
  return match ? Math.max(2, Number(match[1])) : 16;
}

function meetsProcessorDemand(cpu: CatalogPart, gpu: CatalogPart, demand: WorkloadDemand) {
  const cpuSpec = cpu.spec.cpu;
  const gpuSpec = gpu.spec.gpu;
  return Boolean(cpuSpec && gpuSpec && isGpuSpecUsable(gpu)
    && (cpuSpec.coreCount ?? 0) >= demand.minCpuCores
    && (cpuSpec.threadCount ?? 0) >= demand.minCpuThreads
    && (gpuSpec.memoryGb ?? 0) >= demand.minGpuMemoryGb);
}

function meetsRamDemand(ram: CatalogPart, demand: WorkloadDemand) {
  return (ram.spec.ram?.capacityGb ?? 0) >= demand.minRamGb;
}

function workloadFitScoreFor(parts: CatalogPart[], demand: WorkloadDemand) {
  const cpu = parts.find((part) => part.spec.cpu)?.spec.cpu;
  const gpu = parts.find((part) => part.spec.gpu)?.spec.gpu;
  const ram = parts.find((part) => part.spec.ram)?.spec.ram;
  const storage = parts.filter((part) => part.spec.storage).reduce((sum, part) => sum + (part.spec.storage?.capacityGb ?? 0), 0);
  const cap = demand.primaryWorkload === 'AI' ? 2.5 : 1.5;
  const ratio = (value: number, minimum: number) => minimum <= 0 ? 1 : Math.min(cap, value / minimum);
  const values = [
    ratio(cpu?.coreCount ?? 0, demand.minCpuCores),
    ratio(cpu?.threadCount ?? 0, demand.minCpuThreads),
    ratio(gpu?.memoryGb ?? 0, demand.minGpuMemoryGb),
    ratio(ram?.capacityGb ?? 0, demand.minRamGb),
    ratio(storage, demand.minStorageGb),
  ];
  const weights = demand.primaryWorkload === 'AI' ? [0.15, 0.1, 0.5, 0.2, 0.05] : [0.2, 0.2, 0.2, 0.2, 0.2];
  const score = values.reduce((sum, value, index) => sum + value * weights[index], 0);
  return Math.round(Math.min(100, score / cap * 100));
}

function scorePlan(parts: CatalogPart[], subtotalWon: number, totalWon: number, profile: QuoteProfileV2, demand: WorkloadDemand, workloadFitScore: number): PlanScores {
  const quality = Math.min(100, qualityScore(parts) / 5);
  const trust = parts.reduce((sum, part) => sum + trustScore(part), 0) / Math.max(1, parts.length);
  const value = Math.min(100, qualityScore(parts) / Math.max(1, totalWon) * 100_000);
  const aesthetics = aestheticScore(parts);
  const upgradeability = upgradeabilityScore(parts);
  const performance = Math.min(100, workloadFitScore * 0.6 + quality * 0.25 + trust * 0.15);
  const preference = (
    performance * profile.preferenceProfile.performance
    + value * profile.preferenceProfile.value
    + aesthetics * profile.preferenceProfile.aesthetics
    + upgradeability * profile.preferenceProfile.upgradeability
  ) / 100;
  return {
    performanceScore: performance,
    valueScore: value,
    aestheticsScore: aesthetics,
    upgradeabilityScore: upgradeability,
    preferenceScore: preference + workloadFitScore * 0.2 + trust * 0.25 + subtotalWon / Math.max(1, totalWon) * 5 + demand.minGpuMemoryGb * 0.01,
    workloadFitScore,
    trustScore: trust,
  };
}

function aestheticScore(parts: CatalogPart[]) {
  const text = parts.map((part) => part.canonicalName.toUpperCase()).join(' ');
  return Math.min(100, (['RGB', 'WHITE', 'BLACK', 'GAMING', 'ROG', 'AORUS'].filter((token) => text.includes(token)).length) * 16.67);
}

function upgradeabilityScore(parts: CatalogPart[]) {
  const board = parts.find((part) => part.spec.mainboard)?.spec.mainboard;
  const psu = parts.find((part) => part.spec.psu)?.spec.psu;
  const ram = parts.find((part) => part.spec.ram)?.spec.ram;
  return Math.min(100, (board?.formFactor?.toUpperCase() === 'ATX' ? 45 : 25)
    + Math.min(30, (psu?.ratedWattage ?? 0) / 30)
    + Math.min(25, (ram?.capacityGb ?? 0) / 2));
}

function compatibilityChecks(cpu: CatalogPart, board: CatalogPart, ram: CatalogPart, gpu: CatalogPart, storages: CatalogPart[], psu: CatalogPart, pcCase: CatalogPart, cooler: CatalogPart): CompatibilityCheck[] {
  return [
    { rule: 'CPU_SOCKET', passed: true, detail: `${cpu.spec.cpu?.socket} = ${board.spec.mainboard?.socket}` },
    { rule: 'MEMORY_TYPE', passed: true, detail: `${board.spec.mainboard?.memoryType} = ${ram.spec.ram?.memoryType}` },
    { rule: 'CASE_BOARD_GPU', passed: true, detail: '메인보드 폼팩터와 GPU 길이를 케이스 스펙으로 확인했습니다.' },
    { rule: 'COOLER_HEIGHT_SOCKET', passed: true, detail: 'CPU 소켓과 케이스 쿨러 높이를 확인했습니다.' },
    { rule: 'PSU_CAPACITY', passed: true, detail: `${psu.spec.psu?.ratedWattage}W 전원 용량을 확인했습니다.` },
    ...storages.map((storage, index) => ({
      rule: 'STORAGE_CAPACITY',
      passed: true,
      detail: `${index + 1}번 저장장치 ${storage.spec.storage?.capacityGb}GB 수요를 확인했습니다.`,
    })),
    { rule: 'STORAGE_REDUNDANCY', passed: true, detail: `${storages.length}개의 저장장치로 ${storages.length > 1 ? '중복 보관' : '단일 보관'} 요구를 확인했습니다.` },
    { rule: 'GPU_PRESENT', passed: Boolean(gpu.spec.gpu), detail: gpu.canonicalName },
  ];
}

function totalFees(profile: QuoteProfileV2) {
  const dominantWorkload = [...profile.workloadProfile.workloads].sort((left, right) => right.weight - left.weight)[0]?.type;
  const assemblyFee = profile.budgetProfile.includes.includes('ASSEMBLY') ? (dominantWorkload === 'OFFICE' ? 30_000 : 50_000) : 0;
  const shippingFee = profile.budgetProfile.includes.includes('SHIPPING') ? 10_000 : 0;
  const windowsFee = ({ WINDOWS_11_HOME_FPP: 205_000, WINDOWS_11_PRO_FPP: 324_600, INSTALL_ONLY: 30_000 } as Record<string, number>)[profile.windowsOption] ?? 0;
  return { assemblyFee, shippingFee, windowsFee, totalWon: assemblyFee + shippingFee + windowsFee };
}

function isAiDominant(profile: QuoteProfileV2) {
  const primary = [...profile.workloadProfile.workloads].sort((left, right) => right.weight - left.weight)[0];
  return primary?.type === 'AI' && primary.weight >= 50;
}

function catalogPartText(part: CatalogPart) {
  return `${part.canonicalName} ${part.offers.map((offer) => `${offer.productName} ${offer.offerName}`).join(' ')}`;
}

function isCudaGpu(part: CatalogPart) {
  const chipsetMaker = String(part.spec.gpu?.chipsetMaker ?? '').toUpperCase();
  const text = catalogPartText(part);
  const hasRadeonText = /(?:RADEON|라데온|\bRX\s*\d)/i.test(text);
  const hasNvidiaText = /(?:NVIDIA|GEFORCE|지포스|RTX|GTX|QUADRO|TESLA)/i.test(text);
  if (chipsetMaker) {
    if (/(?:AMD|ATI|INTEL)/.test(chipsetMaker)) return false;
    if (/NVIDIA/.test(chipsetMaker)) return !hasRadeonText;
  }
  return hasNvidiaText && !hasRadeonText;
}

function isGpuSpecUsable(part: CatalogPart) {
  const gpu = part.spec.gpu;
  return Boolean(gpu
    && (gpu.memoryGb ?? 0) > 0
    && (gpu.memoryGb ?? 0) <= 96
    && (gpu.recommendedPsuW ?? 0) >= 400
    && (gpu.lengthMm ?? 0) > 0);
}

function isPsuCatalogPart(part: CatalogPart) {
  const psu = part.spec.psu;
  if (!psu?.ratedWattage || psu.ratedWattage < 400) return false;
  if (/(?:케이블|커넥터|변환|젠더|연장|브라켓)/i.test(catalogPartText(part))) return false;
  if (hasTrustMetadata(part) && !/(?:80\s*PLUS|80PLUS)/i.test(String(psu.certification ?? ''))) return false;
  return true;
}

function isBoardThermallySuitable(board: CatalogPart, cpu: CatalogPart) {
  const coreCount = cpu.spec.cpu?.coreCount ?? 0;
  const chipset = String(board.spec.mainboard?.chipset ?? '').toUpperCase();
  if (coreCount >= 12 && /(?:A320|A520|A620|H410|H510|H610)/.test(chipset)) return false;
  return true;
}

function isCaseAirflowSuitable(pcCase: CatalogPart, gpu: CatalogPart) {
  const power = gpu.spec.gpu?.powerConsumptionW ?? 0;
  return power < 250 || (pcCase.spec.case?.fanCount ?? 0) >= 2;
}

function isCoolerThermallySuitable(cooler: CatalogPart, cpu: CatalogPart) {
  const coreCount = cpu.spec.cpu?.coreCount ?? 0;
  const height = cooler.spec.cooler?.heightMm ?? 0;
  return coreCount < 12 || height >= 120 || String(cooler.spec.cooler?.coolerType).toUpperCase().includes('LIQUID');
}

function qualityScore(parts: CatalogPart[]) {
  return parts.reduce((score, part) => {
    if (part.spec.cpu) return score + (part.spec.cpu.coreCount ?? 0) * 10 + (part.spec.cpu.threadCount ?? 0) * 3 + (part.spec.cpu.boostClockGhz ?? 0) * 10;
    if (part.spec.gpu) return score + Math.min(96, part.spec.gpu.memoryGb ?? 0) * 12 + (part.spec.gpu.powerConsumptionW ?? 0) / 10;
    if (part.spec.ram) return score + (part.spec.ram.capacityGb ?? 0) * 2;
    if (part.spec.storage) return score + (part.spec.storage.capacityGb ?? 0) / 100;
    if (part.spec.psu) return score + (part.spec.psu.ratedWattage ?? 0) / 100;
    return score;
  }, 0);
}

function fingerprint(plan: Plan) {
  return plan.parts.map((part, index) => `${part.category}:${plan.offers[index]?.offerId}`).sort().join('|');
}

function toCandidate(profile: QuoteProfileV2, strategy: QuotePreviewStrategy, plan: Plan, index: number): QuoteCandidate {
  const fees = totalFees(profile);
  const priceCheckedDates = plan.offers.map((offer) => offer.priceCheckedAt).filter(Boolean).map((value) => new Date(value as Date | string).getTime()).filter(Number.isFinite);
  const priceCheckedAt = priceCheckedDates.length ? new Date(Math.min(...priceCheckedDates)).toISOString() : new Date(0).toISOString();
  return {
    id: `CANDIDATE-${index}`,
    strategy,
    status: 'READY',
    parts: plan.parts.map((part, partIndex) => ({
      ...plan.offers[partIndex],
      partId: part.partId,
      category: part.category,
      partName: part.canonicalName,
      manufacturer: part.manufacturer ?? null,
      displaySpecText: displaySpecText(part, plan.offers[partIndex]),
      detailImages: plan.offers[partIndex].detailImages ?? [],
      trustScore: trustScore(part),
      trustLabel: trustLabel(part),
    })),
    subtotalWon: plan.subtotalWon,
    assemblyFeeWon: fees.assemblyFee,
    shippingFeeWon: fees.shippingFee,
    windowsFeeWon: fees.windowsFee,
    totalWon: plan.totalWon,
    priceCheckedAt,
    selectionReasons: [
      ...(isAiDominant(profile) ? ['AI 추론은 CUDA 호환 NVIDIA GPU와 VRAM 여유를 우선했습니다.'] : []),
      trustSummary(plan.parts),
      strategy === 'PERFORMANCE'
        ? 'CPU·GPU 품질 점수와 메모리 여유를 우선했습니다.'
        : strategy === 'VALUE_UPGRADE'
          ? '현재 가격 대비 성능과 향후 업그레이드 여지를 우선했습니다.'
          : '목표 예산과 호환성·성능의 균형을 우선했습니다.',
    ],
    unmetConditions: [],
    compatibility: plan.compatibility,
    performanceEvidence: emptyPerformanceEvidence('exact CPU/GPU 성능 근거는 benchmark DB에 exact combo가 있을 때만 연결합니다.'),
  };
}

function formatCatalogSpec(part: CatalogPart) {
  const spec = part.spec;
  if (spec.cpu) return compactSpec([
    value(spec.cpu.coreCount, '코어'),
    value(spec.cpu.threadCount, '스레드'),
    value(spec.cpu.baseClockGhz, 'GHz 기본 클럭'),
    value(spec.cpu.boostClockGhz, 'GHz 최대 클럭'),
    spec.cpu.socket,
    value(spec.cpu.tdpW, 'W TDP'),
  ]);
  if (spec.gpu) return compactSpec([
    spec.gpu.chipsetName,
    value(spec.gpu.memoryGb, 'GB'),
    spec.gpu.memoryType,
    spec.gpu.interfaceText,
    value(spec.gpu.recommendedPsuW, 'W 권장 파워'),
    value(spec.gpu.lengthMm, 'mm'),
  ]);
  if (spec.mainboard) return compactSpec([
    spec.mainboard.socket,
    spec.mainboard.chipset,
    spec.mainboard.formFactor,
    spec.mainboard.memoryType,
    value(spec.mainboard.maxMemoryGb, 'GB 최대 메모리'),
    value(spec.mainboard.m2SlotCount, '개 M.2'),
    spec.mainboard.wifiBuiltin ? 'Wi-Fi 내장' : undefined,
  ]);
  if (spec.ram) return compactSpec([
    value(spec.ram.capacityGb, 'GB'),
    spec.ram.memoryType,
    value(spec.ram.speedMhz, 'MHz'),
    value(spec.ram.moduleCount, '개 모듈'),
    spec.ram.profileType,
  ]);
  if (spec.storage) return compactSpec([
    value(spec.storage.capacityGb, 'GB'),
    spec.storage.storageType,
    spec.storage.formFactor,
    spec.storage.interfaceText,
    value(spec.storage.seqReadMbps, 'MB/s 읽기'),
    value(spec.storage.seqWriteMbps, 'MB/s 쓰기'),
  ]);
  if (spec.psu) return compactSpec([
    value(spec.psu.ratedWattage, 'W 정격'),
    spec.psu.certification,
    spec.psu.formFactor,
    spec.psu.modularType,
    spec.psu.pcie5Ready ? 'PCIe 5 대응' : undefined,
  ]);
  if (spec.case) return compactSpec([
    spec.case.caseType,
    spec.case.supportedBoardForms?.join('/'),
    value(spec.case.maxGpuLengthMm, 'mm GPU 허용'),
    value(spec.case.maxCoolerHeightMm, 'mm 쿨러 허용'),
    value(spec.case.fanCount, '개 기본 팬'),
  ]);
  if (spec.cooler) return compactSpec([
    spec.cooler.coolerType,
    spec.cooler.supportedSockets?.join('/'),
    value(spec.cooler.heightMm, 'mm 높이'),
    value(spec.cooler.fanSizeMm, 'mm 팬'),
    value(spec.cooler.tdpRatingW, 'W 대응'),
  ]);
  return '상세 스펙 확인 필요';
}

function displaySpecText(part: CatalogPart, offer: CatalogOffer) {
  const structured = formatCatalogSpec(part);
  return structured !== '상세 스펙 확인 필요' ? structured : offer.summarySpecText?.trim() || structured;
}

function compactSpec(values: Array<string | number | null | undefined>) {
  return values.filter((value): value is string | number => value !== null && value !== undefined && String(value).trim() !== '').join(' / ');
}

function value(number: number | null | undefined, suffix: string) {
  return number === null || number === undefined ? undefined : `${number}${suffix}`;
}

function reviewRequired(reasons: string[], relaxations: string[], estimate?: { requiredMinimumWon: number; shortfallWon: number }): QuotePreviewResult {
  return {
    profileVersion: 2,
    rulesetVersion: QUOTE_PREVIEW_RULESET_VERSION,
    status: 'REVIEW_REQUIRED',
    candidates: [],
    review: { reasons, relaxations, ...(estimate ?? {}) },
  };
}
