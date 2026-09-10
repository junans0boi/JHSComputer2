import type { QuoteProfileV2 } from './quote-profile';

export type QuoteSurveyValidationOptions = {
  availableGames: string[];
  gameCatalogReady: boolean;
};

export type QuoteSurveyValidation = {
  valid: boolean;
  errors: string[];
  weightTotal: number;
};

/** The public client-side gate used before a profile is sent to quote preview. */
export function validateQuoteSurvey(
  profile: QuoteProfileV2,
  options: QuoteSurveyValidationOptions,
): QuoteSurveyValidation {
  const workloads = profile.workloadProfile.workloads;
  const weightTotal = workloads.reduce((sum, workload) => sum + Number(workload.weight || 0), 0);
  const errors: string[] = [];

  if (!workloads.length || Math.abs(weightTotal - 100) > 0.001) {
    errors.push('작업 비중의 합계를 100%로 맞춰주세요.');
  }

  const { minimumWon, targetWon, maximumWon } = profile.budgetProfile;
  if (!Number.isFinite(minimumWon) || !Number.isFinite(targetWon) || !Number.isFinite(maximumWon) || targetWon <= 0 || minimumWon > targetWon || targetWon > maximumWon) {
    errors.push('최소·목표·최대 예산을 올바른 순서로 입력해주세요.');
  }

  const gaming = workloads.find((workload) => workload.type === 'GAMING' && Number(workload.weight) > 0);
  if (gaming) {
    if (!options.gameCatalogReady || options.availableGames.length === 0) {
      errors.push('게임 목록을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    } else {
      const selectedGames = asStringArray(gaming.details.games);
      const validSelectedGames = selectedGames.filter((game) => options.availableGames.includes(game));
      if (!validSelectedGames.length) errors.push('게임 workload를 선택했다면 게임을 하나 이상 골라주세요.');
    }
  }

  return { valid: errors.length === 0, errors, weightTotal };
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}
