import { AppShell } from '@/components/AppShell';
import { RecommendationBuildCard } from '@/components/RecommendationBuildCard';
import { FormField, SelectInput, TextInput } from '@/components/ui/FormField';
import { PageStack, PanelCard, SectionHeader } from '@/components/ui/PanelCard';
import { loadRecommendationPosts, type RecommendationPostFilters } from '@/lib/recommendation-posts';

const scenarioCards = [
  { title: '게임별 추천', desc: '게임명과 해상도를 골라 옵션별 견적을 가격순으로 봅니다.', href: '/recommendations?game=배틀그라운드&resolution=QHD&sort=price' },
  { title: '예산 안 가성비', desc: '예산 안에서 성능이 좋은 구성을 먼저 봅니다.', href: '/recommendations?budgetMax=1200000&sort=performance' },
  { title: '인기 견적', desc: '많이 본 견적, 많이 담은 견적, 주문이 많은 견적입니다.', href: '/recommendations?sort=popular' },
  { title: '부품 포함 검색', desc: 'CPU/GPU/케이스 등 특정 부품이 들어간 견적을 찾습니다.', href: '/recommendations?part=RTX' },
  { title: '브랜드 조합', desc: '인텔+엔비디아, 라이젠+라데온 같은 조합으로 봅니다.', href: '/recommendations?comboType=RYZEN_NVIDIA' },
];

const comboOptions = [
  { label: '라이젠 + 엔비디아', value: 'RYZEN_NVIDIA' },
  { label: '인텔 + 엔비디아', value: 'INTEL_NVIDIA' },
  { label: '라이젠 + 라데온', value: 'RYZEN_RADEON' },
  { label: '인텔 + 라데온', value: 'INTEL_RADEON' },
];

export default async function RecommendationsPage(props: { searchParams: Promise<RecommendationPostFilters> }) {
  const searchParams = await props.searchParams;
  const posts = await loadRecommendationPosts(searchParams, 36);
  const hasPosts = posts.items.length > 0;

  return (
    <AppShell>
      <PageStack>
        <PanelCard>
          <SectionHeader
            description="왕가PC 원본 목록이 아니라, JHS 기준으로 재구성하고 검수한 추천 견적만 보여줍니다. 게임, 예산, 인기, 부품, 브랜드 조합으로 빠르게 좁혀보세요."
            eyebrow="JHS 추천 견적"
            title="내 상황에 맞는 PC 견적 찾기"
          />
        </PanelCard>

        <div className="grid gap-3 md:grid-cols-5">
          {scenarioCards.map((card) => (
            <a className="rounded-2xl border border-line bg-white p-4 shadow-soft transition hover:border-brand hover:bg-teal-50/40" href={card.href} key={card.title}>
              <h3 className="font-black text-slate-950">{card.title}</h3>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-500">{card.desc}</p>
            </a>
          ))}
        </div>

        <PanelCard>
        <form action="/recommendations">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_1fr_auto]">
            <FormField className="text-xs text-slate-500" label="통합 검색">
              <TextInput name="q" placeholder="제목, CPU, GPU" defaultValue={searchParams.q ?? ''} />
            </FormField>
            <FormField className="text-xs text-slate-500" label="게임">
              <TextInput name="game" placeholder="예: 배틀그라운드" defaultValue={searchParams.game ?? ''} />
            </FormField>
            <FormField className="text-xs text-slate-500" label="해상도">
              <SelectInput name="resolution" defaultValue={searchParams.resolution ?? ''}>
                <option value="">전체</option>
                <option value="FHD">FHD</option>
                <option value="QHD">QHD</option>
                <option value="4K">4K</option>
              </SelectInput>
            </FormField>
            <FormField className="text-xs text-slate-500" label="최대 예산">
              <TextInput name="budgetMax" placeholder="1200000" defaultValue={searchParams.budgetMax ?? ''} />
            </FormField>
            <FormField className="text-xs text-slate-500" label="포함 부품">
              <TextInput name="part" placeholder="RTX 4060, 7500F" defaultValue={searchParams.part ?? ''} />
            </FormField>
            <button className="mt-auto h-11 rounded-xl bg-ink px-5 text-sm font-black text-white hover:bg-brand" type="submit">
              검색
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-slate-500">브랜드 조합</span>
            {comboOptions.map((combo) => (
              <a
                className={`rounded-full border px-3 py-1.5 text-xs font-black transition ${
                  searchParams.comboType === combo.value ? 'border-brand bg-teal-50 text-brand' : 'border-line bg-white text-slate-600 hover:border-brand hover:text-brand'
                }`}
                href={`/recommendations?comboType=${encodeURIComponent(combo.value)}`}
                key={combo.value}
              >
                {combo.label}
              </a>
            ))}
            <span className="ml-auto text-xs font-black text-slate-500">정렬</span>
            {[
              ['popular', '인기순'],
              ['price', '가격순'],
              ['performance', '성능/가성비'],
              ['new', '최신순'],
            ].map(([value, label]) => (
              <a
                className={`rounded-full border px-3 py-1.5 text-xs font-black transition ${
                  (searchParams.sort ?? 'popular') === value ? 'border-brand bg-teal-50 text-brand' : 'border-line bg-white text-slate-600 hover:border-brand hover:text-brand'
                }`}
                href={`/recommendations?${new URLSearchParams({ ...searchParams, sort: value }).toString()}`}
                key={value}
              >
                {label}
              </a>
            ))}
          </div>
        </form>
        </PanelCard>

        {hasPosts ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {posts.items.map((post) => (
              <RecommendationBuildCard
                href={`/recommendations/${post.id}`}
                imageUrl={post.thumbnailImageUrl}
                key={post.id}
                price={Number(post.totalPrice ?? 0)}
                sourceLabel={`${post.cpuModel ?? 'CPU'} + ${post.gpuModel ?? 'GPU'}`}
                subtitle={post.subtitle ?? post.summary ?? `${post.cpuBrand ?? ''} ${post.gpuBrand ?? ''} 추천 견적`}
                tags={[
                  ...(post.gameTags ?? []).slice(0, 3),
                  post.comboType ?? '',
                  post.casePartName ? '케이스 썸네일' : '',
                ].filter(Boolean)}
                title={post.title}
              />
            ))}
          </div>
        ) : (
          <PanelCard>
            <div className="py-10 text-center">
              <h3 className="text-lg font-black text-slate-800">조건에 맞는 DB 추천 견적이 없습니다.</h3>
              <p className="mt-2 text-sm font-bold text-slate-500">관리자 페이지에서 실제 DB 부품으로 추천 게시글을 등록하면 여기에 표시됩니다.</p>
            </div>
          </PanelCard>
        )}
      </PageStack>
    </AppShell>
  );
}
