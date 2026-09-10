-- ============================================================
-- JHSComputer2 DB Migration: v1 → v2
-- 작성일: 2026-09-03
--
-- ⚠ 실행 전 반드시:
--   1. mysqldump로 전체 백업
--   2. 개발 DB에서 먼저 검증
--   3. 운영 적용 시 서비스 점검 모드 후 실행
--
-- 실행 순서:
--   STEP 1  중복 데이터 정리 (supplier_products/offers)
--   STEP 2  신규 테이블 생성
--   STEP 3  benchmark_games → games 마이그레이션
--   STEP 4  benchmark_hardware_models 생성
--   STEP 5  benchmark_combos 생성
--   STEP 6  benchmark_builds 컬럼 교체
--   STEP 7  benchmark_fps_results.BENCHMARK_GAME_ID → GAME_ID
--   STEP 8  benchmark_combo_game_results 재구성
--   STEP 9  recommendation_posts BENCHMARK_COMBO_ID 채우기
--   STEP 10 recommendation_post_parts PART_ID/SUPPLIER_OFFER_ID 추가
--   STEP 11 recommendation_post_games GAME_ID 추가
--   STEP 12 supplier_products/offers 누락 유니크키 복구
--   STEP 13 benchmark_games 테이블 제거
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SESSION group_concat_max_len = 1048576;

-- ============================================================
-- STEP 1: supplier_products 중복 정리
-- ============================================================
-- 중복 기준: (SUPPLIER_ID, EXTERNAL_PRODUCT_ID) 동일 → 최신 행(MAX ID)만 남김

CREATE TEMPORARY TABLE tmp_supplier_products_keep AS
  SELECT MAX(SUPPLIER_PRODUCT_ID) AS keep_id
  FROM supplier_products
  GROUP BY SUPPLIER_ID, EXTERNAL_PRODUCT_ID;

-- 중복 행에 연결된 offer, price 먼저 이동 (keep_id 행으로 재연결)
-- (같은 외부ID 중복 행은 offer도 중복 — offer도 같이 정리)
CREATE TEMPORARY TABLE tmp_offer_keep AS
  SELECT MAX(SUPPLIER_OFFER_ID) AS keep_id
  FROM supplier_offers
  GROUP BY SUPPLIER_PRODUCT_ID, EXTERNAL_OFFER_ID;

DELETE FROM supplier_offer_prices
WHERE SUPPLIER_OFFER_ID NOT IN (SELECT keep_id FROM tmp_offer_keep);

DELETE FROM supplier_offers
WHERE SUPPLIER_OFFER_ID NOT IN (SELECT keep_id FROM tmp_offer_keep);

DELETE FROM supplier_products
WHERE SUPPLIER_PRODUCT_ID NOT IN (SELECT keep_id FROM tmp_supplier_products_keep);

DROP TEMPORARY TABLE tmp_supplier_products_keep;
DROP TEMPORARY TABLE tmp_offer_keep;

-- ============================================================
-- STEP 2: 신규 테이블 생성
-- ============================================================

