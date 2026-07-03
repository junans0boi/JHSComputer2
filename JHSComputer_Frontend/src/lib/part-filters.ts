import type { CatalogPart, ManualSelection, PartCategory } from './v1-types';

export type PartAttributes = {
  manufacturer: string;
  sockets: string[];
  memoryTypes: string[];
  wattage?: number;
  formFactors: string[];
  gpuLengthMm?: number;
  coolerHeightMm?: number;
  maxGpuLengthMm?: number;
  maxCoolerHeightMm?: number;
};

export type PartFilterState = {
  manufacturers: string[];
  sockets: string[];
  memoryTypes: string[];
  formFactors: string[];
  minPrice: string;
  maxPrice: string;
  minWatt: string;
  maxWatt: string;
  compatibleOnly: boolean;
};

export const emptyPartFilters: PartFilterState = {
  manufacturers: [],
  sockets: [],
  memoryTypes: [],
  formFactors: [],
  minPrice: '',
  maxPrice: '',
  minWatt: '',
  maxWatt: '',
  compatibleOnly: true,
};

const socketPatterns = ['AM5', 'AM4', 'LGA1851', 'LGA1700', 'LGA1200', 'LGA115X', '115X', '소켓1700', '소켓1851'];
const memoryPatterns = ['DDR5', 'DDR4'];
const formFactorPatterns = ['E-ATX', 'M-ATX', 'Micro-ATX', 'Mini-ITX', '미니ITX', 'ATX'];

export function getPartAttributes(part: CatalogPart): PartAttributes {
  const text = `${part.name} ${part.spec}`.toUpperCase();
  return {
    manufacturer: extractManufacturer(part.name),
    sockets: unique(socketPatterns.flatMap((pattern) => (text.includes(pattern) ? [normalizeSocket(pattern)] : []))),
    memoryTypes: unique(memoryPatterns.filter((pattern) => text.includes(pattern))),
    wattage: extractWattage(text, part.category),
    formFactors: unique(formFactorPatterns.flatMap((pattern) => (text.includes(pattern.toUpperCase()) ? [normalizeFormFactor(pattern)] : []))),
    gpuLengthMm: extractGpuLength(text, false),
    coolerHeightMm: extractCoolerHeight(text, false),
    maxGpuLengthMm: extractGpuLength(text, true),
    maxCoolerHeightMm: extractCoolerHeight(text, true),
  };
}

export function getQuotePartAttributes(part: { category: string; name: string; memo: string }) {
  return getPartAttributes({
    id: '',
    category: part.category as PartCategory,
    productNo: '',
    name: part.name,
    price: 0,
    imageUrl: '',
    detailUrl: '',
    spec: part.memo,
    reviewCount: 0,
    reviewRate: 0,
    badges: [],
  });
}

export function getFilterOptions(parts: CatalogPart[]) {
  const attrs = parts.map(getPartAttributes);
  return {
    manufacturers: unique(attrs.map((item) => item.manufacturer).filter(Boolean)).sort(),
    sockets: unique(attrs.flatMap((item) => item.sockets)).sort(),
    memoryTypes: unique(attrs.flatMap((item) => item.memoryTypes)).sort(),
    formFactors: unique(attrs.flatMap((item) => item.formFactors)).sort(),
    wattages: unique(attrs.flatMap((item) => (item.wattage ? [item.wattage] : []))).sort((a, b) => a - b),
  };
}

/**
 * Checks compatibility and returns a reason if incompatible.
 * Returns null if compatible.
 */
