'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { saveSession } from '@/lib/auth-client';

function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      router.push('/login?error=oauth');
      return;
    }

    saveSession({
      accessToken: token,
      user: {
        id: params.get('id') ?? '',
        loginId: params.get('loginId') ?? '',
        name: params.get('name') ?? '',
        nickname: params.get('nickname') || null,
        email: params.get('email') || null,
        role: (params.get('role') ?? 'USER') as 'ADMIN' | 'USER',
        status: params.get('status') ?? 'ACTIVE',
      },
    });

    router.push(params.get('role') === 'ADMIN' ? '/admin' : '/mypage');
  }, [params, router]);

  return (
    <AppShell>
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">Google 로그인 처리 중...</p>
        </div>
      </div>
    </AppShell>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}
