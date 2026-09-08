export const QUOTE_PROFILE_VERSION = 2 as const;
export const QUOTE_RULESET_VERSION = 'quote-profile-v2' as const;

export const WORKLOAD_TYPES = [
  'GAMING',
  'STREAMING',
  'VIDEO_EDITING',
  'AI',
  'OFFICE',
  'DEVELOPMENT',
] as const;

export type WorkloadType = (typeof WORKLOAD_TYPES)[number];
export type BudgetInclude = 'PARTS' | 'ASSEMBLY' | 'WINDOWS' | 'SHIPPING';
export type StorageRedundancy = 'NONE' | 'MIRROR' | 'BACKUP_REQUIRED';
export type PreferencePreset = 'BALANCED' | 'PERFORMANCE' | 'VALUE' | 'AESTHETICS' | 'UPGRADE';
export type WindowsOption = 'NONE' | 'INSTALL_ONLY' | 'WINDOWS_11_HOME_FPP' | 'WINDOWS_11_PRO_FPP';

export type Workload = {
  type: WorkloadType;
  weight: number;
  details: Record<string, unknown>;
};

export type WorkloadProfile = {
  workloads: Workload[];
};

export type BudgetProfile = {
  minimumWon: number;
  targetWon: number;
  maximumWon: number;
  includes: BudgetInclude[];
};

export type PreferenceProfile = {
  preset: PreferencePreset;
  performance: number;
  value: number;
  aesthetics: number;
  upgradeability: number;
};

export type StorageDemand = {
  systemGb: number;
  activeProjectGb: number;
  archiveGb: number;
  growthGbPerYear: number;
  redundancy: StorageRedundancy;
};

export type LegacyQuoteInput = {
  budget: number;
  purpose: string;
  games: string[];
  resolution: string;
  storage: string;
  windows: string;
  priority: string;
};

export type QuoteProfileV2 = {
  profileVersion: typeof QUOTE_PROFILE_VERSION;
  rulesetVersion: string;
  workloadProfile: WorkloadProfile;
  budgetProfile: BudgetProfile;
  preferenceProfile: PreferenceProfile;
  storageDemand: StorageDemand;
  windowsOption: WindowsOption;
  legacyInput?: LegacyQuoteInput;
};

const purposeToWorkload: Record<string, WorkloadType> = {
  게임: 'GAMING',
  방송: 'STREAMING',
  영상편집: 'VIDEO_EDITING',
  사무: 'OFFICE',
  AI: 'AI',
  개발: 'DEVELOPMENT',
};

const priorityToPreset: Record<string, PreferencePreset> = {
  '성능 우선': 'PERFORMANCE',
  '가성비 우선': 'VALUE',
  '감성 우선': 'AESTHETICS',
  '업그레이드 우선': 'UPGRADE',
};

const preferenceWeights: Record<PreferencePreset, Omit<PreferenceProfile, 'preset'>> = {
  BALANCED: { performance: 35, value: 25, aesthetics: 15, upgradeability: 25 },
  PERFORMANCE: { performance: 45, value: 15, aesthetics: 10, upgradeability: 30 },
  VALUE: { performance: 25, value: 45, aesthetics: 10, upgradeability: 20 },
  AESTHETICS: { performance: 30, value: 15, aesthetics: 40, upgradeability: 15 },
  UPGRADE: { performance: 30, value: 15, aesthetics: 10, upgradeability: 45 },
};

const budgetIncludes = new Set<BudgetInclude>(['PARTS', 'ASSEMBLY', 'WINDOWS', 'SHIPPING']);
const redundancyValues = new Set<StorageRedundancy>(['NONE', 'MIRROR', 'BACKUP_REQUIRED']);
const preferencePresets = new Set<PreferencePreset>(['BALANCED', 'PERFORMANCE', 'VALUE', 'AESTHETICS', 'UPGRADE']);
const windowsOptions = new Set<WindowsOption>(['NONE', 'INSTALL_ONLY', 'WINDOWS_11_HOME_FPP', 'WINDOWS_11_PRO_FPP']);

