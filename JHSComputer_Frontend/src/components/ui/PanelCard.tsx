import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function PageStack({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('grid min-w-0 gap-5', className)}>{children}</section>;
}

export function PanelCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0 rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5', className)}>
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  eyebrow,
  description,
  icon,
  action,
  className,
}: {
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col justify-between gap-4 md:flex-row md:items-center', className)}>
      <div className="min-w-0">
        {eyebrow && <p className="text-sm font-black text-brand">{eyebrow}</p>}
        <h2 className="safe-break text-2xl font-black text-slate-950">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}
      </div>
      {(icon || action) && (
        <div className="shrink-0">
          {action ?? <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-brand">{icon}</div>}
        </div>
      )}
    </div>
  );
}

export function IconTitle({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-line pb-4">
      {icon && <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-brand">{icon}</div>}
      <div className="min-w-0">
        <h2 className="safe-break text-xl font-black">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
    </div>
  );
}
