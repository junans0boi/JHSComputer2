-- ============================================================
-- JHSComputer2 DB Schema v2
-- 작성일: 2026-09-03
--
-- 기존 v1 대비 주요 변경:
--   [통합] benchmark_games → games (게임 마스터 단일화)
--   [신규] game_aliases       — 다출처 게임명/슬러그 매핑
--   [신규] benchmark_hardware_models — CPU/GPU 모델 ID 관리
--   [신규] benchmark_combos   — COMBO_KEY를 독립 엔티티로
--   [수정] benchmark_builds   — COMBO_KEY/CPU_MODEL/GPU_MODEL 제거, BENCHMARK_COMBO_ID FK 추가
--   [수정] benchmark_fps_results — BENCHMARK_GAME_ID → GAME_ID (통합 games 참조)
--   [수정] benchmark_combo_game_results — 텍스트 3컬럼 → FK 2컬럼
--   [수정] recommendation_posts — BENCHMARK_COMBO_ID 추가
--   [수정] recommendation_post_parts — PART_ID, SUPPLIER_OFFER_ID 추가
--   [수정] recommendation_post_games — GAME_ID 추가
--
-- 테이블 수: 39 → 41 (benchmark_games 제거, game_aliases/benchmark_hardware_models/benchmark_combos 추가)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- DOMAIN 1: 공통 마스터
-- ============================================================

