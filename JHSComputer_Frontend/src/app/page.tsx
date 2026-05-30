'use client';

import {
  CheckCircle2,
  ChevronRight,
  Cpu,
  HardDrive,
  Monitor,
  PackageCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const games = ['롤', '배틀그라운드', '발로란트', '로스트아크', '오버워치 2'];
const purposes = ['게임', '방송', '영상편집', '사무', 'AI'];
const priorities = ['성능 우선', '가성비 우선', '감성 우선', '업그레이드 우선'];

const partRows = [
  ['CPU', 'AMD Ryzen 5 7500F', '템플릿 추천'],
  ['쿨러', '3RSYS Socoool RC350', '호환 확인'],
  ['메인보드', 'B650M WiFi', 'DDR5'],
  ['RAM', 'DDR5 32GB', '게임/작업 균형'],
  ['GPU', 'RTX 5060 계열', '인기순 후보'],
  ['SSD', 'NVMe 1TB', '필수 용량 반영'],
  ['파워', '700W Bronze', '용량 여유'],
  ['케이스', '전면 메시 미들타워', 'GPU 길이 확인'],
];

export default function Home() {
  const [selectedGame, setSelectedGame] = useState(games[1]);
  const [budget, setBudget] = useState(150);
  const [purpose, setPurpose] = useState(purposes[0]);
  const [priority, setPriority] = useState(priorities[0]);

  const estimate = useMemo(() => {
    const base = budget * 10000;
    const assembly = 50000;
    const shipping = 10000;
    const windows = purpose === '사무' ? 0 : 180000;

    return {
      parts: base,
      assembly,
      shipping,
      windows,
      total: base + assembly + shipping + windows,
    };
  }, [budget, purpose]);

  return (
    <main className="min-h-screen px-5 py-6 text-ink md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 border-b border-line pb-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-brand">정효성 TV</p>
            <h1 className="mt-1 text-2xl font-bold tracking-normal md:text-3xl">PC 자동 견적</h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {['견적', '주문', '배송', '관리자'].map((item) => (
              <button
                key={item}
                className="rounded-md border border-line bg-white px-3 py-2 font-medium shadow-sm transition hover:border-brand hover:text-brand"
                type="button"
              >
                {item}
              </button>
            ))}
          </nav>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-lg border border-line bg-white p-4 shadow-soft md:p-5">
            <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <h2 className="text-lg font-bold">견적 설문</h2>
                <p className="mt-1 text-sm text-slate-600">본체 기준으로 계산하고 주문 단계에서 가격을 다시 확인합니다.</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-brand">
                <Cpu size={22} />
              </div>
            </div>

            <div className="mt-5 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">예산</span>
                <div className="flex items-center gap-3">
                  <input
                    className="h-2 flex-1 accent-teal-700"
                    max={300}
                    min={70}
                    onChange={(event) => setBudget(Number(event.target.value))}
                    step={10}
                    type="range"
                    value={budget}
                  />
                  <output className="w-24 rounded-md border border-line bg-panel px-3 py-2 text-right font-bold">
                    {budget}만원
                  </output>
                </div>
              </label>

              <div className="grid gap-2">
                <span className="text-sm font-semibold">용도</span>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                  {purposes.map((item) => (
                    <button
                      className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                        purpose === item
                          ? 'border-brand bg-teal-50 text-brand'
                          : 'border-line bg-white hover:border-brand'
                      }`}
                      key={item}
                      onClick={() => setPurpose(item)}
                      type="button"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <span className="text-sm font-semibold">게임</span>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                  {games.map((item) => (
                    <button
                      className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                        selectedGame === item
                          ? 'border-accent bg-amber-50 text-accent'
                          : 'border-line bg-white hover:border-accent'
                      }`}
                      key={item}
                      onClick={() => setSelectedGame(item)}
                      type="button"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">모니터</span>
                  <select className="h-11 rounded-md border border-line bg-white px-3">
                    <option>QHD 144Hz</option>
                    <option>FHD 144Hz</option>
                    <option>4K 60Hz</option>
                    <option>제품명으로 입력</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">저장 용량</span>
                  <select className="h-11 rounded-md border border-line bg-white px-3">
                    <option>1TB 이상</option>
                    <option>500GB 이상</option>
                    <option>250GB 이상</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-2">
                <span className="text-sm font-semibold">우선순위</span>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {priorities.map((item) => (
                    <button
                      className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                        priority === item
                          ? 'border-brand bg-teal-50 text-brand'
                          : 'border-line bg-white hover:border-brand'
                      }`}
                      key={item}
                      onClick={() => setPriority(item)}
                      type="button"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="grid gap-5">
            <div className="rounded-lg border border-line bg-white p-4 shadow-soft md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">견적 결과</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedGame} · {purpose} · {priority}
                  </p>
                </div>
                <span className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                  호환 통과
                </span>
              </div>

              <div className="mt-5 grid gap-2">
                {partRows.map(([category, name, note]) => (
                  <div
                    className="grid min-h-14 grid-cols-[76px_1fr_auto] items-center gap-3 rounded-md border border-line bg-panel px-3 py-2"
                    key={category}
                  >
                    <span className="text-sm font-bold text-slate-600">{category}</span>
                    <span className="min-w-0 text-sm font-semibold">{name}</span>
                    <span className="hidden text-xs font-semibold text-slate-500 sm:block">{note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-line bg-white p-4 shadow-soft md:p-5">
              <div className="grid gap-3">
                <PriceRow label="부품 합계" value={estimate.parts} />
                <PriceRow label="조립비" value={estimate.assembly} />
                <PriceRow label="윈도우" value={estimate.windows} />
                <PriceRow label="배송비" value={estimate.shipping} />
                <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
                  <span className="font-bold">최종 예상가</span>
                  <strong className="text-2xl text-brand">{estimate.total.toLocaleString()}원</strong>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <StatusItem icon={<Monitor size={18} />} label="QHD" />
                <StatusItem icon={<HardDrive size={18} />} label="1TB" />
                <StatusItem icon={<ShieldCheck size={18} />} label="스냅샷" />
              </div>

              <button
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-ink px-4 font-bold text-white transition hover:bg-brand"
                type="button"
              >
                주문 전 가격 확인
                <ChevronRight size={18} />
              </button>
            </div>
          </aside>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <InfoStrip icon={<PackageCheck size={19} />} title="주문 스냅샷" value="부품명·가격·배송정보 저장" />
          <InfoStrip icon={<CheckCircle2 size={19} />} title="가격 변경 승인" value="1원 변경도 승인 필요" />
          <InfoStrip icon={<Sparkles size={19} />} title="성능 표시" value="등급 + 참고 FPS 범위" />
        </section>
      </div>
    </main>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-semibold text-slate-600">{label}</span>
      <span className="font-bold">{value.toLocaleString()}원</span>
    </div>
  );
}

function StatusItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-md border border-line bg-panel text-sm font-bold">
      <span className="text-brand">{icon}</span>
      {label}
    </div>
  );
}

function InfoStrip({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex min-h-20 items-center gap-3 rounded-lg border border-line bg-white px-4 shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-brand">{icon}</span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-sm text-slate-600">{value}</p>
      </div>
    </div>
  );
}
