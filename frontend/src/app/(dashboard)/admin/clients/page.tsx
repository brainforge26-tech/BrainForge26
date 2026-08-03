'use client';

import { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, X } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    logoUrl: '',
    websiteUrl: '',
    order: 0,
    isActive: true,
  });

  const loadClients = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/clients');
      setClients(data.data || []);
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      name: '',
      logoUrl: '',
      websiteUrl: '',
      order: clients.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      logoUrl: item.logoUrl || '',
      websiteUrl: item.websiteUrl || '',
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
        await apiClient.put(`/clients/${editingId}`, payload);
      } else {
        await apiClient.post('/clients', payload);
      }
      setModalOpen(false);
      loadClients();
    } catch (err) {
      alert('Failed to save client logo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client logo?')) return;
    try {
      await apiClient.delete(`/clients/${id}`);
      loadClients();
    } catch (err) {
      alert('Failed to delete client logo');
    }
  };

  return (
    <div className="space-y-6 text-slate-100 pb-16">
      <div className="flex items-center justify-between bg-[#090D16] p-6 rounded-3xl border border-white/[0.08] shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-cyan-400" />
            Client & Partner Logos Showcase
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage partner logos displayed on the homepage ticker.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Client Logo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {clients.map(c => (
          <div key={c.id} className="p-6 rounded-3xl bg-[#0B1224] border border-white/[0.08] flex flex-col justify-between items-center text-center shadow-xl hover:border-cyan-500/30 transition-all">
            {c.logoUrl ? (
              <img src={c.logoUrl} alt={c.name} className="h-14 object-contain mb-4 filter brightness-90" />
            ) : (
              <div className="h-14 flex items-center font-bold text-white text-base mb-4">{c.name}</div>
            )}
            <span className="font-bold text-white text-sm block">{c.name}</span>
            <div className="mt-4 pt-3 border-t border-white/[0.08] flex gap-2 w-full justify-center">
              <button onClick={() => openEditModal(c)} className="p-1.5 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0E1526] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Client Logo' : 'Add Client Logo'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Company / Partner Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-400 focus:outline-none" />
              </div>

              {/* PROFESSIONAL DRAG & DROP LOGO UPLOADER */}
              <ImageUploader
                label="Company / Partner Logo"
                value={form.logoUrl}
                onChange={(url) => setForm({ ...form, logoUrl: url })}
                category="clients"
                aspectRatio="square"
              />

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Website URL (optional)</label>
                <input type="text" value={form.websiteUrl} onChange={e => setForm({ ...form, websiteUrl: e.target.value })} placeholder="https://partner-company.com" className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-400 focus:outline-none" />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/[0.05] text-slate-300 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">Save Client Logo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
