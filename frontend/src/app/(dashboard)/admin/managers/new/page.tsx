'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Mail, Lock, User, Phone, Building2, FileText } from 'lucide-react';
import { createManagerAction } from '@/features/admin/admin.actions';
import type { ActionState } from '@/features/admin/admin.actions';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { toast } from 'sonner';

const initial: ActionState = { success: false, error: '' } as ActionState;

export default function NewManagerPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createManagerAction, initial);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push('/admin/managers');
    }
  }, [state.success, state, router]);

  return (
    <div className="animate-fade-up max-w-2xl">
      <PageHeader
        title="Add Manager"
        description="Create a new project manager account."
        action={
          <button onClick={() => router.back()}
            className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        }
      />

      <Card variant="default" padding="lg">
        <CardContent>
          <form action={formAction} className="space-y-5">
            {/* Name row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">First Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
                  <input name="firstName" required placeholder="Sarah" className="input-field pl-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Last Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
                  <input name="lastName" required placeholder="Johnson" className="input-field pl-10" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
                <input name="email" type="email" required placeholder="manager@brainforceit.com" className="input-field pl-10" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
                <input name="password" type="password" required placeholder="Min 8 chars, 1 uppercase, 1 number" className="input-field pl-10" />
              </div>
              <p className="text-xs text-[#7A8499]">Min 8 characters, one uppercase letter, one number</p>
            </div>

            {/* Phone + Department */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Phone <span className="text-[#7A8499] text-xs">(optional)</span></label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
                  <input name="phone" type="tel" placeholder="+1 234 567 890" className="input-field pl-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#AAB3C5]">Department <span className="text-[#7A8499] text-xs">(optional)</span></label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
                  <input name="department" placeholder="Engineering" className="input-field pl-10" />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#AAB3C5]">
                Bio <span className="text-[#7A8499] text-xs">(optional)</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-[#7A8499]" />
                <textarea name="bio" rows={3} placeholder="Brief description…"
                  className="input-field pl-10 py-3 resize-none" />
              </div>
            </div>

            {/* Error */}
            {!state.success && 'error' in state && state.error && (
              <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">
                {state.error}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={pending}
                className="btn-primary px-6 py-2.5 rounded-full text-sm flex items-center gap-2">
                {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : 'Create Manager'}
              </button>
              <button type="button" onClick={() => router.back()}
                className="btn-secondary px-6 py-2.5 rounded-full text-sm">
                Cancel
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
