import type { QuoteInput } from './v1-types';

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

export type QuoteProfileV2 = {
  profileVersion: typeof QUOTE_PROFILE_VERSION;
  rulesetVersion: string;
  workloadProfile: { workloads: Workload[] };
  budgetProfile: {
    minimumWon: number;
    targetWon: number;
    maximumWon: number;
    includes: BudgetInclude[];
  };
  preferenceProfile: {
    preset: PreferencePreset;
    performance: number;
    value: number;
    aesthetics: number;
    upgradeability: number;
  };
  storageDemand: {
    systemGb: number;
    activeProjectGb: number;
    archiveGb: number;
    growthGbPerYear: number;
    redundancy: StorageRedundancy;
  };
  windowsOption: WindowsOption;
  legacyInput?: QuoteInput;
};

const purposeToWorkload: Record<QuoteInput['purpose'], WorkloadType> = {
  게임: 'GAMING',
  방송: 'STREAMING',
  영상편집: 'VIDEO_EDITING',
  사무: 'OFFICE',
  AI: 'AI',
};

const priorityToPreset: Record<QuoteInput['priority'], PreferencePreset> = {
  '성능 우선': 'PERFORMANCE',
  '가성비 우선': 'VALUE',
  '감성 우선': 'AESTHETICS',
  '업그레이드 우선': 'UPGRADE',
};

const preferenceWeights: Record<PreferencePreset, Omit<QuoteProfileV2['preferenceProfile'], 'preset'>> = {
  BALANCED: { performance: 35, value: 25, aesthetics: 15, upgradeability: 25 },
  PERFORMANCE: { performance: 45, value: 15, aesthetics: 10, upgradeability: 30 },
  VALUE: { performance: 25, value: 45, aesthetics: 10, upgradeability: 20 },
  AESTHETICS: { performance: 30, value: 15, aesthetics: 40, upgradeability: 15 },
  UPGRADE: { performance: 30, value: 15, aesthetics: 10, upgradeability: 45 },
};

/** Converts the persisted v1 survey shape into the v2 server contract. */
export function quoteInputToProfile(input: QuoteInput): QuoteProfileV2 {
  const workloadType = purposeToWorkload[input.purpose];
  const windowsOption = input.windows;
  const preset = priorityToPreset[input.priority];
  const targetWon = Math.max(0, Math.round(Number(input.budget) * 10_000));
  const includes: BudgetInclude[] = ['PARTS', 'ASSEMBLY', 'SHIPPING'];
  if (windowsOption !== 'NONE') includes.push('WINDOWS');

  return {
    profileVersion: QUOTE_PROFILE_VERSION,
    rulesetVersion: QUOTE_RULESET_VERSION,
    workloadProfile: {
      workloads: [{
        type: workloadType,
        weight: 100,
        details: legacyWorkloadDetails(workloadType, input),
      }],
    },
    budgetProfile: {
      minimumWon: targetWon,
      targetWon,
      maximumWon: targetWon,
      includes,
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
  };
}

function legacyWorkloadDetails(type: WorkloadType, input: QuoteInput): Record<string, unknown> {
  switch (type) {
    case 'GAMING':
      return { games: [...input.games], resolution: input.resolution, refreshRate: 60 };
    case 'STREAMING':
      return { outputResolution: input.resolution, hardwareEncoding: true };
    case 'VIDEO_EDITING':
      return { software: [], timeline: input.resolution, codec: 'UNKNOWN' };
    case 'AI':
      return { mode: 'INFERENCE', modelSize: 'UNKNOWN', quantization: 'UNKNOWN' };
    case 'OFFICE':
      return { multitasking: 'STANDARD' };
    case 'DEVELOPMENT':
      return { containers: false, virtualMachines: false };
  }
}

function parseStorageGb(value: QuoteInput['storage']): number {
  return value === '500GB' ? 500 : value === '2TB' ? 2048 : 1024;
}
