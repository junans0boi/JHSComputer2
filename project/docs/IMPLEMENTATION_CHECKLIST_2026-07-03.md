# JHSComputer2 구현 목표 체크리스트
> 작성일: 2026-07-03
> 기준: 현재 워크트리 변경사항, 기존 진행 문서, 최근 작업 로그

## 1. 프로젝트 기반

- [x] 루트 npm workspace 구성
- [x] `JHSComputer_DataBase` 워크스페이스 구성
- [x] `JHSComputer_Server` NestJS API 워크스페이스 구성
- [x] `JHSComputer_Frontend` Next.js App Router 워크스페이스 구성
- [x] `JHSComputer_Agent` 데이터 수집/분석 워크스페이스 구성
- [x] 공통 개발 스크립트와 패키지 의존성 확장
- [x] `.env.example` 기반 환경변수 정리
- [ ] dev/stage/prod 환경변수 최종 분리
- [ ] 포트 충돌 방지 또는 기동 스크립트 정리

## 2. 데이터베이스

- [x] 기본 MySQL schema SQL 작성
- [x] master/game seed SQL 작성
- [x] 인덱스 SQL 작성
- [x] 벤치마크 schema SQL 추가
- [x] 장바구니 schema SQL 추가
- [x] 추천글 seed SQL 추가
- [x] 견적/주문이 실제 판매 단위(`supplier_offer_id`)를 추적할 수 있도록 구조 반영
- [x] 주문의 견적 연결을 nullable로 조정
- [ ] 실제 개발 DB reset/apply 결과 재검증
- [ ] seed 데이터와 TypeORM entity 간 컬럼명 일치 전체 점검
- [ ] 운영 배포 전 migration 전략 확정

## 3. Agent 및 데이터 파이프라인

- [x] 컴퓨존 샘플 크롤러 작성
- [x] 컴퓨존 DB 동기화 스크립트 작성
- [x] 견적왕 HTML 수집 스크립트 작성
- [x] 견적왕 HTML 파서 개선
- [x] 견적왕 벤치마크 DB 동기화 스크립트 추가
- [x] 왕가PC 상품 수집 스크립트 추가
- [x] 왕가PC 상품 파서 추가
- [x] 왕가PC 빌드 DB 동기화 스크립트 추가
- [x] 유튜브 채널 분석 스크립트 추가
- [x] 추천글 생성 스크립트 추가
- [x] 게임/벤치마크/추천 빌드 JSON 데이터 누적
- [ ] 수집 데이터 중복 제거와 정규화 규칙 고도화
- [ ] 상품명 -> 표준 부품 매칭 정확도 검증
- [ ] 정기 수집/동기화 실행 방식 결정

## 4. 백엔드 API

- [x] ConfigModule 및 TypeORM 연결 설정
- [x] Health API 구성
- [x] Parts API 구성
- [x] Quotes API 구성
- [x] Orders API 구성
- [x] Users API 구성
- [x] Common Codes API 구성
- [x] Auth API 및 JWT 발급 구성
- [x] Cart API 구성
- [x] Benchmarks API 구성
- [x] AI API 구성
- [x] Recommendations API 구성
- [x] `GET /api/users/me` 현재 사용자 조회 추가
- [x] `POST /api/orders/sync` 로컬 주문 DB 동기화 추가
- [x] `GET /api/orders/track/:orderNo` 주문번호 추적 추가
- [x] 주문 상태 변경 시 이력/메모 기록 추가
- [x] 벤치마크 요약, 게임, 조합, 추천 빌드, 견적 성능 추정 API 추가
- [ ] 비밀번호 bcrypt 해시 적용
- [ ] 관리자 권한 가드 미들웨어/가드 적용
- [ ] 견적 서버 저장 플로우 최종 연결
- [ ] API 입력 DTO와 validation pipe 정리
- [ ] 주요 API smoke/integration test 추가

## 5. 프론트엔드 화면

