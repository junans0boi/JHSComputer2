import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'dark' | 'outline' | 'danger' | 'ghost' | 'disabled';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-teal-900',
  dark: 'bg-ink text-white hover:bg-brand',
  outline: 'border border-line bg-white text-slate-700 hover:border-brand hover:text-brand',
  danger: 'border border-line bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600',
  ghost: 'text-brand hover:underline',
  disabled: 'cursor-not-allowed bg-slate-300 text-white',
};

export function Button({
  children,
  className,
  variant = 'primary',
  ...props
}: ComponentPropsWithoutRef<'button'> & {
  children: ReactNode;
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={cn('inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition', variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  className,
  variant = 'primary',
  ...props
}: ComponentPropsWithoutRef<typeof Link> & {
  children: ReactNode;
  variant?: ButtonVariant;
}) {
  return (
    <Link
      className={cn('inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition', variantClasses[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
