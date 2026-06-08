INSERT INTO `common_codes`
  (`CODE_GROUP`, `CODE`, `CODE_NAME`, `CODE_NAME_KO`, `DESCRIPTION`, `SORT_ORDER`, `IS_ACTIVE`, `ATTRIBUTES_JSON`)
VALUES
  ('productStatus', 'AVAILABLE', 'Available', '구매가능', '주문 가능한 상품', 10, 'Y', JSON_OBJECT('color', 'green')),
  ('productStatus', 'LOW_STOCK', 'Low stock', '재고부족', '재고가 적어 확인이 필요한 상품', 20, 'Y', JSON_OBJECT('color', 'amber')),
  ('productStatus', 'OUT_OF_STOCK', 'Out of stock', '품절', '현재 구매 불가 상품', 30, 'Y', JSON_OBJECT('color', 'red')),
  ('productStatus', 'ADMIN_CHECK_REQUIRED', 'Admin check required', '관리자 확인 필요', '재고/가격/스펙 검수가 필요한 상품', 40, 'Y', JSON_OBJECT('color', 'slate')),
  ('badge', 'VALUE', 'Value', '가성비', '가격 대비 성능이 좋은 부품', 10, 'Y', JSON_OBJECT('tone', 'emerald')),
  ('badge', 'GAME_RECOMMENDED', 'Game recommended', '게임 추천', '게이밍 견적에 추천', 20, 'Y', JSON_OBJECT('tone', 'teal')),
  ('badge', 'LOW_NOISE', 'Low noise', '저소음', '소음이 낮은 구성에 추천', 30, 'Y', JSON_OBJECT('tone', 'blue')),
  ('badge', 'WHITE_AESTHETIC', 'White aesthetic', '화이트 감성', '화이트/감성 구성에 추천', 40, 'Y', JSON_OBJECT('tone', 'zinc')),
  ('badge', 'STOCK_STABLE', 'Stock stable', '재고안정', '품절 가능성이 낮은 후보', 50, 'Y', JSON_OBJECT('tone', 'green')),
  ('CPUSocket', 'AM3', 'AM3', 'AM3', 'AMD AM3 소켓', 10, 'Y', NULL),
  ('CPUSocket', 'AM4', 'AM4', 'AM4', 'AMD AM4 소켓', 20, 'Y', JSON_OBJECT('memoryType', 'DDR4')),
  ('CPUSocket', 'AM5', 'AM5', 'AM5', 'AMD AM5 소켓', 30, 'Y', JSON_OBJECT('memoryType', 'DDR5')),
  ('CPUSocket', 'LGA1155', 'LGA1155', 'LGA1155', 'Intel LGA1155 소켓', 40, 'Y', JSON_OBJECT('memoryType', 'DDR3')),
  ('CPUSocket', 'LGA1700', 'LGA1700', 'LGA1700', 'Intel LGA1700 소켓', 50, 'Y', JSON_OBJECT('memoryTypes', JSON_ARRAY('DDR4', 'DDR5'))),
  ('CPUSocket', 'LGA1800', 'LGA1800', 'LGA1800', 'Intel LGA1800 계열 소켓', 60, 'Y', JSON_OBJECT('memoryType', 'DDR5')),
  ('RAMSocket', 'DDR3', 'DDR3', 'DDR3', 'DDR3 메모리 규격', 10, 'Y', NULL),
  ('RAMSocket', 'DDR4', 'DDR4', 'DDR4', 'DDR4 메모리 규격', 20, 'Y', NULL),
  ('RAMSocket', 'DDR5', 'DDR5', 'DDR5', 'DDR5 메모리 규격', 30, 'Y', NULL),
  ('quoteCompatibilityStatus', 'PASS', 'Pass', '통과', '호환성 검사를 통과', 10, 'Y', JSON_OBJECT('color', 'green')),
  ('quoteCompatibilityStatus', 'WARNING', 'Warning', '주의', '주문 전 확인 필요', 20, 'Y', JSON_OBJECT('color', 'amber')),
  ('quoteCompatibilityStatus', 'FAIL', 'Fail', '실패', '주문 차단 대상', 30, 'Y', JSON_OBJECT('color', 'red')),
  ('quoteCompatibilityStatus', 'UNKNOWN', 'Unknown', '확인필요', '스펙 데이터 부족', 40, 'Y', JSON_OBJECT('color', 'slate'))
