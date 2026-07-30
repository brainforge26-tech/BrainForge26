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
  milestones: any[];
  timelineStages: any[];
  gallery?: { id: string; url: string; caption?: string | null }[];
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

export type SpecializedService = {
  id: string; icon: string | null; title: string; features: string[];
  isActive: boolean; order: number; createdAt: string; updatedAt: string;
};


// ─── Schemas ──────────────────────────────────────────────────────────────────
const createProjectSchema = z.object({
  name:              z.string().min(2, 'Project name required'),
  description:       z.string().optional(),
  projectType:       z.string().optional(),
  clientId:          z.string().optional(),
  priority:          z.enum(['LOW','MEDIUM','HIGH','URGENT']).default('MEDIUM'),
  technologies:      z.string().optional(), // comma-separated
  estimatedDelivery: z.string().optional(),
  budget:            z.coerce.number().positive().optional(),
  imageUrl:          z.string().optional(),
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
  const res = await apiFetch<{ data: { clients: Client[] } }>('/users/clients');
  return res.data?.clients ?? [];
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
    clientId:          formData.get('clientId')          || undefined,
    priority:          formData.get('priority') || 'MEDIUM',
    technologies:      formData.get('technologies')      || undefined,
    estimatedDelivery: formData.get('estimatedDelivery') || undefined,
    budget:            formData.get('budget')            || undefined,
    imageUrl:          formData.get('imageUrl')          || undefined,
  };
  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const body = {
      ...parsed.data,
      technologies: parsed.data.technologies ? parsed.data.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
      estimatedDelivery: parsed.data.estimatedDelivery ? new Date(parsed.data.estimatedDelivery).toISOString() : undefined,
      images: parsed.data.imageUrl ? [parsed.data.imageUrl] : [],
    };
    await apiFetch('/projects', { method: 'POST', body: JSON.stringify(body) });
    revalidatePath('/manager/projects');
    revalidatePath('/admin/projects');
    revalidatePath('/admin');
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
export async function deletePricingAction(id: string) {
  try {
    const token = await getToken();
    const res = await apiFetch(`/pricing/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    // @ts-ignore
    if (!res?.success) throw new Error(res?.message || 'Failed to delete plan');
    revalidatePath('/manager/pricing');
    revalidatePath('/');
    return { success: true, message: 'Plan deleted successfully' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateHomepageContentAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const token = await getToken();
    const section = formData.get('section') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const primaryCTA = formData.get('primaryCTA') as string;
    const secondaryCTA = formData.get('secondaryCTA') as string;

    const res = await apiFetch('/homepage/content', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        section,
        content: { title, subtitle, primaryCTA, secondaryCTA }
      }),
    });

    // @ts-ignore
    if (!res?.success) throw new Error(res?.message || 'Failed to update content');
    revalidatePath('/manager/homepage');
    revalidatePath('/');
    return { success: true, message: 'Content updated successfully' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}



// ─── Fetch single project ─────────────────────────────────────────────────────
export async function fetchProjectById(id: string) {
  try {
    const res = await apiFetch<{ data: { project: Project } }>(`/projects/${id}`);
    return res.data?.project ?? null;
  } catch { return null; }
}

export async function fetchProjectFiles(id: string) {
  try {
    const res = await apiFetch<{ data: { files: any[] } }>(`/projects/${id}/files`);
    return res.data?.files ?? [];
  } catch { return []; }
}

export async function fetchProgressUpdates(id: string) {
  try {
    const res = await apiFetch<{ data: { updates: any[] } }>(`/projects/${id}/progress`);
    return res.data?.updates ?? [];
  } catch { return []; }
}

// ─── Update Project Details ───────────────────────────────────────────────────
export async function updateProjectAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    status:            formData.get('status') || undefined,
    priority:          formData.get('priority') || undefined,
    completionPercent: formData.get('completionPercent') ? Number(formData.get('completionPercent')) : undefined,
    managerNotes:      formData.get('managerNotes') || undefined,
  };
  try {
    await apiFetch(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(raw) });
    revalidatePath(`/manager/projects/${id}`);
    return { success: true, message: 'Project updated' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Milestones ───────────────────────────────────────────────────────────────
export async function createMilestoneAction(projectId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    name:        formData.get('name'),
    description: formData.get('description') || undefined,
    dueDate:     formData.get('dueDate') || undefined,
    status:      formData.get('status') || 'PENDING',
  };
  try {
    if (raw.dueDate) raw.dueDate = new Date(raw.dueDate as string).toISOString();
    await apiFetch(`/projects/${projectId}/milestones`, { method: 'POST', body: JSON.stringify(raw) });
    revalidatePath(`/manager/projects/${projectId}`);
    return { success: true, message: 'Milestone created' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
export async function addTimelineStageAction(projectId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    name:        formData.get('name'),
    description: formData.get('description') || undefined,
    status:      formData.get('status') || 'PENDING',
  };
  try {
    await apiFetch(`/projects/${projectId}/timeline`, { method: 'POST', body: JSON.stringify(raw) });
    revalidatePath(`/manager/projects/${projectId}`);
    return { success: true, message: 'Timeline stage added' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

export async function updateTimelineStageAction(projectId: string, stageId: string, status: string): Promise<ActionState> {
  try {
    await apiFetch(`/projects/${projectId}/timeline/${stageId}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    revalidatePath(`/manager/projects/${projectId}`);
    return { success: true, message: 'Timeline updated' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Progress Updates ─────────────────────────────────────────────────────────
export async function postProgressUpdateAction(projectId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    title:           formData.get('title'),
    description:     formData.get('description'),
    progressPercent: Number(formData.get('progressPercent')),
  };
  try {
    await apiFetch(`/projects/${projectId}/progress`, { method: 'POST', body: JSON.stringify(raw) });
    revalidatePath(`/manager/projects/${projectId}`);
    return { success: true, message: 'Progress update posted' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Files ────────────────────────────────────────────────────────────────────
export async function uploadFileAction(projectId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE}/projects/${projectId}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? `Error ${res.status}`);
    
    revalidatePath(`/manager/projects/${projectId}`);
    return { success: true, message: 'File uploaded' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Hiring Applications ───────────────────────────────────────────────────────
export async function fetchApplicationById(id: string) {
  try {
    const res = await apiFetch<{ data: any }>(`/hiring/${id}`);
    return res.data ?? null;
  } catch { return null; }
}

export async function updateApplicationStatusAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const status = formData.get('status') as string;
  const notes = formData.get('notes') as string | undefined;
  try {
    await apiFetch(`/hiring/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
    revalidatePath(`/manager/hiring/${id}`);
    revalidatePath(`/manager/hiring`);
    return { success: true, message: 'Application updated' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Specialized Services ─────────────────────────────────────────────────────
export async function fetchServices(): Promise<SpecializedService[]> {
  try {
    const res = await apiFetch<{ data: { services: SpecializedService[] } }>('/services');
    return (res as { data?: { services?: SpecializedService[] } }).data?.services ?? [];
  } catch { return []; }
}

export async function createServiceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    title:    formData.get('title'),
    icon:     formData.get('icon') || undefined,
    features: formData.get('features') || undefined,
    isActive: formData.get('isActive') !== 'false',
  };
  if (!raw.title) return { success: false, error: 'Title is required' };
  try {
    const body = {
      ...raw,
      features: raw.features ? String(raw.features).split('\n').map(f => f.trim()).filter(Boolean) : [],
    };
    await apiFetch('/services', { method: 'POST', body: JSON.stringify(body) });
    revalidatePath('/manager/services');
    revalidatePath('/admin/services');
    revalidatePath('/');
    return { success: true, message: 'Service created' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

export async function updateServiceAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    title:    formData.get('title') || undefined,
    icon:     formData.get('icon') || undefined,
    features: formData.get('features') || undefined,
    isActive: formData.get('isActive') !== 'false',
  };
  try {
    const body = {
      ...raw,
      features: raw.features ? String(raw.features).split('\n').map(f => f.trim()).filter(Boolean) : undefined,
    };
    await apiFetch(`/services/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
    revalidatePath('/manager/services');
    revalidatePath('/admin/services');
    revalidatePath('/');
    return { success: true, message: 'Service updated' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

export async function deleteServiceAction(id: string): Promise<ActionState> {
  try {
    await apiFetch(`/services/${id}`, { method: 'DELETE' });
    revalidatePath('/manager/services');
    revalidatePath('/admin/services');
    revalidatePath('/');
    return { success: true, message: 'Service deleted' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

