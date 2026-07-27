import { requireRole } from '@/lib/session';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default async function DeveloperLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireRole('DEVELOPER');

  return (
    <DashboardShell role="developer" user={user}>
      {children}
    </DashboardShell>
  );
}
