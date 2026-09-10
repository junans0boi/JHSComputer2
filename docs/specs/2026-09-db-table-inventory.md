# 2026-09 DB 테이블 역할 감사

작성일: 2026-09-03
대상: `jhs_computer_dev` / 서버 API와 Agent가 실제로 사용하는 스키마

## 결론

현재 테이블은 같은 역할의 중복 테이블이라기보다 네 도메인으로 나뉜다.

1. 컴퓨존 상품·가격·호환성의 운영 데이터
2. 견적·추천 콘텐츠
3. 게임/벤치마크 데이터
4. 아직 화면이 연결되지 않은 사용자·주문 데이터

따라서 이번 작업에서는 빈 테이블을 삭제하지 않았다. 빈 테이블 중 `users`·주문 계열은 향후 기능을 위한 계획 테이블이고, 벤치마크 계열은 이번 작업으로 실제 데이터가 채워졌다. 다만 기존 `DB_TABLE_DEFINITION.md`가 28개 테이블이라고 설명하는 것과 현재 초기화 SQL의 실제 테이블 수가 다른 것은 문서 부채다. 이후 스키마 변경 시 초기화 SQL을 기준으로 정의서를 갱신해야 한다.

## 기준 스키마와 소유 기능

| 영역 | 테이블 | 현재 판단 | 소유 기능 |
|---|---|---|---|
| 사용자 | `users`, `social_accounts` | 계획/미연결 | 인증·마이페이지 |
| 분류·표준 부품 | `common_codes`, `part_categories`, `parts` | 운영 중 | 부품 목록·호환성·견적 |
| 공급처 수집 | `suppliers`, `supplier_crawl_targets`, `supplier_products`, `supplier_offers`, `supplier_offer_prices` | 운영 중 | 컴퓨존 수집·가격 이력 |
| 정규화 스펙 | `cpu_specs`, `gpu_specs`, `mainboard_specs`, `ram_specs`, `storage_specs`, `psu_specs`, `case_specs`, `cooler_specs` | 운영 중 | 필터·호환성·자동 견적 |
| 견적 템플릿 | `quote_templates`, `quote_template_items` | 계획/부분 사용 | 템플릿 견적 |
| 사용자 견적 | `quotes`, `quote_items` | 계획/부분 연결 | 견적 저장·주문 전환 |
| 게임 성능 | `games`, `game_requirements`, `performance_estimates` | 기존 설계/미연결 | 요구 사양·추정치 |
| 실측 벤치마크 | `benchmark_sources`, `benchmark_builds`, `benchmark_build_parts`, `benchmark_games`, `benchmark_fps_results`, `benchmark_combo_game_results` | 운영 중 | 견적왕 원본·조합 집계 |
| 추천 콘텐츠 | `recommendation_posts`, `recommendation_post_parts`, `recommendation_post_games` | 운영 중 | 추천 견적 화면 |
| 주문 | `orders`, `order_items`, `payments`, `order_status_histories` | 계획/미연결 | 결제·배송 상태 |
| 장바구니 | `user_cart_quotes` | 계획/부분 연결 | 견적 보관 |

## 이번 점검에서 고친 데이터 경로

### 공급처 → 표준 스펙

원본은 `supplier_products.SUMMARY_SPEC_TEXT`에 보존하고, `parts`와 카테고리별 `*_specs` 테이블은 호환성 조회용 정규화 값으로 사용한다.

- CPU/메인보드의 `소켓1700`, `LGA 1700`을 `LGA1700`으로 정규화
- GPU의 슬래시 앞 칩셋 토큰을 `RTX 5070 Ti`, `RX 9070 XT`처럼 추출
- DDR4/DDR5, GPU 전력, 케이스 폼팩터·공간도 같은 파서 경로로 처리
- 기존 원본이 있으므로 전체 컴퓨존 재크롤 없이 repair 스크립트로 보강

검증 결과(2026-09-03 서버): CPU 스펙 145건, 메인보드 스펙 785건, GPU 칩셋 비어 있지 않은 행 512건. 파싱 정보가 부족한 상품은 임의의 값으로 채우지 않고 후속 검수 대상으로 남긴다.

### 가격·인기도 → 선택 가능한 판매 단위

자동 견적과 추천 견적은 `parts` → 활성 `supplier_offers` → 최신 `supplier_offer_prices`를 따라가야 한다. `supplier_products`는 원본 상품/이미지/요약 스펙, `supplier_offers`는 정품·벌크·용량 등 실제 판매 단위, 가격 테이블은 시계열 이력이다. `REVIEW_COUNT`에서 동기화한 `parts.POPULARITY_SCORE`는 최저가 독점을 막는 기본 신뢰 신호다.

### 벤치마크 원본 → 조합 집계

`benchmark_fps_results`는 빌드·게임·해상도별 원본 결과이고, `benchmark_combo_game_results`는 CPU/GPU 조합을 API가 빠르게 조회하기 위한 집계다. 두 테이블을 함께 유지해야 원본 추적과 화면 조회 성능을 모두 보장한다.

현재 서버 데이터: 견적왕 빌드 1개, 게임 154개, FPS 원본 462건, 조합 집계 462건.

## 후속 정리 원칙

- 빈 테이블을 레코드 수만으로 삭제하지 않는다. FK와 향후 기능 소유자를 먼저 확인한다.
- 동일 목적처럼 보이는 `performance_estimates`와 `benchmark_combo_game_results`는 합치지 않는다. 전자는 요구 조건 기반 추정치, 후자는 외부 빌드 실측 집계다.
- `supplier_products`와 `parts`도 합치지 않는다. 공급처 원본과 우리 표준 부품의 생명주기가 다르다.
- 다음 DB 변경 때 `project/docs/DB_TABLE_DEFINITION.md`를 현재 초기화 SQL과 동기화하고, 테이블별 담당 모듈과 삭제 조건을 함께 기록한다.
