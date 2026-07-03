import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const inputClass = 'w-full rounded-xl border border-line bg-white px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100';

export function FormField({
  label,
  icon,
  children,
  className,
}: {
  label: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-1.5 text-sm font-black text-slate-700', className)}>
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {children}
    </div>
  );
}

export function TextInput({ className, ...props }: ComponentPropsWithoutRef<'input'>) {
  return <input className={cn('h-11', inputClass, className)} {...props} />;
}

export function SelectInput({ className, children, ...props }: ComponentPropsWithoutRef<'select'>) {
  return (
    <select className={cn('h-11', inputClass, className)} {...props}>
      {children}
    </select>
  );
}

export function TextareaInput({ className, ...props }: ComponentPropsWithoutRef<'textarea'>) {
  return <textarea className={cn('min-h-[80px] py-3', inputClass, className)} {...props} />;
}
