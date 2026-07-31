'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface StatsSectionProps {
  stats?: { value: string; label: string; description?: string }[];
}

export function StatsSection({ stats = [] }: StatsSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  if (stats.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      <div className="divider-glow mx-auto max-w-content" />

      <div className="section-wrapper mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label, description }, i) => (
            <motion.div
              key={label || i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              className="relative p-6 rounded-[24px] bg-[rgba(20,20,25,0.85)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] text-center hover:border-[rgba(166,28,67,0.15)] hover:shadow-[0_12px_36px_rgba(166,28,67,.08)] transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-[#A61C43] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <p className="text-4xl font-extrabold gradient-text-blue tracking-tight">{value}</p>
              <p className="mt-2 text-sm font-semibold text-white">{label}</p>
              {description && <p className="mt-1 text-xs text-[#7A8499]">{description}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
