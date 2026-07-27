'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

// ─── Types ────────────────────────────────────────────────────────────────────
export type PaymentStatus  = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED';
export type FileCategory   = 'PROPOSAL' | 'CONTRACT' | 'REQUIREMENT' | 'DESIGN' | 'DELIVERABLE' | 'INVOICE' | 'OTHER';

export type ClientProfile = {
  companyName: string;
  contactPerson: string;
  email?: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  companyDescription: string | null;
  user: {
    createdAt: string;
    email: string;
  };
};

export type ClientPayment = {
  id: string; invoiceNumber: string; amount: string; currency: string;
  status: PaymentStatus; method: string | null; paidAt: string | null;
  dueDate: string | null; description: string | null; invoiceUrl: string | null;
  createdAt: string;
  project: { id: string; name: string };
};

export type ClientFile = {
  id: string; name: string; url: string; category: FileCategory;
  mimeType: string | null; sizeBytes: number | null; uploadedBy: string; createdAt: string;
  project: { id: string; name: string };
};

export type Message = {
  id: string; conversationId: string; senderId: string; content: string;
  attachments: string[]; isRead: boolean; createdAt: string;
  sender: { email: string; role: string };
};

export type ClientDashboardStats = {
  activeProjects: number;
  completedProjects: number;
  totalPayments: number;
  unreadMessages: number;
  recentPayments: ClientPayment[];
};

export type ActionState = { success: true; message: string } | { success: false; error: string };

// ─── Schemas ──────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  companyName:        z.string().min(2).optional(),
  contactPerson:      z.string().min(2).optional(),
  phone:              z.string().optional(),
  website:            z.string().optional(),
  address:            z.string().optional(),
  companyDescription: z.string().optional(),
});

const messageSchema = z.object({
  content:        z.string().min(1, 'Message cannot be empty'),
  conversationId: z.string().optional(),
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

// ─── Fetch payments ───────────────────────────────────────────────────────────
export async function fetchMyPayments(): Promise<ClientPayment[]> {
  try {
    const res = await apiFetch<{ data: { payments: ClientPayment[] } }>('/client/payments');
    return res.data?.payments ?? [];
  } catch { return []; }
}

// ─── Fetch profile ────────────────────────────────────────────────────────────
export async function fetchMyProfile(): Promise<ClientProfile | null> {
  try {
    const res = await apiFetch<{ data: { profile: ClientProfile } }>('/client/profile');
    return res.data?.profile ?? null;
  } catch { return null; }
}

// ─── Fetch files ──────────────────────────────────────────────────────────────
export async function fetchMyFiles(): Promise<ClientFile[]> {
  try {
    const res = await apiFetch<{ data: { files: ClientFile[] } }>('/client/files');
    return res.data?.files ?? [];
  } catch { return []; }
}

// ─── Fetch projects ───────────────────────────────────────────────────────────
export async function fetchMyProjects(): Promise<any[]> {
  try {
    const res = await apiFetch<{ data: { projects: any[] } }>('/client/projects');
    return res.data?.projects ?? [];
  } catch { return []; }
}

export async function fetchProjectById(id: string): Promise<any | null> {
  try {
    const res = await apiFetch<{ data: { project: any } }>(`/client/projects/${id}`);
    return res.data?.project ?? null;
  } catch { return null; }
}

// ─── Fetch stats ──────────────────────────────────────────────────────────────
export async function fetchMyDashboardStats(): Promise<ClientDashboardStats | null> {
  try {
    const res = await apiFetch<{ data: { stats: ClientDashboardStats } }>('/client/stats');
    return res.data?.stats ?? null;
  } catch { return null; }
}

// ─── Fetch messages ───────────────────────────────────────────────────────────
export async function fetchMyMessages(): Promise<Message[]> {
  try {
    const convRes = await apiFetch<{ data: { conversation: any } }>('/client/conversation');
    if (!convRes.data?.conversation) return [];
    const msgRes = await apiFetch<{ data: { messages: Message[] } }>(`/client/conversation/${convRes.data.conversation.id}/messages`);
    return msgRes.data?.messages ?? [];
  } catch { return []; }
}

// ─── Update profile ───────────────────────────────────────────────────────────
export async function updateClientProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    companyName:        formData.get('companyName')        || undefined,
    contactPerson:      formData.get('contactPerson')      || undefined,
    phone:              formData.get('phone')              || undefined,
    website:            formData.get('website')            || undefined,
    address:            formData.get('address')            || undefined,
    companyDescription: formData.get('companyDescription') || undefined,
  };
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  try {
    await apiFetch('/client/profile', { method: 'PATCH', body: JSON.stringify(parsed.data) });
    revalidatePath('/client/profile');
    return { success: true, message: 'Profile updated' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Send message ─────────────────────────────────────────────────────────────
export async function sendMessageAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    content:        formData.get('content'),
    conversationId: formData.get('conversationId') || undefined,
  };
  const parsed = messageSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  try {
    await apiFetch('/client/messages', { method: 'POST', body: JSON.stringify(parsed.data) });
    revalidatePath('/client/messages');
    return { success: true, message: 'Message sent' };
  } catch (err) { return { success: false, error: (err as Error).message }; }
}

// ─── Fetch My Applications ────────────────────────────────────────────────────
export async function fetchMyApplications() {
  try {
    const res = await apiFetch<{ data: any[] }>('/hiring/my-applications');
    return res.data ?? [];
  } catch { return []; }
}
