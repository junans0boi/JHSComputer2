# 부품 벤치마크 점수 수집·비교 그래프

작성일: 2026-09-10
Wayfinder map: #63
상태: 구현 진행 전 승인된 스펙

## 사용자 문제

현재 서비스는 CPU/GPU 조합의 게임 FPS를 주로 보여주며, 개별 부품의 Cinebench·3DMark 같은 점수를 저장하거나 비교하지 않는다. 사용자는 견적에 들어간 CPU/GPU가 같은 테스트에서 어느 정도인지, 다른 부품과 점수 차이가 얼마나 되는지 확인할 수 없다. 출처별 역할도 혼동되기 쉬워 추천 조합을 FPS 측정값처럼 표시하거나, 해상도·테스트 버전이 없는 숫자를 비교할 위험이 있다.

## 사용자 스토리

1. 사용자는 견적의 CPU와 GPU에 대해 지원되는 벤치마크 테스트·버전·점수 지표를 확인한다.
2. 사용자는 같은 테스트·버전·지표 안에서 견적 부품과 다른 부품의 점수, 절대 차이, 백분율 차이를 비교한다.
3. 사용자는 점수가 JHS 직접 측정인지 외부 출처 보고값인지 확인하고, 출처 URL·표본 수·테스트 조건을 열람한다.
4. 사용자는 `/benchmarks`에서 CPU 비교와 GPU 비교를 별도 그래프로 보고 CPU/GPU 점수 척도가 섞이지 않았음을 이해한다.
5. 사용자는 `/quote` 및 견적 상세에서 선택된 부품의 비교 그래프를 같은 공용 컴포넌트로 본다.
6. 사용자는 모바일 화면에서 긴 부품명·출처·그래프가 잘리지 않고 카드 형태로 읽는다.
7. 운영자는 ComputerBase·Blender Open Data 등 허용된 출처를 추가하면서 원본 관측값과 파싱 조건을 재현할 수 있다.
8. 운영자는 왕가PC·견적왕이 실제 FPS 숫자와 테스트 조건을 제공하는지 확인한 뒤에만 `GameFpsObservation`으로 적재한다.

## 도메인 계약

### 부품 벤치마크 테스트

`ComponentBenchmarkTest`는 아래 키로 동일 비교 집합을 식별한다.

```ts
type ComponentBenchmarkTest = {
  code: string;          // CINEBENCH, 3DMARK, BLENDER
  name: string;          // Cinebench R23, 3DMark Fire Strike
  version: string;       // R23, R24, 1.1, 2026 등
  metric: string;        // SINGLE, MULTI, GRAPHICS, OVERALL 등
  deviceType: 'CPU' | 'GPU';
  unit: string;          // pts, score
  comparableGroupKey: string;
};
```

현재 첫 범위는 다음이다.

- Cinebench R23 single/multi CPU
- Cinebench R24 single/multi CPU
- 3DMark Fire Strike Overall GPU
- 3DMark Time Spy Graphics GPU

실제 출처에 테스트 버전·지표가 명시되지 않으면 이 범위로 추정해 채우지 않는다.
ComputerBase의 현재 데스크톱 공개 차트는 Fire Strike 전체 점수는 제공하지만
Graphics Score를 같은 비교 집합으로 제공하지 않으므로, Fire Strike Graphics는
노트북 점수를 데스크톱 부품에 섞지 않고 별도 출처 확보 후 확장한다.
원문에 3DMark 빌드 버전이 없는 Time Spy·Fire Strike 관측값은 실제 버전을
추정하지 않고 `UNSPECIFIED@기사범위`로 저장해 서로 다른 기사 범위를 합치지 않는다.

### 부품 벤치마크 관측값

`ComponentBenchmarkObservation`은 하나의 표준 부품과 하나의 테스트에 대한 원본 관측값이다.

- 표준 부품 ID: `parts.PART_ID`
- 선택적 공급처 상품/외부 SKU 연결
- `SOURCE_REPORTED` 또는 `MEASURED`
- 점수와 단위
- 원문 URL, 출처 레코드 ID, 캡처 시각
- 테스트 시스템 CPU/메인보드/RAM/GPU, OS, 드라이버, 오버클럭 상태
- 원본 JSON/텍스트

출처 차트가 위 조건을 모두 공개하지 않는 경우 관측값을 버리거나 값을 추정하지
않는다. 대신 확인 가능한 값과 `unavailableConditionFields`를 함께 저장하고,
화면에는 조건이 부분 공개임을 표시한다. `SOURCE_REPORTED` 점수를 JHS 실측값으로
승격하지 않는 것이 우선이다.

관측값을 먼저 보존한 후 같은 테스트의 대표 점수를 집계한다. 최고 점수 하나만 대표값으로 사용하지 않으며 표본 수·중앙값 또는 선택된 대표 관측값을 함께 표시한다.

### 비교 규칙

- `comparableGroupKey`가 같은 관측값만 비교한다.
- CPU와 GPU를 같은 그래프나 하나의 점수로 합치지 않는다.
- Cinebench R23과 R24, Fire Strike와 Time Spy를 비교하지 않는다.
- 선택 부품 점수가 없으면 점수를 생성하지 않고 `데이터 준비 중`과 이유를 표시한다.
- 대표 점수가 여러 출처를 합친 값이면 출처 수·관측 수·점수 범위·조건 표본을 표시한다.
- `SOURCE_REPORTED`는 “출처 보고값”, `MEASURED`는 “JHS 직접 측정”으로 표시한다.

