import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { PartsService } from '../src/parts/parts.service';

function makeQueryBuilder() {
  const query = {
    conditions: [] as string[],
    joins: [] as string[],
    result: [[], 0] as [unknown[], number],
    leftJoinAndSelect: (_relation: string, _alias: string, condition?: string) => {
      if (condition) query.joins.push(condition);
      return query;
    },
    where: () => query,
    andWhere: (condition: string) => {
      query.conditions.push(condition);
      return query;
    },
    skip: () => query,
    take: () => query,
    orderBy: () => query,
    getManyAndCount: async () => query.result,
    getOne: async () => query.result[0][0] ?? null,
  };
  return query;
}

function makeService(configured: string | undefined, nodeEnv: string) {
  const query = makeQueryBuilder();
  const repository = { createQueryBuilder: () => query };
  const config = { get: (key: string) => key === 'PUBLIC_PART_APPROVAL_REQUIRED' ? configured : key === 'NODE_ENV' ? nodeEnv : undefined };
  return { service: new PartsService(repository as never, {} as never, config as never), query };
}

test('explicit false exposes active sellable catalog in production', async () => {
  const { service, query } = makeService('false', 'production');
  query.result = [[{
    id: '1',
    supplierOffers: [{
      isActive: true,
      currentBenefitPrice: 100000,
      currentPriceDt: new Date(),
      currentStockStatus: 'AVAILABLE',
      product: { isActive: true, supplier: { status: 'ACTIVE' } },
    }],
  }], 1];

  const result = await service.getParts({ page: 1, limit: 20 });

  assert.equal(query.conditions.some((condition) => condition.includes('IS_ADMIN_APPROVED')), false);
  assert.equal(query.conditions.some((condition) => condition.includes('supplierProduct.SUPPLIER_PRODUCT_ID IS NOT NULL')), true);
  assert.equal(query.conditions.some((condition) => condition.includes('supplier.SUPPLIER_ID IS NOT NULL')), true);
  assert.equal(query.joins.some((condition) => condition.includes('COALESCE(supplierOffers.CURRENT_BENEFIT_PRICE')), true);
  assert.equal(result.total, 1);
  assert.equal(result.items.length, 1);
});

test('parts DTO excludes inactive offers and missing products', async () => {
  const { service, query } = makeService('false', 'production');
  query.result = [[{
    id: '1',
    supplierOffers: [
      { isActive: true, currentBenefitPrice: 100000, currentPriceDt: new Date(), currentStockStatus: 'AVAILABLE', product: { isActive: true, supplier: { status: 'ACTIVE' } } },
      { isActive: false, currentPriceDt: new Date(), currentStockStatus: 'AVAILABLE', product: { isActive: true } },
      { isActive: true, currentPriceDt: new Date(), currentStockStatus: 'AVAILABLE', product: null },
      { isActive: true, currentPriceDt: new Date(), currentStockStatus: 'AVAILABLE', product: { isActive: false } },
      { isActive: true, currentPriceDt: new Date(), currentStockStatus: 'AVAILABLE', currentPublicPrice: 0, product: { isActive: true } },
    ],
  }], 1];

  const result = await service.getParts({ page: 1, limit: 20 });

  assert.equal(result.items[0].supplierOffers.length, 1);
});

test('part detail applies the same public sellability filters', async () => {
  const { service, query } = makeService('false', 'production');
  query.result = [[{ id: '1', supplierOffers: [] }], 1];

  await service.getPartDetail(1);

  assert.equal(query.conditions.some((condition) => condition.includes('supplier.SUPPLIER_ID IS NOT NULL')), true);
  assert.equal(query.joins.some((condition) => condition.includes('COALESCE(supplierOffers.CURRENT_BENEFIT_PRICE')), true);
});

test('production keeps approval gate when override is absent', async () => {
  const { service, query } = makeService(undefined, 'production');

  await service.getParts({ page: 1, limit: 20 });

  assert.equal(query.conditions.some((condition) => condition.includes('IS_ADMIN_APPROVED')), true);
});
