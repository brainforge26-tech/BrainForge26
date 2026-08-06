'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';
import { loginAction } from '@/features/auth/auth.actions';
import type { ActionState } from '@/features/auth/auth.actions';

const initial: ActionState = { success: false, error: '' } as ActionState;

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(loginAction, initial);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (state.success) {
      router.push('/admin');
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-[#060910] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0B1224] border border-white/[0.1] shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Portal</h1>
          <p className="text-xs text-cyan-400 font-semibold tracking-wider uppercase mt-1">BrainForge26 Corporate CMS</p>
        </div>

        <form action={formAction} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="email">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@brainforceit.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {!state.success && 'error' in state && state.error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {state.error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating…</> : 'Access Admin Dashboard'}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          Authorized personnel only. Public visitor access is restricted.
        </p>
      </div>
    </div>
  );
}
