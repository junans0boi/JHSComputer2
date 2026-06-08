'use client';

import { ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { buildSpecSummary } from '@/lib/spec-summary';
import type { CatalogPart } from '@/lib/v1-types';

type Props = {
  part: CatalogPart;
  onClose: () => void;
};

export function PartDetailModal({ part, onClose }: Props) {
  const [fetchedImages, setFetchedImages] = useState<string[]>(part.detailImages || []);
  const [isLoading, setIsLoading] = useState(false);
  const images = fetchedImages;
  const [current, setCurrent] = useState(0);
  const summarySections = buildSpecSummary(part);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  // Close on Escape, navigate with arrow keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  useEffect(() => {
    setFetchedImages(part.detailImages || []);
    setCurrent(0);

    if (part.detailImages?.length || !part.productNo) return;

    const controller = new AbortController();
    setIsLoading(true);

    fetch(`/api/compuzone-detail?productNo=${encodeURIComponent(part.productNo)}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { images: [] }))
      .then((data: { images?: string[] }) => setFetchedImages(data.images || []))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setFetchedImages([]);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [part]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-line p-4">
          <div className="min-w-0">
            <p className="text-xs font-bold text-brand">{part.category} · 상품번호 {part.productNo}</p>
            <h2 className="mt-1 line-clamp-2 text-sm font-black leading-5">{part.name}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              className="flex h-9 items-center gap-1.5 rounded-xl border border-line px-3 text-xs font-black hover:border-brand hover:text-brand"
              href={part.detailUrl}
              rel="noreferrer"
              target="_blank"
            >
              컴퓨존에서 보기
              <ExternalLink size={13} />
            </a>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line hover:border-brand hover:text-brand"
              onClick={onClose}
              type="button"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 grid gap-3">
            <div className="rounded-xl border border-line bg-panel p-4">
              <h3 className="text-base font-black">한눈에 보는 스펙 요약</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                호환성 판단에 필요한 값만 먼저 정리했습니다. 원본 상세 이미지는 아래에서 확인하세요.
              </p>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {summarySections.map((section) => (
                <div className="overflow-hidden rounded-xl border border-line bg-white" key={section.title}>
                  <div className="border-b border-line bg-slate-50 px-3 py-2 text-sm font-black">{section.title}</div>
                  <div className="grid">
                    {section.rows.map((row) => (
                      <div className="grid grid-cols-[112px_1fr] border-t border-line first:border-t-0" key={`${section.title}-${row.label}`}>
                        <div className="bg-panel px-3 py-2 text-xs font-black text-slate-500">{row.label}</div>
                        <div className="px-3 py-2">
                          <div className="text-sm font-bold">{row.value}</div>
                          {row.help && <div className="mt-1 text-[11px] leading-4 text-slate-500">{row.help}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="rounded-xl border border-dashed border-line py-16 text-center text-sm font-bold text-slate-500">
              컴퓨존 상세 스펙 이미지를 불러오는 중입니다.
            </div>
          )}

          {!isLoading && images.length === 0 && (
            <div className="rounded-xl border border-dashed border-line py-16 text-center text-sm text-slate-500">
              상세 스펙 이미지가 없습니다.{' '}
              <a className="font-black text-brand underline" href={part.detailUrl} rel="noreferrer" target="_blank">
                컴퓨존 페이지
              </a>
              에서 직접 확인하세요.
            </div>
          )}

          {!isLoading && images.length > 0 && (
            <div className="grid gap-4">
              {/* Main image with prev/next */}
              <div className="relative overflow-hidden rounded-xl bg-panel">
                <div className="max-h-[72vh] overflow-y-auto">
                  <img
                    alt={`${part.name} 상세 스펙 이미지 ${current + 1}`}
                    className="w-full h-auto object-contain block mx-auto"
                    src={images[current]}
                  />
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white"
                      onClick={prev}
                      type="button"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white"
                      onClick={next}
                      type="button"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <span className="absolute bottom-2 right-3 rounded-full bg-black/50 px-2 py-0.5 text-xs font-bold text-white">
                      {current + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((src, idx) => (
                    <button
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        idx === current ? 'border-brand' : 'border-line hover:border-slate-400'
                      }`}
                      key={src}
                      onClick={() => setCurrent(idx)}
                      type="button"
                    >
                      <img alt={`썸네일 ${idx + 1}`} className="h-full w-full object-contain" src={src} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
