'use server';

import { revalidatePath } from 'next/cache';
import { serverFetch } from '@/lib/api';

export async function fetchConversations() {
  try {
    const res = await serverFetch<{ data: any[] }>('/messages/conversations');
    return res?.data || [];
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return [];
  }
}

export async function fetchMessages(conversationId: string) {
  try {
    const res = await serverFetch<{ data: any[] }>(`/messages/${conversationId}`);
    return res?.data || [];
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
}

export async function sendMessageAction(conversationId: string, prevState: any, formData: FormData) {
  try {
    const content = formData.get('content') as string;
    if (!content || !content.trim()) return { success: false, error: 'Message cannot be empty' };

    const res = await serverFetch<{ success: boolean; message?: string }>(`/messages/${conversationId}`, {
      method: 'POST',
      body: { content, attachments: [] }
    });

    if (!res?.success) throw new Error(res?.message || 'Failed to send message');
    revalidatePath('/manager/messages');
    return { success: true, message: 'Message sent' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function startConversationAction(prevState: any, formData: FormData) {
  try {
    const clientId = formData.get('clientId') as string;
    
    const res = await serverFetch<{ success: boolean; message?: string }>('/messages/conversations', {
      method: 'POST',
      body: { clientId }
    });

    if (!res?.success) throw new Error(res?.message || 'Failed to start conversation');
    revalidatePath('/manager/messages');
    return { success: true, message: 'Conversation started' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
