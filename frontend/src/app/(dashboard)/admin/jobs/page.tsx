'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  X,
  MapPin,
  DollarSign,
  Lock,
  Clock,
  Sparkles,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { FormattedText } from '@/components/ui/FormattedText';

export default function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    type: 'FULL_TIME',
    experience: '3+ Years',
    description: '',
    requirements: '',
    responsibilities: '',
    salaryRange: '$110,000 - $140,000 / year',
    isActive: true,
  });

  const loadJobs = async () => {
    try {
      setLoading(true);
      setUnauthorized(false);
      const { data } = await apiClient.get('/jobs/jobs');
      setJobs(data.data || []);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setUnauthorized(true);
        try {
          const resPublic = await apiClient.get('/jobs/jobs/public');
          setJobs(resPublic.data.data || []);
        } catch { /* ignore */ }
      } else {
        console.error('Failed to load jobs:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const openCreateModal = () => {
    if (unauthorized) {
      alert('Admin login required. Redirecting to login page...');
      router.push('/login');
      return;
    }
    setEditingId(null);
    setForm({
      title: '',
      department: 'Engineering',
      location: 'Remote',
      type: 'FULL_TIME',
      experience: '3+ Years',
      description: '### Role Overview\nWe are looking for a Senior Full-Stack Engineer to architect enterprise web platforms.\n\n### Key Expected Outcomes\n- Lead high-performance microservice development.\n- Mentor junior developers and enforce unit test coverage.',
      requirements: '- 5+ years experience with React, Next.js, and Node.js\n- Strong proficiency in PostgreSQL and REST APIs\n- Experience with Docker and AWS deployment',
      responsibilities: '- Architect scalable frontend and backend features\n- Conduct code reviews and optimize query performance\n- Collaborate with UI/UX designers and product managers',
      salaryRange: '$110,000 - $140,000 / year',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    if (unauthorized) {
      alert('Admin login required. Redirecting to login page...');
      router.push('/login');
      return;
    }
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      department: item.department || 'Engineering',
      location: item.location || 'Remote',
      type: item.type || 'FULL_TIME',
      experience: item.experience || '3+ Years',
      description: item.description || '',
      requirements: Array.isArray(item.requirements) ? item.requirements.join('\n- ') : item.requirements || '',
      responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities.join('\n- ') : item.responsibilities || '',
      salaryRange: item.salaryRange || '',
      isActive: item.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split('\n').map((s) => s.trim().replace(/^-\s*/, '')).filter(Boolean),
        responsibilities: form.responsibilities.split('\n').map((s) => s.trim().replace(/^-\s*/, '')).filter(Boolean),
      };

      if (editingId) {
        await apiClient.put(`/jobs/jobs/${editingId}`, payload);
      } else {
        await apiClient.post('/jobs/jobs', payload);
      }
      setModalOpen(false);
      loadJobs();
    } catch (err: any) {
      if (err?.response?.status === 401) {
        alert('Session expired. Please log in as Admin.');
        router.push('/login');
      } else {
        alert('Failed to save job posting: ' + (err?.response?.data?.message || err.message));
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (unauthorized) {
      alert('Admin login required.');
      router.push('/login');
      return;
    }
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await apiClient.delete(`/jobs/jobs/${id}`);
      loadJobs();
    } catch (err) {
      alert('Failed to delete job posting');
    }
  };

  return (
    <div className="space-y-6 text-slate-100 pb-16">
      {/* Read-only Alert */}
      {unauthorized && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold">
              Viewing read-only mode. Log in as <strong>Admin (admin@brainforceit.com)</strong> to create or edit job openings.
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#090D16] p-6 rounded-3xl border border-white/[0.08] shadow-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            Job Openings Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Create, edit, and format job descriptions with rich text editor.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> Create Job Opening
        </button>
      </div>

      {/* Job Openings List */}
      <div className="space-y-4">
        {jobs.map((j) => (
          <div
            key={j.id}
            className="p-6 rounded-3xl bg-[#0B1224] border border-white/[0.08] shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-extrabold text-white text-xl">{j.title}</span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                    {j.department}
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                      j.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {j.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {j.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> {j.experience || j.type}
                  </span>
                  {j.salaryRange && (
                    <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5" /> {j.salaryRange}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(j)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Job
                </button>
                <button
                  onClick={() => handleDelete(j.id)}
                  className="p-2 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description Formatted Display */}
            {j.description && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                  Job Description & Scope
                </span>
                <FormattedText content={j.description} />
              </div>
            )}
          </div>
        ))}

        {jobs.length === 0 && !loading && (
          <div className="text-center py-16 bg-[#0B1224] rounded-3xl border border-white/[0.08]">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-bold text-sm">No job postings found.</p>
          </div>
        )}
      </div>

      {/* Modal with Rich Text Editor */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0E1526] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                {editingId ? 'Edit Job Opening' : 'Create Job Opening'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Senior Lead Full-Stack Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={form.salaryRange}
                  onChange={(e) => setForm({ ...form, salaryRange: e.target.value })}
                  placeholder="$110,000 - $140,000 / year"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* RICH TEXT EDITOR FOR JOB DESCRIPTION */}
              <RichTextEditor
                label="Job Description & Responsibilities (Rich Text)"
                required
                value={form.description}
                onChange={(val) => setForm({ ...form, description: val })}
                placeholder="### Role Overview&#10;We are seeking an experienced engineer...&#10;&#10;- Lead full-stack feature development&#10;- Optimize database queries and API response times"
              />

              <RichTextEditor
                label="Requirements & Qualifications (One per line or formatted)"
                value={form.requirements}
                onChange={(val) => setForm({ ...form, requirements: val })}
                placeholder="- 5+ years experience with Next.js & React&#10;- Strong knowledge of PostgreSQL"
              />

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
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg"
                >
                  Save Job Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
