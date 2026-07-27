'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink, Sparkles, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PROJECTS_DATA } from '@/data/projectsData';

interface ProjectsSectionProps {
  initialProjects?: any[];
}

export function ProjectsSection({ initialProjects }: ProjectsSectionProps) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const displayProjects = initialProjects && initialProjects.length > 0 ? initialProjects : PROJECTS_DATA;

  return (
    <section id="projects" ref={ref} className="relative py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute left-0 top-1/3 w-[500px] h-[500px] bg-[#730E27] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="section-wrapper relative z-10">
        {/* Header */}
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

        {/* Grid Showcase */}
        <div className="grid md:grid-cols-2 gap-8">
          {displayProjects.slice(0, 4).map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-card overflow-hidden rounded-[28px] border border-white/[0.08] hover:border-[rgba(115,14,39,0.35)] hover:shadow-[0_20px_50px_rgba(115,14,39,0.2)] transition-all duration-300 flex flex-col"
            >
              {/* Image Preview Container */}
              <div className="relative h-60 w-full overflow-hidden bg-[#111114]">
                <Image
                  src={project.coverImage || 'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80'}
                  alt={project.title || project.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-[#111114]/30 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#09090B]/80 backdrop-blur-md border border-white/10 text-white shadow-md">
                    {project.category || project.projectType || 'Web App'}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[rgba(0,210,106,0.12)] border border-[rgba(0,210,106,0.25)] text-[#00D26A]">
                    {project.status || 'Active'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#8B1532] transition-colors">
                    {project.title || project.name}
                  </h3>
                  <Link
                    href={`/projects/${project.id}`}
                    className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#AAB3C5] group-hover:text-white group-hover:bg-[#730E27] group-hover:border-[#730E27] transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                <p className="text-sm text-[#AAB3C5] line-clamp-2 leading-relaxed mb-5">
                  {project.description}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-2 mt-auto mb-6">
                  {(project.tech || project.technologies || []).slice(0, 4).map((t: string) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-[#AAB3C5]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* View Details Link */}
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#8B1532] hover:text-white transition-colors pt-4 border-t border-white/[0.06]"
                >
                  View Case Study & Gallery <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-14"
        >
          <Link href="/projects">
            <Button
              variant="primary"
              size="lg"
              className="rounded-[12px] px-8 py-3.5 shadow-[0_10px_35px_rgba(115,14,39,0.35)] hover:scale-105"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              View All Projects Portfolio
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
