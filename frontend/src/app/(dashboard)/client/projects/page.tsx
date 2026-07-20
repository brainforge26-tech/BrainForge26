import { Clock, CheckCircle2, ArrowUpRight, FolderKanban } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge }      from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

type StageStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';

const STATUS_VARIANT = {
  ACTIVE: 'primary', COMPLETED: 'success', PENDING: 'warning', ON_HOLD: 'muted', CANCELLED: 'error',
} as const;

const STAGE_COLOR: Record<StageStatus, string> = {
  COMPLETED: '#22C55E', IN_PROGRESS: '#4F7DFF', PENDING: '#3a3f4d', SKIPPED: '#3a3f4d',
};

const SAMPLE = [
  {
    id: 'p1', name: 'E-Commerce Platform', projectType: 'Web App',
    status: 'ACTIVE', priority: 'HIGH', completionPercent: 72,
    description: 'Full-stack marketplace with Stripe payments.',
    estimatedDelivery: '2026-08-15', technologies: ['Next.js','Node.js','PostgreSQL','Stripe'],
    managerNotes: 'Frontend 80% done. Backend APIs in progress. On track for delivery.',
    manager: { managerProfile: { firstName: 'Sarah', lastName: 'Johnson' } },
    developers: [
      { developer: { developerProfile: { firstName: 'Alex', lastName: 'Carter', title: 'Frontend Lead' } } },
      { developer: { developerProfile: { firstName: 'James', lastName: 'Okafor', title: 'Backend Dev' } } },
    ],
    milestones: [
      { id: 'm1', name: 'Requirements',   status: 'COMPLETED',   dueDate: null },
      { id: 'm2', name: 'UI Design',      status: 'COMPLETED',   dueDate: null },
      { id: 'm3', name: 'Frontend Dev',   status: 'IN_PROGRESS', dueDate: '2026-07-30' },
      { id: 'm4', name: 'Backend Dev',    status: 'PENDING',     dueDate: '2026-08-10' },
      { id: 'm5', name: 'Testing',        status: 'PENDING',     dueDate: '2026-08-12' },
      { id: 'm6', name: 'Deployment',     status: 'PENDING',     dueDate: '2026-08-15' },
    ],
    timelineStages: [
      { id: 't1', name: 'Project Created',    status: 'COMPLETED'   as StageStatus, order: 0 },
      { id: 't2', name: 'Requirements',       status: 'COMPLETED'   as StageStatus, order: 1 },
      { id: 't3', name: 'UI Design',          status: 'COMPLETED'   as StageStatus, order: 2 },
      { id: 't4', name: 'Frontend Dev',       status: 'IN_PROGRESS' as StageStatus, order: 3 },
      { id: 't5', name: 'Backend Dev',        status: 'PENDING'     as StageStatus, order: 4 },
      { id: 't6', name: 'Testing',            status: 'PENDING'     as StageStatus, order: 5 },
      { id: 't7', name: 'Client Review',      status: 'PENDING'     as StageStatus, order: 6 },
      { id: 't8', name: 'Deployment',         status: 'PENDING'     as StageStatus, order: 7 },
      { id: 't9', name: 'Completed',          status: 'PENDING'     as StageStatus, order: 8 },
    ],
    progressUpdates: [
      { id: 'u1', title: 'Homepage & Product Pages Complete', description: 'All public-facing pages are built and responsive.', progressPercent: 72, createdAt: '2026-07-18', author: { email: 'manager@brainforceit.com' } },
    ],
  },
];

export default function ClientProjectsPage() {
  return (
    <div className="animate-fade-up space-y-8">
      <PageHeader title="My Projects" description="Track progress, milestones and updates for all your projects." />

      {SAMPLE.map(project => (
        <Card key={project.id} variant="default" padding="none" className="overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white">{project.name}</h2>
                <Badge variant={STATUS_VARIANT[project.status as keyof typeof STATUS_VARIANT]} size="sm" dot>
                  {project.status}
                </Badge>
                <Badge variant="muted" size="sm">{project.priority} Priority</Badge>
              </div>
              <p className="text-sm text-[#AAB3C5]">{project.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-[#7A8499]">
                <span>Manager: <span className="text-[#AAB3C5]">{project.manager.managerProfile.firstName} {project.manager.managerProfile.lastName}</span></span>
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
                  {project.developers.map(({ developer: dev }) => (
                    <div key={dev.developerProfile.firstName} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F7DFF]/30 to-[#7C5CFF]/20 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {dev.developerProfile.firstName[0]}{dev.developerProfile.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">{dev.developerProfile.firstName} {dev.developerProfile.lastName}</p>
                        <p className="text-[10px] text-[#7A8499]">{dev.developerProfile.title}</p>
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
                <div className="absolute left-3 top-2 bottom-2 w-px bg-white/[0.08]" />
                {project.timelineStages.map(stage => (
                  <div key={stage.id} className="flex items-center gap-3 pl-8 py-1.5 relative">
                    <div className="absolute left-1.5 w-3 h-3 rounded-full border-2 border-[#050816]"
                      style={{ backgroundColor: STAGE_COLOR[stage.status] }} />
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
                  {project.milestones.map(m => (
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
              {project.progressUpdates[0] && (
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xs text-[#7A8499] mb-1">Latest Update</p>
                  <p className="text-xs font-semibold text-white">{project.progressUpdates[0].title}</p>
                  <p className="text-[11px] text-[#7A8499] mt-0.5">{project.progressUpdates[0].description}</p>
                  <p className="text-[10px] text-[#7A8499] mt-1.5">{new Date(project.progressUpdates[0].createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tech stack footer */}
          <div className="px-6 py-4 border-t border-white/[0.04] flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#7A8499]">Stack:</span>
            {project.technologies.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] border border-white/[0.07] text-[#AAB3C5]">{t}</span>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
