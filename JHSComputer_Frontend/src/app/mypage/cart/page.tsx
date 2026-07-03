'use client';

import { ShoppingCart, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button, LinkButton } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PanelCard, SectionHeader } from '@/components/ui/PanelCard';
import { QuotePartsRows } from '@/components/ui/PartsList';
import { deleteServerCartQuote, loadServerCartQuotes } from '@/lib/server-cart';
import { loadCartQuotes, removeCartQuote, setActiveQuote } from '@/lib/v1-storage';
import type { CartQuote } from '@/lib/v1-types';

export default function CartPage() {
  const router = useRouter();
  const [cartQuotes, setCartQuotes] = useState<CartQuote[]>([]);

  const refresh = async () => {
    const localQuotes = loadCartQuotes();
    const serverCart = await loadServerCartQuotes().catch(() => ({ items: [], total: 0 }));
    const serverQuotes: CartQuote[] = (serverCart.items ?? []).map((item: any) => ({
      id: `server-${item.cartQuoteId}`,
      quote: item.quote,
      addedAt: item.createdAt,
    }));
    const seen = new Set<string>();
    setCartQuotes([...serverQuotes, ...localQuotes].filter((item) => {
      const key = normalizeCartQuoteKey(item.quote.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }));
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleOrder = (cartQuote: CartQuote) => {
    setActiveQuote(cartQuote.quote);
    router.push('/order');
  };

  const handleRemove = async (id: string) => {
    if (id.startsWith('server-')) {
      await deleteServerCartQuote(id.replace('server-', '')).catch(() => false);
    } else {
      removeCartQuote(id);
    }
    await refresh();
  };

  return (
    <AppShell>
      <section className="grid gap-5">
        <PanelCard>
          <SectionHeader
            action={<LinkButton href="/quote">견적 추가하기</LinkButton>}
            description="자동 견적과 수동 견적을 저장해두고 원하는 견적으로 주문합니다."
            title="장바구니"
          />
        </PanelCard>

        <div className="grid gap-4">
          {cartQuotes.map((cartQuote) => (
            <PanelCard key={cartQuote.id}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge>{cartQuote.quote.mode === 'MANUAL' ? '수동 견적' : '자동 견적'}</Badge>
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

              <QuotePartsRows parts={cartQuote.quote.parts} rowKeyPrefix={cartQuote.id} />

              <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
                <Button
                  className="w-full"
                  onClick={() => handleOrder(cartQuote)}
                  type="button"
                >
                  이 견적으로 주문
                  <ShoppingCart size={18} />
                </Button>
                <Button
                  onClick={() => handleRemove(cartQuote.id)}
                  type="button"
                  variant="danger"
                >
                  삭제
                  <Trash2 size={18} />
                </Button>
              </div>
            </PanelCard>
          ))}
        </div>

        {!cartQuotes.length && (
          <EmptyState
            action={<LinkButton href="/quote">견적 만들기</LinkButton>}
            description="자동 견적을 만들거나 카테고리별 부품에서 직접 담아보세요."
            icon={<ShoppingCart size={42} />}
            title="담아둔 견적이 없습니다."
          />
        )}
      </section>
    </AppShell>
  );
}

function normalizeCartQuoteKey(quoteId: string) {
  return quoteId === 'Q-PARTS-ACTIVE' || quoteId.startsWith('Q-PARTS-') ? 'Q-PARTS-ACTIVE' : quoteId;
}
