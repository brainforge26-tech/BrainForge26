'use client';

import { useActionState, useEffect } from 'react';
import { createMilestoneAction, type Project, type ActionState } from '../manager.actions';
import { Loader2, Plus, CheckCircle2, CircleDashed } from 'lucide-react';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

export function MilestonesTab({ project }: { project: Project }) {
  const createAction = createMilestoneAction.bind(null, project.id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createAction, initial);

  useEffect(() => {
    if (state.success) toast.success(state.message);
  }, [state.success, state]);

  return (
    <div className="space-y-8">
      {/* Existing Milestones */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Project Milestones</h3>
        {project.milestones?.length === 0 && (
          <p className="text-sm text-[#7A8499]">No milestones created yet.</p>
        )}
        <div className="space-y-2">
          {project.milestones?.map((m: any) => (
            <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-3">
                {m.status === 'COMPLETED' ? (
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                ) : (
                  <CircleDashed className="w-5 h-5 text-[#7A8499]" />
                )}
                <div>
                  <p className="text-sm font-medium text-white">{m.name}</p>
                  <p className="text-xs text-[#AAB3C5] mt-0.5">{m.description || 'No description'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  m.status === 'COMPLETED' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                  m.status === 'IN_PROGRESS' ? 'bg-[#4F7DFF]/10 text-[#4F7DFF]' :
                  'bg-white/5 text-[#AAB3C5]'
                }`}>
                  {m.status}
                </span>
                {m.dueDate && (
                  <p className="text-xs text-[#7A8499] mt-1">
                    Due: {new Date(m.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-white/[0.06]" />

      {/* Create Milestone */}
      <form action={formAction} className="space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Add Milestone</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#AAB3C5]">Name</label>
            <input name="name" required className="input-field" placeholder="e.g. Frontend Completed" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#AAB3C5]">Due Date</label>
            <input name="dueDate" type="date" className="input-field" />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]">Description</label>
          <textarea name="description" rows={2} className="input-field resize-none py-2" />
        </div>

        {'error' in state && state.error && (
          <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-secondary px-4 py-2 rounded-full text-sm flex items-center gap-2">
          {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</> : <><Plus className="w-4 h-4" /> Add Milestone</>}
        </button>
      </form>
    </div>
  );
}
