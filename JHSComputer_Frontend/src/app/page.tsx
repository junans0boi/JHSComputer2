import Link from 'next/link';
import { AppShell } from '@/components/AppShell';

export default function Home() {
  return (
    <AppShell>
      {/* 히어로 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 p-8 text-white shadow-soft md:p-12">
        <div className="relative z-10 grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-block rounded-full bg-teal-600/60 px-4 py-1.5 text-sm font-black">
              🖥️ 정효성 TV 공식 PC 조립 서비스
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
              PC 조립, 이제<br />
              <span className="text-amber-300">클릭 몇 번</span>으로<br />
              해결하세요
            </h1>
            <p className="mt-4 text-base leading-7 text-teal-100">
              예산만 입력하면 AI가 자동으로 최적의 구성을 추천합니다.
              컴퓨터를 전혀 몰라도 OK. 주문부터 배송까지 전부 대행합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="flex h-14 items-center gap-2 rounded-2xl bg-amber-400 px-6 font-black text-amber-900 transition hover:bg-amber-300"
                href="/quote"
              >
                ✨ 무료 견적 받기
              </Link>
              <Link
                className="flex h-14 items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 font-black backdrop-blur transition hover:bg-white/20"
                href="/recommendations"
              >
                추천 구성 보기
              </Link>
            </div>
            <p className="mt-4 text-xs text-teal-200">
              ✓ 견적 무료 &nbsp;·&nbsp; ✓ 전문가 검수 &nbsp;·&nbsp; ✓ 조립 후 배송
            </p>
          </div>
          <div className="hidden md:flex md:justify-end">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '1,733+', desc: '등록 부품' },
                { label: '113+', desc: '추천 구성' },
                { label: '99%', desc: '고객 만족도' },
                { label: '당일', desc: '견적 발급' },
              ].map((stat) => (
                <div
                  className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur"
                  key={stat.label}
                >
                  <div className="text-2xl font-black text-amber-300">{stat.label}</div>
                  <div className="mt-1 text-xs text-teal-100">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-teal-600/20 to-transparent" />
      </section>

      {/* 이용 방법 */}
      <section className="rounded-3xl border border-line bg-white p-6 shadow-soft md:p-8">
        <div className="text-center">
          <p className="text-sm font-black text-brand">어떻게 진행되나요?</p>
          <h2 className="mt-2 text-2xl font-black md:text-3xl">3단계로 완성되는 내 PC</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              step: '01',
              icon: '💬',
              title: '예산 · 용도 입력',
              desc: '게임, 방송, 영상편집 등 목적과 예산을 입력하면 AI가 최적의 구성을 자동 추천합니다.',
            },
            {
              step: '02',
              icon: '🔍',
              title: '전문가 검수',
              desc: '주문 접수 후 전문가가 가격, 재고, 호환성을 다시 한번 확인하고 견적서를 확정합니다.',
            },
            {
              step: '03',
              icon: '🚚',
              title: '조립 후 배송',
              desc: '입금 확인 후 부품 수급 → 조립 → 테스트를 거쳐 완성된 PC를 안전하게 배송합니다.',
            },
          ].map((item) => (
            <div className="relative rounded-2xl bg-panel p-6" key={item.step}>
              <span className="absolute right-4 top-4 text-4xl font-black text-slate-100">{item.step}</span>
              <div className="text-4xl">{item.icon}</div>
              <h3 className="mt-3 text-lg font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            className="flex h-12 items-center gap-2 rounded-2xl bg-brand px-8 font-black text-white transition hover:bg-teal-900"
            href="/quote"
          >
            지금 무료 견적 받기 →
          </Link>
        </div>
      </section>

      {/* 용도별 추천 */}
      <section className="rounded-3xl border border-line bg-white p-6 shadow-soft md:p-8">
        <p className="text-sm font-black text-brand">용도별 추천</p>
        <h2 className="mt-2 text-2xl font-black">어떤 PC가 필요하세요?</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              emoji: '🎮',
              title: '게이밍 PC',
              desc: 'FPS·배틀그라운드·롤 등 고주사율 게임에 최적화된 구성',
              price: '80만원~',
              color: 'bg-blue-50 border-blue-200',
              href: '/quote?purpose=게임',
            },
            {
              emoji: '📺',
              title: '방송·스트리밍',
              desc: '인코딩 + 게임 동시 실행을 위한 고성능 CPU 중심 구성',
              price: '150만원~',
              color: 'bg-purple-50 border-purple-200',
              href: '/quote?purpose=방송',
            },
            {
              emoji: '🎬',
              title: '영상 편집',
              desc: '4K 편집·렌더링 시간을 줄이는 고성능 구성',
              price: '200만원~',
              color: 'bg-amber-50 border-amber-200',
              href: '/quote?purpose=영상편집',
            },
            {
              emoji: '💼',
              title: '사무·문서 작업',
              desc: '빠른 부팅과 인터넷·문서 작업에 최적화된 가성비 구성',
              price: '50만원~',
              color: 'bg-green-50 border-green-200',
              href: '/quote?purpose=사무',
            },
          ].map((item) => (
            <Link
              className={`group rounded-2xl border p-5 transition hover:shadow-soft ${item.color}`}
              href={item.href}
              key={item.title}
            >
              <div className="text-3xl">{item.emoji}</div>
              <h3 className="mt-3 font-black">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">{item.desc}</p>
              <div className="mt-3 text-sm font-black text-brand">{item.price}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 추천 구성 미리보기 */}
      <section className="rounded-3xl border border-line bg-white p-6 shadow-soft md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black text-brand">인기 추천 구성</p>
            <h2 className="mt-2 text-2xl font-black">지금 가장 많이 주문하는 PC</h2>
          </div>
          <Link className="text-sm font-black text-brand hover:underline" href="/recommendations">
            전체 보기 →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              title: '게이밍 입문 세트',
              spec: 'Ryzen 5 9600 + RTX 5060',
              desc: 'FHD 고주사율·발로란트·롤 추천 구성',
              price: 950000,
              badge: '🔥 인기',
            },
            {
              title: '게이밍 스탠다드',
              spec: 'Ryzen 7 7800X3D + RTX 5060 Ti',
              desc: 'QHD 울트라 세팅·배그·에이팩스 추천 구성',
              price: 1580000,
              badge: '⭐ 추천',
            },
            {
              title: '게이밍 프리미엄',
              spec: 'Ryzen 7 9800X3D + RTX 5070',
              desc: 'QHD 최상 세팅·4K 게이밍까지 가능한 구성',
              price: 2400000,
              badge: '👑 프리미엄',
            },
          ].map((build) => (
            <Link
              className="group rounded-2xl border border-line bg-panel p-5 transition hover:border-brand hover:shadow-soft"
              href="/recommendations"
              key={build.title}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-black text-amber-700">{build.badge}</span>
              </div>
              <h3 className="mt-3 font-black">{build.title}</h3>
              <p className="mt-1 text-xs font-bold text-brand">{build.spec}</p>
              <p className="mt-2 text-xs leading-5 text-slate-600">{build.desc}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-500">예상 가격</div>
                  <div className="text-xl font-black text-brand">{build.price.toLocaleString()}원~</div>
                </div>
                <span className="rounded-xl bg-brand px-3 py-2 text-sm font-black text-white transition group-hover:bg-teal-900">
                  견적 받기
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 신뢰 지표 */}
      <section className="rounded-3xl border border-line bg-gradient-to-br from-slate-50 to-panel p-6 shadow-soft md:p-8">
        <h2 className="text-center text-2xl font-black">왜 JHS Computer인가요?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '🔧', title: '전문가 직접 조립', desc: '단순 조립대행이 아닌 숙련된 엔지니어가 케이블 정리까지 완벽하게' },
            { icon: '✅', title: '출고 전 테스트', desc: '벤치마크·스트레스 테스트로 안정성을 확인한 후 배송합니다' },
            { icon: '🛡️', title: '부품 1년 A/S', desc: '불량 부품 발생 시 구입 후 1년간 무상 교환 서비스 제공' },
            { icon: '💬', title: '카카오톡 상담', desc: '주문 진행 상황을 카카오톡으로 실시간 알림 · 문의 응대' },
          ].map((item) => (
            <div className="rounded-2xl bg-white p-5 shadow-soft" key={item.title}>
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-black">{item.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-gradient-to-r from-teal-800 to-teal-700 p-8 text-center text-white shadow-soft">
        <h2 className="text-2xl font-black md:text-3xl">지금 바로 무료 견적을 받아보세요</h2>
        <p className="mt-3 text-teal-100">예산을 입력하면 1분 안에 맞춤 구성을 확인할 수 있습니다</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            className="flex h-14 items-center gap-2 rounded-2xl bg-amber-400 px-8 font-black text-amber-900 transition hover:bg-amber-300"
            href="/quote"
          >
            ✨ 무료 견적 시작하기
          </Link>
          <Link
            className="flex h-14 items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-8 font-black backdrop-blur transition hover:bg-white/20"
            href="/parts"
          >
            부품 직접 선택하기
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
