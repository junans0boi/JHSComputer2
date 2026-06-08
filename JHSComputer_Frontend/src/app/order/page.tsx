'use client';

import { PackageCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { QuoteSummary } from '@/components/QuoteSummary';
import { defaultInput, generateQuote } from '@/lib/v1-estimator';
import { createOrderFromQuote, loadLatestQuote, saveQuote } from '@/lib/v1-storage';
import type { Quote } from '@/lib/v1-types';

const initialDelivery = {
  recipientName: '',
  recipientPhone: '',
  postalCode: '',
  address1: '',
  address2: '',
  deliveryMemo: '',
};

export default function OrderPage() {
  const router = useRouter();
  const [quote, setQuote] = useState<Quote>();
  const [delivery, setDelivery] = useState(initialDelivery);

  useEffect(() => {
    const latestQuote = loadLatestQuote();
    if (latestQuote) {
      setQuote(latestQuote);
      return;
    }
    const fallbackQuote = generateQuote(defaultInput);
    saveQuote(fallbackQuote);
    setQuote(fallbackQuote);
  }, []);

  const canSubmit = delivery.recipientName && delivery.recipientPhone && delivery.postalCode && delivery.address1;

  const handleSubmit = () => {
    if (!quote || !canSubmit) return;
    const order = createOrderFromQuote(quote, delivery);
    router.push(`/track?orderNo=${encodeURIComponent(order.orderNo)}`);
  };

  return (
    <AppShell>
      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-line bg-white p-4 shadow-soft md:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <h2 className="text-xl font-black">주문 정보</h2>
              <p className="mt-1 text-sm text-slate-600">현재 v1은 계좌이체/관리자 검토 기준으로 주문을 접수합니다.</p>
            </div>
            <PackageCheck className="text-brand" />
          </div>

          <div className="mt-5 grid gap-4">
            <Input label="받는 분" value={delivery.recipientName} onChange={(recipientName) => setDelivery({ ...delivery, recipientName })} />
            <Input label="연락처" value={delivery.recipientPhone} onChange={(recipientPhone) => setDelivery({ ...delivery, recipientPhone })} />
            <div className="grid gap-3 md:grid-cols-[0.45fr_1fr]">
              <Input label="우편번호" value={delivery.postalCode} onChange={(postalCode) => setDelivery({ ...delivery, postalCode })} />
              <Input label="주소" value={delivery.address1} onChange={(address1) => setDelivery({ ...delivery, address1 })} />
            </div>
            <Input label="상세주소" value={delivery.address2} onChange={(address2) => setDelivery({ ...delivery, address2 })} />
            <label className="grid gap-2">
              <span className="text-sm font-black">배송 메모</span>
              <textarea
                className="min-h-24 rounded-xl border border-line bg-white px-3 py-3 outline-none transition focus:border-brand"
                onChange={(event) => setDelivery({ ...delivery, deliveryMemo: event.target.value })}
                placeholder="예: 부재 시 문 앞에 놓아주세요."
                value={delivery.deliveryMemo}
              />
            </label>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <strong>입금 안내</strong>
              <p className="mt-1">주문 접수 후 운영자가 가격/재고를 확인하고 입금 안내를 확정합니다.</p>
            </div>

            <button
              className={`h-12 rounded-xl px-4 font-black text-white transition ${
                canSubmit ? 'bg-brand hover:bg-ink' : 'cursor-not-allowed bg-slate-300'
              }`}
              disabled={!canSubmit}
              onClick={handleSubmit}
              type="button"
            >
              주문 접수하기
            </button>

            <Link className="text-center text-sm font-bold text-brand" href="/quote">
              견적 다시 수정하기
            </Link>
          </div>
        </div>

        <div>{quote && <QuoteSummary compact quote={quote} />}</div>
      </section>
    </AppShell>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black">{label}</span>
      <input
        className="h-12 rounded-xl border border-line bg-white px-3 outline-none transition focus:border-brand"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}
