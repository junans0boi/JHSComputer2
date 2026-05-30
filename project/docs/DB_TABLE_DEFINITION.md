# 정효성 TV PC 구매 플랫폼 - 테이블 정의서
작성일: 2026-05-23

> 기준: DB Clean V2
> 목적: 개발/마이그레이션 기준으로 사용할 테이블 정의서
> 비고: 딜러가/마진 계산은 MVP 이후로 보류한다.

---

## 테이블 목록

| 번호 | 테이블명 | 테이블 설명 | 비고 |
|---:|---|---|---|
| 1 | users | 사용자 정보 | 소셜 provider는 저장하지 않음 |
| 2 | social_accounts | 소셜 로그인 계정 | Kakao/Naver/Google |
| 3 | part_categories | 우리 서비스 부품 카테고리 | CPU, GPU 등 |
| 4 | parts | 표준 부품 | 견적에 들어가는 부품 |
| 5 | suppliers | 공급사 | 컴퓨존, 다나와 |
| 6 | supplier_crawl_targets | 공급사 크롤링 대상 | 공급사 카테고리/URL |
| 7 | supplier_products | 공급사 상품 페이지 | 대표 상품/상품 페이지 |
| 8 | supplier_offers | 공급사 판매 단위 | 실제 구매 가능한 단위 |
| 9 | supplier_offer_prices | 공급사 판매 단위 가격 이력 | 판매가/혜택가/재고 |
| 10 | cpu_specs | CPU 정규화 스펙 | 호환성/성능 |
| 11 | gpu_specs | GPU 정규화 스펙 | 호환성/전력 |
| 12 | mainboard_specs | 메인보드 정규화 스펙 | 소켓/칩셋/RAM |
| 13 | ram_specs | RAM 정규화 스펙 | 용량/클럭 |
| 14 | storage_specs | 저장장치 정규화 스펙 | SSD/HDD |
| 15 | psu_specs | 파워 정규화 스펙 | 와트/인증 |
| 16 | case_specs | 케이스 정규화 스펙 | 규격/공간 |
| 17 | cooler_specs | 쿨러 정규화 스펙 | 높이/소켓 |
| 18 | quote_templates | 견적 템플릿 | 가격대/용도/해상도 |
| 19 | quote_template_items | 견적 템플릿 항목 | 기본 부품 |
| 20 | games | 게임 마스터 | 롤/배그 등 |
| 21 | game_requirements | 게임 요구 성능 | 해상도/FPS |
| 22 | performance_estimates | 성능 예상 | 등급/FPS 범위 |
| 23 | quotes | 견적 | live 데이터 |
| 24 | quote_items | 견적 항목 | 현재 선택 부품 |
| 25 | orders | 주문 | snapshot 데이터 |
| 26 | order_items | 주문 항목 | 주문 시점 스냅샷 |
| 27 | payments | 결제/입금 정보 | MVP 계좌이체 |
| 28 | order_status_histories | 주문 상태 이력 | 상태 변경 로그 |

---

## 공통 규칙

| 항목 | 규칙 |
|---|---|
| 테이블명 | `TB_` 접두사 없이 snake_case 복수형 |
| PK | BIGINT AUTO_INCREMENT 기본 |
| 시간 컬럼 | `CREATED_DT`, `UPDATED_DT` 사용 |
| 활성 여부 | `IS_ACTIVE CHAR(1)` 값은 `Y`/`N` |
| 상태값 | MVP에서는 `VARCHAR`로 저장하고 애플리케이션 enum으로 검증 |
| JSON | MySQL JSON 타입 사용 |
| 마진 | MVP에서는 저장하지 않음. 추후 실제 매입가/마진 테이블 추가 |

---

## users - 사용자 정보

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| USER_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 사용자 ID |
| EMAIL | VARCHAR | 100 | Y |  |  |  | 이메일 |
| USER_NAME | VARCHAR | 100 | N |  |  |  | 사용자 이름 |
| NICKNAME | VARCHAR | 100 | Y |  |  |  | 닉네임 |
| PHONE | VARCHAR | 20 | Y |  |  |  | 연락처 |
| ROLE | VARCHAR | 20 | N | 'USER' |  |  | USER, ADMIN |
| STATUS | VARCHAR | 20 | N | 'ACTIVE' |  |  | ACTIVE, BLOCKED, WITHDRAWN |
| CREATED_DT | DATETIME |  | N | CURRENT_TIMESTAMP |  |  | 생성일시 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |
| DELETED_DT | DATETIME |  | Y |  |  |  | 탈퇴/삭제일시 |

---

