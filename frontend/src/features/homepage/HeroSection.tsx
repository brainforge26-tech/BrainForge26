'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Users, Star } from 'lucide-react';
import { Hero3DGlobe } from '@/components/ui/Hero3DGlobe';

export function HeroSection({ settings }: { settings?: any }) {
  const fullHeading = settings?.heroHeading || settings?.hero?.heading || 'Smarter Digital. Stronger Brands.';
  const headingParts = fullHeading.split('. ');
  const headingLine1 = headingParts[0] ? (headingParts.length > 1 ? `${headingParts[0]}.` : headingParts[0]) : 'Smarter Digital.';
  const headingLine2 = headingParts[1] || '';

  const badgeText = settings?.heroBadge || settings?.hero?.badgeText || 'AI-Powered Digital Agency';
  const subheading = settings?.heroSubheading || settings?.hero?.subheading || "We're BrainForge26 — the AI-fueled enterprise software company that blends creativity, code, and strategy to build solutions impossible to ignore.";
  const primaryCtaText = settings?.primaryCtaText || settings?.hero?.primaryCtaText || 'Start Your Project';

  return (
    <div className="relative min-h-screen bg-[#050608] text-white overflow-hidden pt-36 pb-20 flex flex-col justify-center">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-orange-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[350px] bg-cyan-600/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Subtle bottom orange accent glow line */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* ── Left Column: Dynamic Headline & Action Buttons (7 Cols) ───────── */}
          <div className="lg:col-span-7 space-y-8">

            {/* Top Pill Badge Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 p-1.5 pr-4 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-md text-xs font-bold text-slate-200"
            >
              <span className="px-2.5 py-1 rounded-full bg-white text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-500 fill-current" />
                NEXT-GEN
              </span>
              <span className="text-slate-300 font-semibold">{badgeText}</span>
            </motion.div>

            {/* Dynamic Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.02]">
                {headingLine1}
              </h1>
              {headingLine2 && (
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-100 leading-[1.02]">
                  {headingLine2}
                </h1>
              )}
            </motion.div>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link href="/contact">
                <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-black text-sm shadow-[0_0_35px_rgba(249,115,22,0.45)] transition-all hover:scale-105 flex items-center gap-3">
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link href="/services">
                <button className="px-8 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.15] text-white font-bold text-sm backdrop-blur-md transition-all flex items-center gap-3">
                  <span>See Our Process</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          </div>

          {/* ── Right Column: 3D Globe & Device Mockup (5 Cols) ──────────────── */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end justify-center">
            
            {/* Interactive Three.js 3D Glowing Globe Effect */}
            <Hero3DGlobe />

            {/* Laptop Mockup Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-lg group z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-cyan-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />

              <div className="relative rounded-3xl overflow-hidden border border-white/[0.15] bg-[#0A0C14]/80 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl p-2 transform group-hover:rotate-1 transition-transform duration-500">
                <img
                  src="/images/hero_laptop.png"
                  alt="Software Platform"
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
            </motion.div>

            {/* Glass Feature Callout Card (Floating on bottom right) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 lg:-mt-12 lg:mr-4 relative z-20 w-full max-w-md p-6 rounded-3xl bg-[#0C0E18]/85 border border-white/[0.12] backdrop-blur-2xl shadow-2xl space-y-4"
            >
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {subheading}
              </p>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                {/* Avatar Stack */}
                <div className="flex items-center -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
                    alt="Client Avatar"
                    className="w-8 h-8 rounded-full border-2 border-[#0C0E18] object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop"
                    alt="Client Avatar"
                    className="w-8 h-8 rounded-full border-2 border-[#0C0E18] object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop"
                    alt="Client Avatar"
                    className="w-8 h-8 rounded-full border-2 border-[#0C0E18] object-cover"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-xs font-bold text-white tracking-wide">
                    2000+ Happy Clients
                  </span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}
