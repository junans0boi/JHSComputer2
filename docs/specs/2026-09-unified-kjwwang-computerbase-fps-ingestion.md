# 견적왕·ComputerBase 통합 FPS 관측값 수집

작성일: 2026-09-10
관련 Wayfinder: #63
구현 티켓: #75

## 문제

현재 ComputerBase와 견적왕의 FPS 수집 경로가 서로 다르다. ComputerBase는
`benchmark_fps_results`에 숫자 FPS를 적재하지만, 견적왕 견적 상세 페이지에는 CPU·GPU와
FHD/QHD/UHD별 게임 FPS가 있음에도 과거 Markdown 동기화 경로가 CPU/GPU를
`9800X3D + RX 9070 XT`로 고정하고 FPS 행을 삭제한다. 그 결과 실제 페이지에 있는
`9600X + RTX 5060 Ti`, `Ultra 7 265K + RTX 5060 Ti` 등의 조합이 선택기에 나타나지 않는다.

## 결정된 요구사항

1. ComputerBase와 견적왕의 FPS 원본은 기존 `benchmark_fps_results`에 함께 적재한다.
2. 조합별 집계도 기존 `benchmark_combo_game_results`를 공동 사용한다.
3. 모든 FPS 행과 집계 행에 `EVIDENCE_TYPE`을 보존한다.
   - `SOURCE_BENCHMARK`: 테스트 시스템·차트 조건이 명시된 원문 벤치마크
   - `SOURCE_RECOMMENDATION`: 견적왕 견적 작성자가 안내한 추천 FPS
   - `MEASURED`: 향후 JHS 직접 측정
4. 견적왕 추천값은 숫자 FPS로 저장하되 고객 화면에서 실측으로 표시하지 않는다. 출처명과
   근거 설명은 API에 보존하고, 화면 라벨은 `견적왕 추천값`으로 구분할 수 있게 한다.
5. `benchmark_builds`에는 견적왕 `es_sn` 하나당 원본 견적을 보존한다. 동일 CPU/GPU가
   여러 견적에 등장해도 원본 게시물과 부품 구성은 삭제하지 않는다.
6. 공개 조합 집계는 동일 CPU/GPU·게임·해상도·옵션·근거 유형 안에서 최신 견적 게시물의
   값을 대표값으로 사용한다. 최신성은 `sourceUpdatedAt` → 숫자 견적 ID(`es_sn`) →
   실제 수집 시각 → DB 빌드 ID 순으로 결정한다. 서로 다른 출처 조건을 평균하거나
   해상도별로 복제하지 않는다.
7. `es_sn`은 견적 ID 커서로 순회한다. ID가 비어 있거나 삭제된 페이지는 실패가 아니라
   체크포인트 상태로 기록하고 다음 ID를 계속 처리한다.
8. 수집기는 EUC-KR 응답을 UTF-8로 변환하고, 페이지 전체 HTML·응답 상태·수집 시각·원본
   URL·콘텐츠 해시를 보존한다.
9. 견적왕 수집은 요청 간 기본 6초 이상 지연과 작은 지터, 배치 휴식, 429/5xx 백오프,
   원자적 체크포인트를 사용한다. 중단된 실행은 마지막 커서부터 재개한다.

## 파싱 계약

- CPU와 GPU는 제목이 아니라 부품표의 `CPU`, `그래픽카드` 항목을 기준으로 추출한다.
- `.game_list`의 해상도 제목에서 `FHD`, `QHD`, `UHD`를 추출한다.
- 각 게임 `<li>`에서 `.gname`, 옵션 문구, 숫자 FPS를 추출한다.
- 숫자 FPS가 없는 `FPS 가능합니다` 문장은 추천 가능성 원문으로만 보존하고 FPS 관측 행은
  만들지 않는다.
- 게임·해상도·옵션이 같은 행은 옵션이 다른 경우 보존한다. 동일 행을 단순히
  `게임+해상도`로 덮어쓰지 않는다.
- `AMD 라이젠5-6세대 9600X`, `Ryzen5 9600X`처럼 표현이 달라도 공용 CPU/GPU 정규화
  키로 같은 조합에 연결한다.

## 외부 인터페이스

- 기존 CPU/GPU 선택기는 `benchmark_combo_game_results`에서 `FPS 관측값`이 있는 조합을
  계속 읽는다.
- 게임 결과 API는 `evidenceType`, `sourceNames`, `sourceUrl`, `testSystem`을 반환한다.
- 기존 프론트 표는 게임+옵션 행을 유지하고, 셀에는 FPS와 체감 등급만 표시한다.
- 견적왕 추천값과 ComputerBase 값이 같은 조합·게임·해상도에 모두 있으면 조건별 원본을
  API에서 보존하고, 고객 표는 우선순위 규칙으로 한 값을 선택하되 근거 유형을 잃지 않는다.

## 테스트 결정

- 견적왕 실제 HTML fixture에서 27192 페이지의 CPU/GPU, 145개 게임, FHD/QHD/UHD 숫자
  FPS를 추출한다.
- 같은 게임·해상도에서 옵션이 다른 행을 덮어쓰지 않는지 검증한다.
- 숫자가 없는 추천 문장은 FPS 행을 만들지 않는지 검증한다.
- ComputerBase 기존 fixture가 `SOURCE_BENCHMARK`로 변하지 않고 계속 적재되는지 검증한다.
- 두 출처가 같은 테이블에 들어간 뒤 `EVIDENCE_TYPE`과 `SOURCE_CONDITION_KEY`로 분리되는지
  DB 동기화 테스트에서 확인한다.
- 27190~27194 소량 수집 dry-run 및 dev DB apply에서 CPU 선택지와 FPS 조합 수를 확인한다.

## 범위 밖

- 견적왕 추천값을 JHS 직접 측정으로 표현하는 것
- 원문에 없는 FPS 생성·보간·해상도 복제
- 왕가PC에 없는 숫자 FPS를 추정해 적재하는 것
- 운영 DB 전체 삭제 또는 destructive reset
