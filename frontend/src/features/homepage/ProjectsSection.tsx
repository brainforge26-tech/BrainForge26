'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

const PROJECTS = [
  {
    title:       'E-Commerce Platform',
    type:        'Web Application',
    description: 'Full-stack marketplace with real-time inventory, Stripe payments, and an admin dashboard for a US retail client.',
    tech:        ['Next.js', 'PostgreSQL', 'Stripe', 'Redis'],
    status:      'Completed',
    color:       '#4F7DFF',
    gradient:    'from-[#4F7DFF]/20 to-[#7C5CFF]/10',
  },
  {
    title:       'SaaS Analytics Dashboard',
    type:        'Data Platform',
    description: 'Real-time analytics dashboard with custom chart library, multi-tenant architecture, and CSV/PDF export.',
    tech:        ['React', 'Node.js', 'TimescaleDB', 'WebSockets'],
    status:      'Completed',
    color:       '#7C5CFF',
    gradient:    'from-[#7C5CFF]/20 to-[#00D4FF]/10',
  },
  {
    title:       'Mobile Delivery App',
    type:        'Mobile Application',
    description: 'Cross-platform delivery tracking app with live GPS, push notifications, and driver management portal.',
    tech:        ['React Native', 'Express', 'Socket.io', 'Maps API'],
    status:      'Active',
    color:       '#00D4FF',
    gradient:    'from-[#00D4FF]/20 to-[#4F7DFF]/10',
  },
  {
    title:       'Healthcare Portal',
    type:        'Enterprise System',
    description: 'HIPAA-compliant patient management system with appointment scheduling, telemedicine, and EHR integration.',
    tech:        ['Next.js', 'Prisma', 'PostgreSQL', 'Twilio'],
    status:      'Completed',
    color:       '#22C55E',
    gradient:    'from-[#22C55E]/20 to-[#00D4FF]/10',
  },
];

const STATUS_STYLE: Record<string, string> = {
  Completed: 'bg-[rgba(34,197,94,0.12)] text-[#22C55E] border-[rgba(34,197,94,0.25)]',
  Active:    'bg-[rgba(79,125,255,0.12)] text-[#4F7DFF] border-[rgba(79,125,255,0.25)]',
};

export function ProjectsSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="projects" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute left-0 top-1/3 w-[400px] h-[400px] bg-[#4F7DFF] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="section-label justify-center mb-3">Our Work</div>
          <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-extrabold tracking-tight">
            Projects We&apos;re <span className="gradient-text">Proud Of</span>
          </h2>
          <p className="mt-4 text-[#AAB3C5] max-w-xl mx-auto text-balance">
            From MVPs to enterprise systems — every project gets the same level of care and craft.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {PROJECTS.map(({ title, type, description, tech, status, color, gradient }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-card p-7 flex flex-col gap-5 cursor-pointer">

              {/* Top bar */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#7A8499] mb-1">{type}</p>
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${STATUS_STYLE[status]}`}>
                    {status}
                  </span>
                  <ExternalLink className="w-4 h-4 text-[#7A8499] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Gradient divider */}
              <div className={`h-px w-full bg-gradient-to-r ${gradient}`} />

              <p className="text-sm text-[#AAB3C5] leading-relaxed">{description}</p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {tech.map(t => (
                  <span key={t}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.05] border border-white/[0.08]"
                    style={{ color }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }} className="flex justify-center mt-12">
          <button className="btn-secondary inline-flex items-center gap-2">
            View All Projects <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
