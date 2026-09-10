-- 기존 v1 benchmark 테이블에 게임 옵션 차원을 추가한다.
-- 기존 행은 RAW_OPTION_PRESET/BEST_QUALITY를 OPTION_KEY로 보존하고,
-- 이후 동일 게임·해상도의 서로 다른 옵션을 덮어쓰지 않는다.

ALTER TABLE `benchmark_fps_results`
  ADD COLUMN `OPTION_KEY` VARCHAR(100) NOT NULL DEFAULT 'UNKNOWN' AFTER `RESOLUTION`;

UPDATE `benchmark_fps_results`
SET `OPTION_KEY` = COALESCE(NULLIF(`RAW_OPTION_PRESET`, ''), NULLIF(`NORMALIZED_QUALITY`, ''), 'UNKNOWN');

ALTER TABLE `benchmark_fps_results`
  DROP INDEX `uk_benchmark_fps`,
  ADD UNIQUE KEY `uk_benchmark_fps` (`BENCHMARK_BUILD_ID`, `BENCHMARK_GAME_ID`, `RESOLUTION`, `OPTION_KEY`);

ALTER TABLE `benchmark_combo_game_results`
  ADD COLUMN `OPTION_KEY` VARCHAR(100) NOT NULL DEFAULT 'UNKNOWN' AFTER `RESOLUTION`;

UPDATE `benchmark_combo_game_results`
SET `OPTION_KEY` = COALESCE(NULLIF(`BEST_QUALITY`, ''), 'UNKNOWN');

ALTER TABLE `benchmark_combo_game_results`
  DROP INDEX `uk_benchmark_combo_game`,
  ADD UNIQUE KEY `uk_benchmark_combo_game` (`COMBO_KEY`, `BENCHMARK_GAME_ID`, `RESOLUTION`, `OPTION_KEY`);
