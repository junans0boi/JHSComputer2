'use client';

import { CheckCircle, ChevronRight, MapPin, PackageCheck, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { DaumPostcodeButton } from '@/components/DaumPostcodeButton';
import { QuotePartsPanel, QuotePricePanel, QuoteSidePanel } from '@/components/QuoteSummary';
import { Button } from '@/components/ui/Button';
import { FormField, TextareaInput, TextInput } from '@/components/ui/FormField';
import { IconTitle, PanelCard } from '@/components/ui/PanelCard';
import { getSession } from '@/lib/auth-client';
import { bankTransferInfo, isBankTransferConfigured } from '@/lib/payment-config';
import { withDbPerformance } from '@/lib/server-performance';
import { defaultInput, generateQuote } from '@/lib/v1-estimator';
import { loadLatestQuote, saveQuote } from '@/lib/v1-storage';
import { applyWindowsOptionToQuote, getWindowsOptionMeta, normalizeWindowsOption, windowsOptions } from '@/lib/windows-options';
import type { Quote, WindowsOptionValue } from '@/lib/v1-types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

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
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const hydrateQuote = async () => {
      const latestQuote = loadLatestQuote();
      if (latestQuote) {
        const hydratedQuote = await withDbPerformance(normalizeQuoteWindows(latestQuote));
        saveQuote(hydratedQuote);
        setQuote(hydratedQuote);
        return;
      }
      const fallbackQuote = await withDbPerformance(generateQuote(defaultInput));
      saveQuote(fallbackQuote);
      setQuote(fallbackQuote);
    };
    void hydrateQuote();
  }, []);

  const canSubmit = delivery.recipientName && delivery.recipientPhone && delivery.postalCode && delivery.address1;
  const selectedWindows = normalizeWindowsOption(quote?.input.windows);

  const handleWindowsChange = (windows: WindowsOptionValue) => {
    if (!quote) return;
    const nextQuote = applyWindowsOptionToQuote(quote, windows);
    saveQuote(nextQuote);
    setQuote(nextQuote);
  };

  const handleSubmit = async () => {
    if (!quote || !canSubmit || submitting) return;
    setSubmitting(true);
    setSubmitMessage('');

    try {
      const session = getSession();
      if (!session?.accessToken) {
        setSubmitMessage('DB 주문 접수를 위해 로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      const categoryMap: Record<string, string> = {
        'CPU': 'CPU',
        '쿨러': 'CPU_COOLER',
        '메인보드': 'MAINBOARD',
        'RAM': 'RAM',
        '그래픽카드': 'GPU',
        'SSD': 'SSD',
        '파워': 'PSU',
        '케이스': 'CASE',
      };

      const orderNo = createOrderNo();
      const response = await fetch(`${apiBaseUrl}/orders/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          orderNo,
          userId: session.user.id,
          recipientName: delivery.recipientName,
          recipientPhone: delivery.recipientPhone,
          postalCode: delivery.postalCode,
          address1: delivery.address1,
          address2: delivery.address2 || null,
          deliveryMemo: delivery.deliveryMemo || null,
          subtotalPartsPrice: quote.subtotal,
          assemblyFee: quote.assemblyFee,
          windowsFee: quote.windowsFee,
          shippingFee: quote.shippingFee,
          totalPrice: quote.total,
          parts: quote.parts.map((part) => ({
            categoryCode: categoryMap[part.category] ?? part.category,
            partName: part.name,
            quantity: part.quantity ?? 1,
            price: Math.round(part.price / (part.quantity ?? 1)),
          })),
        }),
      });

      if (!response.ok) throw new Error('order-sync-failed');
      const result = await response.json();
      router.push(`/track?orderNo=${encodeURIComponent(result.orderNo ?? orderNo)}`);
    } catch {
      setSubmitMessage('DB 주문 접수에 실패했습니다. 서버 연결 또는 로그인 상태를 확인해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <section className="grid min-w-0 gap-5 xl:grid-cols-[25fr_50fr_25fr]">
        {/* 1열: 게임 성능 예상 + 호환성 체크 */}
        {quote ? <QuoteSidePanel compact quote={quote} /> : <div />}

        {/* 2열: 견적 (부품 표) */}
        {quote && <QuotePartsPanel quote={quote} />}

        {/* 3열: 주문 정보 + 결제 안내 + 가격 합계 + 버튼 */}
        <div className="grid content-start gap-5">
          <PanelCard>
            <IconTitle
              description="배송받을 주소와 연락처를 입력해주세요."
              icon={<PackageCheck size={20} />}
              title="주문 정보 입력"
            />

            <div className="mt-5 grid gap-4">
              <FormField icon={<User size={14} className="text-brand" />} label="받는 분">
                <TextInput
                  className="h-12 px-4"
                  onChange={(e) => setDelivery({ ...delivery, recipientName: e.target.value })}
                  placeholder="홍길동"
                  value={delivery.recipientName}
                />
              </FormField>

              <FormField icon={<Phone size={14} className="text-brand" />} label="연락처">
                <TextInput
                  className="h-12 px-4"
                  onChange={(e) => setDelivery({ ...delivery, recipientPhone: e.target.value })}
                  placeholder="010-0000-0000"
                  value={delivery.recipientPhone}
                />
              </FormField>

              <FormField icon={<MapPin size={14} className="text-brand" />} label="배송 주소">
                <div className="mt-1.5 grid gap-2 grid-cols-[1fr_auto]">
                  <TextInput
                    className="h-12 px-4"
                    onChange={(e) => setDelivery({ ...delivery, postalCode: e.target.value })}
                    placeholder="우편번호"
                    value={delivery.postalCode}
                  />
                  <DaumPostcodeButton onComplete={(address) => setDelivery((current) => ({ ...current, ...address }))} />
                </div>
                <TextInput
                  className="mt-2 h-12 px-4"
                  onChange={(e) => setDelivery({ ...delivery, address1: e.target.value })}
                  placeholder="도로명 주소"
                  value={delivery.address1}
                />
                <TextInput
                  className="mt-2 h-12 px-4"
                  onChange={(e) => setDelivery({ ...delivery, address2: e.target.value })}
                  placeholder="상세주소 (동/호수 등)"
                  value={delivery.address2}
                />
              </FormField>

              <FormField label="배송 메모">
                <TextareaInput
                  className="px-4"
                  onChange={(e) => setDelivery({ ...delivery, deliveryMemo: e.target.value })}
                  placeholder="예: 부재 시 문 앞에 놓아주세요."
                  value={delivery.deliveryMemo}
                />
              </FormField>
            </div>
          </PanelCard>

          {quote && (
            <PanelCard>
              <IconTitle
                description="필수 선택이 아닙니다. 주문 전 원하는 방식만 선택하세요."
                icon={<PackageCheck size={20} />}
                title="윈도우 선택"
              />
              <WindowsOptionPanel value={selectedWindows} onChange={handleWindowsChange} />
            </PanelCard>
          )}

          {/* 결제 안내 */}
          <PanelCard className="border-amber-200 bg-amber-50">
            <h3 className="font-black text-amber-900">💳 결제 안내</h3>
            <div className="mt-3 grid gap-2 text-sm text-amber-800">
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
                <span>주문 접수 즉시 입금 대기 상태가 되며, 아래 계좌로 총 결제 금액을 송금하면 됩니다.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
                <span>입금 확인 후 부품 수급 및 조립을 진행합니다. (평균 3~5일 소요)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
                <span>현재 계좌이체 방식으로 운영됩니다. 카카오페이·카드 결제는 준비 중입니다.</span>
              </div>
            </div>
            <div className="mt-4 grid gap-2 rounded-2xl border border-amber-200 bg-white/70 p-4 text-sm">
              <PaymentRow label="입금은행" value={bankTransferInfo.bankName} />
              <PaymentRow label="계좌번호" value={bankTransferInfo.accountNo} />
              <PaymentRow label="예금주" value={bankTransferInfo.accountHolder} />
              <PaymentRow label="입금금액" value={quote ? `${quote.total.toLocaleString()}원` : '견적 로딩 중'} strong />
              {!isBankTransferConfigured() && (
                <p className="mt-2 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">
                  운영 계좌는 `.env.local`의 `NEXT_PUBLIC_BANK_NAME`, `NEXT_PUBLIC_BANK_ACCOUNT_NO`, `NEXT_PUBLIC_BANK_ACCOUNT_HOLDER`에 설정해주세요.
                </p>
              )}
            </div>
          </PanelCard>

          {/* 가격 합계 */}
          {quote && <QuotePricePanel quote={quote} />}

          <Button
            className={`h-14 rounded-2xl px-4 text-lg font-black text-white transition ${
              canSubmit && !submitting
                ? 'bg-brand hover:bg-teal-900'
                : 'cursor-not-allowed bg-slate-300'
            }`}
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
            type="button"
            variant={canSubmit && !submitting ? 'primary' : 'disabled'}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                주문 접수 중...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                주문 접수하기
                <ChevronRight size={20} />
              </span>
            )}
          </Button>

          {submitMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-bold text-red-700">
              {submitMessage}
            </div>
          )}

          <Link className="text-center text-sm font-bold text-brand hover:underline" href="/quote">
            ← 견적 다시 수정하기
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

function normalizeQuoteWindows(quote: Quote) {
  return applyWindowsOptionToQuote(quote, normalizeWindowsOption(quote.input.windows));
}

function WindowsOptionPanel({
  value,
  onChange,
}: {
  value: WindowsOptionValue;
  onChange: (value: WindowsOptionValue) => void;
}) {
  return (
    <div className="mt-4 grid gap-2">
      {windowsOptions.map((option) => {
        const selected = value === option.value;
        return (
          <button
            className={`grid gap-1 rounded-xl border p-3 text-left transition ${
              selected ? 'border-brand bg-teal-50 text-brand shadow-sm' : 'border-line bg-white text-slate-700 hover:border-brand'
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <span className="flex items-start justify-between gap-3">
              <span className="flex min-w-0 items-start gap-2">
                <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${selected ? 'border-brand bg-brand' : 'border-slate-300 bg-white'}`}>
                  {selected && <CheckCircle size={12} className="text-white" />}
                </span>
                <span className="min-w-0">
                  <span className="safe-break block text-sm font-black">{option.label}</span>
                  <span className="safe-break mt-0.5 block text-xs font-bold text-slate-500">{option.description}</span>
                  {option.productUrl && (
                    <span className="mt-1 block text-[11px] font-bold text-slate-400">상품번호 {option.productNo}</span>
                  )}
                </span>
              </span>
              <span className="shrink-0 text-sm font-black">{option.price ? `+${option.price.toLocaleString()}원` : '0원'}</span>
            </span>
          </button>
        );
      })}
      <p className="text-xs font-bold text-slate-500">
        현재 선택: {getWindowsOptionMeta(value).label}
      </p>
    </div>
  );
}

function createOrderNo() {
  return `JHS-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${String(Date.now()).slice(-5)}`;
}

function PaymentRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-amber-900/70">{label}</span>
      <span className={`${strong ? 'text-lg text-brand' : 'text-slate-900'} text-right font-black`}>{value}</span>
    </div>
  );
}
