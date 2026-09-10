import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Part } from './part.entity';
import { PartCategory } from './part-category.entity';
import { PartStatus, SupplierStatus } from '../common/enums';

@Injectable()
export class PartsService {
  constructor(
    @InjectRepository(Part)
    private partRepository: Repository<Part>,
    @InjectRepository(PartCategory)
    private categoryRepository: Repository<PartCategory>,
    private readonly config: ConfigService,
  ) {}

  async getCategories() {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getParts(params: { categoryId?: number; keyword?: string; page: number; limit: number }) {
    const { categoryId, keyword } = params;
    const { page, limit } = normalizePagination(params.page, params.limit);
    const query = this.partRepository.createQueryBuilder('part')
      .leftJoinAndSelect('part.category', 'category')
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
         AND COALESCE(supplierOffers.CURRENT_BENEFIT_PRICE, supplierOffers.CURRENT_PUBLIC_PRICE, 0) > 0
         AND supplierOffers.CURRENT_STOCK_STATUS IN (:...stockStatuses)`,
        { active: 'Y', stockStatuses: ['AVAILABLE', 'IN_STOCK', 'LOW_STOCK'] },
      )
      .leftJoinAndSelect('supplierOffers.product', 'supplierProduct', 'supplierProduct.IS_ACTIVE = :productActive', { productActive: 'Y' })
      .leftJoinAndSelect('supplierProduct.supplier', 'supplier', 'supplier.STATUS = :supplierStatus', { supplierStatus: SupplierStatus.ACTIVE })
      .where('part.status = :status', { status: PartStatus.ACTIVE });

    if (this.publicApprovalRequired()) {
      query.andWhere('part.IS_ADMIN_APPROVED = :approved', { approved: 'Y' });
    }

    if (categoryId) {
      query.andWhere('part.categoryId = :categoryId', { categoryId: categoryId.toString() });
    }

    if (keyword) {
      query.andWhere('part.canonicalName LIKE :keyword', { keyword: `%${escapeLike(keyword)}%` });
    }

    query
      .andWhere('supplierOffers.SUPPLIER_OFFER_ID IS NOT NULL')
      .andWhere('supplierProduct.SUPPLIER_PRODUCT_ID IS NOT NULL')
      .andWhere('supplier.SUPPLIER_ID IS NOT NULL');

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('part.popularityScore', 'DESC')
      .getManyAndCount();

    return {
      items: items.map((part) => this.toPartDto(part)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPartDetail(id: number) {
    const query = this.partRepository.createQueryBuilder('part')
      .leftJoinAndSelect('part.category', 'category')
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
         AND COALESCE(supplierOffers.CURRENT_BENEFIT_PRICE, supplierOffers.CURRENT_PUBLIC_PRICE, 0) > 0
         AND supplierOffers.CURRENT_STOCK_STATUS IN (:...stockStatuses)`,
        { active: 'Y', stockStatuses: ['AVAILABLE', 'IN_STOCK', 'LOW_STOCK'] },
      )
      .leftJoinAndSelect('supplierOffers.product', 'supplierProduct', 'supplierProduct.IS_ACTIVE = :productActive', { productActive: 'Y' })
      .leftJoinAndSelect('supplierProduct.supplier', 'supplier', 'supplier.STATUS = :supplierStatus', { supplierStatus: SupplierStatus.ACTIVE })
      .where('part.PART_ID = :id', { id: id.toString() })
      .andWhere('part.STATUS = :status', { status: PartStatus.ACTIVE })
      .andWhere('supplierOffers.SUPPLIER_OFFER_ID IS NOT NULL')
      .andWhere('supplierProduct.SUPPLIER_PRODUCT_ID IS NOT NULL')
      .andWhere('supplier.SUPPLIER_ID IS NOT NULL');

    if (this.publicApprovalRequired()) {
      query.andWhere('part.IS_ADMIN_APPROVED = :approved', { approved: 'Y' });
    }

    const part = await query.getOne();

    if (!part) {
      throw new NotFoundException('Part not found');
    }

    return this.toPartDto(part);
  }

  private toPartDto(part: Part) {
    const offers = (part.supplierOffers ?? [])
      .filter((offer) => offer.isActive && offer.currentPriceDt && (offer.currentBenefitPrice ?? offer.currentPublicPrice ?? 0) > 0 && ['AVAILABLE', 'IN_STOCK', 'LOW_STOCK'].includes(String(offer.currentStockStatus)))
      .filter((offer) => offer.product?.isActive === true && offer.product.supplier?.status === SupplierStatus.ACTIVE)
      .map((offer) => {
      const latestPrice = offer.currentPriceDt
        ? {
            publicPrice: offer.currentPublicPrice,
            benefitPrice: offer.currentBenefitPrice,
            stockStatus: offer.currentStockStatus,
            capturedDt: offer.currentPriceDt,
          }
        : null;
      return {
        id: offer.id,
        offerName: offer.offerName,
        isDefault: offer.isDefault,
        supplierProduct: offer.product
          ? {
              id: offer.product.id,
              externalProductId: offer.product.externalProductId,
              productName: offer.product.productName,
              productUrl: offer.product.productUrl,
              imageUrl: offer.product.imageUrl,
              summarySpecText: offer.product.summarySpecText,
              detailImages: extractDetailImages(offer.product.rawSpecJson),
              badges: extractBadges(offer.product.rawSpecJson),
              reviewCount: offer.product.reviewCount,
              rating: offer.product.rating,
            }
          : null,
        latestPrice,
      };
      });

    const {
      isAdminApproved: _isAdminApproved,
      adminPriority: _adminPriority,
      specVerifiedDt: _specVerifiedDt,
      supplierOffers: _supplierOffers,
      ...publicPart
    } = part;

    return {
      ...publicPart,
      supplierOffers: offers,
      primaryOffer: [...offers].sort((a, b) => {
        if (Number(b.isDefault) !== Number(a.isDefault)) return Number(b.isDefault) - Number(a.isDefault);
        const aPrice = a.latestPrice?.benefitPrice ?? a.latestPrice?.publicPrice ?? Number.MAX_SAFE_INTEGER;
        const bPrice = b.latestPrice?.benefitPrice ?? b.latestPrice?.publicPrice ?? Number.MAX_SAFE_INTEGER;
        return aPrice - bPrice;
      })[0] ?? null,
    };
  }

  private publicApprovalRequired() {
    const configured = this.config.get<string>('PUBLIC_PART_APPROVAL_REQUIRED');
    if (configured === 'false') return false;
    return configured === 'true' || this.config.get<string>('NODE_ENV') === 'production';
  }
}

function normalizePagination(page: number, limit: number) {
  return {
    page: Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1,
    limit: Number.isFinite(limit) ? Math.min(100, Math.max(1, Math.floor(limit))) : 20,
  };
}

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, '\\$&');
}

function extractDetailImages(raw: Record<string, unknown> | null) {
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

function extractBadges(raw: Record<string, unknown> | null) {
  const badges = raw?.badges;
  return Array.isArray(badges) ? badges.filter((value): value is string => typeof value === 'string').slice(0, 20) : [];
}