## social_accounts - 소셜 로그인 계정

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| SOCIAL_ACCOUNT_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 소셜 계정 ID |
| USER_ID | BIGINT | 20 | N |  |  | users | 사용자 ID |
| PROVIDER | VARCHAR | 20 | N |  |  |  | KAKAO, NAVER, GOOGLE |
| PROVIDER_USER_ID | VARCHAR | 100 | N |  |  |  | 소셜 제공자 사용자 ID |
| EMAIL | VARCHAR | 100 | Y |  |  |  | 제공자 이메일 |
| PROFILE_JSON | JSON |  | Y |  |  |  | 제공자 프로필 원본 |
| CREATED_DT | DATETIME |  | N | CURRENT_TIMESTAMP |  |  | 생성일시 |

비고:
- `PROVIDER + PROVIDER_USER_ID` unique.
- 같은 `USER_ID`가 여러 소셜 계정을 가질 수 있다.

---

## part_categories - 우리 서비스 부품 카테고리

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| PART_CATEGORY_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 카테고리 ID |
| CATEGORY_CODE | VARCHAR | 30 | N |  |  |  | CPU, CPU_COOLER, MAINBOARD, RAM, GPU, SSD, PSU, CASE, CASE_FAN, TUNING |
| CATEGORY_NAME | VARCHAR | 50 | N |  |  |  | 표시명 |
| SORT_ORDER | INT |  | N | 0 |  |  | 정렬 순서 |
| IS_REQUIRED_FOR_BUILD | CHAR | 1 | N | 'N' |  |  | 본체 필수 여부 |
| IS_ACTIVE | CHAR | 1 | N | 'Y' |  |  | 사용 여부 |

---

## parts - 표준 부품

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| PART_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 표준 부품 ID |
| PART_CATEGORY_ID | BIGINT | 20 | N |  |  | part_categories | 카테고리 ID |
| CANONICAL_NAME | VARCHAR | 255 | N |  |  |  | 표준 부품명 |
| MANUFACTURER | VARCHAR | 100 | Y |  |  |  | 제조사 |
| MODEL_NAME | VARCHAR | 180 | Y |  |  |  | 모델명 |
| MODEL_KEY | VARCHAR | 220 | Y |  |  |  | 정규화 모델 키 |
| THUMBNAIL_URL | VARCHAR | 700 | Y |  |  |  | 대표 이미지 |
| STATUS | VARCHAR | 30 | N | 'ACTIVE' |  |  | ACTIVE, HIDDEN, DISCONTINUED |
| IS_ADMIN_APPROVED | CHAR | 1 | N | 'N' |  |  | 관리자 승인 여부 |
| ADMIN_PRIORITY | INT |  | N | 0 |  |  | 관리자 추천 우선순위 |
| POPULARITY_SCORE | DECIMAL | 10,2 | N | 0 |  |  | 인기 점수 |
| SPEC_STATUS | VARCHAR | 30 | N | 'UNVERIFIED' |  |  | UNVERIFIED, AUTO_PARSED, ADMIN_VERIFIED, NEEDS_REVIEW |
| SPEC_VERIFIED_DT | DATETIME |  | Y |  |  |  | 스펙 검수일시 |
| CREATED_DT | DATETIME |  | N | CURRENT_TIMESTAMP |  |  | 생성일시 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

비고:
- `FORM_FACTOR` 같은 카테고리별 속성은 이 테이블에 두지 않는다.
- CPU 멀티팩/정품박스/벌크는 같은 CPU면 같은 `PART_ID`로 본다.
- SSD 용량, RAM 용량, PSU 와트, 케이스 색상처럼 견적 선택 조건이 달라지는 경우는 다른 `PART_ID`로 본다.

---

## suppliers - 공급사

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| SUPPLIER_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 공급사 ID |
| SUPPLIER_CODE | VARCHAR | 40 | N |  |  |  | compuzone, danawa |
| SUPPLIER_NAME | VARCHAR | 100 | N |  |  |  | 공급사명 |
| BASE_URL | VARCHAR | 300 | Y |  |  |  | 기본 URL |
| STATUS | VARCHAR | 20 | N | 'ACTIVE' |  |  | ACTIVE, PAUSED |
| CREATED_DT | DATETIME |  | N | CURRENT_TIMESTAMP |  |  | 생성일시 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

---