export function getIncompatibilityReason(part: CatalogPart, selection: ManualSelection): string | null {
  const selectedCpu = selection.CPU;
  const selectedMainboard = selection['메인보드'];
  const partAttrs = getPartAttributes(part);
  const cpuAttrs = selectedCpu ? getPartAttributes(selectedCpu) : undefined;
  const boardAttrs = selectedMainboard ? getPartAttributes(selectedMainboard) : undefined;
  const requiredSocket = cpuAttrs?.sockets[0];
  const requiredMemory = getRequiredMemoryType(selection);

  if (part.category === '메인보드' && requiredSocket && !partAttrs.sockets.includes(requiredSocket)) {
    return `CPU 소켓(${requiredSocket})과 호환되지 않는 메인보드입니다.`;
  }
  if (part.category === 'RAM' && requiredMemory && !partAttrs.memoryTypes.includes(requiredMemory)) {
    return `지원하지 않는 메모리 규격(${requiredMemory} 필요)입니다.`;
  }
  if (part.category === '쿨러' && requiredSocket && !partAttrs.sockets.includes(requiredSocket)) {
    return `CPU 소켓(${requiredSocket}) 쿨러 장착 브라켓을 지원하지 않습니다.`;
  }
  if (part.category === 'CPU' && boardAttrs?.sockets.length && !partAttrs.sockets.some((socket) => boardAttrs.sockets.includes(socket))) {
    return `선택한 메인보드 소켓(${boardAttrs.sockets[0]})과 맞지 않는 CPU입니다.`;
  }
  if (part.category === 'CPU' && boardAttrs?.memoryTypes.length) {
    const cpuMemory = memoryTypeFromSocket(partAttrs.sockets[0]);
    if (cpuMemory && !boardAttrs.memoryTypes.includes(cpuMemory)) {
      return `선택한 메인보드의 메모리 규격(${boardAttrs.memoryTypes[0]})과 CPU 지원 규격이 다릅니다.`;
    }
  }
  
  if (part.category === '케이스') {
    const selectedGpu = selection['그래픽카드'];
    const selectedCooler = selection['쿨러'];
    const selectedBoard = selection['메인보드'];
    
    if (selectedGpu) {
      const gpuLength = getPartAttributes(selectedGpu).gpuLengthMm;
      if (gpuLength && partAttrs.maxGpuLengthMm && gpuLength > partAttrs.maxGpuLengthMm) {
        return `그래픽카드 길이(${gpuLength}mm)가 케이스 최대 허용치(${partAttrs.maxGpuLengthMm}mm)보다 깁니다.`;
      }
    }
    if (selectedCooler) {
      const coolerHeight = getPartAttributes(selectedCooler).coolerHeightMm;
      if (coolerHeight && partAttrs.maxCoolerHeightMm && coolerHeight > partAttrs.maxCoolerHeightMm) {
        return `쿨러 높이(${coolerHeight}mm)가 케이스 최대 허용치(${partAttrs.maxCoolerHeightMm}mm)를 초과합니다.`;
      }
    }
    if (selectedBoard) {
      const boardForm = getPartAttributes(selectedBoard).formFactors[0];
      if (boardForm && partAttrs.formFactors.length && !partAttrs.formFactors.includes(boardForm)) {
        return `메인보드 규격(${boardForm})을 지원하지 않는 케이스입니다.`;
      }
    }
  }

  if (part.category === '그래픽카드' && selection['케이스']) {
    const maxGpuLength = getPartAttributes(selection['케이스']).maxGpuLengthMm;
    if (maxGpuLength && partAttrs.gpuLengthMm && partAttrs.gpuLengthMm > maxGpuLength) {
      return `케이스의 그래픽카드 최대 허용 길이(${maxGpuLength}mm)를 초과합니다.`;
    }
  }
  
  if (part.category === '쿨러' && selection['케이스']) {
    const maxCoolerHeight = getPartAttributes(selection['케이스']).maxCoolerHeightMm;
    if (maxCoolerHeight && partAttrs.coolerHeightMm && partAttrs.coolerHeightMm > maxCoolerHeight) {
      return `케이스의 쿨러 최대 허용 높이(${maxCoolerHeight}mm)를 초과합니다.`;
    }
  }

  // TDP Check against Power Supply (Basic estimation)
  // If we are looking at a Power Supply, check if it meets the minimum wattage for CPU + GPU + buffer
  if (part.category === '파워') {
    let estimatedSystemWattage = 150; // Base system wattage (MB, RAM, drives, fans)
    const selectedGpu = selection['그래픽카드'];
    if (selectedGpu) {
      const gpuTdp = getPartAttributes(selectedGpu).wattage || 300; // rough guess if not found
      estimatedSystemWattage += gpuTdp;
    } else {
       estimatedSystemWattage += 50; // igpu buffer
    }
    const selectedCpu = selection.CPU;
    if (selectedCpu) {
      const cpuTdp = getPartAttributes(selectedCpu).wattage || 100; // rough guess
      estimatedSystemWattage += cpuTdp;
    }
    
    // Add 100W buffer
    const recommendedWattage = estimatedSystemWattage + 100;
    
    if (partAttrs.wattage && partAttrs.wattage < recommendedWattage) {
       // We only return a reason if we are sure it's lower.
       // However, to not block users completely based on rough estimates, we could be lenient,
       // but since it's a guard, we should block clearly inadequate PSUs.
       // Let's only block if the PSU is significantly lower than estimated (e.g. less than GPU+CPU raw TDP).
       if (partAttrs.wattage < estimatedSystemWattage) {
         return `선택한 시스템의 예상 소비 전력(${estimatedSystemWattage}W 이상)보다 파워 용량이 부족합니다.`;
       }
    }
  }

  return null;
}

export function isCompatibleWithSelection(part: CatalogPart, selection: ManualSelection) {
  return getIncompatibilityReason(part, selection) === null;
}

export function filterParts(parts: CatalogPart[], filters: PartFilterState, selection: ManualSelection) {
  return parts.filter((part) => {
    const attrs = getPartAttributes(part);
    
    // 호환되는 부품만 보기 옵션이 켜져 있으면, 호환 안 되는 부품은 아예 숨김
    if (filters.compatibleOnly && !isCompatibleWithSelection(part, selection)) return false;
    
    if (filters.manufacturers.length && !filters.manufacturers.includes(attrs.manufacturer)) return false;
    if (filters.sockets.length && !attrs.sockets.some((socket) => filters.sockets.includes(socket))) return false;
    if (filters.memoryTypes.length && !attrs.memoryTypes.some((type) => filters.memoryTypes.includes(type))) return false;
    if (filters.formFactors.length && !attrs.formFactors.some((type) => filters.formFactors.includes(type))) return false;
    if (filters.minPrice && part.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && part.price > Number(filters.maxPrice)) return false;
    if (filters.minWatt && (!attrs.wattage || attrs.wattage < Number(filters.minWatt))) return false;
    if (filters.maxWatt && (!attrs.wattage || attrs.wattage > Number(filters.maxWatt))) return false;
    return true;
  });
}

