# 진행 현황
> 최초 작성: 2026-05-23
> 최신 수정: 2026-05-30

---

## 현재 단계

기획 질문 단계는 종료했다. 이제 문서 최신화와 MVP 개발을 병행한다.

---

## 완료된 작업

- [x] docs/ 폴더 구조 생성 (2026-05-23)
- [x] 기술 스택 확정 (2026-05-23)
- [x] 서비스 큰 방향 확정 (2026-05-23)
- [x] 자동 견적 방향 확정 (2026-05-23)
- [x] 주문/가격 정책 초안 확정 (2026-05-23)
- [x] DB 큰 엔티티 초안 작성 (2026-05-23)
- [x] API 큰 엔드포인트 초안 작성 (2026-05-23)
- [x] 컴퓨존 샘플 수집기 작성 및 핵심 카테고리 샘플 수집 (2026-05-23)
- [x] 다나와 검색/상세 스펙 샘플 수집기 작성 및 9800X3D/RTX 5060 샘플 수집 (2026-05-23)
- [x] DB Clean V2 명명 규칙 정리: `TB_` 없이 `snake_case` 복수형 사용 (2026-05-23)
- [x] 테이블 정의서 작성: `DB_TABLE_DEFINITION.md` (2026-05-23)
- [x] `JHSComputer_DataBase` NestJS 기반 DB 세팅 프로젝트 생성 (2026-05-23)
- [x] 28개 테이블 기준 MySQL schema/seed SQL 작성 (2026-05-23)
- [x] 서버 #3 기준 `jhs_computer_dev/stage/prod` DB bootstrap 구조 반영 (2026-05-24)
- [x] 루트 디렉터리 구조를 `JHSComputer_DataBase/Server/Frontend/Agent` 기준으로 정리 (2026-05-30)

---

## Step 1 — MVP 기반 구축

### 문서

- [x] CONTEXT.md 최신화
- [x] DB_DESIGN.md 최신화
- [x] API_DESIGN.md 최신화
- [x] ARCHITECTURE.md 최신화
- [x] PROGRESS.md 최신화

### 프로젝트 세팅

- [x] 루트 패키지/워크스페이스 구성
- [x] NestJS API 앱 생성
- [x] Next.js Web 앱 생성
- [x] Docker Compose 구성
- [x] `JHSComputer_DataBase` 워크스페이스 구성
- [x] `JHSComputer_Server` 워크스페이스 구성
- [x] `JHSComputer_Frontend` 워크스페이스 구성
- [x] `JHSComputer_Agent` 워크스페이스 구성
- [x] 서버 #3 DB bootstrap 명령 추가
- [x] dev DB 전용 reset 안전장치 추가
- [ ] MySQL + Redis 개발 환경 구성

### 백엔드

- [x] TypeORM 연결 설정
- [x] 공통 ConfigModule 구성
- [x] 사용자/소셜 로그인 엔티티
- [x] 부품/공급처/가격 엔티티
- [x] 견적/견적항목 엔티티
- [x] 주문/주문항목/결제/상태이력 엔티티
- [ ] DB 실제 연결 확인
- [x] 초기 seed SQL 작성
- [ ] DB 실제 seed 적용 확인

### 프론트

- [x] 메인 페이지
- [ ] 견적 설문 페이지
- [ ] 견적 결과 페이지
- [ ] 주문 정보 입력 페이지
- [ ] 주문 추적 페이지
- [ ] 관리자 주문 목록 페이지

### 검증

- [x] `npm install`
- [x] `npm run typecheck`
- [x] `npm run typecheck -w @jhs-computer/database`
- [x] `npm run build -w @jhs-computer/database`
- [x] `npm run build`
- [x] 브라우저에서 `http://localhost:3000` 기본 화면 확인
- [x] `npm run crawl:compuzone:samples -- --preset=core --pages=1 --page-count=20 --details=1 --delay-ms=1500`
- [x] `npm run crawl:danawa:samples -- --queries="AMD 라이젠7 9800X3D|MSI 지포스 RTX 5060 벤투스 2X OC D7 8GB" --results=3 --details=1 --delay-ms=1500`
- [ ] 서버 #3에서 `npm run db:bootstrap:server` 실행 확인
- [ ] Docker daemon 실행 후 `npm run db:up && npm run db:reset` 재확인

### 현재 메모

