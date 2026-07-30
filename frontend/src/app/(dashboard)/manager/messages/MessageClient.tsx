'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { fetchMessages, sendMessageAction, startConversationAction } from '@/features/manager/message.actions';
import { Send, User, Loader2, Plus, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export function MessageClient({ initialConversations, currentUser, clients }: { initialConversations: any[], currentUser: any, clients: any[] }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isPending, startT] = useTransition();
  const [content, setContent] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  useEffect(() => {
    if (!activeId) return;
    setIsLoadingMessages(true);
    fetchMessages(activeId).then(data => {
      setMessages(data);
      setIsLoadingMessages(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    const interval = setInterval(() => {
      fetchMessages(activeId).then(data => setMessages(data));
    }, 5000);

    return () => clearInterval(interval);
  }, [activeId]);

  const handleSend = () => {
    if (!activeId || !content.trim()) return;
    const msg = content;
    setContent('');
    startT(async () => {
      // Optimistic update
      const tempId = Date.now().toString();
      setMessages(prev => [...prev, { id: tempId, content: msg, senderId: currentUser.userId, createdAt: new Date().toISOString() }]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      
      const formData = new FormData();
      formData.append('content', msg);
      const res = await sendMessageAction(activeId, null, formData);
      if ('error' in res && res.error) {
        toast.error(res.error);
      } else {
        // Fetch again to ensure sync
        fetchMessages(activeId).then(data => setMessages(data));
      }
    });
  };

  const handleStartChat = (clientId: string) => {
    startT(async () => {
      const formData = new FormData();
      formData.append('clientId', clientId);
      const res = await startConversationAction(null, formData);
      if ('error' in res && res.error) {
        toast.error(res.error);
      } else {
        toast.success('Conversation started');
        setShowNewChat(false);
        // Page will revalidate and update initialConversations
      }
    });
  };

  return (
    <div className="flex h-full text-sm">
      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-white/[0.08] flex-col bg-white/[0.01] ${activeId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <h3 className="font-semibold text-white">Conversations</h3>
          <button onClick={() => setShowNewChat(v => !v)} className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>

        {showNewChat && (
          <div className="p-4 border-b border-white/[0.08] bg-white/[0.03]">
            <p className="text-xs text-[#AAB3C5] font-semibold mb-2 uppercase">Start new chat</p>
            <div className="space-y-2">
              {clients.map(client => (
                <button key={client.id} onClick={() => handleStartChat(client.id)} disabled={isPending}
                  className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5CFF]/30 to-[#4F7DFF]/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {client.companyName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{client.companyName}</p>
                    <p className="text-xs text-[#7A8499] truncate">{client.contactPerson}</p>
                  </div>
                </button>
              ))}
              {clients.length === 0 && <p className="text-xs text-[#7A8499]">No clients found.</p>}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {conversations.map(conv => {
            const isActive = conv.id === activeId;
            const latestMessage = conv.messages?.[0];
            return (
              <button key={conv.id} onClick={() => setActiveId(conv.id)}
                className={`w-full text-left flex items-center gap-3 p-4 border-b border-white/[0.04] transition-all hover:bg-white/[0.03] ${isActive ? 'bg-white/[0.04]' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F7DFF]/30 to-[#7C5CFF]/20 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {conv.client.companyName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white truncate">{conv.client.companyName}</p>
                    {latestMessage && (
                      <span className="text-[10px] text-[#7A8499] whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(latestMessage.createdAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#AAB3C5] truncate mt-0.5">
                    {latestMessage?.content || 'No messages yet'}
                  </p>
                </div>
              </button>
            );
          })}
          {conversations.length === 0 && !showNewChat && (
            <div className="p-8 text-center text-[#7A8499]">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p>No conversations yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeId ? (
        <div className={`flex-1 flex-col min-w-0 bg-transparent ${activeId ? 'flex' : 'hidden md:flex'}`}>
          {/* Header */}
          <div className="h-16 px-4 md:px-6 border-b border-white/[0.08] flex items-center gap-3 bg-white/[0.01]">
            <button 
              onClick={() => setActiveId(null)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/[0.05] text-[#AAB3C5] transition-colors shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F7DFF]/30 to-[#7C5CFF]/20 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {conversations.find(c => c.id === activeId)?.client.companyName[0] || 'C'}
            </div>
            <div>
              <h3 className="font-bold text-white">{conversations.find(c => c.id === activeId)?.client.companyName}</h3>
              <p className="text-xs text-[#AAB3C5]">{conversations.find(c => c.id === activeId)?.client.contactPerson}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {isLoadingMessages ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#7A8499]" />
              </div>
            ) : (
              <>
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === currentUser.userId;
                  return (
                    <div key={msg.id || i} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full hidden sm:flex items-center justify-center shrink-0 ${isMe ? 'bg-gradient-to-br from-[#7C5CFF] to-[#4F7DFF] text-white' : 'bg-white/[0.1] text-[#AAB3C5]'}`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 sm:px-5 py-3 ${isMe ? 'bg-[#4F7DFF] text-white rounded-tr-sm' : 'bg-white/[0.06] text-[#E2E8F0] rounded-tl-sm border border-white/[0.05]'}`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <span className={`text-[10px] block mt-1.5 ${isMe ? 'text-white/70' : 'text-[#7A8499]'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-3 md:p-4 border-t border-white/[0.08] bg-white/[0.02]">
            <div className="flex items-center gap-2 sm:gap-3 bg-white/[0.04] border border-white/[0.08] rounded-full px-2 py-2 focus-within:border-white/[0.2] transition-colors">
              <input 
                type="text" 
                value={content}
                onChange={e => setContent(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..." 
                className="flex-1 bg-transparent border-none outline-none text-white px-3 sm:px-4 placeholder:text-[#7A8499] text-sm sm:text-base"
              />
              <button 
                onClick={handleSend}
                disabled={!content.trim() || isPending}
                className="w-10 h-10 rounded-full bg-[#4F7DFF] hover:bg-[#3D66D6] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors shrink-0">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 -ml-0.5" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-[#7A8499]">
          <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-base font-medium">Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );
}
