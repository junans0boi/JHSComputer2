'use client';

import {
  AlertCircle,
  ChevronRight,
  CircleDot,
  Package,
  Play,
  RefreshCcw,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { RecommendationPostManager } from '@/components/admin/RecommendationPostManager';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/FormField';
import { PanelCard } from '@/components/ui/PanelCard';
import { getSession } from '@/lib/auth-client';
import { getCjTrackingUrl, getTrackingCompanyLabel } from '@/lib/delivery-tracking';
import { orderFlow, statusLabels } from '@/lib/v1-storage';
import type { OrderStatus } from '@/lib/v1-types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

type ServerOrder = {
  id: string;
  orderNo: string;
  status: string;
  recipientName: string;
  recipientPhone: string;
  address1: string;
  address2?: string;
  deliveryMemo?: string;
  trackingCompany?: string | null;
  trackingNo?: string | null;
  totalPrice: number;
  subtotalPartsPrice: number;
  assemblyFee: number;
  windowsFee: number;
  shippingFee: number;
  items: Array<{ categoryCode: string; partNameSnapshot: string; quantity: number; publicPrice: number }>;
  statusHistories: Array<{ toStatus: string; memo?: string; createdAt: string }>;
  createdAt: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [serverOrders, setServerOrders] = useState<ServerOrder[]>([]);
  const [selectedServerOrder, setSelectedServerOrder] = useState<ServerOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'orders' | 'recommendations' | 'agents'>('orders');
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const isAdmin = mounted && session?.user?.role === 'ADMIN';

  const fetchServerOrders = async (accessToken = session?.accessToken) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/orders?page=1&limit=50`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setServerOrders(data.items ?? []);
        if (data.items?.length > 0) setSelectedServerOrder(data.items[0]);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSession(getSession());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (session?.user?.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    void fetchServerOrders(session.accessToken);
  }, [mounted, session?.accessToken, session?.user?.role]);

  const handleServerStatusChange = async (orderId: string, status: string) => {
    if (!session?.accessToken) return;
    try {
      await fetch(`${apiBaseUrl}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ status }),
      });
      await fetchServerOrders();
    } catch {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleServerShippingUpdate = async (orderId: string, trackingNo: string) => {
    if (!session?.accessToken) return;
    try {
      await fetch(`${apiBaseUrl}/orders/${orderId}/shipping`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ trackingCompany: 'CJ', trackingNo }),
      });
      await fetchServerOrders();
    } catch {
      alert('운송장 등록에 실패했습니다.');
    }
  };

  if (!mounted) {
    return (
      <AppShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <ShieldCheck className="mx-auto animate-pulse text-slate-300" size={48} />
            <p className="mt-4 font-black text-slate-500">권한 확인 중...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-400" size={48} />
            <p className="mt-4 font-black text-slate-600">관리자 권한이 필요합니다.</p>
            <Link className="mt-4 inline-block rounded-xl bg-brand px-6 py-3 font-black text-white" href="/login">
              로그인
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid gap-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">관리자 대시보드</h1>
              <p className="text-xs text-slate-400">JHS Computer Admin</p>
            </div>
          </div>
          <Button onClick={() => { void fetchServerOrders(); }} type="button" variant="outline">
            <RefreshCcw size={14} />
            새로고침
          </Button>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1 w-fit">
          {(
            [
              { key: 'orders', label: '주문', badge: serverOrders.length },
              { key: 'recommendations', label: '추천 게시글', badge: null },
              { key: 'agents', label: '에이전트', badge: null },
            ] as const
          ).map(({ key, label, badge }) => (
            <button
              key={key}
              className={`relative rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                tab === key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setTab(key)}
              type="button"
            >
              {label}
              {badge !== null && badge > 0 && (
                <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-black text-white">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        {tab === 'agents' ? (
          <AgentRunner accessToken={session?.accessToken} />
        ) : tab === 'recommendations' ? (
          <RecommendationPostManager accessToken={session?.accessToken} />
        ) : (
          <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            {/* 주문 목록 */}
            <PanelCard>
              {loading ? (
                <div className="flex h-32 items-center justify-center text-slate-400">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                </div>
              ) : serverOrders.length > 0 ? (
                <div className="grid gap-1.5">
                  {serverOrders.map((order) => (
                    <button
                      key={order.id}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        selectedServerOrder?.id === order.id
                          ? 'border-brand bg-teal-50 shadow-sm'
                          : 'border-slate-100 hover:border-brand hover:bg-slate-50'
                      }`}
                      onClick={() => setSelectedServerOrder(order)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-xs font-black text-slate-700">{order.orderNo}</strong>
                        <StatusBadge label={statusLabels[order.status as OrderStatus] ?? order.status} status={order.status} />
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        {order.recipientName} · {order.totalPrice.toLocaleString()}원
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center text-center text-slate-400">
                  <div>
                    <Package size={28} className="mx-auto text-slate-200" />
                    <p className="mt-2 text-xs">저장된 주문이 없습니다</p>
                  </div>
                </div>
              )}
            </PanelCard>

            {/* 주문 상세 */}
            <PanelCard>
              {selectedServerOrder ? (
                <div className="grid gap-5">
                  <div className="border-b border-slate-100 pb-4">
                    <p className="text-xs font-bold text-brand">{selectedServerOrder.orderNo}</p>
                    <h2 className="mt-1 text-xl font-black">{selectedServerOrder.recipientName}님 주문</h2>
                    <p className="text-sm text-slate-400">{selectedServerOrder.recipientPhone} · {selectedServerOrder.address1}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 rounded-xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-500">현재 상태</span>
                    <span className="text-right font-black text-brand">
                      {statusLabels[selectedServerOrder.status as OrderStatus] ?? selectedServerOrder.status}
                    </span>
                    <span className="text-slate-500">총 금액</span>
                    <span className="text-right font-black">{selectedServerOrder.totalPrice.toLocaleString()}원</span>
                    {selectedServerOrder.deliveryMemo && (
                      <>
                        <span className="text-slate-500">배송 메모</span>
                        <span className="text-right">{selectedServerOrder.deliveryMemo}</span>
                      </>
                    )}
                    {selectedServerOrder.trackingNo && (
                      <>
                        <span className="text-slate-500">운송장</span>
                        <span className="text-right font-black">
                          {getTrackingCompanyLabel(selectedServerOrder.trackingCompany)} · {selectedServerOrder.trackingNo}
                        </span>
                      </>
                    )}
                  </div>

                  <ShippingEditor
                    currentTrackingNo={selectedServerOrder.trackingNo ?? ''}
                    onSubmit={(trackingNo) => handleServerShippingUpdate(selectedServerOrder.id, trackingNo)}
                  />

                  <div>
                    <h3 className="text-sm font-black text-slate-700">상태 변경</h3>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {[...orderFlow, 'ON_HOLD', 'CANCELLED'].map((status) => (
                        <button
                          key={status}
                          className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                            selectedServerOrder.status === status
                              ? 'border-brand bg-teal-50 text-brand'
                              : 'border-slate-100 hover:border-brand hover:bg-slate-50'
                          }`}
                          onClick={() => handleServerStatusChange(selectedServerOrder.id, status)}
                          type="button"
                        >
                          {statusLabels[status as OrderStatus] ?? status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedServerOrder.items?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-black text-slate-700">주문 부품</h3>
                      <div className="mt-2 overflow-hidden rounded-xl border border-slate-100">
                        {selectedServerOrder.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between border-t border-slate-100 px-3 py-2.5 first:border-t-0"
                          >
                            <div className="min-w-0">
                              <span className="mr-2 text-xs font-black text-brand">{item.categoryCode}</span>
                              <span className="text-xs text-slate-700">{item.partNameSnapshot}</span>
                            </div>
                            <span className="ml-3 shrink-0 text-xs font-bold text-slate-600">
                              {item.publicPrice.toLocaleString()}원
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedServerOrder.statusHistories?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-black text-slate-700">상태 이력</h3>
                      <div className="mt-2 grid gap-1.5">
                        {selectedServerOrder.statusHistories.map((h, i) => (
                          <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                            <strong className="text-xs font-black">
                              {statusLabels[h.toStatus as OrderStatus] ?? h.toStatus}
                            </strong>
                            {h.memo && <p className="mt-1 text-xs text-slate-500">{h.memo}</p>}
                            <p className="mt-1 text-[11px] text-slate-400">
                              {new Date(h.createdAt).toLocaleString('ko-KR')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex min-h-64 items-center justify-center text-sm text-slate-400">
                  좌측에서 주문을 선택하세요
                </div>
              )}
            </PanelCard>
          </section>
        )}
      </div>
    </AppShell>
  );
}

/* ──────────────────────────────────────────────────
   AgentRunner — 에이전트 실행 패널
────────────────────────────────────────────────── */

const PIPELINE_STEPS = [
  'crawl:compuzone:samples',
  'sync:compuzone:db',
  'sync:kjwwang:benchmark-db',
  'crawl:wanggapc:html',
  'sync:wanggapc:builds-db',
  'generate:jhs-recommendations',
];

const AGENTS = [
  { scriptName: 'sync:kjwwang:benchmark-db',   label: '게임 벤치마크 → DB',  desc: 'kjwwang FPS 데이터 싱크',   emoji: '🎮' },
  { scriptName: 'crawl:compuzone:samples',      label: '컴퓨존 샘플 크롤링', desc: '주간 샘플 가격 수집',        emoji: '🕷️' },
  { scriptName: 'sync:compuzone:db',            label: '컴퓨존 → DB 동기화', desc: '크롤 결과 DB 반영',          emoji: '🗄️' },
  { scriptName: 'crawl:wanggapc:html',          label: '왕가PC 빌드 수집',   desc: 'HTML 수집 후 파싱',          emoji: '📥' },
  { scriptName: 'sync:wanggapc:builds-db',      label: '왕가PC → DB 동기화', desc: '빌드 구성 DB 반영',          emoji: '🗄️' },
  { scriptName: 'generate:jhs-recommendations', label: '추천 포스트 생성',   desc: 'AI 기반 게시글 자동 작성',   emoji: '✍️' },
  { scriptName: 'sync:catalog',                 label: '카탈로그 동기화',    desc: '공급업체 카탈로그 통합',     emoji: '🔄' },
] as const;

type AgentStatus = 'idle' | 'running' | 'done' | 'error';

function AgentRunner({ accessToken }: { accessToken?: string }) {
  const [statuses, setStatuses] = useState<Record<string, AgentStatus>>({});
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [pipelineMode, setPipelineMode] = useState<'samples' | 'full'>('samples');

  const isAnyRunning = Object.values(statuses).includes('running') || pipelineStatus === 'running';

  const pollJob = async (scriptName: string, jobId: string) => {
    if (!accessToken) return;
    try {
      const res = await fetch(`${apiBaseUrl}/admin/agents/jobs`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const jobs = await res.json() as Array<{ jobId: string; scriptName: string; status: AgentStatus }>;
      const job = jobs.find(j => j.jobId === jobId);
      if (!job) return;

      if (scriptName.startsWith('pipeline:')) {
        setPipelineStatus(job.status === 'idle' ? 'idle' : job.status);
      } else {
        setStatuses(prev => ({ ...prev, [scriptName]: job.status }));
      }

      if (job.status === 'running') {
        setTimeout(() => { void pollJob(scriptName, jobId); }, 3000);
      }
    } catch {}
  };

  const runScript = async (scriptName: string) => {
    if (!accessToken || isAnyRunning) return;

    if (scriptName.startsWith('pipeline:')) {
      setPipelineStatus('running');
    } else {
      setStatuses(prev => ({ ...prev, [scriptName]: 'running' }));
    }

    try {
      const res = await fetch(`${apiBaseUrl}/admin/agents/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ scriptName }),
      });
      if (!res.ok) {
        if (scriptName.startsWith('pipeline:')) {
          setPipelineStatus('error');
        } else {
          setStatuses(prev => ({ ...prev, [scriptName]: 'error' }));
        }
        return;
      }
      const { jobId } = await res.json() as { jobId: string };
      setTimeout(() => { void pollJob(scriptName, jobId); }, 2000);
    } catch {
      if (scriptName.startsWith('pipeline:')) {
        setPipelineStatus('error');
      } else {
        setStatuses(prev => ({ ...prev, [scriptName]: 'error' }));
      }
    }
  };

  const agentStatusStyle: Record<AgentStatus, string> = {
    idle:    'bg-slate-100 text-slate-400',
    running: 'bg-amber-100 text-amber-600 animate-pulse',
    done:    'bg-green-100 text-green-700',
    error:   'bg-red-100 text-red-600',
  };
  const agentStatusLabel: Record<AgentStatus, string> = {
    idle: '대기', running: '실행 중', done: '완료', error: '실패',
  };

  return (
    <div className="grid gap-5">
      {/* ── 파이프라인 전체 실행 ── */}
      <div className="overflow-hidden rounded-2xl bg-slate-900 text-white">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-teal-400 shrink-0" />
                <h2 className="font-black text-white">크롤링 파이프라인</h2>
                {pipelineStatus === 'running' && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-black text-amber-400 animate-pulse">
                    실행 중
                  </span>
                )}
                {pipelineStatus === 'done' && (
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[11px] font-black text-green-400">
                    완료
                  </span>
                )}
                {pipelineStatus === 'error' && (
                  <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[11px] font-black text-red-400">
                    실패
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-400">
                6단계 자동 순서 실행 · Discord 알림 포함
              </p>
              {/* 단계 목록 */}
              <div className="mt-3 flex flex-wrap items-center gap-1">
                {PIPELINE_STEPS.map((step, i) => (
                  <span key={step} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight size={10} className="text-slate-600 shrink-0" />}
                    <span className="rounded-md bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                      {step}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* 실행 버튼 */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition-all ${
                  isAnyRunning
                    ? 'cursor-not-allowed bg-slate-700 text-slate-400'
                    : 'bg-teal-500 text-white hover:bg-teal-400'
                }`}
                disabled={isAnyRunning}
                onClick={() => { setPipelineMode('samples'); void runScript('pipeline:samples'); }}
                type="button"
              >
                <Play size={14} />
                샘플 실행
              </button>
              <button
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition-all ${
                  isAnyRunning
                    ? 'cursor-not-allowed bg-slate-700 text-slate-400'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
                disabled={isAnyRunning}
                onClick={() => { setPipelineMode('full'); void runScript('pipeline:full'); }}
                type="button"
              >
                <Zap size={14} />
                전체 실행
              </button>
            </div>
          </div>
        </div>
        {/* 실행 중 프로그레스 바 */}
        {pipelineStatus === 'running' && (
          <div className="h-0.5 bg-slate-800">
            <div className="h-full animate-[progress_2s_ease-in-out_infinite] bg-teal-500" style={{ width: '60%' }} />
          </div>
        )}
      </div>

      {/* ── 개별 에이전트 ── */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <CircleDot size={14} className="text-slate-400" />
          <h3 className="text-sm font-black text-slate-500">개별 에이전트</h3>
          {isAnyRunning && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
              실행 중에는 비활성
            </span>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {AGENTS.map(({ scriptName, label, desc, emoji }) => {
            const st: AgentStatus = statuses[scriptName] ?? 'idle';
            const isRunning = st === 'running';
            return (
              <div
                key={scriptName}
                className={`group flex items-center gap-4 rounded-xl border bg-white p-4 transition-all ${
                  isRunning
                    ? 'border-amber-200 shadow-sm shadow-amber-100'
                    : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl">
                  {emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-800">{label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${agentStatusStyle[st]}`}>
                      {agentStatusLabel[st]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{desc}</p>
                  <code className="mt-1 block truncate font-mono text-[10px] text-slate-300">{scriptName}</code>
                </div>
                <button
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-black transition-all ${
                    isRunning || isAnyRunning
                      ? 'cursor-not-allowed bg-slate-100 text-slate-300'
                      : 'bg-slate-900 text-white hover:bg-slate-700'
                  }`}
                  disabled={isRunning || isAnyRunning}
                  onClick={() => { void runScript(scriptName); }}
                  type="button"
                >
                  {isRunning ? (
                    <span className="flex items-center gap-1">
                      <div className="h-2.5 w-2.5 animate-spin rounded-full border border-slate-300 border-t-transparent" />
                      실행 중
                    </span>
                  ) : '실행'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        실행 결과 상세는 Discord 에이전트 채널에서 확인하세요
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────
   ShippingEditor
────────────────────────────────────────────────── */
function ShippingEditor({
  currentTrackingNo,
  onSubmit,
}: {
  currentTrackingNo: string;
  onSubmit: (trackingNo: string) => void;
}) {
  const [trackingNo, setTrackingNo] = useState(currentTrackingNo);

  useEffect(() => {
    setTrackingNo(currentTrackingNo);
  }, [currentTrackingNo]);

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <h3 className="text-sm font-black text-slate-700">CJ대한통운 송장 등록</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
        <TextInput
          onChange={(e) => setTrackingNo(e.target.value)}
          placeholder="송장번호 입력"
          value={trackingNo}
        />
        <Button onClick={() => onSubmit(trackingNo)} type="button" variant="dark">
          저장
        </Button>
      </div>
      {trackingNo && (
        <a
          className="mt-2 inline-flex text-xs font-black text-brand hover:underline"
          href={getCjTrackingUrl(trackingNo)}
          rel="noreferrer"
          target="_blank"
        >
          CJ 배송현황 확인 →
        </a>
      )}
    </div>
  );
}
