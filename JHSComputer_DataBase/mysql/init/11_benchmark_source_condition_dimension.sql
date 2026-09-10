-- 동일 CPU·GPU·게임·해상도·옵션이라도 원본 기사/테스트 조건이 다르면
-- 하나의 평균으로 섞지 않도록 원본 조건 식별자를 보존한다.

ALTER TABLE `benchmark_fps_results`
  ADD COLUMN `SOURCE_CONDITION_KEY` VARCHAR(160) NOT NULL DEFAULT 'UNKNOWN' AFTER `OPTION_KEY`;

ALTER TABLE `benchmark_combo_game_results`
  ADD COLUMN `SOURCE_CONDITION_KEY` VARCHAR(160) NOT NULL DEFAULT 'UNKNOWN' AFTER `OPTION_KEY`;

ALTER TABLE `benchmark_fps_results`
  DROP INDEX `uk_benchmark_fps`,
  ADD UNIQUE KEY `uk_benchmark_fps` (`BENCHMARK_BUILD_ID`, `BENCHMARK_GAME_ID`, `RESOLUTION`, `OPTION_KEY`, `SOURCE_CONDITION_KEY`);

ALTER TABLE `benchmark_combo_game_results`
  DROP INDEX `uk_benchmark_combo_game`,
  ADD UNIQUE KEY `uk_benchmark_combo_game` (`COMBO_KEY`, `BENCHMARK_GAME_ID`, `RESOLUTION`, `OPTION_KEY`, `SOURCE_CONDITION_KEY`);
