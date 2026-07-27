import { Clock, CheckCircle2, ArrowUpRight, Code2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge }      from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { fetchMyProjects } from '@/features/developer/developer.actions';

const STATUS_VARIANT: Record<string, 'primary' | 'success' | 'warning' | 'muted' | 'error'> = {
  ACTIVE: 'primary', COMPLETED: 'success', PENDING: 'warning', ON_HOLD: 'muted', CANCELLED: 'error',
};

const STAGE_COLOR: Record<string, string> = {
  COMPLETED: '#22C55E', IN_PROGRESS: '#4F7DFF', PENDING: '#3a3f4d', SKIPPED: '#3a3f4d',
};

export default async function DeveloperProjectsPage() {
  const assignments = await fetchMyProjects();

  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader title="Assigned Projects" description="View details, milestones, and your role for each project." />

      {assignments.length === 0 ? (
        <div className="p-12 text-center text-[#7A8499] border border-white/[0.06] rounded-2xl bg-white/[0.02]">
          <p>You are not assigned to any projects right now.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {assignments.map(({ id, role, project }) => (
            <Card key={id} variant="default" padding="none" className="overflow-hidden">
              <div className="px-6 py-5 border-b border-white/[0.06] flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-white">{project.name}</h2>
                    <Badge variant={STATUS_VARIANT[project.status] ?? 'muted'} size="sm" dot>{project.status}</Badge>
                    <Badge variant="cyan" size="sm" className="gap-1"><Code2 className="w-3.5 h-3.5" />{role ?? 'Developer'}</Badge>
                  </div>
                  <p className="text-sm text-[#AAB3C5] max-w-2xl">{project.description}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-[#7A8499]">
                    <span>Client: <span className="text-[#AAB3C5]">{project.client?.companyName}</span></span>
                    <span>Manager: <span className="text-[#AAB3C5]">{project.manager?.managerProfile?.firstName} {project.manager?.managerProfile?.lastName}</span></span>
                    {project.estimatedDelivery && (
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Due: {new Date(project.estimatedDelivery).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <Link href={`/developer/projects/${project.id}`} className="flex items-center gap-1 text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors shrink-0">
                  Project Details <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 grid lg:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#7A8499]">Overall Completion</span>
                      <span className="font-bold text-white text-lg">{project.completionPercent}%</span>
                    </div>
                    <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#4F7DFF] to-[#7C5CFF] transition-all"
                        style={{ width: `${project.completionPercent}%` }} />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#7A8499] mb-3 uppercase tracking-wider">Milestones (First 5)</p>
                    <div className="space-y-1.5">
                      {project.milestones.length === 0 && <p className="text-xs text-[#7A8499]">No milestones.</p>}
                      {project.milestones.map((m: any) => (
                        <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${m.status === 'COMPLETED' ? 'text-[#22C55E]' : 'text-[#7A8499]'}`} />
                            <span className="text-xs text-[#AAB3C5]">{m.name}</span>
                          </div>
                          <Badge variant={m.status === 'COMPLETED' ? 'success' : m.status === 'IN_PROGRESS' ? 'primary' : 'muted'} size="sm">
                            {m.status === 'IN_PROGRESS' ? 'Active' : m.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#7A8499] mb-3 uppercase tracking-wider">Timeline</p>
                  <div className="relative space-y-1">
                    {project.timelineStages.length > 0 && <div className="absolute left-3 top-2 bottom-2 w-px bg-white/[0.08]" />}
                    {project.timelineStages.length === 0 && <p className="text-xs text-[#7A8499]">No timeline stages.</p>}
                    {project.timelineStages.map((stage: any) => (
                      <div key={stage.id} className="flex items-center gap-3 pl-8 py-1.5 relative">
                        <div className="absolute left-1.5 w-3 h-3 rounded-full border-2 border-[#050816]"
                          style={{ backgroundColor: STAGE_COLOR[stage.status] || '#3a3f4d' }} />
                        <span className={`text-xs ${stage.status === 'COMPLETED' ? 'text-[#22C55E]' : stage.status === 'IN_PROGRESS' ? 'text-white font-semibold' : 'text-[#7A8499]'}`}>
                          {stage.name}
                          {stage.status === 'IN_PROGRESS' && <span className="ml-2 text-[#4F7DFF]">← Current</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
