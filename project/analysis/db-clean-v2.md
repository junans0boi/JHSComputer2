# DB Clean V2 정리안
> 작성일: 2026-05-23
> 목적: 기존 DB 설계의 이름/관계를 단순화하기 위한 정리안

---

## 핵심 결론

기존 이름이 지저분해 보이는 가장 큰 이유는 `supplier_listings`와 `supplier_listing_variants`가 길고, 무엇이 실제 구매 단위인지 바로 안 보이기 때문이다.

V2에서는 이렇게 부른다.

| 기존 이름 | 새 이름 | 의미 |
|---|---|---|
| `parts` | `parts` | 우리 서비스의 표준 부품. 견적에 들어가는 부품 |
| `supplier_listings` | `supplier_products` | 공급사에 등록된 상품 페이지/대표 상품 |
| `supplier_listing_variants` | `supplier_offers` | 공급사에서 실제 구매 가능한 판매 단위 |
| `part_prices` | `supplier_offer_prices` | 판매 단위 가격 이력 |
| `listing_matches` | `part_match_candidates` | 공급사 상품/판매 단위와 표준 부품 매칭 후보 |
| `part_spec_sources` | `raw_spec_sources` | 외부 스펙 원본 묶음 |
| `part_spec_source_items` | `raw_spec_items` | 외부 스펙 원본 key/value |
| `dealer_price_rules` | 보류 | 마진/딜러가 정책은 MVP 이후 |

---

## User / Social Login

`users`에는 계정의 기본 정보만 둔다. 소셜 로그인 provider 정보는 `social_accounts`로 분리한다.

### users

| id | email | name | nickname | phone | role | status |
|---:|---|---|---|---|---|---|
| 1 | admin@jhstv.local | 정효성 | 효성TV | 010-0000-0000 | ADMIN | ACTIVE |
| 2 | buyer@example.com | 김구매 | 배그유저 | 010-1111-2222 | USER | ACTIVE |
| 3 | buyer@example.com | 김팔숙 | 김목지 | 010-9392-1203 | USER | ACTIVE |
| 4 | ackdock@example.com | 김악덕 | 악덕구매자 | 010-1231-2452 | USER | BLOCKED |

### social_accounts

| id | user_id | provider | provider_user_id | email |
|---:|---:|---|---|---|
| 1 | 3 | KAKAO | kakao-987654321 | buyer@example.com |
| 2 | 4 | KAKAO | kakao-38484899 | ackdock@example.com |

---

## Categories

우리 서비스에서 쓰는 카테고리는 단순하게 유지한다. 공급사 크롤링용 상세 카테고리는 우리 카테고리가 아니라 `supplier_crawl_targets`로 관리한다.

### part_categories

| id | code | name | sort_order | is_required_for_build |
|---:|---|---|---:|---|
| 1 | CPU | CPU | 10 | true |
| 2 | CPU_COOLER | CPU 쿨러 | 20 | true |
| 3 | MAINBOARD | 메인보드 | 30 | true |
| 4 | RAM | 메모리 | 40 | true |
| 5 | GPU | 그래픽카드 | 50 | true |
| 6 | SSD | SSD | 60 | true |
| 7 | PSU | 파워 | 70 | true |
| 8 | CASE | 케이스 | 80 | true |
| 9 | CASE_FAN | 케이스 쿨러 | 90 | false |
| 10 | TUNING | 튜닝 용품 | 100 | false |

### supplier_crawl_targets

공급사에서 제공하는 여러 카테고리 URL은 크롤링 누락 방지를 위한 대상 목록이다. 우리 서비스 카테고리와 1:1로 맞추지 않는다.

| id | supplier_id | part_category_id | name | source_url | external_category_code | crawl_priority | is_active |
|---:|---:|---:|---|---|---|---:|---|
| 1 | 1 | 1 | 컴퓨존 CPU | https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1012 | `BigDivNo=4;MediumDivNo=1012;DivNo=0` | 10 | true |
| 2 | 1 | 1 | 컴퓨존 AMD CPU | https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1012&DivNo=2033 | `BigDivNo=4;MediumDivNo=1012;DivNo=2033` | 20 | true |
| 3 | 2 | 1 | 다나와 CPU | https://prod.danawa.com/list/?cate=112747 | `cate=112747` | 10 | true |
| 4 | 2 | 5 | 다나와 RTX 5060 | https://prod.danawa.com/list/?cate=11455678 | `cate=11455678` | 30 | true |

---

## Product / Offer Model

### 핵심 규칙

