'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const BASE = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5001/api/v1';

// ─── Types ────────────────────────────────────────────────────────────────────
export type DevProfile = {
  id: string; userId: string; firstName: string; lastName: string;
  avatar: string | null; phone: string | null; bio: string | null;
  title: string | null; githubUrl: string | null; linkedinUrl: string | null;
  portfolioUrl: string | null; resumeUrl: string | null;
  skills: string[]; experience: number | null; isAvailable: boolean;
  portfolioItems: PortfolioItem[];
};

export type PortfolioItem = {
  id: string; developerId: string; title: string; description: string | null;
  url: string | null; imageUrl: string | null; technologies: string[]; order: number;
};

export type AssignedProject = {
  id: string; projectId: string; userId: string; role: string | null; joinedAt: string;
  project: {
    id: string; name: string; status: string; completionPercent: number;
    description: string | null; estimatedDelivery: string | null;
    client: { companyName: string } | null;
    manager: { email: string; managerProfile: { firstName: string; lastName: string } | null } | null;
    milestones: { id: string; name: string; status: string; dueDate: string | null }[];
    timelineStages: { id: string; name: string; status: string; order: number }[];
    files?: any[];
    progressUpdates?: any[];
    developers?: any[];
  };
};

export type ActionState = { success: true; message: string } | { success: false; error: string };

// ─── Schemas ──────────────────────────────────────────────────────────────────
const updateProfileSchema = z.object({
  firstName:   z.string().min(1).optional(),
  lastName:    z.string().min(1).optional(),
  phone:       z.string().optional(),
  bio:         z.string().optional(),
  title:       z.string().optional(),
  githubUrl:   z.string().optional(),
  linkedinUrl: z.string().optional(),
  skills:      z.string().optional(), // comma-separated
  experience:  z.coerce.number().int().min(0).max(50).optional(),
  isAvailable: z.coerce.boolean().optional(),
});

const portfolioSchema = z.object({
  title:        z.string().min(1, 'Title required'),
  description:  z.string().optional(),
  url:          z.string().optional(),
  technologies: z.string().optional(), // comma-separated
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

// ─── Fetch my profile ─────────────────────────────────────────────────────────
export async function fetchMyProfile(): Promise<DevProfile | null> {
  try {
    const res = await apiFetch<{ data: { profile: DevProfile } }>('/developer/me');
    return res.data?.profile ?? null;
  } catch { return null; }
}

// ─── Fetch my assigned projects ───────────────────────────────────────────────
export async function fetchMyProjects(): Promise<AssignedProject[]> {
  try {
    const res = await apiFetch<{ data: { projects: AssignedProject[] } }>('/developer/me/projects');
    return res.data?.projects ?? [];
  } catch { return []; }
}

export async function fetchProjectById(id: string): Promise<AssignedProject['project'] | null> {
  const projects = await fetchMyProjects();
  const found = projects.find(p => p.project.id === id);
  return found ? found.project : null;
}

// ─── Update profile ───────────────────────────────────────────────────────────
export async function updateProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    firstName:   formData.get('firstName')   || undefined,
    lastName:    formData.get('lastName')    || undefined,
    phone:       formData.get('phone')       || undefined,
    bio:         formData.get('bio')         || undefined,
    title:       formData.get('title')       || undefined,
    githubUrl:   formData.get('githubUrl')   || undefined,
    linkedinUrl: formData.get('linkedinUrl') || undefined,
    skills:      formData.get('skills')      || undefined,
    experience:  formData.get('experience')  || undefined,
    isAvailable: formData.get('isAvailable'),
  };
  const parsed = updateProfileSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const body = {
      ...parsed.data,
      skills: parsed.data.skills ? parsed.data.skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    };
    await apiFetch('/developer/me', { method: 'PATCH', body: JSON.stringify(body) });
    revalidatePath('/developer/profile');
    return { success: true, message: 'Profile updated successfully' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Add portfolio item ───────────────────────────────────────────────────────
export async function addPortfolioAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    title:        formData.get('title'),
    description:  formData.get('description') || undefined,
    url:          formData.get('url')          || undefined,
    technologies: formData.get('technologies') || undefined,
  };
  const parsed = portfolioSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const body = {
      ...parsed.data,
      technologies: parsed.data.technologies ? parsed.data.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    await apiFetch('/developer/me/portfolio', { method: 'POST', body: JSON.stringify(body) });
    revalidatePath('/developer/profile');
    return { success: true, message: 'Portfolio item added' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Delete portfolio item ────────────────────────────────────────────────────
export async function deletePortfolioAction(itemId: string): Promise<ActionState> {
  try {
    await apiFetch(`/developer/me/portfolio/${itemId}`, { method: 'DELETE' });
    revalidatePath('/developer/profile');
    return { success: true, message: 'Portfolio item deleted' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Update resume URL ────────────────────────────────────────────────────────
export async function updateResumeAction(resumeUrl: string): Promise<ActionState> {
  try {
    await apiFetch('/developer/me/resume', { method: 'PATCH', body: JSON.stringify({ resumeUrl }) });
    revalidatePath('/developer/documents');
    return { success: true, message: 'Resume updated' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Fetch My Applications ────────────────────────────────────────────────────
export async function fetchMyApplications() {
  try {
    const res = await apiFetch<{ data: any[] }>('/hiring/my-applications');
    return res.data ?? [];
  } catch { return []; }
}
