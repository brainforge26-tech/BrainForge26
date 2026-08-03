'use client';

import { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function AdminServiceCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    order: 0,
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/services/categories');
      setCategories(data.data || []);
    } catch (err) {
      console.error('Failed to load service categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      order: categories.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      description: item.description || '',
      order: item.order || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editingId) {
        await apiClient.put(`/services/categories/${editingId}`, payload);
      } else {
        await apiClient.post('/services/categories', payload);
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      alert('Failed to save service category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await apiClient.delete(`/services/categories/${id}`);
      loadCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 text-slate-100 max-w-4xl">
      <div className="flex items-center justify-between bg-[#090D16] p-6 rounded-2xl border border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cyan-400" />
            Service Categories
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage categories & groupings for software services.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="space-y-4">
        {categories.map(c => (
          <div key={c.id} className="p-6 rounded-2xl bg-[#0B1224] border border-white/[0.08] flex items-center justify-between shadow-xl">
            <div>
              <h3 className="font-bold text-white text-base mb-1">{c.name}</h3>
              <p className="text-xs text-slate-400">{c.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEditModal(c)} className="p-2 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white">
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
              <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/[0.05]">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
