import { PanelCard } from '@/components/ui/PanelCard';
import { QuotePartList } from '@/components/ui/QuotePartList';

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
      <div className="mt-4">
        <QuotePartList parts={parts.map((part) => ({ id: part.id, category: part.label, name: part.name, spec: part.spec, price: part.price, quantity: 1 }))} />
      </div>
    </PanelCard>
  );
}
