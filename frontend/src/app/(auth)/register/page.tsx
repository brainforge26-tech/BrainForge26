'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Mail, Lock, Building2, User, Phone } from 'lucide-react';
import { registerAction } from '@/features/auth/auth.actions';
import type { ActionState } from '@/features/auth/auth.actions';
import { ROUTES } from '@/constants/routes';

const initial: ActionState = { success: false, error: '' } as ActionState;

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(registerAction, initial);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (state.success) {
      router.push(`${ROUTES.login}?registered=1`);
    }
  }, [state.success, router]);

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Create account</h1>
        <p className="text-[#AAB3C5] mt-2">Join BrainForceIT as a client</p>
      </div>

      <form action={formAction} className="space-y-4">
        {/* Company Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]" htmlFor="companyName">Company Name</label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
            <input id="companyName" name="companyName" type="text" required
              placeholder="Acme Corp" className="input-field pl-10" />
          </div>
        </div>

        {/* Contact Person */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]" htmlFor="contactPerson">Your Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
            <input id="contactPerson" name="contactPerson" type="text" required
              placeholder="John Smith" className="input-field pl-10" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]" htmlFor="email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
            <input id="email" name="email" type="email" required
              placeholder="you@company.com" className="input-field pl-10" autoComplete="email" />
          </div>
        </div>

        {/* Phone (optional) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]" htmlFor="phone">
            Phone <span className="text-[#7A8499] text-xs">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8499]" />
            <input id="phone" name="phone" type="tel"
              placeholder="+1 234 567 890" className="input-field pl-10" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#AAB3C5]" htmlFor="password">Password</label>
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

        {/* Error */}
        {!state.success && 'error' in state && state.error && (
          <p className="text-sm text-[#EF4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending}
          className="btn-primary w-full h-11 text-base mt-1 flex items-center justify-center gap-2">
          {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : 'Create Account'}
        </button>

        <p className="text-xs text-[#7A8499] text-center">
          By signing up you agree to our{' '}
          <Link href="#" className="text-[#4F7DFF] hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="#" className="text-[#4F7DFF] hover:underline">Privacy Policy</Link>
        </p>
      </form>

      <p className="text-center text-sm text-[#7A8499] mt-6">
        Already have an account?{' '}
        <Link href={ROUTES.login} className="text-[#4F7DFF] hover:text-[#00D4FF] font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
