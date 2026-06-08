import type { Quote, QuotePart } from './v1-types';
import { defaultInput } from './v1-estimator';

export type RecommendedBuild = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  tags: string[];
  target: string;
  publishedAt: string;
  videoTitle: string;
  videoUrl: string;
  highlights: string[];
  parts: QuotePart[];
};

export const recommendedBuilds: RecommendedBuild[] = [
  {
    id: 'RB-2026-QHD-01',
    slug: 'qhd-9800x3d-rtx5060ti',
    title: 'QHD 국민 게이밍 추천 PC',
    subtitle: '라이젠 7 9800X3D 중심의 고프레임 게이밍 구성',
    heroImage: 'https://image3.compuzone.co.kr/img/product_img/2024/1105/1187400/1187400_600.jpg',
    tags: ['QHD', '배그 추천', '고프레임', '가성비 튜닝'],
    target: '배틀그라운드, 로스트아크, 발로란트 QHD 고주사율 플레이',
    publishedAt: '2026-06-08',
    videoTitle: '정효성 TV 추천 견적 · QHD 게이밍',
    videoUrl: 'https://www.youtube.com/',
    highlights: ['게임 성능 우선', 'AM5 업그레이드 여지', '750W 이상 파워 권장', 'VGA 길이 확인 필요'],
    parts: [
      part('CPU', 'AMD Ryzen 7 9800X3D', 'QHD 게임 프레임 핵심', 617000, '1187400'),
      part('쿨러', '듀얼타워 공랭 쿨러', '고부하 온도 안정화', 65000),
      part('메인보드', 'B650M DDR5 메인보드', 'AM5 / DDR5 / M.2 구성', 165000),
      part('RAM', 'DDR5 32GB 6000MHz', '게임+멀티태스킹 권장 용량', 145000),
      part('그래픽카드', 'GeForce RTX 5060 Ti 16GB', 'QHD 게이밍 권장 GPU', 620000),
      part('SSD', 'NVMe Gen4 1TB', '빠른 로딩과 충분한 설치 공간', 115000),
      part('파워', '750W Gold ATX 3.1', 'GPU 피크 대응 여유', 128000),
      part('케이스', '고풍량 메시 미들타워', '쿨링/장착성 균형', 98000),
    ],
  },
  {
    id: 'RB-2026-WHITE-01',
    slug: 'white-fhd-streaming',
    title: '화이트 감성 방송 입문 PC',
    subtitle: 'FHD 게임+방송을 예쁘게 시작하는 화이트 구성',
    heroImage: 'https://image3.compuzone.co.kr/img/product_img/2025/0917/1282031/1282031_600.jpg',
    tags: ['화이트 감성', '방송 입문', 'FHD', '저소음'],
    target: 'FHD 게임, OBS 방송, 유튜브 편집 입문',
    publishedAt: '2026-06-08',
    videoTitle: '정효성 TV 추천 견적 · 화이트 방송 입문',
    videoUrl: 'https://www.youtube.com/',
    highlights: ['화이트 톤 통일', '소음 낮은 공랭 구성', '32GB 메모리', '추후 GPU 업그레이드 가능'],
    parts: [
      part('CPU', 'AMD Ryzen 5 7500F', '입문 게이밍/방송 균형', 175000),
      part('쿨러', '화이트 ARGB 공랭 쿨러', '감성과 온도 관리', 45000),
      part('메인보드', 'A620M DDR5 메인보드', '필수 기능 중심', 105000),
      part('RAM', 'DDR5 32GB', '방송/브라우저 여유', 118000),
      part('그래픽카드', 'GeForce RTX 5060 8GB White', 'FHD 고주사율', 430000),
      part('SSD', 'NVMe 1TB', '게임/영상 저장 여유', 86000),
      part('파워', '700W Bronze', '업그레이드 여유', 82000),
      part('케이스', '화이트 메시 미들타워', '감성/통풍 균형', 79000),
    ],
  },
];

export function getRecommendedBuild(slug: string) {
  return recommendedBuilds.find((build) => build.slug === slug);
}

export function recommendedBuildToQuote(build: RecommendedBuild): Quote {
  const subtotal = build.parts.reduce((sum, item) => sum + item.price, 0);
  return {
    id: `Q-R-${build.id}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: build.title,
    mode: 'AUTO',
    input: { ...defaultInput, purpose: build.tags.includes('방송 입문') ? '방송' : '게임' },
    parts: build.parts,
    performance: [],
    compatibility: ['관리자 추천 견적: 주문 전 가격/재고/호환성 최종 확인', ...build.highlights.map((item) => `확인: ${item}`)],
    subtotal,
    assemblyFee: 50000,
    shippingFee: 10000,
    windowsFee: 0,
    total: subtotal + 60000,
    status: 'DRAFT',
  };
}

function part(category: string, name: string, memo: string, price: number, productNo?: string): QuotePart {
  return {
    category,
    name,
    memo,
    price,
    supplier: '관리자 추천',
    productNo,
  };
}