CREATE TABLE IF NOT EXISTS `game_aliases` (
  `GAME_ALIAS_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `GAME_ID`       BIGINT UNSIGNED NOT NULL,
  `SOURCE`        VARCHAR(50)  NOT NULL,
  `ALIAS_NAME`    VARCHAR(160) NOT NULL,
  `ALIAS_SLUG`    VARCHAR(160) NOT NULL,
  PRIMARY KEY (`GAME_ALIAS_ID`),
  UNIQUE KEY `uq_game_aliases_source_slug` (`SOURCE`, `ALIAS_SLUG`),
  KEY        `idx_game_aliases_game`       (`GAME_ID`),
  CONSTRAINT `fk_game_aliases_game`
    FOREIGN KEY (`GAME_ID`) REFERENCES `games` (`GAME_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `benchmark_hardware_models` (
  `BENCHMARK_MODEL_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `DEVICE_TYPE`        CHAR(3)      NOT NULL,
  `MODEL_KEY`          VARCHAR(100) NOT NULL,
  `DISPLAY_NAME`       VARCHAR(150) NOT NULL,
  `PART_ID`            BIGINT UNSIGNED NULL,
  `MATCH_STATUS`       VARCHAR(30)  NOT NULL DEFAULT 'UNMATCHED',
  `CREATED_DT`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BENCHMARK_MODEL_ID`),
  UNIQUE KEY `uq_benchmark_hardware_type_key` (`DEVICE_TYPE`, `MODEL_KEY`),
  KEY        `idx_benchmark_hardware_part`    (`PART_ID`),
  CONSTRAINT `fk_benchmark_hardware_part`
    FOREIGN KEY (`PART_ID`) REFERENCES `parts` (`PART_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `benchmark_combos` (
  `BENCHMARK_COMBO_ID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `COMBO_KEY`          VARCHAR(160) NOT NULL,
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

-- ============================================================
-- STEP 3: benchmark_games → games 마이그레이션
-- ============================================================
-- games 테이블에 benchmark_games 컬럼 추가 (GENRE, UPDATED_DT)
ALTER TABLE `games`
  ADD COLUMN IF NOT EXISTS `GENRE`      VARCHAR(50) NULL AFTER `SLUG`,
  ADD COLUMN IF NOT EXISTS `UPDATED_DT` DATETIME    NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP AFTER `CREATED_DT`,
  MODIFY COLUMN `GAME_NAME` VARCHAR(160) NOT NULL;

-- benchmark_games의 게임명 길이가 더 크므로 먼저 컬럼 확장
-- (이미 games.GAME_NAME = VARCHAR(160)이면 스킵됨)

-- benchmark_games 데이터를 games로 삽입
-- SLUG 충돌 시 games의 기존 항목 우선 (ON DUPLICATE KEY IGNORE)
INSERT IGNORE INTO `games` (`GAME_NAME`, `SLUG`, `IS_ACTIVE`, `CREATED_DT`)
SELECT `GAME_NAME`, `SLUG`, `IS_ACTIVE`, `CREATED_DT`
FROM `benchmark_games`;

-- 삽입된 benchmark_games 항목을 game_aliases에 기록
-- (원본 slug와 게임명을 출처별로 보존)
INSERT IGNORE INTO `game_aliases` (`GAME_ID`, `SOURCE`, `ALIAS_NAME`, `ALIAS_SLUG`)
SELECT g.GAME_ID, 'BENCHMARK_IMPORT', bg.GAME_NAME, bg.SLUG
FROM benchmark_games bg
JOIN games g ON g.SLUG = bg.SLUG;

-- ============================================================
-- STEP 4: benchmark_hardware_models 생성
-- ============================================================
-- benchmark_builds.CPU_MODEL / GPU_MODEL 에서 고유 모델 추출

INSERT IGNORE INTO `benchmark_hardware_models` (`DEVICE_TYPE`, `MODEL_KEY`, `DISPLAY_NAME`)
SELECT DISTINCT 'CPU', CPU_MODEL, CPU_MODEL
FROM benchmark_builds
WHERE CPU_MODEL IS NOT NULL AND CPU_MODEL != '';

INSERT IGNORE INTO `benchmark_hardware_models` (`DEVICE_TYPE`, `MODEL_KEY`, `DISPLAY_NAME`)
SELECT DISTINCT 'GPU', GPU_MODEL, GPU_MODEL
FROM benchmark_builds
WHERE GPU_MODEL IS NOT NULL AND GPU_MODEL != '';

-- ============================================================
-- STEP 5: benchmark_combos 생성
-- ============================================================

INSERT IGNORE INTO `benchmark_combos` (`COMBO_KEY`, `CPU_MODEL_ID`, `GPU_MODEL_ID`)
SELECT
  b.COMBO_KEY,
  cpu.BENCHMARK_MODEL_ID,
  gpu.BENCHMARK_MODEL_ID
FROM (
  SELECT DISTINCT COMBO_KEY, CPU_MODEL, GPU_MODEL
  FROM benchmark_builds
) b
JOIN benchmark_hardware_models cpu ON cpu.DEVICE_TYPE = 'CPU' AND cpu.MODEL_KEY = b.CPU_MODEL
JOIN benchmark_hardware_models gpu ON gpu.DEVICE_TYPE = 'GPU' AND gpu.MODEL_KEY = b.GPU_MODEL;

-- ============================================================
-- STEP 6: benchmark_builds 컬럼 교체
-- ============================================================
-- BENCHMARK_COMBO_ID 컬럼 추가 후 데이터 채우기

ALTER TABLE `benchmark_builds`
  ADD COLUMN IF NOT EXISTS `BENCHMARK_COMBO_ID` BIGINT UNSIGNED NULL AFTER `BENCHMARK_SOURCE_ID`;

UPDATE `benchmark_builds` b
JOIN `benchmark_combos` c ON c.COMBO_KEY = b.COMBO_KEY
SET b.BENCHMARK_COMBO_ID = c.BENCHMARK_COMBO_ID;

-- 모든 행에 COMBO_ID가 채워졌는지 확인 후 NOT NULL + FK 적용
-- (아래는 검증 쿼리 — 실행 후 0이면 진행)
-- SELECT COUNT(*) FROM benchmark_builds WHERE BENCHMARK_COMBO_ID IS NULL;

ALTER TABLE `benchmark_builds`
  MODIFY COLUMN `BENCHMARK_COMBO_ID` BIGINT UNSIGNED NOT NULL,
  ADD CONSTRAINT `fk_benchmark_build_combo`
    FOREIGN KEY (`BENCHMARK_COMBO_ID`) REFERENCES `benchmark_combos` (`BENCHMARK_COMBO_ID`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- 구 텍스트 컬럼 제거 (COMBO_KEY, CPU_MODEL, GPU_MODEL)
ALTER TABLE `benchmark_builds`
  DROP COLUMN IF EXISTS `COMBO_KEY`,
  DROP COLUMN IF EXISTS `CPU_MODEL`,
  DROP COLUMN IF EXISTS `GPU_MODEL`;

-- 구 인덱스 제거 (이미 삭제됐으면 무시됨)
-- DROP INDEX idx_benchmark_build_combo ON benchmark_builds; (컬럼 삭제 시 자동 제거)

-- 새 인덱스 추가
ALTER TABLE `benchmark_builds`
  ADD KEY IF NOT EXISTS `idx_benchmark_build_combo` (`BENCHMARK_COMBO_ID`);

-- ============================================================
-- STEP 7: benchmark_fps_results BENCHMARK_GAME_ID → GAME_ID
-- ============================================================
-- benchmark_games.BENCHMARK_GAME_ID와 games.GAME_ID 매핑 (slug 기준)

ALTER TABLE `benchmark_fps_results`
  ADD COLUMN IF NOT EXISTS `GAME_ID` BIGINT UNSIGNED NULL AFTER `BENCHMARK_BUILD_ID`;

UPDATE `benchmark_fps_results` f
JOIN `benchmark_games` bg ON bg.BENCHMARK_GAME_ID = f.BENCHMARK_GAME_ID
JOIN `games` g            ON g.SLUG = bg.SLUG
SET f.GAME_ID = g.GAME_ID;

-- 0이어야 진행
-- SELECT COUNT(*) FROM benchmark_fps_results WHERE GAME_ID IS NULL;

-- 기존 FK 제거
ALTER TABLE `benchmark_fps_results`
  DROP FOREIGN KEY IF EXISTS `fk_benchmark_fps_game`;

ALTER TABLE `benchmark_fps_results`
  MODIFY COLUMN `GAME_ID` BIGINT UNSIGNED NOT NULL,
  DROP COLUMN IF EXISTS `BENCHMARK_GAME_ID`,
  ADD CONSTRAINT `fk_benchmark_fps_game`
    FOREIGN KEY (`GAME_ID`) REFERENCES `games` (`GAME_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- v1의 옵션·원본 테스트 조건 차원을 v2에서도 유지한다.
ALTER TABLE `benchmark_fps_results`
  ADD COLUMN IF NOT EXISTS `OPTION_KEY` VARCHAR(100) NOT NULL DEFAULT 'UNKNOWN' AFTER `RESOLUTION`,
  ADD COLUMN IF NOT EXISTS `SOURCE_CONDITION_KEY` VARCHAR(160) NOT NULL DEFAULT 'UNKNOWN' AFTER `OPTION_KEY`;

ALTER TABLE `benchmark_fps_results`
  DROP INDEX IF EXISTS `uk_benchmark_fps`,
  ADD UNIQUE KEY `uk_benchmark_fps` (`BENCHMARK_BUILD_ID`, `GAME_ID`, `RESOLUTION`, `OPTION_KEY`, `SOURCE_CONDITION_KEY`);

-- ============================================================
-- STEP 8: benchmark_combo_game_results 재구성
-- ============================================================

ALTER TABLE `benchmark_combo_game_results`
  ADD COLUMN IF NOT EXISTS `BENCHMARK_COMBO_ID` BIGINT UNSIGNED NULL AFTER `BENCHMARK_COMBO_GAME_RESULT_ID`,
  ADD COLUMN IF NOT EXISTS `GAME_ID`             BIGINT UNSIGNED NULL AFTER `BENCHMARK_COMBO_ID`;

UPDATE `benchmark_combo_game_results` r
JOIN `benchmark_combos` c ON c.COMBO_KEY = r.COMBO_KEY
SET r.BENCHMARK_COMBO_ID = c.BENCHMARK_COMBO_ID;

UPDATE `benchmark_combo_game_results` r
JOIN `benchmark_games` bg ON bg.BENCHMARK_GAME_ID = r.BENCHMARK_GAME_ID
JOIN `games` g            ON g.SLUG = bg.SLUG
SET r.GAME_ID = g.GAME_ID;

-- 검증 후 진행
-- SELECT COUNT(*) FROM benchmark_combo_game_results WHERE BENCHMARK_COMBO_ID IS NULL OR GAME_ID IS NULL;

-- 기존 FK/UK 제거
ALTER TABLE `benchmark_combo_game_results`
  DROP FOREIGN KEY IF EXISTS `fk_benchmark_combo_game`,
  DROP INDEX     IF EXISTS `uk_benchmark_combo_game`,
  DROP INDEX     IF EXISTS `idx_benchmark_combo`;

ALTER TABLE `benchmark_combo_game_results`
  MODIFY COLUMN `BENCHMARK_COMBO_ID` BIGINT UNSIGNED NOT NULL,
  MODIFY COLUMN `GAME_ID`            BIGINT UNSIGNED NOT NULL,
  DROP COLUMN IF EXISTS `COMBO_KEY`,
  DROP COLUMN IF EXISTS `CPU_MODEL`,
  DROP COLUMN IF EXISTS `GPU_MODEL`,
  DROP COLUMN IF EXISTS `BENCHMARK_GAME_ID`,
  ADD COLUMN IF NOT EXISTS `OPTION_KEY` VARCHAR(100) NOT NULL DEFAULT 'UNKNOWN' AFTER `RESOLUTION`,
  ADD COLUMN IF NOT EXISTS `SOURCE_CONDITION_KEY` VARCHAR(160) NOT NULL DEFAULT 'UNKNOWN' AFTER `OPTION_KEY`,
  ADD UNIQUE KEY `uk_benchmark_combo_game`        (`BENCHMARK_COMBO_ID`, `GAME_ID`, `RESOLUTION`, `OPTION_KEY`, `SOURCE_CONDITION_KEY`),
  ADD KEY        `idx_benchmark_combo_game_id`    (`GAME_ID`),
  ADD KEY        `idx_benchmark_combo_resolution` (`BENCHMARK_COMBO_ID`, `RESOLUTION`),
  ADD CONSTRAINT `fk_benchmark_combo_game_combo`
    FOREIGN KEY (`BENCHMARK_COMBO_ID`) REFERENCES `benchmark_combos` (`BENCHMARK_COMBO_ID`) ON DELETE CASCADE  ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_benchmark_combo_game_game`
    FOREIGN KEY (`GAME_ID`)            REFERENCES `games`            (`GAME_ID`)            ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================================
-- STEP 9: recommendation_posts BENCHMARK_COMBO_ID 추가
-- ============================================================

ALTER TABLE `recommendation_posts`
  ADD COLUMN IF NOT EXISTS `BENCHMARK_COMBO_ID` BIGINT UNSIGNED NULL AFTER `SOURCE_BENCHMARK_BUILD_ID`;

-- SOURCE_BENCHMARK_BUILD_ID가 있는 포스트는 해당 build의 combo로 연결
UPDATE `recommendation_posts` p
JOIN `benchmark_builds` b ON b.BENCHMARK_BUILD_ID = p.SOURCE_BENCHMARK_BUILD_ID
SET p.BENCHMARK_COMBO_ID = b.BENCHMARK_COMBO_ID
WHERE p.SOURCE_BENCHMARK_BUILD_ID IS NOT NULL;

ALTER TABLE `recommendation_posts`
  ADD KEY IF NOT EXISTS `idx_recommendation_posts_bench_combo` (`BENCHMARK_COMBO_ID`),
  ADD CONSTRAINT IF NOT EXISTS `fk_recommendation_posts_combo`
    FOREIGN KEY (`BENCHMARK_COMBO_ID`) REFERENCES `benchmark_combos` (`BENCHMARK_COMBO_ID`)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- STEP 10: recommendation_post_parts PART_ID, SUPPLIER_OFFER_ID 추가
-- ============================================================

ALTER TABLE `recommendation_post_parts`
  ADD COLUMN IF NOT EXISTS `PART_ID`           BIGINT UNSIGNED NULL AFTER `RECOMMENDATION_POST_ID`,
  ADD COLUMN IF NOT EXISTS `SUPPLIER_OFFER_ID` BIGINT UNSIGNED NULL AFTER `PART_ID`,
  ADD KEY IF NOT EXISTS `idx_rec_post_parts_part`  (`PART_ID`),
  ADD KEY IF NOT EXISTS `idx_rec_post_parts_offer` (`SUPPLIER_OFFER_ID`),
  ADD CONSTRAINT IF NOT EXISTS `fk_rec_post_parts_part`
    FOREIGN KEY (`PART_ID`)           REFERENCES `parts`          (`PART_ID`)           ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT IF NOT EXISTS `fk_rec_post_parts_offer`
    FOREIGN KEY (`SUPPLIER_OFFER_ID`) REFERENCES `supplier_offers` (`SUPPLIER_OFFER_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- PART_ID는 PRODUCT_NO (compuzone 외부 코드)로 매칭 가능 시 채울 수 있음
-- 아래는 참고용 예시 (실제 매칭 로직은 에이전트에서 처리 권장)
-- UPDATE recommendation_post_parts rpp
-- JOIN supplier_products sp ON sp.EXTERNAL_PRODUCT_ID = rpp.PRODUCT_NO
-- JOIN supplier_offers so   ON so.SUPPLIER_PRODUCT_ID = sp.SUPPLIER_PRODUCT_ID AND so.IS_DEFAULT = 'Y'
-- SET rpp.PART_ID = so.PART_ID, rpp.SUPPLIER_OFFER_ID = so.SUPPLIER_OFFER_ID
-- WHERE rpp.PART_ID IS NULL AND rpp.PRODUCT_NO IS NOT NULL;

-- ============================================================
-- STEP 11: recommendation_post_games GAME_ID 추가
-- ============================================================

ALTER TABLE `recommendation_post_games`
  ADD COLUMN IF NOT EXISTS `GAME_ID` BIGINT UNSIGNED NULL AFTER `RECOMMENDATION_POST_ID`,
  ADD KEY IF NOT EXISTS `idx_rec_post_games_game` (`GAME_ID`),
  ADD CONSTRAINT IF NOT EXISTS `fk_rec_post_games_game`
    FOREIGN KEY (`GAME_ID`) REFERENCES `games` (`GAME_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- GAME_NAME 텍스트로 games 매칭 시도
UPDATE `recommendation_post_games` rpg
JOIN `games` g ON g.GAME_NAME = rpg.GAME_NAME
SET rpg.GAME_ID = g.GAME_ID
WHERE rpg.GAME_ID IS NULL;

-- slug 기반 추가 매칭 (game_aliases 통해)
UPDATE `recommendation_post_games` rpg
JOIN `game_aliases` ga ON ga.ALIAS_NAME = rpg.GAME_NAME
SET rpg.GAME_ID = ga.GAME_ID
WHERE rpg.GAME_ID IS NULL;

-- ============================================================
-- STEP 12: supplier_products / supplier_offers 유니크키 복구
-- ============================================================
-- STEP 1에서 중복 제거 완료 후 유니크키 추가

ALTER TABLE `supplier_products`
  ADD UNIQUE KEY IF NOT EXISTS `uq_supplier_products_external` (`SUPPLIER_ID`, `EXTERNAL_PRODUCT_ID`);

ALTER TABLE `supplier_offers`
  ADD UNIQUE KEY IF NOT EXISTS `uq_supplier_offers_external` (`SUPPLIER_PRODUCT_ID`, `EXTERNAL_OFFER_ID`);

-- ============================================================
-- STEP 13: benchmark_games 제거
-- ============================================================
-- 이 시점에서 benchmark_fps_results와 benchmark_combo_game_results는
-- 이미 games.GAME_ID를 참조하므로 benchmark_games에 대한 FK가 없음

DROP TABLE IF EXISTS `benchmark_games`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 완료 검증 쿼리
-- ============================================================
SELECT 'benchmark_builds without combo' AS check_name, COUNT(*) AS cnt
FROM benchmark_builds WHERE BENCHMARK_COMBO_ID IS NULL
UNION ALL
SELECT 'benchmark_fps_results without game', COUNT(*)
FROM benchmark_fps_results WHERE GAME_ID IS NULL
UNION ALL
SELECT 'benchmark_combo_results without combo', COUNT(*)
FROM benchmark_combo_game_results WHERE BENCHMARK_COMBO_ID IS NULL
UNION ALL
SELECT 'benchmark_combo_results without game', COUNT(*)
FROM benchmark_combo_game_results WHERE GAME_ID IS NULL
UNION ALL
SELECT 'supplier_products duplicates', COUNT(*) - COUNT(DISTINCT CONCAT(SUPPLIER_ID,'_',EXTERNAL_PRODUCT_ID))
FROM supplier_products;
