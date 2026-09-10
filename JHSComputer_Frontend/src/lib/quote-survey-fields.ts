import type { QuoteProfileV2 } from './quote-profile';

export type BudgetField = 'minimumWon' | 'targetWon' | 'maximumWon';

export const budgetFields: BudgetField[] = ['minimumWon', 'targetWon', 'maximumWon'];

export const storageCapacityOptions = [
  { gb: 500, label: '500GB', description: '문서·인터넷·가벼운 작업' },
  { gb: 1024, label: '1TB', description: '게임·프로그램을 함께 사용하는 일반적인 용량' },
  { gb: 2048, label: '2TB', description: '영상·AI 자료를 넉넉하게 보관' },
  { gb: 4096, label: '4TB', description: '대용량 프로젝트와 자료 보관' },
] as const;

export function parseBudgetInput(raw: string): number | null {
  if (!raw.trim()) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? Math.max(0, Math.round(value) * 10_000) : null;
}

export function formatBudgetInput(valueWon: number): string {
  return String(Math.round(valueWon / 10_000));
}

export function applyBudgetInput(profile: QuoteProfileV2, key: BudgetField, raw: string): QuoteProfileV2 {
  const valueWon = parseBudgetInput(raw);
  if (valueWon === null) return profile;
  return { ...profile, budgetProfile: { ...profile.budgetProfile, [key]: valueWon } };
}

export function storageCapacityFromProfile(profile: QuoteProfileV2): number {
  const totalGb = profile.storageDemand.systemGb
    + profile.storageDemand.activeProjectGb
    + profile.storageDemand.archiveGb
    + profile.storageDemand.growthGbPerYear;
  return storageCapacityOptions.reduce<number>((closest, option) => {
    if (Math.abs(option.gb - totalGb) < Math.abs(closest - totalGb)) return option.gb;
    return closest;
  }, storageCapacityOptions[0].gb);
}

export function applyStorageCapacity(profile: QuoteProfileV2, gb: number): QuoteProfileV2 {
  return {
    ...profile,
    storageDemand: {
      systemGb: gb,
      activeProjectGb: 0,
      archiveGb: 0,
      growthGbPerYear: 0,
      redundancy: 'NONE',
    },
  };
}