export function normalizeLegacyQuoteInput(input: LegacyQuoteInput): QuoteProfileV2 {
  const workloadType = purposeToWorkload[input.purpose] ?? 'GAMING';
  const windowsOption = normalizeWindowsOption(input.windows);
  const preset = priorityToPreset[input.priority] ?? 'BALANCED';
  const targetWon = Math.max(0, Math.round(Number(input.budget) * 10_000));
  const workload: Workload = {
    type: workloadType,
    weight: 100,
    details: legacyWorkloadDetails(workloadType, input),
  };

  return normalizeQuoteProfile({
    profileVersion: QUOTE_PROFILE_VERSION,
    rulesetVersion: QUOTE_RULESET_VERSION,
    workloadProfile: { workloads: [workload] },
    budgetProfile: {
      minimumWon: targetWon,
      targetWon,
      maximumWon: targetWon,
      includes: ['PARTS', 'ASSEMBLY', 'SHIPPING', ...(windowsOption === 'NONE' ? [] : ['WINDOWS' as const])],
    },
    preferenceProfile: { preset, ...preferenceWeights[preset] },
    storageDemand: {
      systemGb: parseStorageGb(input.storage),
      activeProjectGb: 0,
      archiveGb: 0,
      growthGbPerYear: 0,
      redundancy: 'NONE',
    },
    windowsOption,
    legacyInput: {
      ...input,
      games: [...input.games],
    },
  });
}

export function normalizeQuoteProfile(input: unknown): QuoteProfileV2 {
  if (!isRecord(input)) throw new Error('견적 프로필 형식이 올바르지 않습니다.');
  if (input.profileVersion !== QUOTE_PROFILE_VERSION) {
    throw new Error('지원하지 않는 견적 프로필 버전입니다.');
  }
  if (input.rulesetVersion !== QUOTE_RULESET_VERSION) {
    throw new Error('지원하지 않는 견적 ruleset입니다.');
  }

  const workloadProfile = normalizeWorkloadProfile(input.workloadProfile);
  const budgetProfile = normalizeBudgetProfile(input.budgetProfile);
  const preferenceProfile = normalizePreferenceProfile(input.preferenceProfile);
  const storageDemand = normalizeStorageDemand(input.storageDemand);
  const windowsOption = String(input.windowsOption) as WindowsOption;
  if (!windowsOptions.has(windowsOption)) throw new Error('Windows 옵션이 올바르지 않습니다.');
  const legacyInput = isRecord(input.legacyInput) ? input.legacyInput as unknown as LegacyQuoteInput : undefined;

  return {
    profileVersion: QUOTE_PROFILE_VERSION,
    rulesetVersion: QUOTE_RULESET_VERSION,
    workloadProfile,
    budgetProfile,
    preferenceProfile,
    storageDemand,
    windowsOption,
    ...(legacyInput ? { legacyInput } : {}),
  };
}

