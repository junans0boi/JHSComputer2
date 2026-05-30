import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '정효성 TV PC 견적',
  description: '정효성 TV PC 자동 견적 및 주문 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
