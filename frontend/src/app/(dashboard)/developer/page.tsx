import {
  FolderKanban, CheckCircle2, Clock, Code2,
  ArrowUpRight, Star, FileText,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard }   from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge }      from '@/components/ui/Badge';

const STATS = [
  { title: 'Assigned Projects', value: '3',  change: 0,    icon: FolderKanban, iconColor: '#4F7DFF', desc: 'current' },
  { title: 'Completed',         value: '12', change: 20.0, icon: CheckCircle2, iconColor: '#22C55E', desc: 'all time' },
  { title: 'In Progress',       value: '2',  change: 0,    icon: Clock,        iconColor: '#F59E0B', desc: 'active tasks' },
  { title: 'Skills Listed',     value: '8',  change: 14.3, icon: Code2,        iconColor: '#7C5CFF', desc: 'on profile' },
];

const ASSIGNED_PROJECTS = [
  { name: 'E-Commerce Rebuild',  role: 'Frontend Lead', status: 'ACTIVE',   progress: 72, manager: 'Sarah J.' },
  { name: 'Mobile App v2',       role: 'Full-Stack',    status: 'ACTIVE',   progress: 45, manager: 'Mike C.'  },
  { name: 'API Gateway Service', role: 'Backend Dev',   status: 'PENDING',  progress: 0,  manager: 'Sarah J.' },
];

const STATUS_VARIANT: Record<string, 'primary' | 'warning' | 'success' | 'muted'> = {
  ACTIVE:    'primary',
  PENDING:   'warning',
  COMPLETED: 'success',
};

export default function DeveloperDashboardPage() {
  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader
        title="Developer Dashboard"
        description="Your assigned projects and profile."
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)]">
            <Code2 className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-xs font-semibold text-[#00D4FF]">Developer</span>
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
        {/* Assigned projects */}
        <Card variant="default" padding="none" className="lg:col-span-2 overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <CardTitle>Assigned Projects</CardTitle>
              <a href="/developer/projects" className="flex items-center gap-1 text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-white/[0.05]">
              {ASSIGNED_PROJECTS.map((p) => (
                <div key={p.name} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                      <Badge variant={STATUS_VARIANT[p.status] ?? 'muted'} size="sm">{p.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#7A8499]">
                      <span>Role: <span className="text-[#AAB3C5]">{p.role}</span></span>
                      <span>·</span>
                      <span>Manager: <span className="text-[#AAB3C5]">{p.manager}</span></span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-white">{p.progress}%</p>
                    <div className="w-20 h-1.5 bg-white/[0.08] rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#4F7DFF] to-[#00D4FF]"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile quick view */}
        <Card variant="default" padding="md" className="flex flex-col gap-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Profile</CardTitle>
              <a href="/developer/profile" className="text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors">
                Edit
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Availability */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <span className="text-sm text-[#AAB3C5]">Availability</span>
              <Badge variant="success" size="sm" dot>Available</Badge>
            </div>
            {/* Skills preview */}
            <div>
              <p className="text-xs text-[#7A8499] mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'].map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-full text-[11px] bg-white/[0.05] border border-white/[0.08] text-[#AAB3C5]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {/* Quick links */}
            {[
              { label: 'Upload Resume',   href: '/developer/documents', icon: FileText },
              { label: 'View Portfolio',  href: '/developer/profile',   icon: Star },
              { label: 'My Messages',     href: '/developer/messages',  icon: ArrowUpRight },
            ].map(({ label, href, icon: Icon }) => (
              <a key={label} href={href}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group text-sm text-[#AAB3C5] group-hover:text-white">
                <Icon className="w-4 h-4 text-[#4F7DFF]" />
                {label}
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