- `parts`: 견적에 들어가는 표준 부품
- `supplier_products`: 공급사 상품 페이지/대표 상품
- `supplier_offers`: 실제 구매 가능한 판매 단위

모든 견적/주문/가격은 최종적으로 `supplier_offers`를 바라본다.

옵션이 없는 상품도 기본 `supplier_offer` 1개를 만든다. 그러면 `quote_items`가 `supplier_product_id + supplier_offer_id` 둘 다 들고 다닐 필요가 줄어든다.

### parts

`parts`에 `formfactor` 같은 공통 컬럼은 두지 않는다. 폼팩터는 부품 카테고리마다 의미가 다르므로 각 spec 테이블에 둔다.

| id | category_id | canonical_name | manufacturer | model_name | model_key | status | is_admin_approved | spec_status |
|---:|---:|---|---|---|---|---|---|---|
| 1001 | 1 | AMD Ryzen 7 9800X3D | AMD | Ryzen 7 9800X3D | amd-ryzen-7-9800x3d | ACTIVE | true | AUTO_PARSED |
| 2001 | 3 | MSI PRO B650M-P | MSI | PRO B650M-P | msi-pro-b650m-p | ACTIVE | true | AUTO_PARSED |
| 3001 | 4 | G.SKILL DDR5-6000 CL36 AEGIS 5 16GB | G.SKILL | DDR5-6000 CL36 AEGIS 5 16GB | gskill-ddr5-6000-cl36-aegis5-16gb | ACTIVE | true | AUTO_PARSED |
| 3002 | 4 | G.SKILL DDR5-6000 CL36 AEGIS 5 32GB | G.SKILL | DDR5-6000 CL36 AEGIS 5 32GB | gskill-ddr5-6000-cl36-aegis5-32gb | ACTIVE | true | AUTO_PARSED |
| 4001 | 5 | MSI GeForce RTX 5060 Ventus 2X OC D7 8GB | MSI | RTX 5060 Ventus 2X OC D7 8GB | msi-rtx-5060-ventus-2x-oc-d7-8gb | ACTIVE | true | AUTO_PARSED |
| 5001 | 6 | Samsung 990 EVO Plus M.2 NVMe 1TB | 삼성전자 | 990 EVO Plus 1TB | samsung-990-evo-plus-1tb | ACTIVE | true | AUTO_PARSED |
| 5002 | 6 | Samsung 990 EVO Plus M.2 NVMe 2TB | 삼성전자 | 990 EVO Plus 2TB | samsung-990-evo-plus-2tb | ACTIVE | true | AUTO_PARSED |
| 6001 | 7 | Micronics Classic II 850W Gold ATX3.1 Black | 마이크로닉스 | Classic II 850W Gold ATX3.1 Black | micronics-classic-ii-850w-gold-atx31-black | ACTIVE | true | AUTO_PARSED |
| 7001 | 8 | OH'S NICE Middle Tower Black | OH'S | NICE Black | ohs-nice-black | ACTIVE | true | AUTO_PARSED |
| 8001 | 2 | EDDY CY100A ARGB CPU Cooler Black | 에디 | CY100A ARGB Black | eddy-cy100a-argb-black | ACTIVE | true | AUTO_PARSED |

### supplier_products

공급사 상품 페이지/대표 상품이다. 여기에는 `part_id`를 억지로 넣지 않는다. 같은 대표 상품 아래 1TB/2TB/4TB처럼 여러 `parts`가 들어갈 수 있기 때문이다.

| id | supplier_id | crawl_target_id | external_product_id | product_name | product_url | image_url | match_status | last_seen_at |
|---:|---:|---:|---|---|---|---|---|---|
| 10001 | 1 | 1 | 1187400 | [AMD] 라이젠7 그래니트 9800X3D (8코어/16스레드/4.7GHz/쿨러미포함) | https://www.compuzone.co.kr/product/product_detail.htm?ProductNo=1187400 | ... | AUTO_MATCHED | 2026-05-23 20:18:43 |
| 10002 | 1 | null | 1182756 | [삼성전자] 공식인증 990 EVO Plus M.2 NVMe 2280 | https://www.compuzone.co.kr/product/product_detail.htm?ProductNo=1182756 | ... | AUTO_MATCHED | 2026-05-23 20:18:43 |
| 10003 | 1 | null | 1143770 | [마이크로닉스] Classic II 80PLUS GOLD 풀모듈러 ATX3.1 (PCIE5.1) | https://www.compuzone.co.kr/product/product_detail.htm?ProductNo=1143770 | ... | AUTO_MATCHED | 2026-05-23 20:18:43 |
| 20001 | 2 | 3 | 70531547 | AMD 라이젠7-6세대 9800X3D (그래니트 릿지) | https://prod.danawa.com/info/?pcode=70531547 | ... | AUTO_MATCHED | 2026-05-23 19:07:17 |
| 20002 | 2 | null | 69869543 | 삼성전자 990 EVO Plus M.2 NVMe | https://prod.danawa.com/info/?pcode=69869543 | ... | AUTO_MATCHED | 2026-05-23 20:12:31 |

