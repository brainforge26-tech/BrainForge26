/**
 * Server-side fetch helper for Next.js Server Components & Server Actions.
 * Uses the native `fetch` API (no Axios) so it works in the Node.js runtime
 * with full Next.js caching support.
 *
 * For client-side mutations (forms, etc.) the existing apiClient (Axios) is used.
 */

import { cookies } from 'next/headers';

const BASE = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5001/api/v1';

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** Next.js cache tag(s) for on-demand revalidation */
  tags?: string[];
  /** Revalidation interval in seconds. 0 = no-store */
  revalidate?: number | false;
};

/**
 * Authenticated server-fetch — reads the access token from the cookie store
 * (available in Server Components and Route Handlers).
 */
export async function serverFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, tags, revalidate, headers: extraHeaders, ...rest } = options;

  // Read access token stored in httpOnly cookie by the login action
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(extraHeaders as Record<string, string>),
  };

  const nextOptions: RequestInit['next'] = {};
  if (tags)        nextOptions.tags       = tags;
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    next: Object.keys(nextOptions).length ? nextOptions : undefined,
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const json = await res.json() as { message?: string };
      message = json.message ?? message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

/** Public (unauthenticated) server fetch */
export async function publicFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, tags, revalidate, headers: extraHeaders, ...rest } = options;

  const nextOptions: RequestInit['next'] = {};
  if (tags)        nextOptions.tags       = tags;
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(extraHeaders as Record<string, string>),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    next: Object.keys(nextOptions).length ? nextOptions : undefined,
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const json = await res.json() as { message?: string };
      message = json.message ?? message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
