import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050816] flex">
      {/* ── Left panel — branding ───────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        {/* Gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#4F7DFF] opacity-10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#7C5CFF] opacity-10 rounded-full blur-[80px]" />

        <div className="relative z-10 text-center max-w-md">
          <Link href="/" className="inline-flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F7DFF] to-[#7C5CFF] flex items-center justify-center shadow-[0_0_24px_rgba(79,125,255,0.4)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Brain<span className="gradient-text-blue">Force</span>IT
            </span>
          </Link>

          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Premium Software<br />
            <span className="gradient-text">Delivered Fast</span>
          </h2>
          <p className="text-[#AAB3C5] leading-relaxed">
            Track your projects, communicate with your team, and manage
            everything from one elegant dashboard.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: '200+', label: 'Projects' },
              { value: '98%',  label: 'Satisfaction' },
              { value: '50+',  label: 'Developers' },
            ].map(({ value, label }) => (
              <div key={label} className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                <p className="text-xl font-bold gradient-text-blue">{value}</p>
                <p className="text-xs text-[#7A8499] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F7DFF] to-[#7C5CFF] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">BrainForceIT</span>
        </Link>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
