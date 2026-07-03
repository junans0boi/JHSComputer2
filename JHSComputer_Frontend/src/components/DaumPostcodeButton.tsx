'use client';

import { MapPin } from 'lucide-react';

type DaumPostcodeData = {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName?: string;
  apartment?: 'Y' | 'N';
  bname?: string;
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: { oncomplete: (data: DaumPostcodeData) => void }) => { open: () => void };
    };
  }
}

const postcodeScriptSrc = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export function DaumPostcodeButton({ onComplete }: { onComplete: (address: { postalCode: string; address1: string }) => void }) {
  const openPostcode = () => {
    const open = () => {
      if (!window.daum?.Postcode) return;
      new window.daum.Postcode({
        oncomplete: (data) => {
          const extra = [data.bname, data.buildingName && data.apartment === 'Y' ? data.buildingName : ''].filter(Boolean).join(', ');
          const baseAddress = data.roadAddress || data.jibunAddress;
          onComplete({
            postalCode: data.zonecode,
            address1: extra ? `${baseAddress} (${extra})` : baseAddress,
          });
        },
      }).open();
    };

    if (window.daum?.Postcode) {
      open();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${postcodeScriptSrc}"]`);
    if (existing) {
      existing.addEventListener('load', open, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = postcodeScriptSrc;
    script.async = true;
    script.onload = open;
    document.head.appendChild(script);
  };

  return (
    <button
      className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-black text-brand transition hover:border-brand hover:bg-teal-50"
      onClick={openPostcode}
      type="button"
    >
      <MapPin size={16} />
      주소 검색
    </button>
  );
}
