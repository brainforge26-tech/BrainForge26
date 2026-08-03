'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Globe, Smartphone, Code2, Cpu, Cloud, Layers, Palette, TrendingUp, ShieldCheck, CheckCircle2, Wrench, BarChart3, CreditCard, Building2, ArrowRight } from 'lucide-react';

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

function cleanCategoryName(name?: string) {
  if (!name) return '';
  return name.replace(/^[^\x20-\x7E]+\s*/, '').trim() || name;
}

export function ServicesClientPage({ categories, allServices }: { categories: any[]; allServices: any[] }) {
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCategories = categories.map(cat => {
    const services = (cat.services || []).filter((s: any) =>
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.overview?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, services };
  }).filter(cat => selectedCat === 'ALL' || cat.id === selectedCat || cat.slug === selectedCat);

  return (
    <div className="space-y-12">
      {/* Search & Category Tabs */}
      <div className="space-y-6">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search 180+ software services (e.g. ERP, Flutter, bKash, AI Chatbot)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-slate-400 text-sm focus:outline-none focus:border-orange-400 transition-colors shadow-xl"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedCat('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCat === 'ALL'
                ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg'
                : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/[0.08]'
            }`}
          >
            All Categories ({allServices.length})
          </button>
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat.slug] || Globe;
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/[0.08]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-orange-400" />
                <span suppressHydrationWarning>{cleanCategoryName(cat.name)}</span>
                <span className="text-[10px] opacity-70">({cat.services?.length || 0})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-16">
        {filteredCategories.map(cat => {
          if (!cat.services || cat.services.length === 0) return null;
          const Icon = CATEGORY_ICONS[cat.slug] || Globe;

          return (
            <div key={cat.id} className="space-y-6 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 suppressHydrationWarning className="text-2xl font-extrabold text-white">{cat.name}</h2>
                  {cat.description && <p className="text-xs text-slate-400">{cat.description}</p>}
                </div>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.services.map((service: any) => (
                  <div
                    key={service.id}
                    className="p-6 rounded-3xl bg-[#0B1224] border border-white/[0.08] hover:border-orange-500/40 transition-all shadow-xl flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">
                          {service.title}
                        </span>
                        {service.isFeatured && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                            ★ Featured
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-4">{service.overview}</p>

                      {service.technologies && service.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {service.technologies.map((tech: string) => (
                            <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500/10 text-orange-300 border border-orange-500/20">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="mt-4 py-2.5 px-4 rounded-xl bg-orange-500/10 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 text-orange-300 hover:text-white font-bold text-xs flex items-center justify-between border border-orange-500/20 transition-all"
                    >
                      <span>Request Consultation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
