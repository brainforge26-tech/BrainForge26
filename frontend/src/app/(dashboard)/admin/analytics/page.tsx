import { Suspense }       from 'react';
import { BarChart3, TrendingUp, Users, FolderKanban, DollarSign, UserCheck } from 'lucide-react';
import { PageHeader }    from '@/components/dashboard/PageHeader';
import { StatCard }      from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Spinner }       from '@/components/ui/Spinner';

async function StatsCards() {
  const { fetchAdminStats } = await import('@/features/admin/admin.actions');
  const stats = await fetchAdminStats().catch(() => null);

  if (!stats) {
    return (
      <div className="col-span-4 text-center py-12 text-[#7A8499] text-sm">
        Could not load stats — make sure the backend is running.
      </div>
    );
  }

  const cards = [
    { title: 'Total Managers',    value: String(stats.totalManagers),    icon: Users,        iconColor: '#4F7DFF' },
    { title: 'Total Developers',  value: String(stats.totalDevelopers),  icon: UserCheck,    iconColor: '#7C5CFF' },
    { title: 'Total Clients',     value: String(stats.totalClients),     icon: Users,        iconColor: '#00D4FF' },
    { title: 'Total Projects',    value: String(stats.totalProjects),    icon: FolderKanban, iconColor: '#22C55E' },
    { title: 'Active Projects',   value: String(stats.activeProjects),   icon: TrendingUp,   iconColor: '#F59E0B' },
    { title: 'Completed Projects',value: String(stats.completedProjects),icon: FolderKanban, iconColor: '#22C55E' },
    { title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconColor: '#22C55E',
    },
  ];

  return (
    <>
      {cards.map(c => <StatCard key={c.title} {...c} />)}
    </>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader
        title="Analytics"
        description="System-wide metrics and performance overview."
      />

      {/* Live stats from backend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <Suspense fallback={
          <div className="col-span-4 flex items-center gap-3 text-[#7A8499] text-sm">
            <Spinner size="sm" /> Loading live stats…
          </div>
        }>
          <StatsCards />
        </Suspense>
      </div>

      {/* Chart placeholders */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card variant="default" padding="md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#4F7DFF]" />
              <CardTitle>Monthly Revenue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-sm text-[#7A8499]">Chart integration — Step 17</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" padding="md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-[#7C5CFF]" />
              <CardTitle>Projects by Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-sm text-[#7A8499]">Chart integration — Step 17</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" padding="md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#00D4FF]" />
              <CardTitle>User Growth</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-sm text-[#7A8499]">Chart integration — Step 17</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" padding="md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#22C55E]" />
              <CardTitle>Project Completion Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-sm text-[#7A8499]">Chart integration — Step 17</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
