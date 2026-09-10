import { ArrowRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import {
  RECOMMENDATION_CARD_IMAGE_CLASS,
  RECOMMENDATION_CARD_IMAGE_FRAME_CLASS,
} from '@/lib/recommendation-image-layout';

type RecommendationBuildCardProps = {
  href: string;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  tags: string[];
  sourceLabel: string;
  price: number;
};

export function RecommendationBuildCard({ href, title, subtitle, imageUrl, tags, sourceLabel, price }: RecommendationBuildCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      <div className="grid min-w-0 gap-4 p-4 md:grid-cols-[180px_minmax(0,1fr)]">
        <div className={RECOMMENDATION_CARD_IMAGE_FRAME_CLASS}>
          {imageUrl ? (
            <img alt={title} className={RECOMMENDATION_CARD_IMAGE_CLASS} src={imageUrl} />
          ) : (
            <div className="text-center text-sm font-black text-slate-400">추천 PC</div>
          )}
        </div>
        <div>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 5).map((tag) => (
              <span className="rounded-full bg-teal-50 px-2 py-1 text-xs font-black text-brand" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <h3 className="mt-3 text-xl font-black">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
          <div className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-500">
            <PlayCircle size={16} />
            {sourceLabel}
          </div>
          <div className="mt-4 text-2xl font-black text-brand">{price.toLocaleString()}원</div>
        </div>
      </div>
      <div className="border-t border-line bg-panel p-4">
        <Link className="flex h-11 items-center justify-center gap-2 rounded-xl bg-ink text-sm font-black text-white hover:bg-brand" href={href}>
          게시글 보기
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
