'use client';

import dynamic from 'next/dynamic';
import { FilePlus2, ImagePlus, Minus, Plus, Save, Search, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PartSearchDialog } from '@/components/builder/PartSearchDialog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FormField, SelectInput, TextInput } from '@/components/ui/FormField';
import { PanelCard, SectionHeader } from '@/components/ui/PanelCard';
import { partCategories } from '@/lib/compuzone-catalog';
import type { CatalogPart, ManualSelection, PartCategory } from '@/lib/v1-types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';
const apiOrigin = apiBaseUrl.replace(/\/api$/, '');
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

type AdminRecommendationPart = {
  partId?: string;
  category: string;
  label: string;
  name: string;
  price: number;
  quantity: number;
  productNo?: string | null;
  imageUrl?: string | null;
  specText?: string | null;
  sortOrder?: number;
};

type AdminRecommendationGame = {
  gameName: string;
  resolution: string;
  qualityPreset?: string | null;
  fpsMin?: number | null;
  fpsMax?: number | null;
  comfortGrade?: string | null;
};

export type AdminRecommendationPost = {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  bodyMd?: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  sourceType?: string | null;
  targetBudget?: number | null;
  totalPrice: number;
  purpose: string;
  cpuBrand?: string | null;
  gpuBrand?: string | null;
  cpuModel?: string | null;
  gpuModel?: string | null;
  comboType?: string | null;
  thumbnailImageUrl?: string | null;
  casePartName?: string | null;
  popularityScore?: number | null;
  parts: AdminRecommendationPart[];
  games: AdminRecommendationGame[];
};

const categoryOptions = partCategories;
const fallbackComboOptions = ['', 'RYZEN_NVIDIA', 'INTEL_NVIDIA', 'RYZEN_RADEON', 'INTEL_RADEON'];

