export const comfortGradeLabels: Record<string, string> = {
  VERY_SMOOTH: '매우 쾌적',
  SMOOTH: '쾌적',
  PLAYABLE: '플레이 가능',
  OPTION_TUNING: '옵션 조정',
  DIFFICULT: '비추천',
  UNSUPPORTED: '미지원',
  UNKNOWN: '확인 필요',
};

export const qualityLabels: Record<string, string> = {
  ULTRA: '울트라',
  HIGH: '높음',
  BALANCED: '균형',
  PERFORMANCE: '성능 우선',
  UNSUPPORTED: '미지원',
  UNKNOWN: '확인 필요',
};

export function resolutionLabel(resolution: string) {
  return resolution === 'UHD' ? '4K' : resolution;
}