### supplier_offers

실제 구매 가능한 단위다. 예전 `supplier_listing_variants`가 하려던 역할이다.

`offer_name`은 실제 상품명처럼 저장한다. 단순히 `[1TB]`, `[정품]`만 저장하지 않는다.

| id | supplier_product_id | part_id | external_offer_id | offer_name | option_label | offer_kind | attributes_json | package_type | cooler_included | is_default | is_active |
|---:|---:|---:|---|---|---|---|---|---|---|---|---|
| 11001 | 10001 | 1001 | 1187400 | [AMD] 라이젠7 그래니트 9800X3D (8코어/16스레드/4.7GHz/쿨러미포함) [멀티팩] | [멀티팩] | PACKAGE | `{}` | MULTIPACK | false | true | true |
| 21001 | 20001 | 1001 | 70531547 | AMD 라이젠7-6세대 9800X3D (그래니트 릿지) 멀티팩 정품 | 멀티팩 정품 | PACKAGE | `{}` | MULTIPACK | false | true | true |
| 21002 | 20001 | 1001 | 70679912 | AMD 라이젠7-6세대 9800X3D (그래니트 릿지) 정품 | 정품 | PACKAGE | `{}` | BOX | true | false | true |
| 21003 | 20001 | 1001 | 92233121 | AMD 라이젠7-6세대 9800X3D (그래니트 릿지) 해외구매 | 해외구매 | PACKAGE | `{}` | OVERSEAS | null | false | false |
| 13001 | 10002 | 5001 | 1182756 | [삼성전자] 공식인증 990 EVO Plus M.2 NVMe 2280 [1TB] | [1TB] | CAPACITY | `{"capacity_gb":1024}` | null | null | true | true |
| 13002 | 10002 | 5002 | 1182755 | [삼성전자] 공식인증 990 EVO Plus M.2 NVMe 2280 [2TB] | [2TB] | CAPACITY | `{"capacity_gb":2048}` | null | null | false | true |
| 14001 | 10003 | 6001 | 1143770 | [마이크로닉스] Classic II 80PLUS GOLD 풀모듈러 ATX3.1 [850W] [블랙] 230V EU | [850W] [블랙] 230V EU | WATTAGE | `{"wattage":850,"color":"black"}` | null | null | true | true |

---

## Price

마진/딜러가 계산은 MVP에서 제외한다.

대신 컴퓨존에서 실제로 보이는 판매가/혜택가/할인액/적립금 원본은 가격 이력에 저장한다.

### supplier_offer_prices

| id | supplier_offer_id | public_price | benefit_price | discount_amount | product_reward_points | membership_reward_points | bank_transfer_reward_points | stock_status | source_type | captured_at |
|---:|---:|---:|---:|---:|---:|---:|---:|---|---|---|
| 1 | 11001 | 590000 | null | null | null | null | null | IN_STOCK | SCHEDULED_CRAWL | 2026-05-23 20:18:43 |
| 2 | 13001 | 473000 | 454000 | 19000 | 950 | 1420 | 16630 | IN_STOCK | PRODUCT_DETAIL | 2026-05-23 20:18:43 |
| 3 | 14001 | 141000 | 136750 | 4250 | 280 | 420 | 3550 | IN_STOCK | PRODUCT_DETAIL | 2026-05-23 20:18:43 |

할인율은 고정 규칙으로 보지 않는다. 필요하면 화면에서 계산만 한다.

```txt
discount_rate = discount_amount / public_price
```

---

## Matching

### part_match_candidates

