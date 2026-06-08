'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    postalCode: '',
    address1: '',
    address2: '',
    deliveryMemo: '',
  });

  useEffect(() => {
    if (params.id) {
      fetch(`http://localhost:6002/api/quotes/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setQuote(data);
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:6002/api/quotes/${params.id}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.orderNo) {
        alert('주문이 완료되었습니다. 무통장 입금을 진행해주세요.');
        router.push(`/track`);
      } else {
        alert('주문에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">불러오는 중...</div>;

  return (
    <main className="min-h-screen px-5 py-6 text-ink md:px-8 bg-gray-50">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 border-b border-line pb-5">
          <h1 className="mt-1 text-2xl font-bold tracking-normal md:text-3xl">주문 정보 입력</h1>
          <p className="text-sm text-gray-500">배송받으실 정보를 정확히 입력해주세요.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="bg-white rounded-lg border border-line p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-4">배송 정보</h2>
            <div className="grid gap-4">
              <label className="block">
                <span className="text-sm font-semibold mb-1 block">수령인</span>
                <input required type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} className="w-full h-11 rounded-md border border-line px-3" placeholder="이름을 입력하세요" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold mb-1 block">연락처</span>
                <input required type="text" name="recipientPhone" value={formData.recipientPhone} onChange={handleChange} className="w-full h-11 rounded-md border border-line px-3" placeholder="010-0000-0000" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold mb-1 block">우편번호</span>
                <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full h-11 rounded-md border border-line px-3" placeholder="12345" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold mb-1 block">주소</span>
                <input required type="text" name="address1" value={formData.address1} onChange={handleChange} className="w-full h-11 rounded-md border border-line px-3 mb-2" placeholder="기본 주소" />
                <input type="text" name="address2" value={formData.address2} onChange={handleChange} className="w-full h-11 rounded-md border border-line px-3" placeholder="상세 주소" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold mb-1 block">배송 메모</span>
                <input type="text" name="deliveryMemo" value={formData.deliveryMemo} onChange={handleChange} className="w-full h-11 rounded-md border border-line px-3" placeholder="부재 시 문 앞에 놓아주세요" />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-line p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-4">결제 정보</h2>
            <div className="flex justify-between items-center py-3 border-b border-line mb-4">
              <span className="font-semibold text-gray-600">결제할 금액</span>
              <span className="text-2xl font-bold text-brand">{quote?.totalPrice?.toLocaleString()}원</span>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <p className="text-sm font-bold text-blue-800 mb-1">무통장 입금 계좌 안내</p>
              <p className="text-sm text-blue-900">국민은행 123456-00-123456 (예금주: 정효성)</p>
              <p className="text-xs text-blue-700 mt-2">* 주문 완료 후 위 계좌로 입금해주시면 확인 후 조립이 시작됩니다.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex h-14 w-full items-center justify-center gap-2 rounded-md px-4 font-bold text-white transition text-lg ${isSubmitting ? 'bg-gray-400' : 'bg-brand hover:bg-teal-700'}`}
          >
            {isSubmitting ? '주문 처리 중...' : `${quote?.totalPrice?.toLocaleString()}원 결제하기`}
            <CheckCircle2 size={20} />
          </button>
        </form>
      </div>
    </main>
  );
}