## supplier_crawl_targets - 공급사 크롤링 대상

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| CRAWL_TARGET_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 크롤링 대상 ID |
| SUPPLIER_ID | BIGINT | 20 | N |  |  | suppliers | 공급사 ID |
| PART_CATEGORY_ID | BIGINT | 20 | Y |  |  | part_categories | 우리 카테고리 |
| TARGET_NAME | VARCHAR | 150 | N |  |  |  | 대상 이름 |
| SOURCE_URL | VARCHAR | 1000 | N |  |  |  | 크롤링 URL |
| EXTERNAL_CATEGORY_CODE | VARCHAR | 200 | Y |  |  |  | 공급사 카테고리 코드 |
| BIG_DIV_NO | VARCHAR | 30 | Y |  |  |  | 컴퓨존 BigDivNo |
| MEDIUM_DIV_NO | VARCHAR | 30 | Y |  |  |  | 컴퓨존 MediumDivNo |
| DIV_NO | VARCHAR | 30 | Y |  |  |  | 컴퓨존 DivNo |
| CRAWL_PRIORITY | INT |  | N | 100 |  |  | 크롤링 우선순위 |
| IS_ACTIVE | CHAR | 1 | N | 'Y' |  |  | 사용 여부 |
| CREATED_DT | DATETIME |  | N | CURRENT_TIMESTAMP |  |  | 생성일시 |

비고:
- 공급사 카테고리는 우리 서비스 카테고리가 아니라 데이터 누락 방지를 위한 수집 대상이다.

---

## supplier_products - 공급사 상품 페이지

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| SUPPLIER_PRODUCT_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 공급사 상품 ID |
| SUPPLIER_ID | BIGINT | 20 | N |  |  | suppliers | 공급사 ID |
| CRAWL_TARGET_ID | BIGINT | 20 | Y |  |  | supplier_crawl_targets | 수집 대상 ID |
| EXTERNAL_PRODUCT_ID | VARCHAR | 120 | N |  |  |  | 컴퓨존 ProductNo, 다나와 pcode |
| PRODUCT_NAME | VARCHAR | 500 | N |  |  |  | 공급사 상품명 |
| PRODUCT_URL | VARCHAR | 1000 | N |  |  |  | 상품 URL |
| IMAGE_URL | VARCHAR | 1000 | Y |  |  |  | 이미지 URL |
| SUMMARY_SPEC_TEXT | TEXT |  | Y |  |  |  | 리스트 요약 스펙 |
| RAW_SPEC_JSON | JSON |  | Y |  |  |  | 상세 스펙 원본 JSON. 필요 시만 저장 |
| SPEC_PARSE_STATUS | VARCHAR | 30 | N | 'UNPARSED' |  |  | UNPARSED, PARSED, PARTIAL, FAILED |
| SPEC_CAPTURED_DT | DATETIME |  | Y |  |  |  | 상세 스펙 수집일시 |
| REVIEW_COUNT | INT |  | Y |  |  |  | 리뷰 수 |
| RATING | DECIMAL | 3,2 | Y |  |  |  | 평점 |
| MATCH_STATUS | VARCHAR | 30 | N | 'UNMATCHED' |  |  | UNMATCHED, AUTO_MATCHED, ADMIN_CONFIRMED, REJECTED |
| MATCH_CONFIDENCE | DECIMAL | 5,2 | Y |  |  |  | 매칭 신뢰도 |
| IS_ACTIVE | CHAR | 1 | N | 'Y' |  |  | 사용 여부 |
| LAST_SEEN_DT | DATETIME |  | Y |  |  |  | 마지막 수집일시 |
| CREATED_DT | DATETIME |  | N | CURRENT_TIMESTAMP |  |  | 생성일시 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

비고:
- `SUPPLIER_ID + EXTERNAL_PRODUCT_ID` unique.
- 대표 상품 아래 여러 판매 단위가 있을 수 있으므로 `PART_ID`는 두지 않는다.

---

## supplier_offers - 공급사 판매 단위

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| SUPPLIER_OFFER_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 판매 단위 ID |
| SUPPLIER_PRODUCT_ID | BIGINT | 20 | N |  |  | supplier_products | 공급사 상품 ID |
| PART_ID | BIGINT | 20 | Y |  |  | parts | 매칭된 표준 부품 |
| EXTERNAL_OFFER_ID | VARCHAR | 120 | N |  |  |  | 옵션/판매 단위 상품번호 |
| OFFER_NAME | VARCHAR | 700 | N |  |  |  | 실제 판매 단위명 |
| OPTION_LABEL | VARCHAR | 200 | Y |  |  |  | 옵션 라벨. 예: [1TB], 정품 |
| OFFER_KIND | VARCHAR | 30 | Y |  |  |  | PACKAGE, CAPACITY, WATTAGE, COLOR, DEFAULT, OTHER |
| ATTRIBUTES_JSON | JSON |  | Y |  |  |  | 용량/색상/와트 등 파싱 속성 |
| PACKAGE_TYPE | VARCHAR | 30 | Y |  |  |  | BOX, MULTIPACK, BULK, OVERSEAS 등 |
| COOLER_INCLUDED | CHAR | 1 | Y |  |  |  | CPU 기본 쿨러 포함 여부 |
| IS_DEFAULT | CHAR | 1 | N | 'N' |  |  | 기본 선택 여부 |
| IS_ACTIVE | CHAR | 1 | N | 'Y' |  |  | 사용 여부 |
| LAST_SEEN_DT | DATETIME |  | Y |  |  |  | 마지막 수집일시 |
| RAW_JSON | JSON |  | Y |  |  |  | 원본 옵션 데이터 |
| CREATED_DT | DATETIME |  | N | CURRENT_TIMESTAMP |  |  | 생성일시 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

