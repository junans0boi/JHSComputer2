export const DEFAULT_COLLECTION_POLICY = Object.freeze({
  delayMs: 6_000,
  jitterMs: 2_500,
  restEvery: 5,
  restMs: 30_000,
  maxRetries: 2,
  retryBaseMs: 10_000,
  refreshAfterMs: 7 * 24 * 60 * 60 * 1_000,
});

export function calculateRequestDelay(policy = DEFAULT_COLLECTION_POLICY, random = Math.random) {
  const jitter = Math.max(0, Math.floor((policy.jitterMs ?? 0) * random() + 0.5));
  return Math.max(0, Number(policy.delayMs ?? 0)) + jitter;
}

export function getRecommendationContextKey(record) {
  return [
    record.source,
    record.gameId,
    record.resolution,
    record.tier,
    record.platform,
    record.cpuModel,
    record.gpuModel,
  ].map((value) => String(value ?? '').trim()).join('|');
}

export function dedupeRecommendationRecords(records) {
  const byKey = new Map();
  for (const record of records) {
    const key = getRecommendationContextKey(record);
    const existing = byKey.get(key);
    if (!existing || compareDates(record.crawledAt, existing.crawledAt) >= 0) {
      byKey.set(key, record);
    }
  }
  return [...byKey.values()];
}

function compareDates(left, right) {
  const leftTime = Date.parse(String(left ?? ''));
  const rightTime = Date.parse(String(right ?? ''));
  if (Number.isFinite(leftTime) && Number.isFinite(rightTime)) return leftTime - rightTime;
  if (Number.isFinite(leftTime)) return 1;
  return 0;
}

export function shouldRefreshCheckpoint(entry, now = Date.now(), refreshAfterMs = DEFAULT_COLLECTION_POLICY.refreshAfterMs) {
  if (!entry || entry.status !== 'completed') return true;
  const checkedAt = Date.parse(String(entry.checkedAt ?? ''));
  if (!Number.isFinite(checkedAt)) return true;
  return now - checkedAt >= refreshAfterMs;
}

export function shouldApplyLatestSnapshot(existingCapturedAt, incomingCapturedAt) {
  if (!existingCapturedAt) return true;
  const existingTime = Date.parse(String(existingCapturedAt));
  const incomingTime = Date.parse(String(incomingCapturedAt ?? ''));
  if (!Number.isFinite(existingTime)) return true;
  if (!Number.isFinite(incomingTime)) return false;
  return incomingTime >= existingTime;
}

export function planIncrementalTargets(
  targets,
  checkpoint = {},
  { now = Date.now(), refreshAfterMs = DEFAULT_COLLECTION_POLICY.refreshAfterMs, limit = 0, force = false } = {},
) {
  const planned = [];
  for (const target of targets) {
    const entry = checkpoint[String(target.gameId)];
    if (!force && !shouldRefreshCheckpoint(entry, now, refreshAfterMs)) continue;
    planned.push({ ...target, reason: entry?.status === 'completed' ? 'stale' : 'new' });
    if (limit > 0 && planned.length >= limit) break;
  }
  return planned;
}
