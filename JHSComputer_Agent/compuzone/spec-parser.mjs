const SOCKET_RE = /(?:LGA\s*|FCLGA\s*|PLGA\s*|소켓\s*)(1151(?:\s*-?\s*V2)?|1155|1200|1700|1800|1851|2066|3647|4094|4189|4677)(?!\d)/i;
const AMD_SOCKET_RE = /\b(AM[2345]\+?|sTR[45]|sWRX8|SP[35]|TRX40)\b/i;
const MEMORY_RE = /DDR\s*([3-5])\b/gi;
const GPU_MODEL_RE = /\b(RTX|GTX|RX)\s*(\d{3,4})(?:\s*(TI|SUPER|XT|GRE))?\b/i;
const GPU_MEMORY_RE = /\b(GDDR[3-7](?:X)?|HBM2E?|HBM3E?)\b/i;
const PCIE_RE = /(?:PCI\s*-?\s*E|PCI\s*Express)\s*(?:Gen(?:eration)?\s*)?(?:x|×)?\s*([345](?:\.\d+)?)/gi;

const CODE_NAME_RE = /랩터\s*레이크|알더\s*레이크|메테오\s*레이크|애로우\s*레이크|코멧\s*레이크|로켓\s*레이크|그래니트\s*릿지|그래니트릿지|라파엘|버미어|피닉스|스트릭스\s*포인트|마티스|세잔|렘브란트/i;

function textOf(value) {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map(textOf).filter(Boolean).join(' / ');
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, item]) => `${key}: ${textOf(item)}`)
      .filter((item) => item !== `${item.split(':')[0]}: `)
      .join(' / ');
  }
  return String(value).replace(/\s+/g, ' ').trim();
}

function detailSpecsText(value) {
  if (!value) return '';
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item == null) return '';
        if (typeof item !== 'object') return textOf(item);
        const key = item.key ?? item.label ?? item.name ?? '';
        const val = item.value ?? item.text ?? item.content ?? '';
        return `${textOf(key)}: ${textOf(val)}`.replace(/^: /, '');
      })
      .filter(Boolean)
      .join(' / ');
  }
  return textOf(value);
}

