import {
  FolderKanban, CreditCard, MessageSquare, CheckCircle2,
  ArrowUpRight, Clock, TrendingUp, FileText, Bell,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard }   from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge }      from '@/components/ui/Badge';

const STATS = [
  { title: 'Active Projects',    value: '2',     change: 0,    icon: FolderKanban, iconColor: '#4F7DFF', desc: 'in progress'  },
  { title: 'Completed Projects', value: '5',     change: 25.0, icon: CheckCircle2, iconColor: '#22C55E', desc: 'all time'     },
  { title: 'Total Payments',     value: '$32k',  change: 8.3,  icon: CreditCard,   iconColor: '#7C5CFF', desc: 'all time'     },
  { title: 'Unread Messages',    value: '3',     change: 0,    icon: MessageSquare, iconColor: '#F59E0B', desc: 'new'         },
];

const MY_PROJECTS = [
  { name: 'E-Commerce Platform',  type: 'Web App',  status: 'ACTIVE',    progress: 72,  manager: 'Sarah J.', due: 'Aug 15' },
  { name: 'Mobile App',          type: 'Mobile',   status: 'ACTIVE',    progress: 45,  manager: 'Mike C.',  due: 'Sep 1'  },
  { name: 'Old Website Redesign', type: 'Web',     status: 'COMPLETED', progress: 100, manager: 'Sarah J.', due: 'Done'   },
];

const RECENT_PAYMENTS = [
  { invoice: 'INV-041', amount: '$4,500', status: 'PAID',    date: 'Jul 1' },
  { invoice: 'INV-042', amount: '$3,200', status: 'PENDING', date: 'Jul 20' },
  { invoice: 'INV-043', amount: '$2,800', status: 'OVERDUE', date: 'Jun 15' },
];

const PAYMENT_VARIANT: Record<string, 'success' | 'warning' | 'error'> = {
  PAID:    'success',
  PENDING: 'warning',
  OVERDUE: 'error',
};

const STATUS_VARIANT: Record<string, 'primary' | 'success' | 'warning' | 'muted'> = {
  ACTIVE:    'primary',
  COMPLETED: 'success',
  PENDING:   'warning',
};

export default function ClientDashboardPage() {
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
              <a href="/client/projects" className="flex items-center gap-1 text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-white/[0.05]">
              {MY_PROJECTS.map((p) => (
                <div key={p.name} className="px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{p.name}</p>
                      <p className="text-xs text-[#7A8499] mt-0.5">
                        {p.type} · Manager: {p.manager}
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
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#AAB3C5] w-10 text-right">{p.progress}%</span>
                    <div className="flex items-center gap-1 text-xs text-[#7A8499]">
                      <Clock className="w-3 h-3" /> {p.due}
                    </div>
                  </div>
                </div>
              ))}
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
                <a href="/client/payments" className="flex items-center gap-1 text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors">
                  View all <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-white/[0.05]">
              {RECENT_PAYMENTS.map((pay) => (
                <div key={pay.invoice} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{pay.invoice}</p>
                    <p className="text-xs text-[#7A8499]">{pay.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{pay.amount}</span>
                    <Badge variant={PAYMENT_VARIANT[pay.status]} size="sm">{pay.status}</Badge>
                  </div>
                </div>
              ))}
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
                <a key={label} href={href}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group text-sm text-[#AAB3C5] group-hover:text-white">
                  <Icon className="w-4 h-4 text-[#4F7DFF]" />
                  {label}
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
