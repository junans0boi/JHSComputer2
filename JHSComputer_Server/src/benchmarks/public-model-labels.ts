const CPU_FALLBACK = 'CPU';
const GPU_FALLBACK = 'GPU';

export function formatPublicCpuModel(model?: unknown, name?: unknown) {
  const text = joinModelText(name, model);
  const coreUltra = text.match(/(?:core\s*ultra|코어\s*울트라|울트라)\s*([3579])\s*(?:(?:series|시리즈)\s*\d+\s*)?(?:processor|프로세서)?\s*[- ]?\s*(\d{3,5}[a-z]*)/i);
  if (coreUltra) return `Core Ultra ${coreUltra[1]} ${capitalizeModelSuffix(coreUltra[2])}`;

  const intel = text.match(/\b(i[3579])\s*[- ]?\s*(\d{4,5}[a-z]*)\b/i);
  if (intel) return `${intel[1].toLowerCase()}-${capitalizeModelSuffix(intel[2])}`;

  const ryzen = text.match(/(?:ryzen|라이젠)\s*([3579])?\s*(?:[- ]?\s*\d+세대)?\s*[- ]?\s*(\d{4,5})\s*(x3d|xt|gre|f|kf|k|g|gt|x)?\b/i);
  if (ryzen) {
    const series = ryzen[1] ?? findRyzenSeries(text) ?? inferRyzenSeries(ryzen[2]);
    const suffix = ryzen[3] ? ryzen[3].toUpperCase() : '';
    return `Ryzen${series ?? ''} ${ryzen[2]}${suffix}`.trim();
  }

  return readableFallback(name ?? model, CPU_FALLBACK);
}

export function formatPublicGpuModel(model?: unknown, name?: unknown) {
  const text = joinModelText(name, model);
  const gpu = text.match(/\b(rtx|gtx|rx)\s*([0-9]{4})\s*(xtx|xt|gre|ti|super)?\b/i);
  if (gpu) {
    const family = gpu[1].toUpperCase();
    const suffix = gpu[3]?.toLowerCase();
    if (!suffix) return `${family} ${gpu[2]}`;
    if (family === 'RX') return `${family} ${gpu[2]}${suffix.toUpperCase()}`;
    return `${family} ${gpu[2]} ${suffix === 'ti' ? 'Ti' : suffix.toUpperCase()}`;
  }

  return readableFallback(name ?? model, GPU_FALLBACK);
}

export function formatPublicComboName(cpuModel?: unknown, gpuModel?: unknown, cpuName?: unknown, gpuName?: unknown) {
  return `${formatPublicCpuModel(cpuModel, cpuName)} + ${formatPublicGpuModel(gpuModel, gpuName)}`;
}

function joinModelText(name: unknown, model: unknown) {
  return [name, model].filter((value) => value !== undefined && value !== null).map(String).join(' ');
}

function findRyzenSeries(text: string) {
  const match = text.match(/(?:ryzen|라이젠)\s*([3579])\b/i);
  return match?.[1];
}

function inferRyzenSeries(modelNumber: string) {
  if (/^(9950|9900|7950|7900|5950|5900)/.test(modelNumber)) return '9';
  if (/^(9800|9700|7800|7700|8700|5800|5700)/.test(modelNumber)) return '7';
  if (/^(9600|9500|7600|7500|8600|8500|5600|5500)/.test(modelNumber)) return '5';
  return undefined;
}

function capitalizeModelSuffix(value: string) {
  return value.replace(/(x3d|xt|gre|kf|ti|super|[a-z])$/i, (suffix) => {
    if (suffix.toLowerCase() === 'ti') return 'Ti';
    return suffix.toUpperCase();
  });
}

function readableFallback(value: unknown, fallback: string) {
  const text = String(value ?? '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return text || fallback;
}