비고:
- 옵션이 없는 상품도 기본 offer 1개를 생성한다.
- 견적/주문/가격은 최종적으로 이 테이블의 `SUPPLIER_OFFER_ID`를 참조한다.
- `OFFER_NAME`은 실제 상품명에 옵션 라벨을 붙인 형태로 저장한다.

---

## supplier_offer_prices - 공급사 판매 단위 가격 이력

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| OFFER_PRICE_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 가격 이력 ID |
| SUPPLIER_OFFER_ID | BIGINT | 20 | N |  |  | supplier_offers | 판매 단위 ID |
| PUBLIC_PRICE | INT |  | N | 0 |  |  | 고객 노출 판매가 |
| BENEFIT_PRICE | INT |  | Y |  |  |  | 혜택가 |
| DISCOUNT_AMOUNT | INT |  | Y |  |  |  | 즉시 할인액 |
| PRODUCT_REWARD_POINTS | INT |  | Y |  |  |  | 제품 적립금 |
| MEMBERSHIP_REWARD_POINTS | INT |  | Y |  |  |  | 회원등급 적립금 |
| BANK_TRANSFER_REWARD_POINTS | INT |  | Y |  |  |  | 무통장 적립금 |
| STOCK_STATUS | VARCHAR | 30 | N | 'UNKNOWN' |  |  | IN_STOCK, LOW_STOCK, OUT_OF_STOCK, UNKNOWN |
| DELIVERY_FEE | INT |  | Y |  |  |  | 배송비 |
| SOURCE_TYPE | VARCHAR | 30 | N |  |  |  | SCHEDULED_CRAWL, PRODUCT_DETAIL, ORDER_CHECK, ADMIN |
| CAPTURED_DT | DATETIME |  | N | CURRENT_TIMESTAMP |  |  | 수집/확인 일시 |
| RAW_JSON | JSON |  | Y |  |  |  | 가격 원본 |

비고:
- 가격은 update하지 않고 insert로 이력을 쌓는다.
- 할인율은 고정 규칙으로 저장하지 않고 필요 시 계산한다.

## cpu_specs - CPU 정규화 스펙

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| PART_ID | BIGINT | 20 | N |  | Y | parts | 표준 부품 ID |
| SOCKET | VARCHAR | 50 | N |  |  |  | AM5, LGA1700 등 |
| FAMILY | VARCHAR | 100 | Y |  |  |  | Ryzen 7, Core i5 등 |
| GENERATION | VARCHAR | 100 | Y |  |  |  | Zen5, 14세대 등 |
| CODENAME | VARCHAR | 100 | Y |  |  |  | Granite Ridge 등 |
| CORE_COUNT | INT |  | Y |  |  |  | 코어 수 |
| THREAD_COUNT | INT |  | Y |  |  |  | 스레드 수 |
| BASE_CLOCK_GHZ | DECIMAL | 5,2 | Y |  |  |  | 기본 클럭 |
| BOOST_CLOCK_GHZ | DECIMAL | 5,2 | Y |  |  |  | 최대 클럭 |
| L2_CACHE_MB | DECIMAL | 8,2 | Y |  |  |  | L2 캐시 |
| L3_CACHE_MB | DECIMAL | 8,2 | Y |  |  |  | L3 캐시 |
| TDP_W | INT |  | Y |  |  |  | TDP |
| PBP_W | INT |  | Y |  |  |  | Intel PBP |
| MTP_W | INT |  | Y |  |  |  | Intel MTP |
| MEMORY_TYPES_JSON | JSON |  | Y |  |  |  | 지원 RAM 타입 |
| PCIE_VERSIONS_JSON | JSON |  | Y |  |  |  | PCIe 버전 |
| HAS_INTEGRATED_GRAPHICS | CHAR | 1 | Y |  |  |  | 내장그래픽 여부 |
| INTEGRATED_GRAPHICS_NAME | VARCHAR | 120 | Y |  |  |  | 내장그래픽명 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

---

