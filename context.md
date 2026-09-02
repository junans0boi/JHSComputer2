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

### 즉시 해야 할 것
1. 빌드·타입체크 상태 확인 (몇 달 만에 재개이므로 의존성 상태 점검)
2. 벤치마크 데이터 현황 파악 (Agent에서 수집된 데이터가 DB에 실제로 얼마나 있는지)
3. 게임 FPS 데이터의 품질과 출처 정리 (영상에 쓰려면 신뢰도 기준이 필요)
4. 미완료 E2E 흐름 (주문 전환, 관리자 상태 변경) 닫기

### 데이터 수집 출처
| 사이트 | 수집 내용 | 스크립트 위치 |
|---|---|---|
| 컴퓨존 (compuzone.co.kr) | 부품 목록·가격·스펙 | `JHSComputer_Agent/compuzone/` |
| 견적왕 (kjwwang.com) | CPU/GPU 조합 견적, 게임 FPS | `JHSComputer_Agent/kjwwang/` |
| 왕가PC (wanggapc.com) | 조립 PC 상품 구성·가격 | `JHSComputer_Agent/wanggapc/` |
| 다나와 (danawa.com) | 상품 스펙 표 | `JHSComputer_Agent/danawa/` |

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
