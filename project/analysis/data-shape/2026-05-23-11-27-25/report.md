# 데이터 모양 분석 리포트

- 생성 시각: 2026-05-23T11:27:25.483Z
- 컴퓨존 샘플: `project/samples/compuzone/2026-05-23_11-18-43`
- 다나와 샘플 루트: `project/samples/danawa`

## 컴퓨존 샘플 요약

| 카테고리 | 상품 수 | 옵션 포함 상품 | 옵션 행 | 가격 누락 | 예시 상품 |
|---|---:|---:|---:|---:|---|
| CASE | 100 | 65 | 133 | 0 | [OH’S] NICE [미들타워] |
| COOLER | 100 | 34 | 66 | 0 | [에디] CY100A ARGB [CPU쿨러/120mm] [블랙] |
| CPU | 100 | 31 | 71 | 0 | [AMD] 라이젠7 라파엘 7800X3D (8코어/16스레드/4.2GHz/쿨러미포함) |
| GPU | 100 | 0 | 0 | 0 | [MSI] 지포스 RTX 5060 Ti 벤투스 2X OC 플러스 D7 8GB |
| MAINBOARD | 100 | 1 | 2 | 0 | [MSI] PRO B650M-P (AMD B650/M-ATX) |
| PSU | 100 | 56 | 207 | 0 | [마이크로닉스] Classic II 80PLUS GOLD 풀모듈러 ATX3.1 (PCIE5.1) |
| RAM | 100 | 56 | 127 | 0 | [G.SKILL] DDR5 PC5-48000 CL36 AEGIS 5 |
| SSD | 100 | 87 | 257 | 0 | [삼성전자] 공식인증 990 EVO Plus M.2 NVMe 2280 |

## 다나와 샘플 요약

| 검색어 | 대표 pcode | 대표 상품 | 묶음 옵션 | 스펙 수 | 주요 섹션 |
|---|---|---|---:|---:|---|
| AMD 라이젠7 9800X3D | 70531547 | AMD 라이젠7-6세대 9800X3D (그래니트 릿지) | 3 | 33 | (기본), 사양, 메모리 사양, 그래픽 사양, 기술 지원, 구성, 벤치마크, KC인증 |
| MSI 지포스 RTX 5060 벤투스 2X OC D7 8GB | 90956033 | MSI 지포스 RTX 5060 벤투스 2X OC D7 8GB | 0 | 38 | (기본), 칩셋 사양, 메모리 사양, 그래픽 출력, 지원정보, 전력 관련, 냉각방식, 제품 외형, 부가기능, KC인증 |
| G.SKILL DDR5 PC5-48000 CL36 AEGIS 5 | 72913406 | G.SKILL DDR5-6000 CL36 AEGIS 5 | 2 | 17 | (기본), 부가기능, KC인증 |
| MSI PRO B650M-P | 20108249 | MSI PRO B650M-P | 0 | 60 | (기본), 기본 사양, [메모리], 메모리 기술, PCIe버전, PCIe슬롯, [저장장치], M.2 연결, M.2 폼팩터, RAID 지원, 그래픽 출력, 후면단자, 네트워크, 오디오, USB/팬 헤더, 특징, KC인증 |
| OH’S NICE 미들타워 | 122673623 | OH'S NICE | 2 | 31 | (기본), 지원보드규격, 내부 확장, [패널], [쿨러/튜닝], 외부포트, [크기], [호환성], KC인증 |
| 마이크로닉스 Classic II 80PLUS GOLD 풀모듈러 ATX3.1 | 51815078 | 마이크로닉스 Classic II 850W 80PLUS골드 풀모듈러 ATX3.1 | 0 | 44 | (기본), DC 출력, [커넥터], 부가기능, 내부설계, 보호회로, KC인증 |
| 삼성전자 990 EVO Plus M.2 NVMe 2280 | 69869543 | 삼성전자 990 EVO Plus M.2 NVMe | 3 | 34 | (기본), [기본사양], [성능], 지원기능, 부가기능, [환경특성], A/S기간, 쿨링 정보, [크기/무게], KC인증 |
| 에디 CY100A ARGB CPU쿨러 | 96424847 | 에디 CY100A ARGB | 2 | 43 | (기본), 인텔 소켓, AMD 소켓, [쿨링팬], 작동전압, 부가기능, LED시스템, 구성품, KC인증 |

## DB 설계 반영점

### 표준 부품과 판매 단위 분리

`parts`는 기술 모델, `supplier_listings`/`supplier_listing_variants`는 실제 판매 페이지와 패키지 단위로 둔다.

### external_product_id 단일화

컴퓨존 ProductNo와 다나와 pcode는 모두 `supplier_listings.external_product_id`에 저장하고 `supplier_id + external_product_id`로 유니크 처리한다.

### 스펙 저장 2단계

다나와/컴퓨존 원본 스펙은 `part_spec_sources`에 저장하고, 호환성 판단 값만 카테고리별 정규화 테이블로 승격한다.

### part_spec_values 역할 축소

`part_spec_values`는 검색/필터용 보조 인덱스로 유지하고, 정답 스펙과 호환성 판단은 `cpu_specs`, `gpu_specs`, `mainboard_specs` 등에서 수행한다.

## 다음 확인

- 컴퓨존 상품명과 다나와 pcode 자동 매칭 점수식을 별도 샘플로 검증한다.
- 스펙 정규화 파서는 CPU/GPU/메인보드부터 시작하고, 주문 호환성에 필요한 필드만 먼저 만든다.
- 가격 이력은 매번 insert하고 현재가는 최신 `captured_at` 기준으로 조회한다.