## gpu_specs - GPU 정규화 스펙

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| PART_ID | BIGINT | 20 | N |  | Y | parts | 표준 부품 ID |
| CHIPSET_MAKER | VARCHAR | 50 | Y |  |  |  | NVIDIA, AMD, Intel |
| CHIPSET_NAME | VARCHAR | 100 | Y |  |  |  | RTX 5060 등 |
| SERIES_NAME | VARCHAR | 100 | Y |  |  |  | GeForce RTX 50 등 |
| MEMORY_TYPE | VARCHAR | 50 | Y |  |  |  | GDDR7 등 |
| MEMORY_GB | INT |  | Y |  |  |  | VRAM |
| INTERFACE_TEXT | VARCHAR | 120 | Y |  |  |  | PCIe5.0x16 등 |
| RECOMMENDED_PSU_W | INT |  | Y |  |  |  | 권장 파워 |
| POWER_CONSUMPTION_W | INT |  | Y |  |  |  | 사용전력 |
| POWER_PORTS_JSON | JSON |  | Y |  |  |  | 전원 포트 |
| LENGTH_MM | DECIMAL | 8,2 | Y |  |  |  | 길이 |
| HEIGHT_MM | DECIMAL | 8,2 | Y |  |  |  | 높이 |
| THICKNESS_MM | DECIMAL | 8,2 | Y |  |  |  | 두께 |
| DISPLAY_OUTPUTS_JSON | JSON |  | Y |  |  |  | 출력 포트 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

---

## mainboard_specs - 메인보드 정규화 스펙

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| PART_ID | BIGINT | 20 | N |  | Y | parts | 표준 부품 ID |
| SOCKET | VARCHAR | 50 | N |  |  |  | AM5, LGA1700 등 |
| CHIPSET | VARCHAR | 100 | Y |  |  |  | B650 등 |
| FORM_FACTOR | VARCHAR | 50 | Y |  |  |  | ATX, M-ATX |
| MEMORY_TYPE | VARCHAR | 50 | Y |  |  |  | DDR5 |
| MEMORY_SLOT_COUNT | INT |  | Y |  |  |  | RAM 슬롯 |
| MAX_MEMORY_GB | INT |  | Y |  |  |  | 최대 메모리 |
| M2_SLOT_COUNT | INT |  | Y |  |  |  | M.2 슬롯 |
| SATA_PORT_COUNT | INT |  | Y |  |  |  | SATA 포트 |
| PCIE_X16_SLOT_COUNT | INT |  | Y |  |  |  | PCIe x16 슬롯 |
| WIFI_BUILTIN | CHAR | 1 | Y |  |  |  | Wi-Fi 내장 여부 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

---

## ram_specs - RAM 정규화 스펙

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| PART_ID | BIGINT | 20 | N |  | Y | parts | 표준 부품 ID |
| MEMORY_TYPE | VARCHAR | 50 | N |  |  |  | DDR4, DDR5 |
| CAPACITY_GB | INT |  | N |  |  |  | 용량 |
| MODULE_COUNT | INT |  | Y |  |  |  | 모듈 개수 |
| SPEED_MHZ | INT |  | Y |  |  |  | 클럭 |
| PROFILE_TYPE | VARCHAR | 50 | Y |  |  |  | XMP, EXPO |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

---

## storage_specs - 저장장치 정규화 스펙

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| PART_ID | BIGINT | 20 | N |  | Y | parts | 표준 부품 ID |
| STORAGE_TYPE | VARCHAR | 30 | N |  |  |  | SSD, HDD |
| FORM_FACTOR | VARCHAR | 50 | Y |  |  |  | M.2 2280, 2.5 |
| INTERFACE_TEXT | VARCHAR | 120 | Y |  |  |  | PCIe4.0x4, SATA |
| CAPACITY_GB | INT |  | N |  |  |  | 용량 |
| SEQ_READ_MBPS | INT |  | Y |  |  |  | 순차 읽기 |
| SEQ_WRITE_MBPS | INT |  | Y |  |  |  | 순차 쓰기 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

---

## psu_specs - 파워 정규화 스펙

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| PART_ID | BIGINT | 20 | N |  | Y | parts | 표준 부품 ID |
| FORM_FACTOR | VARCHAR | 50 | Y |  |  |  | ATX, M-ATX |
| RATED_WATTAGE | INT |  | N |  |  |  | 정격 출력 |
| CERTIFICATION | VARCHAR | 80 | Y |  |  |  | 80PLUS Gold 등 |
| MODULAR_TYPE | VARCHAR | 50 | Y |  |  |  | Full Modular 등 |
| PCIE_5_READY | CHAR | 1 | Y |  |  |  | PCIe 5 지원 |
| CONNECTOR_JSON | JSON |  | Y |  |  |  | 커넥터 정보 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

---

