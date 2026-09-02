-- Demo seed data for JHSComputer presentation

-- 부품 데이터 (2026년 9월 기준 실제 시장 부품)
INSERT INTO parts (PART_CATEGORY_ID, CANONICAL_NAME, MANUFACTURER, MODEL_NAME, MODEL_KEY, STATUS, IS_ADMIN_APPROVED, ADMIN_PRIORITY, POPULARITY_SCORE)
VALUES
-- CPU
(1, 'AMD 라이젠 7 9800X3D', 'AMD', '라이젠 7 9800X3D', 'AMD-R7-9800X3D', 'ACTIVE', 'Y', 100, 98.5),
(1, 'AMD 라이젠 5 9600', 'AMD', '라이젠 5 9600', 'AMD-R5-9600', 'ACTIVE', 'Y', 90, 85.0),
(1, 'AMD 라이젠 7 9700X', 'AMD', '라이젠 7 9700X', 'AMD-R7-9700X', 'ACTIVE', 'Y', 85, 80.0),
(1, 'Intel Core Ultra 9 285K', 'Intel', 'Core Ultra 9 285K', 'INTEL-U9-285K', 'ACTIVE', 'Y', 70, 72.0),
-- GPU
(5, 'NVIDIA RTX 5060 Ti 16GB', 'NVIDIA', 'RTX 5060 Ti 16GB', 'NVIDIA-RTX5060TI-16G', 'ACTIVE', 'Y', 100, 95.0),
(5, 'NVIDIA RTX 5060 8GB', 'NVIDIA', 'RTX 5060 8GB', 'NVIDIA-RTX5060-8G', 'ACTIVE', 'Y', 90, 88.0),
(5, 'NVIDIA RTX 5070', 'NVIDIA', 'RTX 5070', 'NVIDIA-RTX5070', 'ACTIVE', 'Y', 80, 82.0),
(5, 'AMD RX 9070 XT', 'AMD', 'RX 9070 XT', 'AMD-RX9070XT', 'ACTIVE', 'Y', 75, 78.0),
-- RAM
(4, 'DDR5-6000 32GB (16GB×2)', '삼성', 'DDR5-6000 32GB', 'SAM-DDR5-6000-32G', 'ACTIVE', 'Y', 90, 92.0),
(4, 'DDR5-6000 16GB (8GB×2)', '삼성', 'DDR5-6000 16GB', 'SAM-DDR5-6000-16G', 'ACTIVE', 'Y', 80, 80.0),
-- SSD
(6, 'NVMe Gen4 1TB', '삼성', '990 Pro 1TB', 'SAM-990PRO-1TB', 'ACTIVE', 'Y', 90, 90.0),
(6, 'NVMe Gen4 2TB', '삼성', '990 Pro 2TB', 'SAM-990PRO-2TB', 'ACTIVE', 'Y', 80, 82.0),
-- 메인보드
(3, 'AMD B850 ATX 메인보드', 'ASUS', 'ROG STRIX B850-F', 'ASUS-B850F', 'ACTIVE', 'Y', 85, 85.0),
(3, 'AMD X870E ATX 메인보드', 'MSI', 'MEG X870E ACE', 'MSI-X870E-ACE', 'ACTIVE', 'Y', 70, 78.0),
-- 파워
(8, '850W 80PLUS GOLD', 'Seasonic', 'FOCUS GX-850', 'SEAS-FOCUS-GX850', 'ACTIVE', 'Y', 85, 88.0),
(8, '1000W 80PLUS PLATINUM', 'Seasonic', 'PRIME PX-1000', 'SEAS-PRIME-PX1000', 'ACTIVE', 'Y', 70, 80.0),
-- 케이스
(9, '미들타워 ATX 케이스 블랙', 'Fractal', 'North ATX Black', 'FRAC-NORTH-BK', 'ACTIVE', 'Y', 85, 87.0),
(9, '미들타워 ATX 케이스 화이트', 'Fractal', 'North ATX White', 'FRAC-NORTH-WH', 'ACTIVE', 'Y', 80, 84.0),
-- 쿨러
(2, '240mm 수랭 쿨러', 'DeepCool', 'LT240 AIO', 'DEEP-LT240', 'ACTIVE', 'Y', 85, 83.0),
(2, '공랭 쿨러 타워형', 'Noctua', 'NH-D15 G2', 'NOCT-NHD15G2', 'ACTIVE', 'Y', 80, 85.0)
ON DUPLICATE KEY UPDATE CANONICAL_NAME=CANONICAL_NAME;

-- 공급처 데이터
INSERT INTO suppliers (SUPPLIER_CODE, SUPPLIER_NAME, BASE_URL, IS_ACTIVE)
VALUES
  ('COMPUZONE', '컴퓨존', 'https://www.compuzone.co.kr', 'Y'),
  ('DANAWA', '다나와', 'https://prod.danawa.com', 'Y')
ON DUPLICATE KEY UPDATE SUPPLIER_NAME=SUPPLIER_NAME;

