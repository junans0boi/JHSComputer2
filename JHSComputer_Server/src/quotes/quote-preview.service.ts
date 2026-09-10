import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Part } from '../parts/part.entity';
import { SupplierOffer } from '../parts/supplier-offer.entity';
import { SupplierStatus } from '../common/enums';
import { BenchmarksService } from '../benchmarks/benchmarks.service';
import { normalizeQuoteProfile, validateQuoteProfile } from './quote-profile';
import {
  emptyPerformanceEvidence,
  generateQuotePreview,
  summarizePerformanceEvidence,
  type CatalogPart,
  type CatalogSpec,
  type PerformanceEvidenceResult,
} from './quote-preview.engine';

const REQUIRED_QUOTE_CATEGORIES = ['CPU', 'MAINBOARD', 'RAM', 'GPU', 'SSD', 'PSU', 'CASE', 'CPU_COOLER'];

@Injectable()
export class QuotePreviewService {
  private readonly catalogCacheTtlMs = 30_000;
  private catalogCache?: { expiresAt: number; catalog: CatalogPart[] };
  private catalogLoad?: Promise<CatalogPart[]>;

  constructor(
    @InjectRepository(Part)
    private readonly partRepository: Repository<Part>,
    private readonly config: ConfigService,
    private readonly benchmarksService: BenchmarksService,
  ) {}

  async preview(rawProfile: unknown) {
    const profile = this.normalizeProfile(rawProfile);
    const catalog = await this.loadCatalog();
    const preview = generateQuotePreview(profile, catalog);
    return this.attachPerformanceEvidence(preview, profile);
  }

  private async attachPerformanceEvidence(preview: ReturnType<typeof generateQuotePreview>, profile: ReturnType<typeof normalizeQuoteProfile>) {
    const gamingWorkload = profile.workloadProfile.workloads
      .filter((workload) => workload.type === 'GAMING')
      .sort((left, right) => right.weight - left.weight)[0];
    const games = gamingWorkload && Array.isArray(gamingWorkload.details.games)
      ? [...new Set(gamingWorkload.details.games.filter((game): game is string => typeof game === 'string' && Boolean(game.trim())).map((game) => game.trim()))]
      : [];
    if (!games.length) {
      return {
        ...preview,
        candidates: preview.candidates.map((candidate) => ({
          ...candidate,
          performanceEvidence: emptyPerformanceEvidence('선택한 게임이 없어 게임별 성능 근거를 조회하지 않았습니다.'),
        })),
      };
    }

    const resolution = typeof gamingWorkload?.details.resolution === 'string' ? gamingWorkload.details.resolution : undefined;
    const candidates = await Promise.all(preview.candidates.map(async (candidate) => {
      try {
        const result = await this.benchmarksService.getQuotePerformance({
          parts: candidate.parts.map((part) => ({ category: part.category, name: part.partName })),
          games,
          resolution,
          limit: 200,
        });
        const evidenceResults = (result.items ?? []).map(toPerformanceEvidenceResult).filter((item): item is PerformanceEvidenceResult => item !== null);
        return {
          ...candidate,
          performanceEvidence: evidenceResults.length
            ? summarizePerformanceEvidence(evidenceResults)
            : emptyPerformanceEvidence(result.reason ?? '선택한 CPU/GPU 조합의 exact benchmark 결과가 없습니다.'),
        };
      } catch {
        return {
          ...candidate,
          performanceEvidence: emptyPerformanceEvidence('성능 근거 저장소를 조회할 수 없어 실측값을 표시하지 않았습니다.'),
        };
      }
    }));
    return { ...preview, candidates };
  }

