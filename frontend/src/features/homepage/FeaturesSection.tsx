'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  CheckCircle2, Zap, Users, Lock,
  RefreshCw, HeadphonesIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  CheckCircle2,
  Zap,
  Users,
  Lock,
  RefreshCw,
  HeadphonesIcon,
};

interface FeaturesSectionProps {
  features?: { title: string; description: string; icon?: string; color?: string }[];
}

export function FeaturesSection({ features = [] }: FeaturesSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  if (features.length === 0) {
    return null;
  }

  return (
    <section id="features" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#851636] opacity-[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="section-label justify-center mb-3">Why BrainForge</div>
          <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-extrabold tracking-tight">
            Built for{' '}
            <span className="gradient-text">Serious Teams</span>
          </h2>
          <p className="mt-4 text-[#AAB3C5] max-w-xl mx-auto text-balance">
            We don&apos;t just write code — we deliver outcomes with the processes and tools that world-class agencies use.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ title, description, icon, color = '#A61C43' }, i) => {
            const Icon = (icon && ICON_MAP[icon]) || CheckCircle2;
            return (
              <motion.div
                key={title || i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
                className="flex gap-4 p-6 rounded-[24px] bg-[rgba(20,20,25,0.85)] backdrop-blur-xl border border-white/[0.08] hover:border-[#A61C43] hover:shadow-[0_12px_36px_rgba(166,28,67,.12)] hover:-translate-y-2 transition-all duration-250 group"
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
