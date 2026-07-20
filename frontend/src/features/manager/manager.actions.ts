'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ProjectStatus = 'PENDING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type Priority      = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type Project = {
  id: string; name: string; description: string | null; projectType: string | null;
  status: ProjectStatus; priority: Priority; completionPercent: number;
  startDate: string | null; estimatedDelivery: string | null;
  technologies: string[]; managerNotes: string | null; createdAt: string;
  client: { id: string; companyName: string; contactPerson: string } | null;
  manager: { id: string; email: string; managerProfile: { firstName: string; lastName: string } | null } | null;
  developers: { developer: { id: string; email: string; developerProfile: { firstName: string; lastName: string; title: string | null } | null } }[];
  _count: { progressUpdates: number; files: number; payments: number };
};

export type PricingPlan = {
  id: string; name: string; description: string | null; price: string;
  currency: string; billingCycle: string; features: string[];
  isPopular: boolean; isActive: boolean; order: number;
};

export type Client = {
  id: string; companyName: string; contactPerson: string;
  phone: string | null; website: string | null; companyLogo: string | null;
  user: { email: string; isActive: boolean; createdAt: string };
  _count?: { projects: number };
};

export type Developer = {
  id: string; firstName: string; lastName: string; title: string | null;
  skills: string[]; experience: number | null; isAvailable: boolean;
  user: { email: string; isActive: boolean };
};

export type ActionState = { success: true; message: string } | { success: false; error: string };

// ─── Schemas ──────────────────────────────────────────────────────────────────
const createProjectSchema = z.object({
  name:              z.string().min(2, 'Project name required'),
  description:       z.string().optional(),
  projectType:       z.string().optional(),
  clientId:          z.string().min(1, 'Client is required'),
  priority:          z.enum(['LOW','MEDIUM','HIGH','URGENT']).default('MEDIUM'),
  technologies:      z.string().optional(), // comma-separated
  estimatedDelivery: z.string().optional(),
  budget:            z.coerce.number().positive().optional(),
});

const createPricingSchema = z.object({
  name:         z.string().min(1, 'Name required'),
  description:  z.string().optional(),
  price:        z.coerce.number().nonnegative('Price must be 0+'),
  billingCycle: z.string().default('one-time'),
  features:     z.string().optional(), // newline-separated
  isPopular:    z.coerce.boolean().default(false),
});

// ─── Auth helper ──────────────────────────────────────────────────────────────
async function getToken() {
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

// ─── Fetch projects ───────────────────────────────────────────────────────────
export async function fetchProjects(page = 1, search = '', status?: ProjectStatus) {
  const p = new URLSearchParams({ page: String(page), limit: '10', ...(search ? { search } : {}), ...(status ? { status } : {}) });
  const res = await apiFetch<{ data: { projects: Project[]; pagination: { total: number; page: number; limit: number; totalPages: number } } }>(`/projects?${p}`);
  return res.data;
}

// ─── Fetch clients ────────────────────────────────────────────────────────────
export async function fetchClients() {
  const res = await apiFetch<{ data: { clients: Client[] } }>('/admin/managers'); // reuse for now
  return (res as { data?: { clients?: Client[] } }).data?.clients ?? [];
}

// ─── Fetch developers ─────────────────────────────────────────────────────────
export async function fetchDevelopers(): Promise<Developer[]> {
  try {
    const res = await apiFetch<{ data: { developers: Developer[] } }>('/users/developers');
    return res.data?.developers ?? [];
  } catch { return []; }
}

// ─── Fetch pricing plans ──────────────────────────────────────────────────────
export async function fetchPricingPlans(): Promise<PricingPlan[]> {
  const res = await apiFetch<{ data: { plans: PricingPlan[] } }>('/pricing');
  return (res as { data?: { plans?: PricingPlan[] } }).data?.plans ?? [];
}

// ─── Create project ───────────────────────────────────────────────────────────
export async function createProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    name:              formData.get('name'),
    description:       formData.get('description')       || undefined,
    projectType:       formData.get('projectType')       || undefined,
    clientId:          formData.get('clientId'),
    priority:          formData.get('priority') || 'MEDIUM',
    technologies:      formData.get('technologies')      || undefined,
    estimatedDelivery: formData.get('estimatedDelivery') || undefined,
    budget:            formData.get('budget')            || undefined,
  };
  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const body = {
      ...parsed.data,
      technologies: parsed.data.technologies ? parsed.data.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
      estimatedDelivery: parsed.data.estimatedDelivery ? new Date(parsed.data.estimatedDelivery).toISOString() : undefined,
    };
    await apiFetch('/projects', { method: 'POST', body: JSON.stringify(body) });
    revalidatePath('/manager/projects');
    return { success: true, message: 'Project created successfully' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Update project status ────────────────────────────────────────────────────
export async function updateProjectStatusAction(id: string, status: ProjectStatus): Promise<ActionState> {
  try {
    await apiFetch(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    revalidatePath('/manager/projects');
    return { success: true, message: 'Status updated' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Create pricing plan ──────────────────────────────────────────────────────
export async function createPricingAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    name:         formData.get('name'),
    description:  formData.get('description') || undefined,
    price:        formData.get('price'),
    billingCycle: formData.get('billingCycle') || 'one-time',
    features:     formData.get('features')    || undefined,
    isPopular:    formData.get('isPopular') === 'true',
  };
  const parsed = createPricingSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const body = {
      ...parsed.data,
      features: parsed.data.features ? parsed.data.features.split('\n').map(f => f.trim()).filter(Boolean) : [],
    };
    await apiFetch('/pricing', { method: 'POST', body: JSON.stringify(body) });
    revalidatePath('/manager/pricing');
    return { success: true, message: 'Pricing plan created' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Delete pricing plan ──────────────────────────────────────────────────────
export async function deletePricingAction(id: string): Promise<ActionState> {
  try {
    await apiFetch(`/pricing/${id}`, { method: 'DELETE' });
    revalidatePath('/manager/pricing');
    return { success: true, message: 'Plan deleted' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}
