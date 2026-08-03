import Link from 'next/link';
import { HeroSection }     from '@/features/homepage/HeroSection';
import { StatsSection }    from '@/features/homepage/StatsSection';
import { ServicesSection } from '@/features/homepage/ServicesSection';
import { ProjectsSection } from '@/features/homepage/ProjectsSection';
import { TeamSection }     from '@/features/homepage/TeamSection';
import { CTASection }      from '@/features/homepage/CTASection';
import { SectionStack }    from '@/components/layout/SectionStack';
import {
  fetchPublicServiceCategories,
  fetchFeaturedServices,
  fetchPublicProjects,
  fetchPublicTeam,
  fetchPublicTestimonials,
  fetchPublicFaqs,
  fetchPublicClients,
  fetchSiteSettings
} from '@/features/homepage/homepage.actions';
import { Sparkles, Star } from 'lucide-react';

export default async function HomePage() {
  const [categories, featuredServices, projects, team, testimonials, faqs, clients, settings] = await Promise.all([
    fetchPublicServiceCategories().catch(() => []),
    fetchFeaturedServices().catch(() => []),
    fetchPublicProjects().catch(() => []),
    fetchPublicTeam().catch(() => []),
    fetchPublicTestimonials().catch(() => []),
    fetchPublicFaqs().catch(() => []),
    fetchPublicClients().catch(() => []),
    fetchSiteSettings().catch(() => ({})),
  ]);

  return (
    <div className="relative bg-[#050608] text-slate-100 min-h-screen selection:bg-orange-500 selection:text-white">
      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <SectionStack isHero>
        <HeroSection settings={settings} />
      </SectionStack>

      {/* ── Stats Counter ────────────────────────────────────────────────── */}
      <SectionStack>
        <StatsSection />
      </SectionStack>

      {/* ── Service Categories Showcase (Same Card Design) ───────────────────── */}
      <SectionStack id="services">
        <ServicesSection categories={categories} initialServices={featuredServices} />
      </SectionStack>

      {/* ── Featured Portfolio Projects ──────────────────────────────────── */}
      <SectionStack id="projects">
        <ProjectsSection projects={projects} />
      </SectionStack>

      {/* ── Our Engineering Team Showcase (NO login, showcase only) ───────── */}
      <SectionStack id="team">
        <TeamSection teamMembers={team} />
      </SectionStack>

      {/* ── Testimonials & FAQs ──────────────────────────────────────────── */}
      <SectionStack id="faq">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {testimonials.length > 0 && (
            <div className="mb-20">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20">
                  <Star className="w-3.5 h-3.5 fill-current text-orange-400" /> Client Feedback
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 tracking-tight">
                  Trusted By <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Global Leaders</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((t: any) => (
                  <div key={t.id} className="p-8 rounded-3xl bg-[#0B1224] border border-white/[0.08] backdrop-blur-xl hover:border-orange-500/40 transition-all shadow-xl">
                    <p className="text-slate-300 italic mb-6 leading-relaxed text-sm">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                      {t.avatar && (
                        <img src={t.avatar} alt={t.clientName} className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/40" />
                      )}
                      <div>
                        <h4 className="font-bold text-white text-base">{t.clientName}</h4>
                        <p className="text-xs text-orange-400 font-semibold">{t.position} — {t.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {faqs.length > 0 && (
            <div>
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20">
                  <Sparkles className="w-3.5 h-3.5 fill-current text-orange-400" /> Got Questions?
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 tracking-tight">
                  Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Questions</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {faqs.map((faq: any) => (
                  <div key={faq.id} className="p-6 rounded-3xl bg-[#0B1224] border border-white/[0.08] hover:border-orange-500/30 transition-all shadow-lg">
                    <h3 className="font-bold text-white text-base mb-2">{faq.question}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionStack>

      {/* ── Contact CTA Form ─────────────────────────────────────────────── */}
      <SectionStack id="contact">
        <CTASection />
      </SectionStack>
    </div>
  );
}
