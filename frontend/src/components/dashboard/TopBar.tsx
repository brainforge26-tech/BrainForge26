'use client';

import { Bell, Search, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { logoutAction } from '@/features/auth/auth.actions';
import { Avatar } from '@/components/ui/Avatar';
import type { SessionUser } from '@/lib/session';

const ROLE_LABEL: Record<string, string> = {
  ADMIN:     'Administrator',
  MANAGER:   'Project Manager',
  DEVELOPER: 'Developer',
  CLIENT:    'Client',
};

const ROLE_COLOR: Record<string, string> = {
  ADMIN:     '#4F7DFF',
  MANAGER:   '#7C5CFF',
  DEVELOPER: '#00D4FF',
  CLIENT:    '#22C55E',
};

interface TopBarProps {
  user: SessionUser;
}

export function TopBar({ user }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#050816]/80 backdrop-blur-sm sticky top-0 z-20">
      {/* Search */}
      <div className="relative hidden sm:flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-[#7A8499]" />
        <input
          type="text"
          placeholder="Search…"
          className="w-64 pl-9 pr-4 py-2 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-[#7A8499] focus:outline-none focus:border-[#4F7DFF] focus:ring-1 focus:ring-[rgba(79,125,255,0.2)] transition-all"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#AAB3C5] hover:text-white hover:bg-white/[0.08] transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4F7DFF]" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all"
          >
            <Avatar name={user.email} size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                {user.email.split('@')[0]}
              </p>
              <p className="text-[10px] leading-tight" style={{ color: ROLE_COLOR[user.role] }}>
                {ROLE_LABEL[user.role]}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#7A8499]" />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 z-20 bg-[#0B1224] border border-white/[0.10] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-xs text-[#7A8499]">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate mt-0.5">{user.email}</p>
                </div>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#AAB3C5] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.06)] transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