## case_specs - 케이스 정규화 스펙

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| PART_ID | BIGINT | 20 | N |  | Y | parts | 표준 부품 ID |
| CASE_TYPE | VARCHAR | 50 | Y |  |  |  | Middle Tower 등 |
| COLOR | VARCHAR | 50 | Y |  |  |  | black, white |
| SUPPORTED_BOARD_FORMS_JSON | JSON |  | Y |  |  |  | 지원 보드 규격 |
| MAX_GPU_LENGTH_MM | DECIMAL | 8,2 | Y |  |  |  | GPU 최대 길이 |
| MAX_COOLER_HEIGHT_MM | DECIMAL | 8,2 | Y |  |  |  | CPU 쿨러 최대 높이 |
| FAN_COUNT | INT |  | Y |  |  |  | 기본 팬 수 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

---

## cooler_specs - 쿨러 정규화 스펙

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| PART_ID | BIGINT | 20 | N |  | Y | parts | 표준 부품 ID |
| COOLER_TYPE | VARCHAR | 30 | N |  |  |  | AIR, LIQUID |
| COLOR | VARCHAR | 50 | Y |  |  |  | black, white |
| SUPPORTED_SOCKETS_JSON | JSON |  | Y |  |  |  | 지원 소켓 |
| HEIGHT_MM | DECIMAL | 8,2 | Y |  |  |  | 높이 |
| FAN_SIZE_MM | INT |  | Y |  |  |  | 팬 크기 |
| TDP_RATING_W | INT |  | Y |  |  |  | 지원 TDP |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

## quote_templates - 견적 템플릿

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| QUOTE_TEMPLATE_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 템플릿 ID |
| TEMPLATE_NAME | VARCHAR | 150 | N |  |  |  | 템플릿명 |
| BUDGET_MIN | INT |  | N | 0 |  |  | 최소 예산 |
| BUDGET_MAX | INT |  | N | 0 |  |  | 최대 예산 |
| PURPOSE | VARCHAR | 30 | N |  |  |  | GAME, STREAMING 등 |
| RESOLUTION | VARCHAR | 30 | Y |  |  |  | FHD, QHD, UHD_4K |
| PRIORITY_TYPE | VARCHAR | 30 | N | 'VALUE' |  |  | PERFORMANCE, VALUE 등 |
| IS_ACTIVE | CHAR | 1 | N | 'Y' |  |  | 사용 여부 |
| CREATED_DT | DATETIME |  | N | CURRENT_TIMESTAMP |  |  | 생성일시 |

---

## quote_template_items - 견적 템플릿 항목

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| QUOTE_TEMPLATE_ITEM_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 템플릿 항목 ID |
| QUOTE_TEMPLATE_ID | BIGINT | 20 | N |  |  | quote_templates | 템플릿 ID |
| PART_CATEGORY_ID | BIGINT | 20 | N |  |  | part_categories | 카테고리 ID |
| PART_ID | BIGINT | 20 | Y |  |  | parts | 기본 부품 |
| IS_REPLACEABLE | CHAR | 1 | N | 'Y' |  |  | 교체 가능 여부 |
| SORT_ORDER | INT |  | N | 0 |  |  | 정렬 |

---

## games - 게임 마스터

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| GAME_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 게임 ID |
| GAME_NAME | VARCHAR | 100 | N |  |  |  | 게임명 |
| SLUG | VARCHAR | 100 | N |  |  |  | URL/검색용 |
| PRIORITY | INT |  | N | 0 |  |  | 우선순위 |
| IS_ACTIVE | CHAR | 1 | N | 'Y' |  |  | 사용 여부 |

---

## game_requirements - 게임 요구 성능

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| GAME_REQUIREMENT_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 요구 성능 ID |
| GAME_ID | BIGINT | 20 | N |  |  | games | 게임 ID |
| RESOLUTION | VARCHAR | 30 | N |  |  |  | FHD, QHD 등 |
| TARGET_FPS | INT |  | N |  |  |  | 목표 FPS |
| QUALITY_PRESET | VARCHAR | 30 | N |  |  |  | LOW, MEDIUM, HIGH, ULTRA |
| CPU_SCORE_MIN | INT |  | Y |  |  |  | 최소 CPU 점수 |
| GPU_SCORE_MIN | INT |  | Y |  |  |  | 최소 GPU 점수 |
| RAM_GB_MIN | INT |  | Y |  |  |  | 최소 RAM |

---