## 출처별 범위

| 출처 | 이 스펙에서의 역할 | 첫 구현 판단 |
|---|---|---|
| 왕가PC | 실제 견적 구성·가격; 실제 FPS 숫자와 조건이 확인된 경우 게임 FPS | FPS 엔드포인트 검증 티켓으로 분리 |
| 컴퓨존 | 공급처 상품·상세 스펙·후기·가격·이미지 | 기존 카탈로그 보강 계속 사용 |
| 견적왕 | 게임별 추천 조합·예산·해상도 정보; 실제 FPS 숫자와 조건이 확인된 경우 게임 FPS | 추천 조합과 FPS를 분리해 검증 |
| ComputerBase | 게임 해상도 FPS 원본 및 하드웨어 리뷰 차트 | 공개 리뷰 차트 파서 세로 슬라이스 |
| Blender Open Data | 공개 Blender 점수 후보 | 이용 조건과 표준 부품 매칭 후 확장 |
| Maxon | Cinebench 실행기·버전 정책의 공식 근거 | 공식 점수 DB로 간주하지 않음 |
| UL 3DMark | 공식 결과 검색·비교 정책 | 대량 수집은 이용 조건 확인 후 진행 |
| PugetBench | 크리에이터 벤치마크 후보 | 상업 라이선스 확인 전 범위 밖 |

## API 계약

새 API는 기존 게임 FPS API와 구분한다.

```text
GET /api/benchmarks/components/:partId/scores
GET /api/benchmarks/components/compare?partIds=...&testId=...
```

응답 항목은 최소한 다음을 포함한다.

```ts
type ComponentBenchmarkScore = {
  partId: number;
  partName: string;
  manufacturer?: string;
  deviceType: 'CPU' | 'GPU';
  test: {
    id: number;
    code: string;
    name: string;
    version: string;
    metric: string;
    unit: string;
    comparableGroupKey: string;
  };
  score: number;
  representative: boolean;
  observationCount: number;
  evidenceType: 'SOURCE_REPORTED' | 'MEASURED';
  sourceNames: string[];
  sourceUrls: string[];
  deltaFromSelected?: number;
  deltaPercentFromSelected?: number;
  conditions?: Record<string, unknown>;
};
```

선택된 부품이 명시되지 않거나 해당 테스트 관측값이 없으면 결과를 빈 숫자로 채우지 않고 명시적 상태/이유를 반환한다.

## UI 결정

- 공용 `BenchmarkScoreComparison` 컴포넌트를 만든다.
- 데스크톱은 가로 막대 그래프와 숫자·차이를 함께 표시한다.
- 모바일은 각 부품을 카드로 쌓고 긴 이름·URL·조건은 줄바꿈/접기 처리한다.
- CPU와 GPU 탭을 분리한다.
- 테스트 버전·점수 지표를 그래프 제목과 범례에 표시한다.
- 출처 보고값/직접 측정값, 표본 수, 데이터 없음 사유를 그래프 주변에 표시한다.
- `판매 단위 상세`의 긴 테이블 레이아웃을 재사용하지 않고, 벤치마크 비교에 맞는 반응형 구성으로 만든다.

## 구현 순서

1. 출처·이용 조건 조사 및 왕가PC/견적왕 FPS 실제 데이터 검증
2. DB migration과 관측값/테스트 계약
3. ComputerBase 차트 또는 이용 허용된 공개 원본 수집기와 표준 부품 매칭
4. 서버 집계·비교 API와 provenance 테스트
5. 벤치마크/견적 공용 그래프와 모바일 QA
6. 전체 타입체크·테스트·빌드·운영 smoke 및 독립 코드 리뷰

## 테스트 결정

- Agent: 동일 외부 결과 중복 제거, 버전/지표 누락 거부, 표준 부품 매칭 실패, 실제 FPS 없는 추천 조합의 FPS 미생성을 테스트한다.
- DB/API: 다른 테스트 간 비교 차단, CPU/GPU 그래프 분리, 대표 점수 표본 수와 근거 분류를 테스트한다.
- Frontend: 빈 상태, 출처 라벨, 긴 부품명, 모바일 카드/막대 줄바꿈을 테스트하고 `/benchmarks`·견적 상세를 브라우저에서 확인한다.
- 운영: migration dry-run → dev/stage 적용 → API smoke 순서로 확인하며 운영 DB destructive reset은 하지 않는다.

## 완료 기준

- 최소 하나의 허용된 공개 출처에서 CPU 또는 GPU 관측값이 실제 URL·테스트 조건과 함께 DB에 저장된다.
- 같은 테스트/버전/지표만 비교하는 API가 점수·절대 차이·백분율 차이·근거를 반환한다.
- 견적 화면과 벤치마크 화면에서 같은 공용 비교 UI를 사용한다.
- 데이터가 없을 때 숫자·가짜 그래프·다른 버전 점수를 대신 표시하지 않는다.
- 왕가PC/견적왕의 실제 FPS 검증 결과가 문서·코드·화면 표시에 일치한다.
- 서버/프론트/Agent 검증과 독립 코드 리뷰가 끝난 뒤 기능별 커밋을 만든다.

## 범위 밖

- 새 측정 장비를 사용한 대량 JHS 실측
- CPU/GPU/게임 FPS를 하나의 종합점수로 합산
- 라이선스가 확인되지 않은 3DMark/PugetBench 대량 스크랩
- 해상도·테스트 조건이 없는 FPS/벤치마크 숫자의 보간·복제
- 기존 운영 DB의 초기화
