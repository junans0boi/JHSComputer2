'use client';

import { getSession } from './auth-client';
import type { Quote } from './v1-types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

export async function syncCartQuoteToServer(quote: Quote) {
  const session = getSession();
  if (!session?.accessToken) return false;
  const response = await fetch(`${apiBaseUrl}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({ clientCartId: quote.id, quote }),
  });
  return response.ok;
}

export async function loadServerCartQuotes() {
  const session = getSession();
  if (!session?.accessToken) return { items: [], total: 0 };
  const response = await fetch(`${apiBaseUrl}/cart`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  if (!response.ok) return { items: [], total: 0 };
  return response.json();
}

export async function deleteServerCartQuote(cartQuoteId: string) {
  const session = getSession();
  if (!session?.accessToken) return false;
  const response = await fetch(`${apiBaseUrl}/cart/${encodeURIComponent(cartQuoteId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  return response.ok;
}
