'use client';

import { ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { loadCartQuotes, removeCartQuote, setActiveQuote } from '@/lib/v1-storage';
import type { CartQuote } from '@/lib/v1-types';

export default function CartPage() {
  const router = useRouter();
  const [cartQuotes, setCartQuotes] = useState<CartQuote[]>([]);

  const refresh = () => setCartQuotes(loadCartQuotes());

  useEffect(() => {
    refresh();
  }, []);

  const handleOrder = (cartQuote: CartQuote) => {
    setActiveQuote(cartQuote.quote);
    router.push('/order');
  };

  const handleRemove = (id: string) => {
    removeCartQuote(id);
    refresh();
  };

  return (
    <AppShell>
      <section className="grid gap-5">
        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-black">장바구니</h2>
              <p className="mt-1 text-sm text-slate-600">자동 견적과 수동 견적을 저장해두고 원하는 견적으로 주문합니다.</p>
            </div>
            <Link className="rounded-xl bg-brand px-4 py-3 text-sm font-black text-white hover:bg-ink" href="/quote">
              견적 추가하기
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {cartQuotes.map((cartQuote) => (
            <article className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5" key={cartQuote.id}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-brand">{cartQuote.quote.mode === 'MANUAL' ? '수동 견적' : '자동 견적'}</span>
                    <span className="text-xs text-slate-500">{new Date(cartQuote.addedAt).toLocaleString('ko-KR')}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-black">{cartQuote.quote.title ?? cartQuote.quote.id}</h3>
                  <p className="mt-1 text-sm text-slate-600">{cartQuote.quote.parts.map((part) => part.category).join(' · ')}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">총 금액</div>
                  <div className="text-2xl font-black text-brand">{cartQuote.quote.total.toLocaleString()}원</div>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-line">
                {cartQuote.quote.parts.map((part) => (
                  <div className="grid grid-cols-[82px_1fr_auto] gap-3 border-t border-line px-3 py-3 text-sm first:border-t-0" key={`${cartQuote.id}-${part.category}`}>
                    <strong className="text-brand">{part.category}</strong>
                    <span className="line-clamp-1 font-bold">{part.name}</span>
                    <span>{part.price.toLocaleString()}원</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
                <button
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-4 font-black text-white hover:bg-ink"
                  onClick={() => handleOrder(cartQuote)}
                  type="button"
                >
                  이 견적으로 주문
                  <ShoppingCart size={18} />
                </button>
                <button
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line px-4 font-black text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleRemove(cartQuote.id)}
                  type="button"
                >
                  삭제
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {!cartQuotes.length && (
          <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center shadow-soft">
            <ShoppingCart className="mx-auto text-slate-300" size={42} />
            <h3 className="mt-4 text-lg font-black">담아둔 견적이 없습니다.</h3>
            <p className="mt-2 text-sm text-slate-600">자동 견적을 만들거나 카테고리별 부품에서 직접 담아보세요.</p>
            <Link className="mt-5 inline-flex rounded-xl bg-brand px-4 py-3 text-sm font-black text-white" href="/quote">
              견적 만들기
            </Link>
          </div>
        )}
      </section>
    </AppShell>
  );
}
