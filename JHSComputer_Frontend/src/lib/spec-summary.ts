import { getPartAttributes } from './part-filters';
import type { CatalogPart } from './v1-types';

export type SpecSummarySection = {
  title: string;
  rows: Array<{ label: string; value: string; help?: string }>;
};

export function buildSpecSummary(part: CatalogPart): SpecSummarySection[] {
  const attrs = getPartAttributes(part);
  const text = `${part.name} ${part.spec}`;
  const commonRows = compactRows([
    { label: '제조사', value: attrs.manufacturer },
    { label: '상품번호', value: part.productNo },
    { label: '가격', value: part.price ? `${part.price.toLocaleString()}원` : '-' },
  ]);

  if (part.category === 'CPU') {
    return [
      { title: '기본 정보', rows: commonRows },
      {
        title: '호환성 핵심',
        rows: compactRows([
          { label: 'CPU 소켓', value: attrs.sockets[0], help: '메인보드 소켓과 반드시 같아야 합니다.' },
          { label: '메모리 세대', value: attrs.memoryTypes[0] ?? memoryFromSocket(attrs.sockets[0]), help: '메인보드/RAM 선택 기준입니다.' },
          { label: '내장 그래픽', value: has(text, ['내장그래픽 유', '내장그래픽:탑재', '내장그래픽 탑재']) ? '탑재' : has(text, ['내장그래픽 무', '내장그래픽 미탑재']) ? '미탑재' : undefined },
        ]),
      },
      {
        title: '성능/발열',
        rows: compactRows([
          { label: '코어/스레드', value: pair(text, /(\d+)\s*코어/i, /(\d+)\s*스레드/i, '코어', '스레드') },
          { label: '클럭', value: range(text, /(\d+(?:\.\d+)?)\s*~\s*(\d+(?:\.\d+)?)\s*GHz/i) ?? match(text, /(\d+(?:\.\d+)?)\s*GHz/i, 'GHz') },
          { label: 'TDP', value: match(text, /TDP\s*:?\s*(\d{2,4})\s*w/i, 'W'), help: '쿨러/케이스 발열 여유 판단 기준입니다.' },
          { label: '캐시', value: pair(text, /L2\s*:?\s*(\d+)\s*MB/i, /L3\s*:?\s*(\d+)\s*MB/i, 'L2', 'L3') },
        ]),
      },
    ];
  }

  if (part.category === '메인보드') {
    return [
      { title: '기본 정보', rows: commonRows },
      {
        title: '호환성 핵심',
        rows: compactRows([
          { label: 'CPU 소켓', value: attrs.sockets[0], help: 'CPU 소켓과 반드시 같아야 합니다.' },
          { label: '메모리 규격', value: attrs.memoryTypes[0], help: 'RAM 선택 기준입니다.' },
          { label: '보드 규격', value: attrs.formFactors[0], help: '케이스 지원 규격과 맞아야 합니다.' },
          { label: 'M.2 슬롯', value: match(text, /M\.?2[^\d]{0,8}(\d+)/i, '개') },
        ]),
      },
    ];
  }

  if (part.category === 'RAM') {
    return [
      { title: '기본 정보', rows: commonRows },
      {
        title: '메모리 핵심',
        rows: compactRows([
          { label: '규격', value: attrs.memoryTypes[0], help: '메인보드 메모리 규격과 같아야 합니다.' },
          { label: '용량', value: match(text, /(\d+)\s*GB/i, 'GB') },
          { label: '클럭', value: match(text, /(\d{4,5})\s*MHz/i, 'MHz') ?? match(text, /PC\d-\s*(\d{4,5})/i, 'MHz') },
          { label: '구성', value: match(text, /(\d+)\s*개/i, '개') },
        ]),
      },
    ];
  }

  if (part.category === '그래픽카드') {
    return [
      { title: '기본 정보', rows: commonRows },
      {
        title: '장착/전원 핵심',
        rows: compactRows([
          { label: 'GPU 길이', value: attrs.gpuLengthMm ? `${attrs.gpuLengthMm}mm` : undefined, help: '케이스 VGA 허용 길이보다 짧아야 합니다.' },
          { label: '권장 파워', value: match(text, /권장\s*파워[^\d]*(\d{3,4})\s*W/i, 'W') },
          { label: '메모리', value: pair(text, /(GDDR\d|DDR\d)/i, /(\d+)\s*GB/i, '', 'GB') },
          { label: '출력', value: includes(text, ['HDMI', 'DP', 'DisplayPort']) },
        ]),
      },
    ];
  }

  if (part.category === 'SSD') {
    return [
      { title: '기본 정보', rows: commonRows },
      {
        title: '저장장치 핵심',
        rows: compactRows([
          { label: '용량', value: match(text, /(\d+)\s*TB/i, 'TB') ?? match(text, /(\d+)\s*GB/i, 'GB') },
          { label: '규격', value: includes(text, ['M.2', 'NVMe', 'SATA']) },
          { label: '읽기 속도', value: match(text, /읽기[^\d]*(\d{3,5})M/i, 'MB/s') },
          { label: '쓰기 속도', value: match(text, /쓰기[^\d]*(\d{3,5})M/i, 'MB/s') },
        ]),
      },
    ];
  }

  if (part.category === '파워') {
    return [
      { title: '기본 정보', rows: commonRows },
      {
        title: '전원 핵심',
        rows: compactRows([
          { label: '정격 출력', value: attrs.wattage ? `${attrs.wattage}W` : undefined, help: 'CPU/GPU 조합의 권장 파워보다 여유가 있어야 합니다.' },
          { label: '인증', value: includes(text, ['80PLUS', '브론즈', '실버', '골드', '플래티넘', '티타늄']) },
          { label: '규격', value: includes(text, ['ATX 3.1', 'ATX3.1', 'ATX 3.0', 'M-ATX', 'ATX']) },
          { label: '모듈러', value: includes(text, ['풀모듈러', '세미모듈러', '케이블 일체형']) },
        ]),
      },
    ];
  }

  if (part.category === '케이스') {
    return [
      { title: '기본 정보', rows: commonRows },
      {
        title: '장착 호환성',
        rows: compactRows([
          { label: '지원 보드', value: attrs.formFactors.join(', '), help: '메인보드 규격이 포함되어야 합니다.' },
          { label: 'GPU 허용 길이', value: attrs.maxGpuLengthMm ? `${attrs.maxGpuLengthMm}mm` : undefined },
          { label: 'CPU 쿨러 허용 높이', value: attrs.maxCoolerHeightMm ? `${attrs.maxCoolerHeightMm}mm` : undefined },
          { label: '쿨링팬', value: match(text, /총\s*(\d+)\s*개/i, '개') },
        ]),
      },
    ];
  }

  return [
    { title: '기본 정보', rows: commonRows },
    {
      title: '장착 호환성',
      rows: compactRows([
        { label: '지원 소켓', value: attrs.sockets.join(', '), help: 'CPU/메인보드 소켓과 맞아야 합니다.' },
        { label: '쿨러 높이', value: attrs.coolerHeightMm ? `${attrs.coolerHeightMm}mm` : undefined },
        { label: '팬 크기', value: match(text, /(\d{2,3})\s*mm/i, 'mm') },
      ]),
    },
  ];
}

function compactRows(rows: Array<{ label: string; value?: string; help?: string }>) {
  return rows.map((row) => ({ ...row, value: row.value || '-' }));
}

function has(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function match(text: string, regex: RegExp, unit = '') {
  const value = text.match(regex)?.[1];
  return value ? `${value}${unit}` : undefined;
}

function pair(text: string, left: RegExp, right: RegExp, leftUnit: string, rightUnit: string) {
  const a = text.match(left)?.[1];
  const b = text.match(right)?.[1];
  if (!a && !b) return undefined;
  return [a ? `${a}${leftUnit}` : undefined, b ? `${b}${rightUnit}` : undefined].filter(Boolean).join(' / ');
}

function range(text: string, regex: RegExp) {
  const value = text.match(regex);
  return value ? `${value[1]}~${value[2]}GHz` : undefined;
}

function includes(text: string, words: string[]) {
  return words.filter((word) => text.toUpperCase().includes(word.toUpperCase())).join(', ') || undefined;
}

function memoryFromSocket(socket?: string) {
  if (socket === 'AM5' || socket === 'LGA1851') return 'DDR5';
  if (socket === 'AM4' || socket === 'LGA1700') return 'DDR4/DDR5 확인 필요';
  return undefined;
}
