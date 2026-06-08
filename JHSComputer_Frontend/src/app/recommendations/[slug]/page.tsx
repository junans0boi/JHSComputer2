import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { QuoteSummary } from '@/components/QuoteSummary';
import { RecommendationActions } from '@/components/RecommendationActions';
import { getRecommendedBuild, recommendedBuildToQuote } from '@/lib/recommended-builds';

export default async function RecommendationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const build = getRecommendedBuild(slug);
  if (!build) notFound();

  const quote = recommendedBuildToQuote(build);

  return (
    <AppShell>
      <section className="grid gap-5">
        <Link className="inline-flex items-center gap-2 text-sm font-black text-brand" href="/recommendations">
          <ArrowLeft size={16} />
          추천 견적 목록
        </Link>

        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
          <div className="grid gap-5 p-5 lg:grid-cols-[360px_1fr]">
            <div className="grid min-h-80 place-items-center rounded-2xl bg-panel p-5">
              <img alt={build.title} className="max-h-72 max-w-full object-contain" src={build.heroImage} />
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                {build.tags.map((tag) => (
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-brand" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-4 text-3xl font-black">{build.title}</h2>
              <p className="mt-2 text-lg font-bold text-slate-700">{build.subtitle}</p>
              <p className="mt-4 rounded-xl border border-line bg-panel p-4 text-sm leading-6 text-slate-600">{build.target}</p>

              <div className="mt-4 grid gap-2">
                {build.highlights.map((item) => (
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700" key={item}>
                    <CheckCircle className="text-brand" size={16} />
                    {item}
                  </div>
                ))}
              </div>

              <RecommendationActions build={build} />
            </div>
          </div>
        </div>

        <section className="grid gap-5 lg:grid-cols-[1fr_420px]">
          <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
            <h3 className="text-xl font-black">추천 구성표</h3>
            <p className="mt-1 text-sm text-slate-600">영상에서 소개한 구성입니다. 주문 전 운영자가 가격/재고/호환성을 한 번 더 확인합니다.</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-line">
              {build.parts.map((part) => (
                <div className="grid grid-cols-[96px_1fr_auto] gap-3 border-t border-line p-3 first:border-t-0" key={`${part.category}-${part.name}`}>
                  <strong className="text-brand">{part.category}</strong>
                  <div>
                    <div className="font-black">{part.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{part.memo}</div>
                  </div>
                  <div className="font-black">{part.price.toLocaleString()}원</div>
                </div>
              ))}
            </div>
          </div>

          <QuoteSummary compact quote={quote} />
        </section>
      </section>
    </AppShell>
  );
}