| id | part_id | supplier_product_id | supplier_offer_id | match_scope | match_status | confidence | evidence_json |
|---:|---:|---:|---:|---|---|---:|---|
| 1 | 1001 | 10001 | 11001 | OFFER | ADMIN_CONFIRMED | 96 | `{"model":"9800X3D","socket":"AM5","package":"MULTIPACK"}` |
| 2 | 1001 | 20001 | 21001 | OFFER | ADMIN_CONFIRMED | 96 | `{"model":"9800X3D","socket":"AM5","package":"MULTIPACK"}` |
| 3 | 5001 | 10002 | 13001 | OFFER | AUTO_MATCHED | 92 | `{"series":"990 EVO Plus","capacity_gb":1024,"form_factor":"M.2 2280"}` |

---

## Specs

원본 스펙은 그대로 저장하고, 호환성에 필요한 값만 정규화한다.

### raw_spec_sources

| id | part_id | supplier_product_id | supplier_offer_id | supplier_id | external_product_id | source_type | parse_status | captured_at |
|---:|---:|---:|---:|---:|---|---|---|---|
| 90001 | 1001 | 20001 | 21001 | 2 | 70531547 | DETAIL_TABLE | PARSED | 2026-05-23 19:07:17 |
| 90002 | 1001 | 10001 | 11001 | 1 | 1187400 | LIST_SUMMARY | PARSED | 2026-05-23 20:18:43 |

### raw_spec_items

| id | raw_spec_source_id | section_name | source_key | source_value | normalized_key | normalized_value_json |
|---:|---:|---|---|---|---|---|
| 1 | 90001 | 기본 | 소켓 구분 | AMD(소켓AM5) | socket | `{"text":"AM5"}` |
| 2 | 90001 | 기본 | 코어 수 | 8코어 | core_count | `{"number":8}` |
| 3 | 90001 | 사양 | TDP | 120W | tdp_w | `{"number":120,"unit":"W"}` |

### cpu_specs

| part_id | socket | family | generation | codename | core_count | thread_count | base_clock_ghz | boost_clock_ghz | l3_cache_mb | tdp_w | memory_types_json | has_integrated_graphics |
|---:|---|---|---|---|---:|---:|---:|---:|---:|---:|---|---|
| 1001 | AM5 | Ryzen 7 | Zen5 | Granite Ridge | 8 | 16 | 4.7 | 5.2 | 96 | 120 | `["DDR5"]` | true |

---

## Quote / Order

견적과 주문은 `supplier_offer_id`를 참조한다. 그러면 별도로 `supplier_product_id`와 `supplier_listing_variant_id`를 둘 다 들고 다닐 필요가 없다.

### quote_items

| id | quote_id | category_id | part_id | supplier_offer_id | quantity | current_public_price | sort_order |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 50001 | 1 | 1001 | 11001 | 1 | 590000 | 10 |
| 2 | 50001 | 3 | 2001 | null | 1 | 129000 | 20 |
| 3 | 50001 | 4 | 3001 | null | 2 | 340000 | 30 |
| 4 | 50001 | 5 | 4001 | null | 1 | 484890 | 40 |
| 5 | 50001 | 6 | 5001 | 13001 | 1 | 473000 | 50 |
| 6 | 50001 | 7 | 6001 | 14001 | 1 | 141000 | 60 |
| 7 | 50001 | 8 | 7001 | null | 1 | 43900 | 70 |
| 8 | 50001 | 2 | 8001 | null | 1 | 23500 | 80 |

### order_items

주문은 스냅샷이므로 당시 상품명/가격/URL을 반드시 복사한다.

| id | order_id | category_code | part_id | supplier_offer_id | part_name_snapshot | supplier_code_snapshot | external_offer_id_snapshot | offer_name_snapshot | quantity | public_price | total_public_price |
|---:|---:|---|---:|---:|---|---|---|---|---:|---:|---:|
| 1 | 70001 | CPU | 1001 | 11001 | AMD Ryzen 7 9800X3D | compuzone | 1187400 | [AMD] 라이젠7 그래니트 9800X3D [멀티팩] | 1 | 590000 | 590000 |
| 2 | 70001 | RAM | 3001 | null | G.SKILL DDR5-6000 CL36 AEGIS 5 16GB | compuzone | 1197279 | [G.SKILL] DDR5 PC5-48000 CL36 AEGIS 5 [16GB] | 2 | 340000 | 680000 |
| 3 | 70001 | GPU | 4001 | null | MSI RTX 5060 Ventus 2X OC D7 8GB | danawa | 90956033 | MSI 지포스 RTX 5060 벤투스 2X OC D7 8GB | 1 | 484890 | 484890 |
| 4 | 70001 | CASE | 7001 | null | OH'S NICE Black | compuzone | 1350175 | [OH’S] NICE [미들타워] [블랙] | 1 | 43900 | 43900 |
