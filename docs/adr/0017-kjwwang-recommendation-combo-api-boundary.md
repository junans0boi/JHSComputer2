# 견적왕 추천 조합 API 경계

작성일: 2026-09-10

## 결정

견적왕의 `RecommendationContextSnapshot`을 고객용 CPU/GPU 조합으로 집계하는
공개 API를 실제 FPS API와 별도 경계로 제공한다.

- 목록: `GET /api/benchmarks/recommendation-combos`
- 상세: `GET /api/benchmarks/recommendation-combos/:comboRef`
- 현재 목록의 원천은 `KJWWANG`으로 고정하고 응답에도 출처를 명시한다.
- 조합 목록은 정규화 CPU/GPU별 `RecommendationComboGroup`을 반환한다.
- 응답의 `publicComboKey`가 정규화된 고객용 식별자이며, `publicComboRef`는 상세
  조회를 위한 불투명한 서버 참조값이다.
- 상세는 게임·해상도·등급·플랫폼별 추천 맥락을 반환한다.
- 추천 맥락의 존재를 실제 FPS 관측값으로 승격하지 않는다.
- 벤치마크 화면은 FPS 영역과 별도의 추천 조합 영역에서 이 API를 소비한다. 같은
  CPU/GPU라도 추천 맥락과 FPS 관측값을 하나의 표나 하나의 수치로 합치지 않는다.

## 이유

기존 `/benchmarks/combos/:comboKey/games`는 `benchmark_combo_game_results`의 실제
FPS 관측값만 조회한다. 견적왕의 추천 조합은 `benchmark_builds`에 저장되지만 FPS
관측값이 아니므로 기존 API에 억지로 연결하면 “추천 조합이 있으니 FPS가 있다”는
오해가 생긴다. 별도 API는 두 의미를 분리하면서도 수집 데이터를 화면에 제공한다.

## 결과

목록 응답의 `recommendationCount`는 전체 견적 개수가 아니라 최신 추천 맥락
스냅샷 수다. `gameCount`는 추천 맥락이 확인된 게임 수이며, `latestCapturedAt`은
그룹 안에서 가장 최근 확인한 시각이다. 상세 응답은 원본 URL·출처·확인 시각을
보존해 고객용 요약과 원본 근거를 함께 다룰 수 있게 한다.
