'use client';

import { useActionState, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { resetPasswordAction } from '@/features/auth/auth.actions';
import type { ActionState } from '@/features/auth/auth.actions';
import { ROUTES } from '@/constants/routes';

const initial: ActionState = { success: false, error: '' } as ActionState;

function ResetPasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get('token') ?? '';

  const [state, formAction, pending] = useActionState<ActionState, FormData>(resetPasswordAction, initial);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (state.success) {
      const t = setTimeout(() => router.push(ROUTES.login), 2500);
      return () => clearTimeout(t);
    }
  }, [state.success, router]);

  if (state.success) {
    return (
      <div className="animate-fade-up text-center">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Password reset!</h1>
        <p className="text-[#AAB3C5]">Redirecting you to sign in…</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="animate-fade-up text-center">
        <p className="text-[#EF4444] mb-6">Invalid or missing reset token.</p>
        <Link href={ROUTES.forgotPassword} className="btn-primary">Request new link</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Set new password</h1>
        <p className="text-[#AAB3C5] mt-2">Choose a strong new password for your account.</p>
      </div>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="token" value={token} />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]" htmlFor="password">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
            <input id="password" name="password"
              type={showPw ? 'text' : 'password'} required
              placeholder="Min. 8 chars, 1 uppercase, 1 number"
              className="input-field pl-10 pr-10" autoComplete="new-password" />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A8499] hover:text-white transition-colors"
              aria-label="Toggle password visibility">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-[#7A8499]">Min. 8 characters, one uppercase, one number</p>
        </div>

        {'error' in state && state.error && (
          <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending}
          className="btn-primary w-full h-11 text-base flex items-center justify-center gap-2">
          {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting…</> : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

// useSearchParams needs Suspense in Next.js 15
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-[#7A8499] text-sm">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
