'use client';

import { useActionState, useEffect } from 'react';
import { addTimelineStageAction, updateTimelineStageAction, type Project, type ActionState } from '../manager.actions';
import { Loader2, Plus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

export function TimelineTab({ project }: { project: Project }) {
  const addStageAction = addTimelineStageAction.bind(null, project.id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(addStageAction, initial);

  useEffect(() => {
    if ('message' in state && state.message) toast.success(state.message);
  }, [state.success, state]);

  const handleStatusChange = async (stageId: string, status: string) => {
    const res = await updateTimelineStageAction(project.id, stageId, status);
    if ('message' in res) toast.success(res.message);
    else if ('error' in res) toast.error(res.error);
  };

  const STAGE_COLOR: Record<string, string> = {
    COMPLETED: '#22C55E', IN_PROGRESS: '#4F7DFF', PENDING: '#3a3f4d', SKIPPED: '#3a3f4d',
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Project Timeline</h3>
        <div className="relative space-y-4 pt-2">
          <div className="absolute left-[11px] top-4 bottom-4 w-px bg-white/[0.08]" />
          {project.timelineStages?.map((stage: any) => (
            <div key={stage.id} className="flex items-start gap-6 relative pl-1">
              <div className="w-5 h-5 rounded-full border-4 border-[#050816] mt-1 shrink-0 z-10 transition-colors"
                style={{ backgroundColor: STAGE_COLOR[stage.status] }} />
              
              <div className="flex-1 bg-white/[0.02] border border-white/[0.05] p-3 rounded-lg flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">{stage.name}</p>
                  {stage.description && <p className="text-xs text-[#AAB3C5] mt-0.5">{stage.description}</p>}
                </div>
                <select 
                  value={stage.status} 
                  onChange={(e) => handleStatusChange(stage.id, e.target.value)}
                  className="bg-[#0A0D14] border border-white/[0.1] text-xs text-white rounded-md px-2 py-1 outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="SKIPPED">SKIPPED</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-white/[0.06]" />

      <form action={formAction} className="space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Add Timeline Stage</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#AAB3C5]">Stage Name</label>
            <input name="name" required className="input-field" placeholder="e.g. Final Review" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#AAB3C5]">Status</label>
            <select name="status" className="input-field">
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]">Description (Optional)</label>
          <input name="description" className="input-field" />
        </div>

        {'error' in state && state.error && (
          <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-secondary px-4 py-2 rounded-full text-sm flex items-center gap-2">
          {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</> : <><Plus className="w-4 h-4" /> Add Stage</>}
        </button>
      </form>
    </div>
  );
}