ON DUPLICATE KEY UPDATE
  `CODE_NAME` = VALUES(`CODE_NAME`),
  `CODE_NAME_KO` = VALUES(`CODE_NAME_KO`),
  `DESCRIPTION` = VALUES(`DESCRIPTION`),
  `SORT_ORDER` = VALUES(`SORT_ORDER`),
  `IS_ACTIVE` = VALUES(`IS_ACTIVE`),
  `ATTRIBUTES_JSON` = VALUES(`ATTRIBUTES_JSON`);

INSERT INTO `part_categories`
  (`CATEGORY_CODE`, `CATEGORY_NAME`, `SORT_ORDER`, `IS_REQUIRED_FOR_BUILD`, `IS_ACTIVE`)
VALUES
  ('CPU', 'CPU', 10, 'Y', 'Y'),
  ('CPU_COOLER', 'CPU 쿨러', 20, 'Y', 'Y'),
  ('MAINBOARD', '메인보드', 30, 'Y', 'Y'),
  ('RAM', '메모리', 40, 'Y', 'Y'),
  ('GPU', '그래픽카드', 50, 'N', 'Y'),
  ('SSD', 'SSD', 60, 'Y', 'Y'),
  ('PSU', '파워', 70, 'Y', 'Y'),
  ('CASE', '케이스', 80, 'Y', 'Y'),
  ('CASE_FAN', '케이스 팬', 90, 'N', 'Y'),
  ('TUNING', '튜닝용품', 100, 'N', 'Y')
ON DUPLICATE KEY UPDATE
  `CATEGORY_NAME` = VALUES(`CATEGORY_NAME`),
  `SORT_ORDER` = VALUES(`SORT_ORDER`),
  `IS_REQUIRED_FOR_BUILD` = VALUES(`IS_REQUIRED_FOR_BUILD`),
  `IS_ACTIVE` = VALUES(`IS_ACTIVE`);

INSERT INTO `suppliers`
  (`SUPPLIER_CODE`, `SUPPLIER_NAME`, `BASE_URL`, `STATUS`)
VALUES
  ('compuzone', '컴퓨존', 'https://www.compuzone.co.kr', 'ACTIVE'),
  ('danawa', '다나와', 'https://prod.danawa.com', 'ACTIVE')
ON DUPLICATE KEY UPDATE
  `SUPPLIER_NAME` = VALUES(`SUPPLIER_NAME`),
  `BASE_URL` = VALUES(`BASE_URL`),
  `STATUS` = VALUES(`STATUS`);

INSERT INTO `quote_templates`
  (`TEMPLATE_NAME`, `BUDGET_MIN`, `BUDGET_MAX`, `PURPOSE`, `RESOLUTION`, `PRIORITY_TYPE`, `IS_ACTIVE`)
VALUES
  ('게임 FHD 70만원대 기본', 600000, 899999, 'GAME', 'FHD', 'VALUE', 'Y'),
  ('게임 FHD 100만원대 기본', 900000, 1299999, 'GAME', 'FHD', 'VALUE', 'Y'),
  ('게임 QHD 150만원대 기본', 1300000, 1799999, 'GAME', 'QHD', 'PERFORMANCE', 'Y'),
  ('게임 QHD 200만원대 기본', 1800000, 2499999, 'GAME', 'QHD', 'PERFORMANCE', 'Y'),
  ('게임 4K 300만원대 기본', 2500000, 3999999, 'GAME', 'UHD_4K', 'PERFORMANCE', 'Y'),
  ('사무용 기본', 400000, 899999, 'OFFICE', 'FHD', 'VALUE', 'Y'),
  ('방송용 기본', 1500000, 3000000, 'STREAMING', 'QHD', 'PERFORMANCE', 'Y'),
  ('영상편집 기본', 1500000, 3500000, 'VIDEO_EDITING', 'QHD', 'PERFORMANCE', 'Y'),
  ('AI 작업 기본', 2000000, 5000000, 'AI', 'QHD', 'PERFORMANCE', 'Y')
