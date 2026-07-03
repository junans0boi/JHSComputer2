'use client';

import { ClipboardList, Cpu, Gamepad2, LogIn, LogOut, Menu, Newspaper, Settings, ShoppingCart, UserRound, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { clearSession, getSession, type LoginUser } from '@/lib/auth-client';
import { loadCartQuotes } from '@/lib/v1-storage';

const navItems = [
  { href: '/parts', label: '부품 쇼핑', icon: Cpu },
  { href: '/recommendations', label: '추천 견적', icon: Newspaper },
  { href: '/benchmarks', label: '게임 성능', icon: Gamepad2 },
  { href: '/quote', label: '내 견적', icon: ClipboardList },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<LoginUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const session = getSession();
    setUser(session?.user ?? null);
    setCartCount(loadCartQuotes().length);
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    setUser(null);
    router.push('/');
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-ink">
      {/* 최상단 안내 배너 */}
      <div className="bg-teal-900 px-3 py-2 text-center text-[11px] font-bold leading-5 text-teal-100 sm:text-xs">
        <span className="inline-block">🚀 주문 후 평균 3~5일 이내 완성 배송</span>
        <span className="mx-2 hidden sm:inline">·</span>
        <span className="inline-block">📞 카카오톡 실시간 문의 가능</span>
      </div>

      {/* 헤더 */}
      <header className="sticky top-0 z-50 border-b border-line bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 md:px-6">
          {/* 로고 */}
          <Link className="flex min-w-0 shrink items-center gap-2" href="/">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white font-black text-sm">
              JHS
            </div>
            <div className="hidden min-w-0 sm:block">
              <div className="truncate text-base font-black leading-tight">JHS Computer</div>
              <div className="truncate text-xs text-slate-500">정효성 TV PC 조립 서비스</div>
            </div>
          </Link>

          {/* 데스크탑 내비게이션 */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== '/');
              return (
                <Link
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition ${
                    active ? 'bg-teal-50 text-brand' : 'text-slate-600 hover:bg-slate-50 hover:text-brand'
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* 우측 액션 */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {/* 장바구니 */}
            <Link
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-line hover:border-brand hover:text-brand transition"
              href="/mypage/cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 사용자 메뉴 */}
            {user ? (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm font-bold hover:border-brand hover:text-brand transition"
                  href={user.role === 'ADMIN' ? '/admin' : '/mypage'}
                >
                  <UserRound size={15} />
                  {user.name ?? user.loginId}
                  {user.role === 'ADMIN' && (
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-700">관리자</span>
                  )}
                </Link>
                <button
                  className="flex items-center gap-1 rounded-xl border border-line px-3 py-2 text-sm font-bold text-slate-500 hover:border-red-300 hover:text-red-600 transition"
                  onClick={handleLogout}
                  type="button"
                >
                  <LogOut size={15} />
                  <span className="hidden xl:inline">로그아웃</span>
                </button>
              </div>
            ) : (
              <Link
                className="hidden items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-black text-white transition hover:bg-teal-900 lg:flex"
                href="/login"
              >
                <LogIn size={15} />
                로그인
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link
                className="hidden h-9 items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-3 text-sm font-bold text-amber-700 hover:border-amber-400 transition lg:flex"
                href="/admin"
              >
                <Settings size={14} />
                관리자
              </Link>
            )}

            {/* 모바일 메뉴 토글 */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileOpen && (
          <div className="border-t border-line bg-white px-4 pb-4 lg:hidden">
            <nav className="mt-3 grid gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 font-bold ${
                      active ? 'bg-teal-50 text-brand' : 'hover:bg-slate-50'
                    }`}
                    href={item.href}
                    key={item.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2 border-t border-line pt-2">
                {user ? (
                  <>
                    <Link
                      className="flex items-center gap-2 rounded-xl px-4 py-3 font-bold hover:bg-slate-50"
                      href={user.role === 'ADMIN' ? '/admin' : '/mypage'}
                      onClick={() => setMobileOpen(false)}
                    >
                      <UserRound size={16} />
                      {user.name ?? user.loginId} ({user.role === 'ADMIN' ? '관리자' : '내 계정'})
                    </Link>
                    <button
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-3 font-bold text-red-600 hover:bg-red-50"
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                      type="button"
                    >
                      <LogOut size={16} />
                      로그아웃
                    </button>
                  </>
                ) : (
                  <Link
                    className="flex items-center gap-2 rounded-xl bg-brand px-4 py-3 font-black text-white"
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogIn size={16} />
                    로그인 / 회원가입
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* 페이지 콘텐츠 */}
      <main className="mx-auto w-full max-w-[1800px] min-w-0 px-3 py-4 sm:px-4 sm:py-6 md:px-6">
        {children}
      </main>

      {/* 푸터 */}
      <footer className="mt-12 border-t border-line bg-slate-50 py-8">
        <div className="mx-auto w-full max-w-[1800px] px-3 sm:px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white text-sm font-black">
                  JHS
                </div>
                <span className="font-black">JHS Computer</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                정효성 TV 공식 PC 조립 서비스<br />
                컴퓨터를 몰라도 주문할 수 있는 PC 쇼핑몰
              </p>
            </div>
            <div>
              <h4 className="text-sm font-black">서비스</h4>
              <div className="mt-2 grid gap-1">
                {[
                  { href: '/quote', label: 'PC 자동 견적' },
                  { href: '/parts', label: '부품 직접 선택' },
                  { href: '/recommendations', label: '추천 구성' },
                  { href: '/benchmarks', label: '게임 성능 비교' },
                ].map((link) => (
                  <Link className="text-xs text-slate-500 hover:text-brand" href={link.href} key={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-black">고객 지원</h4>
              <div className="mt-2 grid gap-1">
                <a href="https://pf.kakao.com/_QxnxdxdK" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-brand">
                  📞 카카오톡 1:1 실시간 문의하기
                </a>
                <p className="text-xs text-slate-500">⏰ 평일 10:00 ~ 18:00</p>
                <Link className="text-xs text-slate-500 hover:text-brand" href="/track">
                  주문 배송 조회
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-line pt-4 text-center text-xs text-slate-400">
            © 2025 JHS Computer. All rights reserved. · 정효성 TV PC 조립 서비스
          </div>
        </div>
      </footer>
    </div>
  );
}
