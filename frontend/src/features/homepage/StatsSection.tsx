'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const STATS = [
  { value: '200+', label: 'Projects Delivered',  description: 'Across 15 industries' },
  { value: '98%',  label: 'Client Satisfaction', description: 'Based on 500+ reviews' },
  { value: '50+',  label: 'Expert Developers',   description: 'Vetted & certified' },
  { value: '5yr',  label: 'In the Industry',     description: 'Trusted since 2019' },
];

export function StatsSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      {/* Divider glow */}
      <div className="divider-glow mx-auto max-w-content" />

      <div className="section-wrapper mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ value, label, description }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              className="relative p-6 rounded-[24px] bg-[rgba(20,20,25,0.85)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] text-center hover:border-[rgba(166,28,67,0.15)] hover:shadow-[0_12px_36px_rgba(166,28,67,.08)] transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-[#A61C43] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <p className="text-4xl font-extrabold gradient-text-blue tracking-tight">{value}</p>
              <p className="mt-2 text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-xs text-[#7A8499]">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
