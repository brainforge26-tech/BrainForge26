import { requireRole } from '@/lib/session';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { fetchMyDashboardStats } from '@/features/client/client.actions';

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireRole('CLIENT');
  const stats = await fetchMyDashboardStats();

  return (
    <DashboardShell 
      role="client" 
      user={user} 
      badges={{ '/client/messages': stats?.unreadMessages || 0 }}
    >
      {children}
    </DashboardShell>
  );
}
