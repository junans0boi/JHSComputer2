const CPU_CATEGORIES = new Set(['CPU', '프로세서']);
const GPU_CATEGORIES = new Set(['GPU', '그래픽카드', 'VGA']);

function clean(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

export function normalizeCpuModel(value) {
  const text = clean(value).toLowerCase().replace(/[™®]/g, '');
  const ultra = text.match(/(?:core\s*)?(?:ultra|울트라)\s*([579])\s*(?:시리즈\s*\d\s*)?(\d{3,4})([a-z]+)?(?:\s*plus)?/i);
  if (ultra) return `ultra${ultra[1]}-${ultra[2]}${ultra[3] ?? ''}${/plus/i.test(ultra[0]) ? '-plus' : ''}`;

  const ryzen = text.match(/(?:ryzen|라이젠)\s*([3579])\s*[- ]?(?:\d+세대\s*)?(\d{4,5})(x3d|x|f|g|gt)?/i);
  if (ryzen) return `ryzen${ryzen[1]}-${ryzen[2]}${ryzen[3] ?? ''}`;

  const intel = text.match(/\b(i[3579])\s*[- ]?(\d{4,5})([a-z]+)?\b/i);
  if (intel) return `${intel[1]}-${intel[2]}${intel[3] ?? ''}`.toLowerCase();
  return null;
}

export function normalizeGpuModel(value) {
  const text = clean(value).toLowerCase().replace(/[™®]/g, '');
  const rtx = text.match(/(?:geforce\s*)?rtx\s*(\d{4})\s*(ti|super)?/i);
  if (rtx) return `rtx${rtx[1]}${rtx[2] ?? ''}`.toLowerCase();

  const rx = text.match(/(?:radeon\s*)?rx\s*(\d{4})\s*(xt|gre)?/i);
  if (rx) return `rx${rx[1]}${rx[2] ?? ''}`.toLowerCase();

  const arc = text.match(/arc\s*([ab]\d{3})/i);
  if (arc) return `arc-${arc[1].toLowerCase()}`;
  return null;
}

function findPart(parts, categories) {
  return (parts ?? []).find((part) => categories.has(clean(part.category))) ?? null;
}

function asResolution(value) {
  if (value === '4K') return 'UHD';
  return ['FHD', 'QHD', 'UHD'].includes(value) ? value : null;
}

function asRecords(games) {
  return (games ?? []).flatMap((game) => Object.entries(game.resolutions ?? {}).flatMap(([rawResolution, rawItems]) => {
    const resolution = asResolution(rawResolution);
    if (!resolution) return [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    return items
      .filter((item) => Number.isFinite(Number(item?.fps)) && Number(item.fps) > 0 && clean(item?.optionPreset))
      .map((item) => ({
        gameName: clean(game.gameName),
        resolution,
        optionPreset: clean(item.optionPreset),
        fps: Number(item.fps),
        playable: item.playable !== false,
        rawText: clean(item.rawText) || `${clean(item.optionPreset)} ${Number(item.fps)} FPS`,
      }))
      .filter((item) => item.gameName);
  }));
}

export function buildEstimateObservation(parsed, sourceUrl = null) {
  const cpuPart = findPart(parsed.parts, CPU_CATEGORIES);
  const gpuPart = findPart(parsed.parts, GPU_CATEGORIES);
  const cpuName = clean(cpuPart?.name);
  const gpuName = clean(gpuPart?.name);
  const cpuModel = normalizeCpuModel(cpuName);
  const gpuModel = normalizeGpuModel(gpuName);
  if (!cpuName || !gpuName || !cpuModel || !gpuModel) return null;

  const estimateId = clean(parsed.estimateId);
  if (!estimateId) return null;
  const externalBuildId = `estimate-${estimateId}`;
  return {
    estimateId,
    externalBuildId,
    sourceConditionKey: externalBuildId,
    title: clean(parsed.title) || `${cpuName} + ${gpuName}`,
    cpuName,
    cpuModel,
    gpuName,
    gpuModel,
    comboKey: `kjwwang-${cpuModel}-${gpuModel}`,
    evidenceType: 'SOURCE_RECOMMENDATION',
    sourceUrl: parsed.collection?.url ?? sourceUrl,
    sourceUpdatedAt: parsed.sourceUpdatedAt ?? null,
    contentHash: parsed.collection?.contentHash ?? parsed.contentHash ?? null,
    collection: parsed.collection ?? null,
    records: asRecords(parsed.games),
  };
}
