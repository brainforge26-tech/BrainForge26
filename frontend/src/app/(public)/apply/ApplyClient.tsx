'use client';

import { useActionState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { submitApplicationAction } from '@/features/homepage/homepage.actions';
import { Card, CardContent } from '@/components/ui/Card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const initial = { success: false, error: '' };

export function ApplyClient() {
  const [state, formAction, pending] = useActionState<any, FormData>(submitApplicationAction, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setTimeout(() => router.push('/'), 2000);
    }
  }, [state, router]);

  return (
    <Card variant="accent" padding="lg">
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">First Name *</label>
              <input name="firstName" required className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Last Name *</label>
              <input name="lastName" required className="input-field" />
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Email *</label>
              <input type="email" name="email" required className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Phone Number</label>
              <input type="tel" name="phone" className="input-field" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#AAB3C5]">Skills (comma separated) *</label>
            <input name="skills" required placeholder="React, Node.js, PostgreSQL" className="input-field" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#AAB3C5]">Years of Experience *</label>
            <input type="number" name="experience" min="0" required className="input-field" />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">LinkedIn URL</label>
              <input type="url" name="linkedinUrl" className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Portfolio URL</label>
              <input type="url" name="portfolioUrl" className="input-field" />
            </div>
          </div>

          {'error' in state && state.error && (
            <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">{state.error}</p>
          )}

          <button type="submit" disabled={pending} className="btn-primary w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-4">
            {pending ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Submit Application'}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
