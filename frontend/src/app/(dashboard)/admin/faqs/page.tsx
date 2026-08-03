'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, X } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
    isActive: true,
  });

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/faqs');
      setFaqs(data.data || []);
    } catch (err) {
      console.error('Failed to load faqs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      question: '',
      answer: '',
      category: 'General',
      order: faqs.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setForm({
      question: item.question || '',
      answer: item.answer || '',
      category: item.category || 'General',
      order: item.order || 0,
      isActive: item.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editingId) {
        await apiClient.put(`/faqs/${editingId}`, payload);
      } else {
        await apiClient.post('/faqs', payload);
      }
      setModalOpen(false);
      loadFaqs();
    } catch (err) {
      alert('Failed to save FAQ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await apiClient.delete(`/faqs/${id}`);
      loadFaqs();
    } catch (err) {
      alert('Failed to delete FAQ');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-[#090D16] p-6 rounded-2xl border border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            FAQs Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage frequently asked questions & answers for website visitors.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map(faq => (
          <div key={faq.id} className="p-6 rounded-2xl bg-[#0B1224] border border-white/[0.08] flex items-start justify-between gap-4 shadow-xl">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 mb-2 inline-block">
                {faq.category}
              </span>
              <h3 className="font-bold text-white text-base mb-1">{faq.question}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEditModal(faq)} className="p-2 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(faq.id)} className="p-2 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0E1526] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-lg font-bold text-white">{editingId ? 'Edit FAQ' : 'Add FAQ'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Question *</label>
                <input type="text" required value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Answer *</label>
                <textarea rows={4} required value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category</label>
                <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/[0.05]">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">Save FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
