'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { sendMessageAction } from '@/features/client/client.actions';
import type { ActionState } from '@/features/client/client.actions';
import { Avatar } from '@/components/ui/Avatar';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

type Msg = { id: string; senderId: string; content: string; createdAt: string; role: 'CLIENT' | 'MANAGER'; name: string };

const SAMPLE_MESSAGES: Msg[] = [
  { id: '1', senderId: 'mgr', content: 'Hi! Welcome to your client portal. Feel free to message us any time.',  createdAt: '2026-07-10T09:00:00Z', role: 'MANAGER', name: 'Sarah Johnson' },
  { id: '2', senderId: 'me',  content: 'Thanks! Can you give me an update on the E-Commerce project?',           createdAt: '2026-07-10T09:05:00Z', role: 'CLIENT',  name: 'You' },
  { id: '3', senderId: 'mgr', content: 'Of course! We just completed the UI design phase and started frontend development. We are on track for the August 15 deadline.', createdAt: '2026-07-10T09:08:00Z', role: 'MANAGER', name: 'Sarah Johnson' },
  { id: '4', senderId: 'me',  content: 'Great to hear! Can I see the designs?',                                  createdAt: '2026-07-10T09:10:00Z', role: 'CLIENT',  name: 'You' },
  { id: '5', senderId: 'mgr', content: 'Yes, I have uploaded the Figma files to your Files section. Check it out!', createdAt: '2026-07-10T09:12:00Z', role: 'MANAGER', name: 'Sarah Johnson' },
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function ClientMessagesPage() {
  const [messages, setMessages] = useState<Msg[]>(SAMPLE_MESSAGES);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(sendMessageAction, initial);
  const bottomRef = useRef<HTMLDivElement>(null);
  const formRef   = useRef<HTMLFormElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      toast.success('Message sent');
    }
  }, [state.success]);

  return (
    <div className="animate-fade-up flex flex-col h-[calc(100vh-8rem)] max-w-3xl">
      <PageHeader title="Messages" description="Chat with your project manager." />

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-5 space-y-4 min-h-0">
        {messages.map(msg => {
          const isMe = msg.role === 'CLIENT';
          return (
            <div key={msg.id} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              {!isMe && <Avatar name={msg.name} size="sm" />}
              <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isMe && <p className="text-xs text-[#7A8499] px-1">{msg.name}</p>}
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? 'bg-gradient-to-br from-[#4F7DFF] to-[#7C5CFF] text-white rounded-br-sm'
                    : 'bg-white/[0.06] border border-white/[0.08] text-[#AAB3C5] rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
                <p className="text-[10px] text-[#7A8499] px-1">{formatTime(msg.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form ref={formRef} action={formAction} className="mt-4 flex items-center gap-3">
        <input type="hidden" name="conversationId" value="sample-conv-id" />
        <div className="flex-1 relative">
          <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
          <input
            name="content" required
            placeholder="Type a message…"
            className="input-field pl-11 pr-4 h-12"
            autoComplete="off"
          />
        </div>
        <button type="submit" disabled={pending}
          className="btn-primary h-12 px-5 rounded-full flex items-center gap-2 text-sm shrink-0">
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send
        </button>
      </form>

      {'error' in state && state.error && (
        <p className="text-xs text-[#EF4444] mt-2 px-1">{state.error}</p>
      )}
    </div>
  );
}