export function getCompatibilityHint(category: PartCategory, selection: ManualSelection) {
  const selectedCpu = selection.CPU;
  const selectedBoard = selection['메인보드'];
  const cpuAttrs = selectedCpu ? getPartAttributes(selectedCpu) : undefined;
  const boardAttrs = selectedBoard ? getPartAttributes(selectedBoard) : undefined;
  const requiredMemory = getRequiredMemoryType(selection);
  const requiredSocket = cpuAttrs?.sockets[0] ?? boardAttrs?.sockets[0];

  if (category === '메인보드' && requiredSocket) return `${requiredSocket} 소켓 메인보드만 표시 중`;
  if (category === 'RAM' && requiredMemory) return `${requiredMemory} 메모리만 표시 중`;
  if (category === '쿨러' && requiredSocket) return `${requiredSocket} 지원 쿨러만 표시 중`;
  if (category === '케이스' && (selection['그래픽카드'] || selection['쿨러'])) return '선택한 그래픽카드 길이와 쿨러 높이가 들어가는 케이스만 표시 중';
  if (category === '그래픽카드' && selection['케이스']) return '선택한 케이스에 장착 가능한 그래픽카드만 표시 중';
  if (category === 'CPU' && selectedBoard) return '선택한 메인보드와 맞는 CPU만 표시 중';
  return '선택한 견적 부품과 호환되는 후보를 우선 표시합니다.';
}

export function getRequiredMemoryType(selection: ManualSelection) {
  const selectedBoard = selection['메인보드'];
  if (selectedBoard) {
    const boardMemory = getPartAttributes(selectedBoard).memoryTypes[0];
    if (boardMemory) return boardMemory;
  }

  const selectedCpu = selection.CPU;
  if (!selectedCpu) return undefined;
  const cpuSocket = getPartAttributes(selectedCpu).sockets[0];
  return memoryTypeFromSocket(cpuSocket);
}

function memoryTypeFromSocket(socket?: string) {
  if (socket === 'AM4') return 'DDR4';
  if (socket === 'AM5') return 'DDR5';
  return undefined;
}

function extractManufacturer(name: string) {
  const bracket = name.match(/^\[([^\]]+)\]/);
  if (bracket?.[1]) return bracket[1].trim();
  return name.split(' ')[0]?.replace(/\[|\]/g, '') ?? '기타';
}

function extractWattage(text: string, category: PartCategory) {
  const candidates = [...text.matchAll(/(\d{3,4})\s?W/g)].map((match) => Number(match[1]));
  if (!candidates.length) return undefined;
  if (category === '파워') return Math.max(...candidates.filter((value) => value >= 300));
  return candidates[0];
}

function extractGpuLength(text: string, maxOnly: boolean) {
  const patterns = maxOnly
    ? [/VGA(?:장착)?\s*(?:최대)?(?:길이)?[^\d]{0,12}(?:약\s*)?(\d{2,4})MM/g, /GPU\s*장착[^\d]{0,12}(\d{2,4})MM/g]
    : [/(?:길이|LENGTH)[^\d]{0,8}(\d{2,4})MM/g, /(\d{2,4})MM[^\n/]{0,20}(?:GPU|그래픽|VGA)/g];
  return extractMaxNumber(text, patterns);
}

function extractCoolerHeight(text: string, maxOnly: boolean) {
  const patterns = maxOnly
    ? [/CPU쿨러\s*(?:장착|최대길이|최대높이)?[^\d]{0,16}(?:약\s*)?(?:최대\s*)?(\d{2,4})MM/g]
    : [/(?:높이|쿨러높이)[^\d]{0,8}(?:약\s*)?(?:최대\s*)?(\d{2,4}(?:\.\d+)?)MM/g];
  return extractMaxNumber(text, patterns);
}

function extractMaxNumber(text: string, patterns: RegExp[]) {
  const values = patterns.flatMap((pattern) => [...text.matchAll(pattern)].map((match) => Number(match[1])));
  const validValues = values.filter((value) => Number.isFinite(value) && value > 0);
  return validValues.length ? Math.max(...validValues) : undefined;
}

function normalizeSocket(socket: string) {
  if (socket === '소켓1700') return 'LGA1700';
  if (socket === '소켓1851') return 'LGA1851';
  if (socket === '115X') return 'LGA115X';
  return socket;
}

function normalizeFormFactor(formFactor: string) {
  if (formFactor === 'Micro-ATX') return 'M-ATX';
  if (formFactor === '미니ITX') return 'Mini-ITX';
  return formFactor;
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}
