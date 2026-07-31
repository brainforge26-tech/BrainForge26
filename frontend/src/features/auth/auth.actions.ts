'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const BASE = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5001/api/v1';

// ─── Schemas ──────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  email:         z.string().email('Invalid email'),
  password:      z.string().min(8, 'At least 8 characters'),
  companyName:   z.string().min(2, 'Company name required'),
  contactPerson: z.string().min(2, 'Contact person required'),
  phone:         z.string().optional(),
});

const forgotSchema = z.object({
  email: z.string().email('Invalid email'),
});

const resetSchema = z.object({
  token:    z.string().min(1),
  password: z.string().min(8, 'At least 8 characters'),
});

// ─── Shared result type ───────────────────────────────────────────────────────
// Using `unknown` keeps it compatible with useActionState's initial state
export type ActionState =
  | { success: true;  message: string; role?: string }
  | { success: false; error: string };

// ─── helpers ─────────────────────────────────────────────────────────────────
async function apiPost<T = unknown>(path: string, body: unknown): Promise<{ data: T; message: string }> {
  const res  = await fetch(`${BASE}${path}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
    cache:   'no-store',
  });
  const json = await res.json() as { success: boolean; message: string; data: T };
  if (!res.ok) throw new Error((json as unknown as { message?: string }).message ?? `Error ${res.status}`);
  return { data: json.data, message: json.message };
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    email:    formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const { data, message } = await apiPost<{ accessToken: string; user: { role: string } }>(
      '/auth/login',
      parsed.data,
    );

    const cookieStore = await cookies();
    cookieStore.set('accessToken', data.accessToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path:     '/',
      maxAge:   15 * 60,
    });
    cookieStore.set('userRole', data.user.role, {
      httpOnly: false,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path:     '/',
      maxAge:   30 * 24 * 60 * 60,
    });

    return { success: true, message, role: data.user.role };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    email:         formData.get('email'),
    password:      formData.get('password'),
    companyName:   formData.get('companyName'),
    contactPerson: formData.get('contactPerson'),
    phone:         formData.get('phone') || undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const { message } = await apiPost('/auth/register', parsed.data);
    return { success: true, message };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
export async function forgotPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw    = { email: formData.get('email') };
  const parsed = forgotSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const { message } = await apiPost('/auth/forgot-password', parsed.data);
    return { success: true, message };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    token:    formData.get('token'),
    password: formData.get('password'),
  };
  const parsed = resetSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const { message } = await apiPost('/auth/reset-password', parsed.data);
    return { success: true, message };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (token) {
    try {
      await fetch(`${BASE}/auth/logout`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
        cache:   'no-store',
      });
    } catch { /* best-effort */ }
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('userRole');
  redirect('/login');
}
