'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { loginAction } from '@/features/auth/auth.actions';
import type { ActionState } from '@/features/auth/auth.actions';
import { ROUTES } from '@/constants/routes';

const ROLE_REDIRECT: Record<string, string> = {
  ADMIN:     ROUTES.admin.root,
  MANAGER:   ROUTES.manager.root,
  DEVELOPER: ROUTES.developer.root,
  CLIENT:    ROUTES.client.root,
};

const initial: ActionState = { success: false, error: '' } as ActionState;

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(loginAction, initial);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (state.success && 'role' in state && state.role) {
      router.push(ROLE_REDIRECT[state.role] ?? '/');
    }
  }, [state, router]);

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome back</h1>
        <p className="text-[#AAB3C5] mt-2">Sign in to your BrainForceIT account</p>
      </div>

      <form action={formAction} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]" htmlFor="email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
            <input
              id="email" name="email" type="email" required
              placeholder="you@company.com"
              className="input-field pl-10"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#AAB3C5]" htmlFor="password">Password</label>
            <Link href={ROUTES.forgotPassword} className="text-xs text-[#4F7DFF] hover:text-[#00D4FF] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
            <input
              id="password" name="password"
              type={showPw ? 'text' : 'password'} required
              placeholder="••••••••"
              className="input-field pl-10 pr-10"
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A8499] hover:text-white transition-colors"
              aria-label="Toggle password visibility">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Error */}
        {!state.success && 'error' in state && state.error && (
          <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}

        {/* Submit */}
        <button type="submit" disabled={pending}
          className="btn-primary w-full h-11 text-base mt-2 flex items-center justify-center gap-2">
          {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-[#7A8499] mt-6">
        Don&apos;t have an account?{' '}
        <Link href={ROUTES.register} className="text-[#4F7DFF] hover:text-[#00D4FF] font-medium transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
