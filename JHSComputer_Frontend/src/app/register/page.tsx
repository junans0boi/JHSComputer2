'use client';

import { Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { saveSession } from '@/lib/auth-client';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ loginId: '', password: '', confirmPassword: '', name: '', email: '', nickname: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (form.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (!form.loginId || !form.name) {
      setError('아이디와 이름은 필수 입력 항목입니다.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: form.loginId,
          password: form.password,
          name: form.name,
          email: form.email || undefined,
          nickname: form.nickname || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? '회원가입에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      saveSession({ accessToken: data.accessToken, user: data.user });
      router.push('/mypage');
    } catch {
      setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft md:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
              <UserPlus className="text-brand" size={28} />
            </div>
            <h1 className="text-2xl font-black">회원가입</h1>
            <p className="mt-1 text-sm text-slate-500">JHS Computer 서비스를 이용하려면 계정이 필요합니다.</p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-1.5">
              <span className="text-sm font-black">아이디 *</span>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  autoComplete="username"
                  className="h-12 w-full rounded-xl border border-line bg-white pl-9 pr-4 text-sm focus:border-brand focus:outline-none"
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, loginId: e.target.value })}
                  placeholder="영문+숫자 6~20자"
                  required
                  type="text"
                  value={form.loginId}
                />
              </div>
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-black">이름 *</span>
              <input
                className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm focus:border-brand focus:outline-none"
                disabled={loading}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="실명 또는 닉네임"
                required
                type="text"
                value={form.name}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-black">이메일</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-line bg-white pl-9 pr-4 text-sm focus:border-brand focus:outline-none"
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="선택 입력"
                  type="email"
                  value={form.email}
                />
              </div>
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-black">비밀번호 *</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-line bg-white pl-9 pr-10 text-sm focus:border-brand focus:outline-none"
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="6자 이상"
                  required
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  onClick={() => setShowPw(!showPw)}
                  type="button"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-black">비밀번호 확인 *</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-line bg-white pl-9 pr-4 text-sm focus:border-brand focus:outline-none"
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="비밀번호 재입력"
                  required
                  type={showPw ? 'text' : 'password'}
                  value={form.confirmPassword}
                />
              </div>
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            <button
              className="mt-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-brand font-black text-white transition hover:bg-ink disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-500">
            이미 계정이 있으신가요?{' '}
            <Link className="font-black text-brand hover:underline" href="/login">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
