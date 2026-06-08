'use client';

import { ArrowRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { recommendedBuilds } from '@/lib/recommended-builds';

export default function RecommendationsPage() {
  return (
    <AppShell>
      <section className="grid gap-5">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
          <p className="text-sm font-black text-brand">정효성 TV 추천 견적</p>
          <h2 className="mt-2 text-3xl font-black">영상 보고 바로 주문하는 추천 PC</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            유튜브에서 소개한 구성, 게임별 목적, 예산대를 게시글처럼 정리합니다. 마음에 드는 견적은 바로 주문서로 넘길 수 있습니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {recommendedBuilds.map((build) => (
            <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft" key={build.id}>
              <div className="grid gap-4 p-4 md:grid-cols-[180px_1fr]">
                <div className="grid h-44 place-items-center rounded-xl bg-panel p-4">
                  <img alt={build.title} className="max-h-full max-w-full object-contain" src={build.heroImage} />
                </div>
                <div>
                  <div className="flex flex-wrap gap-1">
                    {build.tags.map((tag) => (
                      <span className="rounded-full bg-teal-50 px-2 py-1 text-xs font-black text-brand" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-3 text-xl font-black">{build.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{build.subtitle}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-500">
                    <PlayCircle size={16} />
                    {build.videoTitle}
                  </div>
                  <div className="mt-4 text-2xl font-black text-brand">
                    {build.parts.reduce((sum, part) => sum + part.price, 60000).toLocaleString()}원
                  </div>
                </div>
              </div>
              <div className="border-t border-line bg-panel p-4">
                <Link
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-ink text-sm font-black text-white hover:bg-brand"
                  href={`/recommendations/${build.slug}`}
                >
                  게시글 보기
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