CREATE TABLE IF NOT EXISTS `common_codes` (
  `COMMON_CODE_ID`  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `CODE_GROUP`      VARCHAR(80)  NOT NULL,
  `CODE`            VARCHAR(120) NOT NULL,
  `CODE_NAME`       VARCHAR(150) NOT NULL,
  `CODE_NAME_KO`    VARCHAR(150) NULL,
  `DESCRIPTION`     VARCHAR(500) NULL,
  `SORT_ORDER`      INT          NOT NULL DEFAULT 0,
  `IS_ACTIVE`       CHAR(1)      NOT NULL DEFAULT 'Y',
  `ATTRIBUTES_JSON` JSON         NULL,
  `CREATED_DT`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`      DATETIME     NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`COMMON_CODE_ID`),
  UNIQUE KEY `uq_common_codes_group_code`    (`CODE_GROUP`, `CODE`),
  KEY        `idx_common_codes_group_active` (`CODE_GROUP`, `IS_ACTIVE`, `SORT_ORDER`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `part_categories` (
  `PART_CATEGORY_ID`     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `CATEGORY_CODE`        VARCHAR(30)  NOT NULL,
  `CATEGORY_NAME`        VARCHAR(50)  NOT NULL,
  `SORT_ORDER`           INT          NOT NULL DEFAULT 0,
  `IS_REQUIRED_FOR_BUILD` CHAR(1)     NOT NULL DEFAULT 'N',
  `IS_ACTIVE`            CHAR(1)      NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`PART_CATEGORY_ID`),
  UNIQUE KEY `uq_part_categories_code` (`CATEGORY_CODE`),
  KEY        `idx_part_categories_sort` (`SORT_ORDER`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `suppliers` (
  `SUPPLIER_ID`   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `SUPPLIER_CODE` VARCHAR(40)  NOT NULL,
  `SUPPLIER_NAME` VARCHAR(100) NOT NULL,
  `BASE_URL`      VARCHAR(300) NULL,
  `STATUS`        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
  `CREATED_DT`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`    DATETIME     NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`SUPPLIER_ID`),
  UNIQUE KEY `uq_suppliers_code` (`SUPPLIER_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `supplier_crawl_targets` (
  `CRAWL_TARGET_ID`       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `SUPPLIER_ID`           BIGINT UNSIGNED NOT NULL,
  `PART_CATEGORY_ID`      BIGINT UNSIGNED NULL,
  `TARGET_NAME`           VARCHAR(150)  NOT NULL,
  `SOURCE_URL`            VARCHAR(1000) NOT NULL,
  `EXTERNAL_CATEGORY_CODE` VARCHAR(200) NULL,
  `BIG_DIV_NO`            VARCHAR(30)  NULL,
  `MEDIUM_DIV_NO`         VARCHAR(30)  NULL,
  `DIV_NO`                VARCHAR(30)  NULL,
  `CRAWL_PRIORITY`        INT          NOT NULL DEFAULT 100,
  `IS_ACTIVE`             CHAR(1)      NOT NULL DEFAULT 'Y',
  `CREATED_DT`            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`CRAWL_TARGET_ID`),
  UNIQUE KEY `uq_supplier_crawl_targets_url`      (`SOURCE_URL`(255)),
  KEY        `idx_supplier_crawl_targets_supplier` (`SUPPLIER_ID`),
  KEY        `idx_supplier_crawl_targets_category` (`PART_CATEGORY_ID`),
  CONSTRAINT `fk_supplier_crawl_targets_supplier`
    FOREIGN KEY (`SUPPLIER_ID`)      REFERENCES `suppliers`       (`SUPPLIER_ID`)      ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_supplier_crawl_targets_category`
    FOREIGN KEY (`PART_CATEGORY_ID`) REFERENCES `part_categories` (`PART_CATEGORY_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 2: 게임 마스터 (통합 — 구 benchmark_games 흡수)
-- ============================================================
-- 변경: benchmark_games(154행)을 games로 통합.
--       games에만 GAME_ID 체계를 사용하고 benchmark_games 테이블 제거.
--       출처별 표기 차이(한글/영문/슬러그)는 game_aliases로 관리.

CREATE TABLE IF NOT EXISTS `games` (
  `GAME_ID`      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `GAME_NAME`    VARCHAR(160) NOT NULL,
  `SLUG`         VARCHAR(160) NOT NULL,
  `GENRE`        VARCHAR(50)  NULL,
  `PRIORITY`     INT          NOT NULL DEFAULT 0,
  `IS_ACTIVE`    CHAR(1)      NOT NULL DEFAULT 'Y',
  `CREATED_DT`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`   DATETIME     NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`GAME_ID`),
  UNIQUE KEY `uq_games_slug`     (`SLUG`),
  KEY        `idx_games_active_priority` (`IS_ACTIVE`, `PRIORITY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 출처(kjwwang, wanggapc, steam 등)별 게임 표기 매핑
-- 같은 게임이 사이트마다 이름/슬러그가 다를 때 여기서 통합
CREATE TABLE IF NOT EXISTS `game_aliases` (
  `GAME_ALIAS_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `GAME_ID`       BIGINT UNSIGNED NOT NULL,
  `SOURCE`        VARCHAR(50)  NOT NULL,  -- 'KJWWANG' | 'WANGGAPC' | 'STEAM' | ...
  `ALIAS_NAME`    VARCHAR(160) NOT NULL,  -- 해당 출처에서 사용하는 표기명
  `ALIAS_SLUG`    VARCHAR(160) NOT NULL,  -- 해당 출처 slug
  PRIMARY KEY (`GAME_ALIAS_ID`),
  UNIQUE KEY `uq_game_aliases_source_slug` (`SOURCE`, `ALIAS_SLUG`),
  KEY        `idx_game_aliases_game`       (`GAME_ID`),
  CONSTRAINT `fk_game_aliases_game`
    FOREIGN KEY (`GAME_ID`) REFERENCES `games` (`GAME_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 게임별 구동 권장 스펙 (견적 추천 기준)
CREATE TABLE IF NOT EXISTS `game_requirements` (
  `GAME_REQUIREMENT_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `GAME_ID`             BIGINT UNSIGNED NOT NULL,
  `RESOLUTION`          VARCHAR(30) NOT NULL,
  `TARGET_FPS`          INT         NOT NULL,
  `QUALITY_PRESET`      VARCHAR(30) NOT NULL,
  `CPU_SCORE_MIN`       INT         NULL,
  `GPU_SCORE_MIN`       INT         NULL,
  `RAM_GB_MIN`          INT         NULL,
  PRIMARY KEY (`GAME_REQUIREMENT_ID`),
  UNIQUE KEY `uq_game_requirements_profile` (`GAME_ID`, `RESOLUTION`, `TARGET_FPS`, `QUALITY_PRESET`),
  KEY        `idx_game_requirements_match`  (`RESOLUTION`, `TARGET_FPS`, `QUALITY_PRESET`),
  CONSTRAINT `fk_game_requirements_game`
    FOREIGN KEY (`GAME_ID`) REFERENCES `games` (`GAME_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 3: 부품 상품
-- ============================================================

CREATE TABLE IF NOT EXISTS `parts` (
  `PART_ID`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `PART_CATEGORY_ID`  BIGINT UNSIGNED NOT NULL,
  `CANONICAL_NAME`    VARCHAR(255) NOT NULL,
  `MANUFACTURER`      VARCHAR(100) NULL,
  `MODEL_NAME`        VARCHAR(180) NULL,
  `MODEL_KEY`         VARCHAR(220) NULL,
  `THUMBNAIL_URL`     VARCHAR(700) NULL,
  `STATUS`            VARCHAR(30)  NOT NULL DEFAULT 'ACTIVE',
  `IS_ADMIN_APPROVED` CHAR(1)      NOT NULL DEFAULT 'N',
  `ADMIN_PRIORITY`    INT          NOT NULL DEFAULT 0,
  `POPULARITY_SCORE`  DECIMAL(10,2) NOT NULL DEFAULT 0,
  `SPEC_STATUS`       VARCHAR(30)  NOT NULL DEFAULT 'UNVERIFIED',
  `SPEC_VERIFIED_DT`  DATETIME     NULL,
  `CREATED_DT`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`        DATETIME     NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PART_ID`),
  KEY `idx_parts_category`       (`PART_CATEGORY_ID`),
  KEY `idx_parts_model_key`      (`MODEL_KEY`),
  KEY `idx_parts_status_priority` (`STATUS`, `ADMIN_PRIORITY`),
  CONSTRAINT `fk_parts_category`
    FOREIGN KEY (`PART_CATEGORY_ID`) REFERENCES `part_categories` (`PART_CATEGORY_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 공급처 크롤링 원본 상품 (1상품 = 1행, 중복 금지)
CREATE TABLE IF NOT EXISTS `supplier_products` (
  `SUPPLIER_PRODUCT_ID`  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `SUPPLIER_ID`          BIGINT UNSIGNED NOT NULL,
  `CRAWL_TARGET_ID`      BIGINT UNSIGNED NULL,
  `EXTERNAL_PRODUCT_ID`  VARCHAR(120) NOT NULL,
  `PRODUCT_NAME`         VARCHAR(500) NOT NULL,
  `PRODUCT_URL`          VARCHAR(1000) NOT NULL,
  `IMAGE_URL`            VARCHAR(1000) NULL,
  `SUMMARY_SPEC_TEXT`    TEXT NULL,
  `RAW_SPEC_JSON`        JSON NULL,
  `SPEC_PARSE_STATUS`    VARCHAR(30) NOT NULL DEFAULT 'UNPARSED',
  `SPEC_CAPTURED_DT`     DATETIME NULL,
  `REVIEW_COUNT`         INT NULL,
  `RATING`               DECIMAL(3,2) NULL,
  `MATCH_STATUS`         VARCHAR(30) NOT NULL DEFAULT 'UNMATCHED',
  `MATCH_CONFIDENCE`     DECIMAL(5,2) NULL,
  `IS_ACTIVE`            CHAR(1)     NOT NULL DEFAULT 'Y',
  `LAST_SEEN_DT`         DATETIME NULL,
  `CREATED_DT`           DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`           DATETIME    NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`SUPPLIER_PRODUCT_ID`),
  UNIQUE KEY `uq_supplier_products_external`    (`SUPPLIER_ID`, `EXTERNAL_PRODUCT_ID`),
  KEY        `idx_supplier_products_target`      (`CRAWL_TARGET_ID`),
  KEY        `idx_supplier_products_match_status` (`MATCH_STATUS`),
  CONSTRAINT `fk_supplier_products_supplier`
    FOREIGN KEY (`SUPPLIER_ID`)      REFERENCES `suppliers`              (`SUPPLIER_ID`)      ON DELETE RESTRICT  ON UPDATE CASCADE,
  CONSTRAINT `fk_supplier_products_crawl_target`
    FOREIGN KEY (`CRAWL_TARGET_ID`)  REFERENCES `supplier_crawl_targets` (`CRAWL_TARGET_ID`)  ON DELETE SET NULL  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 상품의 판매 옵션(박스/벌크/패키지 등)
CREATE TABLE IF NOT EXISTS `supplier_offers` (
  `SUPPLIER_OFFER_ID`    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `SUPPLIER_PRODUCT_ID`  BIGINT UNSIGNED NOT NULL,
  `PART_ID`              BIGINT UNSIGNED NULL,      -- parts와 매칭된 경우
  `EXTERNAL_OFFER_ID`    VARCHAR(120) NOT NULL,
  `OFFER_NAME`           VARCHAR(700) NOT NULL,
  `OPTION_LABEL`         VARCHAR(200) NULL,
  `OFFER_KIND`           VARCHAR(30)  NULL,
  `ATTRIBUTES_JSON`      JSON NULL,
  `PACKAGE_TYPE`         VARCHAR(30)  NULL,
  `COOLER_INCLUDED`      CHAR(1)      NULL,
  `IS_DEFAULT`           CHAR(1)      NOT NULL DEFAULT 'N',
  `IS_ACTIVE`            CHAR(1)      NOT NULL DEFAULT 'Y',
  `CURRENT_PUBLIC_PRICE` INT          NULL,
  `CURRENT_BENEFIT_PRICE` INT         NULL,
  `CURRENT_STOCK_STATUS` VARCHAR(30)  NOT NULL DEFAULT 'UNKNOWN',
  `CURRENT_PRICE_DT`     DATETIME     NULL,
  `LAST_SEEN_DT`         DATETIME NULL,
  `RAW_JSON`             JSON NULL,
  `CREATED_DT`           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`           DATETIME     NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`SUPPLIER_OFFER_ID`),
  UNIQUE KEY `uq_supplier_offers_external`  (`SUPPLIER_PRODUCT_ID`, `EXTERNAL_OFFER_ID`),
  KEY        `idx_supplier_offers_product`  (`SUPPLIER_PRODUCT_ID`),
  KEY        `idx_supplier_offers_part`     (`PART_ID`),
  KEY        `idx_supplier_offers_kind`     (`OFFER_KIND`),
  CONSTRAINT `fk_supplier_offers_product`
    FOREIGN KEY (`SUPPLIER_PRODUCT_ID`) REFERENCES `supplier_products` (`SUPPLIER_PRODUCT_ID`) ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_supplier_offers_part`
    FOREIGN KEY (`PART_ID`)             REFERENCES `parts`             (`PART_ID`)             ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 오퍼별 가격 이력 (수집 시점마다 append)
CREATE TABLE IF NOT EXISTS `supplier_offer_prices` (
  `OFFER_PRICE_ID`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `SUPPLIER_OFFER_ID`          BIGINT UNSIGNED NOT NULL,
  `PUBLIC_PRICE`               INT     NOT NULL DEFAULT 0,
  `BENEFIT_PRICE`              INT     NULL,
  `DISCOUNT_AMOUNT`            INT     NULL,
  `PRODUCT_REWARD_POINTS`      INT     NULL,
  `MEMBERSHIP_REWARD_POINTS`   INT     NULL,
  `BANK_TRANSFER_REWARD_POINTS` INT    NULL,
  `STOCK_STATUS`               VARCHAR(30) NOT NULL DEFAULT 'UNKNOWN',
  `DELIVERY_FEE`               INT     NULL,
  `SOURCE_TYPE`                VARCHAR(30) NOT NULL,
  `CAPTURED_DT`                DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `RAW_JSON`                   JSON NULL,
  PRIMARY KEY (`OFFER_PRICE_ID`),
  KEY `idx_supplier_offer_prices_offer_captured` (`SUPPLIER_OFFER_ID`, `CAPTURED_DT`),
  KEY `idx_supplier_offer_prices_stock`          (`STOCK_STATUS`),
  CONSTRAINT `fk_supplier_offer_prices_offer`
    FOREIGN KEY (`SUPPLIER_OFFER_ID`) REFERENCES `supplier_offers` (`SUPPLIER_OFFER_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 4: 부품 스펙 (카테고리별 typed table — 구조 유지)
-- ============================================================
-- 이유: 카테고리별 컬럼이 완전히 달라 단일 테이블 통합 시 NULL 컬럼 폭발
--       및 호환성 쿼리(소켓 일치 등)가 복잡해짐.

CREATE TABLE IF NOT EXISTS `cpu_specs` (
  `PART_ID`                   BIGINT UNSIGNED NOT NULL,
  `SOCKET`                    VARCHAR(50)  NOT NULL,
  `FAMILY`                    VARCHAR(100) NULL,
  `GENERATION`                VARCHAR(100) NULL,
  `CODENAME`                  VARCHAR(100) NULL,
  `CORE_COUNT`                INT          NULL,
  `THREAD_COUNT`              INT          NULL,
  `BASE_CLOCK_GHZ`            DECIMAL(5,2) NULL,
  `BOOST_CLOCK_GHZ`           DECIMAL(5,2) NULL,
  `L2_CACHE_MB`               DECIMAL(8,2) NULL,
  `L3_CACHE_MB`               DECIMAL(8,2) NULL,
  `TDP_W`                     INT          NULL,
  `PBP_W`                     INT          NULL,
  `MTP_W`                     INT          NULL,
  `MEMORY_TYPES_JSON`         JSON         NULL,
  `PCIE_VERSIONS_JSON`        JSON         NULL,
  `HAS_INTEGRATED_GRAPHICS`   CHAR(1)      NULL,
  `INTEGRATED_GRAPHICS_NAME`  VARCHAR(120) NULL,
  `UPDATED_DT`                DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PART_ID`),
  KEY `idx_cpu_specs_socket` (`SOCKET`),
  CONSTRAINT `fk_cpu_specs_part`
    FOREIGN KEY (`PART_ID`) REFERENCES `parts` (`PART_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gpu_specs` (
  `PART_ID`               BIGINT UNSIGNED NOT NULL,
  `CHIPSET_MAKER`         VARCHAR(50)  NULL,
  `CHIPSET_NAME`          VARCHAR(100) NULL,
  `SERIES_NAME`           VARCHAR(100) NULL,
  `MEMORY_TYPE`           VARCHAR(50)  NULL,
  `MEMORY_GB`             INT          NULL,
  `INTERFACE_TEXT`        VARCHAR(120) NULL,
  `RECOMMENDED_PSU_W`     INT          NULL,
  `POWER_CONSUMPTION_W`   INT          NULL,
  `POWER_PORTS_JSON`      JSON         NULL,
  `LENGTH_MM`             DECIMAL(8,2) NULL,
  `HEIGHT_MM`             DECIMAL(8,2) NULL,
  `THICKNESS_MM`          DECIMAL(8,2) NULL,
  `DISPLAY_OUTPUTS_JSON`  JSON         NULL,
  `UPDATED_DT`            DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PART_ID`),
  KEY `idx_gpu_specs_chipset` (`CHIPSET_MAKER`, `CHIPSET_NAME`),
  CONSTRAINT `fk_gpu_specs_part`
    FOREIGN KEY (`PART_ID`) REFERENCES `parts` (`PART_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mainboard_specs` (
  `PART_ID`           BIGINT UNSIGNED NOT NULL,
  `SOCKET`            VARCHAR(50)  NOT NULL,
  `CHIPSET`           VARCHAR(100) NULL,
  `FORM_FACTOR`       VARCHAR(50)  NULL,
  `MEMORY_TYPE`       VARCHAR(50)  NULL,
  `MEMORY_SLOT_COUNT` INT          NULL,
  `MAX_MEMORY_GB`     INT          NULL,
  `M2_SLOT_COUNT`     INT          NULL,
  `SATA_PORT_COUNT`   INT          NULL,
  `PCIE_X16_SLOT_COUNT` INT        NULL,
  `WIFI_BUILTIN`      CHAR(1)      NULL,
  `UPDATED_DT`        DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PART_ID`),
  KEY `idx_mainboard_specs_socket`      (`SOCKET`),
  KEY `idx_mainboard_specs_memory_type` (`MEMORY_TYPE`),
  CONSTRAINT `fk_mainboard_specs_part`
    FOREIGN KEY (`PART_ID`) REFERENCES `parts` (`PART_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ram_specs` (
  `PART_ID`       BIGINT UNSIGNED NOT NULL,
  `MEMORY_TYPE`   VARCHAR(50) NOT NULL,
  `CAPACITY_GB`   INT         NOT NULL,
  `MODULE_COUNT`  INT         NULL,
  `SPEED_MHZ`     INT         NULL,
  `PROFILE_TYPE`  VARCHAR(50) NULL,
  `UPDATED_DT`    DATETIME    NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PART_ID`),
  KEY `idx_ram_specs_type_capacity` (`MEMORY_TYPE`, `CAPACITY_GB`),
  CONSTRAINT `fk_ram_specs_part`
    FOREIGN KEY (`PART_ID`) REFERENCES `parts` (`PART_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `storage_specs` (
  `PART_ID`           BIGINT UNSIGNED NOT NULL,
  `STORAGE_TYPE`      VARCHAR(30)  NOT NULL,
  `FORM_FACTOR`       VARCHAR(50)  NULL,
  `INTERFACE_TEXT`    VARCHAR(120) NULL,
  `CAPACITY_GB`       INT          NOT NULL,
  `SEQ_READ_MBPS`     INT          NULL,
  `SEQ_WRITE_MBPS`    INT          NULL,
  `UPDATED_DT`        DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PART_ID`),
  KEY `idx_storage_specs_type_capacity` (`STORAGE_TYPE`, `CAPACITY_GB`),
  CONSTRAINT `fk_storage_specs_part`
    FOREIGN KEY (`PART_ID`) REFERENCES `parts` (`PART_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `psu_specs` (
  `PART_ID`        BIGINT UNSIGNED NOT NULL,
  `FORM_FACTOR`    VARCHAR(50) NULL,
  `RATED_WATTAGE`  INT         NOT NULL,
  `CERTIFICATION`  VARCHAR(80) NULL,
  `MODULAR_TYPE`   VARCHAR(50) NULL,
  `PCIE_5_READY`   CHAR(1)     NULL,
  `CONNECTOR_JSON` JSON        NULL,
  `UPDATED_DT`     DATETIME    NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PART_ID`),
  KEY `idx_psu_specs_wattage` (`RATED_WATTAGE`),
  CONSTRAINT `fk_psu_specs_part`
    FOREIGN KEY (`PART_ID`) REFERENCES `parts` (`PART_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `case_specs` (
  `PART_ID`                    BIGINT UNSIGNED NOT NULL,
  `CASE_TYPE`                  VARCHAR(50)  NULL,
  `COLOR`                      VARCHAR(50)  NULL,
  `SUPPORTED_BOARD_FORMS_JSON` JSON         NULL,
  `MAX_GPU_LENGTH_MM`          DECIMAL(8,2) NULL,
  `MAX_COOLER_HEIGHT_MM`       DECIMAL(8,2) NULL,
  `FAN_COUNT`                  INT          NULL,
  `UPDATED_DT`                 DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PART_ID`),
  KEY `idx_case_specs_type_color` (`CASE_TYPE`, `COLOR`),
  CONSTRAINT `fk_case_specs_part`
    FOREIGN KEY (`PART_ID`) REFERENCES `parts` (`PART_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cooler_specs` (
  `PART_ID`               BIGINT UNSIGNED NOT NULL,
  `COOLER_TYPE`           VARCHAR(30)  NOT NULL,
  `COLOR`                 VARCHAR(50)  NULL,
  `SUPPORTED_SOCKETS_JSON` JSON        NULL,
  `HEIGHT_MM`             DECIMAL(8,2) NULL,
  `FAN_SIZE_MM`           INT          NULL,
  `TDP_RATING_W`          INT          NULL,
  `UPDATED_DT`            DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PART_ID`),
  KEY `idx_cooler_specs_type` (`COOLER_TYPE`),
  CONSTRAINT `fk_cooler_specs_part`
    FOREIGN KEY (`PART_ID`) REFERENCES `parts` (`PART_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 5: 벤치마크
-- ============================================================
-- 핵심 변경:
--   benchmark_hardware_models: CPU/GPU 모델을 ID로 관리 (텍스트 중복 제거)
--   benchmark_combos: COMBO_KEY(CPU+GPU 조합)를 독립 엔티티로
--   benchmark_builds: COMBO_KEY/CPU_MODEL/GPU_MODEL 텍스트 제거 → BENCHMARK_COMBO_ID FK
--   benchmark_fps_results: BENCHMARK_GAME_ID → GAME_ID (통합 games 참조)
--   benchmark_combo_game_results: COMBO_KEY/CPU_MODEL/GPU_MODEL → FK 2컬럼

CREATE TABLE IF NOT EXISTS `benchmark_sources` (
  `BENCHMARK_SOURCE_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `SOURCE_CODE`         VARCHAR(50)  NOT NULL,
  `SOURCE_NAME`         VARCHAR(100) NOT NULL,
  `BASE_URL`            VARCHAR(255) NULL,
  `CREATED_DT`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`BENCHMARK_SOURCE_ID`),
  UNIQUE KEY `uk_benchmark_sources_code` (`SOURCE_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CPU/GPU 모델 레지스트리.
-- 벤치마크 사이트의 모델명(i5-12400F, RTX 5060 등)을 ID로 관리.
-- PART_ID는 실제 parts와 정확히 매칭된 경우에만 채움 (칩셋≠SKU임을 주의).
CREATE TABLE IF NOT EXISTS `benchmark_hardware_models` (
  `BENCHMARK_MODEL_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `DEVICE_TYPE`        CHAR(3)      NOT NULL,   -- 'CPU' | 'GPU'
  `MODEL_KEY`          VARCHAR(100) NOT NULL,   -- 'i5-12400F', 'RTX 5060'
  `DISPLAY_NAME`       VARCHAR(150) NOT NULL,   -- 화면 표시용 이름
  `PART_ID`            BIGINT UNSIGNED NULL,    -- 선택: parts 직접 연결
  `MATCH_STATUS`       VARCHAR(30)  NOT NULL DEFAULT 'UNMATCHED',
  `CREATED_DT`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BENCHMARK_MODEL_ID`),
  UNIQUE KEY `uq_benchmark_hardware_type_key` (`DEVICE_TYPE`, `MODEL_KEY`),
  KEY        `idx_benchmark_hardware_part`    (`PART_ID`),
  CONSTRAINT `fk_benchmark_hardware_part`
    FOREIGN KEY (`PART_ID`) REFERENCES `parts` (`PART_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CPU+GPU 조합 엔티티. COMBO_KEY는 사람이 읽는 slug로 유지.
-- 실제 관계는 CPU_MODEL_ID / GPU_MODEL_ID FK로 관리.
CREATE TABLE IF NOT EXISTS `benchmark_combos` (
  `BENCHMARK_COMBO_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `COMBO_KEY`          VARCHAR(160) NOT NULL,   -- 'i5-12400F+RTX-5060' 형태
  `CPU_MODEL_ID`       BIGINT UNSIGNED NOT NULL,
  `GPU_MODEL_ID`       BIGINT UNSIGNED NOT NULL,
  `CREATED_DT`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BENCHMARK_COMBO_ID`),
  UNIQUE KEY `uq_benchmark_combos_key`    (`COMBO_KEY`),
  UNIQUE KEY `uq_benchmark_combos_models` (`CPU_MODEL_ID`, `GPU_MODEL_ID`),
  CONSTRAINT `fk_benchmark_combos_cpu`
    FOREIGN KEY (`CPU_MODEL_ID`) REFERENCES `benchmark_hardware_models` (`BENCHMARK_MODEL_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_benchmark_combos_gpu`
    FOREIGN KEY (`GPU_MODEL_ID`) REFERENCES `benchmark_hardware_models` (`BENCHMARK_MODEL_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 출처 사이트의 개별 견적 포스트.
-- CPU_NAME / GPU_NAME은 원본 사이트 표기를 snapshot으로 보존.
CREATE TABLE IF NOT EXISTS `benchmark_builds` (
  `BENCHMARK_BUILD_ID`  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `BENCHMARK_SOURCE_ID` BIGINT UNSIGNED NOT NULL,
  `BENCHMARK_COMBO_ID`  BIGINT UNSIGNED NOT NULL,  -- v2 신규: 조합 엔티티 참조
  `EXTERNAL_BUILD_ID`   VARCHAR(80)  NOT NULL,
  `TITLE`               VARCHAR(255) NOT NULL,
  `CPU_NAME`            VARCHAR(255) NOT NULL,      -- 원본 사이트 표기 (snapshot)
  `GPU_NAME`            VARCHAR(255) NOT NULL,      -- 원본 사이트 표기 (snapshot)
  `MAINBOARD_NAME`      VARCHAR(255) NULL,
  `GAME_COUNT`          INT          NOT NULL DEFAULT 0,
  `FPS_RECORD_COUNT`    INT          NOT NULL DEFAULT 0,
  `RAW_JSON`            JSON         NULL,
  `CREATED_DT`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`BENCHMARK_BUILD_ID`),
  UNIQUE KEY `uk_benchmark_build_source_external` (`BENCHMARK_SOURCE_ID`, `EXTERNAL_BUILD_ID`),
  KEY        `idx_benchmark_build_combo`           (`BENCHMARK_COMBO_ID`),
  CONSTRAINT `fk_benchmark_build_source`
    FOREIGN KEY (`BENCHMARK_SOURCE_ID`) REFERENCES `benchmark_sources` (`BENCHMARK_SOURCE_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_benchmark_build_combo`
    FOREIGN KEY (`BENCHMARK_COMBO_ID`)  REFERENCES `benchmark_combos`  (`BENCHMARK_COMBO_ID`)  ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 출처 포스트의 부품 구성 목록 (원본 크롤 데이터)
CREATE TABLE IF NOT EXISTS `benchmark_build_parts` (
  `BENCHMARK_BUILD_PART_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `BENCHMARK_BUILD_ID`      BIGINT UNSIGNED NOT NULL,
  `PART_CATEGORY`           VARCHAR(50)  NOT NULL,
  `PART_LABEL`              VARCHAR(80)  NULL,
  `PART_NAME`               VARCHAR(255) NOT NULL,
  `PART_PRICE`              INT          NULL,
  `QUANTITY`                INT          NULL,
  `EXTERNAL_PRODUCT_CODE`   VARCHAR(80)  NULL,
  `IMAGE_URL`               VARCHAR(500) NULL,
  `SPEC_TEXT`               TEXT         NULL,
  PRIMARY KEY (`BENCHMARK_BUILD_PART_ID`),
  UNIQUE KEY `uk_benchmark_build_part` (`BENCHMARK_BUILD_ID`, `PART_CATEGORY`, `PART_NAME`),
  CONSTRAINT `fk_benchmark_build_part_build`
    FOREIGN KEY (`BENCHMARK_BUILD_ID`) REFERENCES `benchmark_builds` (`BENCHMARK_BUILD_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 빌드 × 게임 × 해상도별 FPS 원본 측정값
-- v2 변경: BENCHMARK_GAME_ID → GAME_ID (통합 games 테이블 참조)
CREATE TABLE IF NOT EXISTS `benchmark_fps_results` (
  `BENCHMARK_FPS_RESULT_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `BENCHMARK_BUILD_ID`      BIGINT UNSIGNED NOT NULL,
  `GAME_ID`                 BIGINT UNSIGNED NOT NULL,   -- v2: games 통합 참조
  `RESOLUTION`              VARCHAR(20)  NOT NULL,
  `OPTION_KEY`              VARCHAR(100) NOT NULL DEFAULT 'UNKNOWN',
  `SOURCE_CONDITION_KEY`    VARCHAR(160) NOT NULL DEFAULT 'UNKNOWN',
  `RAW_OPTION_PRESET`       VARCHAR(50)  NULL,
  `NORMALIZED_QUALITY`      VARCHAR(30)  NOT NULL,
  `RAW_FPS`                 INT          NULL,
  `DISPLAY_FPS_MIN`         INT          NULL,
  `DISPLAY_FPS_MAX`         INT          NULL,
  `COMFORT_GRADE`           VARCHAR(30)  NOT NULL,
  `PLAYABLE`                CHAR(1)      NOT NULL DEFAULT 'Y',
  `RAW_TEXT`                VARCHAR(100) NULL,
  PRIMARY KEY (`BENCHMARK_FPS_RESULT_ID`),
  UNIQUE KEY `uk_benchmark_fps`          (`BENCHMARK_BUILD_ID`, `GAME_ID`, `RESOLUTION`, `OPTION_KEY`, `SOURCE_CONDITION_KEY`),
  KEY        `idx_benchmark_fps_game_res` (`GAME_ID`, `RESOLUTION`),
  CONSTRAINT `fk_benchmark_fps_build`
    FOREIGN KEY (`BENCHMARK_BUILD_ID`) REFERENCES `benchmark_builds` (`BENCHMARK_BUILD_ID`) ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_benchmark_fps_game`
    FOREIGN KEY (`GAME_ID`)            REFERENCES `games`            (`GAME_ID`)            ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 조합(CPU+GPU) × 게임 × 해상도 집계 결과
-- v2 변경: COMBO_KEY/CPU_MODEL/GPU_MODEL 텍스트 제거 → BENCHMARK_COMBO_ID + GAME_ID FK
CREATE TABLE IF NOT EXISTS `benchmark_combo_game_results` (
  `BENCHMARK_COMBO_GAME_RESULT_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `BENCHMARK_COMBO_ID`             BIGINT UNSIGNED NOT NULL,  -- v2: combo 엔티티 참조
  `GAME_ID`                        BIGINT UNSIGNED NOT NULL,  -- v2: games 통합 참조
  `RESOLUTION`                     VARCHAR(20) NOT NULL,
  `OPTION_KEY`                     VARCHAR(100) NOT NULL DEFAULT 'UNKNOWN',
  `SOURCE_CONDITION_KEY`           VARCHAR(160) NOT NULL DEFAULT 'UNKNOWN',
  `SAMPLE_COUNT`                   INT         NOT NULL,
  `RAW_FPS_AVG`                    DECIMAL(8,2) NULL,
  `RAW_FPS_MIN`                    INT          NULL,
  `RAW_FPS_MAX`                    INT          NULL,
  `DISPLAY_FPS_MIN`                INT          NULL,
  `DISPLAY_FPS_MAX`                INT          NULL,
  `BEST_QUALITY`                   VARCHAR(30) NOT NULL,
  `COMFORT_GRADE`                  VARCHAR(30) NOT NULL,
  `UPDATED_DT`                     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`BENCHMARK_COMBO_GAME_RESULT_ID`),
  UNIQUE KEY `uk_benchmark_combo_game`        (`BENCHMARK_COMBO_ID`, `GAME_ID`, `RESOLUTION`, `OPTION_KEY`, `SOURCE_CONDITION_KEY`),
  KEY        `idx_benchmark_combo_game_id`    (`GAME_ID`),
  KEY        `idx_benchmark_combo_resolution` (`BENCHMARK_COMBO_ID`, `RESOLUTION`),
  CONSTRAINT `fk_benchmark_combo_game_combo`
    FOREIGN KEY (`BENCHMARK_COMBO_ID`) REFERENCES `benchmark_combos` (`BENCHMARK_COMBO_ID`) ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_benchmark_combo_game_game`
    FOREIGN KEY (`GAME_ID`)            REFERENCES `games`            (`GAME_ID`)            ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 6: 추천 견적 포스트
-- ============================================================
-- v2 변경:
--   recommendation_posts: BENCHMARK_COMBO_ID FK 추가
--   recommendation_post_parts: PART_ID, SUPPLIER_OFFER_ID nullable FK 추가
--   recommendation_post_games: GAME_ID nullable FK 추가
-- 기존 스냅샷 컬럼(PART_NAME, PART_PRICE, GAME_NAME 등)은 유지
-- → 게시 당시 상태를 영구 보존하기 위함

CREATE TABLE IF NOT EXISTS `recommendation_posts` (
  `RECOMMENDATION_POST_ID`   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `SLUG`                     VARCHAR(160) NOT NULL,
  `TITLE`                    VARCHAR(255) NOT NULL,
  `SUBTITLE`                 VARCHAR(255) NULL,
  `SUMMARY`                  TEXT         NULL,
  `BODY_MD`                  MEDIUMTEXT   NULL,
  `STATUS`                   VARCHAR(30)  NOT NULL DEFAULT 'DRAFT',
  `SOURCE_TYPE`              VARCHAR(40)  NOT NULL DEFAULT 'JHS_MANUAL',
  `SOURCE_BENCHMARK_BUILD_ID` BIGINT UNSIGNED NULL,
  `BENCHMARK_COMBO_ID`       BIGINT UNSIGNED NULL,    -- v2 신규: 벤치마크 조합 참조
  `TARGET_BUDGET`            INT          NULL,
  `TOTAL_PRICE`              INT          NOT NULL DEFAULT 0,
  `PURPOSE`                  VARCHAR(40)  NOT NULL DEFAULT 'GAME',
  `CPU_BRAND`                VARCHAR(40)  NULL,
  `GPU_BRAND`                VARCHAR(40)  NULL,
  `CPU_MODEL`                VARCHAR(120) NULL,        -- 표시용 텍스트 유지
  `GPU_MODEL`                VARCHAR(120) NULL,        -- 표시용 텍스트 유지
  `COMBO_TYPE`               VARCHAR(60)  NULL,
  `THUMBNAIL_IMAGE_URL`      VARCHAR(1000) NULL,
  `CASE_PART_NAME`           VARCHAR(700) NULL,
  `POPULARITY_SCORE`         INT          NOT NULL DEFAULT 0,
  `VIEW_COUNT`               INT          NOT NULL DEFAULT 0,
  `CART_COUNT`               INT          NOT NULL DEFAULT 0,
  `ORDER_COUNT`              INT          NOT NULL DEFAULT 0,
  `PUBLISHED_DT`             DATETIME     NULL,
  `RAW_JSON`                 JSON         NULL,
  `CREATED_DT`               DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`               DATETIME     NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`RECOMMENDATION_POST_ID`),
  UNIQUE KEY `uk_recommendation_posts_slug`        (`SLUG`),
  KEY        `idx_recommendation_posts_status_price` (`STATUS`, `TOTAL_PRICE`),
  KEY        `idx_recommendation_posts_combo`       (`CPU_BRAND`, `GPU_BRAND`),
  KEY        `idx_recommendation_posts_popularity`  (`STATUS`, `POPULARITY_SCORE`, `ORDER_COUNT`, `CART_COUNT`),
  KEY        `idx_recommendation_posts_bench_combo` (`BENCHMARK_COMBO_ID`),
  CONSTRAINT `fk_recommendation_posts_combo`
    FOREIGN KEY (`BENCHMARK_COMBO_ID`) REFERENCES `benchmark_combos` (`BENCHMARK_COMBO_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 추천 견적의 부품 목록
-- v2 변경: PART_ID, SUPPLIER_OFFER_ID nullable 추가 (provenance 추적용)
-- 기존 PART_NAME, PART_PRICE, IMAGE_URL 등 스냅샷 컬럼은 삭제 없이 유지
CREATE TABLE IF NOT EXISTS `recommendation_post_parts` (
  `RECOMMENDATION_POST_PART_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `RECOMMENDATION_POST_ID`      BIGINT UNSIGNED NOT NULL,
  `PART_ID`                     BIGINT UNSIGNED NULL,    -- v2 신규: 실제 parts 참조
  `SUPPLIER_OFFER_ID`           BIGINT UNSIGNED NULL,    -- v2 신규: 실제 offer 참조
  `PART_CATEGORY`               VARCHAR(50)  NOT NULL,   -- 스냅샷
  `PART_LABEL`                  VARCHAR(80)  NULL,
  `PART_NAME`                   VARCHAR(700) NOT NULL,   -- 스냅샷
  `PART_PRICE`                  INT          NOT NULL DEFAULT 0,
  `QUANTITY`                    INT          NOT NULL DEFAULT 1,
  `PRODUCT_NO`                  VARCHAR(120) NULL,
  `IMAGE_URL`                   VARCHAR(1000) NULL,
  `SPEC_TEXT`                   TEXT         NULL,
  `SORT_ORDER`                  INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`RECOMMENDATION_POST_PART_ID`),
  KEY `idx_rec_post_parts_post`          (`RECOMMENDATION_POST_ID`, `SORT_ORDER`),
  KEY `idx_rec_post_parts_part`          (`PART_ID`),
  KEY `idx_rec_post_parts_offer`         (`SUPPLIER_OFFER_ID`),
  CONSTRAINT `fk_rec_post_parts_post`
    FOREIGN KEY (`RECOMMENDATION_POST_ID`) REFERENCES `recommendation_posts` (`RECOMMENDATION_POST_ID`) ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_rec_post_parts_part`
    FOREIGN KEY (`PART_ID`)               REFERENCES `parts`                (`PART_ID`)                ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_rec_post_parts_offer`
    FOREIGN KEY (`SUPPLIER_OFFER_ID`)     REFERENCES `supplier_offers`      (`SUPPLIER_OFFER_ID`)      ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 추천 견적의 게임 성능 정보
-- v2 변경: GAME_ID nullable 추가 (통합 games 참조)
-- GAME_NAME 스냅샷 유지 (외래키 없어도 출처 표기 보존)
CREATE TABLE IF NOT EXISTS `recommendation_post_games` (
  `RECOMMENDATION_POST_GAME_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `RECOMMENDATION_POST_ID`      BIGINT UNSIGNED NOT NULL,
  `GAME_ID`                     BIGINT UNSIGNED NULL,    -- v2 신규: 통합 games 참조
  `GAME_NAME`                   VARCHAR(160) NOT NULL,   -- 스냅샷
  `RESOLUTION`                  VARCHAR(20)  NOT NULL DEFAULT 'FHD',
  `QUALITY_PRESET`              VARCHAR(40)  NULL,
  `FPS_MIN`                     INT          NULL,
  `FPS_MAX`                     INT          NULL,
  `COMFORT_GRADE`               VARCHAR(40)  NULL,
  PRIMARY KEY (`RECOMMENDATION_POST_GAME_ID`),
  KEY `idx_rec_post_games_post`   (`RECOMMENDATION_POST_ID`),
  KEY `idx_rec_post_games_game`   (`GAME_ID`),
  KEY `idx_rec_post_games_search` (`GAME_NAME`, `RESOLUTION`),
  CONSTRAINT `fk_rec_post_games_post`
    FOREIGN KEY (`RECOMMENDATION_POST_ID`) REFERENCES `recommendation_posts` (`RECOMMENDATION_POST_ID`) ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_rec_post_games_game`
    FOREIGN KEY (`GAME_ID`)               REFERENCES `games`                (`GAME_ID`)                ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 7: 성능 예측 / 견적 템플릿
-- ============================================================

-- 게임 × CPU/GPU 조합 성능 예측치 (수동 작성 또는 벤치마크 기반)
CREATE TABLE IF NOT EXISTS `performance_estimates` (
  `PERFORMANCE_ESTIMATE_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `GAME_ID`                 BIGINT UNSIGNED NOT NULL,
  `CPU_PART_ID`             BIGINT UNSIGNED NULL,
  `GPU_PART_ID`             BIGINT UNSIGNED NULL,
  `RESOLUTION`              VARCHAR(30) NOT NULL,
  `QUALITY_PRESET`          VARCHAR(30) NOT NULL,
  `FPS_MIN`                 INT         NULL,
  `FPS_MAX`                 INT         NULL,
  `GRADE`                   VARCHAR(30) NOT NULL,
  `SOURCE_SUMMARY`          VARCHAR(255) NULL,
  `VERIFIED_DT`             DATETIME    NULL,
  PRIMARY KEY (`PERFORMANCE_ESTIMATE_ID`),
  KEY `idx_performance_estimates_game` (`GAME_ID`),
  KEY `idx_performance_estimates_cpu`  (`CPU_PART_ID`),
  KEY `idx_performance_estimates_gpu`  (`GPU_PART_ID`),
  CONSTRAINT `fk_performance_estimates_game`
    FOREIGN KEY (`GAME_ID`)      REFERENCES `games` (`GAME_ID`) ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_performance_estimates_cpu`
    FOREIGN KEY (`CPU_PART_ID`)  REFERENCES `parts` (`PART_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_performance_estimates_gpu`
    FOREIGN KEY (`GPU_PART_ID`)  REFERENCES `parts` (`PART_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `quote_templates` (
  `QUOTE_TEMPLATE_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `TEMPLATE_NAME`     VARCHAR(150) NOT NULL,
  `BUDGET_MIN`        INT  NOT NULL DEFAULT 0,
  `BUDGET_MAX`        INT  NOT NULL DEFAULT 0,
  `PURPOSE`           VARCHAR(30) NOT NULL,
  `RESOLUTION`        VARCHAR(30) NULL,
  `PRIORITY_TYPE`     VARCHAR(30) NOT NULL DEFAULT 'VALUE',
  `IS_ACTIVE`         CHAR(1)     NOT NULL DEFAULT 'Y',
  `CREATED_DT`        DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`QUOTE_TEMPLATE_ID`),
  UNIQUE KEY `uq_quote_templates_name`  (`TEMPLATE_NAME`),
  KEY        `idx_quote_templates_match` (`PURPOSE`, `RESOLUTION`, `BUDGET_MIN`, `BUDGET_MAX`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `quote_template_items` (
  `QUOTE_TEMPLATE_ITEM_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `QUOTE_TEMPLATE_ID`      BIGINT UNSIGNED NOT NULL,
  `PART_CATEGORY_ID`       BIGINT UNSIGNED NOT NULL,
  `PART_ID`                BIGINT UNSIGNED NULL,
  `IS_REPLACEABLE`         CHAR(1) NOT NULL DEFAULT 'Y',
  `SORT_ORDER`             INT     NOT NULL DEFAULT 0,
  PRIMARY KEY (`QUOTE_TEMPLATE_ITEM_ID`),
  KEY `idx_quote_template_items_template` (`QUOTE_TEMPLATE_ID`),
  KEY `idx_quote_template_items_category` (`PART_CATEGORY_ID`),
  CONSTRAINT `fk_quote_template_items_template`
    FOREIGN KEY (`QUOTE_TEMPLATE_ID`)  REFERENCES `quote_templates`  (`QUOTE_TEMPLATE_ID`)  ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_quote_template_items_category`
    FOREIGN KEY (`PART_CATEGORY_ID`)   REFERENCES `part_categories`  (`PART_CATEGORY_ID`)   ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_quote_template_items_part`
    FOREIGN KEY (`PART_ID`)            REFERENCES `parts`            (`PART_ID`)            ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 8: 사용자 견적 / 주문
-- ============================================================

CREATE TABLE IF NOT EXISTS `quotes` (
  `QUOTE_ID`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `USER_ID`                 BIGINT UNSIGNED NOT NULL,
  `QUOTE_TEMPLATE_ID`       BIGINT UNSIGNED NULL,
  `STATUS`                  VARCHAR(30)  NOT NULL DEFAULT 'DRAFT',
  `BUDGET_AMOUNT`           INT          NOT NULL DEFAULT 0,
  `BUDGET_SCOPE`            VARCHAR(30)  NOT NULL DEFAULT 'BODY_ONLY',
  `PURPOSE`                 VARCHAR(30)  NOT NULL,
  `RESOLUTION`              VARCHAR(30)  NULL,
  `MONITOR_INPUT`           VARCHAR(150) NULL,
  `TARGET_GAMES_JSON`       JSON         NULL,
  `STORAGE_PREFERENCE`      VARCHAR(50)  NULL,
  `WINDOWS_OPTION`          VARCHAR(30)  NOT NULL DEFAULT 'NONE',
  `PRIORITY_TYPE`           VARCHAR(30)  NOT NULL DEFAULT 'VALUE',
  `AESTHETIC_OPTION`        VARCHAR(50)  NULL,
  `SUBTOTAL_PARTS_PRICE`    INT          NOT NULL DEFAULT 0,
  `ASSEMBLY_FEE`            INT          NOT NULL DEFAULT 0,
  `WINDOWS_FEE`             INT          NOT NULL DEFAULT 0,
  `SHIPPING_FEE`            INT          NOT NULL DEFAULT 0,
  `TOTAL_PRICE`             INT          NOT NULL DEFAULT 0,
  `SNAPSHOT_JSON`           JSON         NULL,
  `LAST_PRICE_CHECKED_DT`   DATETIME     NULL,
  `CREATED_DT`              DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`              DATETIME     NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`QUOTE_ID`),
  KEY `idx_quotes_user_status` (`USER_ID`, `STATUS`),
  KEY `idx_quotes_template`    (`QUOTE_TEMPLATE_ID`),
  CONSTRAINT `fk_quotes_user`
    FOREIGN KEY (`USER_ID`)           REFERENCES `users`           (`USER_ID`)           ON DELETE RESTRICT  ON UPDATE CASCADE,
  CONSTRAINT `fk_quotes_template`
    FOREIGN KEY (`QUOTE_TEMPLATE_ID`) REFERENCES `quote_templates` (`QUOTE_TEMPLATE_ID`) ON DELETE SET NULL  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `quote_items` (
  `QUOTE_ITEM_ID`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `QUOTE_ID`              BIGINT UNSIGNED NULL,
  `PART_CATEGORY_ID`      BIGINT UNSIGNED NOT NULL,
  `PART_ID`               BIGINT UNSIGNED NOT NULL,
  `SUPPLIER_OFFER_ID`     BIGINT UNSIGNED NULL,
  `QUANTITY`              INT NOT NULL DEFAULT 1,
  `CURRENT_PUBLIC_PRICE`  INT NOT NULL DEFAULT 0,
  `SORT_ORDER`            INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`QUOTE_ITEM_ID`),
  KEY `idx_quote_items_quote`    (`QUOTE_ID`),
  KEY `idx_quote_items_category` (`PART_CATEGORY_ID`),
  KEY `idx_quote_items_part`     (`PART_ID`),
  KEY `idx_quote_items_offer`    (`SUPPLIER_OFFER_ID`),
  CONSTRAINT `fk_quote_items_quote`
    FOREIGN KEY (`QUOTE_ID`)          REFERENCES `quotes`          (`QUOTE_ID`)          ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_quote_items_category`
    FOREIGN KEY (`PART_CATEGORY_ID`)  REFERENCES `part_categories` (`PART_CATEGORY_ID`)  ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_quote_items_part`
    FOREIGN KEY (`PART_ID`)           REFERENCES `parts`           (`PART_ID`)           ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_quote_items_offer`
    FOREIGN KEY (`SUPPLIER_OFFER_ID`) REFERENCES `supplier_offers` (`SUPPLIER_OFFER_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 로그인 없이 만든 임시 견적 저장 (브라우저 ID 기반)
CREATE TABLE IF NOT EXISTS `user_cart_quotes` (
  `CART_QUOTE_ID`       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `USER_ID`             BIGINT UNSIGNED NOT NULL,
  `CLIENT_CART_ID`      VARCHAR(120) NULL,
  `TITLE`               VARCHAR(255) NULL,
  `TOTAL_PRICE`         INT          NOT NULL DEFAULT 0,
  `QUOTE_SNAPSHOT_JSON` JSON         NOT NULL,
  `CREATED_DT`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`          DATETIME     NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`CART_QUOTE_ID`),
  UNIQUE KEY `uk_user_cart_client`      (`USER_ID`, `CLIENT_CART_ID`),
  KEY        `idx_user_cart_quotes_user` (`USER_ID`, `CREATED_DT`),
  CONSTRAINT `fk_user_cart_quotes_user`
    FOREIGN KEY (`USER_ID`) REFERENCES `users` (`USER_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `orders` (
  `ORDER_ID`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ORDER_NO`             VARCHAR(50)  NOT NULL,
  `USER_ID`              BIGINT UNSIGNED NOT NULL,
  `QUOTE_ID`             BIGINT UNSIGNED NULL,
  `STATUS`               VARCHAR(40)  NOT NULL DEFAULT 'ADMIN_REVIEW',
  `PRICE_CHECK_STATUS`   VARCHAR(30)  NOT NULL DEFAULT 'NOT_CHECKED',
  `PRICE_CHECKED_DT`     DATETIME     NULL,
  `PRICE_CHANGE_JSON`    JSON         NULL,
  `PRICE_APPROVED_DT`    DATETIME     NULL,
  `RECIPIENT_NAME`       VARCHAR(100) NOT NULL,
  `RECIPIENT_PHONE`      VARCHAR(20)  NOT NULL,
  `POSTAL_CODE`          VARCHAR(20)  NOT NULL,
  `ADDRESS1`             VARCHAR(255) NOT NULL,
  `ADDRESS2`             VARCHAR(255) NULL,
  `DELIVERY_MEMO`        VARCHAR(255) NULL,
  `TRACKING_COMPANY`     VARCHAR(40)  NULL,
  `TRACKING_NO`          VARCHAR(80)  NULL,
  `SUBTOTAL_PARTS_PRICE` INT          NOT NULL DEFAULT 0,
  `ASSEMBLY_FEE`         INT          NOT NULL DEFAULT 0,
  `WINDOWS_FEE`          INT          NOT NULL DEFAULT 0,
  `SHIPPING_FEE`         INT          NOT NULL DEFAULT 0,
  `TOTAL_PRICE`          INT          NOT NULL DEFAULT 0,
  `CREATED_DT`           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`           DATETIME     NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ORDER_ID`),
  UNIQUE KEY `uq_orders_order_no`    (`ORDER_NO`),
  KEY        `idx_orders_user_status` (`USER_ID`, `STATUS`),
  KEY        `idx_orders_quote`       (`QUOTE_ID`),
  CONSTRAINT `fk_orders_user`
    FOREIGN KEY (`USER_ID`)  REFERENCES `users`  (`USER_ID`)  ON DELETE RESTRICT  ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_quote`
    FOREIGN KEY (`QUOTE_ID`) REFERENCES `quotes` (`QUOTE_ID`) ON DELETE SET NULL  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 주문 시점의 부품/가격 불변 스냅샷 (PART_ID/SUPPLIER_OFFER_ID는 soft link)
CREATE TABLE IF NOT EXISTS `order_items` (
  `ORDER_ITEM_ID`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ORDER_ID`                    BIGINT UNSIGNED NOT NULL,
  `CATEGORY_CODE`               VARCHAR(30)  NOT NULL,
  `PART_ID`                     BIGINT UNSIGNED NULL,
  `SUPPLIER_OFFER_ID`           BIGINT UNSIGNED NULL,
  `PART_NAME_SNAPSHOT`          VARCHAR(700) NOT NULL,
  `SUPPLIER_CODE_SNAPSHOT`      VARCHAR(40)  NULL,
  `EXTERNAL_OFFER_ID_SNAPSHOT`  VARCHAR(120) NULL,
  `OFFER_NAME_SNAPSHOT`         VARCHAR(700) NULL,
  `PRODUCT_URL_SNAPSHOT`        VARCHAR(1000) NULL,
  `QUANTITY`                    INT NOT NULL DEFAULT 1,
  `PUBLIC_PRICE`                INT NOT NULL DEFAULT 0,
  `TOTAL_PUBLIC_PRICE`          INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`ORDER_ITEM_ID`),
  KEY `idx_order_items_order` (`ORDER_ID`),
  KEY `idx_order_items_part`  (`PART_ID`),
  KEY `idx_order_items_offer` (`SUPPLIER_OFFER_ID`),
  CONSTRAINT `fk_order_items_order`
    FOREIGN KEY (`ORDER_ID`)          REFERENCES `orders`          (`ORDER_ID`)          ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_part`
    FOREIGN KEY (`PART_ID`)           REFERENCES `parts`           (`PART_ID`)           ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_offer`
    FOREIGN KEY (`SUPPLIER_OFFER_ID`) REFERENCES `supplier_offers` (`SUPPLIER_OFFER_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payments` (
  `PAYMENT_ID`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ORDER_ID`             BIGINT UNSIGNED NOT NULL,
  `METHOD`               VARCHAR(30) NOT NULL DEFAULT 'BANK_TRANSFER',
  `STATUS`               VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  `AMOUNT`               INT         NOT NULL DEFAULT 0,
  `DEPOSITOR_NAME`       VARCHAR(80) NULL,
  `CONFIRMED_BY_USER_ID` BIGINT UNSIGNED NULL,
  `CONFIRMED_DT`         DATETIME    NULL,
  `MEMO`                 VARCHAR(255) NULL,
  PRIMARY KEY (`PAYMENT_ID`),
  KEY `idx_payments_order`  (`ORDER_ID`),
  KEY `idx_payments_status` (`STATUS`),
  CONSTRAINT `fk_payments_order`
    FOREIGN KEY (`ORDER_ID`)             REFERENCES `orders` (`ORDER_ID`) ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_payments_confirmed_by`
    FOREIGN KEY (`CONFIRMED_BY_USER_ID`) REFERENCES `users`  (`USER_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `order_status_histories` (
  `ORDER_STATUS_HISTORY_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ORDER_ID`                BIGINT UNSIGNED NOT NULL,
  `FROM_STATUS`             VARCHAR(40) NULL,
  `TO_STATUS`               VARCHAR(40) NOT NULL,
  `ACTOR_USER_ID`           BIGINT UNSIGNED NULL,
  `MEMO`                    VARCHAR(255) NULL,
  `CREATED_DT`              DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ORDER_STATUS_HISTORY_ID`),
  KEY `idx_order_status_histories_order` (`ORDER_ID`),
  CONSTRAINT `fk_order_status_histories_order`
    FOREIGN KEY (`ORDER_ID`)       REFERENCES `orders` (`ORDER_ID`) ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_order_status_histories_actor`
    FOREIGN KEY (`ACTOR_USER_ID`)  REFERENCES `users`  (`USER_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DOMAIN 9: 사용자 / 인증
-- ============================================================

CREATE TABLE IF NOT EXISTS `users` (
  `USER_ID`     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `LOGIN_ID`    VARCHAR(50)  NULL,
  `PASSWORD_TEXT` VARCHAR(100) NULL,
  `EMAIL`       VARCHAR(100) NULL,
  `USER_NAME`   VARCHAR(100) NOT NULL,
  `NICKNAME`    VARCHAR(100) NULL,
  `PHONE`       VARCHAR(20)  NULL,
  `ROLE`        VARCHAR(20)  NOT NULL DEFAULT 'USER',
  `STATUS`      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
  `CREATED_DT`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_DT`  DATETIME     NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `DELETED_DT`  DATETIME     NULL,
  PRIMARY KEY (`USER_ID`),
  UNIQUE KEY `uq_users_login_id` (`LOGIN_ID`),
  UNIQUE KEY `uq_users_email`    (`EMAIL`),
  KEY        `idx_users_status`  (`STATUS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `social_accounts` (
  `SOCIAL_ACCOUNT_ID`  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `USER_ID`            BIGINT UNSIGNED NOT NULL,
  `PROVIDER`           VARCHAR(20)  NOT NULL,
  `PROVIDER_USER_ID`   VARCHAR(100) NOT NULL,
  `EMAIL`              VARCHAR(100) NULL,
  `PROFILE_JSON`       JSON         NULL,
  `CREATED_DT`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SOCIAL_ACCOUNT_ID`),
  UNIQUE KEY `uq_social_accounts_provider_user` (`PROVIDER`, `PROVIDER_USER_ID`),
  KEY        `idx_social_accounts_user_id`       (`USER_ID`),
  CONSTRAINT `fk_social_accounts_user`
    FOREIGN KEY (`USER_ID`) REFERENCES `users` (`USER_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
