'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ProjectItem } from '@/data/projectsData';

const CATEGORIES = ['All', 'Web Application', 'Mobile App', 'E-Commerce', 'API / Backend', 'SaaS', 'Enterprise System'];

interface Props {
  initialProjects: ProjectItem[];
}

export function ProjectsListingClient({ initialProjects }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery]       = useState('');

  const filteredProjects = initialProjects.filter((project) => {
    const matchesCategory = activeCategory === 'All' || project.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch   =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-24 text-white">

      {/* Header Banner */}
      <div className="section-wrapper text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(115,14,39,0.12)] border border-[rgba(115,14,39,0.25)] text-[#8B1532] text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Our Dynamic Portfolio
        </div>
        <h1 className="text-[clamp(2.25rem,6vw,4rem)] font-extrabold tracking-tight">
          Explore Our <span className="gradient-text">Live Projects</span>
        </h1>
        <p className="mt-4 text-base md:text-lg text-[#AAB3C5] max-w-2xl mx-auto leading-relaxed">
          Real-time showcase of enterprise platforms, AI systems, and custom client projects directly managed by our team.
        </p>

        {/* Filter Controls */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto bg-[#111114]/90 p-3.5 rounded-2xl border border-white/[0.08]">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#730E27] via-[#8B1532] to-[#52091B] text-white shadow-[0_4px_16px_rgba(115,14,39,0.3)]'
                    : 'text-[#AAB3C5] hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A8499]" />
            <input
              type="text"
              placeholder="Search projects or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-[#7A8499] focus:outline-none focus:border-[#730E27]"
            />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="section-wrapper">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/[0.06]">
            <Filter className="w-10 h-10 text-[#7A8499] mx-auto mb-3" />
            <p className="text-lg font-bold text-white">No matching projects found</p>
            <p className="text-sm text-[#7A8499] mt-1">Try adjusting your category filter or search query.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-xl bg-white/[0.08] text-xs font-semibold text-white hover:bg-white/[0.12]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group glass-card overflow-hidden rounded-[28px] border border-white/[0.08] hover:border-[rgba(115,14,39,0.35)] hover:shadow-[0_20px_50px_rgba(115,14,39,0.2)] transition-all duration-300 flex flex-col"
              >
                {/* Cover Image Container */}
                <div className="relative h-64 w-full overflow-hidden bg-[#111114]">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-[#111114]/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#09090B]/85 backdrop-blur-md border border-white/10 text-white shadow-md">
                      {project.category}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[rgba(0,210,106,0.12)] border border-[rgba(0,210,106,0.25)] text-[#00D26A]">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-xs font-semibold text-[#7A8499] uppercase tracking-wider mb-1">
                        {project.client} · {project.timeline}
                      </p>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#8B1532] transition-colors">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-[#AAB3C5] leading-relaxed line-clamp-3 mb-6">
                    {project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-[#AAB3C5]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs text-[#7A8499]">{project.images.length} Showcase Photos</span>
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#8B1532] hover:text-white transition-colors"
                    >
                      View Details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Box */}
      <div className="section-wrapper mt-20 text-center">
        <div className="glass-card p-10 rounded-[32px] border border-white/[0.08] max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Have a Project in Mind?</h2>
          <p className="text-sm sm:text-base text-[#AAB3C5] mt-2 max-w-xl mx-auto">
            Let&apos;s build an extraordinary web application or AI platform for your organization.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/register">
              <Button variant="primary" size="lg" className="rounded-[10px] px-8">
                Start Your Project Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
