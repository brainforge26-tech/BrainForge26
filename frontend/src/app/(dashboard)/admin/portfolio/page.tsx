'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  Plus,
  Edit2,
  Trash2,
  Star,
  Search,
  X,
  ExternalLink,
  Grid,
  List,
  Sparkles,
  Layers,
  BarChart3,
  Globe,
  Lock,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminPortfolioPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    coverImage: '',
    description: '',
    overview: '',
    technologies: '',
    industry: 'Fintech',
    features: '',
    results: '',
    liveUrl: '',
    isFeatured: false,
    order: 0,
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      setUnauthorized(false);
      const { data } = await apiClient.get('/portfolio');
      setProjects(data.data || []);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setUnauthorized(true);
        try {
          const resPublic = await apiClient.get('/portfolio');
          setProjects(resPublic.data.data || []);
        } catch { /* ignore */ }
      } else {
        console.error('Failed to load portfolio projects:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    if (unauthorized) {
      alert('Admin authentication required. Redirecting to login...');
      router.push('/login');
      return;
    }
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      description: '',
      overview: '',
      technologies: 'React, Node.js, PostgreSQL',
      industry: 'Fintech',
      features: 'Real-time Telemetry, Automated Route Dispatching',
      results: '34% Efficiency Increase, 99.9% Uptime SLA',
      liveUrl: 'https://example.com',
      isFeatured: false,
      order: projects.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    if (unauthorized) {
      alert('Admin authentication required. Redirecting to login...');
      router.push('/login');
      return;
    }
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      coverImage: item.coverImage || '',
      description: item.description || '',
      overview: item.overview || '',
      technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : '',
      industry: item.industry || 'Fintech',
      features: Array.isArray(item.features) ? item.features.join(', ') : '',
      results: Array.isArray(item.results) ? item.results.join(', ') : '',
      liveUrl: item.liveUrl || '',
      isFeatured: item.isFeatured ?? false,
      order: item.order || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        order: Number(form.order),
        technologies: form.technologies.split(',').map((s) => s.trim()).filter(Boolean),
        features: form.features.split(',').map((s) => s.trim()).filter(Boolean),
        results: form.results.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingId) {
        await apiClient.put(`/portfolio/${editingId}`, payload);
      } else {
        await apiClient.post('/portfolio', payload);
      }
      setModalOpen(false);
      loadProjects();
    } catch (err: any) {
      if (err?.response?.status === 401) {
        alert('Session expired. Please log in as Admin.');
        router.push('/login');
      } else {
        alert('Failed to save project: ' + (err?.response?.data?.message || err.message));
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (unauthorized) {
      alert('Admin authentication required.');
      router.push('/login');
      return;
    }
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      await apiClient.delete(`/portfolio/${id}`);
      loadProjects();
    } catch (err: any) {
      alert('Failed to delete project');
    }
  };

  const handleToggleFeatured = async (item: any) => {
    if (unauthorized) {
      alert('Admin authentication required.');
      router.push('/login');
      return;
    }
    try {
      await apiClient.put(`/portfolio/${item.id}`, {
        ...item,
        isFeatured: !item.isFeatured,
      });
      loadProjects();
    } catch (err) {
      alert('Failed to toggle featured status');
    }
  };

  const industriesList = Array.from(
    new Set(projects.map((p) => p.industry).filter(Boolean))
  );

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.industry?.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies?.some((t: string) =>
        t.toLowerCase().includes(search.toLowerCase())
      );
    const matchesIndustry =
      selectedIndustry === 'ALL' || p.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const featuredCount = projects.filter((p) => p.isFeatured).length;
  const liveCount = projects.filter((p) => p.liveUrl).length;

  return (
    <div className="space-y-6 text-slate-100 pb-16">
      {/* Read-Only Warning */}
      {unauthorized && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold">
              Viewing read-only mode. Please log in as <strong>Admin (admin@brainforceit.com)</strong> to edit or feature case studies.
            </span>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shrink-0"
          >
            Log In as Admin
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#090D16] via-[#0E1526] to-[#090D16] p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-2 inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Executive Showcase Manager
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 mt-1">
            <FolderKanban className="w-7 h-7 text-cyan-400" />
            Enterprise Portfolio CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage client case studies, technology stacks, metrics achieved, and highlight featured engineering projects.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Case Study
        </button>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B1224] border border-white/[0.08] shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Case Studies</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{projects.length}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1224] border border-white/[0.08] shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Homepage Featured</p>
            <h3 className="text-2xl font-extrabold text-amber-300 mt-0.5">{featuredCount}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1224] border border-white/[0.08] shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Industry Verticals</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{industriesList.length}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1224] border border-white/[0.08] shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live Demos Linkable</p>
            <h3 className="text-2xl font-extrabold text-emerald-300 mt-0.5">{liveCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-[#0B1224] border border-white/[0.08] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search case studies by title, tech stack, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full sm:w-56 px-4 py-2.5 rounded-xl bg-[#090D16] border border-white/[0.1] text-white text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Industries ({projects.length})</option>
            {industriesList.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> Grid View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" /> Table View
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-3xl bg-[#0B1224] border border-white/[0.08] hover:border-cyan-500/40 transition-all shadow-xl flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {p.coverImage && (
                  <div className="w-full h-52 rounded-2xl overflow-hidden mb-5 border border-white/[0.1] relative group-hover:scale-[1.01] transition-transform">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1224] via-transparent to-transparent opacity-80" />
                    
                    {p.industry && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-lg text-[10px] font-extrabold bg-blue-600/90 text-white border border-cyan-400/40 backdrop-blur-md shadow-md">
                        {p.industry}
                      </span>
                    )}

                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-[10px] font-extrabold border flex items-center gap-1.5 backdrop-blur-md shadow-md transition-all ${
                        p.isFeatured
                          ? 'bg-amber-500/90 text-slate-950 border-amber-400'
                          : 'bg-black/60 text-slate-300 border-white/20 hover:text-white'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${p.isFeatured ? 'fill-current' : ''}`} />
                      {p.isFeatured ? 'Featured On Home' : 'Feature'}
                    </button>
                  </div>
                )}

                <h3 className="text-xl font-extrabold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                  {p.description}
                </p>

                {p.technologies && p.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.technologies.map((t: string) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/[0.05] border border-white/[0.1] text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                {p.liveUrl ? (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Visit Live Project
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">Internal Platform</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="p-6 rounded-3xl bg-[#0B1224] border border-white/[0.08] shadow-xl overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/[0.04] text-xs uppercase font-bold text-slate-400">
              <tr>
                <th className="p-4 rounded-l-xl">Case Study</th>
                <th className="p-4">Industry</th>
                <th className="p-4">Tech Stack</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Live Link</th>
                <th className="p-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    {p.coverImage && (
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-14 h-10 rounded-lg object-cover border border-white/[0.1]"
                      />
                    )}
                    <div>
                      <span className="font-bold text-white block">{p.title}</span>
                      <span className="text-xs text-slate-400 truncate max-w-xs block">
                        {p.description}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-cyan-300 border border-blue-500/20">
                      {p.industry || 'General'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {p.technologies?.slice(0, 3).map((t: string) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-white/[0.05] border border-white/[0.1]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                        p.isFeatured
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-white/[0.04] text-slate-500 border-white/[0.08]'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-current' : ''}`} />
                      {p.isFeatured ? 'Featured On Home' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="p-4">
                    {p.liveUrl ? (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Visit Demo
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500 italic">None</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal with ImageUploader */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0E1526] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-cyan-400" />
                {editingId ? 'Edit Case Study' : 'Add Case Study'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Apex Global Supply Chain"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Industry Vertical *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    placeholder="Fintech, Logistics, Healthcare, AI"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* PROFESSIONAL DRAG & DROP PHOTO UPLOADER (NO URL INPUT NEEDED!) */}
              <ImageUploader
                label="Project Cover Photo"
                value={form.coverImage}
                onChange={(url) => setForm({ ...form, coverImage: url })}
                category="portfolio"
              />

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Executive summary of the case study platform..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white resize-none focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.technologies}
                    onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL, Docker"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Live Demo / Web URL
                  </label>
                  <input
                    type="text"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://client-demo.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-400 accent-amber-500 cursor-pointer"
                  />
                  Showcase on Homepage as Featured Project
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg"
                >
                  Save Case Study
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
