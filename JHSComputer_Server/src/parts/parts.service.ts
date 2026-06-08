import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Part } from './part.entity';
import { PartCategory } from './part-category.entity';
import { PartStatus } from '../common/enums';

@Injectable()
export class PartsService {
  constructor(
    @InjectRepository(Part)
    private partRepository: Repository<Part>,
    @InjectRepository(PartCategory)
    private categoryRepository: Repository<PartCategory>,
  ) {}

  async getCategories() {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getParts(params: { categoryId?: number; keyword?: string; page: number; limit: number }) {
    const { categoryId, keyword, page, limit } = params;
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
      .leftJoinAndSelect('part.supplierOffers', 'supplierOffers', 'supplierOffers.IS_ACTIVE = :active', { active: 'Y' })
      .leftJoinAndSelect('supplierOffers.product', 'supplierProduct')
      .leftJoinAndSelect('supplierOffers.prices', 'supplierOfferPrices')
      .where('part.status = :status', { status: PartStatus.ACTIVE });

    if (categoryId) {
      query.andWhere('part.categoryId = :categoryId', { categoryId: categoryId.toString() });
    }

    if (keyword) {
      query.andWhere('part.canonicalName LIKE :keyword', { keyword: `%${keyword}%` });
    }

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
    const part = await this.partRepository.findOne({
      where: { id: id.toString(), status: PartStatus.ACTIVE },
      relations: [
        'category',
        'cpuSpec',
        'gpuSpec',
        'mainboardSpec',
        'ramSpec',
        'storageSpec',
        'psuSpec',
        'caseSpec',
        'coolerSpec',
        'supplierOffers',
        'supplierOffers.product',
        'supplierOffers.prices',
      ],
    });

    if (!part) {
      throw new NotFoundException('Part not found');
    }

    return this.toPartDto(part);
  }

  private toPartDto(part: Part) {
    const offers = (part.supplierOffers ?? []).map((offer) => {
      const latestPrice = [...(offer.prices ?? [])].sort(
        (a, b) => new Date(b.capturedDt).getTime() - new Date(a.capturedDt).getTime(),
      )[0];
      return {
        id: offer.id,
        externalOfferId: offer.externalOfferId,
        offerName: offer.offerName,
        supplierProduct: offer.product
          ? {
              id: offer.product.id,
              externalProductId: offer.product.externalProductId,
              productName: offer.product.productName,
              productUrl: offer.product.productUrl,
              imageUrl: offer.product.imageUrl,
              summarySpecText: offer.product.summarySpecText,
              rawSpecJson: offer.product.rawSpecJson,
              reviewCount: offer.product.reviewCount,
              rating: offer.product.rating,
              matchStatus: offer.product.matchStatus,
              specParseStatus: offer.product.specParseStatus,
            }
          : null,
        latestPrice: latestPrice
          ? {
              publicPrice: latestPrice.publicPrice,
              benefitPrice: latestPrice.benefitPrice,
              stockStatus: latestPrice.stockStatus,
              capturedDt: latestPrice.capturedDt,
            }
          : null,
      };
    });

    return {
      ...part,
      supplierOffers: offers,
      primaryOffer: offers[0] ?? null,
    };
  }
}