-- 추천 게시글 (recommendation_posts)
INSERT INTO recommendation_posts
  (SLUG, TITLE, SUMMARY, BODY_MARKDOWN, PURPOSE_TAG, BUDGET_MIN, BUDGET_MAX, TOTAL_PRICE, ASSEMBLY_FEE, IS_PUBLISHED, PUBLISHED_DT, ADMIN_SORT_ORDER)
VALUES
(
  'gaming-entry-2026',
  '게이밍 입문 세트 — 라이젠 5 9600 + RTX 5060',
  'FHD 고주사율 게이밍에 최적화된 가성비 입문 구성. 발로란트·롤·배틀그라운드를 144Hz 이상으로 즐길 수 있습니다.',
  '# 게이밍 입문 세트\n\n**예산:** 90만~100만원대  \n**타겟:** FHD 144Hz 이상, 발로란트·롤·배그 플레이어\n\n## 성능 요약\n\n- **발로란트** 1080p 최상: 평균 **240+ FPS**\n- **배틀그라운드** 1080p 울트라: 평균 **120+ FPS**\n- **롤** 1080p 최상: 평균 **300+ FPS**\n\n## 부품 구성 이유\n\n### CPU: 라이젠 5 9600\n게임 성능과 가격의 황금 비율. 6코어 12스레드로 FHD 게이밍에서 병목 없음.\n\n### GPU: RTX 5060 8GB\n2026년 FHD 게이밍의 표준 GPU. DLSS 4 지원으로 실제 체감 성능은 훨씬 높음.\n\n## 조립 완료 후\n조립 후 벤치마크 테스트를 완료하고 발송합니다.',
  '게임',
  850000,
  1050000,
  950000,
  80000,
  'Y',
  NOW(),
  10
),
(
  'gaming-standard-2026',
  '게이밍 스탠다드 — 라이젠 7 9800X3D + RTX 5060 Ti',
  'QHD 게이밍까지 커버하는 밸런스 구성. 3D V-Cache로 게임 최적화된 CPU에 최신 Ti 급 GPU 조합.',
  '# 게이밍 스탠다드\n\n**예산:** 150만~170만원대  \n**타겟:** QHD 144Hz, 배그·발로란트·에이팩스 유저\n\n## 성능 요약\n\n- **배틀그라운드** QHD 울트라: 평균 **100+ FPS**\n- **발로란트** QHD 최상: 평균 **200+ FPS**\n- **사이버펑크 2077** QHD 울트라: 평균 **80+ FPS**\n\n## 부품 구성 이유\n\n### CPU: 라이젠 7 9800X3D\n3D V-Cache 탑재로 게임 성능 1위. 멀티코어 작업도 뛰어남.\n\n### GPU: RTX 5060 Ti 16GB\n16GB VRAM이 QHD 게이밍에서 큰 차이를 만듦. DLSS 4 Frame Generation 지원.\n\n## 구성의 장점\n이 조합은 앞으로 3~4년은 충분히 사용할 수 있는 구성입니다.',
  '게임',
  1400000,
  1700000,
  1580000,
  80000,
  'Y',
  NOW(),
  20
),
(
  'gaming-premium-2026',
  '게이밍 프리미엄 — 라이젠 7 9800X3D + RTX 5070',
  'QHD 최상 세팅에서 4K까지 대응하는 프리미엄 구성. 게임과 영상 편집까지 모두 소화.',
  '# 게이밍 프리미엄\n\n**예산:** 220만~260만원대  \n**타겟:** QHD 최상 / 4K 게이밍, 영상 편집 겸용\n\n## 성능 요약\n\n- **사이버펑크 2077** QHD 레이트레이싱: 평균 **90+ FPS**\n- **배틀그라운드** 4K 울트라: 평균 **80+ FPS**\n- **영상 편집** 4K 타임라인: 실시간 재생 가능\n\n## 부품 구성 이유\n\n### CPU: 라이젠 7 9800X3D\n게임 + 렌더링 모두 최고 수준.\n\n### GPU: RTX 5070\n4K 게이밍의 현실적인 진입점. VRAM 16GB로 AI 워크로드까지 대응 가능.\n\n## 추천 대상\n스트리밍 방송을 하거나 영상 편집을 병행하면서 고성능 게이밍까지 원하는 분.',
  '게임',
  2100000,
  2600000,
  2400000,
  80000,
  'Y',
  NOW(),
  30
),
(
  'office-budget-2026',
  '사무·문서 가성비 세트 — 라이젠 5 9600 + 내장그래픽',
  '인터넷·문서·유튜브 작업에 최적화된 가성비 사무용 PC. 빠른 부팅과 안정적인 동작이 목표.',
  '# 사무용 가성비 PC\n\n**예산:** 50만~70만원대  \n**타겟:** 인터넷·문서·화상회의·유튜브\n\n## 특징\n\n- NVMe SSD로 부팅 시간 **10초 이내**\n- 저발열 저소음 설계\n- 윈도우 11 정품 설치 가능\n\n## 이 구성이면 충분한 작업\n- 엑셀·워드·파워포인트\n- 줌·카카오톡·유튜브\n- 포토샵 (가벼운 작업)',
  '사무',
  480000,
  650000,
  580000,
  80000,
  'Y',
  NOW(),
  40
)
ON DUPLICATE KEY UPDATE TITLE=TITLE;
