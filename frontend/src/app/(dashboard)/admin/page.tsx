import { serverFetch } from '@/lib/api';
import {
  Globe, FolderKanban, Users, FileCheck, Mail, Briefcase,
  BookOpen, Quote, Cpu, Award, ArrowUpRight, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardOverviewPage() {
  let stats: any = {
    totalServices: 0,
    totalPortfolioProjects: 0,
    totalTeamMembers: 0,
    totalJobApplications: 0,
    unreadContactMessages: 0,
    totalActiveJobs: 0,
    totalBlogs: 0,
    totalTestimonials: 0,
    totalTechnologies: 0,
    totalClients: 0,
    recentApplications: [],
    recentMessages: [],
  };

  try {
    const res = await serverFetch<any>('/admin/stats');
    if (res?.data) stats = res.data;
  } catch (err) {
    console.error('Failed to fetch admin stats:', err);
  }

  const METRIC_CARDS = [
    { title: 'Services',             value: stats.totalServices,          href: '/admin/services',         icon: Globe,        color: 'from-blue-600 to-cyan-500' },
    { title: 'Portfolio Projects',   value: stats.totalPortfolioProjects, href: '/admin/portfolio',        icon: FolderKanban, color: 'from-indigo-600 to-purple-600' },
    { title: 'Team Members',         value: stats.totalTeamMembers,       href: '/admin/team',             icon: Users,        color: 'from-emerald-600 to-teal-500' },
    { title: 'Job Applications',     value: stats.totalJobApplications,   href: '/admin/job-applications', icon: FileCheck,    color: 'from-amber-600 to-orange-500' },
    { title: 'Unread Messages',      value: stats.unreadContactMessages,  href: '/admin/contact-messages', icon: Mail,         color: 'from-rose-600 to-pink-500' },
    { title: 'Active Jobs',          value: stats.totalActiveJobs,        href: '/admin/jobs',             icon: Briefcase,    color: 'from-cyan-600 to-blue-600' },
    { title: 'Blogs',                value: stats.totalBlogs,             href: '/admin/blogs',            icon: BookOpen,     color: 'from-violet-600 to-indigo-600' },
    { title: 'Technologies',         value: stats.totalTechnologies,      href: '/admin/technologies',     icon: Cpu,          color: 'from-teal-600 to-cyan-600' },
  ];

  return (
    <div className="space-y-8 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#090D16] p-6 rounded-2xl border border-white/[0.08] shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-cyan-400" />
            Admin Master Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">BrainForge26 Corporate CMS Control Center</p>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-bold tracking-wide uppercase">
          Role: Admin (Single Role System)
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {METRIC_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group p-5 rounded-2xl bg-[#0B1224] border border-white/[0.08] hover:border-cyan-500/40 transition-all shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white tracking-tight">{card.value}</span>
                <span className="text-xs text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-bold">
                  Manage <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Contact Messages */}
        <div className="p-6 rounded-2xl bg-[#0B1224] border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Mail className="w-5 h-5 text-rose-400" />
              Recent Contact Inquiries
            </h3>
            <Link href="/admin/contact-messages" className="text-xs font-bold text-cyan-400 hover:underline">
              View All ({stats.unreadContactMessages} Unread)
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentMessages?.map((msg: any) => (
              <div key={msg.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm">{msg.name}</span>
                  <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-cyan-400 font-medium mb-1">{msg.email} {msg.service ? `• ${msg.service}` : ''}</p>
                <p className="text-xs text-slate-300 truncate">{msg.message}</p>
              </div>
            ))}
            {(!stats.recentMessages || stats.recentMessages.length === 0) && (
              <p className="text-xs text-slate-400 text-center py-6">No contact messages received yet.</p>
            )}
          </div>
        </div>

        {/* Recent Job Applications */}
        <div className="p-6 rounded-2xl bg-[#0B1224] border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              Recent Candidate Applications
            </h3>
            <Link href="/admin/job-applications" className="text-xs font-bold text-cyan-400 hover:underline">
              View All Applications
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentApplications?.map((app: any) => (
              <div key={app.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm">{app.firstName} {app.lastName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                    {app.status}
                  </span>
                </div>
                <p className="text-xs text-cyan-400 font-medium">{app.email} • Role: {app.job?.title || 'General'}</p>
              </div>
            ))}
            {(!stats.recentApplications || stats.recentApplications.length === 0) && (
              <p className="text-xs text-slate-400 text-center py-6">No candidate job applications submitted yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
