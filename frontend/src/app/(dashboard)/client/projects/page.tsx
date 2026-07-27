import { Clock, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge }      from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { fetchMyProjects } from '@/features/client/client.actions';

type StageStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';

const STATUS_VARIANT: Record<string, 'primary' | 'success' | 'warning' | 'muted' | 'error'> = {
  ACTIVE: 'primary', COMPLETED: 'success', PENDING: 'warning', ON_HOLD: 'muted', CANCELLED: 'error',
};

const STAGE_COLOR: Record<StageStatus, string> = {
  COMPLETED: '#22C55E', IN_PROGRESS: '#4F7DFF', PENDING: '#3a3f4d', SKIPPED: '#3a3f4d',
};

export default async function ClientProjectsPage() {
  const projects = await fetchMyProjects();

  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader title="My Projects" description="Track progress, milestones and updates for all your projects." />

      {projects.length === 0 && (
        <div className="p-12 text-center text-[#7A8499] border border-white/[0.06] rounded-2xl bg-white/[0.02]">
          <p>No projects assigned to you yet.</p>
        </div>
      )}

      {projects.map(project => (
        <Card key={project.id} variant="default" padding="none" className="overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white">{project.name}</h2>
                <Badge variant={STATUS_VARIANT[project.status] ?? 'muted'} size="sm" dot>
                  {project.status}
                </Badge>
                <Badge variant="muted" size="sm">{project.priority} Priority</Badge>
              </div>
              <p className="text-sm text-[#AAB3C5]">{project.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-[#7A8499]">
                <span>Manager: <span className="text-[#AAB3C5]">{project.manager?.managerProfile?.firstName} {project.manager?.managerProfile?.lastName}</span></span>
                {project.estimatedDelivery && (
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Due: {new Date(project.estimatedDelivery).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
                )}
              </div>
            </div>
            <Link href={`/client/projects/${project.id}`} className="flex items-center gap-1 text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors shrink-0">
              Full Details <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 grid lg:grid-cols-3 gap-6">
            {/* Progress + team */}
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

              {/* Team */}
              <div>
                <p className="text-xs text-[#7A8499] mb-2 uppercase tracking-wider">Assigned Team</p>
                <div className="space-y-2">
                  {project.developers?.length === 0 && <p className="text-xs text-[#7A8499]">No developers assigned</p>}
                  {project.developers?.map(({ developer: dev }: any) => (
                    <div key={dev.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F7DFF]/30 to-[#7C5CFF]/20 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {dev.developerProfile?.firstName?.[0]}{dev.developerProfile?.lastName?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">{dev.developerProfile?.firstName} {dev.developerProfile?.lastName}</p>
                        <p className="text-[10px] text-[#7A8499]">{dev.developerProfile?.title || 'Developer'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manager notes */}
              {project.managerNotes && (
                <div className="p-3 rounded-xl bg-[rgba(79,125,255,0.06)] border border-[rgba(79,125,255,0.15)]">
                  <p className="text-xs text-[#4F7DFF] font-semibold mb-1">Manager Notes</p>
                  <p className="text-xs text-[#AAB3C5] leading-relaxed">{project.managerNotes}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div>
              <p className="text-xs text-[#7A8499] mb-3 uppercase tracking-wider">Timeline</p>
              <div className="relative space-y-1">
                {project.timelineStages?.length > 0 && <div className="absolute left-3 top-2 bottom-2 w-px bg-white/[0.08]" />}
                {project.timelineStages?.length === 0 && <p className="text-xs text-[#7A8499]">No timeline stages.</p>}
                {project.timelineStages?.map((stage: any) => (
                  <div key={stage.id} className="flex items-center gap-3 pl-8 py-1.5 relative">
                    <div className="absolute left-1.5 w-3 h-3 rounded-full border-2 border-[#050816]"
                      style={{ backgroundColor: STAGE_COLOR[stage.status as StageStatus] }} />
                    <span className={`text-xs ${stage.status === 'COMPLETED' ? 'text-[#22C55E]' : stage.status === 'IN_PROGRESS' ? 'text-white font-semibold' : 'text-[#7A8499]'}`}>
                      {stage.name}
                      {stage.status === 'IN_PROGRESS' && <span className="ml-2 text-[#4F7DFF]">← In Progress</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones + updates */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#7A8499] mb-2 uppercase tracking-wider">Milestones</p>
                <div className="space-y-1.5">
                  {project.milestones?.length === 0 && <p className="text-xs text-[#7A8499]">No milestones.</p>}
                  {project.milestones?.map((m: any) => (
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

              {/* Latest update */}
              {project._count?.progressUpdates > 0 && (
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xs text-[#7A8499] mb-1">Updates available</p>
                  <Link href={`/client/projects/${project.id}`} className="text-xs font-semibold text-[#4F7DFF]">View {project._count.progressUpdates} updates</Link>
                </div>
              )}
            </div>
          </div>

          {/* Tech stack footer */}
          {project.technologies?.length > 0 && (
            <div className="px-6 py-4 border-t border-white/[0.04] flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#7A8499]">Stack:</span>
              {project.technologies.map((t: string) => (
                <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] border border-white/[0.07] text-[#AAB3C5]">{t}</span>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
