import { getRecommendedPart } from './compuzone-catalog';
import { getQuotePartAttributes } from './part-filters';
import type { CatalogPart, ManualQuantities, ManualSelection, PartCategory, PerformanceResult, Priority, Purpose, Quote, QuoteInput, QuotePart, Resolution } from './v1-types';
import { getWindowsFee } from './windows-options';

const gameBaseFps: Record<string, number> = {
  롤: 260,
  발로란트: 300,
  배틀그라운드: 165,
  로스트아크: 150,
  '오버워치 2': 190,
  메이플스토리: 240,
  피파온라인: 220,
};

const resolutionFactor: Record<Resolution, number> = {
  FHD: 1.18,
  QHD: 1,
  '4K': 0.62,
};

const tierMultiplier = [0.72, 0.9, 1, 1.16, 1.34];

export const categories: PartCategory[] = ['CPU', '쿨러', '메인보드', 'RAM', '그래픽카드', 'SSD', '파워', '케이스'];

const partCatalog: Record<number, Record<PartCategory, Omit<QuotePart, 'price' | 'supplier'> & { basePrice: number }>> = {
  0: {
    CPU: { category: 'CPU', name: 'AMD Ryzen 5 7500F', memo: '입문 게이밍 표준', basePrice: 175000 },
    쿨러: { category: '쿨러', name: 'PCCOOLER PALADIN 400', memo: '공랭 기본 안정권', basePrice: 35000 },
    메인보드: { category: '메인보드', name: 'A620M DDR5', memo: '필수 기능 중심', basePrice: 105000 },
    RAM: { category: 'RAM', name: 'DDR5 16GB', memo: '기본 게임 용량', basePrice: 68000 },
    그래픽카드: { category: '그래픽카드', name: 'GeForce RTX 5050 8GB', memo: 'FHD 가성비', basePrice: 330000 },
    SSD: { category: 'SSD', name: 'NVMe 500GB', memo: 'OS/주요 게임용', basePrice: 52000 },
    파워: { category: '파워', name: '600W Bronze', memo: '정격 여유 확보', basePrice: 62000 },
    케이스: { category: '케이스', name: '전면 메시 미들타워', memo: '기본 통풍', basePrice: 56000 },
  },
  1: {
    CPU: { category: 'CPU', name: 'AMD Ryzen 5 9600', memo: '게임/작업 균형', basePrice: 265000 },
    쿨러: { category: '쿨러', name: '3RSYS Socoool RC350', memo: '소음/온도 균형', basePrice: 42000 },
    메인보드: { category: '메인보드', name: 'B650M DDR5', memo: '업그레이드 여지', basePrice: 155000 },
    RAM: { category: 'RAM', name: 'DDR5 32GB', memo: '멀티태스킹 권장', basePrice: 118000 },
    그래픽카드: { category: '그래픽카드', name: 'GeForce RTX 5060 8GB', memo: 'FHD 고주사율', basePrice: 430000 },
    SSD: { category: 'SSD', name: 'NVMe 1TB', memo: '게임 설치 여유', basePrice: 86000 },
    파워: { category: '파워', name: '700W Bronze', memo: 'GPU 피크 대응', basePrice: 82000 },
    케이스: { category: '케이스', name: 'ARGB 메시 미들타워', memo: '쿨링/감성 균형', basePrice: 78000 },
  },
  2: {
    CPU: { category: 'CPU', name: 'AMD Ryzen 7 7800X3D', memo: '게임 특화 고성능', basePrice: 445000 },
    쿨러: { category: '쿨러', name: 'Thermalright PA120 SE', memo: '고성능 공랭', basePrice: 59000 },
    메인보드: { category: '메인보드', name: 'B650M WiFi DDR5', memo: 'Wi-Fi/확장성', basePrice: 195000 },
    RAM: { category: 'RAM', name: 'DDR5 32GB 6000MHz', memo: 'AM5 권장 클럭', basePrice: 145000 },
    그래픽카드: { category: '그래픽카드', name: 'GeForce RTX 5060 Ti 16GB', memo: 'QHD 권장', basePrice: 620000 },
    SSD: { category: 'SSD', name: 'NVMe Gen4 1TB', memo: '빠른 로딩', basePrice: 112000 },
    파워: { category: '파워', name: '750W Gold ATX 3.1', memo: '효율/안정성', basePrice: 128000 },
    케이스: { category: '케이스', name: '고풍량 메시 미들타워', memo: 'GPU 장착 여유', basePrice: 98000 },
  },
  3: {
    CPU: { category: 'CPU', name: 'AMD Ryzen 7 9800X3D', memo: '최상급 게이밍', basePrice: 620000 },
    쿨러: { category: '쿨러', name: '3열 수랭 ARGB', memo: '고부하 온도 관리', basePrice: 145000 },
    메인보드: { category: '메인보드', name: 'B850 WiFi DDR5', memo: '최신 플랫폼', basePrice: 265000 },
    RAM: { category: 'RAM', name: 'DDR5 64GB 6000MHz', memo: '방송/작업 여유', basePrice: 285000 },
    그래픽카드: { category: '그래픽카드', name: 'GeForce RTX 5070 12GB', memo: 'QHD 울트라', basePrice: 890000 },
    SSD: { category: 'SSD', name: 'NVMe Gen4 2TB', memo: '대용량 프로젝트', basePrice: 185000 },
    파워: { category: '파워', name: '850W Gold ATX 3.1', memo: '업그레이드 대비', basePrice: 165000 },
    케이스: { category: '케이스', name: '프리미엄 강화유리 케이스', memo: '감성/조립성', basePrice: 148000 },
  },
  4: {
    CPU: { category: 'CPU', name: 'AMD Ryzen 9 9900X', memo: '작업/AI 병행', basePrice: 710000 },
    쿨러: { category: '쿨러', name: '프리미엄 3열 수랭', memo: '장시간 부하 대응', basePrice: 210000 },
    메인보드: { category: '메인보드', name: 'X870 WiFi DDR5', memo: '확장성 극대화', basePrice: 395000 },
    RAM: { category: 'RAM', name: 'DDR5 64GB 고클럭', memo: '대형 작업 권장', basePrice: 340000 },
    그래픽카드: { category: '그래픽카드', name: 'GeForce RTX 5080 16GB', memo: '4K/AI 대응', basePrice: 1580000 },
    SSD: { category: 'SSD', name: 'NVMe Gen5 2TB', memo: '고속 스토리지', basePrice: 295000 },
    파워: { category: '파워', name: '1000W Platinum ATX 3.1', memo: '고성능 안정권', basePrice: 285000 },
    케이스: { category: '케이스', name: '빅타워 고급형', memo: '발열/확장 여유', basePrice: 245000 },
  },
};

