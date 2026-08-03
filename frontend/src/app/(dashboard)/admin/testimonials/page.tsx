'use client';

import { useState, useEffect } from 'react';
import { Quote, Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    clientName: '',
    company: '',
    position: '',
    avatar: '',
    rating: 5,
    text: '',
    isActive: true,
    order: 0,
  });

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/testimonials');
      setTestimonials(data.data || []);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      clientName: '',
      company: '',
      position: 'VP of Engineering',
      avatar: '',
      rating: 5,
      text: '',
      isActive: true,
      order: testimonials.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setForm({
      clientName: item.clientName || '',
      company: item.company || '',
      position: item.position || '',
      avatar: item.avatar || '',
      rating: item.rating || 5,
      text: item.text || '',
      isActive: item.isActive ?? true,
      order: item.order || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        rating: Number(form.rating),
        order: Number(form.order),
      };

      if (editingId) {
        await apiClient.put(`/testimonials/${editingId}`, payload);
      } else {
        await apiClient.post('/testimonials', payload);
      }
      setModalOpen(false);
      loadTestimonials();
    } catch (err) {
      alert('Failed to save testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await apiClient.delete(`/testimonials/${id}`);
      loadTestimonials();
    } catch (err) {
      alert('Failed to delete testimonial');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-[#090D16] p-6 rounded-2xl border border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Quote className="w-6 h-6 text-cyan-400" />
            Client Testimonials CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage client reviews & ratings shown on the homepage.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map(t => (
          <div key={t.id} className="p-6 rounded-2xl bg-[#0B1224] border border-white/[0.08] flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {t.avatar && <img src={t.avatar} alt={t.clientName} className="w-10 h-10 rounded-full object-cover border border-cyan-500/40" />}
                <div>
                  <h4 className="font-bold text-white text-base">{t.clientName}</h4>
                  <p className="text-xs text-cyan-400">{t.position} — {t.company}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 italic mb-4 leading-relaxed">"{t.text}"</p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(t)} className="p-1.5 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0E1526] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Client Name *</label>
                <input type="text" required value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Company</label>
                  <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Position</label>
                  <input type="text" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Avatar Image URL</label>
                <input type="text" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Review Text *</label>
                <textarea rows={3} required value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/[0.05]">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">Save Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
