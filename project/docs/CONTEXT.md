# 프로젝트 컨텍스트 (AI 공용)
> 최초 작성: 2026-05-23
> 최신 수정: 2026-05-30
> 용도: Claude / Codex 등 AI 간 컨텍스트 공유 — 새 AI 세션 시작 시 붙여넣기

---

## 프로젝트 개요

- **서비스명:** 정효성 컴퓨터 조립 대행
- **운영 형태:** 실사업용 (개인사업자)
- **결제 방식:** 계좌이체 수동 확인 → 추후 토스페이먼츠 가상계좌 자동화
- **이직 목표 회사 포트폴리오 겸용** → 스택을 해당 회사 기준(NestJS/TypeORM/MySQL/Next.js)으로 맞춤

---

## 확정 기술 스택

| 영역 | 스택 |
|---|---|
| 백엔드 | NestJS + TypeScript + TypeORM + MySQL |
| 큐/캐시 | Redis (BullMQ는 추후 필요 시 추가) |
| 프론트 | Next.js (App Router) + shadcn/ui + Tailwind CSS |
| AI 견적 | 다나와/컴퓨존 데이터 + Gemini Flash API (무료 티어) |
| 알림 | 텔레그램 Bot (운영자) + 카카오 알림톡 / SMS (고객, 추후) |
| 결제 자동화(추후) | 토스페이먼츠 가상계좌 |
| 배포 | 홈서버 Docker Compose |

---

## 프로젝트 루트 구조

```
/Users/junzzang/**BACKUP**/JHSComputer2/project/
├── docs/                        ← AI 컨텍스트 문서
│   ├── CONTEXT.md               ← AI에 붙여넣는 핵심 요약 (이 파일)
│   ├── DB_DESIGN.md             ← ERD, 설계 원칙, 결정 이유
│   ├── DB_TABLE_DEFINITION.md   ← 28개 테이블 컬럼 정의서 (기준 문서)
│   ├── API_DESIGN.md            ← NestJS 엔드포인트 명세
│   ├── ARCHITECTURE.md          ← ADR 001~010
│   └── PROGRESS.md              ← 진행 현황 체크리스트
├── JHSComputer_DataBase/        ← DB 세팅 전용 NestJS standalone 프로젝트
│   └── mysql/init/              ← schema.sql, seed.sql
├── JHSComputer_Server/          ← NestJS 백엔드 API 서버
├── JHSComputer_Frontend/        ← Next.js 프론트엔드
├── JHSComputer_Agent/           ← 크롤링/샘플 분석 도구
│   ├── compuzone/               ← 컴퓨존 수집기
│   ├── danawa/                  ← 다나와 수집기
│   └── analysis/                ← 샘플 분석기
└── project/samples/             ← 크롤러 수집 샘플
    ├── compuzone/               ← 컴퓨존 샘플
    └── danawa/                  ← 다나와 샘플
```

---

## 서비스 플로우

```
고객이 홈페이지에서 용도/예산 선택
  → AI가 템플릿 기반으로 최적 견적 자동 생성
  → 고객 견적 확인 + 부품 교체 가능
  → 주문하기 클릭 → 가격 재검증 (1원이라도 바뀌면 승인 요구)
  → 계좌이체 안내
  → 운영자 입금 확인 → [입금확인] 클릭
  → 부품 주문 → 조립 → 배송
  → 고객 자동 알림 (상태별)
```

---

## 페이지 구성

| 페이지 | 내용 |
|---|---|
| `/` | 서비스 소개 + 용도별 견적 시작 (랜딩) |
| `/quote` | 설문 기반 AI 자동 견적 (용도/예산/게임/해상도 등) |
| `/order` | 견적 확정 + 배송지 입력 + 계좌이체 안내 |
| `/track` | 주문 상태 추적 |
| `/admin` | 운영자 전용 주문 관리 대시보드 |

---

## 주문 상태 단계 (전체)

```
PRICE_APPROVAL_REQUIRED → ADMIN_REVIEW → WAITING_DEPOSIT → DEPOSIT_CONFIRMED
→ PARTS_ORDERING → PARTS_WAITING → PARTS_ARRIVED
→ ASSEMBLING → TESTING → PREPARING_DELIVERY → SHIPPING → DELIVERED
→ PURCHASE_CONFIRMED / CANCELLED / REFUNDED / ON_HOLD
```

---

## 요금제

| 플랜 | 금액 | 포함 내용 |
|---|---|---|
| 기본 조립 | 3만원 / 대당 | 견적 상담, 부품 구매 대행, 조립, 배송 |
| 프리미엄 | 5만원 / 대당 | 기본 + OS 설치 + 벤치마크 테스트 + 30일 A/S |

---

## DB 구성 (28개 테이블, MySQL)