export function validateQuoteProfile(profile: QuoteProfileV2): void {
  if (profile.profileVersion !== QUOTE_PROFILE_VERSION) {
    throw new Error('지원하지 않는 견적 프로필 버전입니다.');
  }
  if (profile.rulesetVersion !== QUOTE_RULESET_VERSION) {
    throw new Error('지원하지 않는 견적 ruleset입니다.');
  }

  const workloads = profile.workloadProfile.workloads;
  if (!workloads.length || workloads.length > WORKLOAD_TYPES.length) {
    throw new Error('workload는 하나 이상 선택해야 합니다.');
  }

  const seen = new Set<WorkloadType>();
  const weightTotal = workloads.reduce((sum, workload) => {
    if (!WORKLOAD_TYPES.includes(workload.type)) throw new Error(`지원하지 않는 workload입니다: ${workload.type}`);
    if (seen.has(workload.type)) throw new Error(`workload가 중복되었습니다: ${workload.type}`);
    seen.add(workload.type);
    if (!Number.isFinite(workload.weight) || workload.weight < 0 || workload.weight > 100) {
      throw new Error('workload 비중은 0에서 100 사이여야 합니다.');
    }
    validateWorkloadDetails(workload.type, workload.details);
    return sum + workload.weight;
  }, 0);
  if (Math.abs(weightTotal - 100) > 0.001) throw new Error('workload 비중의 합은 100이어야 합니다.');

  const budget = profile.budgetProfile;
  if ([budget.minimumWon, budget.targetWon, budget.maximumWon].some((value) => !Number.isSafeInteger(value) || value < 0)) {
    throw new Error('예산은 0 이상의 정수 원 단위여야 합니다.');
  }
  if (budget.minimumWon > budget.targetWon || budget.targetWon > budget.maximumWon) {
    throw new Error('예산 범위는 최소 ≤ 목표 ≤ 최대 순서여야 합니다.');
  }
  if (!budget.includes.length || budget.includes.some((item) => !budgetIncludes.has(item))) {
    throw new Error('예산 포함 항목이 올바르지 않습니다.');
  }
  const windowsIncluded = budget.includes.includes('WINDOWS');
  if (windowsIncluded !== (profile.windowsOption !== 'NONE')) {
    throw new Error('Windows 옵션과 예산 포함 항목이 일치하지 않습니다.');
  }

  const preference = profile.preferenceProfile;
  if (!preferencePresets.has(preference.preset)) throw new Error('선호 프리셋이 올바르지 않습니다.');
  const preferenceTotal = [preference.performance, preference.value, preference.aesthetics, preference.upgradeability]
    .reduce((sum, value) => {
      if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error('선호 가중치는 0에서 100 사이여야 합니다.');
      return sum + value;
    }, 0);
  if (Math.abs(preferenceTotal - 100) > 0.001) throw new Error('선호 가중치의 합은 100이어야 합니다.');

  const storage = profile.storageDemand;
  if ([storage.systemGb, storage.activeProjectGb, storage.archiveGb, storage.growthGbPerYear]
    .some((value) => !Number.isSafeInteger(value) || value < 0)) {
    throw new Error('저장장치 수요는 0 이상의 정수 GB 단위여야 합니다.');
  }
  if (!redundancyValues.has(storage.redundancy)) throw new Error('중복 보관 요구가 올바르지 않습니다.');
  if (!windowsOptions.has(profile.windowsOption)) throw new Error('Windows 옵션이 올바르지 않습니다.');
}

function normalizeWorkloadProfile(input: unknown): WorkloadProfile {
  if (!isRecord(input) || !Array.isArray(input.workloads)) throw new Error('workload 프로필이 필요합니다.');
  return {
    workloads: input.workloads.map((value) => {
      if (!isRecord(value)) throw new Error('workload 형식이 올바르지 않습니다.');
      return {
        type: String(value.type) as WorkloadType,
        weight: Number(value.weight),
        details: isRecord(value.details) ? { ...value.details } : {},
      };
    }),
  };
}

function normalizeBudgetProfile(input: unknown): BudgetProfile {
  if (!isRecord(input) || !Array.isArray(input.includes)) throw new Error('예산 프로필이 필요합니다.');
  return {
    minimumWon: Number(input.minimumWon),
    targetWon: Number(input.targetWon),
    maximumWon: Number(input.maximumWon),
    includes: [...new Set(input.includes.map((value) => String(value) as BudgetInclude))],
  };
}

function normalizePreferenceProfile(input: unknown): PreferenceProfile {
  if (!isRecord(input)) throw new Error('선호 프로필이 필요합니다.');
  return {
    preset: String(input.preset ?? 'BALANCED') as PreferencePreset,
    performance: Number(input.performance),
    value: Number(input.value),
    aesthetics: Number(input.aesthetics),
    upgradeability: Number(input.upgradeability),
  };
}

function normalizeStorageDemand(input: unknown): StorageDemand {
  if (!isRecord(input)) throw new Error('저장장치 수요가 필요합니다.');
  return {
    systemGb: Number(input.systemGb),
    activeProjectGb: Number(input.activeProjectGb),
    archiveGb: Number(input.archiveGb),
    growthGbPerYear: Number(input.growthGbPerYear),
    redundancy: String(input.redundancy ?? 'NONE') as StorageRedundancy,
  };
}

