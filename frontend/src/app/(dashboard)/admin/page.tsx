import {
  Users, FolderKanban, UserCheck, TrendingUp,
  Activity, Shield, BarChart3, ArrowUpRight,
} from 'lucide-react';
import { PageHeader }  from '@/components/dashboard/PageHeader';
import { StatCard }    from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge }       from '@/components/ui/Badge';

// ─── Placeholder data (replaced with real API calls in Step 8) ───────────────
const STATS = [
  { title: 'Total Managers',    value: '6',   change: 20,   icon: Users,        iconColor: '#4F7DFF',  desc: 'vs last month' },
  { title: 'Active Projects',   value: '24',  change: 12.5, icon: FolderKanban, iconColor: '#7C5CFF',  desc: 'vs last month' },
  { title: 'Total Developers',  value: '18',  change: 8.3,  icon: UserCheck,    iconColor: '#00D4FF',  desc: 'vs last month' },
  { title: 'Revenue (Month)',   value: '$48k', change: 15.2, icon: TrendingUp,   iconColor: '#22C55E',  desc: 'vs last month' },
];

const RECENT_MANAGERS = [
  { name: 'Sarah Johnson', email: 'sarah@brainforceit.com', projects: 5, status: 'Active' },
  { name: 'Mike Chen',     email: 'mike@brainforceit.com',  projects: 3, status: 'Active' },
  { name: 'Priya Patel',   email: 'priya@brainforceit.com', projects: 7, status: 'Active' },
  { name: 'James Wilson',  email: 'james@brainforceit.com', projects: 2, status: 'Inactive' },
];

const RECENT_ACTIVITY = [
  { action: 'New client registered',       time: '2 min ago',  color: '#22C55E' },
  { action: 'Project "E-Shop" completed',  time: '1 hr ago',   color: '#4F7DFF' },
  { action: 'Manager Sarah created',       time: '3 hrs ago',  color: '#7C5CFF' },
  { action: 'Developer hired: Alex K.',    time: '5 hrs ago',  color: '#00D4FF' },
  { action: 'Invoice #INV-042 paid',       time: '1 day ago',  color: '#22C55E' },
];

export default function AdminDashboardPage() {
  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="System-wide overview of BrainForceIT operations."
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgba(79,125,255,0.1)] border border-[rgba(79,125,255,0.2)]">
            <Shield className="w-4 h-4 text-[#4F7DFF]" />
            <span className="text-xs font-semibold text-[#4F7DFF]">Admin Access</span>
          </div>
        }
      />

      {/* ── Stats row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map((s) => (
          <StatCard key={s.title} {...s} description={s.desc} />
        ))}
      </div>

      {/* ── Middle row ─────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Manager list */}
        <Card variant="default" padding="none" className="lg:col-span-2 overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <CardTitle>Managers</CardTitle>
              <a href="/admin/managers" className="flex items-center gap-1 text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Manager</th>
                  <th>Projects</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_MANAGERS.map((m) => (
                  <tr key={m.email}>
                    <td>
                      <div>
                        <p className="text-sm font-medium text-white">{m.name}</p>
                        <p className="text-xs text-[#7A8499]">{m.email}</p>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-semibold text-white">{m.projects}</span>
                    </td>
                    <td>
                      <Badge
                        variant={m.status === 'Active' ? 'success' : 'muted'}
                        size="sm" dot>
                        {m.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card variant="default" padding="md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Activity className="w-4 h-4 text-[#7A8499]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 mt-2">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.color }} />
                <div className="min-w-0">
                  <p className="text-sm text-white leading-snug">{a.action}</p>
                  <p className="text-xs text-[#7A8499] mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Analytics placeholder ───────────────────────────────────────────── */}
      <Card variant="default" padding="md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#4F7DFF]" />
            <CardTitle>Revenue Analytics</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-sm text-[#7A8499]">Charts will be wired in Step 17 — Final Optimization</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
