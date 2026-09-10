# 견적왕 추천 조합 API

작성일: 2026-09-10
Wayfinder map: #63
관련 티켓: #72
상태: 구현 승인

## 문제

견적왕 추천 조합 원본 스냅샷 2,099개는 DB에 적재됐지만 기존 벤치마크 화면의
게임 표는 실제 FPS 결과만 조회한다. 사용자는 추천 조합이 저장됐는지, 같은
CPU/GPU가 어떤 게임·해상도·등급에서 추천됐는지 확인할 수 없다. 맥락 필드가
없는 레거시 1건은 공개 집계에서 제외하고, 유효한 2,098개 스냅샷만 공개한다.

## API 계약

### 조합 목록

`GET /api/benchmarks/recommendation-combos`

쿼리:

- `q`: CPU·GPU·게임명 부분 검색
- `cpu`, `gpu`, `game`, `resolution`: 선택적 필터
- `limit`: 기본 50, 최대 200

응답:

```json
{
  "items": [
    {
      "comboKey": "i5-14400f-rtx-5060",
      "publicComboKey": "intel-core-i5-14400f-nvidia-rtx-5060",
      "publicComboRef": "combo_...",
      "publicComboName": "i5-14400F + RTX 5060",
      "cpuModel": "i5-14400F",
      "gpuModel": "RTX 5060",
      "sourceCode": "KJWWANG",
      "sourceName": "견적왕",
      "recommendationCount": 315,
      "gameCount": 133,
      "latestCapturedAt": "2026-09-10T04:47:18.092Z"
    }
  ],
  "total": 72
}
```

### 조합 상세

`GET /api/benchmarks/recommendation-combos/:comboRef`

`:comboRef`는 목록 응답의 불투명한 `publicComboRef`다. 고객용 정규화 식별자는
목록·상세의 `publicComboKey`로 제공하며, 내부 원본 조합 키를 직접 URL 계약으로
사용하지 않는다.

응답은 조합 요약과 다음 맥락 목록을 포함한다.

- `gameId`, `gameName`
- `resolution`, `tier`, `platform`
- `priceRange`, `price`
- `sourceCode`, `sourceName`, `sourceUrl`, `capturedAt`

FPS 값은 반환하지 않는다. 이 API의 데이터는 `GameRecommendationCombo`이며
`GameFpsObservation`이 아니다.

## 결정 사항

- 같은 정규화 CPU/GPU는 목록에서 하나의 그룹으로 묶는다.
- 게임·해상도·등급·플랫폼이 다르면 상세 맥락으로 보존한다.
- 현재는 KJWWANG만 제공해 출처 혼합을 방지한다.
- 실제 FPS API와 별도 엔드포인트를 사용한다.
- 추천 스냅샷이 없는 조합 상세는 빈 맥락으로 성공 응답하지 않고 `404`로 처리한다.

## 테스트

- 목록이 KJWWANG 조합을 추천 맥락 수와 최신 시각으로 집계한다.
- 목록 필터가 CPU/GPU/게임/해상도 조건을 DB 쿼리에 반영한다.
- 상세가 같은 CPU/GPU의 서로 다른 게임·해상도·등급 맥락을 보존한다.
- 상세 응답에 FPS 필드가 포함되지 않는다.
- 존재하지 않는 조합 참조는 404가 된다.

## 범위 밖

- 추천 조합 UI 구현
- 견적왕 추천 문구를 실제 FPS로 변환
- 왕가PC·ComputerBase와의 출처 혼합
