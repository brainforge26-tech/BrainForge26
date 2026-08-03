'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ExternalLink,
  Grid3X3,
  LayoutList,
  CheckCircle2,
  Globe,
  Award,
} from 'lucide-react';

const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    title: 'FinTech Global Pay Portal',
    industry: 'FinTech / Banking',
    description: 'High-throughput enterprise payment gateway & multi-currency wallet processing $50M+ monthly transactions with multi-bank clearing.',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80',
    technologies: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Stripe API', 'Docker'],
    results: ['99.99% Core Uptime', '$50M+ Monthly Volume', 'Sub-100ms API Latency'],
    liveUrl: 'https://brainforge26.tech',
  },
  {
    id: 'proj-2',
    title: 'AI Healthcare Diagnostic Suite',
    industry: 'Healthcare & AI',
    description: 'AI-assisted medical image analysis & patient telemetry platform built for accredited hospital networks with HIPAA compliance.',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    technologies: ['Python', 'FastAPI', 'React', 'TensorFlow', 'PostgreSQL'],
    results: ['4.8x Faster Diagnosis', 'HIPAA & GDPR Compliant', '85k Patients Served'],
    liveUrl: 'https://brainforge26.tech',
  },
  {
    id: 'proj-3',
    title: 'Enterprise ERP & Logistics SaaS',
    industry: 'Logistics & Supply Chain',
    description: 'Real-time fleet tracking, automated inventory restocking, and multi-warehouse management connecting IoT telematics.',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    technologies: ['Flutter', 'Node.js', 'Docker', 'AWS', 'Redis'],
    results: ['32% Fleet Fuel Savings', 'Zero Inventory Loss', 'Real-time GPS Tracking'],
    liveUrl: 'https://brainforge26.tech',
  },
  {
    id: 'proj-4',
    title: 'SaaS Analytics & LLM Agent Bot',
    industry: 'Artificial Intelligence',
    description: 'Autonomous customer support AI agent reducing ticket resolution times by 75% across enterprise software platforms.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    technologies: ['Next.js', 'OpenAI API', 'TailwindCSS', 'Pinecone', 'Python'],
    results: ['75% Ticket Reduction', '24/7 Auto Support', '98% CSAT Rating'],
    liveUrl: 'https://brainforge26.tech',
  },
];

interface ProjectsSectionProps {
  projects?: any[];
}

export function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
  const [viewMode, setViewMode] = React.useState<'row' | 'grid'>('row');

  const displayProjects = Array.isArray(projects) && projects.length > 0 ? projects : DEFAULT_PROJECTS;

  return (
    <section id="projects" className="relative py-24 overflow-hidden bg-[#06070a]">
      {/* Ambient Glow */}
      <div className="absolute right-0 top-1/3 w-[500px] h-[500px] bg-orange-600 opacity-[0.05] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header & View Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-extrabold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 fill-current text-orange-400" />
              Our Portfolio & Case Studies
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Featured <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Case Studies</span>
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
              Explore our latest enterprise web applications, AI integrations, and mobile platforms engineered for market leaders.
            </p>
          </div>

          {/* Interactive Layout View Switcher */}
          <div className="flex items-center gap-2 bg-[#0B1224] p-1.5 rounded-2xl border border-white/[0.1] shadow-md shrink-0">
            <span className="text-[11px] font-bold text-slate-400 px-2 hidden md:inline">View Mode:</span>
            
            <button
              onClick={() => setViewMode('row')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'row'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
              title="Split Row View"
            >
              <LayoutList className="w-4 h-4" />
              <span>Split Rows</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
              title="3-Column Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {/* Dynamic Layout Rendering */}
        {viewMode === 'row' ? (
          /* ── 1. Side-by-Side Horizontal Row Split View ───────────────────── */
          <div className="space-y-12">
            {displayProjects.map((project: any, i: number) => {
              const safeTech = Array.isArray(project.technologies) ? project.technologies : ['Next.js', 'PostgreSQL'];
              const safeResults = Array.isArray(project.results) ? project.results : [];
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={project.id || i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group rounded-3xl bg-[#0B1224] border border-white/[0.08] hover:border-orange-500/40 p-6 sm:p-10 shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                >
                  {/* Image Column */}
                  <div
                    className={`relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#090D16] border border-white/[0.1] ${
                      isEven ? 'lg:col-span-6 lg:order-1' : 'lg:col-span-6 lg:order-2'
                    }`}
                  >
                    <img
                      src={project.coverImage || 'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1224] via-transparent to-transparent opacity-80" />

                    {project.industry && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-orange-500/20 backdrop-blur-md text-orange-300 border border-orange-500/30 shadow-lg">
                          {project.industry}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Column */}
                  <div
                    className={`space-y-6 ${
                      isEven ? 'lg:col-span-6 lg:order-2' : 'lg:col-span-6 lg:order-1'
                    }`}
                  >
                    <div className="space-y-3">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                        <Award className="w-4 h-4" /> Enterprise Case Study #{i + 1}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-orange-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Impact Metrics Checklist */}
                    {safeResults.length > 0 && (
                      <div className="p-4 rounded-2xl bg-[#07090F] border border-white/[0.08] space-y-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400 block">
                          Verified Key Impact
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {safeResults.map((res: string) => (
                            <div key={res} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="truncate">{res}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tech Badges */}
                    {safeTech.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                          Technology Stack
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {safeTech.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-xs font-semibold rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex items-center gap-4">
                      <Link href="/portfolio" className="flex-1 sm:flex-initial">
                        <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105">
                          <span>Explore Case Study</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-white/[0.1] transition-all"
                        >
                          <span>Live Platform</span>
                          <ExternalLink className="w-4 h-4 text-orange-400" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* ── 2. 3-Column Grid View ────────────────────────────────────────── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project: any, i: number) => {
              const safeTech = Array.isArray(project.technologies) ? project.technologies : ['Next.js', 'PostgreSQL'];

              return (
                <motion.div
                  key={project.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="group rounded-3xl bg-[#0B1224] border border-white/[0.08] hover:border-orange-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-xl"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-[#090D16]">
                    <img
                      src={project.coverImage || 'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1224] via-[#0B1224]/30 to-transparent" />
                    {project.industry && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full bg-orange-500/20 backdrop-blur-md text-orange-300 border border-orange-500/40 shadow-lg">
                          {project.industry}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <h3 className="text-xl font-extrabold text-white group-hover:text-orange-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {safeTech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {safeTech.slice(0, 4).map((tech: string, idx: number) => (
                          <span key={idx} className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
                      <Link href="/portfolio" className="flex-1">
                        <button className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-orange-500/20 text-slate-200 hover:text-orange-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-white/[0.08] transition-all">
                          <span>Case Study</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/20 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA to Full Portfolio Page */}
        <div className="pt-6 text-center">
          <Link href="/portfolio">
            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-xs tracking-wider uppercase shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto">
              <span>Explore All Portfolio Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
