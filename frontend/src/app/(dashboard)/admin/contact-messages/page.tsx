'use client';

import { useState, useEffect } from 'react';
import { Mail, Check, Trash2, Eye, Calendar, MessageSquare } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/contact-messages');
      setMessages(data.data || []);
    } catch (err) {
      console.error('Failed to load contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      await apiClient.patch(`/contact-messages/${id}/read`, { isRead: !currentRead });
      loadMessages();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    try {
      await apiClient.delete(`/contact-messages/${id}`);
      loadMessages();
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-[#090D16] p-6 rounded-2xl border border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-cyan-400" />
            Contact Messages & Inquiries
          </h1>
          <p className="text-xs text-slate-400 mt-1">View business inquiries submitted via the website contact forms.</p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`p-6 rounded-2xl border transition-all shadow-xl ${
              msg.isRead
                ? 'bg-[#0B1224] border-white/[0.08] opacity-80'
                : 'bg-gradient-to-r from-[#0B1224] to-blue-950/40 border-cyan-500/40'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-white text-base">{msg.name}</span>
                  {!msg.isRead && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white uppercase">
                      New Inquiry
                    </span>
                  )}
                </div>
                <p className="text-xs text-cyan-400 font-medium">{msg.email} {msg.phone ? `• ${msg.phone}` : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
                <button
                  onClick={() => handleToggleRead(msg.id, msg.isRead)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    msg.isRead ? 'bg-white/[0.05] text-slate-400' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {msg.service && (
              <p className="text-xs font-bold text-slate-300 mb-2">Service Interest: <span className="text-cyan-400">{msg.service}</span></p>
            )}
            <p className="text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
              {msg.message}
            </p>
          </div>
        ))}

        {messages.length === 0 && !loading && (
          <div className="text-center py-12 bg-[#0B1224] rounded-2xl border border-white/[0.08]">
            <p className="text-slate-400 text-sm">No contact messages received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