  private normalizeProfile(rawProfile: unknown) {
    try {
      const profile = normalizeQuoteProfile(rawProfile);
      validateQuoteProfile(profile);
      return profile;
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : '견적 프로필이 올바르지 않습니다.');
    }
  }

  private async loadCatalog(): Promise<CatalogPart[]> {
    if (this.catalogCache && this.catalogCache.expiresAt > Date.now()) return this.catalogCache.catalog;
    if (this.catalogLoad) return this.catalogLoad;

    this.catalogLoad = this.queryCatalog();
    try {
      const catalog = await this.catalogLoad;
      this.catalogCache = { expiresAt: Date.now() + this.catalogCacheTtlMs, catalog };
      return catalog;
    } finally {
      this.catalogLoad = undefined;
    }
  }

  private async queryCatalog(): Promise<CatalogPart[]> {
    const query = this.partRepository.createQueryBuilder('part')
      .select([
        'part.id',
        'part.canonicalName',
        'part.manufacturer',
        'part.popularityScore',
        'part.specStatus',
        'part.isAdminApproved',
        'category.id',
        'category.code',
        'cpuSpec.id', 'cpuSpec.socket', 'cpuSpec.tdpW', 'cpuSpec.pbpW', 'cpuSpec.coreCount', 'cpuSpec.threadCount', 'cpuSpec.baseClockGhz', 'cpuSpec.boostClockGhz',
        'gpuSpec.id', 'gpuSpec.chipsetMaker', 'gpuSpec.chipsetName', 'gpuSpec.memoryType', 'gpuSpec.memoryGb', 'gpuSpec.interfaceText', 'gpuSpec.recommendedPsuW', 'gpuSpec.powerConsumptionW', 'gpuSpec.lengthMm',
        'mainboardSpec.id', 'mainboardSpec.socket', 'mainboardSpec.memoryType', 'mainboardSpec.formFactor', 'mainboardSpec.chipset', 'mainboardSpec.memorySlotCount', 'mainboardSpec.maxMemoryGb', 'mainboardSpec.m2SlotCount', 'mainboardSpec.sataPortCount', 'mainboardSpec.pcieX16SlotCount', 'mainboardSpec.wifiBuiltin',
        'ramSpec.id', 'ramSpec.memoryType', 'ramSpec.capacityGb', 'ramSpec.moduleCount', 'ramSpec.speedMhz', 'ramSpec.profileType',
        'storageSpec.id', 'storageSpec.storageType', 'storageSpec.formFactor', 'storageSpec.interfaceText', 'storageSpec.capacityGb', 'storageSpec.seqReadMbps', 'storageSpec.seqWriteMbps',
        'psuSpec.id', 'psuSpec.formFactor', 'psuSpec.ratedWattage', 'psuSpec.certification', 'psuSpec.modularType', 'psuSpec.pcie5Ready',
        'caseSpec.id', 'caseSpec.caseType', 'caseSpec.supportedBoardFormsJson', 'caseSpec.maxGpuLengthMm', 'caseSpec.maxCoolerHeightMm', 'caseSpec.fanCount',
        'coolerSpec.id', 'coolerSpec.supportedSocketsJson', 'coolerSpec.heightMm', 'coolerSpec.coolerType', 'coolerSpec.fanSizeMm', 'coolerSpec.tdpRatingW',
        'supplierOffers.id', 'supplierOffers.offerName', 'supplierOffers.isActive', 'supplierOffers.isDefault',
        'supplierOffers.currentPublicPrice', 'supplierOffers.currentBenefitPrice', 'supplierOffers.currentStockStatus', 'supplierOffers.currentPriceDt',
        'supplierProduct.id', 'supplierProduct.externalProductId', 'supplierProduct.productName', 'supplierProduct.productUrl', 'supplierProduct.imageUrl', 'supplierProduct.summarySpecText', 'supplierProduct.rawSpecJson', 'supplierProduct.reviewCount', 'supplierProduct.rating', 'supplierProduct.isActive',
        'supplier.id', 'supplier.supplierCode', 'supplier.supplierName', 'supplier.status',
      ])
      .leftJoinAndSelect('part.category', 'category', 'category.IS_ACTIVE = :categoryActive', { categoryActive: 'Y' })
      .leftJoinAndSelect('part.cpuSpec', 'cpuSpec')
      .leftJoinAndSelect('part.gpuSpec', 'gpuSpec')
      .leftJoinAndSelect('part.mainboardSpec', 'mainboardSpec')
      .leftJoinAndSelect('part.ramSpec', 'ramSpec')
      .leftJoinAndSelect('part.storageSpec', 'storageSpec')
      .leftJoinAndSelect('part.psuSpec', 'psuSpec')
      .leftJoinAndSelect('part.caseSpec', 'caseSpec')
      .leftJoinAndSelect('part.coolerSpec', 'coolerSpec')
      .leftJoinAndSelect(
        'part.supplierOffers',
        'supplierOffers',
        `supplierOffers.IS_ACTIVE = :active
         AND supplierOffers.CURRENT_PRICE_DT IS NOT NULL
         AND supplierOffers.CURRENT_STOCK_STATUS IN (:...stockStatuses)`,
        { active: 'Y', stockStatuses: ['AVAILABLE', 'IN_STOCK', 'LOW_STOCK'] },
      )
      .leftJoinAndSelect('supplierOffers.product', 'supplierProduct', 'supplierProduct.IS_ACTIVE = :productActive', { productActive: 'Y' })
      .leftJoinAndSelect('supplierProduct.supplier', 'supplier', 'supplier.STATUS = :supplierStatus', { supplierStatus: SupplierStatus.ACTIVE })
      .where('part.STATUS = :partStatus', { partStatus: 'ACTIVE' })
      .andWhere('category.CATEGORY_CODE IN (:...categories)', { categories: REQUIRED_QUOTE_CATEGORIES })
      .andWhere('category.PART_CATEGORY_ID IS NOT NULL')
      .andWhere('supplierOffers.SUPPLIER_OFFER_ID IS NOT NULL')
      .andWhere('supplierProduct.SUPPLIER_PRODUCT_ID IS NOT NULL')
      .andWhere('supplier.SUPPLIER_ID IS NOT NULL');

    if (this.publicApprovalRequired()) {
      query.andWhere('part.IS_ADMIN_APPROVED = :approved', { approved: 'Y' });
    }

    const parts = await query.getMany();

    return parts.flatMap((part) => this.toCatalogPart(part));
  }

  private toCatalogPart(part: Part): CatalogPart[] {
    const category = part.category?.code;
    if (!category) return [];
    const offers = (part.supplierOffers ?? [])
      .filter((offer) => isSellableOffer(offer))
      .filter((offer) => Boolean(
        offer.product?.isActive !== false
        && offer.product?.supplier?.status === SupplierStatus.ACTIVE
        && offer.product?.externalProductId,
      ))
      .map((offer) => {
        const priceWon = offer.currentBenefitPrice ?? offer.currentPublicPrice ?? 0;
        return {
          offerId: String(offer.id),
          externalProductId: offer.product!.externalProductId,
          productName: offer.product!.productName,
          productUrl: offer.product!.productUrl,
          imageUrl: offer.product!.imageUrl,
          summarySpecText: offer.product!.summarySpecText,
          detailImages: extractDetailImages(offer.product!.rawSpecJson),
          offerName: offer.offerName,
          supplierCode: offer.product?.supplier?.supplierCode,
          priceWon,
          publicPriceWon: offer.currentPublicPrice,
          stockStatus: String(offer.currentStockStatus),
          priceCheckedAt: offer.currentPriceDt,
          isDefault: offer.isDefault,
          reviewCount: offer.product?.reviewCount ?? null,
          rating: toNumber(offer.product?.rating),
        };
      })
      .filter((offer) => offer.priceWon > 0);

    if (!offers.length) return [];
    return [{
      partId: String(part.id),
      category,
      canonicalName: part.canonicalName,
      manufacturer: part.manufacturer,
      popularityScore: toNumber(part.popularityScore),
      specStatus: part.specStatus,
      isAdminApproved: part.isAdminApproved,
      spec: toCatalogSpec(part, category),
      offers,
    }];
  }

  private publicApprovalRequired() {
    const configured = this.config.get<string>('PUBLIC_PART_APPROVAL_REQUIRED');
    if (configured === 'false') return false;
    return configured === 'true' || this.config.get<string>('NODE_ENV') === 'production';
  }
}

