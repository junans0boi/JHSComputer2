import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeLegacyQuoteInput,
  normalizeQuoteProfile,
  QUOTE_RULESET_VERSION,
  validateQuoteProfile,
} from '../src/quotes/quote-profile';

test('converts the existing v1 input into one weighted v2 workload without losing intent', () => {
  const profile = normalizeLegacyQuoteInput({
    budget: 450,
    purpose: '영상편집',
    games: ['APEX 레전드'],
    resolution: '4K',
    storage: '2TB',
    windows: 'WINDOWS_11_HOME_FPP',
    priority: '성능 우선',
  });

  assert.equal(profile.profileVersion, 2);
  assert.deepEqual(profile.workloadProfile.workloads, [
    {
      type: 'VIDEO_EDITING',
      weight: 100,
      details: {
        software: [],
        timeline: '4K',
        codec: 'UNKNOWN',
      },
    },
  ]);
  assert.equal(profile.budgetProfile.targetWon, 4_500_000);
  assert.deepEqual(profile.budgetProfile.includes, ['PARTS', 'ASSEMBLY', 'SHIPPING', 'WINDOWS']);
  assert.equal(profile.storageDemand.systemGb, 2048);
  assert.equal(profile.preferenceProfile.preset, 'PERFORMANCE');
  assert.deepEqual(profile.legacyInput, {
    budget: 450,
    purpose: '영상편집',
    games: ['APEX 레전드'],
    resolution: '4K',
    storage: '2TB',
    windows: 'WINDOWS_11_HOME_FPP',
    priority: '성능 우선',
  });
});

test('rejects a workload profile whose weights do not sum to 100', () => {
  const profile = normalizeQuoteProfile({
    profileVersion: 2,
    rulesetVersion: QUOTE_RULESET_VERSION,
    workloadProfile: {
      workloads: [
        { type: 'GAMING', weight: 60, details: { games: [], resolution: 'QHD', refreshRate: 60 } },
        { type: 'AI', weight: 30, details: { mode: 'INFERENCE', modelSize: '13B', quantization: 'Q4' } },
      ],
    },
    budgetProfile: { minimumWon: 1_000_000, targetWon: 1_500_000, maximumWon: 2_000_000, includes: ['PARTS'] },
    preferenceProfile: { preset: 'BALANCED', performance: 25, value: 25, aesthetics: 25, upgradeability: 25 },
    storageDemand: { systemGb: 1024, activeProjectGb: 0, archiveGb: 0, growthGbPerYear: 0, redundancy: 'NONE' },
    windowsOption: 'NONE',
  });

  assert.throws(() => validateQuoteProfile(profile), /100/);
});

test('normalizes and preserves a valid v2 profile', () => {
  const profile = normalizeQuoteProfile({
    profileVersion: 2,
    rulesetVersion: QUOTE_RULESET_VERSION,
    workloadProfile: { workloads: [{ type: 'AI', weight: 100, details: { mode: 'INFERENCE', modelSize: '13B', quantization: 'Q4' } }] },
    budgetProfile: { minimumWon: 3_000_000, targetWon: 4_000_000, maximumWon: 4_500_000, includes: ['PARTS', 'ASSEMBLY'] },
    preferenceProfile: { preset: 'BALANCED', performance: 40, value: 20, aesthetics: 10, upgradeability: 30 },
    storageDemand: { systemGb: 1024, activeProjectGb: 2048, archiveGb: 8192, growthGbPerYear: 2048, redundancy: 'BACKUP_REQUIRED' },
    windowsOption: 'NONE',
  });

  assert.doesNotThrow(() => validateQuoteProfile(profile));
  assert.equal(profile.workloadProfile.workloads[0].details.modelSize, '13B');
  assert.equal(profile.budgetProfile.maximumWon, 4_500_000);
  assert.equal(profile.storageDemand.redundancy, 'BACKUP_REQUIRED');
});

