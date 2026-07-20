import { requireRole } from '@/lib/session';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar }  from '@/components/dashboard/TopBar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // requireRole redirects internally if auth/role fails — never throws to caller
  const { user } = await requireRole('ADMIN');

  return (
    <div className="flex h-screen overflow-hidden bg-[#050816]">
      <Sidebar role="admin" userName={user.email.split('@')[0]} userEmail={user.email} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="relative z-10 p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