export const defaultInput: QuoteInput = {
  budget: 180,
  purpose: '게임',
  games: ['배틀그라운드', '발로란트'],
  resolution: 'QHD',
  storage: '1TB',
  windows: 'NONE',
  priority: '성능 우선',
};

export const games = Object.keys(gameBaseFps);
export const purposes: Purpose[] = ['게임', '방송', '영상편집', '사무', 'AI'];
export const resolutions: Resolution[] = ['FHD', 'QHD', '4K'];
export const priorities: Priority[] = ['성능 우선', '가성비 우선', '감성 우선', '업그레이드 우선'];

export function generateQuote(input: QuoteInput): Quote {
  const tier = pickTier(input);
  const parts = categories.map((category) => buildPart(category, tier, input));
  const subtotal = parts.reduce((sum, part) => sum + part.price, 0);
  const assemblyFee = input.purpose === '사무' ? 30000 : 50000;
  const shippingFee = 10000;
  const windowsFee = getWindowsFee(input.windows);

  return {
    id: `Q-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `자동 견적 · ${input.purpose} ${input.resolution}`,
    mode: 'AUTO',
    input,
    parts,
    performance: [],
    compatibility: buildCompatibility(parts),
    subtotal,
    assemblyFee,
    shippingFee,
    windowsFee,
    total: subtotal + assemblyFee + shippingFee + windowsFee,
    status: 'DRAFT',
  };
}

export function pickTier(input: QuoteInput) {
  const purposeBoost: Record<Purpose, number> = {
    게임: 0,
    방송: 0,
    영상편집: 0,
    사무: -1,
    AI: 1,
  };
  const resolutionBoost: Record<Resolution, number> = {
    FHD: -1,
    QHD: 0,
    '4K': 1,
  };
  const priorityBoost: Record<Priority, number> = {
    '성능 우선': 0,
    '가성비 우선': -1,
    '감성 우선': 0,
    '업그레이드 우선': 0,
  };
  
  // Adjust budget brackets to be more sensitive to low-end inputs
  let budgetTier = 0;
  if (input.budget >= 390) budgetTier = 4;
  else if (input.budget >= 280) budgetTier = 3;
  else if (input.budget >= 160) budgetTier = 2; // Mid-range ~160-190
  else if (input.budget >= 100) budgetTier = 1; // Low-mid ~100-130
  else budgetTier = 0; // Entry level < 100

  // Hard cap for low budgets: if they only have 90만원, we cannot force them into a tier 2 (160만원) build just because they selected '게임' or 'QHD'
  if (input.budget < 100) return 0;
  if (input.budget < 140) return Math.min(1, budgetTier);

  return Math.max(0, Math.min(4, budgetTier + purposeBoost[input.purpose] + resolutionBoost[input.resolution] + priorityBoost[input.priority]));
}

export function generateManualQuote(selection: ManualSelection, input: QuoteInput = defaultInput, quantities: ManualQuantities = {}): Quote {
  const selectedParts = categories.flatMap((category) => (selection[category] ? [selection[category]] : []));
  const parts = selectedParts.map((part) => catalogPartToQuotePart(part, quantities[part.category] ?? 1));
  const subtotal = parts.reduce((sum, part) => sum + part.price, 0);
  const assemblyFee = 50000;
  const shippingFee = 10000;
  const windowsFee = getWindowsFee(input.windows);

  return {
    id: `Q-M-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `수동 견적 · ${parts.length}개 부품`,
    mode: 'MANUAL',
    input,
    parts,
    performance: [],
    compatibility: buildCompatibility(parts),
    subtotal,
    assemblyFee,
    shippingFee,
    windowsFee,
    total: subtotal + assemblyFee + shippingFee + windowsFee,
    status: 'DRAFT',
  };
}

