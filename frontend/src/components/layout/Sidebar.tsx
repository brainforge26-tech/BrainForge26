'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FolderKanban, DollarSign,
  Settings, Bell, MessageSquare, ChevronLeft,
  ChevronRight, LogOut, Zap, FileText, BarChart3,
  UserCheck, Briefcase, Home, CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type SidebarRole = 'admin' | 'manager' | 'developer' | 'client';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_BY_ROLE: Record<SidebarRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard',   href: '/admin',          icon: LayoutDashboard },
    { label: 'Managers',    href: '/admin/managers',  icon: Users },
    { label: 'Projects',    href: '/admin/projects',  icon: FolderKanban },
    { label: 'Analytics',   href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings',    href: '/admin/settings',  icon: Settings },
  ],
  manager: [
    { label: 'Dashboard',   href: '/manager',              icon: LayoutDashboard },
    { label: 'Projects',    href: '/manager/projects',     icon: FolderKanban },
    { label: 'Developers',  href: '/manager/developers',   icon: UserCheck },
    { label: 'Clients',     href: '/manager/clients',      icon: Users },
    { label: 'Hiring',      href: '/manager/hiring',       icon: Briefcase },
    { label: 'Pricing',     href: '/manager/pricing',      icon: DollarSign },
    { label: 'Homepage',    href: '/manager/homepage',     icon: Home },
    { label: 'Messages',    href: '/manager/messages',     icon: MessageSquare },
  ],
  developer: [
    { label: 'Dashboard',   href: '/developer',            icon: LayoutDashboard },
    { label: 'Projects',    href: '/developer/projects',   icon: FolderKanban },
    { label: 'Profile',     href: '/developer/profile',    icon: Users },
    { label: 'Messages',    href: '/developer/messages',   icon: MessageSquare },
    { label: 'Documents',   href: '/developer/documents',  icon: FileText },
  ],
  client: [
    { label: 'Dashboard',   href: '/client',               icon: LayoutDashboard },
    { label: 'Projects',    href: '/client/projects',      icon: FolderKanban },
    { label: 'Invoices',    href: '/client/invoices',      icon: FileText },
    { label: 'Payments',    href: '/client/payments',      icon: CreditCard },
    { label: 'Messages',    href: '/client/messages',      icon: MessageSquare },
    { label: 'Profile',     href: '/client/profile',       icon: Users },
  ],
};

interface SidebarProps {
  role: SidebarRole;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export function Sidebar({ role, userName = 'User', userEmail = '' }: SidebarProps) {
  const pathname  = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const navItems  = NAV_BY_ROLE[role];

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-[#0B1224] border-r border-white/[0.06] shrink-0 overflow-hidden"
    >
      {/* ── Logo ────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F7DFF] to-[#7C5CFF] shadow-[0_0_16px_rgba(79,125,255,0.4)] shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="font-bold text-base text-white tracking-tight whitespace-nowrap"
            >
              Brain<span className="gradient-text-blue">Force</span>IT
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav items ───────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-0.5 no-scrollbar">
        {navItems.map((item) => {
          const Icon    = item.icon;
          const active  = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                active
                  ? 'bg-[rgba(79,125,255,0.15)] text-white border border-[rgba(79,125,255,0.2)] shadow-[0_0_12px_rgba(79,125,255,0.08)]'
                  : 'text-[#AAB3C5] hover:text-white hover:bg-white/[0.05]',
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-colors',
                  active ? 'text-[#4F7DFF]' : 'text-[#7A8499] group-hover:text-white',
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && item.badge && item.badge > 0 && (
                <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-[#4F7DFF] text-[10px] font-bold text-white">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom: notifications + logout ──────────────────────────────────── */}
      <div className="px-2 py-3 border-t border-white/[0.06] space-y-0.5">
        <Link
          href={`/${role}/notifications`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#AAB3C5] hover:text-white hover:bg-white/[0.05] transition-all group"
        >
          <Bell className="w-5 h-5 shrink-0 text-[#7A8499] group-hover:text-white" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Notifications
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* User info */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] mt-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F7DFF] to-[#7C5CFF] flex items-center justify-center text-white text-xs font-bold shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{userName}</p>
                <p className="text-[11px] text-[#7A8499] truncate">{userEmail}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#7A8499] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.08)] transition-all group">
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Collapse toggle ──────────────────────────────────────────────────── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#0B1224] border border-white/[0.12] text-[#AAB3C5] hover:text-white hover:border-[#4F7DFF] transition-all shadow-md"
        aria-label="Toggle sidebar"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3" />
          : <ChevronLeft  className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
