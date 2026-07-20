'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  CheckCircle2, Zap, Users, Lock,
  RefreshCw, HeadphonesIcon,
} from 'lucide-react';

const FEATURES = [
  {
    icon: CheckCircle2,
    title: 'Milestone-Based Delivery',
    description: 'Clear milestones, transparent progress tracking, and on-time delivery — every time.',
    color: '#22C55E',
  },
  {
    icon: Zap,
    title: 'Rapid Development',
    description: 'Agile sprints, daily updates, and fast iteration cycles keep your project moving.',
    color: '#4F7DFF',
  },
  {
    icon: Users,
    title: 'Dedicated Team',
    description: 'A hand-picked team of senior developers, designers, and project managers just for you.',
    color: '#7C5CFF',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'SOC 2-aligned processes, NDAs, secure code reviews, and GDPR compliance by default.',
    color: '#00D4FF',
  },
  {
    icon: RefreshCw,
    title: 'Ongoing Support',
    description: 'Post-launch maintenance, hotfixes, and feature upgrades with guaranteed SLAs.',
    color: '#F59E0B',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Communication',
    description: 'Real-time messaging, weekly video calls, and a dedicated Slack channel for your project.',
    color: '#EF4444',
  },
];

export function FeaturesSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="features" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7C5CFF] opacity-[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="section-label justify-center mb-3">Why BrainForceIT</div>
          <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-extrabold tracking-tight">
            Built for{' '}
            <span className="gradient-text">Serious Teams</span>
          </h2>
          <p className="mt-4 text-[#AAB3C5] max-w-xl mx-auto text-balance">
            We don&apos;t just write code — we deliver outcomes with the processes
            and tools that world-class agencies use.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, description, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
              className="flex gap-4 p-6 rounded-[20px] bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-250 group"
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base mb-1.5">{title}</h3>
                <p className="text-sm text-[#7A8499] leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
