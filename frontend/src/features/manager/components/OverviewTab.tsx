'use client';

import { useActionState, useEffect } from 'react';
import { updateProjectAction, type Project, type ActionState } from '../manager.actions';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

export function OverviewTab({ project }: { project: Project }) {
  const updateWithId = updateProjectAction.bind(null, project.id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateWithId, initial);

  useEffect(() => {
    if (state.success) toast.success(state.message);
  }, [state.success, state]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]">Status</label>
          <select name="status" defaultValue={project.status} className="input-field">
            <option value="PENDING">PENDING</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="ON_HOLD">ON_HOLD</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]">Priority</label>
          <select name="priority" defaultValue={project.priority} className="input-field">
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#AAB3C5]">Completion Percentage ({project.completionPercent}%)</label>
        <input 
          type="range" 
          name="completionPercent" 
          min="0" 
          max="100" 
          defaultValue={project.completionPercent} 
          className="w-full accent-[#4F7DFF]" 
        />
      </div>

      {/* Gallery Showcase */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            Project Showcase & Gallery Photos
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {project.gallery.map((img: { id: string; url: string; caption?: string | null }) => (
              <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group bg-black/40">
                <img src={img.url} alt={img.caption || project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#AAB3C5]">Manager Notes (Visible to Client)</label>
        <textarea 
          name="managerNotes" 
          rows={4} 
          defaultValue={project.managerNotes ?? ''} 
          className="input-field resize-none py-3" 
        />
      </div>

      {'error' in state && state.error && (
        <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary px-5 py-2.5 rounded-full text-sm flex items-center gap-2">
        {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
      </button>
    </form>
  );
}
