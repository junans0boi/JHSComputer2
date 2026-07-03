# 2026-06-09 이어서 작업 로그

## 이번에 완료한 것
- JWT + bcrypt 기반 로그인 흐름을 점검하고 타입 오류를 수정했다.
- `/api/quotes/my` 라우팅이 `/:id`에 먹히던 문제를 수정했다.
- 로그인 실패 시 `user.passwordText` null 접근 가능성을 제거했다.
- `quotes.SNAPSHOT_JSON` 컬럼을 init schema와 실제 DB에 추가했다.
- `orders.QUOTE_ID`를 nullable로 변경해 로컬 견적 기반 주문도 서버 동기화 가능하게 했다.
- 마이페이지에서 서버 저장 견적을 실제로 표시하도록 UI를 추가했다.
- 로그인 → 견적 저장 → 내 견적 조회 API 스모크 테스트 성공.
- 주문 sync API 스모크 테스트 성공.
- 서버/프론트 타입체크 통과.

## 검증 명령
- `npm run typecheck -w JHSComputer_Server`
- `npm run typecheck -w JHSComputer_Frontend`
- `POST /api/auth/login`
- `POST /api/quotes/save`
- `GET /api/quotes/my`
- `POST /api/orders/sync`

## 여전히 부족한 것
- 관리자/사용자 권한 가드가 모든 API와 화면에 완전 적용되지는 않았다.
- 장바구니는 아직 localStorage 중심이다. 서버 장바구니 테이블/동기화가 필요하다.
- 주문 결제는 계좌이체 안내 수준이며 실제 결제 연동은 없다.
- 추천견적과 게임 FPS 조합 연결은 기본 데이터가 있으나 상세 UI 연결이 더 필요하다.
- 부품 필터 UI는 고객 친화적으로 더 다듬어야 한다.
- 운영 배포 전 `.env`별 API URL, 포트 충돌 방지, E2E 테스트가 필요하다.

## 추가 완료: 서버 장바구니 MVP
- `user_cart_quotes` 테이블 추가.
- `/api/cart` GET/POST/DELETE API 추가.
- 견적 페이지에서 로그인 사용자가 장바구니에 담으면 서버에도 동기화하도록 연결.
- 장바구니 페이지에서 서버 장바구니와 localStorage 장바구니를 합쳐 표시하도록 개선.
- 서버 장바구니 추가/조회/삭제 스모크 테스트 성공.

## 로그인 임시 정책 수정
- 사용자 요청에 맞춰 hash/salt 자동 적용을 중단했다.
- `test`, `test001` 계정의 `PASSWORD_TEXT`를 모두 평문 `test`로 맞췄다.
- `/api/auth/login`에서 현재는 DB의 `PASSWORD_TEXT`와 입력 비밀번호를 단순 비교한다.
- JWT는 기존 `/quotes/my`, `/cart`, `/users/me` 연동 호환 때문에 임시 토큰 용도로 유지했다. 운영용 인증은 추후 별도 구현 필요.

## 로그인 404 원인 해결
- 원인: `localhost:6002`에 오래된 API 서버가 떠 있어서 `/api/auth/login` 라우트가 없었다.
- 조치: 오래된 6002 프로세스를 종료하고 새 백엔드를 6002로 재기동했다.
- 확인: `test/test`, `test001/test` 모두 `POST /api/auth/login` 성공.

## UI/레이아웃 안정화
- 공통 Shell에 `overflow-x-hidden`, 안전한 `main` 폭, 모바일 헤더 줄바꿈을 적용했다.
- QuoteSummary 테이블을 모바일에서 가로 스크롤 가능하게 바꿨다.
- 견적/주문/장바구니/마이페이지/부품/관리자/추천상세/포인트 페이지의 고정 grid 폭을 breakpoint 기반 반응형으로 조정했다.
- 부품 상세 모달 스펙표와 긴 텍스트에 `safe-break`를 적용했다.
- 브라우저에서 `/`, `/quote`, `/parts`, `/mypage/cart`, `/mypage/points`, `/recommendations`, `/benchmarks`, `/admin`, `/order`, `/track`의 가로 overflow가 없는 것을 확인했다.
