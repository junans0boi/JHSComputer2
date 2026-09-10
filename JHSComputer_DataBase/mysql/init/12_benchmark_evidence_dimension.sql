-- ComputerBase 원문 벤치마크와 견적왕 원문 추천값을 같은 FPS 테이블에 저장하되
-- 숫자의 근거 유형을 잃지 않는다.

ALTER TABLE `benchmark_fps_results`
  ADD COLUMN IF NOT EXISTS `EVIDENCE_TYPE` VARCHAR(40) NOT NULL DEFAULT 'SOURCE_BENCHMARK' AFTER `SOURCE_CONDITION_KEY`;

ALTER TABLE `benchmark_combo_game_results`
  ADD COLUMN IF NOT EXISTS `EVIDENCE_TYPE` VARCHAR(40) NOT NULL DEFAULT 'SOURCE_BENCHMARK' AFTER `SOURCE_CONDITION_KEY`;

-- 기존 견적왕 행은 기본값으로 들어간 SOURCE_BENCHMARK가 아니라
-- 견적 상세 원문의 추천값이다. 원본 출처를 기준으로 안전하게 보정한다.
UPDATE `benchmark_fps_results` r
JOIN `benchmark_builds` b ON b.`BENCHMARK_BUILD_ID` = r.`BENCHMARK_BUILD_ID`
JOIN `benchmark_sources` s ON s.`BENCHMARK_SOURCE_ID` = b.`BENCHMARK_SOURCE_ID`
SET r.`EVIDENCE_TYPE` = 'SOURCE_RECOMMENDATION'
WHERE s.`SOURCE_CODE` = 'KJWWANG';

UPDATE `benchmark_combo_game_results` r
JOIN `benchmark_builds` b ON b.`COMBO_KEY` = r.`COMBO_KEY`
  AND b.`EXTERNAL_BUILD_ID` = r.`SOURCE_CONDITION_KEY`
JOIN `benchmark_sources` s ON s.`BENCHMARK_SOURCE_ID` = b.`BENCHMARK_SOURCE_ID`
SET r.`EVIDENCE_TYPE` = 'SOURCE_RECOMMENDATION'
WHERE s.`SOURCE_CODE` = 'KJWWANG';

ALTER TABLE `benchmark_fps_results`
  DROP INDEX `uk_benchmark_fps`,
  ADD UNIQUE KEY `uk_benchmark_fps` (`BENCHMARK_BUILD_ID`, `BENCHMARK_GAME_ID`, `RESOLUTION`, `OPTION_KEY`, `SOURCE_CONDITION_KEY`, `EVIDENCE_TYPE`);

ALTER TABLE `benchmark_combo_game_results`
  DROP INDEX `uk_benchmark_combo_game`,
  ADD UNIQUE KEY `uk_benchmark_combo_game` (`COMBO_KEY`, `BENCHMARK_GAME_ID`, `RESOLUTION`, `OPTION_KEY`, `SOURCE_CONDITION_KEY`, `EVIDENCE_TYPE`);
