import { requireRole } from '@/lib/session';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireRole('ADMIN');

  return (
    <DashboardShell role="admin" user={user}>
      {children}
    </DashboardShell>
  );
}
