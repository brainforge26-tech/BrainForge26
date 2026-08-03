'use client';

import { useState, useEffect } from 'react';
import { Mail, Check, Trash2, Calendar, MessageSquare, PhoneCall, ExternalLink, Send } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#090D16] p-6 rounded-2xl border border-white/[0.08] gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-orange-400" />
            Inbox & Contact Messages
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time messages submitted via website forms automatically sync with Telegram & WhatsApp alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Telegram Bot Sync Active
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map(msg => {
          const cleanPhone = msg.phone ? msg.phone.replace(/[^0-9+]/g, '') : '';
          const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : null;

          return (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all shadow-xl space-y-4 ${
                msg.isRead
                  ? 'bg-[#0B1224] border-white/[0.08] opacity-85'
                  : 'bg-gradient-to-r from-[#0B1224] via-[#0E172E] to-orange-950/20 border-orange-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-white text-base">{msg.name}</span>
                    {!msg.isRead && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500 text-white uppercase tracking-wider shadow-md">
                        New Inquiry
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-orange-400 font-semibold mt-0.5">
                    {msg.email} {msg.phone ? `• ${msg.phone}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>

                  {/* Direct WhatsApp Quick Chat Button */}
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30 transition-all shadow-md"
                      title="Open Direct WhatsApp Chat with Sender"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {/* Quick Email Reply Button */}
                  <a
                    href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject || 'Inquiry'}`)}`}
                    className="px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-orange-500/20 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Reply</span>
                  </a>

                  <button
                    onClick={() => handleToggleRead(msg.id, msg.isRead)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      msg.isRead ? 'bg-white/[0.05] text-slate-400' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    }`}
                  >
                    {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-all"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {msg.service && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Service:</span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-orange-500/10 text-orange-300 border border-orange-500/20">
                    {msg.service}
                  </span>
                </div>
              )}

              {msg.subject && (
                <p className="text-xs font-bold text-slate-200">
                  Subject: <span className="text-orange-400">{msg.subject}</span>
                </p>
              )}

              <p className="text-sm text-slate-200 leading-relaxed bg-[#07090F] p-4 rounded-xl border border-white/[0.06] whitespace-pre-wrap">
                {msg.message}
              </p>
            </div>
          );
        })}

        {messages.length === 0 && !loading && (
          <div className="text-center py-16 bg-[#0B1224] rounded-2xl border border-white/[0.08]">
            <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-semibold">No contact messages received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
