const gameLogoMap: Record<string, { tone: string; initials: string }> = {
  롤: { tone: 'from-amber-500 to-yellow-300', initials: 'LoL' },
  발로란트: { tone: 'from-red-500 to-rose-400', initials: 'VAL' },
  배틀그라운드: { tone: 'from-orange-500 to-stone-800', initials: 'PUBG' },
  로스트아크: { tone: 'from-blue-600 to-cyan-400', initials: 'LA' },
  '오버워치 2': { tone: 'from-orange-400 to-slate-700', initials: 'OW2' },
  메이플스토리: { tone: 'from-pink-400 to-orange-300', initials: 'MS' },
  피파온라인: { tone: 'from-emerald-500 to-lime-300', initials: 'FC' },
};

function hashTone(name: string) {
  const tones = [
    'from-teal-500 to-cyan-300',
    'from-violet-500 to-fuchsia-300',
    'from-slate-700 to-slate-400',
    'from-sky-500 to-indigo-400',
  ];
  const sum = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tones[sum % tones.length];
}

export function getGameLogo(gameName: string) {
  const mapped = gameLogoMap[gameName];
  if (mapped) return mapped;
  const compact = gameName.replace(/\s+/g, '');
  return {
    tone: hashTone(gameName),
    initials: compact.slice(0, Math.min(3, compact.length)).toUpperCase(),
  };
}
