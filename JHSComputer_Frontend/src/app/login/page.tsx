'use client';

import { Eye, EyeOff, Lock, Monitor, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { saveSession } from '@/lib/auth-client';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loginId || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? '아이디 또는 비밀번호가 올바르지 않습니다.');
      }
      const session = await response.json();
      saveSession(session);
      router.push(session.user.role === 'ADMIN' ? '/admin' : '/mypage');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto mt-4 w-full max-w-sm">
        {/* 로고 */}
        <div className="mb-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-700 text-white">
            <Monitor size={28} />
          </div>
          <h1 className="mt-4 text-2xl font-black">로그인</h1>
          <p className="mt-1 text-sm text-slate-500">JHS Computer 서비스에 오신 것을 환영합니다</p>
        </div>

        <form className="rounded-2xl border border-line bg-white p-6 shadow-soft" onSubmit={submit}>
          <div className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-bold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <User size={14} />
                아이디
              </span>
              <input
                autoComplete="username"
                className="h-12 rounded-xl border border-line px-4 outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="아이디 입력"
                value={loginId}
              />
            </label>

            <label className="grid gap-1.5 text-sm font-bold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Lock size={14} />
                비밀번호
              </span>
              <div className="relative">
                <input
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-line px-4 pr-12 outline-none transition focus:border-brand focus:ring-2 focus:ring-teal-100"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  onClick={() => setShowPw(!showPw)}
                  type="button"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
                ⚠️ {error}
              </div>
            )}

            <button
              className="h-12 rounded-xl bg-brand font-black text-white transition hover:bg-teal-900 disabled:opacity-50"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  로그인 중...
                </span>
              ) : (
                '로그인'
              )}
            </button>
          </div>
        </form>

        {/* 하단 링크 */}
        <div className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-soft">
          <div className="flex flex-col items-center gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span>계정이 없으신가요?</span>
              <Link className="font-black text-brand hover:underline" href="/register">
                회원가입 →
              </Link>
            </div>
            <div className="h-px w-full bg-line" />
            <p className="text-xs">로그인 없이도 견적 조회·주문이 가능합니다</p>
            <Link className="font-black text-brand hover:underline" href="/quote">
              바로 견적 받기 →
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
