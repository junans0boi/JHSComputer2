import assert from 'node:assert/strict';
import test from 'node:test';
import { quoteInputToProfile } from '../src/lib/quote-profile';
import { validateQuoteSurvey } from '../src/lib/quote-survey-validation';
import { applyBudgetInput, applyStorageCapacity, formatBudgetInput, parseBudgetInput, storageCapacityFromProfile } from '../src/lib/quote-survey-fields';

test('AI 단독 설문은 게임 목록 없이 제출할 수 있다', () => {
  const profile = quoteInputToProfile({
    budget: 300,
    purpose: 'AI',
    games: [],
    resolution: 'QHD',
    storage: '1TB',
    windows: 'NONE',
    priority: '성능 우선',
  });

  const result = validateQuoteSurvey(profile, { availableGames: [], gameCatalogReady: false });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('0%로 남은 게임 workload는 AI 단독 설문을 막지 않는다', () => {
  const aiProfile = quoteInputToProfile({
    budget: 300,
    purpose: 'AI',
    games: [],
    resolution: 'QHD',
    storage: '1TB',
    windows: 'NONE',
    priority: '성능 우선',
  });
  const profile = {
    ...aiProfile,
    workloadProfile: {
      workloads: [
        { type: 'GAMING' as const, weight: 0, details: { games: [], resolution: 'QHD', refreshRate: 144 } },
        ...aiProfile.workloadProfile.workloads,
      ],
    },
  };

  const result = validateQuoteSurvey(profile, { availableGames: [], gameCatalogReady: false });

  assert.equal(result.valid, true);
});

test('게임 workload는 게임 목록과 선택 게임이 모두 있어야 제출할 수 있다', () => {
  const profile = quoteInputToProfile({
    budget: 300,
    purpose: '게임',
    games: [],
    resolution: 'QHD',
    storage: '1TB',
    windows: 'NONE',
    priority: '성능 우선',
  });

  const result = validateQuoteSurvey(profile, { availableGames: ['배틀그라운드'], gameCatalogReady: true });

  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /게임/);
});

test('목표 예산이 0이거나 예산 순서가 잘못되면 제출할 수 없다', () => {
  const profile = quoteInputToProfile({
    budget: 0,
    purpose: 'AI',
    games: [],
    resolution: 'QHD',
    storage: '1TB',
    windows: 'NONE',
    priority: '성능 우선',
  });

  const invalidBudgetProfile = {
    ...profile,
    budgetProfile: { ...profile.budgetProfile, minimumWon: 5_000_000, targetWon: 3_000_000, maximumWon: 2_000_000 },
  };
  const result = validateQuoteSurvey(invalidBudgetProfile, { availableGames: [], gameCatalogReady: false });

  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /예산/);
});

test('예산 입력은 빈 상태를 허용하고 숫자를 다시 입력할 수 있다', () => {
  const profile = quoteInputToProfile({ budget: 1233, purpose: 'AI', games: [], resolution: 'QHD', storage: '1TB', windows: 'NONE', priority: '성능 우선' });

  assert.equal(parseBudgetInput(''), null);
  assert.equal(parseBudgetInput('0'), 0);
  assert.equal(parseBudgetInput('1233'), 12_330_000);
  assert.equal(formatBudgetInput(profile.budgetProfile.targetWon), '1233');
  assert.equal(applyBudgetInput(profile, 'maximumWon', '900').budgetProfile.maximumWon, 9_000_000);
  assert.equal(applyBudgetInput(profile, 'targetWon', '1500').budgetProfile.maximumWon, profile.budgetProfile.maximumWon);
});

test('저장장치 입력은 단순 용량으로 저장하고 숨겨진 세부 수요를 초기화한다', () => {
  const profile = quoteInputToProfile({ budget: 1233, purpose: 'AI', games: [], resolution: 'QHD', storage: '1TB', windows: 'NONE', priority: '성능 우선' });
  const next = applyStorageCapacity({ ...profile, storageDemand: { ...profile.storageDemand, redundancy: 'MIRROR', archiveGb: 800 } }, 2048);

  assert.equal(storageCapacityFromProfile(profile), 1024);
  assert.equal(next.storageDemand.systemGb, 2048);
  assert.equal(next.storageDemand.archiveGb, 0);
  assert.equal(next.storageDemand.redundancy, 'NONE');
});
