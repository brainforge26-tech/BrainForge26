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

  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute left-0 top-1/3 w-[500px] h-[500px] bg-[#730E27] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label justify-center mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#8B1532]" />
            Our Portfolio
          </div>
          <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold tracking-tight">
            Projects We&apos;re <span className="gradient-text">Proud Of</span>
          </h2>
          <p className="mt-4 text-[#AAB3C5] max-w-xl mx-auto text-balance">
            Explore our latest web applications, AI integrations, and mobile solutions crafted with precision and craft.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.slice(0, 4).map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-card overflow-hidden rounded-[28px] border border-white/[0.08] hover:border-[rgba(115,14,39,0.35)] hover:shadow-[0_20px_50px_rgba(115,14,39,0.2)] transition-all duration-300 flex flex-col"
            >
              <div className="relative h-60 w-full overflow-hidden bg-[#111114]">
                <Image
                  src={project.coverImage || 'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80'}
                  alt={project.title || project.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-black/60 backdrop-blur-md text-[#C02C54] border border-[#A61C43]/30">
                    {project.status || 'Featured'}
                  </span>
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#C02C54] transition-colors mb-2">
                    {project.title || project.name}
                  </h3>
                  <p className="text-sm text-[#AAB3C5] line-clamp-2 leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {(project.technologies || ['Next.js', 'PostgreSQL']).map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Link href={`/projects/${project.id}`} className="mt-auto">
                  <Button variant="outline" className="w-full justify-center group-hover:border-[#A61C43]">
                    View Case Study <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length > 4 && (
          <div className="mt-14 text-center">
            <Link href="/projects">
              <Button size="lg" className="rounded-xl">
                Explore All Projects <Layers className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