function numberValue(value) {
  const match = String(value ?? '').replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function cleanValue(value) {
  return String(value ?? '')
    .replace(/[\[\]{}()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanStructuredValue(value) {
  return String(value ?? '')
    .replace(/[\[\]{}]/g, '')
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeSocket(text = '') {
  const normalized = textOf(text);
  const socket = normalized.match(SOCKET_RE);
  if (socket) return `LGA${socket[1].replace(/\s+/g, '').replace(/-?V2$/i, '')}`;

  const amdSocket = normalized.match(AMD_SOCKET_RE);
  return amdSocket ? amdSocket[1].toUpperCase() : null;
}

export function memoryTypes(text = '') {
  return [...new Set([...textOf(text).matchAll(MEMORY_RE)].map((match) => `DDR${match[1]}`))];
}

export function memoryType(text = '') {
  return memoryTypes(text)[0] ?? null;
}

export function normalizeGpuChipset(value = '') {
  const match = textOf(value).match(GPU_MODEL_RE);
  if (!match) return null;
  return `${match[1].toUpperCase()} ${match[2]}${match[3] ? ` ${match[3].toUpperCase()}` : ''}`;
}

export function gpuChipsetName(summarySpecText = '', productName = '') {
  return normalizeGpuChipset(summarySpecText) ?? normalizeGpuChipset(productName);
}

export function gpuChipsetMaker(value = '') {
  const text = textOf(value);
  const model = normalizeGpuChipset(text);
  if (/^(?:RTX|GTX|GEFORCE|지포스)/i.test(model ?? '')) return 'NVIDIA';
  if (/^(?:RX|RADEON|라데온)/i.test(model ?? '')) return 'AMD';
  if (/^ARC/i.test(model ?? '')) return 'INTEL';
  if (/RTX|GTX|GEFORCE|지포스/i.test(text)) return 'NVIDIA';
  if (/RX|RADEON|라데온/i.test(text)) return 'AMD';
  if (/\bARC\b|인텔/i.test(text)) return 'INTEL';
  return null;
}

export function extractFirstNumber(text = '', patterns = []) {
  const source = textOf(text);
  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match) return numberValue(match[1] ?? match[0]);
  }
  return null;
}

export function extractFormFactors(text = '') {
  const upper = textOf(text).toUpperCase();
  const forms = [];
  if (/E\s*-\s*ATX/.test(upper)) forms.push('E-ATX');
  else if (/M\s*-\s*ATX|MICRO\s*-?\s*ATX|마이크로\s*ATX/.test(upper)) forms.push('M-ATX');
  else if (/\bATX\b/.test(upper)) forms.push('ATX');

  if (/M\s*-\s*ITX|MINI\s*-?\s*ITX|미니\s*ITX/.test(upper)) forms.push('M-ITX');
  else if (/(^|[^A-Z])ITX([^A-Z]|$)/.test(upper)) forms.push('ITX');
  return [...new Set(forms)];
}

export function extractColor(text = '') {
  const source = textOf(text);
  if (/화이트|WHITE/i.test(source)) return 'WHITE';
  if (/블랙|BLACK/i.test(source)) return 'BLACK';
  if (/그레이|GRAY|GREY/i.test(source)) return 'GRAY';
  return null;
}

function extractCapacityGb(text) {
  const source = textOf(text);
  const tb = [...source.matchAll(/(\d+(?:[.,]\d+)?)\s*TB\b/gi)].map((match) => numberValue(match[1]));
  if (tb.length > 0) return Math.round(Math.max(...tb) * 1024);

  const gb = [...source.matchAll(/(\d+(?:[.,]\d+)?)\s*GB\b/gi)].map((match) => numberValue(match[1]));
  return gb.length > 0 ? Math.max(...gb) : null;
}

function extractDimensions(text) {
  const source = textOf(text);
  const match = source.match(/(\d{2,4})\s*(?:mm\s*)?[x×*]\s*(\d{2,4})\s*(?:mm\s*)?[x×*]\s*(\d{1,4})\s*mm\b/i);
  if (!match) return { lengthMm: null, heightMm: null, thicknessMm: null };
  return {
    lengthMm: numberValue(match[1]),
    heightMm: numberValue(match[2]),
    thicknessMm: numberValue(match[3]),
  };
}

function extractFamily(text) {
  const source = textOf(text);
  const ultra = source.match(/(?:Core\s*Ultra|코어\s*울트라)\s*([3579])/i);
  if (ultra) return `Core Ultra ${ultra[1]}`;

  const intel = source.match(/(?:\bCore|코어)\s*i?\s*([3579])\b/i);
  if (intel) return `Core i${intel[1]}`;

  const ryzen = source.match(/(?:\bRyzen|라이젠)\s*(?:Threadripper|스레드리퍼\s*)?\s*([3579])/i);
  if (ryzen) return /Threadripper|스레드리퍼/i.test(ryzen[0]) ? `Ryzen Threadripper ${ryzen[1]}` : `Ryzen ${ryzen[1]}`;
  const server = source.match(/\b(EPYC|Xeon)\b|(?:에픽|제온)/i);
  if (server) return /EPYC|에픽/i.test(server[0]) ? 'EPYC' : 'Xeon';

  const legacy = source.match(/\b(Pentium|Celeron|Athlon)\b/i);
  if (legacy) return legacy[1][0].toUpperCase() + legacy[1].slice(1).toLowerCase();
  return null;
}

function extractGeneration(text) {
  const source = textOf(text);
  const explicit = source.match(/(\d{1,2})\s*세대/i);
  if (explicit) return `${explicit[1]}세대`;

  const english = source.match(/(\d{1,2})(?:st|nd|rd|th)\s*(?:Gen|Generation)\b/i);
  if (english) return `${english[1]}세대`;

  const intelModel = source.match(/(?:Core\s*)?i[3579]\s*-?\s*(\d{4,5})[A-Z]{0,3}\b/i);
  if (intelModel) {
    const model = String(numberValue(intelModel[1]));
    const generation = model.length === 5 ? model.slice(0, 2) : model.slice(0, 1);
    return `${generation}세대`;
  }

  const coreUltraModel = source.match(/(?:Core\s*Ultra|코어\s*울트라)\s*[3579]\s*(\d{3})\b/i);
  if (coreUltraModel) return `${Math.floor(numberValue(coreUltraModel[1]) / 100)}세대`;

  const amdModel = source.match(/(?:Ryzen|라이젠)\s*[3579]\s*(\d{4,5})/i);
  if (amdModel) return `${Math.floor(numberValue(amdModel[1]) / 1000) * 1000} 시리즈`;

  const amdModelWithCodename = source.match(/(?:Ryzen|라이젠)\s*[3579][^\d]{0,24}(\d{4,5})/i);
  if (amdModelWithCodename) return `${Math.floor(numberValue(amdModelWithCodename[1]) / 1000) * 1000} 시리즈`;

  const codenameSeries = source.match(/그래니트\s*릿지|그래니트릿지|라파엘|버미어|피닉스|스트릭스\s*포인트|마티스|세잔|렘브란트/i);
  const seriesByCodename = {
    그래니트릿지: '9000 시리즈',
    라파엘: '7000 시리즈',
    버미어: '5000 시리즈',
    피닉스: '7000 시리즈',
    스트릭스포인트: '8000 시리즈',
    마티스: '3000 시리즈',
    세잔: '5000 시리즈',
    렘브란트: '6000 시리즈',
  };
  if (codenameSeries) {
    const key = codenameSeries[0].replace(/\s+/g, '');
    return seriesByCodename[key] ?? null;
  }
  return null;
}

function extractCodename(text) {
  const source = textOf(text);
  const labelled = source.match(/(?:코드명|codename|code\s*name)\s*[:：]?\s*([^/|,()]+)/i);
  if (labelled) return cleanValue(labelled[1]);

  const known = source.match(CODE_NAME_RE);
  if (known) return cleanValue(known[0]);

  const afterGeneration = source.match(/\d+\s*세대\s*[\/·,-]\s*([^/|,()]+)/i);
  return afterGeneration ? cleanValue(afterGeneration[1]) : null;
}

function extractCount(text, unit, labelPatterns = []) {
  const source = textOf(text);
  const direct = source.match(new RegExp(`(\\d+)\\s*${unit}`, 'i'));
  if (direct) return numberValue(direct[1]);

  for (const pattern of labelPatterns) {
    const match = source.match(pattern);
    if (match) return numberValue(match[1]);
  }
  return null;
}

function extractClock(text, labels) {
  return extractFirstNumber(text, labels.map((label) => new RegExp(`${label}\\s*[:：]?\\s*(\\d+(?:\\.\\d+)?)\\s*GHz`, 'i')));
}

function extractCpuClocks(text) {
  const source = textOf(text);
  const rangeValues = [...source.matchAll(/(\d+(?:\.\d+)?)\s*(?:~|-|–)\s*(\d+(?:\.\d+)?)\s*GHz\b/gi)]
    .flatMap((match) => [numberValue(match[1]), numberValue(match[2])]);
  const values = [
    ...rangeValues,
    ...[...source.matchAll(/(\d+(?:\.\d+)?)\s*GHz\b/gi)].map((match) => numberValue(match[1])),
  ];
  const labelledBase = extractClock(source, [String.raw`기본(?:\s*동작)?(?:\s*클럭|\s*속도)?`, String.raw`(?<!최대\s)동작(?:\s*클럭|\s*속도)`, String.raw`베이스(?:\s*클럭)?`, String.raw`base(?:\s*clock)?`]);
  const labelledBoost = extractClock(source, [String.raw`부스트(?:\s*클럭)?`, String.raw`최대(?:\s*동작)?(?:\s*클럭|\s*속도)?`, String.raw`boost(?:\s*clock)?`, String.raw`turbo(?:\s*clock)?`]);
  return {
    base: labelledBase ?? values[0] ?? null,
    boost: labelledBoost ?? values[1] ?? null,
  };
}

function extractCache(text, level) {
  return extractFirstNumber(text, [
    new RegExp(`\\bL${level}\\s*(?:Cache|캐시)?\\s*[:：]?\\s*(\\d+(?:\\.\\d+)?)\\s*MB`, 'i'),
    new RegExp(`L${level}\\s*캐시[^\\d]{0,20}(\\d+(?:\\.\\d+)?)\\s*MB`, 'i'),
  ]);
}

function extractPcieVersions(text) {
  const source = textOf(text);
  return [...new Set([...source.matchAll(PCIE_RE)].map((match) => match[1].includes('.') ? match[1] : `${match[1]}.0`))];
}

function extractIntegratedGraphicsName(text) {
  const source = textOf(text);
  const known = source.match(/((?:Intel\s+)?UHD\s*\d{3,4}|Iris\s*(?:Xe|Plus)?(?:\s*Graphics)?|Xe\s*LPG|Radeon\s+Graphics|Vega\s*\d*|라데온\s*그래픽)/i);
  if (known) return cleanValue(known[1]);

  const labelled = source.match(/(?:내장\s*그래픽(?:카드)?|iGPU|integrated\s*graphics)\s*[:：]?\s*([^/|,()]+)/i);
  if (!labelled || /없음|미탑재|미지원|none|없다|^무$|^유$|^있음$|^탑재$/i.test(labelled[1].trim())) return null;
  return cleanValue(labelled[1]);
}

function extractIntegratedGraphics(text, name, graphicsName) {
  const source = textOf(text);
  if (/내장\s*그래픽[^/|,()]{0,12}(?:없음|미탑재|미지원|무)|integrated\s*graphics[^/|,()]{0,12}(?:none|not\s*supported)/i.test(source)) {
    return false;
  }
  if (/내장\s*그래픽[^/|,()]{0,12}(?:유|있음|탑재|지원)|integrated\s*graphics[^/|,()]{0,12}(?:yes|supported)/i.test(source)) {
    return true;
  }
  if (/(?:Core\s*)?i[3579]\s*-?\s*\d{4,5}(?:KF|F)\b/i.test(`${name} ${source}`)) return false;
  if (graphicsName || /내장\s*그래픽|iGPU|integrated\s*graphics|UHD\s*\d{3,4}|Iris\s*(?:Xe|Plus)?|Xe\s*LPG/i.test(`${name} ${source}`)) {
    return true;
  }
  return null;
}

function extractChipset(text) {
  const source = textOf(text);
  const labelled = source.match(/(?:칩셋|chipset)\s*[:：]?\s*(?:AMD|Intel|인텔)?\s*([A-Z]{1,5}\d{3,4}[A-Z]?)/i);
  if (labelled) return labelled[1].toUpperCase().replace(/^([ABH]\d{3})M$/, '$1');

  const known = source.match(/\b((?:TRX|WRX|X|B|A|Z|H|Q|W)\d{3,4}[A-Z]?)\b/i);
  if (!known) return null;
  return known[1].toUpperCase().replace(/^(B\d{3})M$/, '$1');
}

function extractMemorySlotCount(text) {
  return extractFirstNumber(text, [
    /(?:메모리|DIMM)\s*(?:슬롯|뱅크|slot)\s*(?:수|개수)?\s*[:：]?\s*(\d+)\s*(?:개|슬롯)?/i,
    /DDR\s*[3-5]\s*(\d+)\s*개/i,
    /(?:슬롯|뱅크)\s*(?:수|개수)?\s*[:：]?\s*(\d+)\s*개/i,
  ]);
}

function extractMaxMemoryGb(text) {
  return extractFirstNumber(text, [
    /최대\s*(?:메모리|Memory)?\s*[:：]?\s*(\d+)\s*GB/i,
    /메모리\s*(?:최대|max)\s*[:：]?\s*(\d+)\s*GB/i,
  ]);
}

function extractSlotCount(text, label) {
  return extractFirstNumber(text, [
    new RegExp(`${label}\\s*(?:슬롯|포트|연결|개수|수)?\\s*[:：]?\\s*(\\d+)\\s*개`, 'i'),
    new RegExp(`${label}\\s*(\\d+)\\s*개`, 'i'),
    new RegExp(`${label}[^\\d]{0,20}(\\d+)\\s*개`, 'i'),
  ]);
}

function extractPcieX16SlotCount(text) {
  return extractFirstNumber(text, [
    /(?:PCIe|PCI\s*Express)\s*(?:[345](?:\.\d+)?\s*)?x16\s*(?:슬롯|slot)?\s*[:：]?\s*(\d+)\s*개/i,
    /x16\s*(?:슬롯|slot)\s*[:：]?\s*(\d+)\s*개/i,
  ]);
}

function extractWifiBuiltin(text) {
  const source = textOf(text);
  if (/Wi\s*-?\s*Fi|802\.11|무선\s*랜/i.test(source)) {
    return !/(?:Wi\s*-?\s*Fi|무선\s*랜)[^/|,()]{0,15}(?:없음|미지원|미탑재|none|no)/i.test(source);
  }
  return null;
}

function extractGpuInterface(text) {
  const source = textOf(text);
  const match = source.match(/(?:PCI\s*-?\s*E|PCI\s*Express)\s*(?:Gen(?:eration)?\s*)?([345](?:\.\d+)?)\s*(?:x|×)\s*(\d+)/i);
  if (match) return `PCIe ${match[1].includes('.') ? match[1] : `${match[1]}.0`} x${match[2]}`;

  const simple = source.match(/(?:PCI\s*-?\s*E|PCI\s*Express)\s*(?:Gen(?:eration)?\s*)?([345](?:\.\d+)?)/i);
  return simple ? `PCIe ${simple[1].includes('.') ? simple[1] : `${simple[1]}.0`}` : null;
}

function extractGpuSeries(chipsetName) {
  const match = textOf(chipsetName).match(/\b(RTX|GTX|RX)\s*(\d{3,4})/i);
  if (!match) return null;
  const digits = match[2];
  const series = match[1].toUpperCase() === 'RX' ? `${digits[0]}000` : digits.slice(0, 2);
  return `${match[1].toUpperCase()} ${series}`;
}

function extractGpuPowerPorts(text) {
  const source = textOf(text);
  const matches = source.match(/(?:12V\s*-?\s*2x6|12VHPWR|PCI\s*-?\s*E\s*(?:6\s*\+\s*2|8|16)\s*(?:핀|pin)(?:\s*\((?:12V\s*-?\s*2x6|12VHPWR)\))?|(?:보조)?전원\s*(?:포트|커넥터)?\s*[:：]?\s*(?:6\s*\+\s*2|8|16)\s*(?:핀|pin)(?:\s*\((?:12V\s*-?\s*2x6|12VHPWR)\))?)(?!\d)(?:\s*\([^)]*\))?(?:\s*(?:x|×)\s*\d+|\s*\d+\s*(?:개|ea))?/gi) ?? [];
  const ports = filterConnectorArtifacts(matches.map((match) => cleanStructuredValue(match)));
  if (ports.length > 0 || !/(?:RTX|GTX|RX)\s*\d{3,4}/i.test(source)) return ports;

  const generic = [...source.matchAll(/(?:^|[\/|,])\s*(?:6\s*\+\s*2|8|16)\s*(?:핀|pin)\s*(?:\([^)]+\))?(?:\s*(?:x|×)?\s*\d+\s*(?:개|ea)?)?\s*(?=$|[\/|,])/gi)]
    .map((match) => cleanStructuredValue(match[0].replace(/^[\/|,]\s*/, '')));
  return filterConnectorArtifacts(generic);
}

function extractDisplayOutputs(text) {
  const source = textOf(text);
  const outputs = [];
  const pattern = /\b(HDMI|DP|DisplayPort|DVI|USB\s*-?\s*C)\s*(\d+(?:\.\d+)?)?/gi;
  for (const match of source.matchAll(pattern)) {
    const name = match[1].replace(/\s+/g, '-').toUpperCase().replace('DISPLAYPORT', 'DP');
    outputs.push(`${name}${match[2] ? ` ${match[2]}` : ''}`);
  }
  const unique = [...new Set(outputs)];
  return unique.filter((output) => {
    if (/\s\d+(?:\.\d+)?$/.test(output)) return true;
    const family = output.split(' ')[0];
    return !unique.some((candidate) => candidate !== output && candidate.startsWith(`${family} `));
  });
}

function extractCertification(text) {
  const source = textOf(text);
  const standard = source.match(/80\s*PLUS\s*(TITANIUM|PLATINUM|GOLD|SILVER|BRONZE)/i);
  if (standard) return `80PLUS ${standard[1].toUpperCase()}`;
  const englishKorean = source.match(/80\s*PLUS\s*(티타늄|플래티넘|플레티넘|골드|실버|브론즈)/i);
  const map = { 티타늄: 'TITANIUM', 플래티넘: 'PLATINUM', 플레티넘: 'PLATINUM', 골드: 'GOLD', 실버: 'SILVER', 브론즈: 'BRONZE' };
  if (englishKorean) return `80PLUS ${map[englishKorean[1]]}`;
  const korean = source.match(/(?:80\s*플러스|에너지\s*효율)\s*(티타늄|플래티넘|골드|실버|브론즈)/i);
  return korean ? `80PLUS ${map[korean[1]]}` : null;
}

function extractModularType(text) {
  const source = textOf(text);
  if (/풀\s*모듈러|full\s*modular/i.test(source)) return 'FULL';
  if (/반\s*모듈러|semi\s*modular/i.test(source)) return 'SEMI';
  if (/비\s*모듈러|케이블\s*일체형|non\s*-?\s*modular/i.test(source)) return 'NON';
  if (/모듈러|modular/i.test(source)) return 'MODULAR';
  return null;
}

function extractPcie5Ready(text) {
  const source = textOf(text);
  if (/(?:PCI\s*-?\s*E|PCI\s*Express)\s*5(?:\.\d+)?|PCIe5|ATX\s*3\.[01]|12V\s*-?\s*2x6|12VHPWR/i.test(source)) return true;
  if (/(?:PCI\s*-?\s*E|PCI\s*Express)\s*4(?:\.\d+)?|ATX\s*2\.[0-4]/i.test(source)) return false;
  return null;
}

function extractConnectors(text) {
  const source = textOf(text);
  const matches = source.match(/(?:메인\s*전원\s*[:：]?\s*24\s*핀|보조전원\s*[:：]?\s*\d+(?:\s*\+\s*\d+){1,3}\s*핀|PCI\s*-?\s*E\s*(?:6\s*\+\s*2|8|16)\s*핀|CPU\s*(?:8|4\s*\+\s*4)\s*핀|EPS\s*(?:8|4\s*\+\s*4)\s*핀|12V\s*-?\s*2x6|12VHPWR|SATA\s*(?:전원)?|Molex)(?!\d)(?:\s*\([^)]*\))?(?:\s*(?:x|×)\s*\d+|\s*\d+\s*(?:개|ea))?/gi);
  return filterConnectorArtifacts((matches ?? []).map((match) => cleanStructuredValue(match)));
}

