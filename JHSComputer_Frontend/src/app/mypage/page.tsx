'use client';

import { ChevronRight, FileText, Gift, Package, ShoppingCart, Truck, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { PanelCard } from '@/components/ui/PanelCard';
import { getSession, type LoginUser } from '@/lib/auth-client';
import { loadCartQuotes, loadOrders, statusLabels } from '@/lib/v1-storage';
import type { CartQuote, Order } from '@/lib/v1-types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

const cards = [
  { href: '/mypage/cart', title: '장바구니', description: '담아둔 견적을 주문으로 연결', icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
  { href: '/mypage/delivery', title: '주문·배송 현황', description: '주문 진행 단계와 운송장 확인', icon: Truck, color: 'bg-teal-50 text-teal-600' },
  { href: '/mypage/points', title: '포인트 적립', description: '예상 적립 포인트 조회', icon: Gift, color: 'bg-amber-50 text-amber-600' },
];

type ServerQuote = {
  id: string;
  purpose: string | null;
  budgetAmount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  snapshotJson?: { title?: string; parts?: Array<{ name: string; category: string }> } | null;
};

type ServerOrder = {
  id: string;
  orderNo: string;
  status: string;
  recipientName: string;
  totalPrice: number;
  createdAt: string;
  trackingCompany?: string | null;
  trackingNo?: string | null;
};

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<LoginUser | null>(null);
  const [cartQuotes, setCartQuotes] = useState<CartQuote[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [serverQuotes, setServerQuotes] = useState<ServerQuote[]>([]);
  const [serverOrders, setServerOrders] = useState<ServerOrder[]>([]);

  useEffect(() => {
    const session = getSession();
    setUser(session?.user ?? null);
    setCartQuotes(loadCartQuotes());
    setOrders(loadOrders());

    if (session?.accessToken) {
      fetch(`${apiBaseUrl}/quotes/my`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data?.items) setServerQuotes(data.items); })
        .catch(() => {});
      fetch(`${apiBaseUrl}/orders?userId=${encodeURIComponent(session.user.id)}&page=1&limit=20`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data?.items) setServerOrders(data.items); })
        .catch(() => {});
    }
  }, []);

  const pointTotal = useMemo(() => orders.reduce((sum, order) => sum + Math.floor(order.quote.total * 0.01), 0), [orders]);
  const activeOrders = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const activeServerOrders = serverOrders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const activeOrderCount = activeOrders.length + activeServerOrders.length;

  return (
    <AppShell>
      <div className="grid gap-5">
        {/* 프로필 카드 */}
        <PanelCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-brand">
              <UserRound size={28} />
            </div>
            <div>
              {user ? (
                <>
                  <h2 className="text-xl font-black">{user.name ?? user.loginId}님</h2>
                  <p className="text-sm text-slate-500">{user.email ?? user.loginId}</p>
                  {user.role === 'ADMIN' && (
                    <Badge className="mt-1 px-2 py-0.5" tone="amber">관리자</Badge>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-xl font-black">게스트로 이용 중</h2>
                  <p className="text-sm text-slate-500">로그인하면 주문 내역을 서버에 저장할 수 있어요</p>
                  <Link className="mt-2 inline-block rounded-full bg-brand px-3 py-1 text-xs font-black text-white" href="/login">
                    로그인하기
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="장바구니 견적" value={`${cartQuotes.length}개`} />
            <Metric label="진행 중 주문" value={`${activeOrderCount}건`} />
            <Metric label="적립 예정 포인트" value={`${pointTotal.toLocaleString()}P`} />
          </div>
        </PanelCard>

        {(activeServerOrders.length > 0 || activeOrders.length > 0) && (
          <PanelCard className="border-brand/20 bg-gradient-to-br from-teal-50 to-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-brand" />
                <h3 className="font-black">진행 중인 주문 단계 요약</h3>
              </div>
              <Link className="text-sm font-black text-brand hover:underline" href="/mypage/delivery">
                전체 보기
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {activeServerOrders.slice(0, 2).map((order) => (
                <ActiveOrderCard
                  key={`server-${order.id}`}
                  orderNo={order.orderNo}
                  status={order.status}
                  total={Number(order.totalPrice)}
                  onTrack={() => router.push(`/track?orderNo=${encodeURIComponent(order.orderNo)}`)}
                />
              ))}
              {activeOrders.slice(0, 2).map((order) => (
                <ActiveOrderCard
                  key={`local-${order.id}`}
                  orderNo={order.orderNo}
                  status={order.status}
                  total={order.quote.total}
                  onTrack={() => router.push(`/track?orderNo=${encodeURIComponent(order.orderNo)}`)}
                />
              ))}
            </div>
          </PanelCard>
        )}

        {/* 메뉴 카드 */}
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                className="flex items-center justify-between rounded-2xl border border-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_20px_60px_rgba(15,118,110,0.12)]"
                href={card.href}
                key={card.href}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-black">{card.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{card.description}</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-400" size={18} />
              </Link>
            );
          })}
        </div>

        {/* 최근 주문 */}
        {orders.length > 0 && (
          <PanelCard>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-brand" />
                <h3 className="font-black">최근 주문</h3>
              </div>
              <Link className="text-sm font-black text-brand hover:underline" href="/mypage/delivery">
                전체 보기
              </Link>
            </div>
            <div className="mt-4 grid gap-2">
              {orders.slice(0, 3).map((order) => (
                <div
                  className="flex items-center justify-between rounded-xl border border-line p-3"
                  key={order.id}
                >
                  <div>
                    <div className="font-black text-sm">{order.orderNo}</div>
                    <div className="text-xs text-slate-500">{order.recipientName} · {order.quote.total.toLocaleString()}원</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge label={statusLabels[order.status]} status={order.status} />
                    <button
                      className="text-xs font-bold text-slate-500 hover:text-brand"
                      onClick={() => router.push(`/track?orderNo=${encodeURIComponent(order.orderNo)}`)}
                      type="button"
                    >
                      추적 →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>
        )}

        {serverQuotes.length > 0 && (
          <PanelCard>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-brand" />
                <h3 className="font-black">서버에 저장된 내 견적</h3>
              </div>
              <Link className="text-sm font-black text-brand hover:underline" href="/quote">
                새 견적
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {serverQuotes.slice(0, 4).map((quote) => (
                <article className="rounded-2xl border border-line bg-slate-50 p-4" key={quote.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-brand">{quote.status}</p>
                      <h4 className="mt-1 font-black">{quote.snapshotJson?.title ?? `${quote.purpose ?? 'PC'} 견적`}</h4>
                    </div>
                    <Badge className="bg-white" tone="slate">
                      {new Date(quote.createdAt).toLocaleDateString('ko-KR')}
                    </Badge>
                  </div>
                  <p className="mt-3 text-2xl font-black text-slate-950">{Number(quote.totalPrice).toLocaleString()}원</p>
                  <p className="part-spec mt-2 text-sm text-slate-500">
                    {(quote.snapshotJson?.parts ?? []).map((part) => part.category).join(' · ') || '구성 정보 확인 중'}
                  </p>
                </article>
              ))}
            </div>
          </PanelCard>
        )}

        {/* 빠른 액션 */}
        <PanelCard className="bg-gradient-to-br from-teal-50 to-white">
          <h3 className="font-black">빠른 이동</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { href: '/quote', label: '✨ 새 견적 받기' },
              { href: '/recommendations', label: '📋 추천 구성 보기' },
              { href: '/benchmarks', label: '🎮 게임 성능 비교' },
              { href: '/parts', label: '🔧 부품 직접 선택' },
            ].map((item) => (
              <Link
                className="rounded-xl border border-line bg-white px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand transition"
                href={item.href}
                key={item.href}
              >
              {item.label}
            </Link>
          ))}
          </div>
        </PanelCard>
      </div>
    </AppShell>
  );
}

function ActiveOrderCard({
  orderNo,
  status,
  total,
  onTrack,
}: {
  orderNo: string;
  status: string;
  total: number;
  onTrack: () => void;
}) {
  return (
    <button
      className="rounded-2xl border border-line bg-white p-4 text-left shadow-sm transition hover:border-brand"
      onClick={onTrack}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="safe-break text-sm font-black">{orderNo}</div>
          <div className="mt-1 text-xs text-slate-500">{total.toLocaleString()}원</div>
        </div>
        <StatusBadge label={statusLabels[status as Order['status']] ?? status} status={status} />
      </div>
      <p className="mt-3 text-sm font-bold text-slate-600">{orderStatusSummary(status)}</p>
    </button>
  );
}

function orderStatusSummary(status: string) {
  const summaries: Record<string, string> = {
    WAITING_DEPOSIT: '입금 대기 중입니다. 계좌와 금액을 확인해주세요.',
    DEPOSIT_CONFIRMED: '입금 확인 완료, 부품 수급 준비 중입니다.',
    PARTS_ORDERING: '부품을 공급처에 주문하고 있습니다.',
    PARTS_ARRIVED: '부품 입고 완료, 조립 대기 중입니다.',
    ASSEMBLING: 'PC 조립을 진행 중입니다.',
    TESTING: '출고 전 안정성 테스트 중입니다.',
    PREPARING_DELIVERY: '포장 및 출고 준비 중입니다.',
    SHIPPING: '배송 중입니다. 송장번호로 위치를 확인할 수 있습니다.',
  };
  return summaries[status] ?? '주문 상태가 업데이트되었습니다.';
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-slate-50 p-3 text-center">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-black text-brand">{value}</div>
    </div>
  );
}
