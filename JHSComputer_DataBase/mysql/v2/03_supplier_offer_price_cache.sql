-- ============================================================
-- Supplier offer current-price cache and relationship repair
-- 작성일: 2026-09-03
--
-- 이 migration은 기존 DB에 1회 적용한다.
-- 가격 이력(supplier_offer_prices)은 삭제하지 않는다.
-- ============================================================

-- 1. 정리 과정에서 삭제된 supplier_product를 가리키는 offer를
--    동일한 컴퓨존 외부 상품번호의 현재 행으로 재연결한다.
UPDATE supplier_offers so
JOIN supplier_products sp
  ON sp.EXTERNAL_PRODUCT_ID = so.EXTERNAL_OFFER_ID
 AND sp.SUPPLIER_ID = (
   SELECT SUPPLIER_ID FROM suppliers WHERE SUPPLIER_CODE = 'compuzone' LIMIT 1
 )
LEFT JOIN supplier_products old_sp
  ON old_sp.SUPPLIER_PRODUCT_ID = so.SUPPLIER_PRODUCT_ID
SET so.SUPPLIER_PRODUCT_ID = sp.SUPPLIER_PRODUCT_ID
WHERE old_sp.SUPPLIER_PRODUCT_ID IS NULL;

-- 2. offer RAW_JSON에 남아 있는 가격을 가격 이력으로 복구한다.
INSERT INTO supplier_offer_prices (
  SUPPLIER_OFFER_ID,
  PUBLIC_PRICE,
  BENEFIT_PRICE,
  DISCOUNT_AMOUNT,
  STOCK_STATUS,
  SOURCE_TYPE,
  CAPTURED_DT,
  RAW_JSON
)
SELECT
  so.SUPPLIER_OFFER_ID,
  COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(so.RAW_JSON, '$.pricing.listPrice')) AS UNSIGNED),
           CAST(JSON_UNQUOTE(JSON_EXTRACT(so.RAW_JSON, '$.pricing.discountPrice')) AS UNSIGNED), 0),
  CAST(JSON_UNQUOTE(JSON_EXTRACT(so.RAW_JSON, '$.pricing.discountPrice')) AS UNSIGNED),
  GREATEST(
    COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(so.RAW_JSON, '$.pricing.listPrice')) AS UNSIGNED), 0)
      - COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(so.RAW_JSON, '$.pricing.discountPrice')) AS UNSIGNED), 0),
    0
  ),
  CASE
    WHEN JSON_UNQUOTE(JSON_EXTRACT(so.RAW_JSON, '$.flags.isBuyable')) IN ('true', '1')
      THEN 'AVAILABLE'
    ELSE 'UNKNOWN'
  END,
  'CRAWL',
  so.CREATED_DT,
  so.RAW_JSON
FROM supplier_offers so
JOIN supplier_products sp ON sp.SUPPLIER_PRODUCT_ID = so.SUPPLIER_PRODUCT_ID
LEFT JOIN supplier_offer_prices existing
  ON existing.SUPPLIER_OFFER_ID = so.SUPPLIER_OFFER_ID
WHERE existing.OFFER_PRICE_ID IS NULL
  AND JSON_UNQUOTE(JSON_EXTRACT(so.RAW_JSON, '$.pricing.discountPrice')) REGEXP '^[0-9]+$';

-- 3. 현재 상품-부품 연결 상태를 실제 데이터와 일치시킨다.
UPDATE supplier_products sp
JOIN (
  SELECT DISTINCT SUPPLIER_PRODUCT_ID
  FROM supplier_offers
  WHERE PART_ID IS NOT NULL
) matched ON matched.SUPPLIER_PRODUCT_ID = sp.SUPPLIER_PRODUCT_ID
SET sp.MATCH_STATUS = 'AUTO_MATCHED',
    sp.MATCH_CONFIDENCE = 100;

-- 4. hot read용 현재 가격 캐시를 추가한다.
ALTER TABLE supplier_offers
  ADD COLUMN CURRENT_PUBLIC_PRICE INT NULL AFTER IS_ACTIVE,
  ADD COLUMN CURRENT_BENEFIT_PRICE INT NULL AFTER CURRENT_PUBLIC_PRICE,
  ADD COLUMN CURRENT_STOCK_STATUS VARCHAR(30) NOT NULL DEFAULT 'UNKNOWN' AFTER CURRENT_BENEFIT_PRICE,
  ADD COLUMN CURRENT_PRICE_DT DATETIME NULL AFTER CURRENT_STOCK_STATUS;

