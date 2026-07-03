# 2026-06-09 작업 로그

## 완료
- Compuzone 상품 데이터 1,722건 병합 후 DB 적재 완료.
- KJWWANG 게임 FPS 데이터 재파싱/정규화 후 DB 재적재 완료.
  - 견적 86개, CPU+GPU FPS 조합 64개, 게임 158개, FPS 원본 31,696건.
- WANGGAPC 추천 PC 30개 수집/파싱, 유효 추천견적 27개 DB 적재 완료.
- 벤치마크 API 추가.
  - `/api/benchmarks/summary`
  - `/api/benchmarks/games`
  - `/api/benchmarks/combos`
  - `/api/benchmarks/combos/:comboKey/games`
  - `/api/benchmarks/recommended-builds`
  - `/api/benchmarks/recommended-builds/:buildId`
- 프론트 게임 성능 페이지 추가 및 컴포넌트화.
- 추천 견적 페이지를 DB 추천견적 우선, 정적 데이터 fallback 구조로 변경.
- 추천 견적 상세에서 DB 추천견적 주문/장바구니 저장 가능하도록 연결.
- 자동화 스크립트 추가: `npm run agent:auto`.
- 로그인 MVP 추가.
  - 관리자: `test` / `test`
  - 사용자: `test001` / `test`
  - API: `/api/auth/login`
  - UI: `/login`

## 주의
- 로그인은 현재 MVP로 평문 비밀번호 + localStorage 세션입니다. 운영 배포 전 반드시 bcrypt/argon2 해시, JWT/세션 쿠키, 인증 가드, 권한 가드로 교체해야 합니다.
- 기존 6001/6002 개발 서버가 떠 있으면 새 코드가 반영되지 않을 수 있습니다. 서버 재시작 필요.
- WANGGAPC 추천견적은 FPS 데이터가 아니라 추천 PC 구성 데이터입니다. KJWWANG FPS 데이터와 UI에서 의미를 분리했습니다.

## DB 현재 핵심 상태
- `parts`: 1,733건
- `benchmark_builds`: 113건
- `benchmark_combo_game_results`: 23,691건
- `benchmark_games`: 158건
- `benchmark_sources`: KJWWANG, WANGGAPC
