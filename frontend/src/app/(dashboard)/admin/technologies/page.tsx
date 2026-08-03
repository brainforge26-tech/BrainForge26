'use client';

import { useState, useEffect } from 'react';
import { Cpu, Plus, Edit2, Trash2, X } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function AdminTechnologiesPage() {
  const [techs, setTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'Frontend',
    description: '',
    order: 0,
    isActive: true,
  });

  const loadTechs = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/technologies');
      setTechs(data.data || []);
    } catch (err) {
      console.error('Failed to load technologies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechs();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      name: '',
      slug: '',
      category: 'Frontend',
      description: '',
      order: techs.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      slug: item.slug || '',
      category: item.category || 'Frontend',
      description: item.description || '',
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
        await apiClient.put(`/technologies/${editingId}`, payload);
      } else {
        await apiClient.post('/technologies', payload);
      }
      setModalOpen(false);
      loadTechs();
    } catch (err) {
      alert('Failed to save technology');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this technology?')) return;
    try {
      await apiClient.delete(`/technologies/${id}`);
      loadTechs();
    } catch (err) {
      alert('Failed to delete technology');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between bg-[#090D16] p-6 rounded-2xl border border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-cyan-400" />
            Technologies & Tech Stack CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage technology badges & frameworks highlighted on the website.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Technology
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {techs.map(t => (
          <div key={t.id} className="p-4 rounded-xl bg-[#0B1224] border border-white/[0.08] flex items-center justify-between shadow-md">
            <div>
              <span className="font-bold text-white text-sm block">{t.name}</span>
              <span className="text-[10px] text-cyan-400 font-semibold">{t.category}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEditModal(t)} className="p-1.5 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0E1526] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Technology' : 'Add Technology'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Technology Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category</label>
                <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Frontend, Backend, Cloud, AI" className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/[0.05]">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">Save Technology</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