- [x] 메인 페이지 구현
- [x] 쇼핑몰형 `AppShell` 헤더/푸터 개편
- [x] 로그인 페이지 구현/개선
- [x] 회원가입 페이지 추가
- [x] 부품 목록 페이지 구현/개편
- [x] 견적 생성 페이지 구현/개편
- [x] 견적 상세 페이지 구현
- [x] 주문 접수 페이지 구현/개편
- [x] 주문 상세 페이지 구현
- [x] 주문 추적 페이지 구현/개편
- [x] 마이페이지 구현/개편
- [x] 마이페이지 장바구니 페이지 구현
- [x] 마이페이지 포인트 페이지 구현
- [x] 마이페이지 배송 페이지 구현
- [x] 추천 견적 목록 페이지 구현/개편
- [x] 추천 견적 상세 페이지 구현/개편
- [x] 벤치마크 페이지 추가
- [x] 관리자 페이지 구현/개편
- [ ] 모바일 견적 UI 최종 점검
- [ ] 전체 주요 페이지 반응형 QA
- [ ] 접근성 기본 속성 및 키보드 이동 점검

## 6. 프론트엔드 컴포넌트/라이브러리

- [x] 공통 UI 컴포넌트 추가: Button, Badge, PanelCard, EmptyState, FormField, PartsList
- [x] 부품 상세 모달 개선
- [x] 부품 카드/비교 패널 추가
- [x] 견적 요약 컴포넌트 개선
- [x] 견적 -> 주문 액션 컴포넌트 추가
- [x] 추천 빌드 카드 추가
- [x] 추천 상세 Hero/본문/부품표/벤치마크 패널 추가
- [x] 벤치마크 요약/조합/게임 테이블 컴포넌트 추가
- [x] 관리자 추천글 관리 컴포넌트 추가
- [x] Daum 우편번호 버튼 추가
- [x] 클라이언트 auth, cart, benchmark, performance, payment, delivery helper 추가
- [ ] UI 컴포넌트 중복 스타일 정리
- [ ] 서버 컴포넌트/클라이언트 컴포넌트 경계 점검

## 7. 주문/견적 플로우

- [x] 로컬 견적 저장 구조 구성
- [x] 추천 견적 기반 주문 진입 액션 추가
- [x] 로그인 상태 주문 접수 시 서버 동기화 추가
- [x] 주문번호 기반 추적 화면 추가
- [x] 관리자 주문 상태 변경 기능 추가
- [ ] 견적 생성 결과를 서버 quote로 저장
- [ ] 견적 상세에서 서버/로컬 데이터 fallback 정책 정리
- [ ] 주문 접수 전 가격 재확인 로직 추가
- [ ] 장바구니와 견적 저장 플로우 통합 정책 확정

## 8. 보안 및 운영

- [x] JWT 기반 인증 토큰 발급
- [x] 개발 단계 CORS 허용 설정
- [ ] 비밀번호 평문 저장 제거
- [ ] 관리자 API 권한 가드 적용
- [ ] 배포 환경 CORS origin 제한
- [ ] JWT secret/env 필수값 검증
- [ ] 민감 환경변수와 샘플 환경변수 분리 점검
- [ ] 주문/사용자 개인정보 로그 노출 점검

## 9. 검증

- [x] 기존 문서 기준 `npm install` 수행 이력 존재
- [x] 기존 문서 기준 typecheck/build 수행 이력 존재
- [x] 기존 로그 기준 백엔드 TypeScript 컴파일 성공 이력 존재
- [x] 기존 로그 기준 프론트엔드 TypeScript 컴파일 성공 이력 존재
- [ ] 현재 워크트리 기준 `npm run typecheck` 재실행
- [ ] 현재 워크트리 기준 `npm run build` 재실행
- [ ] API 서버 기동 후 주요 endpoint smoke test
- [ ] 프론트 dev 서버 기동 후 핵심 화면 브라우저 QA
- [ ] 주문 생성부터 관리자 상태 변경까지 E2E 수동 검증

## 10. 다음 구현 우선순위

- [ ] 1순위: 현재 워크트리 기준 typecheck/build 오류 제거
- [ ] 2순위: DB schema/entity/seed 일치 여부 점검
- [ ] 3순위: 로그인/회원가입/현재 사용자 조회 플로우 검증
- [ ] 4순위: 견적 생성 -> 저장 -> 주문 접수 -> 주문 추적 플로우 서버 연결 완성
- [ ] 5순위: 관리자 권한 가드와 주문 상태 변경 검증
- [ ] 6순위: 추천 견적/벤치마크 데이터 출처와 갱신 정책 표시
- [ ] 7순위: 보안 필수 항목 적용 후 배포 체크리스트 작성