ON DUPLICATE KEY UPDATE
  `BUDGET_MIN` = VALUES(`BUDGET_MIN`),
  `BUDGET_MAX` = VALUES(`BUDGET_MAX`),
  `PURPOSE` = VALUES(`PURPOSE`),
  `RESOLUTION` = VALUES(`RESOLUTION`),
  `PRIORITY_TYPE` = VALUES(`PRIORITY_TYPE`),
  `IS_ACTIVE` = VALUES(`IS_ACTIVE`);

INSERT INTO `supplier_crawl_targets`
  (`SUPPLIER_ID`, `PART_CATEGORY_ID`, `TARGET_NAME`, `SOURCE_URL`, `EXTERNAL_CATEGORY_CODE`, `BIG_DIV_NO`, `MEDIUM_DIV_NO`, `DIV_NO`, `CRAWL_PRIORITY`, `IS_ACTIVE`)
SELECT s.`SUPPLIER_ID`, c.`PART_CATEGORY_ID`, 'CPU', 'https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1012', '4/1012', '4', '1012', NULL, 10, 'Y'
FROM `suppliers` s JOIN `part_categories` c ON c.`CATEGORY_CODE` = 'CPU'
WHERE s.`SUPPLIER_CODE` = 'compuzone'
ON DUPLICATE KEY UPDATE `PART_CATEGORY_ID` = VALUES(`PART_CATEGORY_ID`), `TARGET_NAME` = VALUES(`TARGET_NAME`), `IS_ACTIVE` = VALUES(`IS_ACTIVE`);

INSERT INTO `supplier_crawl_targets`
  (`SUPPLIER_ID`, `PART_CATEGORY_ID`, `TARGET_NAME`, `SOURCE_URL`, `EXTERNAL_CATEGORY_CODE`, `BIG_DIV_NO`, `MEDIUM_DIV_NO`, `DIV_NO`, `CRAWL_PRIORITY`, `IS_ACTIVE`)
SELECT s.`SUPPLIER_ID`, c.`PART_CATEGORY_ID`, 'AMD CPU', 'https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1012&DivNo=2033', '4/1012/2033', '4', '1012', '2033', 11, 'Y'
FROM `suppliers` s JOIN `part_categories` c ON c.`CATEGORY_CODE` = 'CPU'
WHERE s.`SUPPLIER_CODE` = 'compuzone'
ON DUPLICATE KEY UPDATE `PART_CATEGORY_ID` = VALUES(`PART_CATEGORY_ID`), `TARGET_NAME` = VALUES(`TARGET_NAME`), `IS_ACTIVE` = VALUES(`IS_ACTIVE`);

INSERT INTO `supplier_crawl_targets`
  (`SUPPLIER_ID`, `PART_CATEGORY_ID`, `TARGET_NAME`, `SOURCE_URL`, `EXTERNAL_CATEGORY_CODE`, `BIG_DIV_NO`, `MEDIUM_DIV_NO`, `DIV_NO`, `CRAWL_PRIORITY`, `IS_ACTIVE`)
SELECT s.`SUPPLIER_ID`, c.`PART_CATEGORY_ID`, '인텔 정품 CPU', 'https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1012&DivNo=2032', '4/1012/2032', '4', '1012', '2032', 12, 'Y'
FROM `suppliers` s JOIN `part_categories` c ON c.`CATEGORY_CODE` = 'CPU'
WHERE s.`SUPPLIER_CODE` = 'compuzone'
ON DUPLICATE KEY UPDATE `PART_CATEGORY_ID` = VALUES(`PART_CATEGORY_ID`), `TARGET_NAME` = VALUES(`TARGET_NAME`), `IS_ACTIVE` = VALUES(`IS_ACTIVE`);

INSERT INTO `supplier_crawl_targets`
  (`SUPPLIER_ID`, `PART_CATEGORY_ID`, `TARGET_NAME`, `SOURCE_URL`, `EXTERNAL_CATEGORY_CODE`, `BIG_DIV_NO`, `MEDIUM_DIV_NO`, `DIV_NO`, `CRAWL_PRIORITY`, `IS_ACTIVE`)
