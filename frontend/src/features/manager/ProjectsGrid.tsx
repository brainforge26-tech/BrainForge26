'use client';

import { useState, useTransition } from 'react';
import { Search, Clock, MoreVertical, CheckCircle2, Play, PauseCircle, XCircle } from 'lucide-react';
import { Badge }   from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { updateProjectStatusAction } from './manager.actions';
import type { Project, ProjectStatus } from './manager.actions';
import { toast } from 'sonner';

const STATUS_VARIANT: Record<ProjectStatus, 'primary'|'success'|'warning'|'muted'|'error'> = {
  ACTIVE: 'primary', COMPLETED: 'success', PENDING: 'warning', ON_HOLD: 'muted', CANCELLED: 'error',
};

const PRIORITY_COLOR: Record<string, string> = {
  LOW: '#22C55E', MEDIUM: '#F59E0B', HIGH: '#EF4444', URGENT: '#7C5CFF',
};

interface Props {
  initialData: { projects: Project[]; pagination: { total: number; page: number; limit: number; totalPages: number } };
}

export function ProjectsGrid({ initialData }: Props) {
  const [search, setSearch]   = useState('');
  const [projects]            = useState<Project[]>(initialData.projects);
  const [menu, setMenu]       = useState<string | null>(null);
  const [isPending, startT]   = useTransition();

  const filtered = projects.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  function changeStatus(id: string, status: ProjectStatus) {
    setMenu(null);
    startT(async () => {
      const r = await updateProjectStatusAction(id, status);
      if (r.success) toast.success(r.message); else toast.error(r.error);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search projects…" className="input-field pl-10 h-10 text-sm" />
        </div>
        <span className="text-sm text-[#7A8499]">{initialData.pagination.total} total</span>
        {isPending && <Spinner size="sm" />}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-[#7A8499]">
          <p className="text-sm">{search ? 'No projects match your search.' : 'No projects yet. Create one above.'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(p => (
            <div key={p.id} className="glass-card p-5 flex flex-col gap-4 group">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-[#7A8499] mb-0.5">{p.projectType ?? 'Project'}</p>
                  <h3 className="text-base font-semibold text-white truncate">{p.name}</h3>
                  <p className="text-xs text-[#7A8499] mt-0.5">
                    {p.client?.companyName ?? 'No client'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant={STATUS_VARIANT[p.status]} size="sm" dot>{p.status}</Badge>
                  <div className="relative">
                    <button onClick={() => setMenu(menu === p.id ? null : p.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-[#7A8499] hover:text-white hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menu === p.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenu(null)} />
                        <div className="absolute right-0 top-full mt-1 w-44 z-20 bg-[#0B1224] border border-white/[0.10] rounded-xl shadow-xl overflow-hidden">
                          <a href={`/manager/projects/${p.id}`}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#AAB3C5] hover:text-white hover:bg-white/[0.05]">
                            View Details
                          </a>
                          {p.status !== 'ACTIVE'     && <button onClick={() => changeStatus(p.id,'ACTIVE')}     className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#4F7DFF] hover:bg-[rgba(79,125,255,0.06)]"><Play className="w-4 h-4" /> Set Active</button>}
                          {p.status !== 'ON_HOLD'    && <button onClick={() => changeStatus(p.id,'ON_HOLD')}    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#F59E0B] hover:bg-[rgba(245,158,11,0.06)]"><PauseCircle className="w-4 h-4" /> Put On Hold</button>}
                          {p.status !== 'COMPLETED'  && <button onClick={() => changeStatus(p.id,'COMPLETED')}  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#22C55E] hover:bg-[rgba(34,197,94,0.06)]"><CheckCircle2 className="w-4 h-4" /> Mark Complete</button>}
                          {p.status !== 'CANCELLED'  && <button onClick={() => changeStatus(p.id,'CANCELLED')}  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[rgba(239,68,68,0.06)]"><XCircle className="w-4 h-4" /> Cancel</button>}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs text-[#7A8499] mb-1.5">
                  <span>Progress</span>
                  <span className="font-semibold text-white">{p.completionPercent}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#4F7DFF] to-[#7C5CFF] transition-all"
                    style={{ width: `${p.completionPercent}%` }} />
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-[#7A8499]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_COLOR[p.priority] }} />
                  {p.priority}
                </span>
                {p.estimatedDelivery && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(p.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
                <span>{p.developers.length} dev{p.developers.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Tech tags */}
              {p.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 4).map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] border border-white/[0.07] text-[#AAB3C5]">{t}</span>
                  ))}
                  {p.technologies.length > 4 && <span className="text-[10px] text-[#7A8499]">+{p.technologies.length - 4}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