function buildPart(category: PartCategory, tier: number, input: QuoteInput): QuotePart {
  const base = partCatalog[tier][category];
  const catalogPart = getRecommendedPart(category, tier);
  let price = catalogPart?.price ?? base.basePrice;
  let name = catalogPart?.name ?? base.name;
  let memo = base.memo;

  if (category === 'SSD' && input.storage === '2TB' && tier < 3) {
    price += 78000;
    name = name.replace('500GB', '2TB').replace('1TB', '2TB');
    memo = '요청 용량 반영';
  }

  if (category === 'RAM' && (input.purpose === '영상편집' || input.purpose === 'AI') && !name.includes('64GB')) {
    price += 135000;
    name = 'DDR5 64GB';
    memo = '작업/AI 메모리 여유';
  }

  if (category === '케이스' && input.priority === '감성 우선') {
    price += 35000;
    memo = '감성 옵션 강화';
  }

  return {
    category: base.category,
    name,
    memo,
    price,
    supplier: '컴퓨존 샘플 기준',
    productNo: catalogPart?.productNo,
    imageUrl: catalogPart?.imageUrl,
    detailUrl: catalogPart?.detailUrl,
  };
}

function catalogPartToQuotePart(part: CatalogPart, quantity = 1): QuotePart {
  return {
    category: part.category,
    name: part.name,
    memo: quantity > 1 ? `${part.spec || '컴퓨존 카탈로그 선택'} · 수량 ${quantity}개` : part.spec || '컴퓨존 카탈로그 선택',
    price: part.price * quantity,
    quantity,
    supplier: '컴퓨존 샘플 기준',
    productNo: part.productNo,
    imageUrl: part.imageUrl,
    detailUrl: part.detailUrl,
  };
}

