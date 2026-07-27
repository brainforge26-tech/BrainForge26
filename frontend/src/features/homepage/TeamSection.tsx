'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const TEAM = [
  {
    name:   'Alex Carter',
    role:   'Full-Stack Lead',
    skills: ['Next.js', 'Node.js', 'PostgreSQL'],
    avatar: 'AC',
    color:  '#4F7DFF',
    exp:    '7 yrs',
  },
  {
    name:   'Sara Kim',
    role:   'UI/UX & Frontend',
    skills: ['React', 'Figma', 'Tailwind'],
    avatar: 'SK',
    color:  '#7C5CFF',
    exp:    '5 yrs',
  },
  {
    name:   'James Okafor',
    role:   'Backend & DevOps',
    skills: ['Express', 'AWS', 'Docker'],
    avatar: 'JO',
    color:  '#00D4FF',
    exp:    '6 yrs',
  },
  {
    name:   'Priya Mehta',
    role:   'Mobile Developer',
    skills: ['React Native', 'Flutter', 'Firebase'],
    avatar: 'PM',
    color:  '#22C55E',
    exp:    '4 yrs',
  },
  {
    name:   'David Chen',
    role:   'Data & Analytics',
    skills: ['Python', 'PostgreSQL', 'BI Tools'],
    avatar: 'DC',
    color:  '#F59E0B',
    exp:    '5 yrs',
  },
  {
    name:   'Lena Müller',
    role:   'QA & Security',
    skills: ['Testing', 'Pen Testing', 'Compliance'],
    avatar: 'LM',
    color:  '#EF4444',
    exp:    '4 yrs',
  },
];

export function TeamSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="team" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7C5CFF] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="section-label justify-center mb-3">Our Team</div>
          <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-extrabold tracking-tight">
            Meet the <span className="gradient-text">Experts</span>
          </h2>
          <p className="mt-4 text-[#AAB3C5] max-w-xl mx-auto text-balance">
            Senior developers with years of real-world product experience, ready to join your project.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map(({ name, role, skills, avatar, color, exp }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group glass-card p-6 flex flex-col items-center text-center gap-4">

              {/* Avatar */}
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)`, border: `1px solid ${color}40` }}>
                  {avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#22C55E] border-2 border-[#050816]" />
              </div>

              <div>
                <h3 className="font-semibold text-white text-base">{name}</h3>
                <p className="text-sm text-[#7A8499] mt-0.5">{role}</p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap justify-center gap-1.5">
                {skills.map(s => (
                  <span key={s}
                    className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.05] border border-white/[0.08] text-[#AAB3C5]">
                    {s}
                  </span>
                ))}
              </div>

              {/* Exp + socials */}
              <div className="flex items-center justify-between w-full pt-3 border-t border-white/[0.06]">
                <span className="text-xs text-[#7A8499]">{exp} experience</span>
                <div className="flex gap-2">
                  <button className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] transition-colors flex items-center justify-center text-[#7A8499] hover:text-white">
                    <Github className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] transition-colors flex items-center justify-center text-[#7A8499] hover:text-white">
                    <Linkedin className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hiring CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-14 p-8 rounded-[24px] bg-gradient-to-r from-[rgba(79,125,255,0.08)] to-[rgba(124,92,255,0.06)] border border-[rgba(79,125,255,0.15)] text-center">
          <h3 className="text-xl font-bold text-white mb-2">Want to join the team?</h3>
          <p className="text-[#AAB3C5] text-sm mb-5">
            We&apos;re always looking for talented developers. Apply to our hiring program.
          </p>
          <Link href="/apply" className="btn-primary inline-flex items-center gap-2">
            View Open Positions <ExternalLink className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
