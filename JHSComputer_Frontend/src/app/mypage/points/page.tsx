'use client';

import { Gift } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconTitle, PageStack, PanelCard } from '@/components/ui/PanelCard';
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
      <PageStack>
        <PanelCard>
          <IconTitle
            description="v1 정책은 주문 금액의 1%를 적립 예정 포인트로 계산합니다."
            icon={<Gift />}
            title="포인트 적립"
          />
          <div className="mt-5 rounded-2xl bg-ink p-5 text-white">
            <div className="text-sm text-slate-300">총 적립 예정</div>
            <div className="mt-1 text-4xl font-black text-teal-200">{totalPoints.toLocaleString()}P</div>
          </div>
        </PanelCard>

        <PanelCard>
          <h3 className="font-black">주문별 적립 내역</h3>
          {pointRows.length ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-line">
              {pointRows.map((row) => (
                <div className="grid gap-2 border-t border-line p-4 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_140px_140px_auto]" key={row.orderNo}>
                  <strong className="safe-break">{row.orderNo}</strong>
                  <StatusBadge label={statusLabels[row.status]} status={row.status} />
                  <span className="text-sm font-bold">{row.amount.toLocaleString()}원</span>
                  <span className="font-black text-brand">{row.points.toLocaleString()}P</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              action={<LinkButton href="/mypage/cart">장바구니에서 주문하기</LinkButton>}
              title="아직 적립 내역이 없습니다."
            />
          )}
        </PanelCard>
      </PageStack>
    </AppShell>
  );
}