export function RecommendationPostManager({ accessToken }: { accessToken?: string }) {
  const [posts, setPosts] = useState<AdminRecommendationPost[]>([]);
  const [selected, setSelected] = useState<AdminRecommendationPost>(createEmptyPost());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [replacePartCategory, setReplacePartCategory] = useState<PartCategory | null>(null);
  const [comboOptions, setComboOptions] = useState(fallbackComboOptions);
  const [message, setMessage] = useState('');

  const partsTotal = useMemo(
    () => selected.parts.reduce((sum, part) => sum + safeNumber(part.price) * Math.max(1, safeNumber(part.quantity, 1)), 0),
    [selected.parts],
  );
  const savedPartCount = useMemo(
    () => selected.parts.filter((part) => part.name.trim()).length,
    [selected.parts],
  );

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/recommendation-posts/admin/all?limit=120`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      if (!response.ok) throw new Error('failed');
      const data = await response.json();
      const items = (data.items ?? []).map(normalizePost);
      setPosts(items);
      setSelected((current) => current.id ? (items.find((item: AdminRecommendationPost) => item.id === current.id) ?? current) : (items[0] ?? createEmptyPost()));
    } catch {
      setMessage('추천 게시글 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPosts();
    void fetchCommonCodes();
  }, []);

  const fetchCommonCodes = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/common-codes`);
      if (!response.ok) return;
      const codes = await response.json();
      const comboCodes = (codes ?? [])
        .filter((code: any) => ['recommendationCombo', 'comboType', 'brandCombo'].includes(code.group))
        .map((code: any) => code.code);
      if (comboCodes.length) setComboOptions(['', ...comboCodes]);
    } catch {
      // 공통코드가 비어있으면 기본값 사용
    }
  };

  const patchSelected = (patch: Partial<AdminRecommendationPost>) => {
    setSelected((current) => ({ ...current, ...patch }));
  };

  const savePost = async () => {
    if (!selected.title.trim()) {
      setMessage('제목은 필수입니다.');
      return;
    }
    setSaving(true);
    setMessage('');
    const totalPrice = selected.totalPrice || partsTotal;
    const inferredMeta = inferRecommendationMeta(selected.parts);
    const validParts = sortAdminParts(selected.parts.filter((part) => part.name.trim()));
    const payload = {
      ...selected,
      ...Object.fromEntries(Object.entries(inferredMeta).filter(([key]) => !selected[key as keyof AdminRecommendationPost])),
      slug: selected.slug,
      totalPrice,
      parts: validParts,
      casePartName: selected.casePartName || validParts.find((part) => part.category === '케이스')?.name || null,
    };
    try {
      const response = await fetch(
        selected.id
          ? `${apiBaseUrl}/recommendation-posts/admin/${selected.id}`
          : `${apiBaseUrl}/recommendation-posts/admin`,
        {
          method: selected.id ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) throw new Error(await response.text());
      const saved = normalizePost(await response.json());
      setSelected(saved);
      setMessage('추천 게시글이 저장되었습니다.');
      await fetchPosts();
    } catch {
      setMessage('저장에 실패했습니다. 슬러그 중복 또는 입력값을 확인해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const updatePart = (category: PartCategory, patch: Partial<AdminRecommendationPart>) => {
    const existingIndex = selected.parts.findIndex((part) => part.category === category);
    const basePart = existingIndex >= 0 ? selected.parts[existingIndex] : createEmptyPart(selected.parts.length, category);
    const nextPart = { ...basePart, ...patch, category: patch.category ?? category, label: patch.label ?? patch.category ?? category };
    const nextParts = existingIndex >= 0
      ? selected.parts.map((part, partIndex) => partIndex === existingIndex ? nextPart : part)
      : [...selected.parts, nextPart];
    patchSelected({ parts: sortAdminParts(nextParts) });
  };

  const updatePartFromCatalog = (category: PartCategory, catalogPart: CatalogPart) => {
    const existingPart = selected.parts.find((part) => part.category === category);
    const nextParts = upsertAdminPart(selected.parts, {
      ...(existingPart ?? createEmptyPart(selected.parts.length, category)),
      category: catalogPart.category,
      label: catalogPart.category,
      name: catalogPart.name,
      price: catalogPart.price,
      quantity: existingPart?.quantity || 1,
      productNo: catalogPart.productNo,
      imageUrl: catalogPart.imageUrl,
      specText: catalogPart.spec,
    });
    const casePart = nextParts.find((part) => part.category === '케이스');
    patchSelected({
      parts: nextParts,
      casePartName: casePart?.name ?? selected.casePartName,
      thumbnailImageUrl: selected.thumbnailImageUrl || casePart?.imageUrl || catalogPart.imageUrl,
    });
  };

  const removePart = (category: PartCategory) => {
    patchSelected({ parts: selected.parts.filter((part) => part.category !== category) });
  };

  const generateSummary = async () => {
    setGeneratingSummary(true);
    setMessage('');
    try {
      const response = await fetch(`${apiBaseUrl}/recommendation-posts/admin/generate-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ ...selected, totalPrice: selected.totalPrice || partsTotal }),
      });
      if (!response.ok) throw new Error('failed');
      const data = await response.json();
      patchSelected({ summary: data.summary ?? '' });
      setMessage(data.source === 'llm' ? 'LLM이 요약을 생성했습니다.' : '기본 규칙으로 요약을 생성했습니다.');
    } catch {
      setMessage('요약 생성에 실패했습니다.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const uploadThumbnail = async (file?: File | null) => {
    if (!file) return;
    const formData = new FormData();
    formData.set('file', file);
    try {
      const response = await fetch(`${apiBaseUrl}/recommendation-posts/admin/upload-thumbnail`, {
        method: 'POST',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        body: formData,
      });
      if (!response.ok) throw new Error('failed');
      const data = await response.json();
      patchSelected({ thumbnailImageUrl: `${apiOrigin}${data.url}` });
      setMessage('썸네일 이미지를 업로드했습니다.');
    } catch {
      setMessage('썸네일 업로드에 실패했습니다.');
    }
  };

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      {replacePartCategory && (
        <PartSearchDialog
          category={replacePartCategory}
          manualSelection={adminPartsToManualSelection(selected.parts)}
          onClose={() => setReplacePartCategory(null)}
          onSelect={(part) => {
            updatePartFromCatalog(replacePartCategory, part);
            setReplacePartCategory(null);
          }}
        />
      )}
      <PanelCard>
        <SectionHeader
          action={<Button onClick={() => { setSelected(createEmptyPost()); setMessage('새 추천 게시글을 작성합니다.'); }} type="button"><FilePlus2 size={16} />새 글</Button>}
          description="DB에 저장된 JHS 추천 견적 게시글입니다."
          title="추천 게시글"
        />

        <div className="mt-4 grid gap-2">
          {loading ? (
            <div className="rounded-xl bg-panel p-5 text-center text-sm text-slate-500">불러오는 중...</div>
          ) : posts.length ? posts.map((post) => (
            <button
              className={`rounded-xl border p-3 text-left transition ${selected.id === post.id ? 'border-brand bg-teal-50' : 'border-line hover:border-brand'}`}
              key={post.id ?? post.slug}
              onClick={() => setSelected(post)}
              type="button"
            >
              <div className="flex items-center justify-between gap-2">
                <strong className="safe-break text-sm">{post.title}</strong>
                <Badge tone={post.status === 'PUBLISHED' ? 'brand' : 'slate'}>{post.status === 'PUBLISHED' ? '공개' : '초안'}</Badge>
              </div>
              <p className="mt-1 safe-break text-xs text-slate-500">ID {post.id} · /recommendations/{post.id}</p>
              <p className="mt-1 text-xs font-bold text-brand">{Number(post.totalPrice ?? 0).toLocaleString()}원</p>
            </button>
          )) : (
            <div className="rounded-xl bg-panel p-5 text-center text-sm text-slate-500">게시글이 없습니다.</div>
          )}
        </div>
      </PanelCard>

      <div className="grid min-w-0 gap-5">
        <PanelCard>
          <SectionHeader
            action={<Button disabled={saving} onClick={savePost} type="button"><Save size={16} />{saving ? '저장 중...' : '저장'}</Button>}
            description="URL은 게시글 ID로 자동 생성됩니다. 관리자는 제목, 본문, 썸네일, 견적만 관리하면 됩니다."
            title={selected.id ? '게시글 수정' : '게시글 등록'}
          />
          {message && <div className="mt-4 rounded-xl border border-line bg-panel p-3 text-sm font-bold text-slate-700">{message}</div>}

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <FormField label="제목">
              <TextInput value={selected.title} onChange={(event) => patchSelected({ title: event.target.value })} />
            </FormField>
            <FormField label="부제목">
              <TextInput value={selected.subtitle ?? ''} onChange={(event) => patchSelected({ subtitle: event.target.value })} />
            </FormField>
            <FormField label="상태">
              <SelectInput value={selected.status} onChange={(event) => patchSelected({ status: event.target.value as AdminRecommendationPost['status'] })}>
                <option value="DRAFT">초안</option>
                <option value="PUBLISHED">공개</option>
              </SelectInput>
            </FormField>
            <FormField label="요약">
              <div className="grid gap-2">
                <TextInput value={selected.summary ?? ''} onChange={(event) => patchSelected({ summary: event.target.value })} placeholder="요약 생성 버튼으로 자동 작성 후 수정 가능" />
                <Button disabled={generatingSummary} onClick={generateSummary} type="button" variant="outline">
                  <Sparkles size={16} />
                  {generatingSummary ? '생성 중...' : 'LLM 요약 생성'}
                </Button>
              </div>
            </FormField>
            <FormField label="썸네일">
              <ThumbnailEditor
                onFileSelect={uploadThumbnail}
                onPickPartImage={(imageUrl) => patchSelected({ thumbnailImageUrl: imageUrl })}
                parts={selected.parts}
                value={selected.thumbnailImageUrl || selected.parts.find((part) => part.category === '케이스')?.imageUrl || ''}
              />
            </FormField>
          </div>
        </PanelCard>

        <PanelCard>
          <SectionHeader
            description="실제 에디터 패키지(@uiw/react-md-editor)를 사용합니다. 마크다운 기반 블로그 편집/미리보기를 지원합니다."
            title="본문 에디터"
          />
          <MarkdownEditor value={selected.bodyMd ?? ''} onChange={(bodyMd) => patchSelected({ bodyMd })} />
        </PanelCard>

        <PanelCard>
          <SectionHeader
            action={<Button onClick={() => patchSelected(inferRecommendationMeta(selected.parts))} type="button" variant="outline"><Sparkles size={16} />자동 설정</Button>}
            description="기본값은 시스템/LLM이 자동 설정합니다. 필요할 때만 공통코드 기준으로 조정하세요."
            title="추천 조건"
          />
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FormField label="CPU 브랜드">
              <TextInput value={selected.cpuBrand ?? ''} onChange={(event) => patchSelected({ cpuBrand: event.target.value })} placeholder="INTEL / AMD" />
            </FormField>
            <FormField label="GPU 브랜드">
              <TextInput value={selected.gpuBrand ?? ''} onChange={(event) => patchSelected({ gpuBrand: event.target.value })} placeholder="NVIDIA / RADEON" />
            </FormField>
            <FormField label="CPU 모델">
              <TextInput value={selected.cpuModel ?? ''} onChange={(event) => patchSelected({ cpuModel: event.target.value })} />
            </FormField>
            <FormField label="GPU 모델">
              <TextInput value={selected.gpuModel ?? ''} onChange={(event) => patchSelected({ gpuModel: event.target.value })} />
            </FormField>
            <FormField label="브랜드 조합">
              <SelectInput value={selected.comboType ?? ''} onChange={(event) => patchSelected({ comboType: event.target.value })}>
                {comboOptions.map((option) => <option key={option} value={option}>{option || '선택 안 함'}</option>)}
              </SelectInput>
            </FormField>
            <FormField label="목표 예산">
              <TextInput type="number" value={selected.targetBudget ?? ''} onChange={(event) => patchSelected({ targetBudget: safeNumber(event.target.value) })} />
            </FormField>
            <FormField label="총 가격">
              <TextInput type="number" value={selected.totalPrice || partsTotal} onChange={(event) => patchSelected({ totalPrice: safeNumber(event.target.value) })} />
            </FormField>
            <FormField label="인기도 점수">
              <TextInput type="number" value={selected.popularityScore ?? 0} onChange={(event) => patchSelected({ popularityScore: safeNumber(event.target.value) })} />
            </FormField>
          </div>
        </PanelCard>

        <PanelCard>
          <SectionHeader
            action={<Button onClick={() => patchSelected(inferRecommendationMeta(selected.parts))} type="button" variant="outline"><Sparkles size={16} />CPU/GPU 자동 반영</Button>}
            description={`DB 저장 부품 ${savedPartCount}/${categoryOptions.length}개 · 부품 합계 ${partsTotal.toLocaleString()}원 · 기본 썸네일은 케이스 이미지입니다.`}
            title="견적 부품 수정"
          />
          <AdminQuotePartsEditor
            onPickPart={setReplacePartCategory}
            onRemovePart={removePart}
            onUpdatePart={updatePart}
            parts={selected.parts}
          />
        </PanelCard>

        <PanelCard>
          <SectionHeader
            description="게임 성능은 CPU/GPU 조합 기준 실제 벤치마크 DB에서 자동으로 불러옵니다. 관리자가 직접 수정하지 않습니다."
            title="게임 성능"
          />
          <div className="mt-4 rounded-xl border border-line bg-panel p-4 text-sm font-bold text-slate-600">
            현재 선택된 조합: <span className="text-brand">{selected.cpuModel || 'CPU 미설정'} + {selected.gpuModel || 'GPU 미설정'}</span>
            <p className="mt-1 text-xs text-slate-500">추천 상세 페이지에서 실제 벤치마크 DB를 검색/필터링 가능한 표로 보여줍니다.</p>
          </div>
        </PanelCard>
      </div>
    </section>
  );
}

function MarkdownEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-line" data-color-mode="light">
      <MDEditor
        height={420}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        preview="live"
        value={value}
      />
    </div>
  );
}

function ThumbnailEditor({
  value,
  parts,
  onPickPartImage,
  onFileSelect,
}: {
  value: string;
  parts: AdminRecommendationPart[];
  onPickPartImage: (imageUrl: string) => void;
  onFileSelect: (file?: File | null) => void;
}) {
  const imageParts = parts.filter((part) => part.imageUrl);
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-[120px_minmax(0,1fr)]">
        <div className="grid h-28 place-items-center rounded-xl border border-line bg-panel p-2">
          {value ? <img alt="썸네일" className="max-h-full max-w-full object-contain" src={value} /> : <ImagePlus className="text-slate-300" size={32} />}
        </div>
        <div className="grid content-start gap-2">
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-black text-white transition hover:bg-brand">
            <ImagePlus size={16} />
            이미지 첨부
            <input accept="image/*" className="hidden" onChange={(event) => onFileSelect(event.target.files?.[0])} type="file" />
          </label>
          <TextInput value={value} onChange={(event) => onPickPartImage(event.target.value)} placeholder="이미지 URL 직접 입력" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {imageParts.map((part, index) => (
          <button
            className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-black text-slate-600 transition hover:border-brand hover:text-brand"
            key={`${part.name}-${index}`}
            onClick={() => part.imageUrl && onPickPartImage(part.imageUrl)}
            type="button"
          >
            {part.category} 이미지 사용
          </button>
        ))}
      </div>
    </div>
  );
}

function AdminQuotePartsEditor({
  parts,
  onPickPart,
  onRemovePart,
  onUpdatePart,
}: {
  parts: AdminRecommendationPart[];
  onPickPart: (category: PartCategory) => void;
  onRemovePart: (category: PartCategory) => void;
  onUpdatePart: (category: PartCategory, patch: Partial<AdminRecommendationPart>) => void;
}) {
  const partByCategory = new Map(parts.map((part) => [part.category, part]));

  return (
    <div className="mt-4 grid gap-3">
      {categoryOptions.map((category) => {
        const typedCategory = category as PartCategory;
        const rawPart = partByCategory.get(category);
        const part = rawPart?.name.trim() ? rawPart : undefined;
        const quantity = Math.max(1, safeNumber(part?.quantity, 1));
        const unitPrice = safeNumber(part?.price);
        const lineTotal = unitPrice * quantity;
        return (
          <div
            className={`overflow-hidden rounded-2xl border transition ${
              part?.name ? 'border-line bg-white shadow-sm' : 'border-dashed border-line bg-panel'
            }`}
            key={category}
          >
            <div className="grid min-w-0 gap-3 p-3">
              <div className="grid min-w-0 gap-3 lg:grid-cols-[92px_minmax(0,1fr)_auto]">
                <div className="flex items-center justify-center rounded-xl bg-slate-50 px-3 py-2 text-sm font-black text-brand">
                  {typedCategory}
                </div>

                <div className="grid min-w-0 gap-3 sm:grid-cols-[72px_minmax(0,1fr)]">
                  <div className="grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-xl border border-line bg-white">
                    {part?.imageUrl ? (
                      <img alt={part.name} className="h-full w-full object-contain p-1" src={part.imageUrl} />
                    ) : (
                      <ImagePlus className="text-slate-300" size={26} />
                    )}
                  </div>

                  <div className="min-w-0 content-center">
                    {part ? (
                      <>
                        <div className="safe-break max-h-10 overflow-hidden text-sm font-black leading-5 text-slate-900">{part.name}</div>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                          {part.productNo && <span className="rounded-md bg-slate-100 px-2 py-0.5">상품번호 {part.productNo}</span>}
                          <span className="rounded-md bg-teal-50 px-2 py-0.5 text-brand">DB 단가 {unitPrice.toLocaleString()}원 × {quantity}개</span>
                        </div>
                      </>
                    ) : (
                      <div>
                        <div className="text-sm font-black text-slate-500">DB 저장 부품 없음</div>
                        <p className="mt-1 text-xs font-bold text-slate-400">검색해서 실제 DB 부품을 선택하세요.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                  {!part && (
                    <Button className="h-10 px-3" onClick={() => onPickPart(typedCategory)} type="button" variant="outline">
                      <Search size={16} />
                      검색
                    </Button>
                  )}
                  <Button className="h-10 px-3" disabled={!part} onClick={() => onRemovePart(typedCategory)} type="button" variant="danger">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              {part && (
                <div className="grid gap-3 rounded-xl bg-slate-50 p-3 md:grid-cols-[132px_minmax(120px,1fr)]">
                  <FormField label="수량">
                    <div className="flex h-11 items-center justify-between rounded-xl border border-line bg-white px-2">
                      <button
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                        onClick={() => onUpdatePart(typedCategory, { quantity: Math.max(1, quantity - 1) })}
                        type="button"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        className="h-9 w-11 text-center text-sm font-black outline-none"
                        min={1}
                        onChange={(event) => onUpdatePart(typedCategory, { quantity: Math.max(1, safeNumber(event.target.value, 1)) })}
                        type="number"
                        value={quantity}
                      />
                      <button
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                        onClick={() => onUpdatePart(typedCategory, { quantity: quantity + 1 })}
                        type="button"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </FormField>

                  <div className="grid content-end gap-1 rounded-xl bg-white px-3 py-2 text-right">
                    <span className="text-[11px] font-black text-slate-400">라인 합계</span>
                    <strong className="text-lg text-brand">{lineTotal.toLocaleString()}원</strong>
                  </div>
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}

function normalizePost(post: any): AdminRecommendationPost {
  return {
    ...createEmptyPost(),
    ...post,
    id: post.id ? String(post.id) : undefined,
    status: post.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
    totalPrice: safeNumber(post.totalPrice),
    targetBudget: post.targetBudget === null || post.targetBudget === undefined ? null : safeNumber(post.targetBudget),
    popularityScore: safeNumber(post.popularityScore),
    parts: sortAdminParts((post.parts ?? []).map((part: any, index: number) => ({
      partId: part.partId ? String(part.partId) : undefined,
      category: normalizeAdminPartCategory(part.category),
      label: normalizeAdminPartCategory(part.label ?? part.category),
      name: part.name ?? '',
      price: safeNumber(part.price),
      quantity: safeNumber(part.quantity, 1),
      productNo: part.productNo ?? '',
      imageUrl: part.imageUrl ?? '',
      specText: part.specText ?? '',
      sortOrder: safeNumber(part.sortOrder, index),
    }))),
    games: (post.games ?? []).map((game: any) => ({
      gameName: game.gameName ?? '',
      resolution: game.resolution ?? 'FHD',
      qualityPreset: game.qualityPreset ?? '',
      fpsMin: game.fpsMin === null || game.fpsMin === undefined ? null : safeNumber(game.fpsMin),
      fpsMax: game.fpsMax === null || game.fpsMax === undefined ? null : safeNumber(game.fpsMax),
      comfortGrade: game.comfortGrade ?? '',
    })),
  };
}

function adminPartsToManualSelection(parts: AdminRecommendationPart[]): ManualSelection {
  return parts.reduce<ManualSelection>((selection, part) => {
    const category = normalizeAdminPartCategory(part.category);
    if (!part.name || !partCategories.includes(category)) return selection;
    selection[category] = {
      id: part.productNo || part.name,
      category,
      productNo: part.productNo || '',
      name: part.name,
      price: safeNumber(part.price),
      imageUrl: part.imageUrl || '',
      detailUrl: '',
      spec: part.specText || '',
      reviewCount: 0,
      reviewRate: 0,
      badges: [],
    };
    return selection;
  }, {});
}

function inferRecommendationMeta(parts: AdminRecommendationPart[]): Partial<AdminRecommendationPost> {
  const normalizedParts = parts.map((part) => ({ ...part, category: normalizeAdminPartCategory(part.category) }));
  const cpuPart = normalizedParts.find((part) => part.category === 'CPU');
  const gpuPart = normalizedParts.find((part) => part.category === '그래픽카드');
  const cpuText = `${cpuPart?.name ?? ''}`.toLowerCase();
  const gpuText = `${gpuPart?.name ?? ''}`.toLowerCase();
  const cpuBrand = cpuText.includes('intel') || cpuText.includes('인텔') || cpuText.includes('i5') || cpuText.includes('i7') || cpuText.includes('i9')
    ? 'INTEL'
    : cpuText.includes('amd') || cpuText.includes('라이젠') || cpuText.includes('ryzen')
    ? 'AMD'
    : '';
  const gpuBrand = gpuText.includes('radeon') || gpuText.includes('라데온') || gpuText.includes('rx ')
    ? 'RADEON'
    : gpuText.includes('geforce') || gpuText.includes('지포스') || gpuText.includes('rtx') || gpuText.includes('gtx')
    ? 'NVIDIA'
    : '';
  const comboType =
    cpuBrand === 'AMD' && gpuBrand === 'NVIDIA' ? 'RYZEN_NVIDIA' :
    cpuBrand === 'INTEL' && gpuBrand === 'NVIDIA' ? 'INTEL_NVIDIA' :
    cpuBrand === 'AMD' && gpuBrand === 'RADEON' ? 'RYZEN_RADEON' :
    cpuBrand === 'INTEL' && gpuBrand === 'RADEON' ? 'INTEL_RADEON' :
    '';

  return {
    cpuBrand,
    gpuBrand,
    cpuModel: cpuPart?.name ?? '',
    gpuModel: gpuPart?.name ?? '',
    comboType,
  };
}

function createEmptyPost(): AdminRecommendationPost {
  return {
    slug: '',
    title: '',
    subtitle: '',
    summary: '',
    bodyMd: '',
    status: 'DRAFT',
    sourceType: 'JHS_MANUAL',
    targetBudget: null,
    totalPrice: 0,
    purpose: 'GAME',
    cpuBrand: '',
    gpuBrand: '',
    cpuModel: '',
    gpuModel: '',
    comboType: '',
    thumbnailImageUrl: '',
    casePartName: '',
    popularityScore: 0,
    parts: categoryOptions.map((category, index) => createEmptyPart(index, category)),
    games: [createEmptyGame()],
  };
}

function createEmptyPart(index: number, category = 'CPU'): AdminRecommendationPart {
  return {
    category,
    label: category,
    name: '',
    price: 0,
    quantity: 1,
    productNo: '',
    imageUrl: '',
    specText: '',
    sortOrder: index,
  };
}

function upsertAdminPart(parts: AdminRecommendationPart[], nextPart: AdminRecommendationPart) {
  return sortAdminParts(
    parts.some((part) => part.category === nextPart.category)
      ? parts.map((part) => part.category === nextPart.category ? nextPart : part)
      : [...parts, nextPart],
  );
}

function sortAdminParts(parts: AdminRecommendationPart[]) {
  const uniqueParts = new Map<string, AdminRecommendationPart>();
  const extraParts: AdminRecommendationPart[] = [];

  parts.forEach((part) => {
    const category = normalizeAdminPartCategory(part.category);
    const normalizedPart = { ...part, category, label: normalizeAdminPartCategory(part.label ?? category) };
    if (!categoryOptions.includes(category)) {
      extraParts.push(part);
      return;
    }
    const current = uniqueParts.get(category);
    if (!current || (!current.name && normalizedPart.name)) uniqueParts.set(category, normalizedPart);
  });

  return [...uniqueParts.values(), ...extraParts].sort((left, right) => {
    const leftIndex = categoryOptions.indexOf(left.category as PartCategory);
    const rightIndex = categoryOptions.indexOf(right.category as PartCategory);
    return (leftIndex < 0 ? 99 : leftIndex) - (rightIndex < 0 ? 99 : rightIndex);
  });
}

function normalizeAdminPartCategory(category?: string | null): PartCategory {
  const categoryMap: Record<string, PartCategory> = {
    CPU: 'CPU',
    MAINBOARD: '메인보드',
    MOTHERBOARD: '메인보드',
    메인보드: '메인보드',
    RAM: 'RAM',
    MEMORY: 'RAM',
    GPU: '그래픽카드',
    VGA: '그래픽카드',
    그래픽카드: '그래픽카드',
    SSD: 'SSD',
    PSU: '파워',
    POWER: '파워',
    파워: '파워',
    CASE: '케이스',
    케이스: '케이스',
    CPU_COOLER: '쿨러',
    COOLER: '쿨러',
    쿨러: '쿨러',
  };
  return categoryMap[String(category ?? '').trim()] ?? 'CPU';
}

function createEmptyGame(): AdminRecommendationGame {
  return {
    gameName: '',
    resolution: 'FHD',
    qualityPreset: '높음',
    fpsMin: null,
    fpsMax: null,
    comfortGrade: 'GOOD',
  };
}

function safeNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}
