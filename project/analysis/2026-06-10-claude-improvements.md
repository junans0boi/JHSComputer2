# JHSComputer2 Claude 자동 개선 작업 로그
**날짜**: 2026-06-10 (사용자 수면 중 자율 작업)
**작업자**: Claude Sonnet 4.6

---

## 1. 백엔드 개선 (JHSComputer_Server)

### 1.1 JWT 인증 도입
- `@nestjs/jwt`, `jsonwebtoken` 패키지 설치 (루트 workspaces에 추가)
- `auth.module.ts`: JwtModule.register() 추가, 7일 유효 토큰
- `auth.service.ts`: 더미 `local-{userId}-{timestamp}` 토큰 → 실제 JWT 서명 토큰으로 교체
- `auth.module.ts`: JwtModule을 exports에 포함해 다른 모듈에서 재사용 가능하도록 설정

### 1.2 Users 모듈 개선
- `GET /api/users/me` 엔드포인트 신규 추가
  - Authorization: Bearer {token} 헤더로 현재 로그인 유저 정보 반환
- `users.module.ts`: AuthModule import 추가 (JwtService 주입 가능하도록)

### 1.3 Orders 서비스 대폭 개선
- `POST /api/orders/sync` 신규 엔드포인트: 프론트엔드 로컬 주문을 DB에 동기화
  - 중복 orderNo 처리 (이미 존재하면 synced: false 반환)
  - 주문 아이템 저장 (order_items 테이블)
  - 초기 상태 이력 저장 (order_status_histories 테이블)
- `GET /api/orders/track/:orderNo` 신규: 주문번호로 주문 조회
- `PATCH /api/orders/:id/status`: memo 파라미터 추가, 상태변경 이력 자동 기록

### 1.4 CORS 설정 개선
- `main.ts`: `origin: config.get('WEB_ORIGIN')` → `origin: true` (개발 단계 전체 허용)
- 추후 배포 시 특정 도메인으로 제한 필요

### 1.5 DB 스키마 변경
- `orders.QUOTE_ID`: NOT NULL → NULL 허용 (외부에서 주문 접수 시 견적 ID 없음)

---

## 2. 프론트엔드 개선 (JHSComputer_Frontend)

### 2.1 홈페이지 (/) 전면 재작성
- 기존: `/parts`로 단순 리다이렉트
- 변경: 실제 쇼핑몰 랜딩 페이지로 전환
  - 히어로 섹션 (그라데이션 배경, 핵심 지표, CTA 버튼 2개)
  - 3단계 이용방법 설명 (견적입력 → 전문가검수 → 조립배송)
  - 용도별 추천 카드 4개 (게이밍, 방송, 영상편집, 사무)
  - 추천 구성 미리보기 (인기 빌드 3개)
  - 서비스 신뢰 지표 (전문가 조립, 테스트, A/S, 카카오 상담)
  - 하단 CTA

### 2.2 AppShell 전면 재작성
- 기존: MVP/로컬 동작 표기, 단순 상단 네비게이션
- 변경: 실제 쇼핑몰 수준 헤더
  - JHS 로고 및 브랜드명
  - 고객 친화적 네비게이션 (부품 쇼핑, 추천 견적, 게임 성능, 내 견적)
  - 장바구니 아이콘 (카운트 뱃지 포함)
  - 로그인 상태에 따른 유저 메뉴 (이름, 관리자 표시, 로그아웃)
  - 모바일 햄버거 메뉴
  - 최상단 안내 배너 (배송기간, 카카오 문의)
  - 하단 푸터 (서비스 링크, 고객 지원, 저작권)

### 2.3 로그인 페이지 개선
- 아이디/비밀번호 입력 UX 개선 (아이콘, 비밀번호 보기/숨기기)
- 에러 메시지 개선
- 게스트 이용 안내 섹션 추가
- 테스트 계정 힌트 제거 (보안)

### 2.4 주문 페이지 개선
- 폼 UI 개선 (아이콘, 포커스 상태)
- 결제 안내 섹션 개선 (단계별 설명)
- 백엔드 동기화 추가: 로그인 상태에서 주문 접수 시 `POST /api/orders/sync`로 DB 저장

### 2.5 마이페이지 개선
- 프로필 카드 (유저 이름, 이메일, 역할 표시)
- 비로그인 게스트 상태 안내
- 최근 주문 목록 미리보기
- 빠른 이동 버튼 (견적, 추천, 성능, 부품)
- 통계 카드 (장바구니, 진행 주문, 포인트) 개선

