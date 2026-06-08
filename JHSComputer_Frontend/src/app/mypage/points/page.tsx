'use client';

import { Gift } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { loadOrders, statusLabels } from '@/lib/v1-storage';
import type { Order } from '@/lib/v1-types';

export default function PointsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const pointRows = useMemo(
    () =>
      orders.map((order) => ({
        orderNo: order.orderNo,
        status: order.status,
        amount: order.quote.total,
        points: Math.floor(order.quote.total * 0.01),
      })),
    [orders],
  );
  const totalPoints = pointRows.reduce((sum, row) => sum + row.points, 0);

  return (
    <AppShell>
      <section className="grid gap-5">
        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-accent">
              <Gift />
            </div>
            <div>
              <h2 className="text-2xl font-black">포인트 적립</h2>
              <p className="mt-1 text-sm text-slate-600">v1 정책은 주문 금액의 1%를 적립 예정 포인트로 계산합니다.</p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-ink p-5 text-white">
            <div className="text-sm text-slate-300">총 적립 예정</div>
            <div className="mt-1 text-4xl font-black text-teal-200">{totalPoints.toLocaleString()}P</div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <h3 className="font-black">주문별 적립 내역</h3>
          <div className="mt-4 overflow-hidden rounded-xl border border-line">
            {pointRows.map((row) => (
              <div className="grid grid-cols-[1fr_auto] gap-3 border-t border-line p-4 first:border-t-0 md:grid-cols-[1fr_140px_140px_auto]" key={row.orderNo}>
                <strong>{row.orderNo}</strong>
                <span className="text-sm text-slate-500">{statusLabels[row.status]}</span>
                <span className="text-sm font-bold">{row.amount.toLocaleString()}원</span>
                <span className="font-black text-brand">{row.points.toLocaleString()}P</span>
              </div>
            ))}
            {!pointRows.length && (
              <div className="p-8 text-center text-sm text-slate-600">
                아직 적립 내역이 없습니다.
                <Link className="mt-3 block font-black text-brand" href="/mypage/cart">
                  장바구니에서 주문하기
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
