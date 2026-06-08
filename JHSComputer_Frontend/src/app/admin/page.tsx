'use client';

import { RefreshCcw, Settings, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { compuzoneCatalog } from '@/lib/compuzone-catalog';
import { getProductStatus } from '@/lib/common-codes';
import { getPartAttributes } from '@/lib/part-filters';
import { loadServerCatalog } from '@/lib/server-parts';
import { loadOrders, orderFlow, statusLabels, updateOrderStatus } from '@/lib/v1-storage';
import type { CatalogPart, Order, OrderStatus } from '@/lib/v1-types';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [specQueue, setSpecQueue] = useState<CatalogPart[]>(compuzoneCatalog);
  const [specSource, setSpecSource] = useState<'DB' | 'LOCAL'>('LOCAL');
  const selectedOrder = useMemo(() => orders.find((order) => order.id === selectedId) ?? orders[0], [orders, selectedId]);

  const refresh = () => {
    const nextOrders = loadOrders();
    setOrders(nextOrders);
    setSelectedId((currentId) => currentId ?? nextOrders[0]?.id);
  };

  useEffect(() => {
    refresh();
    loadServerCatalog()
      .then((items) => {
        if (!items.length) return;
        setSpecQueue(items);
        setSpecSource('DB');
      })
      .catch(() => setSpecSource('LOCAL'));
  }, []);

  const handleStatusChange = (status: OrderStatus) => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, status);
    refresh();
  };

  return (
    <AppShell>
      <section className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <h2 className="text-xl font-black">관리자 주문 목록</h2>
              <p className="mt-1 text-sm text-slate-600">접수된 주문을 확인하고 진행 상태를 변경합니다.</p>
            </div>
            <button className="rounded-xl border border-line p-3 text-slate-600 hover:border-brand hover:text-brand" onClick={refresh} type="button">
              <RefreshCcw size={18} />
            </button>
          </div>

          <div className="mt-5 grid gap-2">
            {orders.map((order) => (
              <button
                className={`rounded-xl border p-3 text-left transition ${
                  selectedOrder?.id === order.id ? 'border-brand bg-teal-50' : 'border-line bg-white hover:border-brand'
                }`}
                key={order.id}
                onClick={() => setSelectedId(order.id)}
                type="button"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong>{order.orderNo}</strong>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-brand">{statusLabels[order.status]}</span>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {order.recipientName} · {order.quote.input.games.join(', ')} · {order.quote.total.toLocaleString()}원
                </div>
              </button>
            ))}
          </div>

          {!orders.length && (
            <div className="mt-5 rounded-xl border border-dashed border-line p-5 text-center text-sm text-slate-600">
              아직 관리할 주문이 없습니다.
              <Link className="mt-3 block font-black text-brand" href="/order">
                테스트 주문 만들기
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
                  <h2 className="mt-1 text-2xl font-black">{selectedOrder.recipientName}님 주문</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedOrder.recipientPhone} · {selectedOrder.address1} {selectedOrder.address2}
                  </p>
                </div>
                <Settings className="text-brand" />
              </div>

              <div className="mt-5 grid gap-5">
                <div className="grid gap-2 rounded-xl border border-line bg-panel p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">현재 상태</span>
                    <strong>{statusLabels[selectedOrder.status]}</strong>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">주문 금액</span>
                    <strong>{selectedOrder.quote.total.toLocaleString()}원</strong>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">배송 메모</span>
                    <strong>{selectedOrder.deliveryMemo || '없음'}</strong>
                  </div>
                </div>

                <div>
                  <h3 className="font-black">상태 변경</h3>
                  <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
                    {[...orderFlow, 'ON_HOLD', 'CANCELLED'].map((status) => (
                      <button
                        className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                          selectedOrder.status === status ? 'border-brand bg-teal-50 text-brand' : 'border-line bg-white hover:border-brand'
                        }`}
                        key={status}
                        onClick={() => handleStatusChange(status as OrderStatus)}
                        type="button"
                      >
                        {statusLabels[status as OrderStatus]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-black">주문 부품</h3>
                  <div className="mt-3 overflow-hidden rounded-xl border border-line">
                    {selectedOrder.quote.parts.map((part) => (
                      <div className="grid grid-cols-[80px_1fr_auto] gap-3 border-t border-line px-3 py-3 first:border-t-0" key={part.category}>
                        <div className="font-black text-brand">{part.category}</div>
                        <div>
                          <div className="font-bold">{part.name}</div>
                          <div className="text-xs text-slate-500">{part.memo}</div>
                        </div>
                        <div className="font-bold">{part.price.toLocaleString()}원</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-black">상태 이력</h3>
                  <div className="mt-3 grid gap-2">
                    {selectedOrder.histories.map((history) => (
                      <div className="rounded-xl border border-line bg-panel p-3 text-sm" key={`${history.status}-${history.at}`}>
                        <strong>{statusLabels[history.status]}</strong>
                        <p className="mt-1 text-slate-600">{history.message}</p>
                        <p className="mt-1 text-xs text-slate-400">{new Date(history.at).toLocaleString('ko-KR')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="grid min-h-96 place-items-center text-center text-slate-600">주문을 선택하면 상세 관리 화면이 열립니다.</div>
          )}
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-brand" />
            <div>
              <h2 className="text-xl font-black">스펙 검수 큐</h2>
              <p className="mt-1 text-sm text-slate-600">
                {specSource === 'DB' ? 'DB 적재 상품의 소켓/메모리/길이/높이 값을 검수합니다.' : '샘플 카탈로그의 소켓/메모리/길이/높이 값을 검수합니다.'}
              </p>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-line">
            {specQueue.slice(0, 8).map((part) => {
              const attrs = getPartAttributes(part);
              const status = getProductStatus(part);
              return (
                <div className="grid gap-3 border-t border-line p-3 first:border-t-0 md:grid-cols-[100px_1fr_160px]" key={part.id}>
                  <strong className="text-brand">{part.category}</strong>
                  <div>
                    <div className="line-clamp-1 font-bold">{part.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1 text-xs text-slate-500">
                      {[...attrs.sockets, ...attrs.memoryTypes, ...attrs.formFactors, attrs.wattage ? `${attrs.wattage}W` : undefined, attrs.maxGpuLengthMm ? `VGA ${attrs.maxGpuLengthMm}mm` : undefined]
                        .filter(Boolean)
                        .map((item) => (
                          <span className="rounded-full bg-panel px-2 py-1" key={item}>
                            {item}
                          </span>
                        ))}
                    </div>
                  </div>
                  <span className="text-sm font-black text-slate-600">{status.nameKo}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <h2 className="text-xl font-black">공통코드 운영 메모</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            `common_codes`는 상품 상태, 추천 배지, CPU 소켓, RAM 규격, 호환성 상태처럼 화면과 DB가 공유해야 하는 값을 관리합니다.
            서버 API는 `/api/common-codes`, `/api/common-codes/:group` 형태로 준비했습니다.
          </p>
          <div className="mt-4 grid gap-2 text-sm">
            <CodeRow label="productStatus" value="구매가능 · 재고부족 · 품절 · 관리자 확인 필요" />
            <CodeRow label="badge" value="가성비 · 게임 추천 · 저소음 · 화이트 감성 · 재고안정" />
            <CodeRow label="CPUSocket" value="AM3 · AM4 · AM5 · LGA1155 · LGA1700 · LGA1800" />
            <CodeRow label="RAMSocket" value="DDR3 · DDR4 · DDR5" />
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function CodeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-3">
      <div className="font-black text-brand">{label}</div>
      <div className="mt-1 text-slate-600">{value}</div>
    </div>
  );
}
