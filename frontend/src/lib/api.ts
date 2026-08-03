/**
 * Server-side fetch helper for Next.js Server Components & Server Actions.
 * Uses native `fetch` API with fallback URL support for VPS deployment resilience.
 */

import { cookies } from 'next/headers';

const BASE = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5001/api/v1';

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  tags?: string[];
  revalidate?: number | false;
};

/**
 * Authenticated server-fetch — reads the access token from the cookie store
 */
export async function serverFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, tags, revalidate, headers: extraHeaders, ...rest } = options;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(extraHeaders as Record<string, string>),
  };

  const nextOptions: RequestInit['next'] = { revalidate: 0 };
  if (tags) nextOptions.tags = tags;
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;

  const targetUrls = Array.from(new Set([
    `${BASE}${path}`,
    `http://127.0.0.1:5001/api/v1${path}`,
    `http://localhost:5001/api/v1${path}`,
  ]));

  let lastError: any;
  for (const url of targetUrls) {
    try {
      const res = await fetch(url, {
        ...rest,
        headers,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        next: Object.keys(nextOptions).length ? nextOptions : undefined,
      });

      if (res.ok) {
        return res.json() as Promise<T>;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to fetch ${path}`);
}

/** Public (unauthenticated) server fetch with VPS fallback URLs */
export async function publicFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, tags, revalidate, headers: extraHeaders, ...rest } = options;

  const nextOptions: RequestInit['next'] = { revalidate: 0 };
  if (tags) nextOptions.tags = tags;
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;

  const targetUrls = Array.from(new Set([
    `${BASE}${path}`,
    `http://127.0.0.1:5001/api/v1${path}`,
    `http://localhost:5001/api/v1${path}`,
  ]));

  let lastError: any;
  for (const url of targetUrls) {
    try {
      const res = await fetch(url, {
        ...rest,
        headers: {
          'Content-Type': 'application/json',
          ...(extraHeaders as Record<string, string>),
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        next: Object.keys(nextOptions).length ? nextOptions : undefined,
      });

      if (res.ok) {
        return res.json() as Promise<T>;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to publicFetch ${path}`);
}
