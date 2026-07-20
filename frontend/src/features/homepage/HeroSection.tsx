'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  }),
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      {/* ── Animated background ────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[#050816]">
        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Radial hero glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-hero-gradient opacity-70 pointer-events-none" />

        {/* Floating blobs */}
        <div className="bg-blob w-[500px] h-[500px] top-[-100px] left-[-150px] bg-[#4F7DFF] opacity-[0.06]" />
        <div className="bg-blob w-[400px] h-[400px] top-[100px] right-[-100px] bg-[#7C5CFF] opacity-[0.07] animation-delay-2000" />
        <div className="bg-blob w-[350px] h-[350px] bottom-[50px] left-[30%] bg-[#00D4FF] opacity-[0.04] animation-delay-4000" />
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="section-wrapper relative z-10 text-center py-24">

        {/* Eyebrow badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(79,125,255,0.1)] border border-[rgba(79,125,255,0.2)] text-[#4F7DFF] text-sm font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Premium IT Agency — Enterprise Quality
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-tight text-balance"
        >
          We Build{' '}
          <span className="gradient-text">World-Class</span>
          <br />
          Software Products
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="mt-6 text-lg md:text-xl text-[#AAB3C5] max-w-2xl mx-auto leading-relaxed text-balance"
        >
          BrainForceIT delivers premium web applications, mobile apps, and
          enterprise solutions with elite developers, transparent project
          management, and guaranteed quality.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start Your Project
            </Button>
          </Link>
          <Button variant="secondary" size="lg" leftIcon={<Play className="w-4 h-4" />}>
            Watch Demo
          </Button>
        </motion.div>

        {/* Social proof line */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="mt-8 text-sm text-[#7A8499]"
        >
          Trusted by{' '}
          <span className="text-white font-semibold">200+ companies</span>
          {' '}worldwide · No long-term contracts
        </motion.p>

        {/* Hero card mockup */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="mt-16 mx-auto max-w-4xl"
        >
          <div className="glass-card p-1 rounded-[24px]">
            {/* Fake dashboard preview */}
            <div className="rounded-[20px] bg-[#0B1224] overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                <div className="flex-1 mx-4 px-4 py-1 bg-white/[0.05] rounded-full text-xs text-[#7A8499] text-left">
                  app.brainforceit.com/dashboard
                </div>
              </div>
              {/* Fake content grid */}
              <div className="p-6 grid grid-cols-3 gap-4">
                {[
                  { label: 'Active Projects', val: '24', color: '#4F7DFF' },
                  { label: 'Team Members',    val: '48', color: '#7C5CFF' },
                  { label: 'Delivered',       val: '200+', color: '#00D4FF' },
                ].map(({ label, val, color }) => (
                  <div
                    key={label}
                    className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                  >
                    <p className="text-2xl font-bold" style={{ color }}>{val}</p>
                    <p className="text-xs text-[#7A8499] mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6 grid grid-cols-2 gap-3">
                {[40, 65, 80, 55].map((w, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="h-2 rounded-full bg-white/[0.06] mb-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#4F7DFF] to-[#7C5CFF]"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                    <div className="h-2 w-3/4 rounded bg-white/[0.04]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
