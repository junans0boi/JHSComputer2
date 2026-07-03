import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { QuoteOrderActions } from '@/components/QuoteOrderActions';
import { QuoteCompatibilityPanel, QuoteGamePerformancePanel, QuotePricePanel } from '@/components/QuoteSummary';
import { RecommendationGameBenchmarkPanel } from '@/components/recommendations/RecommendationGameBenchmarkPanel';
import { RecommendationHero } from '@/components/recommendations/RecommendationHero';
import { RecommendationMarkdownBody } from '@/components/recommendations/RecommendationMarkdownBody';
import { RecommendationPartsTable } from '@/components/recommendations/RecommendationPartsTable';
import { PageStack, PanelCard } from '@/components/ui/PanelCard';
import { loadRecommendationPost, normalizeRecommendationCategory, recommendationPostToQuote, type RecommendationPostGame } from '@/lib/recommendation-posts';
import type { Quote } from '@/lib/v1-types';

export default async function RecommendationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await loadRecommendationPost(slug);

  if (!post) notFound();
  const quote = recommendationPostToQuote(post);
  const heroImage = post.parts?.find((part) => ['CASE', '케이스'].includes(part.category) && part.imageUrl)?.imageUrl ?? post.thumbnailImageUrl;
  const gameTags = post.games.map((game) => `${game.gameName} ${game.resolution}`);

  return (
    <AppShell>
      <PageStack>
        <BackLink />

        <RecommendationHero
          actions={<QuoteOrderActions quote={quote} />}
          highlights={['JHS 검수 추천 조합', `CPU: ${post.cpuModel}`, `GPU: ${post.gpuModel}`, `케이스: ${post.casePartName ?? '추천 케이스'}`]}
          imageAlt={post.title}
          imageFallback="JHS 추천 PC"
          imageUrl={heroImage}
          subtitle={`${post.cpuModel} + ${post.gpuModel}`}
          summary={post.summary ?? 'JHS 기준으로 재구성한 추천 PC입니다. 주문 전 운영자가 현재 가격, 재고, 호환성, 케이스 장착성을 최종 확인합니다.'}
          tags={['JHS 추천', post.comboType ?? '', ...gameTags]}
          title={post.title}
        />

        <section className="grid min-w-0 gap-5">
          {post.bodyMd && (
            <PanelCard>
              <h3 className="text-xl font-black">JHS 추천 포인트</h3>
              <div className="part-spec mt-3 text-sm leading-7 text-slate-700">
                <RecommendationMarkdownBody body={post.bodyMd} />
              </div>
            </PanelCard>
          )}

          <RecommendationPartsTable
            description="JHS 추천 기준으로 정리한 구성표입니다. 가격/재고는 주문 전 다시 검증합니다."
            parts={(post.parts ?? []).map((part) => ({
              id: String(part.partId),
              label: normalizeRecommendationCategory(part.label ?? part.category),
              name: part.name,
              price: Number(part.price ?? 0),
              spec: part.specText,
            }))}
          />

          <RecommendationSupportPanels games={post.games} quote={quote} />
        </section>
      </PageStack>
    </AppShell>
  );
}

function RecommendationSupportPanels({ quote, games }: { quote: Quote; games?: RecommendationPostGame[] }) {
  return (
    <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <div className="grid min-w-0 gap-5">
        {games?.length ? <RecommendationGameBenchmarkPanel games={games} /> : <QuoteGamePerformancePanel quote={quote} />}
        <QuoteCompatibilityPanel compact quote={quote} />
      </div>
      <div className="min-w-0">
        <QuotePricePanel quote={quote} />
      </div>
    </section>
  );
}

function BackLink() {
  return (
    <Link className="inline-flex items-center gap-2 text-sm font-black text-brand" href="/recommendations">
      <ArrowLeft size={16} />
      추천 견적 목록
    </Link>
  );
}
