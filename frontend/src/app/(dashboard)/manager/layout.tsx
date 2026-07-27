import { requireRole } from '@/lib/session';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireRole('MANAGER');

  return (
    <DashboardShell role="manager" user={user}>
      {children}
    </DashboardShell>
  );
}
