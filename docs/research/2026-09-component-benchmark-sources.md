# 부품 벤치마크 점수 출처 조사

조사일: 2026-09-10

## 결론

첫 세로 슬라이스는 `SOURCE_REPORTED` 원본을 테스트 조건과 URL까지 보존하는 구조로 만든다. ComputerBase의 공개 하드웨어 리뷰 차트와 Blender Open Data를 우선 검토하고, JHS가 직접 실행한 점수는 나중에 `MEASURED`로 별도 적재한다. 3DMark 공개 결과와 PugetBench는 데이터 이용·상업 재배포 조건을 확인하기 전까지 대량 수집하지 않는다. Maxon 공식 페이지는 Cinebench 실행기와 버전 정책을 설명하지만, 공식 집계 점수 DB로 간주하지 않는다.

## 출처별 사실과 적용 판단

### Maxon Cinebench

- [Maxon Cinebench 기술 정보](https://www.maxon.net/en/tech-info-cinebench)는 Cinebench가 CPU/GPU 렌더링 성능을 평가하는 도구이며 버전별 테스트 엔진이 존재함을 설명한다.
- [Cinebench 2026 변경 안내](https://support.maxon.net/hc/en-us/articles/10379226739996-Cinebench-2026-0-0-December-29-2025)는 2026 점수 체계가 이전 버전과 달라 이전 점수와 직접 비교할 수 없다고 안내한다.
- 따라서 `CINEBENCH/R23/MULTI`, `CINEBENCH/R24/MULTI`, `CINEBENCH/2026/CPU`를 동일 비교 집합으로 만들지 않는다. 공식 페이지 자체를 공개 점수 수집 DB로 사용하지 않고, 허용된 리뷰 원본 또는 향후 JHS 측정값을 사용한다.

### UL 3DMark

- [3DMark 공식 결과 검색](https://www.3dmark.com/classic-search)은 Fire Strike와 Time Spy를 포함한 공개 결과 검색을 제공한다.
- [UL의 점수 비교 안내](https://support.benchmarks.ul.com/support/solutions/articles/44001788120)는 서로 다른 벤치마크 간 점수 비교를 금지하고, 같은 테스트를 사용해야 한다고 설명한다.
- [UL 승인 드라이버 안내](https://benchmarks.ul.com/support/approved-drivers)는 비교 가능한 3DMark 결과에서 드라이버 상태가 중요함을 보여준다.
- 첫 단계에서는 공식 결과 사이트를 무차별 스크랩하지 않고, 출처 이용 조건을 확인한 공개 리뷰 차트에서 Fire Strike Graphics/Overall 또는 Time Spy Graphics를 보존하거나, 권한이 확인된 결과만 수집한다.

### Blender Open Data

- [Blender Open Data](https://opendata.blender.org/)는 공개 제출된 Blender 벤치마크 결과를 제공한다.
- [Blender Open Data 소개](https://opendata.blender.org/about/)는 결과를 기계가 읽을 수 있는 형태(JSON/CSV 포함)로 제공하고 공개 데이터 정책을 설명한다.
- 출처 이용 조건과 부품 식별 매칭을 확인한 뒤, GPU/CPU 테스트 버전·장면·점수 지표를 `ComponentBenchmarkTest`에 고정해 수집할 수 있는 우선 후보다.

### PugetBench

- [PugetBench 결과 비교](https://www.pugetsystems.com/pugetbench/results/compare/)는 비교 가능한 결과 그룹과 공개 결과를 제공하지만 표본 수가 적은 그룹은 부품 표시가 제한될 수 있다.
- [PugetBench Creators 안내](https://www.pugetsystems.com/pugetbench/creators/)는 공개 결과 규모와 함께 상업적 사용·CLI·로컬 로깅에 라이선스가 필요할 수 있음을 안내한다.
- 상업 서비스에 점수를 저장·재배포할 권한을 확인하기 전에는 첫 세로 슬라이스에 포함하지 않는다.

### ComputerBase

- 현재 [ComputerBase RTX 5060 리뷰](https://www.computerbase.de/artikel/grafikkarten/nvidia-geforce-rtx-5060-test.92811/) 수집기는 공개 게임 차트의 실제 평균 FPS와 페이지 URL을 보존해 `SOURCE_REPORTED` 게임 관측값으로 적재한다.
- [Cinebench R23 커뮤니티 차트](https://www.computerbase.de/artikel/prozessoren/cinebench-r23-community-benchmarks.74276/)의 Multi-Core/Single Core, [Ryzen 7 9800X3D 리뷰](https://www.computerbase.de/artikel/prozessoren/amd-ryzen-7-9800x3d-test.90151/seite-3)의 Cinebench 2024.1, [3DMark Time Spy 차트](https://www.computerbase.de/artikel/grafikkarten/3dmark-time-spy-benchmark.88185/)의 Graphics Score를 실제 원본 행으로 확인했다.
- [Radeon RX 580/570 리뷰](https://www.computerbase.de/artikel/grafikkarten/radeon-rx-580-570-test.59085/)의 Fire Strike 그룹은 전체 점수를 제공하므로 `3DMARK_FIRE_STRIKE/OVERALL_SCORE`로 수집한다. 같은 데스크톱 차트에서 Graphics Score가 제공되지 않아 노트북 차트의 점수를 데스크톱 부품에 섞지 않는다.
- 차트 제목·점수 지표·원문 URL이 식별되면 수집하고, 시스템·OS·드라이버가 원문에 없을 때는 값을 추정하지 않고 `unavailableConditionFields`를 저장한다.

## 현재 코드와 문서의 불일치

- `JHSComputer_Agent/kjwwang/sync-live-benchmarks-to-db.mjs`는 현재 견적왕 원본에 FPS 숫자가 없다고 판단해 추천 조합만 저장하고 `FPS_RECORD_COUNT=0`으로 둔다.
- `JHSComputer_Agent/wanggapc/sync-builds-to-db.mjs`도 현재 왕가PC 수집 결과를 조립 PC 구성으로만 저장하며 FPS를 만들지 않는다.
- 따라서 사용자가 지정한 출처 역할은 그대로 확정하되, 실제 숫자·테스트 조건이 있는 화면/API를 확인하기 전에는 두 출처의 추천 조합을 FPS 관측값으로 표시하지 않는다. 이 검증은 별도 티켓으로 추적한다.

## 2026-09-10 실시간 원문 확인

- [견적왕 게임 상세 예시](https://kjwwang.com/shop/pc_estimate.html?action=detail&game=569)는 FHD/QHD/4K 섹션별로 `평균 목표 144FPS` 같은 목표 문구와 하옵·중옵·최상옵 추천 조합·가격을 제공한다. 그러나 조합별 실제 측정 FPS, 테스트 시스템, 드라이버, 게임 버전은 제공하지 않는다. 따라서 이 숫자는 `GameRecommendationCombo`의 목표 성능/추천 기준으로 보존할 수 있지만 `GameFpsObservation`으로 적재하지 않는다.
- [견적왕 추천 견적 상세 예시](https://kjwwang.com/shop/pc_estimate.html?action=view&es_sn=28146)는 한 조립 견적의 부품·설명과 여러 게임의 권장 사양/목표 FPS를 보여주지만, 해당 조립 견적을 실제로 측정한 게임별 FPS 표는 확인되지 않는다. 게임 요구사항의 `1080p/60fps`도 하드웨어 조합 측정값이 아니다.
- [왕가PC 상품 상세 예시](https://wanggapc.com/products/6583)는 판매 상품의 CPU/GPU·가격·구성·상세 스펙·후기·이미지를 제공한다. 페이지의 게임용 키워드와 설명은 사용 목적/상품 설명이지 조합별 측정 FPS 표가 아니다.

## 검증 결론

현재 운영 수집기는 다음처럼 구분해야 한다.

| 원문 | 보존 가능한 데이터 | 게임 FPS 관측값으로 적재 |
|---|---|---|
| 견적왕 게임 상세 | 게임·해상도·품질·추천 CPU/GPU·예산·목표 FPS 문구 | 아니오. 목표/추천 메타데이터로만 적재 |
| 견적왕 견적 상세 | 실제 판매 견적 부품·설명·게임 권장 사양 | 아니오. 특정 조합 측정 조건이 없음 |
| 왕가PC 상품 상세 | 실제 판매 견적 구성·가격·상품 스펙·후기·이미지 | 아니오. 조합별 FPS 표가 없음 |
| ComputerBase 게임 차트 | 게임·해상도·품질·GPU·평균 FPS·테스트 시스템·원문 URL | 예. 숫자와 조건이 모두 있는 행만 |

## 수집 중단 기준

- 벤치마크 이름/버전/점수 지표가 식별되지 않는다.
- 테스트 이름·점수 지표·원문 URL이 식별되지 않는다. 시스템·OS·드라이버 조건이 일부 누락된 경우에는 추정하지 않고 부분 조건 상태로 표시한다.
- 출처가 제공한 숫자와 단위가 아닌 지원 문구·등급·예산 범위만 있다.
- 공개 데이터 이용·상업 재배포 권한이 확인되지 않는다.
- 동일 원본 결과를 해상도·점수 지표별로 복제해야만 행 수가 늘어난다.