// Simple GPU tiering for delta calculation
const gpuTiers: Record<string, number> = {
  '5050': 0.8,
  '4060': 1.0,
  '5060': 1.1,
  '4060 Ti': 1.2,
  '4070': 1.5,
  '5070': 1.7,
  '4070 Ti': 1.6,
  '4080': 2.0,
  '5080': 2.3,
  '4090': 2.5,
};

// Simple CPU tiering for bottleneck calculation
const cpuTiers: Record<string, number> = {
  '7500F': 0.9,
  '12400F': 0.85,
  '7600': 0.95,
  '13600K': 1.05,
  '14600K': 1.1,
  '7800X3D': 1.3,
  '9800X3D': 1.4,
};

function extractModelNumber(name: string, dictionary: Record<string, number>): number | null {
  const upper = name.toUpperCase();
  let bestMatch: { key: string; val: number } | null = null;
  for (const [key, val] of Object.entries(dictionary)) {
    if (upper.includes(key.toUpperCase())) {
      if (!bestMatch || key.length > bestMatch.key.length) {
        bestMatch = { key, val };
      }
    }
  }
  return bestMatch?.val ?? null;
}

export function estimatePerformance(game: string, resolution: Resolution, parts: QuotePart[], priority: Priority): PerformanceResult {
  const baseFps = gameBaseFps[game] ?? 150;
  
  const gpu = parts.find(p => p.category === '그래픽카드');
  const cpu = parts.find(p => p.category === 'CPU');
  
  let gpuMultiplier = 0.9; // fallback tier 1
  let cpuMultiplier = 0.9;
  let isEstimated = false;

  if (gpu) {
    const extractedGpu = extractModelNumber(gpu.name, gpuTiers);
    if (extractedGpu) {
      gpuMultiplier = extractedGpu;
    } else {
      isEstimated = true; // No exact match, using fallback delta
      // Try to guess from price? (Very rough fallback)
      gpuMultiplier = Math.max(0.5, Math.min(3.0, gpu.price / 400000));
    }
  } else {
    isEstimated = true;
    gpuMultiplier = 0.4; // Internal GPU level
  }

  if (cpu) {
    const extractedCpu = extractModelNumber(cpu.name, cpuTiers);
    if (extractedCpu) {
      cpuMultiplier = extractedCpu;
    } else {
      isEstimated = true;
      cpuMultiplier = Math.max(0.5, Math.min(2.0, cpu.price / 250000));
    }
  } else {
    isEstimated = true;
  }

  // CPU Bottleneck logic: If GPU is way stronger than CPU, performance is throttled
  const bottleneckFactor = Math.min(1.0, cpuMultiplier / (gpuMultiplier * 0.8 + 0.1));
  const finalMultiplier = gpuMultiplier * bottleneckFactor;

  const priorityFactor = priority === '성능 우선' ? 1.08 : priority === '가성비 우선' ? 0.94 : 1;
  const average = Math.round(baseFps * resolutionFactor[resolution] * finalMultiplier * priorityFactor);
  const fpsMin = Math.max(30, Math.round(average * 0.82));
  const fpsMax = Math.round(average * 1.16);
  const grade = average >= 180 ? '쾌적' : average >= 120 ? '좋음' : average >= 75 ? '플레이 가능' : '비추천';

  return { game, resolution, grade, fpsMin, fpsMax, isEstimated };
}

