'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, Edit2, Trash2, Star, Check, X, Search, Lock } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminTeamManagementPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    position: '',
    avatar: '',
    bio: '',
    skills: '',
    technologies: '',
    experience: '',
    portfolioLinks: '',
    githubUrl: '',
    linkedinUrl: '',
    email: '',
    displayOrder: 0,
    isActive: true,
    isFeatured: false,
  });

  const loadTeam = async () => {
    try {
      setLoading(true);
      setUnauthorized(false);
      const { data } = await apiClient.get('/team');
      setTeamMembers(data.data || []);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setUnauthorized(true);
        try {
          const resPublic = await apiClient.get('/team/public');
          setTeamMembers(resPublic.data.data || []);
        } catch { /* ignore */ }
      } else {
        console.error('Failed to load team members:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const openCreateModal = () => {
    if (unauthorized) {
      alert('Admin login required.');
      router.push('/login');
      return;
    }
    setEditingId(null);
    setForm({
      name: '',
      position: 'Lead Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      bio: '',
      skills: 'Full-Stack Architecture, Node.js, Next.js',
      technologies: 'React, TypeScript, Node.js, PostgreSQL',
      experience: '5+ Years',
      portfolioLinks: '',
      githubUrl: '',
      linkedinUrl: '',
      email: '',
      displayOrder: teamMembers.length + 1,
      isActive: true,
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (member: any) => {
    if (unauthorized) {
      alert('Admin login required.');
      router.push('/login');
      return;
    }
    setEditingId(member.id);
    setForm({
      name: member.name || '',
      position: member.position || '',
      avatar: member.avatar || '',
      bio: member.bio || '',
      skills: Array.isArray(member.skills) ? member.skills.join(', ') : '',
      technologies: Array.isArray(member.technologies) ? member.technologies.join(', ') : '',
      experience: member.experience || '',
      portfolioLinks: Array.isArray(member.portfolioLinks) ? member.portfolioLinks.join(', ') : '',
      githubUrl: member.githubUrl || '',
      linkedinUrl: member.linkedinUrl || '',
      email: member.email || '',
      displayOrder: member.displayOrder || 0,
      isActive: member.isActive ?? true,
      isFeatured: member.isFeatured ?? false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        displayOrder: Number(form.displayOrder),
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        technologies: form.technologies.split(',').map(s => s.trim()).filter(Boolean),
        portfolioLinks: form.portfolioLinks.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (editingId) {
        await apiClient.put(`/team/${editingId}`, payload);
      } else {
        await apiClient.post('/team', payload);
      }
      setModalOpen(false);
      loadTeam();
    } catch (err: any) {
      alert('Failed to save team member');
    }
  };

  const handleDelete = async (id: string) => {
    if (unauthorized) {
      alert('Admin login required.');
      router.push('/login');
      return;
    }
    if (!confirm('Are you sure you want to delete this developer showcase profile?')) return;
    try {
      await apiClient.delete(`/team/${id}`);
      loadTeam();
    } catch (err) {
      alert('Failed to delete team member');
    }
  };

  const handleToggleFeature = async (id: string) => {
    if (unauthorized) {
      alert('Admin login required.');
      router.push('/login');
      return;
    }
    try {
      await apiClient.patch(`/team/${id}/toggle-feature`, {});
      loadTeam();
    } catch (err) {
      alert('Failed to toggle featured status');
    }
  };

  const filtered = teamMembers.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.position?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100 pb-16">
      {/* Read-Only Warning */}
      {unauthorized && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold">
              Viewing read-only mode. Log in as <strong>Admin (admin@brainforceit.com)</strong> to edit developer profiles.
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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#090D16] p-6 rounded-3xl border border-white/[0.08] shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-cyan-400" />
            Developer Team Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage showcase developer profiles for the website "Our Team" page. (Showcase profiles only).</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Developer Profile
        </button>
      </div>

      {/* Filter & Table */}
      <div className="p-6 rounded-3xl bg-[#0B1224] border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search developers by name or position..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/[0.04] text-xs uppercase font-bold text-slate-400">
              <tr>
                <th className="p-4 rounded-l-xl">Developer</th>
                <th className="p-4">Position</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Skills</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.map(member => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-cyan-500/40 bg-blue-950/60 shrink-0">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-white bg-blue-600">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{member.name}</span>
                        <span className="text-xs text-slate-400">{member.email || 'No email provided'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-cyan-400">{member.position}</td>
                  <td className="p-4 text-xs font-medium">{member.experience || 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {member.skills?.slice(0, 3).map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-white/[0.05] border border-white/[0.1]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFeature(member.id)}
                      className={`p-1.5 rounded-lg border ${
                        member.isFeatured
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-white/[0.05] text-slate-500 border-white/[0.1]'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      member.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(member)}
                      className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-cyan-300 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-2 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-sm">
                    No developer profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0E1526] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Edit Developer Showcase Profile' : 'Add Developer Showcase Profile'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Developer Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Alex Vance"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Position / Title *</label>
                  <input
                    type="text"
                    required
                    value={form.position}
                    onChange={e => setForm({ ...form, position: e.target.value })}
                    placeholder="Lead React Developer"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* PROFESSIONAL DRAG & DROP PHOTO UPLOADER */}
              <ImageUploader
                label="Developer Profile Photo"
                value={form.avatar}
                onChange={(url) => setForm({ ...form, avatar: url })}
                category="team"
                aspectRatio="square"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Years of Experience</label>
                  <input
                    type="text"
                    value={form.experience}
                    onChange={e => setForm({ ...form, experience: e.target.value })}
                    placeholder="5+ Years"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Email (optional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Short Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="Specialist in React, Next.js, and high scale Node.js APIs..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={form.skills}
                    onChange={e => setForm({ ...form, skills: e.target.value })}
                    placeholder="Frontend, Microservices, Security"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={form.technologies}
                    onChange={e => setForm({ ...form, technologies: e.target.value })}
                    placeholder="React, Next.js, Node.js, PostgreSQL"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-400 accent-amber-500 cursor-pointer"
                  />
                  Featured Developer
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-400 accent-emerald-500 cursor-pointer"
                  />
                  Active On Website
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold"
                >
                  {editingId ? 'Save Changes' : 'Create Developer Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
