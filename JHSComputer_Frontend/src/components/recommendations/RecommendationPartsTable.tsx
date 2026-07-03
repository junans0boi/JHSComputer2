import { Badge } from '@/components/ui/Badge';
import { PanelCard } from '@/components/ui/PanelCard';

export type RecommendationPartRow = {
  id: string;
  label: string;
  name: string;
  spec?: string | null;
  price: number;
};

export function RecommendationPartsTable({
  title = '추천 구성표',
  description,
  parts,
}: {
  title?: string;
  description: string;
  parts: RecommendationPartRow[];
}) {
  return (
    <PanelCard>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-line">
        {parts.map((part) => (
          <div className="grid min-w-[780px] gap-3 border-t border-line p-3 first:border-t-0 sm:grid-cols-[110px_minmax(420px,1fr)_auto]" key={part.id}>
            <Badge>{part.label}</Badge>
            <div className="min-w-0">
              <div className="part-name text-sm">{part.name}</div>
              {part.spec && <div className="part-spec mt-1 text-xs text-slate-500">{part.spec}</div>}
            </div>
            <div className="font-black">{part.price.toLocaleString()}원</div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
