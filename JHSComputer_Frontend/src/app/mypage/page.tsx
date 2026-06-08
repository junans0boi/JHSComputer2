'use client';

import { Gift, ShoppingCart, Truck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { loadCartQuotes, loadOrders } from '@/lib/v1-storage';
import type { CartQuote, Order } from '@/lib/v1-types';

const cards = [
  { href: '/mypage/cart', title: '장바구니', description: '담아둔 견적 목록과 주문 버튼', icon: ShoppingCart },
  { href: '/mypage/delivery', title: '배송 현황', description: '주문 진행 단계와 운송장 확인', icon: Truck },
  { href: '/mypage/points', title: '포인트 적립', description: '예상 적립 포인트와 사용 준비', icon: Gift },
];

export default function MyPage() {
  const [cartQuotes, setCartQuotes] = useState<CartQuote[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setCartQuotes(loadCartQuotes());
    setOrders(loadOrders());
  }, []);

  const pointTotal = useMemo(() => orders.reduce((sum, order) => sum + Math.floor(order.quote.total * 0.01), 0), [orders]);

  return (
    <AppShell>
      <section className="grid gap-5">
        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <h2 className="text-2xl font-black">마이페이지</h2>
          <p className="mt-1 text-sm text-slate-600">견적 장바구니, 배송 현황, 포인트 적립을 모아 봅니다.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Metric label="장바구니 견적" value={`${cartQuotes.length}개`} />
            <Metric label="주문" value={`${orders.length}건`} />
            <Metric label="적립 예정 포인트" value={`${pointTotal.toLocaleString()}P`} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link className="rounded-2xl border border-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand" href={card.href} key={card.href}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-brand">
                  <Icon />
                </div>
                <h3 className="mt-4 text-lg font-black">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{card.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-brand">{value}</div>
    </div>
  );
}