function filterConnectorArtifacts(values) {
  return [...new Set(values.filter((value) => !/\b(?:24|8|16)\s*(?:핀|pin)\s+\d{2,3}$/i.test(value)))];
}

function extractFanCount(text) {
  const source = textOf(text);
  const totalPatterns = [
    /(?:기본(?:\s*제공)?|제공|장착)\s*팬(?:\s*(?:수|개수))?\s*[:：]?\s*(?:총\s*)?(\d+)\s*(?:개|ea)(?!\s*(?:이하|이상|초과|미만))/i,
    /팬\s*(?:수|개수|갯수)\s*[:：]?\s*(?:총\s*)?(\d+)\s*(?:개|ea)?(?!\s*(?:이하|이상|초과|미만))/i,
    /(?:쿨링\s*)?팬\s*[:：]?\s*(?:총\s*)?(\d+)\s*(?:개|ea)(?!\s*(?:이하|이상|초과|미만))/i,
    /팬\s*\([^)]*\)\s*[:：]?\s*(?:총\s*)?(\d+)\s*(?:개|ea)(?!\s*(?:이하|이상|초과|미만))/i,
  ];
  for (const pattern of totalPatterns) {
    const match = source.match(pattern);
    if (match) return numberValue(match[1]);
  }

  const locations = [...source.matchAll(/(?:전면|후면|상단|하단|측면|전방|후방)\s*(\d+)\s*(?:개|ea)(?!\s*(?:이하|이상|초과|미만))/gi)].map((match) => numberValue(match[1]));
  return locations.length > 0 ? locations.reduce((sum, count) => sum + count, 0) : null;
}

