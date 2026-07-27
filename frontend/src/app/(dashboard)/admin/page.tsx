import {
  Users, FolderKanban, UserCheck, TrendingUp,
  Shield, ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader }  from '@/components/dashboard/PageHeader';
import { StatCard }    from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge }       from '@/components/ui/Badge';
import { fetchAdminStats, fetchManagers } from '@/features/admin/admin.actions';
import { fetchProjects } from '@/features/manager/manager.actions';

export default async function AdminDashboardPage() {
  const stats = await fetchAdminStats().catch(() => ({
    totalManagers: 0,
    totalDevelopers: 0,
    totalClients: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalRevenue: 0,
  }));

  const managersData = await fetchManagers(1, '').catch(() => ({
    managers: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  }));

  const projectsData = await fetchProjects(1).catch(() => ({
    projects: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  }));

  const STAT_CARDS = [
    { title: 'Total Managers',    value: String(stats.totalManagers),   icon: Users,        iconColor: '#730E27', desc: 'System administrators' },
    { title: 'Active Projects',   value: String(stats.activeProjects),  icon: FolderKanban, iconColor: '#8B1532', desc: `${stats.totalProjects} total projects` },
    { title: 'Total Developers',  value: String(stats.totalDevelopers), icon: UserCheck,    iconColor: '#00D26A', desc: 'Active engineer roster' },
    { title: 'Total Revenue',     value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, iconColor: '#22C55E', desc: 'Completed milestone pay' },
  ];

  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="System-wide overview of BrainForgeIT operations and live backend metrics."
        action={
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[rgba(115,14,39,0.12)] border border-[rgba(115,14,39,0.25)]">
            <Shield className="w-4 h-4 text-[#8B1532]" />
            <span className="text-xs font-bold text-[#8B1532]">Live Admin Control</span>
          </div>
        }
      />

      {/* ── Dynamic Stats row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STAT_CARDS.map((s) => (
          <StatCard key={s.title} {...s} description={s.desc} />
        ))}
      </div>

      {/* ── Middle row: Managers & Recent Projects ──────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Manager list (Dynamic API) */}
        <Card variant="default" padding="none" className="lg:col-span-2 overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <CardTitle>System Managers</CardTitle>
              <Link href="/admin/managers" className="flex items-center gap-1 text-xs text-[#8B1532] hover:text-white transition-colors font-bold">
                View all ({managersData.pagination.total}) <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Manager</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {managersData.managers.map((m) => {
                  const name = m.managerProfile ? `${m.managerProfile.firstName} ${m.managerProfile.lastName}` : m.email.split('@')[0];
                  return (
                    <tr key={m.id}>
                      <td>
                        <div>
                          <p className="text-sm font-medium text-white">{name}</p>
                          <p className="text-xs text-[#7A8499]">{m.email}</p>
                        </div>
                      </td>
                      <td>
                        <span className="text-sm font-semibold text-[#AAB3C5]">
                          {m.managerProfile?.department || 'Operations'}
                        </span>
                      </td>
                      <td>
                        <Badge
                          variant={m.isActive ? 'success' : 'muted'}
                          size="sm" dot>
                          {m.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
                {managersData.managers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-sm text-[#7A8499]">
                      No managers registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Live Projects Feed (Dynamic API) */}
        <Card variant="default" padding="md">
          <CardHeader>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <CardTitle>Recent Projects</CardTitle>
              <Link href="/admin/projects" className="flex items-center gap-1 text-xs text-[#8B1532] hover:text-white transition-colors font-bold">
                All Projects <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 mt-3">
            {projectsData.projects.slice(0, 5).map((p) => (
              <Link key={p.id} href={`/admin/projects/${p.id}`} className="block p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-white truncate">{p.name}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(115,14,39,0.15)] text-[#8B1532]">
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-[#7A8499]">Client: {p.client?.companyName || 'N/A'}</p>
              </Link>
            ))}
            {projectsData.projects.length === 0 && (
              <p className="text-xs text-[#7A8499] text-center py-6">No projects found in database.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
