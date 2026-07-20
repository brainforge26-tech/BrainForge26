'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Globe, Smartphone, Palette, Cloud,
  Shield, BarChart3, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const SERVICES = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Full-stack web applications built with modern frameworks. Scalable, fast, and enterprise-ready.',
    color: '#4F7DFF',
    tags: ['Next.js', 'React', 'Node.js'],
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Cross-platform iOS and Android apps with native performance and beautiful UI.',
    color: '#7C5CFF',
    tags: ['React Native', 'Flutter', 'Expo'],
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Premium product design with deep user research, prototyping, and pixel-perfect delivery.',
    color: '#00D4FF',
    tags: ['Figma', 'Design Systems', 'Prototyping'],
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    description: 'CI/CD pipelines, containerisation, and cloud infrastructure at any scale.',
    color: '#22C55E',
    tags: ['AWS', 'Docker', 'Kubernetes'],
  },
  {
    icon: Shield,
    title: 'Security & QA',
    description: 'End-to-end testing, penetration testing, and security audits for your products.',
    color: '#F59E0B',
    tags: ['Testing', 'Pen Testing', 'Compliance'],
  },
  {
    icon: BarChart3,
    title: 'Analytics & Data',
    description: 'Turn raw data into actionable business intelligence with custom dashboards.',
    color: '#EF4444',
    tags: ['PostgreSQL', 'Analytics', 'Dashboards'],
  },
];

export function ServicesSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="services" ref={ref} className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[#0B1224]/40 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#4F7DFF] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="section-wrapper relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="section-label justify-center mb-3">Our Services</div>
          <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-extrabold tracking-tight">
            Everything You Need to{' '}
            <span className="gradient-text">Ship Great Products</span>
          </h2>
          <p className="mt-4 text-[#AAB3C5] max-w-xl mx-auto text-balance">
            From idea to launch, we cover every layer of the stack and every
            phase of the product lifecycle.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, title, description, color, tags }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className="group glass-card p-7 flex flex-col gap-5 cursor-pointer"
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group-hover:scale-110"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>

              {/* Text */}
              <div>
                <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-sm text-[#AAB3C5] leading-relaxed">{description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.05] text-[#7A8499] border border-white/[0.06]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hover arrow */}
              <div className="flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 -mt-1" style={{ color }}>
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mt-12"
        >
          <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All Services
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
