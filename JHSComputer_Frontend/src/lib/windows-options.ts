import type { Quote, WindowsOptionValue } from './v1-types';

export type WindowsOptionMeta = {
  value: WindowsOptionValue;
  label: string;
  description: string;
  price: number;
  productNo?: string;
  productUrl?: string;
};

export const windowsOptions: WindowsOptionMeta[] = [
  {
    value: 'INSTALL_ONLY',
    label: '윈도우 단순 설치[인증 X]',
    description: '라이선스 구매 없이 설치만 진행합니다. 정품 인증은 고객이 직접 진행합니다.',
    price: 30000,
  },
  {
    value: 'WINDOWS_11_HOME_FPP',
    label: 'Windows 11 Home 구매 및 설치',
    description: '[마이크로소프트] Windows 11 Home 처음사용자용 패키지(FPP) [한글/설치USB포함]',
    price: 205000,
    productNo: '893799',
    productUrl: 'https://www.compuzone.co.kr/product/product_detail.htm?ProductNo=893799&BigDivNo=9&MediumDivNo=1041&DivNo=3208',
  },
  {
    value: 'WINDOWS_11_PRO_FPP',
    label: 'Windows 11 Pro 구매 및 설치',
    description: '[마이크로소프트] Windows 11 Pro 처음사용자용 패키지(FPP) [한글/설치USB포함]',
    price: 324600,
    productNo: '893800',
    productUrl: 'https://www.compuzone.co.kr/product/product_detail.htm?ProductNo=893800&BigDivNo=9&MediumDivNo=1041&DivNo=3208',
  },
  {
    value: 'NONE',
    label: '윈도우 미설치',
    description: '운영체제 설치 없이 출고합니다.',
    price: 0,
  },
];

const legacyWindowsMap: Record<string, WindowsOptionValue> = {
  포함: 'WINDOWS_11_HOME_FPP',
  설치만: 'INSTALL_ONLY',
  미포함: 'NONE',
};

export function normalizeWindowsOption(value?: string | null): WindowsOptionValue {
  if (!value) return 'NONE';
  if (windowsOptions.some((option) => option.value === value)) return value as WindowsOptionValue;
  return legacyWindowsMap[value] ?? 'NONE';
}

export function getWindowsOptionMeta(value?: string | null) {
  const normalizedValue = normalizeWindowsOption(value);
  return windowsOptions.find((option) => option.value === normalizedValue) ?? windowsOptions[windowsOptions.length - 1];
}

export function getWindowsFee(value?: string | null) {
  return getWindowsOptionMeta(value).price;
}

export function applyWindowsOptionToQuote(quote: Quote, windows: WindowsOptionValue): Quote {
  const windowsFee = getWindowsFee(windows);
  return {
    ...quote,
    input: { ...quote.input, windows },
    windowsFee,
    total: quote.subtotal + quote.assemblyFee + quote.shippingFee + windowsFee,
  };
}
