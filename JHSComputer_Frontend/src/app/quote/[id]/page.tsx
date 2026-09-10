'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getSession } from '@/lib/auth-client';
import { BenchmarkScoreComparisonLoader } from '@/components/benchmarks/BenchmarkScoreComparisonLoader';
import { QuotePartList } from '@/components/ui/QuotePartList';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const session = getSession();
      fetch(`${apiBaseUrl}/quotes/${params.id}`, {
        headers: session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {},
      })
        .then((res) => {
          if (!res.ok) throw new Error('quote-load-failed');
          return res.json();
        })
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

  const quoteParts = (quote.items ?? []).map((item: any) => {
    const snapshotPart = quote.snapshotJson?.parts?.find((part: any) => part.offerId === item.supplierOfferId);
    return {
      id: String(item.id),
      category: item.category?.name ?? item.partCategory?.categoryName ?? '부품',
      name: item.part?.canonicalName ?? item.supplierOffer?.offerName ?? '부품 정보 확인 필요',
      productNo: snapshotPart?.productNo,
      price: item.currentPublicPrice,
      quantity: item.quantity ?? 1,
      supplier: snapshotPart?.supplier,
      metadata: [
        item.supplierOfferId ? `판매 단위 ${item.supplierOfferId}` : undefined,
        snapshotPart?.stockStatus,
        snapshotPart?.priceCheckedAt ? `${new Date(snapshotPart.priceCheckedAt).toLocaleString('ko-KR')} 가격 확인` : undefined,
        snapshotPart?.productNo ? `상품번호 ${snapshotPart.productNo}` : undefined,
      ].filter(Boolean).join(' · '),
    };
  });
  const componentPartIds = (quote.items ?? []).reduce((result: { cpu: string[]; gpu: string[] }, item: any) => {
    const categoryCode = String(item.category?.code ?? item.partCategory?.code ?? '').toUpperCase();
    const categoryName = String(item.category?.name ?? item.partCategory?.categoryName ?? '');
    const partId = item.partId == null ? '' : String(item.partId);
    if (!partId) return result;
    if (categoryCode === 'CPU' || categoryName === 'CPU') result.cpu.push(partId);
    if (categoryCode === 'GPU' || categoryName === '그래픽카드') result.gpu.push(partId);
    return result;
  }, { cpu: [], gpu: [] });

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
          {quoteParts.length > 0 ? <QuotePartList parts={quoteParts} /> : (
              <div className="text-sm text-gray-500">부품이 없습니다.</div>
            )}
        </section>

        <section className="grid min-w-0 gap-5 bg-white rounded-lg border border-line p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-bold">부품 성능 비교</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-gray-500">같은 테스트·버전·지표의 출처 보고값만 CPU와 GPU별로 비교합니다.</p>
          </div>
          {componentPartIds.cpu.length > 0 ? (
            <BenchmarkScoreComparisonLoader partIds={componentPartIds.cpu} title="견적 CPU 벤치마크 비교" />
          ) : (
            <div className="rounded-xl border border-dashed border-line bg-gray-50 p-4 text-sm font-semibold text-gray-500">이 저장 견적에는 비교할 CPU 표준 부품 ID가 없습니다.</div>
          )}
          {componentPartIds.gpu.length > 0 ? (
            <BenchmarkScoreComparisonLoader partIds={componentPartIds.gpu} title="견적 GPU 벤치마크 비교" />
          ) : (
            <div className="rounded-xl border border-dashed border-line bg-gray-50 p-4 text-sm font-semibold text-gray-500">이 저장 견적에는 비교할 GPU 표준 부품 ID가 없습니다.</div>
          )}
        </section>

        {quote.snapshotJson?.preview && (
          <section className="bg-white rounded-lg border border-line p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-3">후보 검증 근거</h2>
            <div className="grid gap-2 text-sm font-semibold text-gray-700">
              <p>후보: {quote.snapshotJson.preview.candidateId} · {quote.snapshotJson.preview.strategy}</p>
              <p>규칙 버전: {quote.snapshotJson.preview.rulesetVersion ?? '확인 필요'}</p>
              <p>성능 근거: {quote.snapshotJson.preview.performanceEvidence?.evidenceType ?? 'NONE'} · 신뢰도 {quote.snapshotJson.preview.performanceEvidence?.confidence ?? 'NONE'} · 표본 {quote.snapshotJson.preview.performanceEvidence?.sampleCount ?? 0}회</p>
              <p>{quote.snapshotJson.preview.performanceEvidence?.note ?? '성능 근거 메모가 없습니다.'}</p>
            </div>
          </section>
        )}

        {Array.isArray(quote.snapshotJson?.performance) && quote.snapshotJson.performance.length > 0 && (
          <section className="bg-white rounded-lg border border-line p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-3">게임별 성능 근거</h2>
            <div className="grid gap-2 text-sm font-semibold text-gray-700">
              {quote.snapshotJson.performance.map((item: { game?: string; resolution?: string; fpsMin?: number; fpsMax?: number; evidenceType?: string; confidence?: string }) => <p key={`${item.game}-${item.resolution}`}>{item.game} · {item.resolution} · {item.fpsMin}~{item.fpsMax} FPS · {item.evidenceType ?? 'NONE'} · {item.confidence ?? 'NONE'}</p>)}
            </div>
          </section>
        )}

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
