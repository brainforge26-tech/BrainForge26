'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProjectsSectionProps {
  projects?: any[];
}

export function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const safeProjects = Array.isArray(projects) ? projects : [];

  if (safeProjects.length === 0) {
    return null;
  }

  return (
    <section id="projects" ref={ref} className="relative py-24 overflow-hidden bg-[#06070a]">
      <div className="absolute right-0 top-1/3 w-[500px] h-[500px] bg-orange-600 opacity-[0.05] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-current text-orange-400" />
            Our Portfolio
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Case Studies We&apos;re <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Proud Of</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-base">
            Explore our latest enterprise web applications, AI integrations, and mobile platforms engineered for market leaders.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {safeProjects.slice(0, 4).map((project, i) => {
            const safeTech = Array.isArray(project.technologies) ? project.technologies : ['Next.js', 'PostgreSQL'];
            return (
              <motion.div
                key={project.id || i}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-3xl bg-[#0B1224] border border-white/[0.08] hover:border-orange-500/40 transition-all duration-300 flex flex-col overflow-hidden shadow-xl"
              >
                <div className="relative h-64 w-full overflow-hidden bg-[#090D16]">
                  <img
                    src={project.coverImage || 'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80'}
                    alt={project.title || project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1224] via-transparent to-transparent opacity-90" />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-orange-500/20 backdrop-blur-md text-orange-300 border border-orange-500/30">
                      {project.industry || 'Featured'}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-white group-hover:text-orange-400 transition-colors mb-2">
                      {project.title || project.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-6">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {safeTech.map((tech: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link href={`/portfolio`} className="mt-auto">
                    <button className="w-full py-3 px-4 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-orange-500/20 transition-all">
                      <span>View Case Study</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {safeProjects.length > 4 && (
          <div className="mt-14 text-center">
            <Link href="/portfolio">
              <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-black text-xs shadow-lg flex items-center gap-2 mx-auto">
                <span>Explore All Projects</span>
                <Layers className="w-4 h-4" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