function extractFanSize(text) {
  return extractFirstNumber(text, [
    /(?:쿨링\s*)?팬\s*(?:크기|사이즈)?\s*[:：]?\s*(\d{2,4})\s*mm/i,
    /(?:쿨링\s*)?팬[^/|]{0,30}?(\d{2,4})\s*mm/i,
    /(?:CPU\s*)?쿨러\s*[/／]\s*(\d{2,4})\s*mm/i,
    /(?:CPU\s*)?쿨러[^/|,()]{0,20}?(\d{2,4})\s*mm/i,
    /\b(?:fan|radiator)\s*(?:size)?\s*[:：]?\s*(\d{2,4})\s*mm/i,
  ]);
}

function extractProfileType(text) {
  const match = textOf(text).match(/\b(XMP|EXPO)\b/i);
  return match ? match[1].toUpperCase() : null;
}

function extractSpeedMhz(text) {
  const source = textOf(text);
  const direct = extractFirstNumber(source, [
    /DDR\s*[3-5]\s*[- ]\s*(\d{3,6})\b/i,
    /(?:메모리\s*)?(\d{3,6})\s*MHz/i,
    /(?:동작\s*)?(?:속도|클럭|주파수)\s*[:：]?\s*(\d{3,6})\b/i,
  ]);
  if (direct != null) return direct;
  const pc = source.match(/PC\s*[3-5]\s*-\s*(\d{4,6})\b/i);
  return pc ? Math.round(numberValue(pc[1]) / 8) : null;
}

