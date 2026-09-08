import assert from 'node:assert/strict';
import test from 'node:test';
import { quoteInputToProfile } from '../src/lib/quote-profile';
import { loadLatestQuoteProfile, loadQuoteProfile, saveQuote, saveQuoteProfile } from '../src/lib/v1-storage';
import type { Quote } from '../src/lib/v1-types';

test('adapts the persisted v1 survey input to the server v2 profile contract', () => {
  const profile = quoteInputToProfile({
    budget: 300,
    purpose: '게임',
    games: ['Cyberpunk 2077'],
    resolution: 'QHD',
    storage: '1TB',
    windows: 'NONE',
    priority: '가성비 우선',
  });

  assert.deepEqual(profile.workloadProfile.workloads, [{
    type: 'GAMING',
    weight: 100,
    details: { games: ['Cyberpunk 2077'], resolution: 'QHD', refreshRate: 60 },
  }]);
  assert.equal(profile.budgetProfile.targetWon, 3_000_000);
  assert.deepEqual(profile.budgetProfile.includes, ['PARTS', 'ASSEMBLY', 'SHIPPING']);
  assert.equal(profile.storageDemand.systemGb, 1024);
  assert.equal(profile.preferenceProfile.preset, 'VALUE');
  assert.equal(profile.legacyInput?.purpose, '게임');

  const editingProfile = quoteInputToProfile({
    ...profile.legacyInput!,
    purpose: '영상편집',
  });
  assert.equal(editingProfile.workloadProfile.workloads[0].details.codec, 'UNKNOWN');
});

test('keeps a saved profile attached to its quote and migrates older quotes independently', () => {
  const store = new Map<string, string>();
  const previousWindow = (globalThis as unknown as { window?: unknown }).window;
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
      },
    },
  });

  const inputA = {
    budget: 300,
    purpose: '게임' as const,
    games: ['APEX'],
    resolution: 'QHD' as const,
    storage: '1TB' as const,
    windows: 'NONE' as const,
    priority: '가성비 우선' as const,
  };
  const inputB = { ...inputA, budget: 450, purpose: 'AI' as const, games: [] };

  try {
    saveQuote({ id: 'quote-a', input: inputA } as unknown as Quote);
    const multiProfile = {
      ...quoteInputToProfile(inputA),
      workloadProfile: {
        workloads: [
          { type: 'GAMING' as const, weight: 60, details: { games: ['APEX'], resolution: 'QHD', refreshRate: 144 } },
          { type: 'AI' as const, weight: 40, details: { mode: 'INFERENCE', modelSize: '13B', quantization: 'Q4' } },
        ],
      },
    };
    saveQuoteProfile('quote-a', multiProfile);
    saveQuote({ id: 'quote-a', input: inputA } as unknown as Quote);
    assert.equal(loadQuoteProfile('quote-a')?.workloadProfile.workloads.length, 2);
    saveQuote({ id: 'quote-b', input: inputB } as unknown as Quote);

    assert.equal(loadLatestQuoteProfile()?.legacyInput?.purpose, 'AI');

    saveQuoteProfile('quote-b', quoteInputToProfile(inputB));
    assert.equal(loadLatestQuoteProfile()?.legacyInput?.budget, 450);

    const malformedProfile = { ...quoteInputToProfile(inputA), windowsOption: 'WINDOWS_XP' };
    store.set('jhscomputer.v1.quotes', JSON.stringify([{ id: 'quote-c', input: inputA, profile: malformedProfile }]));
    assert.equal(loadLatestQuoteProfile()?.legacyInput?.budget, 300);

    const validProfile = quoteInputToProfile(inputA);
    const workload = validProfile.workloadProfile.workloads[0];
    const duplicateProfile = {
      ...validProfile,
      workloadProfile: {
        workloads: [{ ...workload, weight: 50 }, { ...workload, weight: 50 }],
      },
    };
    store.set('jhscomputer.v1.quotes', JSON.stringify([{ id: 'quote-d', input: inputA, profile: duplicateProfile }]));
    assert.equal(loadLatestQuoteProfile()?.legacyInput?.budget, 300);
  } finally {
    if (previousWindow === undefined) delete (globalThis as { window?: unknown }).window;
    else Object.defineProperty(globalThis, 'window', { configurable: true, value: previousWindow });
  }
});
