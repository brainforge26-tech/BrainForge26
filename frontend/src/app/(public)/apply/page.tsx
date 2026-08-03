import { Suspense } from 'react';
import { ApplyClient } from './ApplyClient';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Apply for Engineering Role | BrainForge26 Careers',
  description: 'Submit your job application and PDF resume to join the BrainForge26 engineering team.',
};

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 pt-36 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-extrabold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 fill-current text-orange-400" /> BrainForge26 Careers
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Submit Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              Engineering Application
            </span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Join our elite team of software architects, full-stack developers, and AI engineers building enterprise solutions.
          </p>
        </div>

        {/* Form Client Component */}
        <Suspense fallback={<div className="text-center text-slate-400 py-12">Loading Application Form...</div>}>
          <ApplyClient />
        </Suspense>
      </div>
    </div>
  );
}
