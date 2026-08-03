'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Plus, Edit2, Trash2, Star, Search, X, Lock } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ImageUploader } from '@/components/ui/ImageUploader';

function cleanCategoryName(name?: string) {
  if (!name) return '';
  return name.replace(/^[^\x20-\x7E]+\s*/, '').trim() || name;
}

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    categoryId: '',
    banner: '',
    icon: 'Globe',
    overview: '',
    features: '',
    technologies: '',
    ctaText: 'Request Consultation',
    ctaUrl: '/contact',
    order: 0,
    isActive: true,
    isFeatured: false,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setUnauthorized(false);
      
      const [resCats] = await Promise.all([
        apiClient.get('/services/categories').catch(() => ({ data: { data: [] } })),
      ]);
      setCategories(resCats.data.data || []);

      try {
        const resServices = await apiClient.get('/services');
        setServices(resServices.data.data || []);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          setUnauthorized(true);
          const resPublic = await apiClient.get('/services/public');
          setServices(resPublic.data.data || []);
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    if (unauthorized) {
      alert('You must be logged in as Admin to perform management actions. Redirecting to login...');
      router.push('/login');
      return;
    }
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      categoryId: categories[0]?.id || '',
      banner: '',
      icon: 'Globe',
      overview: '',
      features: '',
      technologies: '',
      ctaText: 'Request Consultation',
      ctaUrl: '/contact',
      order: services.length + 1,
      isActive: true,
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    if (unauthorized) {
      alert('You must be logged in as Admin to perform management actions. Redirecting to login...');
      router.push('/login');
      return;
    }
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      categoryId: item.categoryId || '',
      banner: item.banner || '',
      icon: item.icon || 'Globe',
      overview: item.overview || '',
      features: Array.isArray(item.features) ? item.features.join(', ') : '',
      technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : '',
      ctaText: item.ctaText || 'Request Consultation',
      ctaUrl: item.ctaUrl || '/contact',
      order: item.order || 0,
      isActive: item.isActive ?? true,
      isFeatured: item.isFeatured ?? false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        order: Number(form.order),
        features: form.features.split(',').map(s => s.trim()).filter(Boolean),
        technologies: form.technologies.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (editingId) {
        await apiClient.put(`/services/${editingId}`, payload);
      } else {
        await apiClient.post('/services', payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      if (err?.response?.status === 401) {
        alert('Admin session expired. Please log in again.');
        router.push('/login');
      } else {
        alert('Failed to save service: ' + (err?.response?.data?.message || err.message));
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (unauthorized) {
      alert('You must be logged in as Admin to delete services.');
      router.push('/login');
      return;
    }
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await apiClient.delete(`/services/${id}`);
      loadData();
    } catch (err: any) {
      if (err?.response?.status === 401) {
        alert('Admin session expired. Please log in again.');
        router.push('/login');
      } else {
        alert('Failed to delete service');
      }
    }
  };

  const handleToggleFeatured = async (id: string) => {
    if (unauthorized) {
      alert('You must be logged in as Admin to toggle homepage featured status.');
      router.push('/login');
      return;
    }
    try {
      await apiClient.patch(`/services/${id}/toggle-feature`, {});
      loadData();
    } catch (err: any) {
      if (err?.response?.status === 401) {
        alert('Admin session expired. Please log in again.');
        router.push('/login');
      } else {
        alert('Failed to toggle featured status');
      }
    }
  };

  const filtered = services.filter(s => {
    const matchesSearch = s.title?.toLowerCase().includes(search.toLowerCase()) ||
                          s.overview?.toLowerCase().includes(search.toLowerCase()) ||
                          s.category?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCatId === 'ALL' || s.categoryId === selectedCatId;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 text-slate-100 pb-16">
      {/* Auth Banner */}
      {unauthorized && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold">
              You are currently viewing in read-only mode. Log in as <strong>Admin (admin@brainforceit.com)</strong> to edit or toggle featured services.
            </span>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shrink-0"
          >
            Log In as Admin
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#090D16] p-6 rounded-2xl border border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-cyan-400" />
            Software Services Catalog Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage 180+ catalog services & select Featured Services for the Homepage.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-6 rounded-2xl bg-[#0B1224] border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search services by title, technology, or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={selectedCatId}
            onChange={e => setSelectedCatId(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-[#090D16] border border-white/[0.1] text-white text-xs font-bold focus:outline-none"
          >
            <option value="ALL">All Categories ({services.length})</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/[0.04] text-xs uppercase font-bold text-slate-400">
              <tr>
                <th className="p-4 rounded-l-xl">Service Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Technologies</th>
                <th className="p-4">Homepage Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-white block">{s.title}</span>
                    <span className="text-xs text-slate-400 truncate max-w-xs block">{s.overview}</span>
                  </td>
                  <td className="p-4">
                    <span suppressHydrationWarning className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-cyan-300 border border-blue-500/20">
                      {cleanCategoryName(s.category?.name) || 'General'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {s.technologies?.slice(0, 3).map((t: string) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-white/[0.05] border border-white/[0.1]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFeatured(s.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                        s.isFeatured
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md'
                          : 'bg-white/[0.04] text-slate-500 border-white/[0.08]'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${s.isFeatured ? 'fill-current' : ''}`} />
                      {s.isFeatured ? 'Featured On Home' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      s.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(s)} className="p-2 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-sm">
                    No services found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0E1526] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Service Category *</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={e => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090D16] border border-white/[0.1] text-white text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Service Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white" />
              </div>

              {/* PROFESSIONAL DRAG & DROP PHOTO UPLOADER */}
              <ImageUploader
                label="Service Banner / Thumbnail"
                value={form.banner}
                onChange={(url) => setForm({ ...form, banner: url })}
                category="service"
                aspectRatio="banner"
              />

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Overview Description *</label>
                <textarea rows={3} required value={form.overview} onChange={e => setForm({ ...form, overview: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white resize-none" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Technologies (comma separated)</label>
                <input type="text" value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, PostgreSQL" className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white" />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 rounded text-amber-400 accent-amber-500 cursor-pointer" />
                  Show on Homepage as Featured Service
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded text-emerald-400 accent-emerald-500 cursor-pointer" />
                  Active On Website
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/[0.05] font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
