'use client';

import { useState, useEffect } from 'react';
import {
  Mail, RefreshCw, Search, Eye, Trash2, CheckCircle, Send,
  Bold, Italic, Underline, Strikethrough, Link as LinkIcon, List, ListOrdered, Undo, Redo,
  MessageSquare, Clock, ArrowLeft, Sparkles, Check
} from 'lucide-react';
import apiClient from '@/lib/axios';

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'replied' | 'unread'>('all');
  
  // Selected Message for Detail & Reply view
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null);

  // Reply Form State
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

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

  const handleOpenDetail = (msg: any) => {
    setSelectedMsg(msg);
    setReplySubject(`Re: ${msg.subject || 'Inquiry Message'}`);
    setReplyBody('');
    setReplySuccess(false);

    // Auto mark read if unread
    if (!msg.isRead) {
      handleToggleRead(msg.id, false);
    }
  };

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      await apiClient.patch(`/contact-messages/${id}/read`, { isRead: !currentRead });
      loadMessages();
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg((prev: any) => prev ? { ...prev, isRead: !currentRead } : null);
      }
    } catch (err) {
      console.error('Failed to toggle read status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে আপনি এই বার্তাটি মুছে ফেলতে চান?')) return;
    try {
      await apiClient.delete(`/contact-messages/${id}`);
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg(null);
      }
      loadMessages();
    } catch (err) {
      alert('বার্তা মুছে ফেলতে ব্যর্থ হয়েছে');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMsg || !replyBody.trim()) return;

    try {
      setSendingReply(true);
      await apiClient.post(`/contact-messages/${selectedMsg.id}/reply`, {
        subject: replySubject,
        messageBody: replyBody,
      });

      setReplySuccess(true);
      loadMessages();
      setTimeout(() => {
        setReplySuccess(false);
      }, 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'ইমেইল উত্তর পাঠাতে সমস্যা হয়েছে');
    } font-semibold {
      setSendingReply(false);
    }
  };

  // Stats
  const unreadCount = messages.filter(m => !m.isRead).length;
  const pendingCount = messages.filter(m => !m.notes?.includes('[REPLIED')).length;
  const repliedCount = messages.filter(m => m.notes?.includes('[REPLIED')).length;

  // Filtered Messages
  const filteredMessages = messages.filter(m => {
    const isReplied = m.notes?.includes('[REPLIED');
    const matchesSearch =
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'unread') return !m.isRead;
    if (filterTab === 'pending') return !isReplied;
    if (filterTab === 'replied') return isReplied;
    return true;
  });

  const getInitials = (name: string) => {
    if (!name) return 'MA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDateBn = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('bn-BD', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
    } catch {
      return new Date(dateStr).toLocaleString();
    }
  };

  return (
    <div className="space-y-8 text-slate-100 min-h-screen">
      
      {/* ── 1. Top Header Banner ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#0B1224] p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-2xl gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Mail className="w-3.5 h-3.5" /> কনট্যাক্ট মেসেজসমূহ
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            ইনবক্স ও কনট্যাক্ট বার্তা
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            ওয়েবসাইট থেকে দর্শকদের পাঠানো বার্তা দেখুন, সরাসরি ইমেইল রিপ্লাই দিন এবং স্ট্যাটাস পরিচালনা করুন।
          </p>
        </div>

        {/* Top Right Stats Card */}
        <div className="flex items-center gap-4 bg-[#060910] p-4 rounded-2xl border border-white/[0.08] shrink-0 shadow-lg">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">অপঠিত মেসেজ</span>
            <span className="text-3xl font-extrabold text-cyan-400">{unreadCount}</span>
          </div>
          <button
            onClick={loadMessages}
            title="রিফ্রেশ করুন"
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-all border border-white/[0.08]"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── 2. Detailed Message View & Email Reply Modal (If Message Selected) ──── */}
      {selectedMsg ? (
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={() => setSelectedMsg(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-bold border border-white/[0.08] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> তালিকায় ফিরে যান
          </button>

          {/* 2-Column Split View (Exact match to screenshot 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: মূল বার্তা (Original Message) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1224] border border-white/[0.08] shadow-2xl space-y-6 flex flex-col justify-between">
              <div>
                <div className="border-b border-white/[0.08] pb-4 mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    মূল বার্তা (Original Message)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    পাঠানোর সময়: {formatDateBn(selectedMsg.createdAt)}
                  </p>
                </div>

                {/* Sender Info Card */}
                <div className="p-4 rounded-2xl bg-[#07090F] border border-white/[0.08] flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-extrabold text-sm shrink-0 shadow-md">
                    {getInitials(selectedMsg.name)}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="font-extrabold text-white text-base truncate">{selectedMsg.name}</h4>
                    <p className="text-xs text-cyan-400 font-medium flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {selectedMsg.email}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-white/[0.06] mt-2">
                      <span><strong>বিষয়:</strong> {selectedMsg.subject || 'Hmmm'}</span>
                      <span><strong>তারিখ:</strong> {formatDateBn(selectedMsg.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">বার্তার বিবরণ:</span>
                  <div className="p-5 rounded-2xl bg-[#07090F] border border-white/[0.08] text-sm text-slate-200 leading-relaxed min-h-[160px] whitespace-pre-wrap">
                    {selectedMsg.message}
                  </div>
                </div>
              </div>

              {selectedMsg.phone && (
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs text-slate-400">ফোন নম্বর: <strong className="text-white">{selectedMsg.phone}</strong></span>
                  <a
                    href={`https://wa.me/${selectedMsg.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp মেসেজ দিন
                  </a>
                </div>
              )}
            </div>

            {/* Right Column: ইমেইল উত্তর লিখুন (Internal Reply) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1224] border border-white/[0.08] shadow-2xl space-y-6 relative">
              <div className="border-b border-white/[0.08] pb-4 mb-2">
                <h3 className="text-lg font-bold text-white">
                  ইমেইল উত্তর লিখুন (Internal Reply)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  এডমিন প্যানেল থেকেই সরাসরি ইউজারের ইমেইলে উত্তর পাঠান।
                </p>
              </div>

              {replySuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  ইমেইল উত্তর সফলভাবে পাঠানো হয়েছে!
                </div>
              )}

              <form onSubmit={handleSendReply} className="space-y-5">
                {/* To Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    প্রাপক ইমেইল (To)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={selectedMsg.email}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 text-sm font-semibold cursor-not-allowed"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    ইমেইল বিষয় (Subject)
                  </label>
                  <input
                    type="text"
                    required
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Re: Subject..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                {/* Rich Reply Message Body Textarea with Toolbar */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    রিপ্লাই বার্তা (Reply Message Body)
                  </label>
                  
                  {/* Rich Text Controls Bar */}
                  <div className="rounded-2xl border border-white/[0.1] bg-[#07090F] overflow-hidden focus-within:border-cyan-400 transition-colors">
                    <div className="px-3 py-2 border-b border-white/[0.08] bg-white/[0.02] flex items-center gap-2 flex-wrap text-slate-400 text-xs">
                      <span className="font-bold text-slate-300 px-2 py-0.5 rounded bg-white/[0.05]">Normal Text</span>
                      <div className="h-4 w-[1px] bg-white/[0.1]" />
                      <button type="button" className="p-1 hover:text-white rounded hover:bg-white/[0.08]"><Bold className="w-3.5 h-3.5" /></button>
                      <button type="button" className="p-1 hover:text-white rounded hover:bg-white/[0.08]"><Italic className="w-3.5 h-3.5" /></button>
                      <button type="button" className="p-1 hover:text-white rounded hover:bg-white/[0.08]"><Underline className="w-3.5 h-3.5" /></button>
                      <button type="button" className="p-1 hover:text-white rounded hover:bg-white/[0.08]"><Strikethrough className="w-3.5 h-3.5" /></button>
                      <div className="h-4 w-[1px] bg-white/[0.1]" />
                      {/* Color dots */}
                      <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block cursor-pointer" />
                      <span className="w-3 h-3 rounded-full bg-blue-500 inline-block cursor-pointer" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block cursor-pointer" />
                      <span className="w-3 h-3 rounded-full bg-amber-400 inline-block cursor-pointer" />
                      <span className="w-3 h-3 rounded-full bg-rose-400 inline-block cursor-pointer" />
                      <div className="h-4 w-[1px] bg-white/[0.1]" />
                      <button type="button" className="p-1 hover:text-white rounded hover:bg-white/[0.08]"><LinkIcon className="w-3.5 h-3.5" /></button>
                      <button type="button" className="p-1 hover:text-white rounded hover:bg-white/[0.08]"><List className="w-3.5 h-3.5" /></button>
                      <button type="button" className="p-1 hover:text-white rounded hover:bg-white/[0.08]"><ListOrdered className="w-3.5 h-3.5" /></button>
                      <button type="button" className="p-1 hover:text-white rounded hover:bg-white/[0.08]"><Undo className="w-3.5 h-3.5" /></button>
                      <button type="button" className="p-1 hover:text-white rounded hover:bg-white/[0.08]"><Redo className="w-3.5 h-3.5" /></button>
                    </div>

                    <textarea
                      required
                      rows={7}
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      placeholder="এখানে আপনার উত্তর টাইপ করুন (Bold, Lists, Colors, Links ইত্যাদি যুক্ত করতে পারবেন)..."
                      className="w-full p-4 bg-transparent text-white text-sm focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sendingReply}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{sendingReply ? 'পাঠানো হচ্ছে...' : 'ইমেইল উত্তর পাঠান (Send Email Reply)'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* ── 3. Main Message List & Filters (Exact match to screenshot 1) ──────── */
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1224] border border-white/[0.08] shadow-2xl space-y-6">
          
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <h2 className="text-xl font-extrabold text-white">বার্তা তালিকা</h2>
              <p className="text-xs text-slate-400 mt-1">খুঁজুন, ফিল্টার করুন এবং মেসেজের উত্তর দিন</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#060910] p-1.5 rounded-2xl border border-white/[0.08] overflow-x-auto">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'all' ? 'bg-white/[0.12] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                সব ({messages.length})
              </button>
              <button
                onClick={() => setFilterTab('pending')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                অপেক্ষমাণ ({pendingCount})
              </button>
              <button
                onClick={() => setFilterTab('replied')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'replied' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                উত্তর দেওয়া হয়েছে ({repliedCount})
              </button>
              <button
                onClick={() => setFilterTab('unread')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'unread' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                অপঠিত ({unreadCount})
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#07090F] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Message List Items */}
          <div className="space-y-4">
            {filteredMessages.map((msg) => {
              const isReplied = msg.notes?.includes('[REPLIED');

              return (
                <div
                  key={msg.id}
                  className={`p-5 rounded-2xl border transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    !msg.isRead
                      ? 'bg-gradient-to-r from-[#0E172E] via-[#0B1224] to-cyan-950/20 border-cyan-500/30'
                      : 'bg-[#07090F] border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold text-xs shrink-0 mt-0.5 shadow-md">
                      {getInitials(msg.name)}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-extrabold text-white text-base">{msg.name}</span>
                        <span className="text-xs text-slate-400 font-mono">&lt;{msg.email}&gt;</span>

                        {/* Status Badges */}
                        {isReplied ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ✓ উত্তর দেওয়া হয়েছে
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            ⌛ অপেক্ষমাণ
                          </span>
                        )}

                        {!msg.isRead && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500 text-white uppercase">
                            অপঠিত
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-200 truncate">{msg.subject || 'Hmmm'}</h4>
                      <p className="text-xs text-slate-400 truncate max-w-xl">{msg.message}</p>
                      
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                        <Clock className="w-3 h-3" />
                        {formatDateBn(msg.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleOpenDetail(msg)}
                      className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-cyan-600 hover:text-white text-slate-200 text-xs font-extrabold flex items-center gap-1.5 border border-white/[0.1] transition-all shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>বিস্তারিত ও উত্তর</span>
                    </button>

                    <button
                      onClick={() => handleToggleRead(msg.id, msg.isRead)}
                      title={msg.isRead ? 'অপঠিত চিহ্নিত করুন' : 'পঠিত চিহ্নিত করুন'}
                      className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
                    >
                      <Check className={`w-4 h-4 ${msg.isRead ? 'text-emerald-400' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      title="মুছে ফেলুন"
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredMessages.length === 0 && !loading && (
              <div className="text-center py-16 bg-[#07090F] rounded-2xl border border-white/[0.06]">
                <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-semibold">কোনো মেসেজ পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp indicator widget at bottom right */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <a
          href="https://wa.me/8801818293914"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xl border border-emerald-400/40 transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
          <span>অনলাইনে আছি, সরাসরি মেসেজ দিন 🤙</span>
          <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px]">Chat</span>
        </a>
      </div>

    </div>
  );
}