- Docker daemon이 꺼져 있어 MySQL/Redis 컨테이너는 아직 실행하지 못했다.
- `npm run db:up`은 Docker daemon 미실행으로 아직 검증하지 못했다.
- 서버 #3 DB 세팅 방향은 `data.hollywood.kro.kr` MySQL에 `jhs_computer_dev`, `jhs_computer_stage`, `jhs_computer_prod`를 만드는 방식으로 확정했다.
- 개발 중 앱 연결은 `jhs_computer_dev`만 사용한다.
- `JHSComputer_DataBase`에 `db:bootstrap:server`, `db:apply:dev/stage/prod`, `db:reset:dev` 명령을 추가했다.
- `db:reset`은 dev DB만 삭제/재생성하며, `stage/prod` reset은 지원하지 않는다.
- Next.js 빌드 중 macOS SWC 네이티브 바이너리 서명 경고가 발생한다. `next build --webpack`으로 고정해 빌드는 성공한다.
- `npm audit --omit=dev`에서 Next 내부 `postcss@8.4.31` 관련 moderate 취약점이 남아 있다. `npm audit fix --force`는 Next 9로 낮추려 해서 적용하지 않았다.
- 컴퓨존 샘플 수집 결과는 `project/samples/compuzone/2026-05-23_07-48-44`에 저장했다.
- 핵심 8개 카테고리에서 총 160개 상품을 수집했고 가격 누락은 없었다.
- RAM/SSD/케이스/파워는 옵션/그룹 상품 비율이 높아 DB에 `supplier_offers` 구조가 필요하다.
- 다나와 샘플 수집 결과는 `project/samples/danawa/2026-05-23-10-07-17`에 저장했다.
- 다나와 9800X3D는 `멀티팩 정품`, `정품`, `해외구매`가 서로 다른 pcode로 묶여 있어 판매 패키지와 표준 부품 모델을 분리해야 한다.
- 다나와 상세 스펙 표는 `section/key/value` 형태로 추출 가능하지만, MVP DB에서는 원본 스펙 테이블을 두지 않고 카테고리별 정규화 스펙 테이블에 필요한 값만 저장하기로 했다.
- 추가 컴퓨존 샘플은 `project/samples/compuzone/2026-05-23_11-18-43`에 저장했다. 핵심 8개 카테고리에서 총 800개 상품을 수집했고 옵션/그룹 상품은 330개가 나왔다.
- MVP에서는 `part_model_groups`를 만들지 않고 `parts`를 견적 표준 부품 단위로 유지한다.
- CPU 멀티팩/정품박스/벌크는 같은 CPU와 동일 스펙이면 같은 `parts`로 보고, 쿨러 포함 여부/패키지/가격만 `supplier_offers`에서 관리한다.
- RAM/SSD 용량, PSU 와트, 케이스/쿨러 색상처럼 견적 선택 조건이 바뀌는 옵션은 서로 다른 `parts`로 본다.
- 추출 샘플 기반 테이블별 예시 데이터는 `project/analysis/table-row-examples.md`에 정리했다.
- 견적/주문 항목이 실제 선택한 판매 단위를 추적할 수 있도록 `quote_items`와 `order_items`에 `supplier_offer_id`를 둔다.
- 기존 DB 이름/관계가 난잡해져 `supplier_products`, `supplier_offers`, `supplier_offer_prices` 중심의 정리안 `project/analysis/db-clean-v2.md`를 작성했고, 테이블 정의서는 `project/docs/DB_TABLE_DEFINITION.md`에 반영했다.
- 로그성/중간 처리 성격이 강한 `raw_spec_sources`, `raw_spec_items`, `part_spec_values`, `quote_histories`, `price_check_logs`, `part_match_candidates`, `crawl_runs`, `crawl_items`, `compatibility_checks`는 MVP 테이블에서 제외했다.

---

## Step 2 — 자동 견적 MVP

- [ ] 가격대 + 용도 + 해상도 템플릿 구현
- [ ] CPU/GPU 중심 자동 조정 로직
- [ ] 호환성 체크 로직
- [ ] 호환 가능한 부품 변경 목록
- [ ] 가격 변경 감지 및 승인 플로우
- [ ] 게임별 등급 + 참고 FPS 범위 표시

---

## Step 3 — 운영 자동화

- [ ] 백그라운드 가격 수집 작업
- [ ] 주문 직전 상품 단위 가격 검증
- [ ] 관리자 입금 확인
- [ ] 주문 상태 알림
- [ ] 실제 매입가 입력 및 마진 계산

---

## Step 4 — 확장

- [ ] PG/가상계좌 연동
- [ ] 문자/카카오 알림톡
- [ ] 구매 후기
- [ ] 지식글/공지
- [ ] 커뮤니티 게시판/댓글/좋아요