function extractSequentialSpeed(text, kind) {
  const source = textOf(text);
  const labels = kind === 'read' ? String.raw`(?:(?:순차|연속)\s*)?(?:읽기|read)` : String.raw`(?:(?:순차|연속)\s*)?(?:쓰기|write)`;
  return extractFirstNumber(source, [
    new RegExp(`${labels}[^\\d]{0,20}(\\d[\\d,]*)\\s*MB\\s*/?s`, 'i'),
    new RegExp(`${labels}[^\\d]{0,20}(\\d[\\d,]*)`, 'i'),
  ]);
}

function extractStorageInterface(text) {
  const source = textOf(text);
  const pcie = source.match(/(?:PCI\s*-?\s*E|PCI\s*Express)\s*(?:Gen(?:eration)?\s*)?([345](?:\.\d+)?)\s*(?:x|×)\s*(\d+)/i);
  if (pcie) return `PCIe ${pcie[1].includes('.') ? pcie[1] : `${pcie[1]}.0`} x${pcie[2]}`;
  if (/SATA/i.test(source)) return 'SATA';
  if (/NVMe/i.test(source)) return 'NVMe';
  return null;
}

function extractRatedWattage(text) {
  return extractFirstNumber(text, [
    /(?:정격\s*(?:출력|파워)|정격\s*출력|출력)\s*[:：]?\s*(\d{3,4})\s*W/i,
    /(\d{3,4})\s*W/i,
  ]);
}

