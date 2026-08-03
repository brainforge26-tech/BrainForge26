import { publicFetch } from '@/lib/api';
import { BookOpen, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Blog & Articles | BrainForge26',
  description: 'Insights, tech engineering articles, and software architecture thought leadership.',
};

export default async function BlogsPage() {
  let blogs: any[] = [];
  try {
    const res = await publicFetch<any>('/blogs/public');
    blogs = Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    blogs = [];
  }

  return (
    <div className="min-h-screen bg-[#060910] text-slate-100 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-cyan-400 border border-blue-500/20 uppercase tracking-widest">
            Tech Insights
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mt-4 tracking-tight">
            Engineering <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">Blog & Articles</span>
          </h1>
          <p className="mt-4 text-slate-400 text-lg leading-relaxed">
            Technical deep dives, architectural best practices, and insights from our engineering team.
          </p>
        </div>

        {/* Blogs Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.02] border border-white/[0.08] rounded-2xl">
            <p className="text-slate-400 font-medium">Articles will be published soon. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog: any) => (
              <div
                key={blog.id}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/40 p-6 backdrop-blur-xl transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  {blog.coverImage && (
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-6 border border-white/[0.08]">
                      <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {blog.category && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider mb-3 inline-block">
                      {blog.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white mb-3 hover:text-cyan-400 transition-colors">{blog.title}</h3>
                  {blog.excerpt && (
                    <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-3">{blog.excerpt}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{blog.authorName || 'BrainForge26 Team'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
