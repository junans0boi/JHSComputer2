# JHSComputer2 — 프로젝트 전체 컨텍스트
> 작성: 2026-09-02  
> 용도: 새 세션 시작 시 AI에게 붙여넣는 단일 기준 문서

---

## 1. 회사 및 사업 배경

**회사명:** 정효성 컴퓨터 (개인사업자)  
**유튜브 채널:** 정효성 TV — 컴퓨터 견적 소개 콘텐츠 운영 중  

**현재 운영 구조:**
- 대표 정효성: 유튜브 영상 출연 + 나레이션 녹음 + 컴퓨터 주문·조립·고객 발송 (1인 운영)
- 이준환 (junans0boi@gmail.com): 영상 기획·편집자로 합류 → 이번에 기술 개발까지 주도

**사업 목표 (이번 프로젝트를 통해 달성하려는 것):**
1. 부품 조합별 게임 프레임·성능 데이터를 분석해 영상 콘텐츠의 **신뢰도·퀄리티 향상**
2. 해당 데이터를 웹 플랫폼으로 제공 — 컴퓨터 구매 희망자에게 실질적 가치 제공
3. 유튜브 채널 + 조립 PC 판매 + 데이터 기반 견적 플랫폼으로 **정식 사업화**

**요금제 (현행):**
| 플랜 | 금액 | 내용 |
|---|---|---|
| 기본 조립 | 3만원/대 | 견적 상담, 부품 구매 대행, 조립, 배송 |
| 프리미엄 | 5만원/대 | 기본 + OS 설치 + 벤치마크 테스트 + 30일 A/S |

---

## 2. 프로젝트 개요

**서비스명:** 정효성 컴퓨터 조립 대행 플랫폼 (JHSComputer2)  
**핵심 가치:** "컴퓨터를 잘 모르는 사람도 예산과 용도만 입력하면 검증된 견적을 받고 조립 PC를 주문할 수 있다"  
**포트폴리오 겸용:** 기술 스택을 목표 이직 회사 기준(NestJS/TypeORM/MySQL/Next.js)에 맞춤

---

## 3. 기술 스택

| 영역 | 스택 |
|---|---|
| 백엔드 | NestJS + TypeScript + TypeORM + MySQL |
| 큐/캐시 | Redis (BullMQ는 추후 필요 시 추가) |
| 프론트 | Next.js (App Router) + shadcn/ui + Tailwind CSS |
| AI 견적 | 다나와/컴퓨존 데이터 + Gemini Flash API (무료 티어) |
| 알림 | 텔레그램 Bot (운영자), 카카오 알림톡/SMS (고객, 추후) |
| 결제 (추후) | 토스페이먼츠 가상계좌 |
| 배포 | 홈서버 Docker Compose |
| DB 서버 | 서버 #3 — `data.hollywood.kro.kr` MySQL |

---

## 4. 모노레포 구조

```
JHSComputer2/
├── JHSComputer_DataBase/     NestJS standalone — MySQL 세팅·마이그레이션
│   └── mysql/init/           00~07 순서의 SQL 파일 (schema, seed, benchmark, recommendation)
├── JHSComputer_Server/       NestJS API 서버 (포트 6002)
│   └── src/
│       ├── auth/             JWT 인증, 로그인/회원가입
│       ├── users/            사용자, 소셜계정, /me 엔드포인트
│       ├── parts/            표준 부품, 공급처, 가격, 스펙 엔티티
│       ├── quotes/           견적, 게임, 성능추정, 템플릿
│       ├── orders/           주문, 주문항목, 결제, 상태이력
│       ├── benchmarks/       CPU/GPU 조합별 게임 성능 데이터
│       ├── recommendations/  추천 견적 콘텐츠
│       ├── cart/             장바구니
│       ├── ai/               AI 견적 생성
│       └── common-codes/     공통 코드
├── JHSComputer_Frontend/     Next.js (포트 3000)
│   └── src/
│       ├── app/              페이지 라우트
│       │   ├── page.tsx      메인 랜딩
│       │   ├── parts/        부품 목록
│       │   ├── quote/        견적 생성·상세
│       │   ├── order/        주문 접수·상세
│       │   ├── track/        주문 추적
│       │   ├── recommendations/ 추천 견적 목록·상세
│       │   ├── benchmarks/   벤치마크 페이지
│       │   ├── mypage/       마이페이지·장바구니·포인트·배송
│       │   ├── admin/        관리자 주문·추천글 관리
│       │   └── login|register/ 인증 페이지
│       └── components/
│           ├── AppShell.tsx  헤더/푸터 (쇼핑몰 구조)
│           ├── benchmarks/   BenchmarkComboList, GameTable, SummaryCards
│           ├── recommendations/ Hero, PartsTable, GameBenchmark, Markdown
│           ├── builder/      AI 채팅, 부품 선택, 현재 빌드 패널
│           └── parts/        PartProductCard, ComparePartsPanel
└── JHSComputer_Agent/        크롤링·데이터 수집·동기화 스크립트
    ├── compuzone/            컴퓨존 상품 수집·DB 동기화
    ├── kjwwang/              견적왕 HTML 수집·파싱·벤치마크 동기화
    ├── wanggapc/             왕가PC 상품 수집·파싱·DB 동기화
    ├── danawa/               다나와 검색·상세 스펙 수집
    ├── youtube/              유튜브 채널 분석
    ├── analysis/             카탈로그 동기화, 샘플 분석
    └── recommendations/      추천글 자동 생성
```