function extractGpuRecommendedPsu(text) {
  const labelled = extractFirstNumber(text, [
    /(?:권장\s*(?:파워|전원|PSU)|정격\s*파워)\s*[:：]?\s*(\d{3,4})\s*W/i,
    /(?:recommended\s*PSU|recommended\s*power)\s*[:：]?\s*(\d{3,4})\s*W/i,
  ]);
  if (labelled != null) return labelled;
  if (!/(?:RTX|GTX|RX)\s*\d{3,4}/i.test(text)) return null;
  return extractFirstNumber(text, [/(?:^|[\/|,])\s*(\d{3,4})\s*W\s*(?=$|[\/|,])/i]);
}

function extractPowerConsumption(text) {
  return extractFirstNumber(text, [
    /(?:소비\s*전력|사용\s*전력|전력\s*소모|TGP|TBP|보드\s*전력)\s*[:：]?\s*(\d{2,4})\s*W/i,
    /(?:power\s*consumption|board\s*power)\s*[:：]?\s*(\d{2,4})\s*W/i,
  ]);
}

function extractProcessorPower(text, label) {
  const labels = label === 'tdp'
    ? '(?:TDP|열설계전력|설계전력)'
    : label === 'pbp'
      ? '(?:PBP|Processor\s*Base\s*Power|기본\s*전력)'
      : '(?:MTP|Max\s*Turbo\s*Power|최대\s*터보\s*전력)';
  const withUnit = extractFirstNumber(text, [new RegExp(`${labels}\\s*[:：]?\\s*(\\d{2,4})\\s*W`, 'i')]);
  if (withUnit != null) return withUnit;
  const reverseWithUnit = extractFirstNumber(text, [new RegExp(`(\\d{2,4})\\s*W\\s*${labels}`, 'i')]);
  if (reverseWithUnit != null) return reverseWithUnit;
  const labelled = extractFirstNumber(text, [new RegExp(`${labels}\\s*[:：]?\\s*(\\d{2,4})(?!\\s*(?:W|MB))`, 'i')]);
  if (labelled != null) return labelled;
  return extractFirstNumber(text, [new RegExp(`(\\d{2,4})\\s*${labels}`, 'i')]);
}

