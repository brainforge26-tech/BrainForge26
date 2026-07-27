'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export type MilestoneStatus   = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
export type TimelineStatus    = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
export type ActionState       = { success: true; message: string } | { success: false; error: string };

const milestoneSchema = z.object({
  name:        z.string().min(1, 'Name required'),
  description: z.string().optional(),
  dueDate:     z.string().optional(),
});

const progressSchema = z.object({
  title:           z.string().min(1, 'Title required'),
  description:     z.string().min(1, 'Description required'),
  progressPercent: z.coerce.number().int().min(0).max(100),
});

async function getToken() {
  const { cookies } = await import('next/headers');
  return (await cookies()).get('accessToken')?.value ?? '';
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(init.headers as Record<string, string>) },
    cache: 'no-store',
  });
  const json = await res.json() as { data: T; message?: string };
  if (!res.ok) throw new Error((json as unknown as { message?: string }).message ?? `Error ${res.status}`);
  return json as T;
}

// ─── Create milestone ─────────────────────────────────────────────────────────
export async function createMilestoneAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const projectId = formData.get('projectId') as string;
  const raw = { name: formData.get('name'), description: formData.get('description') || undefined, dueDate: formData.get('dueDate') || undefined };
  const parsed = milestoneSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  try {
    await apiFetch(`/projects/${projectId}/milestones`, { method: 'POST', body: JSON.stringify(parsed.data) });
    revalidatePath(`/manager/projects/${projectId}`);
    return { success: true, message: 'Milestone created' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Update milestone status ──────────────────────────────────────────────────
export async function updateMilestoneAction(projectId: string, milestoneId: string, status: MilestoneStatus): Promise<ActionState> {
  try {
    await apiFetch(`/projects/${projectId}/milestones/${milestoneId}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    revalidatePath(`/manager/projects/${projectId}`);
    return { success: true, message: 'Milestone updated' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Delete milestone ─────────────────────────────────────────────────────────
export async function deleteMilestoneAction(projectId: string, milestoneId: string): Promise<ActionState> {
  try {
    await apiFetch(`/projects/${projectId}/milestones/${milestoneId}`, { method: 'DELETE' });
    revalidatePath(`/manager/projects/${projectId}`);
    return { success: true, message: 'Milestone deleted' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Update timeline stage ────────────────────────────────────────────────────
export async function updateTimelineStageAction(projectId: string, stageId: string, status: TimelineStatus): Promise<ActionState> {
  try {
    await apiFetch(`/projects/${projectId}/timeline/${stageId}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    revalidatePath(`/manager/projects/${projectId}`);
    return { success: true, message: 'Stage updated' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Post progress update ─────────────────────────────────────────────────────
export async function postProgressAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const projectId = formData.get('projectId') as string;
  const raw = {
    title:           formData.get('title'),
    description:     formData.get('description'),
    progressPercent: formData.get('progressPercent'),
  };
  const parsed = progressSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  try {
    await apiFetch(`/projects/${projectId}/progress`, { method: 'POST', body: JSON.stringify(parsed.data) });
    revalidatePath(`/manager/projects/${projectId}`);
    return { success: true, message: 'Progress update posted' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}
