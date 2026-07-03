'use client';

import dynamic from 'next/dynamic';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });

export function RecommendationMarkdownBody({ body }: { body: string }) {
  return (
    <div className="wmde-markdown-var" data-color-mode="light">
      <MarkdownPreview source={body} style={{ background: 'transparent', color: 'inherit' }} />
    </div>
  );
}
