'use client';

import { ClipboardList, Cpu, Newspaper, Settings, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const menus = [
  { href: '/parts', label: '카테고리별 부품', icon: Cpu },
  { href: '/recommendations', label: '추천 견적', icon: Newspaper },
  { href: '/quote', label: '견적', icon: ClipboardList },
  { href: '/mypage', label: '마이페이지', icon: UserRound },
  { href: '/admin', label: '관리자', icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen px-5 py-6 text-ink md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="rounded-2xl border border-line bg-white/90 p-4 shadow-soft backdrop-blur md:p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-brand">정효성 TV · PC 자동 견적 v1</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">견적부터 배송까지 한 번에</h1>
              <p className="mt-2 text-sm text-slate-600">DB 연결 전에도 운영 흐름을 검증할 수 있는 로컬 동작 MVP입니다.</p>
            </div>
            <nav className="grid grid-cols-2 gap-2 text-sm md:grid-cols-5">
              {menus.map((menu) => {
                const Icon = menu.icon;
                const active = pathname === menu.href || pathname.startsWith(`${menu.href}/`) || (menu.href === '/quote' && pathname === '/');
                return (
                  <Link
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 font-bold transition ${
                      active ? 'border-brand bg-teal-50 text-brand' : 'border-line bg-white hover:border-brand hover:text-brand'
                    }`}
                    href={menu.href}
                    key={menu.href}
                  >
                    <Icon size={16} />
                    {menu.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
