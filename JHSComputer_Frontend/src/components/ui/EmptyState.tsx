import type { ReactNode } from 'react';
import { PanelCard } from '@/components/ui/PanelCard';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <PanelCard className="border-dashed p-10 text-center">
      {icon && <div className="mx-auto flex justify-center text-slate-300">{icon}</div>}
      <h3 className="mt-4 text-lg font-black">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </PanelCard>
  );
}