test('rejects a profile from an unsupported version instead of silently upgrading it', () => {
  assert.throws(
    () => normalizeQuoteProfile({ profileVersion: 1 }),
    /지원하지 않는 견적 프로필 버전/,
  );
  assert.throws(
    () => normalizeQuoteProfile({}),
    /지원하지 않는 견적 프로필 버전/,
  );
  assert.throws(
    () => normalizeQuoteProfile({ profileVersion: 2, rulesetVersion: 'legacy-ruleset' }),
    /지원하지 않는 견적 ruleset/,
  );

  const validProfile = normalizeLegacyQuoteInput({
    budget: 300,
    purpose: '게임',
    games: [],
    resolution: 'FHD',
    storage: '1TB',
    windows: 'NONE',
    priority: '가성비 우선',
  });
  assert.throws(
    () => validateQuoteProfile({ ...validProfile, rulesetVersion: 'legacy-ruleset' }),
    /지원하지 않는 견적 ruleset/,
  );
});

test('validates conditional details for every supported workload', () => {
  const profile = normalizeQuoteProfile({
    profileVersion: 2,
    rulesetVersion: QUOTE_RULESET_VERSION,
    workloadProfile: {
      workloads: [
        { type: 'GAMING', weight: 20, details: { games: ['APEX'], resolution: 'QHD', refreshRate: 144 } },
        { type: 'STREAMING', weight: 15, details: { outputResolution: 'FHD', hardwareEncoding: true } },
        { type: 'VIDEO_EDITING', weight: 20, details: { software: ['Premiere'], timeline: '4K', codec: 'H.264' } },
        { type: 'AI', weight: 15, details: { mode: 'INFERENCE', modelSize: '13B', quantization: 'Q4' } },
        { type: 'OFFICE', weight: 15, details: { multitasking: 'HEAVY' } },
        { type: 'DEVELOPMENT', weight: 15, details: { containers: true, virtualMachines: true } },
      ],
    },
    budgetProfile: { minimumWon: 1_000_000, targetWon: 1_500_000, maximumWon: 2_000_000, includes: ['PARTS'] },
    preferenceProfile: { preset: 'BALANCED', performance: 25, value: 25, aesthetics: 25, upgradeability: 25 },
    storageDemand: { systemGb: 1024, activeProjectGb: 0, archiveGb: 0, growthGbPerYear: 0, redundancy: 'NONE' },
    windowsOption: 'NONE',
  });

  assert.doesNotThrow(() => validateQuoteProfile(profile));
});

test('rejects missing conditional details and unknown Windows options', () => {
  assert.throws(
    () => normalizeQuoteProfile({
      profileVersion: 2,
      rulesetVersion: QUOTE_RULESET_VERSION,
      workloadProfile: { workloads: [{ type: 'AI', weight: 100, details: {} }] },
      budgetProfile: { minimumWon: 1_000_000, targetWon: 1_500_000, maximumWon: 2_000_000, includes: ['PARTS'] },
      preferenceProfile: { preset: 'BALANCED', performance: 25, value: 25, aesthetics: 25, upgradeability: 25 },
      storageDemand: { systemGb: 1024, activeProjectGb: 0, archiveGb: 0, growthGbPerYear: 0, redundancy: 'NONE' },
      windowsOption: 'WINDOWS_XP',
    }),
    /Windows 옵션이 올바르지 않습니다/,
  );

  const profile = normalizeQuoteProfile({
    profileVersion: 2,
    rulesetVersion: QUOTE_RULESET_VERSION,
    workloadProfile: { workloads: [{ type: 'AI', weight: 100, details: {} }] },
    budgetProfile: { minimumWon: 1_000_000, targetWon: 1_500_000, maximumWon: 2_000_000, includes: ['PARTS'] },
    preferenceProfile: { preset: 'BALANCED', performance: 25, value: 25, aesthetics: 25, upgradeability: 25 },
    storageDemand: { systemGb: 1024, activeProjectGb: 0, archiveGb: 0, growthGbPerYear: 0, redundancy: 'NONE' },
    windowsOption: 'NONE',
  });
  assert.throws(() => validateQuoteProfile(profile), /AI workload의 mode 조건이 필요합니다/);
});
