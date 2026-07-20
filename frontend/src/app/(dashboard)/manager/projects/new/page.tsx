'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createProjectAction } from '@/features/manager/manager.actions';
import type { ActionState } from '@/features/manager/manager.actions';
import { PageHeader }  from '@/components/dashboard/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

export default function NewProjectPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createProjectAction, initial);

  useEffect(() => {
    if (state.success) { toast.success(state.message); router.push('/manager/projects'); }
  }, [state.success, state, router]);

  return (
    <div className="animate-fade-up max-w-2xl">
      <PageHeader title="New Project" description="Create a new client project."
        action={<button onClick={() => router.back()} className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full"><ArrowLeft className="w-4 h-4" /> Back</button>} />

      <Card variant="default" padding="lg">
        <CardContent>
          <form action={formAction} className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Project Name *</label>
              <input name="name" required placeholder="E-Commerce Platform" className="input-field" />
            </div>
            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Description</label>
              <textarea name="description" rows={3} placeholder="Brief overview of the project…" className="input-field resize-none py-3" />
            </div>
            {/* Type + Priority */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Project Type</label>
                <select name="projectType" className="input-field">
                  <option value="">Select type…</option>
                  {['Web Application','Mobile App','E-Commerce','API / Backend','Landing Page','SaaS','Enterprise System'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Priority</label>
                <select name="priority" className="input-field">
                  {['LOW','MEDIUM','HIGH','URGENT'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            {/* Client ID */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Client ID *</label>
              <input name="clientId" required placeholder="Client profile UUID" className="input-field" />
              <p className="text-xs text-[#7A8499]">Enter the client profile ID (visible in Clients page)</p>
            </div>
            {/* Technologies */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Technologies <span className="text-[#7A8499] text-xs">(comma-separated)</span></label>
              <input name="technologies" placeholder="Next.js, Node.js, PostgreSQL" className="input-field" />
            </div>
            {/* Dates + Budget */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Estimated Delivery</label>
                <input name="estimatedDelivery" type="date" className="input-field" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Budget (USD)</label>
                <input name="budget" type="number" min="0" step="100" placeholder="5000" className="input-field" />
              </div>
            </div>
            {/* Manager notes */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Manager Notes <span className="text-[#7A8499] text-xs">(visible to client)</span></label>
              <textarea name="managerNotes" rows={2} placeholder="Internal notes for the client…" className="input-field resize-none py-3" />
            </div>

            {'error' in state && state.error && (
              <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">{state.error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={pending} className="btn-primary px-6 py-2.5 rounded-full text-sm flex items-center gap-2">
                {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : 'Create Project'}
              </button>
              <button type="button" onClick={() => router.back()} className="btn-secondary px-6 py-2.5 rounded-full text-sm">Cancel</button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
