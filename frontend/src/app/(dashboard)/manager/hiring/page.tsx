import {
  Briefcase, Clock, CheckCircle2, XCircle,
  User, Mail, Phone, ExternalLink, ArrowUpRight,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge }      from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

type AppStatus = 'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'INTERVIEW' | 'HIRED' | 'REJECTED';

const STATUS_VARIANT: Record<AppStatus, 'warning' | 'primary' | 'cyan' | 'secondary' | 'success' | 'error'> = {
  PENDING:     'warning',
  REVIEWING:   'primary',
  SHORTLISTED: 'cyan',
  INTERVIEW:   'secondary',
  HIRED:       'success',
  REJECTED:    'error',
};

const PIPELINE_STEPS: { label: string; status: AppStatus; icon: React.ElementType; color: string }[] = [
  { label: 'Applications', status: 'PENDING',     icon: Clock,        color: '#F59E0B' },
  { label: 'Reviewing',    status: 'REVIEWING',   icon: Briefcase,    color: '#4F7DFF' },
  { label: 'Shortlisted',  status: 'SHORTLISTED', icon: CheckCircle2, color: '#00D4FF' },
  { label: 'Interview',    status: 'INTERVIEW',   icon: User,         color: '#7C5CFF' },
  { label: 'Hired',        status: 'HIRED',       icon: CheckCircle2, color: '#22C55E' },
];

export default async function ManagerHiringPage() {
  const { serverFetch } = await import('@/lib/api');
  let applications: any[] = [];
  try {
    const res = await serverFetch<{ data: any[] }>('/hiring');
    applications = res.data || [];
  } catch (error) {
    console.error('Failed to load applications:', error);
  }

  const counts = PIPELINE_STEPS.map(s => ({
    ...s,
    count: applications.filter(a => a.status === s.status).length,
  }));

  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader
        title="Hiring Pipeline"
        description="Review developer applications and manage the hiring process."
        action={null}
      />

      {/* Pipeline summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {counts.map(({ label, icon: Icon, color, count }) => (
          <div key={label}
            className="p-4 rounded-[20px] bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] transition-all text-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-xl font-extrabold text-white">{count}</p>
            <p className="text-xs text-[#7A8499] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Applications table */}
      <Card variant="default" padding="none" className="overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <CardTitle>All Applications</CardTitle>
            <span className="text-xs text-[#7A8499]">{applications.length} total</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/[0.04]">
            {applications.map(app => (
              <div key={app.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F7DFF]/30 to-[#7C5CFF]/20 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {app.firstName[0]}{app.lastName[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">
                      {app.firstName} {app.lastName}
                    </p>
                    <Badge variant={STATUS_VARIANT[app.status as AppStatus]} size="sm" dot>
                      {app.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-[#7A8499]">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{app.email}</span>
                    {app.phone && <span className="hidden sm:flex items-center gap-1"><Phone className="w-3 h-3" />{app.phone}</span>}
                    <span>{app.experience} yrs exp</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {app.skills.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] border border-white/[0.07] text-[#AAB3C5]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div className="hidden md:block text-right shrink-0">
                  <p className="text-xs text-[#7A8499]">Applied</p>
                  <p className="text-xs text-white mt-0.5">
                    {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {app.linkedinUrl && (
                    <a href={app.linkedinUrl}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7A8499] hover:text-white hover:bg-white/[0.06] transition-all"
                      title="View LinkedIn">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <a href={`/manager/hiring/${app.id}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4F7DFF] hover:bg-[rgba(79,125,255,0.08)] transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <p className="p-6 text-center text-[#7A8499] text-sm">No applications found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
