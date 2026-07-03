'use client';

import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addQuoteToCart, saveQuote } from '@/lib/v1-storage';
import type { Quote } from '@/lib/v1-types';

export function QuoteOrderActions({ quote }: { quote: Quote }) {
  const router = useRouter();

  const orderNow = () => {
    saveQuote(quote);
    router.push('/order');
  };

  const addToCart = () => {
    addQuoteToCart(quote);
    router.push('/mypage/cart');
  };

  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
      <button className="h-12 flex-1 rounded-xl bg-brand px-4 font-black text-white hover:bg-ink" onClick={orderNow} type="button">
        이 견적으로 주문하기
      </button>
      <button
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 font-black hover:border-brand hover:text-brand"
        onClick={addToCart}
        type="button"
      >
        <ShoppingCart size={17} />
        장바구니 담기
      </button>
    </div>
  );
}
