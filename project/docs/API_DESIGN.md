# API 설계
> 최초 작성: 2026-05-23
> 최신 수정: 2026-05-30
> 기준: NestJS REST API

---

## Base URL

```txt
개발: http://localhost:3001
운영: https://api.example.com
```

---

## 공통 응답 형식

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

오류 응답:

```json
{
  "success": false,
  "error": {
    "code": "QUOTE_PRICE_CHANGED",
    "message": "견적 가격이 변경되었습니다."
  }
}
```

---

## Auth

| Method | Endpoint | 설명 |
|---|---|---|
| GET | `/auth/kakao` | 카카오 로그인 시작 |
| GET | `/auth/kakao/callback` | 카카오 로그인 콜백 |
| GET | `/auth/naver` | 네이버 로그인 시작 |
| GET | `/auth/naver/callback` | 네이버 로그인 콜백 |
| GET | `/auth/google` | 구글 로그인 시작 |
| GET | `/auth/google/callback` | 구글 로그인 콜백 |
| POST | `/auth/logout` | 로그아웃 |
| GET | `/me` | 내 정보 |

---

## Parts

| Method | Endpoint | 설명 |
|---|---|---|
| GET | `/part-categories` | 부품 카테고리 목록 |
| GET | `/parts` | 부품 목록. category, keyword, sort, onlyCompatible 필터 |
| GET | `/parts/:id` | 부품 상세 |
| GET | `/parts/:id/prices` | 공급처별 가격 이력 |

예시:

```txt
GET /parts?category=GPU&sort=popular&quoteId=1
```

---

## Quotes

| Method | Endpoint | 설명 |
|---|---|---|
| POST | `/quotes/estimate` | 설문 기반 자동 견적 생성 |
| GET | `/quotes` | 내 견적 목록 |
| GET | `/quotes/:id` | 견적 상세 |
| PATCH | `/quotes/:id/items/:itemId` | 견적 부품 변경 |
| GET | `/quotes/:id/compatible-parts` | 특정 카테고리의 호환 가능 부품 목록 |
| POST | `/quotes/:id/check-compatibility` | 호환성 재검사 |
| POST | `/quotes/:id/check-price` | 주문 직전 부품 가격 검증 |
| POST | `/quotes/:id/approve-price-change` | 가격 변경 승인 |
| POST | `/quotes/:id/order` | 견적을 주문으로 전환 |

`POST /quotes/estimate` 요청 예시:

```json
{
  "budgetAmount": 1500000,
  "budgetScope": "FULL_TOTAL",
  "purpose": "GAME",
  "games": ["배틀그라운드", "발로란트"],
  "monitorInput": "LG 27GP850",
  "resolution": "QHD",
  "storagePreference": "1TB_PLUS",
  "windowsOption": "LICENSE_AND_INSTALL",
  "priorityType": "PERFORMANCE",
  "aestheticOption": "NO_RGB",
  "cpuPreference": "NO_PREFERENCE",
  "gpuPreference": "NVIDIA"
}
```

`POST /quotes/:id/check-price` 동작:

- 견적에 포함된 공급처 상품만 즉시 확인한다.
- 가격이 같으면 `SAME`.
- 1원이라도 바뀌면 `CHANGED`와 변경 항목을 반환한다.
- 확인 실패/차단 의심/재고 이상은 `FAILED`로 반환하고 관리자 검토 대상으로 보낸다.

---

## Orders

| Method | Endpoint | 설명 |
|---|---|---|
| GET | `/orders` | 내 주문 목록 |
| GET | `/orders/:id` | 주문 상세 |
| GET | `/orders/:orderNo/track` | 주문번호 기반 추적 |
| POST | `/orders/:id/cancel-request` | 취소 요청 |

`POST /quotes/:id/order` 요청 예시:

```json
{
  "recipientName": "홍길동",
  "recipientPhone": "010-0000-0000",
  "postalCode": "12345",
  "address1": "서울시 ...",
  "address2": "101동 101호",
  "deliveryMemo": "부재 시 문 앞"
}
```

초기 주문 생성 결과 상태:

- 가격 검증 통과 + 자동 통과 가능: `WAITING_DEPOSIT`
- 초반 운영 정책 또는 검토 필요: `ADMIN_REVIEW`
- 가격 변경 발생: `PRICE_APPROVAL_REQUIRED`

---

## Admin

| Method | Endpoint | 설명 |
|---|---|---|
| GET | `/admin/orders` | 주문 목록 |
| GET | `/admin/orders/:id` | 주문 상세 |
| PATCH | `/admin/orders/:id/status` | 주문 상태 변경 |
| POST | `/admin/orders/:id/confirm-deposit` | 입금 확인 |
| PATCH | `/admin/orders/:id/items/:itemId/buy-price` | 실제 매입가 입력 |
| GET | `/admin/quotes` | 견적 목록 |
| GET | `/admin/quotes/:id` | 견적 상세 |
| PATCH | `/admin/quotes/:id/items/:itemId` | 관리자 견적 수정 |
| GET | `/admin/parts` | 부품 목록 |
| POST | `/admin/parts` | 표준 부품 생성 |
| PATCH | `/admin/parts/:id` | 표준 부품 수정 |
| PATCH | `/admin/parts/:id/specs` | 스펙 검수/수정 |
| GET | `/admin/supplier-listings` | 공급처 상품 목록 |
| PATCH | `/admin/supplier-listings/:id/match` | 표준 부품 매칭 승인 |
| GET | `/admin/price-check-logs` | 가격 확인 로그 |
| GET | `/admin/dealer-price-rules` | 예상 할인율 규칙 |
| POST | `/admin/dealer-price-rules` | 예상 할인율 규칙 생성 |
| PATCH | `/admin/dealer-price-rules/:id` | 예상 할인율 규칙 수정 |
| GET | `/admin/quote-templates` | 추천 템플릿 목록 |
| POST | `/admin/quote-templates` | 추천 템플릿 생성 |
| PATCH | `/admin/quote-templates/:id` | 추천 템플릿 수정 |

---

## 향후 API

| Method | Endpoint | 설명 |
|---|---|---|
| POST | `/admin/crawl-jobs` | 가격 수집 작업 예약 |
| GET | `/admin/crawl-jobs` | 수집 작업 목록 |
| GET | `/community/posts` | 커뮤니티 게시글 |
| POST | `/reviews` | 구매 후기 작성 |
| POST | `/payments/toss/virtual-account` | 토스페이먼츠 가상계좌 생성 |

---

## 결정 사항

- 주문 직전 가격 확인은 전체 재크롤링이 아니라 견적에 포함된 상품만 확인한다.
- 가격이 1원이라도 변경되면 승인 API를 거친다.
- 관리자 API는 MVP부터 필요하다. 초반 주문은 운영자가 검토해야 하기 때문이다.
- 부품 변경 API는 호환 가능한 부품 목록을 기준으로 동작한다.