-- 5. 최신 가격 이력으로 캐시를 backfill한다.
UPDATE supplier_offers so
JOIN (
  SELECT ranked.SUPPLIER_OFFER_ID,
         ranked.PUBLIC_PRICE,
         ranked.BENEFIT_PRICE,
         ranked.STOCK_STATUS,
         ranked.CAPTURED_DT
  FROM (
    SELECT p.*,
           ROW_NUMBER() OVER (
             PARTITION BY p.SUPPLIER_OFFER_ID
             ORDER BY p.CAPTURED_DT DESC, p.OFFER_PRICE_ID DESC
           ) AS rn
    FROM supplier_offer_prices p
  ) ranked
  WHERE ranked.rn = 1
) latest ON latest.SUPPLIER_OFFER_ID = so.SUPPLIER_OFFER_ID
SET so.CURRENT_PUBLIC_PRICE = latest.PUBLIC_PRICE,
    so.CURRENT_BENEFIT_PRICE = latest.BENEFIT_PRICE,
    so.CURRENT_STOCK_STATUS = latest.STOCK_STATUS,
    so.CURRENT_PRICE_DT = latest.CAPTURED_DT;

-- 6. 조회 및 idempotent upsert에 필요한 인덱스와 관계를 복구한다.
ALTER TABLE supplier_products
  ADD UNIQUE KEY uq_supplier_products_external (SUPPLIER_ID, EXTERNAL_PRODUCT_ID),
  ADD KEY idx_supplier_products_target (CRAWL_TARGET_ID),
  ADD KEY idx_supplier_products_match_status (MATCH_STATUS),
  ADD CONSTRAINT fk_supplier_products_supplier
    FOREIGN KEY (SUPPLIER_ID) REFERENCES suppliers (SUPPLIER_ID)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT fk_supplier_products_crawl_target
    FOREIGN KEY (CRAWL_TARGET_ID) REFERENCES supplier_crawl_targets (CRAWL_TARGET_ID)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE supplier_offers
  ADD UNIQUE KEY uq_supplier_offers_external (SUPPLIER_PRODUCT_ID, EXTERNAL_OFFER_ID),
  ADD KEY idx_supplier_offers_product (SUPPLIER_PRODUCT_ID),
  ADD KEY idx_supplier_offers_part_active (PART_ID, IS_ACTIVE, IS_DEFAULT),
  ADD KEY idx_supplier_offers_kind (OFFER_KIND),
  ADD CONSTRAINT fk_supplier_offers_product
    FOREIGN KEY (SUPPLIER_PRODUCT_ID) REFERENCES supplier_products (SUPPLIER_PRODUCT_ID)
    ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_supplier_offers_part
    FOREIGN KEY (PART_ID) REFERENCES parts (PART_ID)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE supplier_offer_prices
  ADD KEY idx_supplier_offer_prices_offer_captured (SUPPLIER_OFFER_ID, CAPTURED_DT),
  ADD KEY idx_supplier_offer_prices_stock (STOCK_STATUS),
  ADD CONSTRAINT fk_supplier_offer_prices_offer
    FOREIGN KEY (SUPPLIER_OFFER_ID) REFERENCES supplier_offers (SUPPLIER_OFFER_ID)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- 적용 후 확인
SELECT 'orphan_offers' AS check_name, COUNT(*) AS count
FROM supplier_offers so
LEFT JOIN supplier_products sp ON sp.SUPPLIER_PRODUCT_ID = so.SUPPLIER_PRODUCT_ID
WHERE sp.SUPPLIER_PRODUCT_ID IS NULL
UNION ALL
SELECT 'offers_without_current_price', COUNT(*)
FROM supplier_offers
WHERE CURRENT_PRICE_DT IS NULL
UNION ALL
SELECT 'products_not_auto_matched', COUNT(*)
FROM supplier_products
WHERE MATCH_STATUS = 'UNMATCHED';
