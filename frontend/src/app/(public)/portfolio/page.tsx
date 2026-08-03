import { fetchPublicProjects } from '@/features/homepage/homepage.actions';
import { PortfolioClientList } from './PortfolioClientList';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Portfolio & Case Studies | BrainForge26',
  description: 'Explore our portfolio of enterprise software platforms, AI applications, and mobile products.',
};

export default async function PortfolioPage() {
  const projects = await fetchPublicProjects().catch(() => []);

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 fill-current text-orange-400" /> Client Success Stories
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Portfolio & Case Studies</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Real-world enterprise solutions engineered with precision, reliability, and measurable business impact.
          </p>
        </div>

        {/* Dynamic Multi-Grid Portfolio List */}
        <PortfolioClientList projects={projects} />
      </div>
    </div>
  );
}
