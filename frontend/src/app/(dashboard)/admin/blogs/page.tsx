'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Plus, Edit2, Trash2, X, Lock } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    coverImage: '',
    content: '',
    excerpt: '',
    category: 'Engineering',
    authorName: 'BrainForge26 Team',
    tags: '',
    isPublished: true,
  });

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setUnauthorized(false);
      const { data } = await apiClient.get('/blogs');
      setBlogs(data.data || []);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setUnauthorized(true);
        try {
          const resPublic = await apiClient.get('/blogs/public');
          setBlogs(resPublic.data.data || []);
        } catch { /* ignore */ }
      } else {
        console.error('Failed to load blogs:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const openCreateModal = () => {
    if (unauthorized) {
      alert('Admin login required.');
      router.push('/login');
      return;
    }
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
      content: '### Article Overview\nModern software development requires robust microservice architectures and automated CI/CD.\n\n### Key Takeaways\n- Use Server-Side Rendering for fast LCP scores.\n- Implement strict API authorization middleware.',
      excerpt: 'Learn how to architect high scale web platforms with Next.js 15 and Node.js.',
      category: 'Engineering',
      authorName: 'BrainForge26 Team',
      tags: 'Next.js, Architecture, Microservices',
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    if (unauthorized) {
      alert('Admin login required.');
      router.push('/login');
      return;
    }
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      coverImage: item.coverImage || '',
      content: item.content || '',
      excerpt: item.excerpt || '',
      category: item.category || 'Engineering',
      authorName: item.authorName || 'BrainForge26 Team',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      isPublished: item.isPublished ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (editingId) {
        await apiClient.put(`/blogs/${editingId}`, payload);
      } else {
        await apiClient.post('/blogs', payload);
      }
      setModalOpen(false);
      loadBlogs();
    } catch (err: any) {
      alert('Failed to save blog post');
    }
  };

  const handleDelete = async (id: string) => {
    if (unauthorized) {
      alert('Admin login required.');
      router.push('/login');
      return;
    }
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await apiClient.delete(`/blogs/${id}`);
      loadBlogs();
    } catch (err) {
      alert('Failed to delete blog post');
    }
  };

  return (
    <div className="space-y-6 text-slate-100 pb-16">
      {/* Auth Alert */}
      {unauthorized && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold">
              Viewing read-only mode. Log in as <strong>Admin (admin@brainforceit.com)</strong> to publish articles.
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
            <BookOpen className="w-6 h-6 text-cyan-400" />
            Blogs & Tech Articles CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">Publish & manage engineering articles for the company blog.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Blog Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(b => (
          <div key={b.id} className="p-6 rounded-3xl bg-[#0B1224] border border-white/[0.08] flex flex-col justify-between shadow-xl hover:border-cyan-500/30 transition-all">
            <div>
              {b.coverImage && (
                <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 border border-white/[0.08]">
                  <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                </div>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 mb-2 inline-block">
                {b.category}
              </span>
              <h3 className="font-bold text-white text-base mb-2">{b.title}</h3>
              <p className="text-xs text-slate-400 mb-4 line-clamp-3">{b.excerpt || b.content}</p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] flex justify-end gap-2">
              <button onClick={() => openEditModal(b)} className="p-2 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(b.id)} className="p-2 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0E1526] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Article' : 'Create Article'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Article Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-400 focus:outline-none" />
              </div>

              {/* PROFESSIONAL DRAG & DROP PHOTO UPLOADER */}
              <ImageUploader
                label="Article Cover Image"
                value={form.coverImage}
                onChange={(url) => setForm({ ...form, coverImage: url })}
                category="blogs"
                aspectRatio="banner"
              />

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Excerpt Summary</label>
                <textarea rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white resize-none focus:border-cyan-400 focus:outline-none" />
              </div>

              {/* RICH TEXT EDITOR */}
              <RichTextEditor
                label="Article Content (Rich Text)"
                required
                value={form.content}
                onChange={(val) => setForm({ ...form, content: val })}
                placeholder="Write your tech article with headings, lists, bold text..."
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/[0.05] text-slate-300 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">Publish Article</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