## performance_estimates - 성능 예상

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| PERFORMANCE_ESTIMATE_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 성능 예상 ID |
| GAME_ID | BIGINT | 20 | N |  |  | games | 게임 ID |
| CPU_PART_ID | BIGINT | 20 | Y |  |  | parts | CPU 부품 |
| GPU_PART_ID | BIGINT | 20 | Y |  |  | parts | GPU 부품 |
| RESOLUTION | VARCHAR | 30 | N |  |  |  | 해상도 |
| QUALITY_PRESET | VARCHAR | 30 | N |  |  |  | 옵션 |
| FPS_MIN | INT |  | Y |  |  |  | FPS 최소 |
| FPS_MAX | INT |  | Y |  |  |  | FPS 최대 |
| GRADE | VARCHAR | 30 | N |  |  |  | PLAYABLE, GOOD 등 |
| SOURCE_SUMMARY | VARCHAR | 255 | Y |  |  |  | 출처 요약 |
| VERIFIED_DT | DATETIME |  | Y |  |  |  | 검수일시 |

---

## quotes - 견적

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| QUOTE_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 견적 ID |
| USER_ID | BIGINT | 20 | N |  |  | users | 사용자 ID |
| QUOTE_TEMPLATE_ID | BIGINT | 20 | Y |  |  | quote_templates | 템플릿 ID |
| STATUS | VARCHAR | 30 | N | 'DRAFT' |  |  | DRAFT, ACTIVE, PRICE_CHANGED, ORDERED, ARCHIVED |
| BUDGET_AMOUNT | INT |  | N | 0 |  |  | 사용자 예산 |
| BUDGET_SCOPE | VARCHAR | 30 | N | 'BODY_ONLY' |  |  | 예산 범위 |
| PURPOSE | VARCHAR | 30 | N |  |  |  | 용도 |
| RESOLUTION | VARCHAR | 30 | Y |  |  |  | 해상도 |
| MONITOR_INPUT | VARCHAR | 150 | Y |  |  |  | 모니터 입력값 |
| TARGET_GAMES_JSON | JSON |  | Y |  |  |  | 선택 게임 |
| STORAGE_PREFERENCE | VARCHAR | 50 | Y |  |  |  | 저장 용량 선호 |
| WINDOWS_OPTION | VARCHAR | 30 | N | 'NONE' |  |  | 윈도우 옵션 |
| PRIORITY_TYPE | VARCHAR | 30 | N | 'VALUE' |  |  | 우선순위 |
| AESTHETIC_OPTION | VARCHAR | 50 | Y |  |  |  | RGB/화이트 등 |
| SUBTOTAL_PARTS_PRICE | INT |  | N | 0 |  |  | 부품가 합계 |
| ASSEMBLY_FEE | INT |  | N | 0 |  |  | 조립비 |
| WINDOWS_FEE | INT |  | N | 0 |  |  | 윈도우 비용 |
| SHIPPING_FEE | INT |  | N | 0 |  |  | 배송비 |
| TOTAL_PRICE | INT |  | N | 0 |  |  | 총액 |
| LAST_PRICE_CHECKED_DT | DATETIME |  | Y |  |  |  | 최신 가격 확인일시 |
| CREATED_DT | DATETIME |  | N | CURRENT_TIMESTAMP |  |  | 생성일시 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

---

## quote_items - 견적 항목

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| QUOTE_ITEM_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 견적 항목 ID |
| QUOTE_ID | BIGINT | 20 | N |  |  | quotes | 견적 ID |
| PART_CATEGORY_ID | BIGINT | 20 | N |  |  | part_categories | 카테고리 ID |
| PART_ID | BIGINT | 20 | N |  |  | parts | 표준 부품 ID |
| SUPPLIER_OFFER_ID | BIGINT | 20 | Y |  |  | supplier_offers | 선택 판매 단위 |
| QUANTITY | INT |  | N | 1 |  |  | 수량 |
| CURRENT_PUBLIC_PRICE | INT |  | N | 0 |  |  | 현재 고객 노출가 |
| SORT_ORDER | INT |  | N | 0 |  |  | 표시 순서 |

