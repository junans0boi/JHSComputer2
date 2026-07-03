import type { Metadata } from 'next';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'JHS Computer - 정효성 TV PC 조립 서비스',
  description: '컴퓨터를 몰라도 OK! 예산만 입력하면 전문가가 직접 PC를 조립해드립니다. 자동 견적, 부품 선택, 게임 성능 비교까지.',
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
