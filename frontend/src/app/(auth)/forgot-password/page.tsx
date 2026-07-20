'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPasswordAction } from '@/features/auth/auth.actions';
import type { ActionState } from '@/features/auth/auth.actions';
import { ROUTES } from '@/constants/routes';

const initial: ActionState = { success: false, error: '' } as ActionState;

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(forgotPasswordAction, initial);

  if (state.success) {
    return (
      <div className="animate-fade-up text-center">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
        <p className="text-[#AAB3C5] leading-relaxed mb-8">
          If an account with that email exists, we&apos;ve sent a reset link.
          It expires in 5 minutes.
        </p>
        <Link href={ROUTES.login} className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <Link href={ROUTES.login}
        className="inline-flex items-center gap-1.5 text-sm text-[#7A8499] hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Sign In
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Forgot password?</h1>
        <p className="text-[#AAB3C5] mt-2">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]" htmlFor="email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
            <input id="email" name="email" type="email" required
              placeholder="you@company.com" className="input-field pl-10" autoComplete="email" />
          </div>
        </div>

        {'error' in state && state.error && (
          <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending}
          className="btn-primary w-full h-11 text-base flex items-center justify-center gap-2">
          {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}
