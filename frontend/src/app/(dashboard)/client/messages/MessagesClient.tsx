'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { sendMessageAction } from '@/features/client/client.actions';
import type { ActionState, Message } from '@/features/client/client.actions';
import { Avatar } from '@/components/ui/Avatar';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function MessagesClient({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(sendMessageAction, initial);
  const bottomRef = useRef<HTMLDivElement>(null);
  const formRef   = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { fetchMyMessages } = await import('@/features/client/client.actions');
        const updated = await fetchMyMessages();
        setMessages(updated);
      } catch (e) {}
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="flex-1 overflow-y-auto rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-[#7A8499] text-center px-4">
            No messages yet. Send a message to start the conversation!
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender.role === 'CLIENT';
          const name = isMe ? 'You' : msg.sender.email.split('@')[0];
          return (
            <div key={msg.id} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              {!isMe && <div className="hidden sm:block"><Avatar name={name} size="sm" /></div>}
              <div className={`max-w-[85%] sm:max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isMe && <p className="text-xs text-[#7A8499] px-1">{name}</p>}
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
      <form ref={formRef} action={formAction} className="mt-4 flex items-center gap-2 sm:gap-3">
        <input type="hidden" name="conversationId" value={messages[0]?.conversationId || ''} />
        <div className="flex-1 relative">
          <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
          <input
            name="content" required
            placeholder="Type a message…"
            className="input-field pl-11 pr-4 h-12 text-sm sm:text-base"
            autoComplete="off"
          />
        </div>
        <button type="submit" disabled={pending}
          className="btn-primary h-12 px-4 sm:px-5 rounded-full flex items-center gap-2 text-sm shrink-0">
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 -ml-0.5" />}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

      {'error' in state && state.error && (
        <p className="text-xs text-[#EF4444] mt-2 px-1">{state.error}</p>
      )}
    </div>
  );
}
