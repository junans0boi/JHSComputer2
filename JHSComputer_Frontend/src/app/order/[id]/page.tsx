'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, PackageCheck } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { DaumPostcodeButton } from '@/components/DaumPostcodeButton';
import { Button } from '@/components/ui/Button';
import { FormField, TextareaInput, TextInput } from '@/components/ui/FormField';
import { IconTitle, PageStack, PanelCard } from '@/components/ui/PanelCard';
import { bankTransferInfo } from '@/lib/payment-config';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

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
      fetch(`${apiBaseUrl}/quotes/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setQuote(data);
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/quotes/${params.id}/order`, {
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

  if (loading) {
    return (
      <AppShell>
        <PanelCard className="p-8 text-center">불러오는 중...</PanelCard>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageStack className="mx-auto max-w-5xl">
        <PanelCard>
          <IconTitle
            description="배송받으실 정보를 정확히 입력해주세요."
            icon={<PackageCheck size={20} />}
            title="주문 정보 입력"
          />
        </PanelCard>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <PanelCard>
            <h2 className="mb-4 text-lg font-bold">배송 정보</h2>
            <div className="grid gap-4">
              <FormField label="수령인">
                <TextInput required type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} placeholder="이름을 입력하세요" />
              </FormField>
              <FormField label="연락처">
                <TextInput required type="text" name="recipientPhone" value={formData.recipientPhone} onChange={handleChange} placeholder="010-0000-0000" />
              </FormField>
              <FormField label="주소">
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <TextInput required type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="우편번호" />
                  <DaumPostcodeButton onComplete={(address) => setFormData((current) => ({ ...current, ...address }))} />
                </div>
                <TextInput className="mt-2" required type="text" name="address1" value={formData.address1} onChange={handleChange} placeholder="기본 주소" />
                <TextInput className="mt-2" type="text" name="address2" value={formData.address2} onChange={handleChange} placeholder="상세 주소" />
              </FormField>
              <FormField label="배송 메모">
                <TextareaInput name="deliveryMemo" value={formData.deliveryMemo} onChange={handleChange} placeholder="부재 시 문 앞에 놓아주세요" />
              </FormField>
            </div>
          </PanelCard>

          <PanelCard>
            <h2 className="mb-4 text-lg font-bold">결제 정보</h2>
            <div className="mb-4 flex items-center justify-between border-b border-line py-3">
              <span className="font-semibold text-gray-600">결제할 금액</span>
              <span className="text-2xl font-bold text-brand">{quote?.totalPrice?.toLocaleString()}원</span>
            </div>
            
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="mb-1 text-sm font-bold text-amber-900">무통장 입금 계좌 안내</p>
              <p className="text-sm text-amber-900">{bankTransferInfo.bankName} {bankTransferInfo.accountNo} (예금주: {bankTransferInfo.accountHolder})</p>
              <p className="mt-2 text-xs text-amber-700">* 주문 완료 후 위 계좌로 입금해주시면 확인 후 조립이 시작됩니다.</p>
            </div>
          </PanelCard>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full text-lg"
            variant={isSubmitting ? 'disabled' : 'primary'}
          >
            {isSubmitting ? '주문 처리 중...' : `${quote?.totalPrice?.toLocaleString()}원 결제하기`}
            <CheckCircle2 size={20} />
          </Button>
        </form>
      </PageStack>
    </AppShell>
  );
}
