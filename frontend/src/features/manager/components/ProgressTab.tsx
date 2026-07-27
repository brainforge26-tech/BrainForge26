'use client';

import { useActionState, useEffect } from 'react';
import { postProgressUpdateAction, type Project, type ActionState } from '../manager.actions';
import { Loader2, Plus, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

export function ProgressTab({ project, updates }: { project: Project, updates: any[] }) {
  const postUpdateAction = postProgressUpdateAction.bind(null, project.id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(postUpdateAction, initial);

  useEffect(() => {
    if (state.success) toast.success(state.message);
  }, [state.success, state]);

  return (
    <div className="space-y-8">
      {/* Existing Updates */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Progress Updates</h3>
        {updates?.length === 0 && (
          <p className="text-sm text-[#7A8499]">No progress updates posted yet.</p>
        )}
        <div className="space-y-3">
          {updates?.map((u: any) => (
            <div key={u.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#4F7DFF]" />
                  <h4 className="text-sm font-semibold text-white">{u.title}</h4>
                </div>
                <span className="text-[10px] text-[#7A8499]">{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-[#AAB3C5] whitespace-pre-wrap">{u.description}</p>
              <div className="mt-3 inline-block px-2 py-1 bg-white/[0.05] rounded text-xs text-[#7A8499]">
                Progress bumped to <span className="text-white font-bold">{u.progressPercent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-white/[0.06]" />

      {/* Post Update Form */}
      <form action={formAction} className="space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Post New Update</h3>
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]">Update Title</label>
          <input name="title" required className="input-field" placeholder="e.g. Completed User Authentication" />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]">Description</label>
          <textarea name="description" required rows={4} className="input-field resize-none py-3" placeholder="Detail what was completed..." />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]">New Completion Percentage</label>
          <input 
            name="progressPercent" 
            type="number" 
            min="0" max="100" 
            required 
            defaultValue={project.completionPercent} 
            className="input-field" 
          />
          <p className="text-xs text-[#7A8499]">This will update the overall project progress.</p>
        </div>

        {'error' in state && state.error && (
          <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-primary px-4 py-2.5 rounded-full text-sm flex items-center gap-2">
          {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting…</> : <><Plus className="w-4 h-4" /> Post Update</>}
        </button>
      </form>
    </div>
  );
}