function extractModuleCount(text) {
  const source = textOf(text);
  if (!/(?:DDR\s*[3-5]|DIMM|메모리)/i.test(source)) return null;

  const explicit = extractFirstNumber(source, [
    /(?:메모리\s*)?(?:구성|키트|kit)\s*[:：]?\s*\d+\s*GB?\s*[x×*]\s*(\d+)/i,
    /\d+(?:\.\d+)?\s*GB\s*[x×*]\s*(\d+)/i,
    /(?:모듈|module)\s*(?:수|개수)?\s*[:：]?\s*(\d+)/i,
  ]);
  if (explicit != null) return explicit;

  const standalone = [...source.matchAll(/(?:^|[\/|,])\s*(\d+)\s*(?:개|ea)\s*(?=$|[\/|,])/gi)];
  return standalone.length === 1 ? numberValue(standalone[0][1]) : null;
}

export function parseSpecAttributes({
  name = '',
  summarySpecText = '',
  detailSpecText = '',
  detailSpecs = null,
} = {}) {
  const source = [name, summarySpecText, detailSpecText, detailSpecsText(detailSpecs)].map(textOf).filter(Boolean).join(' ');
  const dimensions = extractDimensions(source);
  const chipsetName = gpuChipsetName(summarySpecText, name);
  const integratedGraphicsName = extractIntegratedGraphicsName(source);
  const gpuMemoryType = source.match(GPU_MEMORY_RE)?.[1]?.toUpperCase() ?? null;
  const gpuInterfaceText = extractGpuInterface(source);
  const capacityGb = extractCapacityGb(source);
  const pcieVersions = extractPcieVersions(source);
  const cpuClocks = extractCpuClocks(source);

  const gpuLengthMm = extractFirstNumber(source, [
    /(?:가로\s*(?:길이|\(길이\))|VGA\s*(?:장착\s*)?(?:최대\s*)?길이|GPU\s*(?:장착\s*)?길이|length)\s*[:：]?[^\d]{0,30}(\d{2,4})\s*mm/i,
  ]) ?? dimensions.lengthMm;
  const coolerHeightMm = extractFirstNumber(source, [
    /CPU\s*쿨러\s*(?:장착\s*)?(?:최대\s*)?(?:높이|길이)\s*[:：]?[^\d]{0,30}(\d{2,4})\s*mm/i,
    /(?:쿨러\s*높이|높이|height)\s*[:：]?[^\d]{0,12}(\d{2,4})\s*mm/i,
  ]);
  const gpuHeightMm = extractFirstNumber(source, [
    /(?:GPU|그래픽카드)?\s*(?:높이|height)\s*[:：]?[^\d]{0,12}(\d{2,4})\s*mm/i,
  ]) ?? dimensions.heightMm;
  const gpuThicknessMm = extractFirstNumber(source, [
    /(?:GPU|그래픽카드)?\s*(?:두께|thickness)\s*[:：]?[^\d]{0,12}(\d{1,4})\s*mm/i,
  ]) ?? dimensions.thicknessMm;
  const storageInterface = extractStorageInterface(source);

  return {
    socket: normalizeSocket(source),
    memoryTypes: memoryTypes(source),
    memoryType: memoryType(source) ?? gpuMemoryType,
    capacityGb,
    interfaceText: storageInterface ?? gpuInterfaceText,
    wattage: extractRatedWattage(source),
    gpuLengthMm,
    coolerHeightMm,
    forms: extractFormFactors(source),
    color: extractColor(source),
    gpuChipsetName: chipsetName,
    gpuChipsetMaker: gpuChipsetMaker(`${name} ${summarySpecText}`),

    family: extractFamily(source),
    generation: extractGeneration(source),
    codename: extractCodename(source),
    coreCount: extractCount(source, '코어', [/코어\s*(?:수|개수)\s*[:：]?\s*(\d+)/i, /cores?\s*[:：]?\s*(\d+)/i]),
    threadCount: extractCount(source, '(?:스레드|쓰레드)', [/(?:스레드|쓰레드)\s*(?:수|개수)\s*[:：]?\s*(\d+)/i, /threads?\s*[:：]?\s*(\d+)/i]),
    baseClockGhz: cpuClocks.base,
    boostClockGhz: cpuClocks.boost,
    l2CacheMb: extractCache(source, 2),
    l3CacheMb: extractCache(source, 3),
    tdpW: extractProcessorPower(source, 'tdp'),
    pbpW: extractProcessorPower(source, 'pbp'),
    mtpW: extractProcessorPower(source, 'mtp'),
    pcieVersions,
    hasIntegratedGraphics: extractIntegratedGraphics(source, name, integratedGraphicsName),
    integratedGraphicsName,

    seriesName: extractGpuSeries(chipsetName),
    gpuMemoryType,
    gpuInterfaceText,
    recommendedPsuW: extractGpuRecommendedPsu(source),
    powerConsumptionW: extractPowerConsumption(source),
    powerPorts: extractGpuPowerPorts(source),
    lengthMm: gpuLengthMm,
    heightMm: gpuHeightMm,
    thicknessMm: gpuThicknessMm,
    gpuHeightMm,
    gpuThicknessMm,
    displayOutputs: extractDisplayOutputs(source),

    chipset: extractChipset(source),
    memorySlotCount: extractMemorySlotCount(source),
    maxMemoryGb: extractMaxMemoryGb(source),
    m2SlotCount: extractSlotCount(source, 'M\\.?\\s*2'),
    sataPortCount: extractSlotCount(source, 'SATA(?:\\s*3)?'),
    pcieX16SlotCount: extractPcieX16SlotCount(source),
    wifiBuiltin: extractWifiBuiltin(source),

    certification: extractCertification(source),
    modularType: extractModularType(source),
    pcie5Ready: extractPcie5Ready(source),
    connectors: extractConnectors(source),

    moduleCount: extractModuleCount(source),
    speedMhz: extractSpeedMhz(source),
    profileType: extractProfileType(source),

    fanCount: extractFanCount(source),
    fanSizeMm: extractFanSize(source),
    seqReadMbps: extractSequentialSpeed(source, 'read'),
    seqWriteMbps: extractSequentialSpeed(source, 'write'),
  };
}
