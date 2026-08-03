'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Globe,
  Smartphone,
  Code2,
  Cpu,
  Cloud,
  Layers,
  Palette,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  BarChart3,
  CreditCard,
  Building2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  'website-development': Globe,
  'mobile-app-development': Smartphone,
  'custom-software-development': Code2,
  'ai-automation': Cpu,
  'cloud-devops': Cloud,
  'api-development': Layers,
  'ui-ux-design': Palette,
  'digital-marketing': TrendingUp,
  'cyber-security': ShieldCheck,
  'qa-testing': CheckCircle2,
  'maintenance-support': Wrench,
  'data-analytics': BarChart3,
  'payment-fintech': CreditCard,
  'industry-specific-solutions': Building2,
};

const DEFAULT_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Website & Web Application Development',
    slug: 'website-development',
    description: 'High-performance Next.js, React & Node.js web applications engineered for speed, SEO, and global scalability.',
    services: [{ title: 'Next.js 15 SSR' }, { title: 'Enterprise Web Apps' }, { title: 'Headless CMS' }],
  },
  {
    id: 'cat-2',
    name: 'Mobile App Development (iOS & Android)',
    slug: 'mobile-app-development',
    description: 'Native Flutter & React Native cross-platform mobile apps with seamless offline sync and biometric auth.',
    services: [{ title: 'Flutter Apps' }, { title: 'React Native' }, { title: 'iOS & Android' }],
  },
  {
    id: 'cat-3',
    name: 'Custom Enterprise Software & ERP',
    slug: 'custom-software-development',
    description: 'Tailored enterprise workflow automation, SaaS platforms, and CRM systems engineered for high concurrency.',
    services: [{ title: 'Microservices' }, { title: 'PostgreSQL Architecture' }, { title: 'Enterprise ERP' }],
  },
  {
    id: 'cat-4',
    name: 'AI Solutions & Machine Learning',
    slug: 'ai-automation',
    description: 'LLM integrations, custom AI agents, automated workflow bots, and predictive data analytics.',
    services: [{ title: 'AI Agents' }, { title: 'OpenAI & LLMs' }, { title: 'Workflow Automation' }],
  },
  {
    id: 'cat-5',
    name: 'Cloud Architecture & DevOps',
    slug: 'cloud-devops',
    description: 'AWS, Docker & Kubernetes infrastructure setup with 99.99% uptime guarantees and CI/CD pipelines.',
    services: [{ title: 'AWS Cloud' }, { title: 'Docker Containerization' }, { title: 'CI/CD Pipelines' }],
  },
  {
    id: 'cat-6',
    name: 'UI/UX Design & Product Strategy',
    slug: 'ui-ux-design',
    description: 'User-centric wireframing, high-fidelity Figma prototypes, and cohesive design system development.',
    services: [{ title: 'Figma Systems' }, { title: 'UX Research' }, { title: 'Interactive Prototypes' }],
  },
];

function cleanCategoryName(name?: string) {
  if (!name) return '';
  return name.replace(/^[^\x20-\x7E]+\s*/, '').trim() || name;
}

interface ServicesSectionProps {
  categories?: any[];
  initialServices?: any[];
}

export function ServicesSection({ categories = [], initialServices = [] }: ServicesSectionProps) {
  const hasCategories = Array.isArray(categories) && categories.length > 0;
  const hasServices = Array.isArray(initialServices) && initialServices.length > 0;
  const displayItems = hasCategories ? categories : hasServices ? initialServices : DEFAULT_CATEGORIES;

  return (
    <section id="services" className="relative py-24 bg-[#060910]">
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-orange-600/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-widest flex items-center gap-1.5 w-fit mb-3">
              <Sparkles className="w-3.5 h-3.5 fill-current text-orange-400" /> Software Solutions Catalog
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Enterprise <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-cyan-400">Software Services</span>
            </h2>
            <p className="mt-3 text-slate-400 text-base max-w-2xl">
              Explore our core software development categories engineered for global digital transformation.
            </p>
          </div>

          <Link
            href="/services"
            className="px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-orange-400 hover:text-white font-bold text-sm flex items-center gap-2 transition-all shrink-0 shadow-lg"
          >
            <span>View All 180+ Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid (Real Software Cards Guaranteed) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.map((item: any, idx: number) => {
            const isCategory = !!item.slug || hasCategories;
            const Icon = isCategory ? CATEGORY_ICONS[item.slug] || Globe : Globe;
            const title = isCategory ? cleanCategoryName(item.name) : item.title;
            const description = isCategory
              ? item.description || `Enterprise grade ${cleanCategoryName(item.name)} solutions tailored for scalable business growth.`
              : item.overview;
            
            const subServices = isCategory && Array.isArray(item.services)
              ? item.services.slice(0, 3).map((s: any) => s.title)
              : item.technologies || [];

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 6) * 0.05 }}
                className="p-8 rounded-3xl bg-[#0B1224] border border-white/[0.08] hover:border-orange-500/40 transition-all shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-cyan-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <span
                      suppressHydrationWarning
                      className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-orange-500/10 text-orange-300 border border-orange-500/20 uppercase tracking-wider"
                    >
                      {isCategory ? `${item.services?.length || 10}+ Solutions` : 'Featured'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-orange-400 transition-colors">
                    {title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6 line-clamp-3">
                    {description}
                  </p>

                  {/* Sub-service badges */}
                  {subServices.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {subServices.map((subName: string) => (
                        <span
                          key={subName}
                          className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-white/[0.04] border border-white/[0.08] text-slate-300"
                        >
                          {subName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/services"
                  className="w-full py-3 px-4 rounded-xl bg-orange-500/10 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 text-orange-300 hover:text-white font-bold text-xs flex items-center justify-between border border-orange-500/20 transition-all group/btn"
                >
                  <span>Explore {title}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
