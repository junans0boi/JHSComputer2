'use client';

export type LoginUser = {
  id: string;
  loginId: string;
  name: string;
  nickname: string | null;
  email: string | null;
  role: 'ADMIN' | 'USER';
  status: string;
};

const sessionKey = 'jhs-auth-session';

export function getSession(): { accessToken: string; user: LoginUser } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(sessionKey);
  return raw ? JSON.parse(raw) : null;
}

export function saveSession(session: { accessToken: string; user: LoginUser }) {
  localStorage.setItem(sessionKey, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(sessionKey);
}

export function getSafeReturnPath(value: string | null | undefined, fallback: string) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : fallback;
}
