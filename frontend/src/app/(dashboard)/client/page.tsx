import {
  FolderKanban, CreditCard, MessageSquare, CheckCircle2,
  ArrowUpRight, Clock, TrendingUp, FileText, Bell,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard }   from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge }      from '@/components/ui/Badge';
import { fetchMyDashboardStats, fetchMyProjects } from '@/features/client/client.actions';
import Link from 'next/link';

const PAYMENT_VARIANT: Record<string, 'success' | 'warning' | 'error'> = {
  PAID:    'success',
  PENDING: 'warning',
  OVERDUE: 'error',
};

const STATUS_VARIANT: Record<string, 'primary' | 'success' | 'warning' | 'muted' | 'error'> = {
  ACTIVE:    'primary',
  COMPLETED: 'success',
  PENDING:   'warning',
  ON_HOLD:   'muted',
  CANCELLED: 'error',
};

export default async function ClientDashboardPage() {
  const [stats, projects] = await Promise.all([
    fetchMyDashboardStats(),
    fetchMyProjects()
  ]);

  const STATS = [
    { title: 'Active Projects',    value: String(stats?.activeProjects || 0), change: 0, icon: FolderKanban, iconColor: '#4F7DFF', desc: 'in progress'  },
    { title: 'Completed Projects', value: String(stats?.completedProjects || 0), change: 0, icon: CheckCircle2, iconColor: '#22C55E', desc: 'all time'     },
    { title: 'Total Payments',     value: `$${(stats?.totalPayments || 0).toLocaleString()}`, change: 0, icon: CreditCard, iconColor: '#7C5CFF', desc: 'all time' },
    { title: 'Unread Messages',    value: String(stats?.unreadMessages || 0), change: 0, icon: MessageSquare, iconColor: '#F59E0B', desc: 'new'         },
  ];

  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader
        title="Client Dashboard"
        description="Track your projects, payments, and communications."
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)]">
            <Bell className="w-4 h-4 text-[#22C55E]" />
            <span className="text-xs font-semibold text-[#22C55E]">Client Portal</span>
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
        {/* My projects */}
        <Card variant="default" padding="none" className="lg:col-span-2 overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <CardTitle>My Projects</CardTitle>
              <Link href="/client/projects" className="flex items-center gap-1 text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-white/[0.05]">
              {projects.length === 0 ? (
                <div className="p-6 text-[#7A8499] text-sm text-center">No projects assigned yet.</div>
              ) : (
                projects.slice(0, 5).map((p: any) => (
                  <Link key={p.id} href={`/client/projects/${p.id}`} className="block px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{p.name}</p>
                        <p className="text-xs text-[#7A8499] mt-0.5">
                          {p.projectType} · Manager: {p.manager?.managerProfile?.firstName} {p.manager?.managerProfile?.lastName}
                        </p>
                      </div>
                      <Badge variant={STATUS_VARIANT[p.status] ?? 'muted'} size="sm" dot>
                        {p.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#4F7DFF] to-[#7C5CFF] transition-all"
                          style={{ width: `${p.completionPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-[#AAB3C5] w-10 text-right">{p.completionPercent}%</span>
                      <div className="flex items-center gap-1 text-xs text-[#7A8499]">
                        <Clock className="w-3 h-3" /> {p.estimatedDelivery ? new Date(p.estimatedDelivery).toLocaleDateString() : 'TBD'}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Side panel */}
        <div className="flex flex-col gap-5">
          {/* Recent payments */}
          <Card variant="default" padding="none" className="overflow-hidden">
            <CardHeader className="px-5 pt-5 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Payments</CardTitle>
                <Link href="/client/payments" className="flex items-center gap-1 text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-white/[0.05]">
              {!stats?.recentPayments?.length ? (
                <div className="p-5 text-[#7A8499] text-sm text-center">No recent payments.</div>
              ) : (
                stats.recentPayments.map((pay: any) => (
                  <div key={pay.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{pay.invoiceNumber}</p>
                      <p className="text-xs text-[#7A8499]">{new Date(pay.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">${Number(pay.amount).toLocaleString()}</span>
                      <Badge variant={PAYMENT_VARIANT[pay.status] || 'muted'} size="sm">{pay.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card variant="default" padding="md">
            <CardHeader><CardTitle className="text-base">Quick Links</CardTitle></CardHeader>
            <CardContent className="space-y-2 mt-1">
              {[
                { label: 'View Project Files', href: '/client/projects', icon: FileText },
                { label: 'Send Message',       href: '/client/messages', icon: MessageSquare },
                { label: 'Payment History',    href: '/client/payments', icon: TrendingUp },
                { label: 'My Profile',         href: '/client/profile',  icon: ArrowUpRight },
              ].map(({ label, href, icon: Icon }) => (
                <Link key={label} href={href}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group text-sm text-[#AAB3C5] group-hover:text-white">
                  <Icon className="w-4 h-4 text-[#4F7DFF]" />
                  {label}
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
