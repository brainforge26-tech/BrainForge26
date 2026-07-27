'use client';

import { useActionState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { updateHomepageContentAction } from '@/features/manager/manager.actions';
import type { ActionState } from '@/features/manager/manager.actions';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

export function HomepageClient({ initialContent }: { initialContent: any, initialTestimonials: any[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateHomepageContentAction, initial);
  
  const hero = initialContent?.hero || {};

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    }
  }, [state.success, state]);

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader title="Homepage CMS" description="Manage the content displayed on the public landing page." />

      <Card variant="default" padding="lg">
        <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="section" value="hero" />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Title</label>
              <input name="title" required defaultValue={hero.title} className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Subtitle</label>
              <textarea name="subtitle" rows={3} required defaultValue={hero.subtitle} className="input-field resize-none py-3" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Primary CTA Text</label>
                <input name="primaryCTA" defaultValue={hero.primaryCTA} className="input-field" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Secondary CTA Text</label>
                <input name="secondaryCTA" defaultValue={hero.secondaryCTA} className="input-field" />
              </div>
            </div>
            {'error' in state && state.error && (
              <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">{state.error}</p>
            )}
            <button type="submit" disabled={pending} className="btn-primary px-5 py-2.5 rounded-full text-sm flex items-center gap-2">
              {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Hero Section'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
