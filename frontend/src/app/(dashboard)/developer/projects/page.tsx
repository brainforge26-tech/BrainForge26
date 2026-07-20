import { Clock, CheckCircle2, FolderKanban, ArrowUpRight } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Badge }      from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

type StageStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';

const STATUS_VARIANT = {
  ACTIVE:    'primary',
  COMPLETED: 'success',
  PENDING:   'warning',
  ON_HOLD:   'muted',
  CANCELLED: 'error',
} as const;

const STAGE_ICON: Record<StageStatus, string> = {
  COMPLETED:   '✓',
  IN_PROGRESS: '⏳',
  PENDING:     '○',
  SKIPPED:     '—',
};

const STAGE_COLOR: Record<StageStatus, string> = {
  COMPLETED:   '#22C55E',
  IN_PROGRESS: '#4F7DFF',
  PENDING:     '#7A8499',
  SKIPPED:     '#7A8499',
};

const SAMPLE_PROJECTS = [
  {
    id: '1', role: 'Frontend Lead',
    project: {
      id: 'p1', name: 'E-Commerce Platform', status: 'ACTIVE', completionPercent: 72,
      description: 'Full-stack marketplace with Stripe payments and admin dashboard.',
      estimatedDelivery: '2026-08-15',
      client:  { companyName: 'TechCorp' },
      manager: { email: 'm@brainforceit.com', managerProfile: { firstName: 'Sarah', lastName: 'Johnson' } },
      milestones: [
        { id: 'm1', name: 'Requirements', status: 'COMPLETED', dueDate: null },
        { id: 'm2', name: 'UI Design',    status: 'COMPLETED', dueDate: null },
        { id: 'm3', name: 'Frontend Dev', status: 'IN_PROGRESS', dueDate: '2026-07-30' },
        { id: 'm4', name: 'Backend Dev',  status: 'PENDING',    dueDate: '2026-08-10' },
      ],
      timelineStages: [
        { id: 't1', name: 'Project Created',    status: 'COMPLETED' as StageStatus, order: 0 },
        { id: 't2', name: 'Requirements',       status: 'COMPLETED' as StageStatus, order: 1 },
        { id: 't3', name: 'UI Design',          status: 'COMPLETED' as StageStatus, order: 2 },
        { id: 't4', name: 'Frontend Dev',       status: 'IN_PROGRESS' as StageStatus, order: 3 },
        { id: 't5', name: 'Backend Dev',        status: 'PENDING' as StageStatus,    order: 4 },
        { id: 't6', name: 'Testing',            status: 'PENDING' as StageStatus,    order: 5 },
        { id: 't7', name: 'Deployment',         status: 'PENDING' as StageStatus,    order: 6 },
      ],
    },
  },
  {
    id: '2', role: 'Full-Stack',
    project: {
      id: 'p2', name: 'Mobile App v2', status: 'ACTIVE', completionPercent: 45,
      description: 'Cross-platform mobile application with live GPS tracking.',
      estimatedDelivery: '2026-09-01',
      client:  { companyName: 'StartupXYZ' },
      manager: { email: 'm2@brainforceit.com', managerProfile: { firstName: 'Mike', lastName: 'Chen' } },
      milestones: [
        { id: 'm5', name: 'Design Complete', status: 'COMPLETED',   dueDate: null },
        { id: 'm6', name: 'Core Features',   status: 'IN_PROGRESS', dueDate: '2026-08-15' },
      ],
      timelineStages: [
        { id: 't8',  name: 'Project Created', status: 'COMPLETED' as StageStatus,   order: 0 },
        { id: 't9',  name: 'Design Phase',    status: 'COMPLETED' as StageStatus,   order: 1 },
        { id: 't10', name: 'Development',     status: 'IN_PROGRESS' as StageStatus, order: 2 },
        { id: 't11', name: 'Testing',         status: 'PENDING' as StageStatus,     order: 3 },
        { id: 't12', name: 'Release',         status: 'PENDING' as StageStatus,     order: 4 },
      ],
    },
  },
];

export default function DeveloperProjectsPage() {
  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="My Projects"
        description="All projects you are assigned to."
      />

      {SAMPLE_PROJECTS.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-[#7A8499]">
          <FolderKanban className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm">You have no assigned projects yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {SAMPLE_PROJECTS.map(({ id, role, project }) => (
            <Card key={id} variant="default" padding="none" className="overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white">{project.name}</h3>
                    <Badge variant={STATUS_VARIANT[project.status as keyof typeof STATUS_VARIANT]} size="sm" dot>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#7A8499]">
                    Client: <span className="text-[#AAB3C5]">{project.client?.companyName}</span>
                    {' · '}
                    Manager: <span className="text-[#AAB3C5]">{project.manager?.managerProfile?.firstName} {project.manager?.managerProfile?.lastName}</span>
                    {' · '}
                    Your role: <span className="text-[#4F7DFF] font-medium">{role}</span>
                  </p>
                </div>
                <a href={`/developer/projects/${project.id}`}
                  className="flex items-center gap-1 text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors shrink-0">
                  Details <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-6 grid lg:grid-cols-2 gap-6">
                {/* Progress + milestones */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#7A8499] mb-2">
                      <span>Overall Progress</span>
                      <span className="font-bold text-white text-base">{project.completionPercent}%</span>
                    </div>
                    <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#4F7DFF] to-[#7C5CFF] transition-all"
                        style={{ width: `${project.completionPercent}%` }} />
                    </div>
                  </div>

                  {project.estimatedDelivery && (
                    <p className="flex items-center gap-1.5 text-xs text-[#7A8499]">
                      <Clock className="w-3.5 h-3.5" />
                      Due: <span className="text-white">{new Date(project.estimatedDelivery).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                  )}

                  {/* Milestones */}
                  <div>
                    <p className="text-xs text-[#7A8499] mb-2 uppercase tracking-wider">Milestones</p>
                    <div className="space-y-2">
                      {project.milestones.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`w-3.5 h-3.5 ${m.status === 'COMPLETED' ? 'text-[#22C55E]' : 'text-[#7A8499]'}`} />
                            <span className={`text-xs ${m.status === 'COMPLETED' ? 'text-[#AAB3C5]' : 'text-white'}`}>{m.name}</span>
                          </div>
                          <Badge
                            variant={m.status === 'COMPLETED' ? 'success' : m.status === 'IN_PROGRESS' ? 'primary' : 'muted'}
                            size="sm">{m.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-xs text-[#7A8499] mb-3 uppercase tracking-wider">Timeline</p>
                  <div className="relative">
                    <div className="absolute left-3.5 top-0 bottom-0 w-px bg-white/[0.08]" />
                    <div className="space-y-2">
                      {project.timelineStages.map(stage => (
                        <div key={stage.id} className="flex items-center gap-3 pl-9 relative">
                          <div className="absolute left-2 w-3 h-3 rounded-full border-2 border-[#0B1224] flex items-center justify-center text-[9px] font-bold"
                            style={{ backgroundColor: STAGE_COLOR[stage.status], color: '#fff' }}>
                            {STAGE_ICON[stage.status]}
                          </div>
                          <span className={`text-xs ${stage.status === 'COMPLETED' ? 'text-[#22C55E]' : stage.status === 'IN_PROGRESS' ? 'text-white font-medium' : 'text-[#7A8499]'}`}>
                            {stage.name}
                          </span>
                        </div>
                      ))}
                    </div>
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
