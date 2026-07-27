'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Zap, ShieldCheck, Cpu, Activity, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  }),
};

export function HeroSection({ content }: { content?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3D Perspective Scroll animation — dramatic laydown surface tilt
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.55], [24, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.55], [0.95, 1.02]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.85]);

  const { title, subtitle, primaryCTA, secondaryCTA } = content || {
    title: 'Scale Your Business \nwith AI Solutions',
    subtitle: 'BrainForge delivers premium web applications, AI models, and enterprise solutions with elite developers, transparent project management, and guaranteed quality.',
    primaryCTA: 'Start Your Project',
    secondaryCTA: 'Watch Demo'
  };

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-24">

      {/* ── Animated Background ────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[#09090B]">
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Hero Glow Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1300px] h-[800px] bg-hero-gradient opacity-90 pointer-events-none" />

        {/* Ambient Blobs */}
        <div className="bg-blob w-[600px] h-[600px] top-[-100px] left-[-150px] bg-[#A61C43] opacity-[0.025]" />
        <div className="bg-blob w-[500px] h-[500px] top-[150px] right-[-120px] bg-[#851636] opacity-[0.03] animation-delay-2000" />
        <div className="bg-blob w-[400px] h-[400px] bottom-[20px] left-[25%] bg-[#A61C43] opacity-[0.02] animation-delay-4000" />
      </div>

      {/* ── Main Content Area ────────────────────────────────────────────────── */}
      <motion.div style={{ opacity }} className="section-wrapper relative z-10 text-center pt-16">

        {/* ── Hero Text Header (Z-30 Floating Above Card with sharp contrast) ── */}
        <div className="relative z-30 max-w-4xl mx-auto">
          
          {/* Dark Backdrop Glow behind Text for maximum legibility */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[380px] bg-[#09090B]/80 blur-[60px] -z-10 pointer-events-none rounded-full" />

          {/* Eyebrow Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="flex justify-center mb-6"
          >
            <div className="relative inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-[#111114]/90 backdrop-blur-xl border border-[rgba(115,14,39,0.3)] shadow-[0_0_24px_rgba(115,14,39,0.2)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D26A] animate-pulse" />
              <Sparkles className="w-4 h-4 text-[#8B1532]" />
              <span className="text-[#8B1532] text-xs font-bold uppercase tracking-wider">
                NEXT-GEN AI AGENCY PLATFORM
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-[clamp(2.5rem,7.5vw,5.5rem)] font-extrabold leading-[1.04] tracking-tight text-balance text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
          >
            Scale Your Business<br />
            with <span className="gradient-text">AI-Powered Tech</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 text-lg md:text-xl text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed text-balance font-medium drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-40"
          >
            <Link href="/register">
              <Button
                variant="primary"
                size="lg"
                className="h-14 sm:h-15 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-full shadow-[0_14px_45px_rgba(166,28,67,0.5)] hover:scale-105 transition-all"
                rightIcon={<ArrowRight className="w-5 h-5 ml-1" />}
              >
                {primaryCTA}
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              className="h-14 sm:h-15 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-full backdrop-blur-2xl bg-[#111114]/90 border border-white/20 hover:bg-white/15 hover:border-white/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:scale-105 transition-all"
              leftIcon={<Play className="w-4 h-4 fill-white text-white mr-1" />}
            >
              {secondaryCTA}
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-[#94A3B8]"
          >
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111114]/80 border border-white/10 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-[#00D26A]" /> Enterprise SLAs
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111114]/80 border border-white/10 backdrop-blur-md">
              <Cpu className="w-4 h-4 text-[#C02C54]" /> Custom AI Models
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111114]/80 border border-white/10 backdrop-blur-md">
              <Activity className="w-4 h-4 text-[#22C55E]" /> 200+ Global Clients
            </span>
          </motion.div>
        </div>

        {/* ── Expanded 3D Dashboard Mockup Section (Text Overlaps Top) ──────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="-mt-24 sm:-mt-32 md:-mt-40 mx-auto max-w-7xl relative [perspective:850px] z-10"
        >

          {/* Floating Glass Badge 1: Top-Left */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 -left-4 sm:-left-8 z-30 hidden lg:flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-[#111114]/95 backdrop-blur-2xl border border-[rgba(166,28,67,0.3)] shadow-[0_16px_40px_rgba(0,0,0,0.8)] text-left"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-[#00D26A] animate-pulse" />
            <div>
              <p className="text-xs font-bold text-white">99.9% Uptime Guarantee</p>
              <p className="text-[11px] text-[#7A8499]">Real-Time AI Infrastructure</p>
            </div>
          </motion.div>

          {/* Floating Glass Badge 2: Bottom-Right */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-6 -right-4 sm:-right-8 z-30 hidden lg:flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-[#111114]/95 backdrop-blur-2xl border border-[rgba(115,14,39,0.3)] shadow-[0_16px_40px_rgba(0,0,0,0.8)] text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[rgba(115,14,39,0.15)] flex items-center justify-center text-[#8B1532]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Sub-second Latency</p>
              <p className="text-[11px] text-[#7A8499]">Edge Distributed Stack</p>
            </div>
          </motion.div>

          {/* 3D Motion Card Container with Top Opacity Mask (Upper part lower opacity) */}
          <motion.div
            style={{ rotateX, scale, transformOrigin: 'top center' }}
            className="glass-card p-2 sm:p-3 rounded-[32px] shadow-[0_50px_120px_rgba(0,0,0,0.9)] border border-white/[0.14] relative overflow-hidden [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.7)_25%,rgba(0,0,0,1)_50%)] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.7)_25%,rgba(0,0,0,1)_50%)]"
          >
            {/* Top Fade Gradient Overlay inside card for extra softness */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#09090B]/90 via-[#09090B]/40 to-transparent pointer-events-none z-10" />

            <div className="rounded-[28px] bg-[#111114] overflow-hidden border border-white/[0.06]">
              
              {/* Window Chrome Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#16161A] border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                </div>
                <div className="flex-1 max-w-md mx-4 px-4 py-1.5 bg-white/[0.04] rounded-full text-xs text-[#7A8499] text-left flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00D26A]" />
                    <span className="text-[#AAB3C5]">app.brainforge.com</span>/dashboard/analytics
                  </div>
                  <span className="text-[10px] text-[#00D26A] font-semibold bg-[rgba(0,210,106,0.1)] px-2 py-0.5 rounded-full">SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#7A8499]">
                  <Layers className="w-4 h-4 text-[#8B1532]" />
                  <span className="hidden sm:inline font-medium text-white">Live Operations</span>
                </div>
              </div>

              {/* Expanded Dashboard Top Grid */}
              <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { label: 'Active Client Projects', val: '24', change: '+18% this month', icon: TrendingUp, color: '#8B1532' },
                  { label: 'Senior Engineers & AI Staff', val: '48', change: 'Vetted Specialists', icon: Cpu, color: '#52091B' },
                  { label: 'Delivered Enterprise Work', val: '200+', change: '100% On-Time Guarantee', icon: CheckCircle2, color: '#8B1532' },
                ].map(({ label, val, change, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left hover:border-white/[0.15] transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{val}</span>
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-[#7A8499] mt-1">{change}</p>
                  </div>
                ))}
              </div>

              {/* Expanded Dashboard Progress Bars & Metric Graphs */}
              <div className="px-6 sm:px-8 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { title: 'Frontend Systems Performance', pct: 98, detail: 'Sub-second rendering SLA' },
                  { title: 'Backend Microservices Health', pct: 95, detail: 'Automated failover & autoscaling' },
                  { title: 'AI Model Inference Pipeline', pct: 92, detail: 'Real-time NLP & Computer Vision' },
                  { title: 'Database & Caching Layer', pct: 99, detail: 'Zero packet loss & instant sync' },
                ].map(({ title, pct, detail }, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-left hover:border-white/[0.10] transition-colors">
                    <div className="flex items-center justify-between text-sm text-[#AAB3C5] mb-2 font-medium">
                      <span>{title}</span>
                      <span className="text-white font-bold">{pct}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden mb-2">
                      <motion.div
                        className="h-2.5 rounded-full bg-gradient-to-r from-[#730E27] to-[#52091B]"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.4, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-[11px] text-[#7A8499]">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
