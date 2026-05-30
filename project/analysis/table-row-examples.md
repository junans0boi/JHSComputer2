# 테이블별 예시 데이터

> 작성일: 2026-05-23
기준 샘플:
>
> - `project/samples/compuzone/2026-05-23_11-18-43`
> - `project/samples/danawa/2026-05-23-10-07-17`
> - `project/samples/danawa/2026-05-23-11-12-31`

이 문서는 실제 insert SQL이 아니라 **각 테이블에 어떤 모양으로 데이터가 들어갈지 보여주는 예시**다. ID는 이해를 위해 임의로 고정했다.

---

## users

| id | email | name | nickname | phone | role | status | provider_user_id | provider |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | admin@jhstv.local | 정효성 | 효성TV | 010-0000-0000 | ADMIN | ACTIVE |  | email |
| 2 | buyer@example.com | 김구매 | 배그유저 | 010-1111-2222 | USER | ACTIVE |  | email |
| 3 | buyer@example.com | 김팔숙 | 김목지 | 010-9392-1203 | USER | ACTIVE | kakao-987654321 | KAKAO |
| 4 | ackdock@example.com | 김악덕 | 악덕구매자 | 010-1231-2452 | USER | BLOCK | kakao-38484899 | KAKAO |

---

## part_categories

- 부품별 카테고리

| id | code | name | sort_order | is_required_for_build |
| --- | --- | --- | --- | --- |
| 1 | CPU | CPU | 10 | true |
| 2 | CPUCOOLER | CPU 쿨러 | 20 | true |
| 3 | MAINBOARD | 메인보드 | 30 | true |
| 4 | RAM | 메모리 | 40 | true |
| 5 | GPU | 그래픽카드 | 50 | true |
| 6 | SSD | SSD | 60 | true |
| 7 | PSU | 파워 | 70 | true |
| 8 | CASE | 케이스 | 80 | true |
| 9 | COOLER | 케이스 쿨러 | 90 | false |
| 10 | TuningSupplies | 튜닝 용품 | 100 | false |

## parts

`parts`는 견적에 실제로 들어가는 표준 부품이다. CPU 패키지 차이는 같은 `parts`에 묶고, SSD 용량/PSU 와트/케이스 색상처럼 견적 선택 조건이 달라지는 옵션은 다른 `parts`로 둔다.

| id | category_id | canonical_name | manufacturer | formfactor | model_name | model_key | status | is_admin_approved | spec_status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1001 | 1 | AMD Ryzen 7 9800X3D | AMD | Ryzen 7 9800X3D | Ryzen 7 9800X3D | amd-ryzen-7-9800x3d | ACTIVE | true | AUTO_PARSED |
| 2001 | 3 | MSI PRO B650M-P | MSI | B650M | PRO B650M-P | msi-pro-b650m-p | ACTIVE | true | AUTO_PARSED |
| 3001 | 4 | G.SKILL DDR5-6000 CL36 AEGIS 5 16GB | G.SKILL | DDR5 | DDR5-6000 CL36 AEGIS 5 16GB | gskill-ddr5-6000-cl36-aegis5-16gb | ACTIVE | true | AUTO_PARSED |
| 3002 | 4 | G.SKILL DDR5-6000 CL36 AEGIS 5 32GB | G.SKILL | DDR5 | DDR5-6000 CL36 AEGIS 5 32GB | gskill-ddr5-6000-cl36-aegis5-32gb | ACTIVE | true | AUTO_PARSED |
| 4001 | 5 | MSI GeForce RTX 5060 Ventus 2X OC D7 8GB | MSI | RTX 5060 | RTX 5060 Ventus 2X OC D7 8GB | msi-rtx-5060-ventus-2x-oc-d7-8gb | ACTIVE | true | AUTO_PARSED |
| 5001 | 6 | Samsung 990 EVO Plus M.2 NVMe 1TB | 삼성전자 | M.2 NVME | 990 EVO Plus 1TB | samsung-990-evo-plus-1tb | ACTIVE | true | AUTO_PARSED |
| 5002 | 6 | Samsung 990 EVO Plus M.2 NVMe 2TB | 삼성전자 | M.2 NVME | 990 EVO Plus 2TB | samsung-990-evo-plus-2tb | ACTIVE | true | AUTO_PARSED |
| 5003 | 6 | Samsung 990 EVO Plus M.2 NVMe 4TB | 삼성전자 | M.2 NVME | 990 EVO Plus 4TB | samsung-990-evo-plus-4tb | ACTIVE | true | AUTO_PARSED |
| 6001 | 7 | Micronics Classic II 850W 80PLUS Gold Full Modular ATX3.1 Black | 마이크로닉스 | ATX | Classic II 850W Gold ATX3.1 Black | micronics-classic-ii-850w-gold-atx31-black | ACTIVE | true | AUTO_PARSED |
| 6002 | 7 | Micronics Classic II 750W 80PLUS Gold Full Modular ATX3.1 Black | 마이크로닉스 | ATX | Classic II 750W Gold ATX3.1 Black | micronics-classic-ii-750w-gold-atx31-black | ACTIVE | true | AUTO_PARSED |
| 7001 | 8 | OH'S NICE Middle Tower Black | OH'S | MiddleTower  | NICE Black | ohs-nice-black | ACTIVE | true | AUTO_PARSED |
| 7002 | 8 | OH'S NICE Middle Tower White | OH'S | MiddleTower  | NICE White | ohs-nice-white | ACTIVE | true | AUTO_PARSED |
| 8001 | 2 | EDDY CY100A ARGB CPU Cooler Black | 에디 | ? | CY100A ARGB Black | eddy-cy100a-argb-black | ACTIVE | true | AUTO_PARSED |