function toPerformanceEvidenceResult(item: Record<string, unknown>): PerformanceEvidenceResult | null {
  const evidenceType = item.evidenceType;
  if (!['MEASURED', 'SOURCE_BENCHMARK', 'SOURCE_RECOMMENDATION', 'SOURCE_REPORTED', 'DERIVED'].includes(String(evidenceType))) return null;
  const confidence = item.confidence;
  return {
    game: String(item.game ?? item.gameName ?? ''),
    resolution: String(item.resolution ?? ''),
    fpsMin: nullableNumber(item.fpsMin),
    fpsMax: nullableNumber(item.fpsMax),
    sampleCount: Math.max(0, Math.floor(Number(item.sampleCount ?? 0) || 0)),
    evidenceType: evidenceType as PerformanceEvidenceResult['evidenceType'],
    confidence: ['HIGH', 'MEDIUM', 'LOW'].includes(String(confidence)) ? confidence as PerformanceEvidenceResult['confidence'] : 'LOW',
    evidenceNote: String(item.evidenceNote ?? '벤치마크 근거의 상세 설명이 없습니다.'),
  };
}

function nullableNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function isSellableOffer(offer: SupplierOffer) {
  return offer.isActive
    && Boolean(offer.currentPriceDt)
    && ['AVAILABLE', 'IN_STOCK', 'LOW_STOCK'].includes(String(offer.currentStockStatus));
}

