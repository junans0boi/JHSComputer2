import { CheckCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/Badge';
import { PanelCard } from '@/components/ui/PanelCard';

export function RecommendationHero({
  title,
  subtitle,
  imageUrl,
  imageAlt,
  imageFallback = 'JHS 추천 PC',
  tags,
  summary,
  highlights,
  actions,
}: {
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  imageAlt: string;
  imageFallback?: string;
  tags: string[];
  summary: string;
  highlights: string[];
  actions: ReactNode;
}) {
  return (
    <PanelCard className="overflow-hidden p-0">
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className="grid min-h-80 place-items-center rounded-2xl bg-panel p-5">
          {imageUrl ? (
            <img alt={imageAlt} className="max-h-72 max-w-full object-contain" src={imageUrl} />
          ) : (
            <div className="text-center text-sm font-black text-slate-400">{imageFallback}</div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            {tags.filter(Boolean).slice(0, 7).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <h2 className="safe-break mt-4 text-3xl font-black">{title}</h2>
          <p className="mt-2 text-lg font-bold text-slate-700">{subtitle}</p>
          <p className="part-spec mt-4 rounded-xl border border-line bg-panel p-4 text-sm leading-6 text-slate-600">{summary}</p>

          <div className="mt-4 grid gap-2">
            {highlights.map((item) => (
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700" key={item}>
                <CheckCircle className="shrink-0 text-brand" size={16} />
                <span className="safe-break">{item}</span>
              </div>
            ))}
          </div>

          {actions}
        </div>
      </div>
    </PanelCard>
  );
}