---

## suppliers

- [공급사]

| id | code | name | base_url | status |
| --- | --- | --- | --- | --- |
| 1 | compuzone | 컴퓨존 | [https://www.compuzone.co.kr](https://www.compuzone.co.kr/) | ACTIVE |
| 2 | danawa | 다나와 | [https://prod.danawa.com](https://prod.danawa.com/) | ACTIVE |

## supplier_categories

- 해당 테이블도 좀 수정이 필요할듯
- 컴퓨존
    - 컴퓨터 부품 : https://www.compuzone.co.kr/product/productB_new_list.htm?BigDivNo=4
    - CPU : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1012
        - AMD CPU: https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1012&DivNo=2033
        - 인텔 정품 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1012&DivNo=2032
        - 인텔 병입수입 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1012&DivNo=3452
        - 서버 CPU : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1012&DivNo=3280

    ---

    - 메인보드 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1013
        - AMD 소켓 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1013&DivNo=2035
        - 인텔 소켓 1851 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1013&DivNo=4724
        - 인텔 소켓 1700 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1013&DivNo=4560
        - 인텔 소켓 1200 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1013&DivNo=4421
        - 인텔 소켓 1151-V2 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1013&DivNo=3480
        - 인텔 소켓 1151 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1013&DivNo=3209
        - 인텔 소켓 1150/1155 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1013&DivNo=2953

    ---

    - 메모리 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1014
        - PC용 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1014&DivNo=2036
        - XMP/EXPO 메모리 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1014&DivNo=2474

    ---

    - SSD : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1276
        - 2.5형 SSD : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1276&DivNo=3399
        - M.2(NVMe) : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1276&DivNo=3400

    ---

    - 그래픽카드 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1016
        - NVIDIA 그래픽카드 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1016&DivNo=2043
        - AMD 그래픽카드 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1016&DivNo=2042
        - INTEL 그래픽카드 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1016&DivNo=4682

    ---

    - 케이스 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1147
        - 미들타워 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1147&DivNo=2750
        - 미니타워 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1147&DivNo=2751
        - 빅타워 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1147&DivNo=2749
        - ITX/HTPC : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1147&DivNo=2752

    ---

    - 파워 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1148
        - ATX : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1148&DivNo=2754
        - M-ATX : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1148&DivNo=2755

    ---

    - 쿨러/튜닝용품 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1020
        - CPU쿨러(공랭) : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1020&DivNo=2054
        - CPU쿨러(수랭) : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1020&DivNo=4582
        - 케이스 쿨러 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1020&DivNo=2649
        - 튜닝용품 : https://www.compuzone.co.kr/product/product_list.htm?BigDivNo=4&MediumDivNo=1020&DivNo=2055
- 다나와
    - 30개씩 여러 페이지로 끊어짐
    - CPU :https://prod.danawa.com/list/?cate=112747&15main_11_02
        - AMD CPU: https://prod.danawa.com/list/?cate=113990
        - 인텔 : https://prod.danawa.com/list/?cate=113973
        - 인텔 14세대 : https://prod.danawa.com/list/?cate=113990
        - 서버 CPU :https://prod.danawa.com/list/?cate=11336852
        - AI/딥러닝 CPU : https://prod.danawa.com/list/?cate=11253738
        - 내장 그래픽 CPU : https://prod.danawa.com/list/?cate=11353294

    ---

    - 메인보드 : https://prod.danawa.com/list/?cate=112751
        - AMD 소켓 :https://prod.danawa.com/list/?cate=1131249
        - AMD AM5 : https://prod.danawa.com/list/?cate=11353759
        - DDR 5지원 : https://prod.danawa.com/list/?cate=11345283
        - AMD AM4 : https://prod.danawa.com/list/?cate=11445296
        - 인텔 소켓 1851 : https://prod.danawa.com/list/?cate=11354784
        - 인텔 소켓 1700 : https://prod.danawa.com/list/?cate=11353758
        - 인텔 12세대 최적 : https://prod.danawa.com/list/?cate=11441244
        - 인텔 11세대 최적 : https://prod.danawa.com/list/?cate=11439575
        - 인텔 10세대 최적 : https://prod.danawa.com/list/?cate=11437107

    ---

    - 메모리 : https://prod.danawa.com/list/?cate=112752
        - PC용 DDR5 : https://prod.danawa.com/list/?cate=11341201
        - PC용 DDR4 : https://prod.danawa.com/list/?cate=1131326
        - XMP/EXPO 메모리 : https://prod.danawa.com/list/?cate=11317756

    ---

    - SSD : https://prod.danawa.com/list/?cate=112760
        - 2.5형 SSD : https://prod.danawa.com/list/?cate=11335283
        - M.2(NVMe) : https://prod.danawa.com/list/?cate=11335282

    ---

    - 그래픽카드 : https://prod.danawa.com/list/?cate=112753
        - NVIDIA 그래픽카드 : https://prod.danawa.com/list/?cate=1131480
        - 지포스 RTX 5050 : https://prod.danawa.com/list/?cate=11455733
        - 지포스 RTX 5060 : https://prod.danawa.com/list/?cate=11455678
        - 지포스 RTX 5060 Ti : https://prod.danawa.com/list/?cate=11455506
        - 지포스 RTX 5070 : https://prod.danawa.com/list/?cate=11455183
        - 지포스 RTX 5070 Ti : https://prod.danawa.com/list/?cate=11455109
        - 지포스 RTX 5080 : https://prod.danawa.com/list/?cate=11455089
        - 지포스 RTX 5090: https://prod.danawa.com/list/?cate=11455088
        - AMD 그래픽카드 : https://prod.danawa.com/list/?cate=1131521
        - 라데온 RX 9060 XT : https://prod.danawa.com/list/?cate=11455694
        - 라데온 RX 9070 XT : https://prod.danawa.com/list/?cate=11455184
        - 라데온 RX 9070 : https://prod.danawa.com/list/?cate=11455185
        - 라데온 RX 7600 : https://prod.danawa.com/list/?cate=11448500
        - 라데온 RX 6600 : https://prod.danawa.com/list/?cate=11443122
        - INTEL 그래픽카드 : https://prod.danawa.com/list/?cate=11347368
        - AI/딥러닝 : VGA : https://prod.danawa.com/list/?cate=11253739

    ---

    - 케이스 : https://prod.danawa.com/list/?cate=112775
        - 일반 PC케이스 : https://prod.danawa.com/list/?cate=113971
        - 측면 유리 케이스 : https://prod.danawa.com/list/?cate=113979
        - 어항 케이스 : https://prod.danawa.com/list/?cate=11354773

    ---

    - 파워 : https://prod.danawa.com/list/?cate=112777
        - ATX 3.x : https://prod.danawa.com/list/?cate=1131496
        - M-ATX 3.x : https://prod.danawa.com/list/?cate=1131496
        - 모듈러 파워 : https://prod.danawa.com/list/?cate=1131590
        - 80 Plus 인증 : https://prod.danawa.com/list/?cate=11338807

    ---

    - 쿨러/튜닝용품 : https://prod.danawa.com/list/?cate=11236855
        - 쿨러 : https://prod.danawa.com/list/?cate=11236855
        - CPU쿨러(공랭) : https://prod.danawa.com/list/?cate=11336857
        - CPU쿨러(수랭) : https://prod.danawa.com/list/?cate=11336856
        - 케이스 쿨러 : https://prod.danawa.com/list/?cate=11312471, https://prod.danawa.com/list/?cate=11336858
        - 튜닝용품 : https://prod.danawa.com/list/?cate=11353457


| id | supplier_id | our_part_category_id | external_category_code | external_parent_codes_json | external_big_div_no | external_medium_div_no | external_div_no | name |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 101 | 1 | 1 | null | null | 4 | 1012 | 0 | 컴퓨존 CPU |
| 102 | 1 | 2 | null | null | 4 | 1020 | 2054 | 컴퓨존 CPU쿨러(공랭) |
| 103 | 1 | 3 | null | null | 4 | 1013 | 0 | 컴퓨존 메인보드 |
| 106 | 1 | 6 | null | null | 4 | 1276 | 0 | 컴퓨존 SSD |
| 107 | 1 | 7 | null | null | 4 | 1148 | 0 | 컴퓨존 파워 |
| 108 | 1 | 8 | null | null | 4 | 1147 | 0 | 컴퓨존 케이스 |
| 201 | 2 | 1 | 112747 | `[861,873,959]` | null | null | null | 다나와 CPU |
| 203 | 2 | 3 | 112751 | `[861,875,968]` | null | null | null | 다나와 메인보드 |
| 206 | 2 | 6 | 112760 | `[861,876,977]` | null | null | null | 다나와 SSD |

---

## supplier_listings

- 컴퓨존/다나와/기타 쇼핑몰에 등록된 실제 상품명

| id | part_id | supplier_id | supplier_category_id | external_product_id | product_name | package_type | match_status | match_confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 10001 | 1001 | 1 | 101 | 1187400 | [AMD] 라이젠7 그래니트 9800X3D (8코어/16스레드/4.7GHz/쿨러미포함) | MULTIPACK | AUTO_MATCHED | 96 |
| 10002 | 2001 | 1 | 103 | 1028287 | [MSI] PRO B650M-P (AMD B650/M-ATX) | null | AUTO_MATCHED | 98 |
| 10003 | null | 1 | 106 | 1182756 | [삼성전자] 공식인증 990 EVO Plus M.2 NVMe 2280 | null | AUTO_MATCHED | 92 |
| 10004 | null | 1 | 107 | 1143770 | [마이크로닉스] Classic II 80PLUS GOLD 풀모듈러 ATX3.1 (PCIE5.1) | null | AUTO_MATCHED | 90 |
| 10005 | null | 1 | 108 | 1350175 | [OH’S] NICE [미들타워] | null | AUTO_MATCHED | 90 |
| 10006 | 8001 | 1 | 102 | 1274544 | [에디] CY100A ARGB [CPU쿨러/120mm] [블랙] | null | AUTO_MATCHED | 88 |
| 20001 | 1001 | 2 | 201 | 70531547 | AMD 라이젠7-6세대 9800X3D (그래니트 릿지) | MULTIPACK | AUTO_MATCHED | 96 |
| 20002 | 2001 | 2 | 203 | 20108249 | MSI PRO B650M-P | null | AUTO_MATCHED | 98 |
| 20003 | null | 2 | 206 | 69869543 | 삼성전자 990 EVO Plus M.2 NVMe | null | AUTO_MATCHED | 92 |
| 20004 | 4001 | 2 | null | 90956033 | MSI 지포스 RTX 5060 벤투스 2X OC D7 8GB | null | AUTO_MATCHED | 91 |

예시 URL:

| supplier_listing_id | product_url |
| --- | --- |
| 10001 | https://www.compuzone.co.kr/product/product_detail.htm?ProductNo=1187400&BigDivNo=4&MediumDivNo=1012&DivNo=0 |
| 20001 | https://prod.danawa.com/info/?pcode=70531547 |

## supplier_listing_variants

- 이거 테이블 무슨 뜻인지 모르겠음

| id | supplier_listing_id | part_id | external_variant_product_id | variant_name | variant_kind | variant_attributes_json | package_type | cooler_included | public_price | is_default | is_active |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 11001 | 10001 | 1001 | 1187400 | [멀티팩] | PACKAGE | `{}` | MULTIPACK | false | 590000 | true | true |
| 21001 | 20001 | 1001 | 70531547 | 멀티팩 정품 | PACKAGE | `{}` | MULTIPACK | false | 582360 | true | true |
| 21002 | 20001 | 1001 | 70679912 | 정품 | PACKAGE | `{}` | BOX | true | null | false | true |
| 21003 | 20001 | 1001 | 92233121 | 해외구매 | PACKAGE | `{}` | OVERSEAS | null | null | false | false |
| 13001 | 10003 | 5001 | 1182756 | [1TB] | CAPACITY | `{"capacity_gb":1024}` | null | null | 473000 | true | true |
| 13002 | 10003 | 5002 | 1182755 | [2TB] | CAPACITY | `{"capacity_gb":2048}` | null | null | 941000 | false | true |
| 13003 | 10003 | 5003 | 1182754 | [4TB] | CAPACITY | `{"capacity_gb":4096}` | null | null | 1697000 | false | true |
| 14001 | 10004 | 6002 | 1157333 | [750W] [블랙] 230V EU | WATTAGE | `{"wattage":750,"color":"black"}` | null | null | 129000 | false | true |
| 14002 | 10004 | 6001 | 1143770 | [850W] [블랙] 230V EU | WATTAGE | `{"wattage":850,"color":"black"}` | null | null | 141000 | true | true |
| 15001 | 10005 | 7002 | 1350174 | [화이트] | COLOR | `{"color":"white"}` | null | null | 53000 | false | true |
| 15002 | 10005 | 7001 | 1350175 | [블랙] | COLOR | `{"color":"black"}` | null | null | 43900 | true | true |

주의: 최신 컴퓨존 샘플에서 일부 옵션 가격이 `340000306000`처럼 붙어서 파싱된 사례가 있었다. 실제 저장 전 옵션 가격 파서는 정상가/할인가 중 하나를 명확히 선택하도록 보정해야 한다.

---

## listing_matches

| id | part_id | source_supplier_listing_id | target_supplier_listing_id | match_scope | match_status | confidence | evidence_json |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1001 | 10001 | 20001 | MODEL | ADMIN_CONFIRMED | 96 | `{"model":"9800X3D","socket":"AM5","cores":8,"threads":16,"package_ignored":true}` |
| 2 | 2001 | 10002 | 20002 | EXACT_SELLING_UNIT | ADMIN_CONFIRMED | 98 | `{"brand":"MSI","model":"PRO B650M-P","chipset":"B650","form_factor":"M-ATX"}` |
| 3 | 5001 | 10003 | 20003 | MODEL | AUTO_MATCHED | 92 | `{"brand":"삼성전자","series":"990 EVO Plus","form_factor":"M.2 2280","variant":"1TB"}` |

---

## part_prices[확정]

가격은 덮어쓰지 않고 이력으로 계속 쌓는다. 현재가는 `captured_at`이 가장 최신인 행을 조회한다.

| id | supplier_listing_id | supplier_listing_variant_id | public_price | original_price | discount_price | stock_status | source_type | captured_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 10001 | 11001 | 590000 | 590000 | 590000 | IN_STOCK | SCHEDULED_CRAWL | 2026-05-23 20:18:43 |
| 2 | 20001 | 21001 | 582360 | null | 582360 | IN_STOCK | SCHEDULED_CRAWL | 2026-05-23 19:07:17 |
| 3 | 10002 | null | 129000 | 129000 | 129000 | IN_STOCK | SCHEDULED_CRAWL | 2026-05-23 20:18:43 |
| 4 | 10003 | 13001 | 473000 | 473000 | 473000 | IN_STOCK | SCHEDULED_CRAWL | 2026-05-23 20:18:43 |
| 5 | 10003 | 13002 | 941000 | 941000 | 941000 | IN_STOCK | SCHEDULED_CRAWL | 2026-05-23 20:18:43 |

## dealer_price_rules

- 이건 확정을 할수가 없는게 부품별로 할인가가 다른데 이게 똑같은 할인율인지는 모름 아직.
- 가격 비교
    - **[AMD] 라이젠7 라파엘 7800X3D (8코어/16스레드/4.2GHz/쿨러미포함) 멀티팩**
        - 판매가 : 403,000원
        - 혜택가 : 392,500원
        - 판매가403,000원
            - 맞춤할인(무통장결제시 적용)-10,500원
            - 제품적립금-810원
            - 회원등급별 적립금-1,210원
            - 무통장 적립금-8,480원
    - **[INTEL] 코어 i3-14100 정품벌크 (랩터레이크 리프레시/3.5GHz/12MB/쿨러 미포함)**
        - 판매가 : **185,000**원
        - 혜택가 : **180,000**원
        - 판매가185,000원
            - 맞춤할인(무통장결제시 적용)-5,000원
            - 제품적립금-370원
            - 회원등급별 적립금-560원
            - 무통장 적립금-4,070원
    - **[MSI] 지포스 RTX 5060 Ti 벤투스 2X OC 플러스 D7 8GB**
        - 판매가 : **600,680**원
        - 혜택가 : **585,670**원
        - 판매가**600,680**원
            - 맞춤할인(무통장결제시 적용)-15,010원
            - 제품적립금-1,200원
            - 회원등급별 적립금-1,800원
            - 무통장 적립금-12,010원
    - [삼성전자] 공식인증 990 EVO Plus M.2 NVMe 2280
        - 판매가 : **473,000**원
        - 혜택가 : **454,000**원
        - 판매가**473,000**원
            - 맞춤할인(무통장결제시 적용)-19,000원
            - 제품적립금-950원
            - 회원등급별 적립금-1,420원
            - 무통장 적립금-16,630원
    - **[MSI] PRO B650M-P (AMD B650/M-ATX)**
        - 판매가 : **129,000**원
        - 혜택가 : **122,000**원
        - 판매가**129,000**원
            - 맞춤할인(무통장결제시 적용)-7,000원
            - 제품적립금-260원
            - 회원등급별 적립금-390원
            - 무통장 적립금-6,350원
    - **[삼성전자] 삼성 DDR5 PC5-44800 [16GB] (5600)**
        - 판매가 : **349,000**원
        - 혜택가 : **338,000**원
        - 판매가**349,000**원
            - 맞춤할인(무통장결제시 적용)-11,000원
            - 제품적립금-700원
            - 회원등급별 적립금-1,050원
            - 무통장 적립금-9,250원
    - **[마이크로닉스] Classic II 80PLUS GOLD 풀모듈러 ATX3.1 (PCIE5.1) [850W] [블랙] 230V EU**
        - 판매가 : **141,000**원
        - 혜택가 : **136,750**원
        - 판매가**141,000**원
            - 맞춤할인(무통장결제시 적용)-4,250원
            - 제품적립금-280원
            - 회원등급별 적립금-420원
            - 무통장 적립금-3,550원

    위 데이터를 보면 뭐 할인율이 있어?


| id | category_id | supplier_id | estimated_discount_rate | is_active | memo |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 0.03 | true | 컴퓨존 딜러 CPU 예상 할인율 |
| 2 | 5 | 1 | 0.02 | true | 그래픽카드 예상 할인율 |
| 3 | null | 1 | 0.025 | true | 카테고리 미지정 기본값 |

---

## part_spec_sources

| id | part_id | supplier_listing_id | supplier_listing_variant_id | supplier_id | external_product_id | source_type | parse_status | captured_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 90001 | 1001 | 20001 | 21001 | 2 | 70531547 | DETAIL_TABLE | PARSED | 2026-05-23 19:07:17 |
| 90002 | 1001 | 10001 | 11001 | 1 | 1187400 | LIST_SUMMARY | PARSED | 2026-05-23 20:18:43 |
| 90003 | 2001 | 20002 | null | 2 | 20108249 | DETAIL_TABLE | PARSED | 2026-05-23 20:12:31 |
| 90004 | 5001 | 20003 | null | 2 | 69869543 | DETAIL_TABLE | PARSED | 2026-05-23 20:12:31 |

예시 원본:

| id | raw_spec_text / raw_spec_json 일부 |
| --- | --- |
| 90001 | `[{"section":null,"key":"소켓 구분","value":"AMD(소켓AM5)"},{"section":null,"key":"코어 수","value":"8코어"}]` |
| 90002 | `8코어 / 16스레드 / 4.7GHz / L3 : 32MB / 3D V-Cache : 96MB / TDP : 120w / 4nm / ...` |

## part_spec_source_items

| id | part_spec_source_id | section_name | source_key | source_value | normalized_key | normalized_value_json |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 90001 | 기본 | 소켓 구분 | AMD(소켓AM5) | socket | `{"text":"AM5"}` |
| 2 | 90001 | 기본 | 코어 수 | 8코어 | core_count | `{"number":8}` |
| 3 | 90001 | 기본 | 스레드 수 | 16스레드 | thread_count | `{"number":16}` |
| 4 | 90001 | 사양 | TDP | 120W | tdp_w | `{"number":120,"unit":"W"}` |
| 5 | 90003 | 기본 사양 | 세부 칩셋 | AMD B650 | chipset | `{"text":"B650"}` |

## part_spec_values

보조 인덱스 예시다. 정답 스펙은 아래 카테고리별 스펙 테이블을 우선한다.

| id | part_id | spec_key | value_text | value_number | value_bool | unit | source | is_verified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1001 | socket | AM5 | null | null | null | IMPORTED | true |
| 2 | 1001 | core_count | null | 8 | null | cores | IMPORTED | true |
| 3 | 1001 | has_integrated_graphics | null | null | true | null | IMPORTED | true |
| 4 | 2001 | form_factor | M-ATX | null | null | null | IMPORTED | true |
| 5 | 5001 | capacity_gb | null | 1024 | null | GB | IMPORTED | true |

---

## cpu_specs

| part_id | socket | family | generation | codename | core_count | thread_count | base_clock_ghz | boost_clock_ghz | l3_cache_mb | tdp_w | memory_types_json | has_integrated_graphics | integrated_graphics_name |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1001 | AM5 | Ryzen 7 | Zen5 | Granite Ridge | 8 | 16 | 4.7 | 5.2 | 96 | 120 | `["DDR5"]` | true | AMD Radeon Graphics |

## gpu_specs

| part_id | chipset_maker | chipset_name | series_name | memory_type | memory_gb | interface | recommended_psu_w | power_consumption_w | length_mm | display_outputs_json |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4001 | NVIDIA | RTX 5060 | GeForce RTX 50 | GDDR7 | 8 | PCIe5.0x16(at x8) | 550 | 145 | 197 | `{"DisplayPort":3,"HDMI":1}` |

## mainboard_specs

| part_id | socket | chipset | form_factor | memory_type | memory_slot_count | max_memory_gb | m2_slot_count | sata_port_count | wifi_builtin |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2001 | AM5 | B650 | M-ATX | DDR5 | 4 | 256 | 2 | 4 | false |

## ram_specs

| part_id | memory_type | capacity_gb | module_count | speed_mhz | profile_type |
| --- | --- | --- | --- | --- | --- |
| 3001 | DDR5 | 16 | 1 | 6000 | XMP3.0/EXPO |
| 3002 | DDR5 | 32 | 1 | 6000 | XMP3.0/EXPO |

## storage_specs

| part_id | storage_type | form_factor | interface | capacity_gb | sequential_read_mbps | sequential_write_mbps |
| --- | --- | --- | --- | --- | --- | --- |
| 5001 | SSD | M.2 2280 | PCIe4.0x4 / PCIe5.0x2 | 1024 | 7150 | 6300 |
| 5002 | SSD | M.2 2280 | PCIe4.0x4 / PCIe5.0x2 | 2048 | null | null |

## psu_specs

| part_id | form_factor | rated_wattage | certification | modular_type | pcie_5_ready | connector_json |
| --- | --- | --- | --- | --- | --- | --- |
| 6001 | ATX | 850 | 80PLUS Gold | Full Modular | true | `{"pcie_12v2x6":1,"pcie_8pin":3,"sata":8}` |
| 6002 | ATX | 750 | 80PLUS Gold | Full Modular | true | `{"pcie_12v2x6":1}` |

## case_specs

| part_id | case_type | color | supported_board_forms_json | max_gpu_length_mm | max_cooler_height_mm | fan_count |
| --- | --- | --- | --- | --- | --- | --- |
| 7001 | Middle Tower | black | `["ATX","M-ATX","M-ITX"]` | 400 | 165 | 3 |
| 7002 | Middle Tower | white | `["ATX","M-ATX","M-ITX"]` | 400 | 165 | 3 |

## cooler_specs

| part_id | cooler_type | color | supported_sockets_json | height_mm | fan_size_mm | tdp_rating_w |
| --- | --- | --- | --- | --- | --- | --- |
| 8001 | AIR | black | `["LGA1851","LGA1700","LGA115x","LGA1200","AM4","AM5"]` | 148 | 120 | 230 |

---

## crawl_runs

| id | supplier_id | target_type | status | started_at | finished_at | request_count | parsed_count | error_count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | CATEGORY_LIST | SUCCESS | 2026-05-23 20:18:43 | 2026-05-23 20:23:10 | 48 | 800 | 0 |
| 2 | 2 | PRODUCT_DETAIL | SUCCESS | 2026-05-23 20:12:31 | 2026-05-23 20:13:13 | 18 | 6 | 0 |

## crawl_items

| id | crawl_run_id | supplier_listing_id | target_url | status | http_status | raw_html_hash | parsed_json |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | null | https://www.compuzone.co.kr/product/product_list.php?MediumDivNo=1012 | SUCCESS | 200 | sha256:... | `{"category":"CPU","products":100,"variants":31}` |
| 2 | 2 | 20001 | https://prod.danawa.com/info/?pcode=70531547 | SUCCESS | 200 | sha256:... | `{"specCount":33,"variantCount":3}` |

---

## quote_templates

| id | name | budget_min | budget_max | purpose | resolution | priority_type | is_active |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 200만원 QHD 게임용 | 1800000 | 2200000 | GAME | QHD | PERFORMANCE | true |

## quote_template_items

| id | template_id | category_id | part_id | is_replaceable | sort_order |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1001 | true | 10 |
| 2 | 1 | 3 | 2001 | true | 20 |
| 3 | 1 | 4 | 3001 | true | 30 |
| 4 | 1 | 6 | 5001 | true | 40 |
| 5 | 1 | 2 | 8001 | true | 50 |

## games

| id | name | slug | priority | is_active |
| --- | --- | --- | --- | --- |
| 1 | 리그 오브 레전드 | lol | 10 | true |
| 2 | 배틀그라운드 | pubg | 20 | true |
| 3 | 발로란트 | valorant | 30 | true |
| 4 | 로스트아크 | lostark | 40 | true |
| 5 | 오버워치 2 | overwatch-2 | 50 | true |

## game_requirements

| id | game_id | resolution | target_fps | quality_preset | cpu_score_min | gpu_score_min | ram_gb_min |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2 | QHD | 144 | HIGH | 8000 | 13000 | 16 |

## performance_estimates

| id | game_id | cpu_part_id | gpu_part_id | resolution | quality_preset | fps_min | fps_max | grade | source_summary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2 | 1001 | 4001 | QHD | HIGH | 120 | 170 | GOOD | 다나와 스펙 + 외부 벤치 수동 가공 예정 예시 |

---

## quotes

| id | user_id | template_id | status | budget_amount | budget_scope | purpose | resolution | monitor_input | priority_type | subtotal_parts_price | assembly_fee | shipping_fee | total_price |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 50001 | 100 | 1 | ACTIVE | 2000000 | BODY_ONLY | GAME | QHD | LG 27GP850 | PERFORMANCE | 1356500 | 80000 | 10000 | 1446500 |

## quote_items

| id | quote_id | category_id | part_id | supplier_listing_id | supplier_listing_variant_id | quantity | current_public_price | estimated_buy_price | estimated_margin | sort_order |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 50001 | 1 | 1001 | 10001 | 11001 | 1 | 590000 | 572300 | 17700 | 10 |
| 2 | 50001 | 3 | 2001 | 10002 | null | 1 | 129000 | 125130 | 3870 | 20 |
| 3 | 50001 | 6 | 5001 | 10003 | 13001 | 1 | 473000 | 461175 | 11825 | 30 |
| 4 | 50001 | 2 | 8001 | 10006 | null | 1 | 23500 | 22912 | 588 | 40 |
| 5 | 50001 | 7 | 6001 | 10004 | 14002 | 1 | 141000 | 137475 | 3525 | 50 |

## quote_histories

| id | quote_id | actor_user_id | event_type | before_json | after_json | created_at |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 50001 | 100 | CREATED | null | `{"total_price":1446500}` | 2026-05-23 21:00:00 |
| 2 | 50001 | 100 | ITEM_CHANGED | `{"ssd":"1TB"}` | `{"ssd":"2TB"}` | 2026-05-23 21:03:00 |

## compatibility_checks

| id | quote_id | status | summary | detail_json | checked_at |
| --- | --- | --- | --- | --- | --- |
| 1 | 50001 | PASS | 호환성 체크 통과 | `{"CPU_MAINBOARD_SOCKET":{"status":"PASS","cpu_socket":"AM5","mainboard_socket":"AM5"},"CASE_GPU_LENGTH":{"status":"PASS","case_max_gpu_length_mm":400,"gpu_length_mm":197},"PSU_WATTAGE":{"status":"PASS","recommended_psu_w":550,"selected_psu_w":850}}` | 2026-05-23 21:04:00 |

## price_check_logs

| id | quote_id | status | before_total_price | after_total_price | changed_items_json | checked_at |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 50001 | SAME | 1446500 | 1446500 | `[]` | 2026-05-23 21:05:00 |
| 2 | 50001 | CHANGED | 1446500 | 1456500 | `[{"part_id":1001,"old":590000,"new":600000}]` | 2026-05-24 10:00:00 |

---

## orders

| id | quote_id | user_id | status | recipient_name | recipient_phone | postal_code | address1 | address2 | subtotal_parts_price | assembly_fee | shipping_fee | total_price |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 70001 | 50001 | 100 | ADMIN_REVIEW | 김구매 | 010-1111-2222 | 06123 | 서울시 강남구 예시로 123 | 101호 | 1356500 | 80000 | 10000 | 1446500 |

## order_items

| id | order_id | category_code | part_id | supplier_listing_id | supplier_listing_variant_id | part_name_snapshot | supplier_code_snapshot | supplier_product_id_snapshot | quantity | public_price | total_public_price | estimated_buy_price | actual_buy_price |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 70001 | CPU | 1001 | 10001 | 11001 | AMD Ryzen 7 9800X3D | compuzone | 1187400 | 1 | 590000 | 590000 | 572300 | null |
| 2 | 70001 | MAINBOARD | 2001 | 10002 | null | MSI PRO B650M-P | compuzone | 1028287 | 1 | 129000 | 129000 | 125130 | null |
| 3 | 70001 | SSD | 5001 | 10003 | 13001 | Samsung 990 EVO Plus 1TB | compuzone | 1182756 | 1 | 473000 | 473000 | 461175 | null |

## payments

| id | order_id | method | status | amount | depositor_name | confirmed_by_user_id | confirmed_at | memo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 70001 | BANK_TRANSFER | PENDING | 1446500 | 김구매 | null | null | 국민은행 000000-00-000000 입금 대기 |

## order_status_histories

| id | order_id | from_status | to_status | actor_user_id | memo | created_at |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 70001 | null | ADMIN_REVIEW | null | 주문 직전 가격 확인 완료, 초기 운영 정책상 관리자 검토 | 2026-05-23 21:06:00 |
| 2 | 70001 | ADMIN_REVIEW | WAITING_DEPOSIT | 1 | 견적 확인 완료, 입금 안내 | 2026-05-23 21:20:00 |