function validateWorkloadDetails(type: WorkloadType, details: Record<string, unknown>): void {
  switch (type) {
    case 'GAMING':
      requireStringArray(details, 'games', type, true);
      requireResolution(details, 'resolution', type);
      requireInteger(details, 'refreshRate', type, 30, 1000);
      return;
    case 'STREAMING':
      requireResolution(details, 'outputResolution', type);
      requireBoolean(details, 'hardwareEncoding', type);
      return;
    case 'VIDEO_EDITING':
      requireStringArray(details, 'software', type, true);
      requireString(details, 'timeline', type);
      requireString(details, 'codec', type);
      return;
    case 'AI':
      requireString(details, 'mode', type);
      requireString(details, 'modelSize', type);
      requireString(details, 'quantization', type);
      return;
    case 'OFFICE':
      requireString(details, 'multitasking', type);
      return;
    case 'DEVELOPMENT':
      requireBoolean(details, 'containers', type);
      requireBoolean(details, 'virtualMachines', type);
      return;
  }
}

function requireString(details: Record<string, unknown>, key: string, type: WorkloadType): void {
  if (typeof details[key] !== 'string' || !details[key].trim()) {
    throw new Error(`${type} workload의 ${key} 조건이 필요합니다.`);
  }
}

function requireStringArray(details: Record<string, unknown>, key: string, type: WorkloadType, allowEmpty: boolean): void {
  const value = details[key];
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0) || value.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new Error(`${type} workload의 ${key} 조건이 올바르지 않습니다.`);
  }
}

function requireResolution(details: Record<string, unknown>, key: string, type: WorkloadType): void {
  if (!['FHD', 'QHD', '4K', '8K'].includes(String(details[key]))) {
    throw new Error(`${type} workload의 ${key} 해상도가 올바르지 않습니다.`);
  }
}

function requireBoolean(details: Record<string, unknown>, key: string, type: WorkloadType): void {
  if (typeof details[key] !== 'boolean') throw new Error(`${type} workload의 ${key} 조건이 필요합니다.`);
}

function requireInteger(details: Record<string, unknown>, key: string, type: WorkloadType, min: number, max: number): void {
  const value = details[key];
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max) {
    throw new Error(`${type} workload의 ${key} 값이 올바르지 않습니다.`);
  }
}

function legacyWorkloadDetails(type: WorkloadType, input: LegacyQuoteInput): Record<string, unknown> {
  switch (type) {
    case 'GAMING':
      return { games: [...input.games], resolution: input.resolution, refreshRate: 60 };
    case 'STREAMING':
      return { outputResolution: input.resolution, hardwareEncoding: true };
    case 'VIDEO_EDITING':
      return { software: [], timeline: input.resolution, codec: 'UNKNOWN' };
    case 'AI':
      return { mode: 'INFERENCE', modelSize: 'UNKNOWN', quantization: 'UNKNOWN' };
    case 'DEVELOPMENT':
      return { containers: false, virtualMachines: false };
    case 'OFFICE':
      return { multitasking: 'STANDARD' };
  }
}

function parseStorageGb(value: string): number {
  const normalized = value.replace(/,/g, '').trim().toUpperCase();
  const tb = normalized.match(/^(\d+(?:\.\d+)?)\s*TB$/);
  if (tb) return Math.round(Number(tb[1]) * 1024);
  const gb = normalized.match(/^(\d+)\s*GB$/);
  return gb ? Number(gb[1]) : 1024;
}

function normalizeWindowsOption(value: unknown): WindowsOption {
  if (value === 'INSTALL_ONLY' || value === '설치만') return 'INSTALL_ONLY';
  if (value === 'WINDOWS_11_HOME_FPP' || value === '포함') return 'WINDOWS_11_HOME_FPP';
  if (value === 'WINDOWS_11_PRO_FPP') return 'WINDOWS_11_PRO_FPP';
  return 'NONE';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