**DB 환경:**
- 서버 #3 (`data.hollywood.kro.kr`) MySQL에 `jhs_computer_dev / stage / prod` 분리
- 로컬/초기 개발은 `jhs_computer_dev`만 사용
- SQL 파일 기준: `JHSComputer_DataBase/mysql/init/`
- 명령: `npm run db:bootstrap:server` (서버 #3 최초 세팅), `npm run db:reset:dev` (dev만 초기화)

**핵심 테이블 그룹:**

| 그룹 | 테이블 |
|---|---|
| 사용자 | `users`, `social_accounts` |
| 표준 부품 | `part_categories`, `parts` |
| 스펙 | `cpu_specs`, `gpu_specs`, `mainboard_specs`, `ram_specs`, `storage_specs`, `psu_specs`, `case_specs`, `cooler_specs` |
| 공급처 | `suppliers`, `supplier_crawl_targets`, `supplier_products`, `supplier_offers`, `supplier_offer_prices` |
| 견적 | `quote_templates`, `quote_template_items`, `quotes`, `quote_items` |
| 성능/게임 | `games`, `game_requirements`, `performance_estimates` |
| 주문 | `orders`, `order_items`, `payments`, `order_status_histories` |

**설계 핵심 원칙:**
- 견적은 live (최신 가격 반영), 주문은 snapshot (주문 시점 고정)
- 공급처 상품(`supplier_products`)과 표준 부품(`parts`) 분리
- 실제 구매 단위는 `supplier_offers` 기준
- 컴퓨존 `ProductNo`, 다나와 `pcode` → `supplier_products.external_product_id`
- 가격 이력은 update 없이 insert로만 쌓음 (`supplier_offer_prices`)
- 주문 직전 가격 검증: 1원이라도 바뀌면 `PRICE_APPROVAL_REQUIRED`

---

## API 구성 (NestJS REST)

```
POST /auth/kakao|naver|google   ← 소셜 로그인
GET  /me                        ← 내 정보

GET  /parts                     ← 부품 목록 (category/keyword/sort/onlyCompatible 필터)
GET  /parts/:id/prices          ← 공급처별 가격 이력

POST /quotes/estimate           ← 설문 기반 자동 견적 생성
GET  /quotes/:id                ← 견적 상세
PATCH /quotes/:id/items/:itemId ← 견적 부품 변경
GET  /quotes/:id/compatible-parts ← 호환 가능 부품 목록
POST /quotes/:id/check-price    ← 주문 직전 가격 검증
POST /quotes/:id/approve-price-change ← 가격 변경 승인
POST /quotes/:id/order          ← 주문 전환

GET  /orders/:id                ← 주문 상세
GET  /orders/:orderNo/track     ← 주문 추적

GET  /admin/orders              ← 어드민 주문 목록
POST /admin/orders/:id/confirm-deposit ← 입금 확인
PATCH /admin/orders/:id/status  ← 주문 상태 변경
PATCH /admin/orders/:id/items/:itemId/buy-price ← 실제 매입가 입력
POST /admin/parts               ← 표준 부품 생성
PATCH /admin/supplier-listings/:id/match ← 공급처 상품 매칭 승인
```

---

## 현재 진행 상황 (2026-05-30 기준)

**완료:**
- docs/ 구조 및 DB/API/Architecture 설계 완료 (ADR 001~010)
- 컴퓨존/다나와 샘플 크롤러 작성 및 핵심 카테고리 샘플 수집 완료
- DB Clean V2 명명 규칙 및 28개 테이블 정의서 작성
- JHSComputer_DataBase NestJS 프로젝트 생성 (schema/seed SQL)
- 서버 #3 기준 dev/stage/prod DB bootstrap 구조 확정
- NestJS API 앱 / Next.js Web 앱 생성 및 기본 빌드 확인
- TypeORM 연결 설정, 엔티티 정의, 초기 seed SQL 작성
- 메인 페이지 기본 화면 확인

**미완료 (현재 블로킹):**
- Docker daemon 실행 후 MySQL/Redis 컨테이너 구동 확인
- 서버 #3에서 `npm run db:bootstrap:server` 실행 확인
- 견적 설문 / 견적 결과 / 주문 / 추적 / 어드민 페이지 개발

---

## 핵심 ADR 요약

| ADR | 결정 |
|---|---|
| 001 | NestJS + TypeORM + MySQL + Next.js + 홈서버 Docker |
| 002 | 결제: MVP 계좌이체 → 추후 토스페이먼츠 |
| 003 | DB 세팅: JHSComputer_DataBase NestJS standalone, dev/stage/prod 분리 |
| 004 | 공급처 상품(supplier_products) ↔ 표준 부품(parts) 분리 |
| 005 | 가격 수집 저빈도 + 주문 직전 해당 상품만 재검증 |
| 006 | 견적 live / 주문 snapshot |
| 007 | 자동 견적은 템플릿(가격대+용도+해상도) 기반 |
| 008 | 호환성 체크 필수 (소켓/DDR/폼팩터/GPU길이/쿨러높이/파워) |
| 009 | 커뮤니티는 MVP 이후 (후기→지식글→게시판 순) |
| 010 | 표준 부품 ↔ 판매 패키지 분리 규칙 확정 |

---

## 관련 문서

- [DB 설계 원칙 및 ERD](DB_DESIGN.md)
- [DB 테이블 정의서](DB_TABLE_DEFINITION.md) ← 컬럼 기준 문서
- [API 명세](API_DESIGN.md)
- [아키텍처 결정 기록 (ADR)](ARCHITECTURE.md)
- [진행 현황](PROGRESS.md)