---

## 5. DB 구성 (MySQL, 28개 테이블)

**환경 분리:** `jhs_computer_dev` / `stage` / `prod` (서버 #3 단일 MySQL 인스턴스)

**핵심 테이블 그룹:**

| 그룹 | 테이블 |
|---|---|
| 사용자 | `users`, `social_accounts` |
| 표준 부품 | `part_categories`, `parts` |
| 스펙 | `cpu_specs`, `gpu_specs`, `mainboard_specs`, `ram_specs`, `storage_specs`, `psu_specs`, `case_specs`, `cooler_specs` |
| 공급처 | `suppliers`, `supplier_crawl_targets`, `supplier_products`, `supplier_offers`, `supplier_offer_prices` |
| 견적 | `quote_templates`, `quote_template_items`, `quotes`, `quote_items` |
| 성능·게임 | `games`, `game_requirements`, `performance_estimates` |
| 주문 | `orders`, `order_items`, `payments`, `order_status_histories` |

**설계 핵심 원칙:**
- 견적은 **live** (최신 가격 계속 반영), 주문은 **snapshot** (주문 시점 고정)
- `parts` (표준 부품) ↔ `supplier_products` (공급처 상품) 분리
- 실구매 단위는 `supplier_offers` 기준
- 가격 이력은 update 없이 insert만 쌓음 (`supplier_offer_prices`)
- 주문 직전 가격 검증: 1원이라도 바뀌면 `PRICE_APPROVAL_REQUIRED`

---

## 6. 서비스 플로우

### 고객
```
메인 페이지 진입
→ 예산·용도·게임·해상도 선택
→ AI 자동 견적 생성 (템플릿 기반)
→ 부품 확인·변경 (호환성 체크 포함)
→ 견적 저장 → 주문 접수 (배송지·무통장 안내)
→ 주문번호로 상태 추적
```

### 관리자
```
주문 목록 확인 → 입금 확인 → 상태 변경·메모
→ 부품 주문 → 조립 → 발송 → 고객 알림
```

### 데이터 운영
```
Agent가 외부 HTML·상품·견적 데이터 수집
→ 파서가 부품명·가격·스펙·CPU/GPU 조합 정규화
→ DB 동기화 스크립트가 추천 빌드·벤치마크·게임 성능 적재
→ API가 프론트에 제공
```

---

## 7. 주문 상태 흐름

```
PRICE_APPROVAL_REQUIRED → ADMIN_REVIEW → WAITING_DEPOSIT → DEPOSIT_CONFIRMED
→ PARTS_ORDERING → PARTS_WAITING → PARTS_ARRIVED
→ ASSEMBLING → TESTING → PREPARING_DELIVERY → SHIPPING → DELIVERED
→ PURCHASE_CONFIRMED / CANCELLED / REFUNDED / ON_HOLD
```

---

## 8. 현재 구현 완료 항목 (2026-07-03 기준)

### 데이터 수집
- [x] 컴퓨존 상품 수집·분석 (핵심 8개 카테고리 800+ 상품)
- [x] 견적왕(kjwwang) HTML 수집·파싱·벤치마크 DB 동기화
- [x] 왕가PC 상품 수집·파싱·DB 동기화
- [x] 다나와 검색·상세 스펙 샘플 수집
- [x] 유튜브 채널 분석 스크립트
- [x] 추천글 자동 생성 스크립트
- [x] CPU/GPU 조합, 게임별 FPS, 추천 빌드, 게임 요구사항 데이터 누적

### DB
- [x] MySQL schema SQL (28개 테이블)
- [x] 인덱스 SQL
- [x] 벤치마크 schema SQL
- [x] 게임·추천글 seed SQL
- [x] 장바구니 schema

### 백엔드 API
- [x] NestJS + TypeORM + MySQL 연결 구성
- [x] JWT 인증 (7일 유효 토큰)
- [x] Auth, Users(/me), Parts, Quotes, Orders, Cart, Benchmarks, AI, Recommendations, CommonCodes 모듈
- [x] `POST /api/orders/sync` — 로컬 주문 DB 동기화
- [x] `GET /api/orders/track/:orderNo` — 주문번호 추적
- [x] 주문 상태 변경 시 이력·메모 자동 기록
- [x] 견적 성능 추정 API

### 프론트엔드
- [x] 메인 랜딩 페이지 (히어로, 용도별 카드, 추천 구성 미리보기, 신뢰 지표)
- [x] 쇼핑몰형 AppShell (헤더·장바구니·유저메뉴·모바일햄버거·푸터)
- [x] 로그인·회원가입 페이지
- [x] 부품 목록·비교·상세 모달
- [x] 견적 생성·상세 페이지
- [x] 주문 접수·상세·추적 페이지 (백엔드 동기화 연결)
- [x] 마이페이지·장바구니·포인트·배송 페이지
- [x] 추천 견적 목록·상세 페이지
- [x] 벤치마크 페이지
- [x] 관리자 페이지 (DB 주문·로컬 주문 탭, 상태 변경 API 연결)

---

## 9. 미완료 및 블로킹 항목

### 검증 (최우선)
- [ ] `npm run typecheck` 현재 워크트리 기준 재실행
- [ ] `npm run build` 전체 재실행
- [ ] API 서버 기동 후 주요 엔드포인트 smoke test
- [ ] 프론트 dev 서버 기동 후 핵심 화면 브라우저 QA
- [ ] 주문 생성 → 관리자 상태 변경 E2E 수동 검증

### DB·API 연결
- [ ] 실제 개발 DB reset/apply 결과 재검증
- [ ] seed 데이터와 TypeORM entity 컬럼명 일치 전체 점검
- [ ] 견적 생성 결과를 서버 quote로 저장 (현재 로컬 저장소 혼재)
- [ ] 주문 접수 전 가격 재확인 로직 추가

### 보안 (배포 전 필수)
- [ ] 비밀번호 bcrypt 해시 적용 (현재 평문)
- [ ] 관리자 권한 Guard 미들웨어 적용
- [ ] 배포 환경 CORS origin 제한 (현재 `origin: true`)
- [ ] JWT secret 환경변수 필수값 검증
- [ ] 개인정보 로그 노출 점검

### 후순위 (MVP 이후)
- [ ] 토스페이먼츠 PG 연동
- [ ] 카카오·구글 소셜 로그인 완성
- [ ] 알림톡·문자·이메일 자동 발송
- [ ] 배송사 실시간 API 연동
- [ ] 커뮤니티·후기·댓글·좋아요

---

## 10. 핵심 ADR 요약

| ADR | 결정 |
|---|---|
| 001 | NestJS + TypeORM + MySQL + Next.js + 홈서버 Docker |
| 002 | MVP 결제: 계좌이체 수동 확인 → 추후 토스페이먼츠 |
| 003 | DB 세팅: JHSComputer_DataBase standalone, dev/stage/prod 분리 |
| 004 | `parts` (표준 부품) ↔ `supplier_products` (공급처 상품) 분리 |
| 005 | 가격 수집 저빈도 + 주문 직전 해당 상품만 재검증 |
| 006 | 견적 live / 주문 snapshot |
| 007 | 자동 견적은 가격대+용도+해상도 기반 템플릿에서 출발 |
| 008 | 호환성 체크 필수 (소켓/DDR/폼팩터/GPU길이/쿨러높이/파워) |
| 009 | 커뮤니티는 MVP 이후 (후기→지식글→게시판) |
| 010 | CPU 멀티팩/정품박스/벌크 → 같은 `parts`, 패키지 차이는 `supplier_offers` |

---

## 11. 이번 재개 방향 (2026-09 기준)

### 핵심 목표 변경점
기존에는 "조립 PC 주문 플랫폼 MVP" 완성이 목표였다면, 이번 재개에서는 다음 두 축을 동시에 추진한다:

1. **데이터 기반 영상 콘텐츠**: 부품 조합별 게임 FPS·성능 데이터를 분석·정제해 유튜브 영상 스크립트·슬라이드에 활용
2. **사업 플랫폼 완성**: 해당 데이터를 웹에 공개해 신뢰도 있는 견적 추천 서비스로 확장

## 12. 자동 견적 도메인 용어 (2026-09 기준)

### 사용 프로필 (WorkloadProfile)

고객이 컴퓨터로 수행하려는 하나 이상의 작업 묶음이다. 각 작업은 `GAMING`, `STREAMING`, `VIDEO_EDITING`, `AI`, `OFFICE`, `DEVELOPMENT` 중 하나이며, 전체 비중의 합은 100%다.

### 작업 부하 (Workload)

사용 프로필 안에서 CPU·GPU·메모리·저장장치 요구를 만드는 하나의 사용 목적이다. 작업 부하별 상세 조건은 해당 목적을 선택한 경우에만 입력한다.

### 예산 프로필 (BudgetProfile)

견적에 허용되는 최소·목표·최대 금액과 포함 항목을 나타내는 범위다. 최대 금액을 넘는 구성은 사용자의 명시적 선택 없이 자동 채택하지 않는다.

### 선호 프로필 (PreferenceProfile)

성능·가성비·감성·업그레이드 우선순위를 프리셋 또는 가중치로 표현한 것이다. 후보 생성 결과가 왜 달라졌는지 설명할 수 있어야 한다.

### 저장장치 수요 (StorageDemand)

운영체제, 현재 프로젝트, 보관 자료, 연간 증가량, 중복 보관 필요를 분리해 표현하는 저장 용량 요구다. 단일 SSD 용량 선택과 구분한다.

고객용 조건부 자동 견적 설문에서는 이 내부 수요를 직접 입력시키지 않는다. 사용자는 `필요한 SSD 용량`(500GB·1TB·2TB·4TB)만 선택하고, 세부 수요와 중복 보관은 기본값으로 처리한다. 세부 `StorageDemand`는 서버 후보 생성에 필요한 내부 표현으로 유지한다.

### 견적 후보 (QuoteCandidate)

같은 사용 프로필에서 서로 다른 의사결정을 보여주는 완성된 견적 하나다. 자동 견적은 균형형·성능 우선·가성비/확장형 후보를 최대 3개까지 제시하고, 조건을 만족하는 후보가 없으면 `REVIEW_REQUIRED`를 반환한다.

### 성능 근거 (PerformanceEvidence)

성능 숫자의 출처와 신뢰 수준이다. `MEASURED`, `SOURCE_REPORTED`, `DERIVED`, `NONE`을 구분하며, 근거 없는 수치를 실측으로 표시하지 않는다.

### 부품 벤치마크 테스트 (ComponentBenchmarkTest)

부품 점수를 비교할 수 있게 만드는 벤치마크의 이름·버전·점수 지표·대상(CPU/GPU)·단위를 함께 정의한 기준이다. 테스트 버전이나 점수 지표가 다르면 같은 부품군이라도 같은 비교 집합으로 취급하지 않는다.
_Avoid_: 벤치마크 점수(테스트·버전·지표가 생략된 표현)

### 부품 벤치마크 관측값 (ComponentBenchmarkObservation)

하나의 표준 부품에 대해 특정 `ComponentBenchmarkTest`를 특정 시스템·드라이버·설정으로 실행하거나 출처가 보고한 원본 점수 한 건이다. 출처 URL, 측정 조건, 근거 유형을 잃지 않으며 다른 관측값과 섞어 원본처럼 바꾸지 않는다.
_Avoid_: 부품 평균점수(원본 관측값과 집계값을 혼동하는 표현)

### 대표 점수 (RepresentativeScore)

같은 부품·같은 테스트·같은 버전·같은 점수 지표에 속한 관측값을 화면에 요약한 값이다. 비교 화면에 표시할 수 있지만 단일 실측값이나 최고 점수와 동일한 의미로 표시하지 않는다.
_Avoid_: 종합점수(서로 다른 테스트의 점수를 합산한 표현)

### 게임 추천 조합 (GameRecommendationCombo)

게임·예산·해상도·품질 조건에 대해 외부 출처가 제안한 CPU/GPU 조합이다. 추천 조합이 존재한다는 사실만으로 해당 조합의 FPS 숫자나 해상도별 측정값이 존재한다고 보지 않는다.
_Avoid_: 게임 성능 데이터(추천 조합과 숫자 관측값을 합치는 표현)

### 게임 FPS 관측값 (GameFpsObservation)

특정 CPU/GPU 조합을 특정 게임·해상도·품질·게임 버전·드라이버·테스트 시스템 조건으로 측정하거나 출처가 보고한 FPS 숫자다. 조건이 빠진 평균값은 해상도별 FPS로 복제하지 않는다.
_Avoid_: 지원 해상도(해상도 지원 문구와 FPS 숫자를 혼동하는 표현)

### 추천 맥락 스냅샷 (RecommendationContextSnapshot)

외부 출처가 특정 게임·해상도·추천 등급·플랫폼·CPU/GPU 조합에 대해 마지막으로
확인한 추천 상태다. 같은 CPU/GPU라도 게임·해상도·등급이 다르면 서로 다른 추천
맥락이며, 고객용 조합 목록에서는 하나의 공개 조합 아래에 맥락으로 묶는다.
_Avoid_: 중복 조합(추천 맥락이 다른 행을 무조건 같은 데이터로 삭제하는 표현)

### 추천 조합 그룹 (RecommendationComboGroup)

같은 정규화 CPU와 GPU를 사용하는 여러 `RecommendationContextSnapshot`을 고객용
조합 하나로 묶은 표현이다. 그룹의 개수는 CPU/GPU 조합의 개수이며, 그룹 안의
추천 맥락 수나 게임 수와 같은 의미가 아니다. 실제 FPS 관측값이 없어도 추천 그룹은
존재할 수 있지만, FPS 성능 데이터가 있다고 표현하지 않는다.

_Avoid_: 추천 조합 수를 전체 견적 수나 FPS 측정 조합 수로 해석하는 표현

### 최신 관측값 (LatestObservation)

같은 출처와 같은 관측 식별자에서 가장 최근에 확인된 값이다. 최신값을 공개하더라도
원문 URL과 확인 시각을 숨기지 않으며, 값이 없다는 이유로 이전 FPS나 벤치마크 점수를
새 조건에 복제하지 않는다.
_Avoid_: 실시간 값(수집 시각과 갱신 정책이 없는 표현)

### 공개 카탈로그 승인 게이트 (PublicCatalogApprovalGate)

크롤러가 적재한 표준 부품을 공개 카탈로그·자동 견적에 노출할지 결정하는 운영 정책이다. 기본값은 관리자 승인 부품만 공개하지만, 운영자가 `PUBLIC_PART_APPROVAL_REQUIRED=false`를 명시한 환경에서는 활성 상태이며 현재 가격·재고가 있는 판매 단위를 공개한다. 부품 목록과 자동 견적은 같은 게이트 의미를 사용해야 한다.

### 후보 자격 게이트 (CandidateEligibilityGate)

판매 중이라는 사실만으로 자동 견적 후보가 될 수는 없다. 부품 역할에 맞는 실물 스펙이 있고, 케이블·변환 젠더·튜닝 액세서리처럼 조립 부품이 아닌 상품을 제외하며, CPU·GPU·메인보드·쿨러·파워·케이스 사이의 전력·냉각·물리 호환 조건을 만족해야 후보가 된다.

### AI 추론 가속기 호환성 (AIInferenceAcceleratorCompatibility)

AI 추론 workload의 후보 품질을 판단하는 기준이다. 모델 크기와 양자화로 계산한 VRAM/RAM 최소량을 넘기는 것만으로 충분하지 않으며, CUDA 생태계를 사용하는 NVIDIA GPU가 판매 목록에 있으면 AMD·기타 GPU를 같은 성능 후보로 자동 채택하지 않는다. NVIDIA 후보가 없을 때는 이를 숨기지 않고 검토 필요 상태나 명시적 완화 사유로 설명한다.

### 제조사·인기 신뢰 신호 (ManufacturerPopularityEvidence)

자동 견적 후보의 신뢰도를 판단하는 카테고리별 제조사 tier, 선택된 판매 상품의 후기 수·평점, 로그 스케일의 `POPULARITY_SCORE`, 스펙 파싱/검증 상태, 관리자 승인 신호의 조합이다. 모든 자동 선택 부품은 검증 제조사·인기 근거·관리자 승인 중 하나 이상의 근거가 있어야 하며, 스펙 파싱 상태만으로는 자동 추천을 허용하지 않는다. 신뢰 메타데이터 자체가 없으면 임의로 통과시키지 않고 검토 필요로 돌린다. 신뢰 신호는 `VERIFIED_MANUFACTURER`, `ADMIN_APPROVED`, `POPULAR`, `SPEC_VERIFIED`, `UNVERIFIED` 라벨과 제조사·후기·평점으로 후보 상세에 공개한다.

### 공개 견적 미리보기와 인증 경계 (PublicQuotePreviewBoundary)

조건부 자동 견적 설문과 서버 검증 후보 비교는 비로그인 사용자에게도 공개한다. 비로그인 사용자의 선택 후보·장바구니는 현재 브라우저에 임시 저장하며, 로그인하면 서버 견적으로 저장하고 다른 기기에서 이어볼 수 있다. 주문 접수와 서버 저장은 인증 사용자만 수행할 수 있고, 로그인·회원가입 후에는 원래 주문 경로로 돌아가야 한다. AI 단독 workload처럼 게임 선택이 필요 없는 설문은 게임 목록 장애와 분리해 제출할 수 있지만, 게임 workload는 게임 목록을 확인할 수 없거나 선택 게임이 없으면 제출하지 않는다.

### 공개 데이터 표현 경계 (PublicDataPresentationBoundary)

벤치마크·추천 견적의 내부 원천 레코드와 고객용 표현을 분리한다. `COMBO_KEY`, 수집 출처, 원본 상품명, 성능 근거 메타데이터는 검수·재현을 위해 내부에 보존한다. 고객 화면에는 JHS 정규화 규칙으로 만든 `PublicComboName`과 JHS가 직접 작성한 제목·요약·설명을 사용한다. 이는 외부 데이터를 JHS 자체 측정이라고 속이는 의미가 아니며, `MEASURED`, `SOURCE_REPORTED`, `DERIVED`, `NONE` 근거 분류와 필요한 provenance는 계속 표시한다.

수집 조합 수(`totalComboCount`)와 FPS 근거 보유 조합 수(`fpsComboCount`)는 다른 지표다. FPS가 없는 수집 조합을 화면에서 제외해 전체 수집 규모를 하나로 오해하게 만들지 않으며, 해당 조합에는 성능 수치를 임의로 생성하지 않고 데이터 준비 상태를 표시한다.

### 즉시 해야 할 것
1. 빌드·타입체크 상태 확인 (몇 달 만에 재개이므로 의존성 상태 점검)
2. 벤치마크 데이터 현황 파악 (Agent에서 수집된 데이터가 DB에 실제로 얼마나 있는지)
3. 게임 FPS 데이터의 품질과 출처 정리 (영상에 쓰려면 신뢰도 기준이 필요)
4. 부품 벤치마크 관측값의 출처·버전·라이선스 및 표준 부품 매칭 검증
5. 미완료 E2E 흐름 (주문 전환, 관리자 상태 변경) 닫기

### 데이터 수집 출처
| 사이트 | 수집 내용 | 스크립트 위치 |
|---|---|---|
| 컴퓨존 (compuzone.co.kr) | 공급처 상품·가격·후기·상세 스펙·이미지 | `JHSComputer_Agent/compuzone/` |
| 견적왕 (kjwwang.com) | 느린 증분 방식의 게임별 추천 조합·예산·해상도 정보; 같은 추천 맥락은 최신값으로 유지하고 실제 FPS는 별도 검증 | `JHSComputer_Agent/kjwwang/` |
| 왕가PC (wanggapc.com) | 실제 조립 PC 구성·가격; 게임 FPS 숫자와 조건은 원문 검증 후 별도 관측값으로 적재 | `JHSComputer_Agent/wanggapc/` |
| ComputerBase (computerbase.de) | 게임별 해상도 FPS 원본 및 하드웨어 리뷰 차트 후보 출처; 현재 게임 FPS는 고정 테스트 CPU·10개 GPU·14개 게임 범위 | `JHSComputer_Agent/computerbase/` |
| Blender Open Data (opendata.blender.org) | 공개 라이선스 범위를 확인한 Blender 관측값 후보 | `JHSComputer_Agent/benchmarks/` |
| 다나와 (danawa.com) | 상품 스펙 표 보강용 후보 | `JHSComputer_Agent/danawa/` |

### 2026-09-10 부품 벤치마크 비교 세로 슬라이스

- [x] `benchmark_component_tests`와 `benchmark_component_observations`를 기존 게임 FPS 데이터와 분리해 추가
- [x] ComputerBase Cinebench R23·2024.1 CPU, 3DMark Fire Strike Overall·Time Spy Graphics GPU 원본 행을 조건·URL·근거 유형과 함께 수집
- [x] `ComponentBenchmarksService`에서 동일 테스트·버전·지표·대상·단위만 대표값과 delta로 비교하며, 버전 미상 3DMark는 `UNSPECIFIED@articleKey` 범위로 섞이지 않게 처리
- [x] 표준 부품 SKU가 여러 개로 모호하게 매칭되면 `PART_ID=NULL`로 보존하고 임의 SKU에 공개 비교값을 귀속하지 않음
- [x] `/benchmarks`와 `/quote` 견적 상세가 CPU/GPU를 분리한 공용 비교 UI를 사용
- [x] 왕가PC·견적왕의 추천 조합과 실제 FPS 관측값을 분리하고, 숫자·조건 없는 FPS를 생성하지 않음
- [x] 견적왕 수집 정책을 느린 증분·체크포인트·동일 추천 맥락 최신 갱신으로 정의
- [x] 견적왕 추천 스냅샷을 CPU/GPU 조합과 게임·해상도·등급 상세로 제공하는 별도 API 추가
- [ ] 견적왕 전체 대상 페이지를 소량 배치로 증분 수집하고 최신 추천 스냅샷을 검증
- [ ] ComputerBase 게임 FPS를 현재 고정 CPU·10개 GPU 범위에서 추가 GPU/CPU 기사로 확장
- [ ] JHS 직접 측정(`MEASURED`) 수집 장비·절차와 추가 출처별 이용 조건 확정

아키텍처 흐름과 다음 정규화 공통 모듈 기회는
`docs/architecture/2026-09-component-benchmark-flow.md`에 기록한다.

---

## 12. 개발 명령어

```bash
# 의존성 설치
npm install

# 서버 개발 실행
npm run dev:api          # NestJS API (포트 6002)
npm run dev:web          # Next.js 프론트 (포트 3000)

# 타입 검사
npm run typecheck
npm run typecheck -w @jhs-computer/database

# 빌드
npm run build

# DB (서버 #3 최초 세팅)
cd JHSComputer_DataBase
npm run db:bootstrap:server

# DB (로컬 Docker, Docker daemon 필요)
npm run db:up
npm run db:reset         # dev DB만 초기화
```

---

## 13. 관련 문서 위치

| 문서 | 경로 |
|---|---|
| DB 설계 원칙 | `project/docs/DB_DESIGN.md` |
| DB 테이블 정의서 (컬럼 기준) | `project/docs/DB_TABLE_DEFINITION.md` |
| API 명세 | `project/docs/API_DESIGN.md` |
| ADR 전체 | `project/docs/ARCHITECTURE.md` |
| 진행 현황 체크리스트 | `project/docs/PROGRESS.md` |
| 프로젝트 대시보드 | `project/docs/NOTION_PROJECT_PAGE_2026-07-03.md` |
| 기획 정리 | `project/docs/PLANNING_2026-07-03.md` |
| 6월 자동 작업 로그 | `project/analysis/2026-06-10-claude-improvements.md` |
| 게임 FPS 데이터 V1 | `project/analysis/gameFrameV1.md` |
