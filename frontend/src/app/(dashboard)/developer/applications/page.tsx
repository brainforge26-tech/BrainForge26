import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fetchMyApplications } from '@/features/developer/developer.actions';
import { Clock, Briefcase, CheckCircle2, User, XCircle, ChevronRight } from 'lucide-react';

type AppStatus = 'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'INTERVIEW' | 'HIRED' | 'REJECTED';

const STATUS_VARIANT: Record<AppStatus, 'warning' | 'primary' | 'cyan' | 'secondary' | 'success' | 'error'> = {
  PENDING:     'warning',
  REVIEWING:   'primary',
  SHORTLISTED: 'cyan',
  INTERVIEW:   'secondary',
  HIRED:       'success',
  REJECTED:    'error',
};

const STATUS_ICONS: Record<AppStatus, React.ElementType> = {
  PENDING:     Clock,
  REVIEWING:   Briefcase,
  SHORTLISTED: CheckCircle2,
  INTERVIEW:   User,
  HIRED:       CheckCircle2,
  REJECTED:    XCircle,
};

export default async function DeveloperApplicationsPage() {
  const applications = await fetchMyApplications();

  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader
        title="My Applications"
        description="Track the status of your hiring applications with BrainForceIT."
      />

      {applications.length === 0 ? (
        <Card variant="default" padding="lg">
          <CardContent className="text-center py-12">
            <Briefcase className="w-12 h-12 text-[#7A8499] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-white mb-2">No Applications Found</h3>
            <p className="text-[#AAB3C5] max-w-sm mx-auto mb-6">
              You haven't submitted any applications yet, or your email doesn't match any existing applications.
            </p>
            <a href="/apply" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-full">
              Apply Now
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app: any) => {
            const Icon = STATUS_ICONS[app.status as AppStatus] || Clock;
            return (
              <Card key={app.id} variant="default" padding="lg" className="hover:border-white/[0.12] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#4F7DFF] to-[#7C5CFF] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.03] border border-white/[0.08]`}>
                      <Icon className="w-5 h-5 text-[#AAB3C5]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Application to BrainForceIT</h3>
                      <p className="text-sm text-[#7A8499] mt-1">
                        Submitted on {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {app.skills.slice(0, 5).map((s: string) => (
                          <span key={s} className="px-2 py-0.5 rounded-full text-[11px] bg-white/[0.05] border border-white/[0.08] text-[#AAB3C5]">
                            {s}
                          </span>
                        ))}
                        {app.skills.length > 5 && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-white/[0.05] border border-white/[0.08] text-[#AAB3C5]">
                            +{app.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                    <div className="text-sm text-[#7A8499] mb-1">Current Status</div>
                    <Badge variant={STATUS_VARIANT[app.status as AppStatus]} size="md">
                      {app.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
