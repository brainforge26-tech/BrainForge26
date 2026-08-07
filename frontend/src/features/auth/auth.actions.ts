'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const BASE = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api/v1';

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

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});


// ─── Shared result type ───────────────────────────────────────────────────────
export type ActionState =
  | { success: true;  message: string; role?: string }
  | { success: false; error: string };

// ─── helpers ─────────────────────────────────────────────────────────────────
async function apiPost<T = unknown>(path: string, body: unknown): Promise<{ data: T; message: string }> {
  const targetUrls = Array.from(new Set([
    `${BASE}${path}`,
    `http://127.0.0.1:5001/api/v1${path}`,
    `https://api.brainforge26.tech/api/v1${path}`,
  ]));

  let lastError: Error = new Error('Failed to connect to authentication service');

  for (const url of targetUrls) {
    try {
      const res = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
        cache:   'no-store',
      });

      const text = await res.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        if (!res.ok) {
          throw new Error(`Server returned HTTP ${res.status}. Please check backend service status.`);
        }
        throw new Error('Invalid response received from authentication server');
      }

      if (!res.ok || json?.success === false) {
        throw new Error(json?.message ?? `Error ${res.status}`);
      }
      return { data: json.data, message: json.message };
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError;
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
      maxAge:   30 * 24 * 60 * 60,
    });
    // Non-httpOnly token for client-side Axios requests
    cookieStore.set('authToken', data.accessToken, {
      httpOnly: false,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path:     '/',
      maxAge:   30 * 24 * 60 * 60,
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

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    currentPassword: formData.get('currentPassword'),
    newPassword:     formData.get('newPassword'),
  };
  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value || cookieStore.get('authToken')?.value;

  if (!token) {
    return { success: false, error: 'Not authenticated. Please log in again.' };
  }

  try {
    const targetUrls = Array.from(new Set([
      `${BASE}/auth/change-password`,
      `http://127.0.0.1:5001/api/v1/auth/change-password`,
      `https://api.brainforge26.tech/api/v1/auth/change-password`,
    ]));

    let lastError: Error = new Error('Failed to connect to authentication service');

    for (const url of targetUrls) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(parsed.data),
          cache: 'no-store',
        });

        const text = await res.text();
        let json: any;
        try { json = JSON.parse(text); } catch {
          if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
          throw new Error('Invalid response received');
        }

        if (!res.ok || json?.success === false) {
          throw new Error(json?.message ?? `Error ${res.status}`);
        }

        // Clean up session cookies upon successful password change
        cookieStore.delete('accessToken');
        cookieStore.delete('authToken');
        cookieStore.delete('userRole');

        return { success: true, message: json.message || 'Password changed successfully. Please log in again.' };
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError;
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
  cookieStore.delete('authToken');
  cookieStore.delete('userRole');
  redirect('/login');
}

