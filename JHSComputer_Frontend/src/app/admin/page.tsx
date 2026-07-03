'use client';

import { AlertCircle, Package, RefreshCcw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { RecommendationPostManager } from '@/components/admin/RecommendationPostManager';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/FormField';
import { PanelCard } from '@/components/ui/PanelCard';
import { getSession } from '@/lib/auth-client';
import { getCjTrackingUrl, getTrackingCompanyLabel } from '@/lib/delivery-tracking';
import { orderFlow, statusLabels } from '@/lib/v1-storage';
import type { OrderStatus } from '@/lib/v1-types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

type ServerOrder = {
  id: string;
  orderNo: string;
  status: string;
  recipientName: string;
  recipientPhone: string;
  address1: string;
  address2?: string;
  deliveryMemo?: string;
  trackingCompany?: string | null;
  trackingNo?: string | null;
  totalPrice: number;
  subtotalPartsPrice: number;
  assemblyFee: number;
  windowsFee: number;
  shippingFee: number;
  items: Array<{ categoryCode: string; partNameSnapshot: string; quantity: number; publicPrice: number }>;
  statusHistories: Array<{ toStatus: string; memo?: string; createdAt: string }>;
  createdAt: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [serverOrders, setServerOrders] = useState<ServerOrder[]>([]);
  const [selectedServerOrder, setSelectedServerOrder] = useState<ServerOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'orders' | 'recommendations'>('orders');
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const isAdmin = mounted && session?.user?.role === 'ADMIN';

  const fetchServerOrders = async (accessToken = session?.accessToken) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/orders?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setServerOrders(data.items ?? []);
        if (data.items?.length > 0) setSelectedServerOrder(data.items[0]);
      }
    } catch {
      // 서버 연결 실패 시 무시
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSession(getSession());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (session?.user?.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    void fetchServerOrders(session.accessToken);
  }, [mounted, session?.accessToken, session?.user?.role]);

  const handleServerStatusChange = async (orderId: string, status: string) => {
    if (!session?.accessToken) return;
    try {
      await fetch(`${apiBaseUrl}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ status }),
      });
      await fetchServerOrders();
    } catch {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleServerShippingUpdate = async (orderId: string, trackingNo: string) => {
    if (!session?.accessToken) return;
    try {
      await fetch(`${apiBaseUrl}/orders/${orderId}/shipping`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ trackingCompany: 'CJ', trackingNo }),
      });
      await fetchServerOrders();
    } catch {
      alert('운송장 등록에 실패했습니다.');
    }
  };

  if (!mounted) {
    return (
      <AppShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <ShieldCheck className="mx-auto animate-pulse text-slate-300" size={48} />
            <p className="mt-4 font-black text-slate-600">관리자 권한을 확인하는 중입니다.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-400" size={48} />
            <p className="mt-4 font-black text-slate-600">관리자 권한이 필요합니다.</p>
            <Link className="mt-4 inline-block rounded-xl bg-brand px-6 py-3 font-black text-white" href="/login">
              로그인
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid gap-5">
        {/* 헤더 */}
        <PanelCard className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black">관리자 대시보드</h2>
              <p className="text-sm text-slate-500">주문 관리 및 상태 변경</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => { void fetchServerOrders(); }}
              type="button"
              variant="outline"
            >
              <RefreshCcw size={15} />
              새로고침
            </Button>
          </div>
        </PanelCard>

        {/* 탭 전환 */}
        <div className="flex rounded-2xl border border-line bg-white p-1 shadow-soft w-fit">
          <button
            className={`rounded-xl px-5 py-2 text-sm font-black transition ${tab === 'orders' ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            onClick={() => setTab('orders')}
            type="button"
          >
            주문 ({serverOrders.length})
          </button>
          <button
            className={`rounded-xl px-5 py-2 text-sm font-black transition ${tab === 'recommendations' ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            onClick={() => setTab('recommendations')}
            type="button"
          >
            추천 게시글
          </button>
        </div>

        {tab === 'recommendations' ? (
          <RecommendationPostManager accessToken={session?.accessToken} />
        ) : (
          <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <PanelCard>
              {loading ? (
                <div className="flex h-32 items-center justify-center text-slate-500">로딩 중...</div>
              ) : serverOrders.length > 0 ? (
                <div className="grid gap-2">
                  {serverOrders.map((order) => (
                    <button
                      className={`rounded-xl border p-3 text-left transition ${
                        selectedServerOrder?.id === order.id ? 'border-brand bg-teal-50' : 'border-line hover:border-brand'
                      }`}
                      key={order.id}
                      onClick={() => setSelectedServerOrder(order)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-sm">{order.orderNo}</strong>
                        <StatusBadge label={statusLabels[order.status as OrderStatus] ?? order.status} status={order.status} />
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {order.recipientName} · {order.totalPrice.toLocaleString()}원
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center text-center text-slate-500">
                  <div>
                    <Package size={32} className="mx-auto text-slate-300" />
                    <p className="mt-2 text-sm">아직 DB에 저장된 주문이 없습니다.</p>
                  </div>
                </div>
              )}
            </PanelCard>
            <PanelCard>
              {selectedServerOrder ? (
                <div className="grid gap-4">
                  <div className="border-b border-line pb-4">
                    <p className="text-sm font-bold text-brand">{selectedServerOrder.orderNo}</p>
                    <h2 className="mt-1 text-xl font-black">{selectedServerOrder.recipientName}님 주문</h2>
                    <p className="text-sm text-slate-500">{selectedServerOrder.recipientPhone} · {selectedServerOrder.address1}</p>
                  </div>

                  <div className="grid gap-2 rounded-xl bg-slate-50 p-3 text-sm sm:grid-cols-2">
                    <div>현재 상태</div>
                    <div className="text-right font-black text-brand">
                      {statusLabels[selectedServerOrder.status as OrderStatus] ?? selectedServerOrder.status}
                    </div>
                    <div>총 금액</div>
                    <div className="text-right font-black">{selectedServerOrder.totalPrice.toLocaleString()}원</div>
                    {selectedServerOrder.deliveryMemo && (
                      <>
                        <div>배송 메모</div>
                        <div className="text-right">{selectedServerOrder.deliveryMemo}</div>
                      </>
                    )}
                    {selectedServerOrder.trackingNo && (
                      <>
                        <div>운송장</div>
                        <div className="text-right font-black">
                          {getTrackingCompanyLabel(selectedServerOrder.trackingCompany)} · {selectedServerOrder.trackingNo}
                        </div>
                      </>
                    )}
                  </div>

                  <ShippingEditor
                    currentTrackingNo={selectedServerOrder.trackingNo ?? ''}
                    onSubmit={(trackingNo) => handleServerShippingUpdate(selectedServerOrder.id, trackingNo)}
                  />

                  <div>
                    <h3 className="font-black">상태 변경</h3>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {[...orderFlow, 'ON_HOLD', 'CANCELLED'].map((status) => (
                        <button
                          className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                            selectedServerOrder.status === status
                              ? 'border-brand bg-teal-50 text-brand'
                              : 'border-line hover:border-brand'
                          }`}
                          key={status}
                          onClick={() => handleServerStatusChange(selectedServerOrder.id, status)}
                          type="button"
                        >
                          {statusLabels[status as OrderStatus] ?? status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedServerOrder.items?.length > 0 && (
                    <div>
                      <h3 className="font-black">주문 부품</h3>
                      <div className="mt-2 overflow-hidden rounded-xl border border-line">
                        {selectedServerOrder.items.map((item, i) => (
                          <div className="flex flex-col gap-2 border-t border-line px-3 py-2.5 text-sm first:border-t-0 sm:flex-row sm:items-center sm:justify-between" key={i}>
                            <div className="min-w-0 safe-break">
                            <span className="font-black text-brand mr-2">{item.categoryCode}</span>
                            <span className="part-name text-sm">
                              {item.partNameSnapshot}
                            </span>
                            </div>
                            <div className="font-bold shrink-0">{item.publicPrice.toLocaleString()}원</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedServerOrder.statusHistories?.length > 0 && (
                    <div>
                      <h3 className="font-black">상태 이력</h3>
                      <div className="mt-2 grid gap-1.5">
                        {selectedServerOrder.statusHistories.map((h, i) => (
                          <div className="rounded-xl border border-line bg-slate-50 p-3 text-sm" key={i}>
                            <strong>{statusLabels[h.toStatus as OrderStatus] ?? h.toStatus}</strong>
                            {h.memo && <p className="mt-1 text-slate-500">{h.memo}</p>}
                            <p className="mt-1 text-xs text-slate-400">{new Date(h.createdAt).toLocaleString('ko-KR')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex min-h-64 items-center justify-center text-slate-500">주문을 선택하세요</div>
              )}
            </PanelCard>
          </section>
        )}
      </div>
    </AppShell>
  );
}

function ShippingEditor({
  currentTrackingNo,
  onSubmit,
}: {
  currentTrackingNo: string;
  onSubmit: (trackingNo: string) => void;
}) {
  const [trackingNo, setTrackingNo] = useState(currentTrackingNo);

  useEffect(() => {
    setTrackingNo(currentTrackingNo);
  }, [currentTrackingNo]);

  return (
    <div className="rounded-xl border border-line bg-white p-3">
      <h3 className="font-black">CJ대한통운 송장 등록</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
        <TextInput
          onChange={(event) => setTrackingNo(event.target.value)}
          placeholder="송장번호 숫자 입력"
          value={trackingNo}
        />
        <Button
          onClick={() => onSubmit(trackingNo)}
          type="button"
          variant="dark"
        >
          저장
        </Button>
      </div>
      {trackingNo && (
        <a
          className="mt-2 inline-flex text-xs font-black text-brand hover:underline"
          href={getCjTrackingUrl(trackingNo)}
          rel="noreferrer"
          target="_blank"
        >
          CJ 공식 배송현황 확인 →
        </a>
      )}
    </div>
  );
}
