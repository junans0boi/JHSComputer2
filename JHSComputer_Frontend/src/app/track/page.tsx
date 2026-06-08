'use client';

import { Search, Truck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { loadOrders, orderFlow, statusLabels } from '@/lib/v1-storage';
import type { Order } from '@/lib/v1-types';

export default function TrackPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const currentOrders = loadOrders();
    setOrders(currentOrders);
    const params = new URLSearchParams(window.location.search);
    setKeyword(params.get('orderNo') ?? currentOrders[0]?.orderNo ?? '');
  }, []);

  const selectedOrder = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return orders.find((order) => order.orderNo.toLowerCase() === normalizedKeyword) ?? orders[0];
  }, [keyword, orders]);

  const currentStep = selectedOrder ? orderFlow.indexOf(selectedOrder.status) : -1;

  return (
    <AppShell>
      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <h2 className="text-xl font-black">주문·배송 조회</h2>
              <p className="mt-1 text-sm text-slate-600">주문번호로 접수부터 배송 완료까지 확인합니다.</p>
            </div>
            <Truck className="text-brand" />
          </div>

          <label className="mt-5 grid gap-2">
            <span className="text-sm font-black">주문번호</span>
            <div className="flex gap-2">
              <input
                className="h-12 flex-1 rounded-xl border border-line bg-white px-3 outline-none transition focus:border-brand"
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="JHS-..."
                value={keyword}
              />
              <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white" type="button">
                <Search size={18} />
              </button>
            </div>
          </label>

          <div className="mt-5 grid gap-2">
            {orders.map((order) => (
              <button
                className={`rounded-xl border p-3 text-left transition ${
                  selectedOrder?.id === order.id ? 'border-brand bg-teal-50' : 'border-line bg-white hover:border-brand'
                }`}
                key={order.id}
                onClick={() => setKeyword(order.orderNo)}
                type="button"
              >
                <div className="font-black">{order.orderNo}</div>
                <div className="mt-1 text-sm text-slate-600">
                  {order.recipientName} · {statusLabels[order.status]}
                </div>
              </button>
            ))}
          </div>

          {!orders.length && (
            <div className="mt-5 rounded-xl border border-dashed border-line p-5 text-center text-sm text-slate-600">
              아직 주문이 없습니다. 먼저 견적을 만들고 주문을 접수해보세요.
              <Link className="mt-3 block font-black text-brand" href="/quote">
                견적 만들기
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          {selectedOrder ? (
            <>
              <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-bold text-brand">{selectedOrder.orderNo}</p>
                  <h2 className="mt-1 text-2xl font-black">{statusLabels[selectedOrder.status]}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedOrder.address1} {selectedOrder.address2}
                  </p>
                </div>
                <div className="rounded-xl bg-panel px-4 py-3 text-sm">
                  <div className="text-slate-500">총 결제 예정금액</div>
                  <div className="text-xl font-black text-brand">{selectedOrder.quote.total.toLocaleString()}원</div>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {orderFlow.map((status, index) => {
                  const done = index <= currentStep;
                  return (
                    <div className="flex gap-3" key={status}>
                      <div className={`mt-1 h-4 w-4 shrink-0 rounded-full ${done ? 'bg-brand' : 'bg-slate-200'}`} />
                      <div className={`rounded-xl border p-3 ${done ? 'border-teal-100 bg-teal-50' : 'border-line bg-panel'}`}>
                        <div className="font-black">{statusLabels[status]}</div>
                        <div className="mt-1 text-sm text-slate-600">{statusMessage(status)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {(selectedOrder.trackingCompany || selectedOrder.trackingNo) && (
                <div className="mt-5 rounded-xl border border-line bg-panel p-4">
                  <div className="text-sm text-slate-500">운송장</div>
                  <div className="mt-1 font-black">
                    {selectedOrder.trackingCompany} · {selectedOrder.trackingNo}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="grid min-h-80 place-items-center text-center text-slate-600">조회할 주문을 기다리는 중입니다.</div>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function statusMessage(status: string) {
  const messages: Record<string, string> = {
    ADMIN_REVIEW: '운영자가 가격, 재고, 호환성을 확인합니다.',
    WAITING_DEPOSIT: '확정 금액 안내 후 입금을 기다립니다.',
    DEPOSIT_CONFIRMED: '입금 확인이 완료되었습니다.',
    PARTS_ORDERING: '선택 부품을 공급처에 주문합니다.',
    PARTS_ARRIVED: '부품 입고가 완료되었습니다.',
    ASSEMBLING: 'PC 조립을 진행합니다.',
    TESTING: '부팅, 온도, 게임 안정성을 점검합니다.',
    PREPARING_DELIVERY: '포장과 출고 준비를 진행합니다.',
    SHIPPING: '택배사로 인계되었습니다.',
    DELIVERED: '배송이 완료되었습니다.',
  };
  return messages[status] ?? '상태가 업데이트되었습니다.';
}