function toCatalogSpec(part: Part, category: string): CatalogSpec {
  switch (category) {
    case 'CPU':
      return { cpu: part.cpuSpec ? {
        socket: part.cpuSpec.socket,
        tdpW: part.cpuSpec.tdpW ?? part.cpuSpec.pbpW,
        coreCount: part.cpuSpec.coreCount,
        threadCount: part.cpuSpec.threadCount,
        baseClockGhz: toNumber(part.cpuSpec.baseClockGhz),
        boostClockGhz: toNumber(part.cpuSpec.boostClockGhz),
      } : undefined };
    case 'GPU':
      return { gpu: part.gpuSpec ? {
        chipsetMaker: part.gpuSpec.chipsetMaker,
        chipsetName: part.gpuSpec.chipsetName,
        memoryType: part.gpuSpec.memoryType,
        memoryGb: part.gpuSpec.memoryGb,
        interfaceText: part.gpuSpec.interfaceText,
        recommendedPsuW: part.gpuSpec.recommendedPsuW,
        powerConsumptionW: part.gpuSpec.powerConsumptionW,
        lengthMm: toNumber(part.gpuSpec.lengthMm),
      } : undefined };
    case 'MAINBOARD':
      return { mainboard: part.mainboardSpec ? {
        socket: part.mainboardSpec.socket,
        memoryType: part.mainboardSpec.memoryType,
        formFactor: part.mainboardSpec.formFactor,
        chipset: part.mainboardSpec.chipset,
        memorySlotCount: part.mainboardSpec.memorySlotCount,
        maxMemoryGb: part.mainboardSpec.maxMemoryGb,
        m2SlotCount: part.mainboardSpec.m2SlotCount,
        sataPortCount: part.mainboardSpec.sataPortCount,
        pcieX16SlotCount: part.mainboardSpec.pcieX16SlotCount,
        wifiBuiltin: part.mainboardSpec.wifiBuiltin,
      } : undefined };
    case 'RAM':
      return { ram: part.ramSpec ? { memoryType: part.ramSpec.memoryType, capacityGb: part.ramSpec.capacityGb, moduleCount: part.ramSpec.moduleCount, speedMhz: part.ramSpec.speedMhz, profileType: part.ramSpec.profileType } : undefined };
    case 'SSD':
      return { storage: part.storageSpec ? { storageType: part.storageSpec.storageType, formFactor: part.storageSpec.formFactor, interfaceText: part.storageSpec.interfaceText, capacityGb: part.storageSpec.capacityGb, seqReadMbps: part.storageSpec.seqReadMbps, seqWriteMbps: part.storageSpec.seqWriteMbps } : undefined };
    case 'PSU':
      return { psu: part.psuSpec ? { formFactor: part.psuSpec.formFactor, ratedWattage: part.psuSpec.ratedWattage, certification: part.psuSpec.certification, modularType: part.psuSpec.modularType, pcie5Ready: part.psuSpec.pcie5Ready } : undefined };
    case 'CASE':
      return { case: part.caseSpec ? {
        caseType: part.caseSpec.caseType,
        supportedBoardForms: toStringArray(part.caseSpec.supportedBoardFormsJson),
        maxGpuLengthMm: toNumber(part.caseSpec.maxGpuLengthMm),
        maxCoolerHeightMm: toNumber(part.caseSpec.maxCoolerHeightMm),
        fanCount: part.caseSpec.fanCount,
      } : undefined };
    case 'CPU_COOLER':
      return { cooler: part.coolerSpec ? {
        supportedSockets: toStringArray(part.coolerSpec.supportedSocketsJson),
        heightMm: toNumber(part.coolerSpec.heightMm),
        coolerType: part.coolerSpec.coolerType,
        fanSizeMm: part.coolerSpec.fanSizeMm,
        tdpRatingW: part.coolerSpec.tdpRatingW,
      } : undefined };
    default:
      return {};
  }
}

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractDetailImages(raw: Record<string, unknown> | null | undefined) {
  const direct = raw?.detailImages;
  if (Array.isArray(direct)) return direct.filter((value): value is string => typeof value === 'string').slice(0, 20);
  const sample = raw?.detailSample;
  if (sample && typeof sample === 'object') {
    const parsed = (sample as Record<string, unknown>).parsed;
    if (parsed && typeof parsed === 'object') {
      const images = (parsed as Record<string, unknown>).detailImages;
      if (Array.isArray(images)) return images.filter((value): value is string => typeof value === 'string').slice(0, 20);
    }
  }
  return [];
}

function toStringArray(value: unknown): string[] | null {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value !== 'string') return null;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : null;
  } catch {
    return null;
  }
}
