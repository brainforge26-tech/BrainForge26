'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Calendar,
  UserCheck,
  Zap,
  ShieldCheck,
  Layers,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ProjectItem } from '@/data/projectsData';

export function ProjectDetailsClient({ project }: { project: ProjectItem }) {
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const imagesList = project.images && project.images.length > 0 ? project.images : [project.coverImage];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  return (
    <div className="min-h-screen bg-[#09090B] pt-28 pb-24 text-white">
      <div className="section-wrapper">

        {/* Back Link */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#AAB3C5] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio Projects
          </button>
        </div>

        {/* Header Title Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#111114] border border-white/10 text-[#8B1532]">
                {project.category}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[rgba(0,210,106,0.12)] border border-[rgba(0,210,106,0.25)] text-[#00D26A]">
                {project.status}
              </span>
            </div>
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight text-white">
              {project.title}
            </h1>
            <p className="mt-2 text-base md:text-lg text-[#AAB3C5] max-w-3xl">
              {project.description}
            </p>
          </div>

          {/* Action Buttons */}
          {project.demoUrl && (
            <div className="shrink-0 flex items-center gap-3">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="lg" className="rounded-[10px] shadow-[0_10px_35px_rgba(115,14,39,0.35)]" rightIcon={<ExternalLink className="w-4 h-4" />}>
                  Live Preview
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* ── Multiple Image Sliding Carousel ─────────────────────────────────── */}
        <div className="mb-14">
          <div className="relative h-[320px] sm:h-[480px] md:h-[580px] w-full rounded-[32px] overflow-hidden bg-[#111114] border border-white/[0.10] shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
            
            {/* Sliding Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.35 }}
                className="relative w-full h-full"
              >
                <Image
                  src={imagesList[activeImageIndex]}
                  alt={`${project.title} screenshot ${activeImageIndex + 1}`}
                  fill
                  className="object-cover object-top"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {imagesList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#09090B]/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#730E27] hover:border-[#730E27] transition-all shadow-lg z-20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#09090B]/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#730E27] hover:border-[#730E27] transition-all shadow-lg z-20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Indicator Counter */}
            <div className="absolute bottom-4 left-4 z-20 px-4 py-1.5 rounded-full bg-[#09090B]/85 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
              {activeImageIndex + 1} / {imagesList.length} Screenshots
            </div>
          </div>

          {/* Thumbnail Strip */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
              {imagesList.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative h-20 w-32 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === index
                      ? 'border-[#730E27] shadow-[0_0_16px_rgba(115,14,39,0.4)] scale-105'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Case Study Content Details ──────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Main Details (2 Columns) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Overview */}
            <section className="glass-card p-8 rounded-[28px] border border-white/[0.08]">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#8B1532]" /> Project Overview
              </h2>
              <p className="text-base text-[#AAB3C5] leading-relaxed">
                {project.fullDescription || project.description}
              </p>
            </section>

            {/* Features Built */}
            {project.features && project.features.length > 0 && (
              <section className="glass-card p-8 rounded-[28px] border border-white/[0.08]">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#8B1532]" /> Key Features Delivered
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <CheckCircle2 className="w-5 h-5 text-[#00D26A] shrink-0 mt-0.5" />
                      <span className="text-sm text-[#CBD5E1] font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Challenge & Solution */}
            {(project.challenge || project.solution) && (
              <section className="grid sm:grid-cols-2 gap-6">
                {project.challenge && (
                  <div className="p-7 rounded-[24px] bg-white/[0.02] border border-white/[0.06]">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#EF4444]" /> The Challenge
                    </h3>
                    <p className="text-sm text-[#AAB3C5] leading-relaxed">{project.challenge}</p>
                  </div>
                )}

                {project.solution && (
                  <div className="p-7 rounded-[24px] bg-[rgba(115,14,39,0.04)] border border-[rgba(115,14,39,0.15)]">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#00D26A]" /> The Solution & Impact
                    </h3>
                    <p className="text-sm text-[#AAB3C5] leading-relaxed mb-3">{project.solution}</p>
                    {project.impact && (
                      <p className="text-xs font-bold text-[#00D26A] bg-[rgba(0,210,106,0.1)] px-3 py-1.5 rounded-lg inline-block">
                        {project.impact}
                      </p>
                    )}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar Metadata (1 Column) */}
          <div className="space-y-6">
            <div className="glass-card p-7 rounded-[28px] border border-white/[0.08] space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/[0.06] pb-3">Project Metadata</h3>

              <div>
                <p className="text-xs text-[#7A8499] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#8B1532]" /> Client Organization
                </p>
                <p className="text-sm font-semibold text-white">{project.client}</p>
              </div>

              <div>
                <p className="text-xs text-[#7A8499] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8B1532]" /> Timeline & Duration
                </p>
                <p className="text-sm font-semibold text-white">{project.timeline}</p>
              </div>

              {project.role && (
                <div>
                  <p className="text-xs text-[#7A8499] uppercase font-bold tracking-wider mb-1">Role & Engagement</p>
                  <p className="text-sm font-semibold text-white">{project.role}</p>
                </div>
              )}

              {/* Tech Stack List */}
              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-[#7A8499] uppercase font-bold tracking-wider mb-3">Technologies Used</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#111114] border border-white/10 text-white"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Projects CTA */}
            <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#730E27]/20 via-[#52091B]/10 to-transparent border border-[rgba(115,14,39,0.2)] text-center">
              <h4 className="text-base font-bold text-white">Need a similar solution?</h4>
              <p className="text-xs text-[#AAB3C5] mt-1 mb-4">Our team can design & build this for your brand.</p>
              <Link href="/register">
                <Button variant="primary" size="md" className="w-full rounded-[10px]">
                  Request Proposal
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
