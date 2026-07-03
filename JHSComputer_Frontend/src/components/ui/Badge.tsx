import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeTone = 'brand' | 'slate' | 'amber' | 'emerald' | 'red' | 'blue';

const toneClasses: Record<BadgeTone, string> = {
  brand: 'bg-teal-50 text-brand',
  slate: 'bg-slate-100 text-slate-600',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  blue: 'bg-blue-50 text-blue-700',
};

export function Badge({
  children,
  tone = 'brand',
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-black', toneClasses[tone], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status, label }: { status: string; label: string }) {
  const tone: BadgeTone =
    status === 'DELIVERED' ? 'emerald' :
    status === 'CANCELLED' ? 'red' :
    status.includes('WAITING') ? 'amber' :
    'brand';

  return <Badge tone={tone}>{label}</Badge>;
}
