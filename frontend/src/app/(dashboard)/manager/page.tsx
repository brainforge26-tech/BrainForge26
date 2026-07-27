import {
  FolderKanban, Users, UserCheck, CheckCircle2,
  Clock, ArrowUpRight, TrendingUp, Briefcase, MessageSquare
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard }   from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge }      from '@/components/ui/Badge';
import { fetchProjects, fetchClients, fetchDevelopers } from '@/features/manager/manager.actions';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const STATUS_VARIANT: Record<string, 'primary' | 'success' | 'warning' | 'muted'> = {
  ACTIVE:    'primary',
  PENDING:   'warning',
  COMPLETED: 'success',
  ON_HOLD:   'muted',
  CANCELLED: 'muted',
};

export default async function ManagerDashboardPage() {
  const [projectsRes, clients, developers] = await Promise.all([
    fetchProjects(1),
    fetchClients(),
    fetchDevelopers(),
  ]);

  const projects = projectsRes?.projects || [];
  const activeProjectsCount = projects.filter(p => p.status === 'ACTIVE').length;
  const completedProjectsCount = projects.filter(p => p.status === 'COMPLETED').length;

  const STATS = [
    { title: 'Active Projects',    value: String(activeProjectsCount),   change: 0, icon: FolderKanban, iconColor: '#4F7DFF', desc: 'Current active' },
    { title: 'Total Clients',      value: String(clients.length),  change: 0,  icon: Users,        iconColor: '#7C5CFF', desc: 'Registered clients' },
    { title: 'My Developers',      value: String(developers.length),   change: 0,    icon: UserCheck,    iconColor: '#00D4FF', desc: 'Available team'     },
    { title: 'Total Completed',    value: String(completedProjectsCount), change: 0, icon: CheckCircle2, iconColor: '#22C55E', desc: 'All time' },
  ];

  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader
        title="Manager Dashboard"
        description="Manage your projects, clients and team."
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.2)]">
            <Briefcase className="w-4 h-4 text-[#7C5CFF]" />
            <span className="text-xs font-semibold text-[#7C5CFF]">Manager</span>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map((s) => (
          <StatCard key={s.title} {...s} description={s.desc} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Projects table */}
        <Card variant="default" padding="none" className="lg:col-span-2 overflow-hidden flex flex-col min-h-[300px]">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>My Projects</CardTitle>
              <Link href="/manager/projects" className="flex items-center gap-1 text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-x-auto p-0">
            {projects.length > 0 ? (
              <table className="premium-table w-full">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Progress</th>
                    <th>Due</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.slice(0, 5).map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div>
                          <p className="text-sm font-medium text-white max-w-[200px] truncate">{p.name}</p>
                          <p className="text-xs text-[#7A8499] max-w-[200px] truncate">{p.client?.companyName || 'No Client'}</p>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden min-w-[60px]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#4F7DFF] to-[#7C5CFF] transition-all"
                              style={{ width: `${p.completionPercent || 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#7A8499] w-8 text-right">{p.completionPercent || 0}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1 text-xs text-[#AAB3C5]">
                          <Clock className="w-3 h-3" /> {p.estimatedDelivery ? formatDistanceToNow(new Date(p.estimatedDelivery), { addSuffix: true }) : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <Badge variant={STATUS_VARIANT[p.status] ?? 'muted'} size="sm" dot>
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-[#7A8499]">
                <FolderKanban className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm font-medium">No projects found.</p>
                <Link href="/manager/projects/new" className="mt-2 text-xs text-[#4F7DFF] hover:underline">
                  Create your first project
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 mt-2">
            {[
              { label: 'Create Project',   href: '/manager/projects/new',  color: '#4F7DFF' },
              { label: 'Add Developer',    href: '/manager/developers',    color: '#7C5CFF' },
              { label: 'View Clients',     href: '/manager/clients',       color: '#00D4FF' },
              { label: 'Post Progress',    href: '/manager/projects',      color: '#22C55E' },
              { label: 'Manage Pricing',   href: '/manager/pricing',       color: '#F59E0B' },
            ].map(({ label, href, color }) => (
              <Link key={label} href={href}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group">
                <span className="text-sm font-medium text-[#AAB3C5] group-hover:text-white transition-colors">{label}</span>
                <ArrowUpRight className="w-4 h-4 transition-colors" style={{ color }} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Revenue trend placeholder */}
      <Card variant="default" padding="md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#7C5CFF]" />
            <CardTitle>Project Progress Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-sm text-[#7A8499]">Charts will be wired in Step 17 — Final Optimization</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
