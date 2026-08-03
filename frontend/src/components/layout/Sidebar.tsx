'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Globe, Layers, FolderKanban, Building2,
  Briefcase, FileCheck, BookOpen, Quote, HelpCircle,
  Users, Cpu, Award, Image, Settings, Mail,
  ChevronLeft, ChevronRight, LogOut, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type SidebarRole = 'admin';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',          href: '/admin',                  icon: LayoutDashboard },
  { label: 'Services',           href: '/admin/services',          icon: Globe },
  { label: 'Service Categories', href: '/admin/service-categories',icon: Layers },
  { label: 'Portfolio',          href: '/admin/portfolio',         icon: FolderKanban },
  { label: 'Industries',         href: '/admin/industries',        icon: Building2 },
  { label: 'Jobs',               href: '/admin/jobs',              icon: Briefcase },
  { label: 'Job Applications',   href: '/admin/job-applications',  icon: FileCheck },
  { label: 'Blogs',              href: '/admin/blogs',             icon: BookOpen },
  { label: 'Testimonials',       href: '/admin/testimonials',      icon: Quote },
  { label: 'FAQs',               href: '/admin/faqs',              icon: HelpCircle },
  { label: 'Team Members',       href: '/admin/team',              icon: Users },
  { label: 'Technologies',       href: '/admin/technologies',      icon: Cpu },
  { label: 'Clients',            href: '/admin/clients',           icon: Award },
  { label: 'Media Library',      href: '/admin/media',             icon: Image },
  { label: 'Site Settings',      href: '/admin/settings',          icon: Settings },
  { label: 'Contact Messages',   href: '/admin/contact-messages',  icon: Mail },
];

interface SidebarProps {
  role?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  badges?: Record<string, number>;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({ userName = 'Admin', userEmail = 'admin@brainforceit.com', badges, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (mobileOpen && setMobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    if (typeof window !== 'undefined') {
      window.__accessToken = undefined;
    }
    router.push('/admin/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-[#090D16] border-r border-white/[0.08] shrink-0 overflow-hidden text-slate-200 select-none shadow-2xl"
    >
      {/* ── Header / Logo ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.08] shrink-0">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 shadow-[0_0_18px_rgba(59,130,246,0.5)] shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="text-sm font-bold text-white tracking-wide">BrainForge26</span>
                <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">Admin Portal</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Navigation Links ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 custom-scrollbar">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const badgeValue = badges?.[item.href];

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative',
                isActive
                  ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-[0_4px_16px_rgba(59,130,246,0.3)] font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0 transition-colors', isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400')} />
              
              {!collapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {badgeValue ? (
                <span className={cn(
                  'flex items-center justify-center rounded-full text-[10px] font-bold shrink-0',
                  collapsed ? 'absolute top-1 right-1 px-1.5 py-0.5 bg-rose-500 text-white' : 'px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30'
                )}>
                  {badgeValue}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>

      {/* ── Admin Footer / User Profile ──────────────────────────────────── */}
      <div className="p-3 border-t border-white/[0.08] bg-[#060910]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
              {userName.charAt(0)}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">{userName}</span>
                <span className="text-[10px] text-slate-400 truncate">{userEmail}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