SELECT s.`SUPPLIER_ID`, c.`PART_CATEGORY_ID`, '메인보드', 'https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1013', '4/1013', '4', '1013', NULL, 20, 'Y'
FROM `suppliers` s JOIN `part_categories` c ON c.`CATEGORY_CODE` = 'MAINBOARD'
WHERE s.`SUPPLIER_CODE` = 'compuzone'
ON DUPLICATE KEY UPDATE `PART_CATEGORY_ID` = VALUES(`PART_CATEGORY_ID`), `TARGET_NAME` = VALUES(`TARGET_NAME`), `IS_ACTIVE` = VALUES(`IS_ACTIVE`);

INSERT INTO `supplier_crawl_targets`
  (`SUPPLIER_ID`, `PART_CATEGORY_ID`, `TARGET_NAME`, `SOURCE_URL`, `EXTERNAL_CATEGORY_CODE`, `BIG_DIV_NO`, `MEDIUM_DIV_NO`, `DIV_NO`, `CRAWL_PRIORITY`, `IS_ACTIVE`)
SELECT s.`SUPPLIER_ID`, c.`PART_CATEGORY_ID`, '메모리', 'https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1014', '4/1014', '4', '1014', NULL, 30, 'Y'
FROM `suppliers` s JOIN `part_categories` c ON c.`CATEGORY_CODE` = 'RAM'
WHERE s.`SUPPLIER_CODE` = 'compuzone'
ON DUPLICATE KEY UPDATE `PART_CATEGORY_ID` = VALUES(`PART_CATEGORY_ID`), `TARGET_NAME` = VALUES(`TARGET_NAME`), `IS_ACTIVE` = VALUES(`IS_ACTIVE`);

INSERT INTO `supplier_crawl_targets`
  (`SUPPLIER_ID`, `PART_CATEGORY_ID`, `TARGET_NAME`, `SOURCE_URL`, `EXTERNAL_CATEGORY_CODE`, `BIG_DIV_NO`, `MEDIUM_DIV_NO`, `DIV_NO`, `CRAWL_PRIORITY`, `IS_ACTIVE`)
SELECT s.`SUPPLIER_ID`, c.`PART_CATEGORY_ID`, 'SSD', 'https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1276', '4/1276', '4', '1276', NULL, 40, 'Y'
FROM `suppliers` s JOIN `part_categories` c ON c.`CATEGORY_CODE` = 'SSD'
WHERE s.`SUPPLIER_CODE` = 'compuzone'
ON DUPLICATE KEY UPDATE `PART_CATEGORY_ID` = VALUES(`PART_CATEGORY_ID`), `TARGET_NAME` = VALUES(`TARGET_NAME`), `IS_ACTIVE` = VALUES(`IS_ACTIVE`);

INSERT INTO `supplier_crawl_targets`
  (`SUPPLIER_ID`, `PART_CATEGORY_ID`, `TARGET_NAME`, `SOURCE_URL`, `EXTERNAL_CATEGORY_CODE`, `BIG_DIV_NO`, `MEDIUM_DIV_NO`, `DIV_NO`, `CRAWL_PRIORITY`, `IS_ACTIVE`)
SELECT s.`SUPPLIER_ID`, c.`PART_CATEGORY_ID`, '그래픽카드', 'https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1016', '4/1016', '4', '1016', NULL, 50, 'Y'
FROM `suppliers` s JOIN `part_categories` c ON c.`CATEGORY_CODE` = 'GPU'
WHERE s.`SUPPLIER_CODE` = 'compuzone'
ON DUPLICATE KEY UPDATE `PART_CATEGORY_ID` = VALUES(`PART_CATEGORY_ID`), `TARGET_NAME` = VALUES(`TARGET_NAME`), `IS_ACTIVE` = VALUES(`IS_ACTIVE`);

