'use client';

import { useState } from 'react';
import { Sidebar, SidebarRole } from './Sidebar';
import { TopBar } from '../dashboard/TopBar';
import type { SessionUser } from '@/lib/session';

interface DashboardShellProps {
  role: SidebarRole;
  user: SessionUser;
  children: React.ReactNode;
  badges?: Record<string, number>;
}

export function DashboardShell({ role, user, children, badges }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#050816] relative">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop and Mobile sliding drawer */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          role={role} 
          userName={user.email.split('@')[0]} 
          userEmail={user.email} 
          badges={badges}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopBar user={user} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative h-full">
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="relative z-10 p-4 md:p-6 lg:p-8 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
