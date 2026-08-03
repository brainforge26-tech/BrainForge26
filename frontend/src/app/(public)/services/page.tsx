import { fetchPublicServices, fetchPublicServiceCategories } from '@/features/homepage/homepage.actions';
import { ServicesClientPage } from './ServicesClientPage';

export const metadata = {
  title: 'Software Services Catalog | BrainForge26',
  description: 'Explore our complete software services catalog across Web, Mobile, Custom ERP/CRM, AI & Automation, DevOps, and Payment integrations.',
};

export default async function ServicesPage() {
  const [categories, services] = await Promise.all([
    fetchPublicServiceCategories().catch(() => []),
    fetchPublicServices().catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-[#060910] text-slate-100 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-cyan-400 border border-blue-500/20 uppercase tracking-widest">
            Corporate Software Services Catalog
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mt-4 tracking-tight">
            Comprehensive <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">Software & AI Capabilities</span>
          </h1>
          <p className="mt-4 text-slate-400 text-lg leading-relaxed">
            Browse our full catalog of software engineering services across 14 specialized domain categories.
          </p>
        </div>

        {/* Client Interactive Catalog */}
        <ServicesClientPage categories={categories} allServices={services} />

      </div>
    </div>
  );
}