INSERT INTO `supplier_crawl_targets`
  (`SUPPLIER_ID`, `PART_CATEGORY_ID`, `TARGET_NAME`, `SOURCE_URL`, `EXTERNAL_CATEGORY_CODE`, `BIG_DIV_NO`, `MEDIUM_DIV_NO`, `DIV_NO`, `CRAWL_PRIORITY`, `IS_ACTIVE`)
SELECT s.`SUPPLIER_ID`, c.`PART_CATEGORY_ID`, '케이스', 'https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1147', '4/1147', '4', '1147', NULL, 60, 'Y'
FROM `suppliers` s JOIN `part_categories` c ON c.`CATEGORY_CODE` = 'CASE'
WHERE s.`SUPPLIER_CODE` = 'compuzone'
ON DUPLICATE KEY UPDATE `PART_CATEGORY_ID` = VALUES(`PART_CATEGORY_ID`), `TARGET_NAME` = VALUES(`TARGET_NAME`), `IS_ACTIVE` = VALUES(`IS_ACTIVE`);

INSERT INTO `supplier_crawl_targets`
  (`SUPPLIER_ID`, `PART_CATEGORY_ID`, `TARGET_NAME`, `SOURCE_URL`, `EXTERNAL_CATEGORY_CODE`, `BIG_DIV_NO`, `MEDIUM_DIV_NO`, `DIV_NO`, `CRAWL_PRIORITY`, `IS_ACTIVE`)
SELECT s.`SUPPLIER_ID`, c.`PART_CATEGORY_ID`, '파워', 'https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1148', '4/1148', '4', '1148', NULL, 70, 'Y'
FROM `suppliers` s JOIN `part_categories` c ON c.`CATEGORY_CODE` = 'PSU'
WHERE s.`SUPPLIER_CODE` = 'compuzone'
ON DUPLICATE KEY UPDATE `PART_CATEGORY_ID` = VALUES(`PART_CATEGORY_ID`), `TARGET_NAME` = VALUES(`TARGET_NAME`), `IS_ACTIVE` = VALUES(`IS_ACTIVE`);

INSERT INTO `supplier_crawl_targets`
  (`SUPPLIER_ID`, `PART_CATEGORY_ID`, `TARGET_NAME`, `SOURCE_URL`, `EXTERNAL_CATEGORY_CODE`, `BIG_DIV_NO`, `MEDIUM_DIV_NO`, `DIV_NO`, `CRAWL_PRIORITY`, `IS_ACTIVE`)
SELECT s.`SUPPLIER_ID`, c.`PART_CATEGORY_ID`, 'CPU쿨러(공랭)', 'https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1020&DivNo=2054', '4/1020/2054', '4', '1020', '2054', 80, 'Y'
FROM `suppliers` s JOIN `part_categories` c ON c.`CATEGORY_CODE` = 'CPU_COOLER'
WHERE s.`SUPPLIER_CODE` = 'compuzone'
ON DUPLICATE KEY UPDATE `PART_CATEGORY_ID` = VALUES(`PART_CATEGORY_ID`), `TARGET_NAME` = VALUES(`TARGET_NAME`), `IS_ACTIVE` = VALUES(`IS_ACTIVE`);

INSERT INTO `supplier_crawl_targets`
  (`SUPPLIER_ID`, `PART_CATEGORY_ID`, `TARGET_NAME`, `SOURCE_URL`, `EXTERNAL_CATEGORY_CODE`, `BIG_DIV_NO`, `MEDIUM_DIV_NO`, `DIV_NO`, `CRAWL_PRIORITY`, `IS_ACTIVE`)
SELECT s.`SUPPLIER_ID`, c.`PART_CATEGORY_ID`, 'CPU쿨러(수랭)', 'https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1020&DivNo=4582', '4/1020/4582', '4', '1020', '4582', 81, 'Y'
FROM `suppliers` s JOIN `part_categories` c ON c.`CATEGORY_CODE` = 'CPU_COOLER'
WHERE s.`SUPPLIER_CODE` = 'compuzone'
ON DUPLICATE KEY UPDATE `PART_CATEGORY_ID` = VALUES(`PART_CATEGORY_ID`), `TARGET_NAME` = VALUES(`TARGET_NAME`), `IS_ACTIVE` = VALUES(`IS_ACTIVE`);