export function buildCompatibility(parts: QuotePart[]) {
  const cpu = parts.find((part) => part.category === 'CPU');
  const board = parts.find((part) => part.category === '메인보드');
  const ram = parts.find((part) => part.category === 'RAM');
  const gpu = parts.find((part) => part.category === '그래픽카드');
  const power = parts.find((part) => part.category === '파워');
  const pcCase = parts.find((part) => part.category === '케이스');
  const cooler = parts.find((part) => part.category === '쿨러');
  const cpuAttrs = cpu ? getQuotePartAttributes(cpu) : undefined;
  const boardAttrs = board ? getQuotePartAttributes(board) : undefined;
  const ramAttrs = ram ? getQuotePartAttributes(ram) : undefined;
  const gpuAttrs = gpu ? getQuotePartAttributes(gpu) : undefined;
  const caseAttrs = pcCase ? getQuotePartAttributes(pcCase) : undefined;
  const coolerAttrs = cooler ? getQuotePartAttributes(cooler) : undefined;
  const messages: string[] = [];

  if (cpuAttrs?.sockets[0] && boardAttrs?.sockets[0]) {
    messages.push(
      cpuAttrs.sockets[0] === boardAttrs.sockets[0]
        ? `통과: CPU ${cpuAttrs.sockets[0]} 소켓과 메인보드 소켓 일치`
        : `실패: CPU ${cpuAttrs.sockets[0]}와 메인보드 ${boardAttrs.sockets[0]} 소켓 불일치`,
    );
  }

  if (boardAttrs?.memoryTypes[0] && ramAttrs?.memoryTypes[0]) {
    messages.push(
      boardAttrs.memoryTypes[0] === ramAttrs.memoryTypes[0]
        ? `통과: 메인보드와 RAM 모두 ${boardAttrs.memoryTypes[0]} 규격`
        : `실패: 메인보드는 ${boardAttrs.memoryTypes[0]}, RAM은 ${ramAttrs.memoryTypes[0]} 규격`,
    );
  }

  if (gpuAttrs?.gpuLengthMm && caseAttrs?.maxGpuLengthMm) {
    messages.push(
      gpuAttrs.gpuLengthMm <= caseAttrs.maxGpuLengthMm
        ? `통과: 그래픽카드 ${gpuAttrs.gpuLengthMm}mm / 케이스 허용 ${caseAttrs.maxGpuLengthMm}mm`
        : `실패: 그래픽카드 ${gpuAttrs.gpuLengthMm}mm가 케이스 허용 ${caseAttrs.maxGpuLengthMm}mm를 초과`,
    );
  } else if (gpu && pcCase) {
    messages.push('확인필요: 그래픽카드 길이 또는 케이스 VGA 허용 길이 정보가 부족합니다.');
  }

  if (coolerAttrs?.coolerHeightMm && caseAttrs?.maxCoolerHeightMm) {
    messages.push(
      coolerAttrs.coolerHeightMm <= caseAttrs.maxCoolerHeightMm
        ? `통과: CPU 쿨러 ${coolerAttrs.coolerHeightMm}mm / 케이스 허용 ${caseAttrs.maxCoolerHeightMm}mm`
        : `실패: CPU 쿨러 ${coolerAttrs.coolerHeightMm}mm가 케이스 허용 ${caseAttrs.maxCoolerHeightMm}mm를 초과`,
    );
  } else if (cooler && pcCase) {
    messages.push('확인필요: CPU 쿨러 높이 또는 케이스 쿨러 허용 높이 정보가 부족합니다.');
  }

  if (boardAttrs?.formFactors[0] && caseAttrs?.formFactors.length) {
    messages.push(
      caseAttrs.formFactors.includes(boardAttrs.formFactors[0])
        ? `통과: 케이스가 ${boardAttrs.formFactors[0]} 메인보드 규격 지원`
        : `실패: 케이스 지원 규격에 ${boardAttrs.formFactors[0]}가 없습니다.`,
    );
  }

  if (power) {
    messages.push(`${power.name} 기준 파워 용량은 주문 전 최종 확인`);
  }

  messages.push('주문 직전 가격은 선택 판매 단위 기준으로 다시 확인');
  return messages;
}
