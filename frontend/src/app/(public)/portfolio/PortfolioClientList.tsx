'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Grid3X3,
  LayoutList,
  ArrowRight,
  Award,
} from 'lucide-react';

const DEFAULT_PORTFOLIO = [
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

export function PortfolioClientList({ projects = [] }: { projects?: any[] }) {
  const [viewMode, setViewMode] = React.useState<'row' | 'grid'>('row');

  const displayProjects = Array.isArray(projects) && projects.length > 0 ? projects : DEFAULT_PORTFOLIO;

  return (
    <div className="space-y-12">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0B1224] p-4 rounded-2xl border border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-extrabold text-white uppercase tracking-wider">
            Showing {displayProjects.length} Case Studies
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-[#060910] p-1.5 rounded-xl border border-white/[0.1]">
          <span className="text-[11px] font-bold text-slate-400 px-2 hidden md:inline">Layout View:</span>

          <button
            onClick={() => setViewMode('row')}
            className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'row'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            <span>Split Rows</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Grid Cards</span>
          </button>
        </div>
      </div>

      {/* Dynamic Projects Rendering */}
      {viewMode === 'row' ? (
        /* ── Side-by-Side Split Row View ────────────────────────────────────── */
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
                {/* Image Cover */}
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

                {/* Content Details */}
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

                  {/* Impact Results */}
                  {safeResults.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[#07090F] border border-white/[0.08] space-y-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400 block">
                        Verified Business Impact
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

                  {/* Tech Stack */}
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
                  {project.liveUrl && (
                    <div className="pt-2">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg transition-all hover:scale-105"
                      >
                        <span>Visit Live Platform</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* ── Grid View ──────────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project: any, i: number) => {
            const safeTech = Array.isArray(project.technologies) ? project.technologies : ['Next.js', 'PostgreSQL'];
            const safeResults = Array.isArray(project.results) ? project.results : [];

            return (
              <motion.div
                key={project.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group rounded-3xl bg-[#0B1224] border border-white/[0.08] hover:border-orange-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-xl"
              >
                <div className="relative h-64 w-full overflow-hidden bg-[#090D16]">
                  <img
                    src={project.coverImage || 'https://images.unsplash.com/photo-1556742049-0a67562867ef?auto=format&fit=crop&w=1200&q=80'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1224] via-[#0B1224]/20 to-transparent" />
                  {project.industry && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full bg-orange-500/20 backdrop-blur-md text-orange-300 border border-orange-500/40 shadow-lg">
                        {project.industry}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-extrabold text-white group-hover:text-orange-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {safeResults.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-orange-500/5 border border-orange-500/15 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-400 block">
                        Proven Business Results
                      </span>
                      {safeResults.slice(0, 2).map((res: string) => (
                        <div key={res} className="flex items-center gap-2 text-[11px] font-semibold text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{res}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {safeTech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {safeTech.map((tech: string) => (
                        <span key={tech} className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.liveUrl && (
                    <div className="pt-2 border-t border-white/[0.08]">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <span>Visit Live Platform</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
