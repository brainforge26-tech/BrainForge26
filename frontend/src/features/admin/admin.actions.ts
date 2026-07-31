'use server';

import { revalidatePath } from 'next/cache';
import { z }              from 'zod';

const BASE = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5001/api/v1';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ManagerProfile = {
  id: string; firstName: string; lastName: string;
  phone: string | null; department: string | null; bio: string | null; avatar: string | null;
};
export type Manager = {
  id: string; email: string; isActive: boolean; createdAt: string;
  managerProfile: ManagerProfile | null;
};
export type AdminStats = {
  totalManagers: number; totalDevelopers: number; totalClients: number;
  totalProjects: number; activeProjects: number; completedProjects: number; totalRevenue: number;
};
export type ActionState = { success: true; message: string } | { success: false; error: string };

// ─── Schemas ──────────────────────────────────────────────────────────────────
const createSchema = z.object({
  email:      z.string().email('Invalid email'),
  password:   z.string().min(8, 'Min 8 characters'),
  firstName:  z.string().min(1, 'First name required'),
  lastName:   z.string().min(1, 'Last name required'),
  phone:      z.string().optional(),
  department: z.string().optional(),
});

const updateSchema = z.object({
  firstName:  z.string().min(1).optional(),
  lastName:   z.string().min(1).optional(),
  phone:      z.string().optional(),
  department: z.string().optional(),
  bio:        z.string().optional(),
});

// ─── Internal auth helper ─────────────────────────────────────────────────────
async function getToken(): Promise<string> {
  const { cookies } = await import('next/headers');
  return (await cookies()).get('accessToken')?.value ?? '';
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers as Record<string, string>),
    },
    cache: 'no-store',
  });
  const json = await res.json() as { data: T; message?: string };
  if (!res.ok) throw new Error((json as unknown as { message?: string }).message ?? `Error ${res.status}`);
  return json as T;
}

// ─── Fetch stats ──────────────────────────────────────────────────────────────
export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await apiFetch<{ data: AdminStats }>('/admin/stats');
  return res.data;
}

// ─── Fetch managers ───────────────────────────────────────────────────────────
export async function fetchManagers(page = 1, search = ''): Promise<{
  managers: Manager[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}> {
  const params = new URLSearchParams({ page: String(page), limit: '10', ...(search ? { search } : {}) });
  const res = await apiFetch<{ data: { managers: Manager[]; pagination: { total: number; page: number; limit: number; totalPages: number } } }>(
    `/admin/managers?${params}`,
  );
  return res.data;
}

// ─── Create manager ───────────────────────────────────────────────────────────
export async function createManagerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    email:      formData.get('email'),
    password:   formData.get('password'),
    firstName:  formData.get('firstName'),
    lastName:   formData.get('lastName'),
    phone:      formData.get('phone')      || undefined,
    department: formData.get('department') || undefined,
  };
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const res = await apiFetch<{ message: string }>('/admin/managers', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    });
    revalidatePath('/admin/managers');
    revalidatePath('/admin');
    return { success: true, message: (res as { message?: string }).message ?? 'Manager created' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ─── Update manager ───────────────────────────────────────────────────────────
export async function updateManagerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id  = formData.get('id') as string;
  const raw = {
    firstName:  formData.get('firstName')  || undefined,
    lastName:   formData.get('lastName')   || undefined,
    phone:      formData.get('phone')      || undefined,
    department: formData.get('department') || undefined,
    bio:        formData.get('bio')        || undefined,
  };
  const parsed = updateSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    await apiFetch(`/admin/managers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(parsed.data),
    });
    revalidatePath('/admin/managers');
    return { success: true, message: 'Manager updated' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ─── Deactivate manager ───────────────────────────────────────────────────────
export async function deactivateManagerAction(id: string): Promise<ActionState> {
  try {
    await apiFetch(`/admin/managers/${id}/deactivate`, { method: 'PATCH' });
    revalidatePath('/admin/managers');
    return { success: true, message: 'Manager deactivated' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ─── Delete manager ───────────────────────────────────────────────────────────
export async function deleteManagerAction(id: string): Promise<ActionState> {
  try {
    await apiFetch(`/admin/managers/${id}`, { method: 'DELETE' });
    revalidatePath('/admin/managers');
    return { success: true, message: 'Manager deleted' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ─── Toggle user active status ─────────────────────────────────────────────
export async function toggleUserStatusAction(id: string): Promise<ActionState> {
  try {
    await apiFetch(`/admin/managers/${id}/deactivate`, { method: 'PATCH' });
    revalidatePath('/admin/managers');
    return { success: true, message: 'User status updated' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