## orders - 주문

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| ORDER_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 주문 ID |
| ORDER_NO | VARCHAR | 50 | N |  |  |  | 표시용 주문번호 |
| USER_ID | BIGINT | 20 | N |  |  | users | 사용자 ID |
| QUOTE_ID | BIGINT | 20 | N |  |  | quotes | 원본 견적 |
| STATUS | VARCHAR | 40 | N | 'ADMIN_REVIEW' |  |  | 주문 상태 |
| PRICE_CHECK_STATUS | VARCHAR | 30 | N | 'NOT_CHECKED' |  |  | NOT_CHECKED, SAME, CHANGED, FAILED |
| PRICE_CHECKED_DT | DATETIME |  | Y |  |  |  | 주문 직전 가격 확인일시 |
| PRICE_CHANGE_JSON | JSON |  | Y |  |  |  | 가격 변동 승인에 필요한 변경 내역 |
| PRICE_APPROVED_DT | DATETIME |  | Y |  |  |  | 사용자 가격 변경 승인일시 |
| RECIPIENT_NAME | VARCHAR | 100 | N |  |  |  | 수령인 |
| RECIPIENT_PHONE | VARCHAR | 20 | N |  |  |  | 수령 연락처 |
| POSTAL_CODE | VARCHAR | 20 | N |  |  |  | 우편번호 |
| ADDRESS1 | VARCHAR | 255 | N |  |  |  | 기본 주소 |
| ADDRESS2 | VARCHAR | 255 | Y |  |  |  | 상세 주소 |
| DELIVERY_MEMO | VARCHAR | 255 | Y |  |  |  | 배송 메모 |
| SUBTOTAL_PARTS_PRICE | INT |  | N | 0 |  |  | 주문 시점 부품가 |
| ASSEMBLY_FEE | INT |  | N | 0 |  |  | 조립비 |
| WINDOWS_FEE | INT |  | N | 0 |  |  | 윈도우 비용 |
| SHIPPING_FEE | INT |  | N | 0 |  |  | 배송비 |
| TOTAL_PRICE | INT |  | N | 0 |  |  | 결제 총액 |
| CREATED_DT | DATETIME |  | N | CURRENT_TIMESTAMP |  |  | 생성일시 |
| UPDATED_DT | DATETIME |  | Y |  |  |  | 수정일시 |

---

## order_items - 주문 항목

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| ORDER_ITEM_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 주문 항목 ID |
| ORDER_ID | BIGINT | 20 | N |  |  | orders | 주문 ID |
| CATEGORY_CODE | VARCHAR | 30 | N |  |  |  | 주문 시점 카테고리 |
| PART_ID | BIGINT | 20 | Y |  |  | parts | 원본 표준 부품 |
| SUPPLIER_OFFER_ID | BIGINT | 20 | Y |  |  | supplier_offers | 원본 판매 단위 |
| PART_NAME_SNAPSHOT | VARCHAR | 255 | N |  |  |  | 주문 시점 부품명 |
| SUPPLIER_CODE_SNAPSHOT | VARCHAR | 40 | Y |  |  |  | 공급사 코드 |
| EXTERNAL_OFFER_ID_SNAPSHOT | VARCHAR | 120 | Y |  |  |  | 공급사 판매 단위 ID |
| OFFER_NAME_SNAPSHOT | VARCHAR | 700 | Y |  |  |  | 공급사 판매 단위명 |
| PRODUCT_URL_SNAPSHOT | VARCHAR | 1000 | Y |  |  |  | 상품 URL |
| QUANTITY | INT |  | N | 1 |  |  | 수량 |
| PUBLIC_PRICE | INT |  | N | 0 |  |  | 고객 노출가 |
| TOTAL_PUBLIC_PRICE | INT |  | N | 0 |  |  | 총 고객 노출가 |

---

## payments - 결제/입금 정보

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| PAYMENT_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 결제 ID |
| ORDER_ID | BIGINT | 20 | N |  |  | orders | 주문 ID |
| METHOD | VARCHAR | 30 | N | 'BANK_TRANSFER' |  |  | BANK_TRANSFER, PG_VIRTUAL_ACCOUNT, CARD |
| STATUS | VARCHAR | 30 | N | 'PENDING' |  |  | PENDING, CONFIRMED, CANCELLED, REFUNDED |
| AMOUNT | INT |  | N | 0 |  |  | 결제 금액 |
| DEPOSITOR_NAME | VARCHAR | 80 | Y |  |  |  | 입금자명 |
| CONFIRMED_BY_USER_ID | BIGINT | 20 | Y |  |  | users | 입금 확인 관리자 |
| CONFIRMED_DT | DATETIME |  | Y |  |  |  | 확인일시 |
| MEMO | VARCHAR | 255 | Y |  |  |  | 메모 |

---

## order_status_histories - 주문 상태 이력

| 컬럼명 | 데이터타입 | 길이 | NULL | 기본값 | PK | FK | 설명 |
|---|---|---:|---|---|---|---|---|
| ORDER_STATUS_HISTORY_ID | BIGINT | 20 | N | AUTO_INCREMENT | Y |  | 상태 이력 ID |
| ORDER_ID | BIGINT | 20 | N |  |  | orders | 주문 ID |
| FROM_STATUS | VARCHAR | 40 | Y |  |  |  | 이전 상태 |
| TO_STATUS | VARCHAR | 40 | N |  |  |  | 다음 상태 |
| ACTOR_USER_ID | BIGINT | 20 | Y |  |  | users | 변경자 |
| MEMO | VARCHAR | 255 | Y |  |  |  | 메모 |
| CREATED_DT | DATETIME |  | N | CURRENT_TIMESTAMP |  |  | 생성일시 |