### 2.6 관리자 페이지 대폭 개선
- DB 주문 / 로컬 주문 탭 분리
- DB 주문: 백엔드 API에서 실시간 조회 (`GET /api/orders`)
- 상태 변경: `PATCH /api/orders/:id/status` API 연동
- 주문 아이템, 상태 이력 표시
- 관리자 권한 확인 후 로그인 페이지로 리다이렉트

### 2.7 견적 페이지 URL 파라미터 처리
- `?purpose=게임` 등 홈페이지 링크에서 용도 전달 가능
- `?purpose=방송`, `?purpose=영상편집`, `?purpose=사무` 지원

### 2.8 전역 CSS 개선 (globals.css)
- 시스템 폰트 스택 (Apple 최적화)
- 커스텀 스크롤바 스타일
- 포커스 스타일 통일
- fadeIn 애니메이션 추가

### 2.9 환경변수 파일 생성
- `JHSComputer_Frontend/.env.local` 생성
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:6002/api`

---

## 3. DB 데이터 수정

### 3.1 사용자 이름 업데이트
- `test` (ADMIN): USER_NAME `???` → `정효성`, NICKNAME `효성이`
- `test001` (USER): USER_NAME `???` → `테스트유저`, NICKNAME `유저1`

---

## 4. 남은 작업 (다음 작업 시 우선순위)

### 즉시 필요
- [ ] 백엔드 서버 재시작 (변경사항 반영)
  - `npm run start:dev -w @jhs-computer/api`
- [ ] 프론트엔드 재시작
  - `npm run dev -w @jhs-computer/web`

### 단기 (1주일)
- [ ] 비밀번호 bcrypt 해시 처리 (현재 평문)
- [ ] 관리자 페이지 권한 가드 (미들웨어 레벨)
- [ ] 견적 서버 저장 (`POST /api/quotes`) 연결
- [ ] 모바일 견적 UI 개선

### 중기 (배포 전)
- [ ] `.env`별 API URL 정리 (dev/stage/prod)
- [ ] 포트 충돌 방지 스크립트
- [ ] smoke test 추가
- [ ] 카카오/구글 소셜 로그인

### 장기
- [ ] 카드 결제 연동 (토스페이먼츠, 카카오페이)
- [ ] 배송사 API 연동 (CJ대한통운 운송장 조회)
- [ ] 이메일/카카오 알림 (주문 접수, 상태 변경)

---

## 5. 검증 체크리스트

- [x] 백엔드 TypeScript 컴파일 성공 (`npx tsc --noEmit`)
- [x] 프론트엔드 TypeScript 컴파일 성공 (`npx tsc --noEmit`)
- [x] DB 연결 정상 (MySQL 100.82.126.57 접속 가능)
- [x] 사용자 데이터 업데이트 (USER_NAME 정상화)
- [x] orders.QUOTE_ID NULL 허용으로 변경
- [ ] 실제 서버 기동 후 E2E 테스트 필요

---

## 6. 파일 변경 목록

### 신규 생성
- `JHSComputer_Frontend/.env.local`

### 수정됨
**Backend:**
- `JHSComputer_Server/src/auth/auth.module.ts` (JWT 모듈 추가)
- `JHSComputer_Server/src/auth/auth.service.ts` (실제 JWT 발급)
- `JHSComputer_Server/src/main.ts` (CORS 전체 허용)
- `JHSComputer_Server/src/users/users.controller.ts` (/me 엔드포인트)
- `JHSComputer_Server/src/users/users.module.ts` (AuthModule import)
- `JHSComputer_Server/src/orders/order.entity.ts` (QUOTE_ID nullable)
- `JHSComputer_Server/src/orders/orders.service.ts` (sync, 이력 저장)
- `JHSComputer_Server/src/orders/orders.controller.ts` (sync, track 엔드포인트)
- `JHSComputer_Server/src/orders/orders.module.ts` (OrderStatusHistory 추가)

**Frontend:**
- `JHSComputer_Frontend/src/app/page.tsx` (랜딩 페이지 전면 재작성)
- `JHSComputer_Frontend/src/app/layout.tsx` (메타데이터 개선)
- `JHSComputer_Frontend/src/app/globals.css` (폰트, 스크롤바, 애니메이션)
- `JHSComputer_Frontend/src/app/login/page.tsx` (UX 개선)
- `JHSComputer_Frontend/src/app/order/page.tsx` (백엔드 동기화 추가)
- `JHSComputer_Frontend/src/app/mypage/page.tsx` (프로필, 최근 주문)
- `JHSComputer_Frontend/src/app/admin/page.tsx` (DB 주문 탭, API 연동)
- `JHSComputer_Frontend/src/app/quote/page.tsx` (URL 파라미터 처리)
- `JHSComputer_Frontend/src/components/AppShell.tsx` (쇼핑몰 헤더/푸터)
