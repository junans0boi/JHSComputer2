'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`http://localhost:6002/api/quotes/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setQuote(data);
          setLoading(false);
        })
        .catch(() => {
          alert('견적을 불러오지 못했습니다.');
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return <div className="p-8 text-center">견적 정보를 불러오는 중...</div>;
  }

  if (!quote) {
    return <div className="p-8 text-center text-red-500">견적을 찾을 수 없습니다.</div>;
  }

  return (
    <main className="min-h-screen px-5 py-6 text-ink md:px-8 bg-gray-50">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 border-b border-line pb-5 md:flex-row md:items-end">
          <div>
            <h1 className="mt-1 text-2xl font-bold tracking-normal md:text-3xl">AI 맞춤 견적 결과</h1>
            <p className="text-sm font-semibold text-gray-500 mt-2">견적 번호: {quote.id}</p>
          </div>
          <button onClick={() => router.push('/')} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:border-brand hover:text-brand">처음으로</button>
        </header>

        <section className="bg-white rounded-lg border border-line p-5 shadow-sm">
          <h2 className="text-lg font-bold mb-4">구성 부품</h2>
          <div className="grid gap-3">
            {quote.items?.map((item: any) => (
              <div key={item.id} className="grid gap-3 p-3 border border-line rounded-md bg-panel sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-brand block mb-1">{item.partCategory?.categoryName}</span>
                  <span className="part-name text-sm">{item.part?.canonicalName}</span>
                </div>
                <div className="shrink-0 font-bold text-sm sm:text-right">
                  {item.currentPublicPrice.toLocaleString()}원
                </div>
              </div>
            ))}
            {(!quote.items || quote.items.length === 0) && (
              <div className="text-sm text-gray-500">부품이 없습니다.</div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-lg border border-line p-5 shadow-sm">
          <h2 className="text-lg font-bold mb-4">결제 예상 금액</h2>
          <div className="grid gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">부품 합계</span>
              <span className="font-semibold">{quote.subtotalPartsPrice.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">조립비</span>
              <span className="font-semibold">{quote.assemblyFee.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">배송비</span>
              <span className="font-semibold">{quote.shippingFee.toLocaleString()}원</span>
            </div>
            {quote.windowsFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">정품 윈도우</span>
                <span className="font-semibold">{quote.windowsFee.toLocaleString()}원</span>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
              <span className="font-bold text-lg">최종 예상가</span>
              <strong className="text-2xl text-brand">{quote.totalPrice.toLocaleString()}원</strong>
            </div>
          </div>

          <button
            className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-md bg-ink px-4 font-bold text-white transition hover:bg-brand text-lg"
            type="button"
            onClick={() => router.push(`/order/${quote.id}`)}
          >
            주문하기
            <ChevronRight size={20} />
          </button>
        </section>
      </div>
    </main>
  );
}
