'use client';

import { Search, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { StatusBadge } from '@/components/ui/Badge';
import { Button, LinkButton } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FormField, TextInput } from '@/components/ui/FormField';
import { IconTitle, PanelCard } from '@/components/ui/PanelCard';
import { getCjTrackingUrl, getTrackingCompanyLabel } from '@/lib/delivery-tracking';
import { bankTransferInfo } from '@/lib/payment-config';
import { loadOrders, orderFlow, statusLabels } from '@/lib/v1-storage';
import type { Order } from '@/lib/v1-types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

type ServerTrackOrder = {
  id: string;
  orderNo: string;
  status: string;
  recipientName: string;
  address1: string;
  address2?: string | null;
  totalPrice: number;
  trackingCompany?: string | null;
  trackingNo?: string | null;
};

export default function TrackPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [keyword, setKeyword] = useState('');
  const [serverOrder, setServerOrder] = useState<ServerTrackOrder | null>(null);

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

  useEffect(() => {
    const orderNo = keyword.trim();
    if (!orderNo) {
      setServerOrder(null);
      return;
    }
    let cancelled = false;
    fetch(`${apiBaseUrl}/orders/track/${encodeURIComponent(orderNo)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (!cancelled) setServerOrder(data); })
      .catch(() => { if (!cancelled) setServerOrder(null); });
    return () => { cancelled = true; };
  }, [keyword]);

  const currentStatus = (serverOrder?.status ?? selectedOrder?.status) as Order['status'] | undefined;
  const currentStep = currentStatus ? orderFlow.indexOf(currentStatus) : -1;
  const trackingCompany = serverOrder?.trackingCompany ?? selectedOrder?.trackingCompany;
  const trackingNo = serverOrder?.trackingNo ?? selectedOrder?.trackingNo;
  const totalPrice = serverOrder?.totalPrice ?? selectedOrder?.quote.total ?? 0;
  const address = serverOrder ? `${serverOrder.address1} ${serverOrder.address2 ?? ''}` : selectedOrder ? `${selectedOrder.address1} ${selectedOrder.address2}` : '';

  return (
    <AppShell>
      <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <PanelCard>
          <IconTitle
            description="주문번호로 접수부터 배송 완료까지 확인합니다."
            icon={<Truck />}
            title="주문·배송 조회"
          />

          <FormField className="mt-5" label="주문번호">
            <div className="flex gap-2">
              <TextInput
                className="h-12 flex-1"
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="JHS-..."
                value={keyword}
              />
              <Button className="h-12 w-12 px-0" type="button" variant="dark">
                <Search size={18} />
              </Button>
            </div>
          </FormField>

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
            <div className="mt-5">
              <EmptyState
                action={<LinkButton href="/quote">견적 만들기</LinkButton>}
                description="먼저 견적을 만들고 주문을 접수해보세요."
                title="아직 주문이 없습니다."
              />
            </div>
          )}
        </PanelCard>

        <PanelCard>
          {serverOrder || selectedOrder ? (
            <>
              <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-bold text-brand">{serverOrder?.orderNo ?? selectedOrder?.orderNo}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-black">{currentStatus ? statusLabels[currentStatus] ?? currentStatus : '조회 중'}</h2>
                    {currentStatus && <StatusBadge label={statusLabels[currentStatus] ?? currentStatus} status={currentStatus} />}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {address}
                  </p>
                </div>
                <div className="rounded-xl bg-panel px-4 py-3 text-sm">
                  <div className="text-slate-500">총 결제 예정금액</div>
                  <div className="text-xl font-black text-brand">{totalPrice.toLocaleString()}원</div>
                </div>
              </div>

              {currentStatus === 'WAITING_DEPOSIT' && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <h3 className="font-black text-amber-900">입금 안내</h3>
                  <div className="mt-3 grid gap-2 text-sm">
                    <PaymentLine label="입금금액" value={`${totalPrice.toLocaleString()}원`} />
                    <PaymentLine label="입금은행" value={selectedOrder?.paymentBankName ?? bankTransferInfo.bankName} />
                    <PaymentLine label="계좌번호" value={selectedOrder?.paymentAccountNo ?? bankTransferInfo.accountNo} />
                    <PaymentLine label="예금주" value={selectedOrder?.paymentAccountHolder ?? bankTransferInfo.accountHolder} />
                  </div>
                </div>
              )}

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

              {(trackingCompany || trackingNo) && (
                <div className="mt-5 rounded-xl border border-line bg-panel p-4">
                  <div className="text-sm text-slate-500">운송장</div>
                  <div className="mt-1 font-black">
                    {getTrackingCompanyLabel(trackingCompany)} · {trackingNo}
                  </div>
                  {trackingNo && (
                    <a
                      className="mt-3 inline-flex rounded-xl bg-ink px-4 py-2 text-sm font-black text-white hover:bg-brand"
                      href={getCjTrackingUrl(trackingNo)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      CJ대한통운 배송 현황 보기
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="grid min-h-80 place-items-center text-center text-slate-600">조회할 주문을 기다리는 중입니다.</div>
          )}
        </PanelCard>
      </section>
    </AppShell>
  );
}

function PaymentLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2">
      <span className="text-amber-900/70">{label}</span>
      <span className="text-right font-black text-slate-950">{value}</span>
    </div>
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
