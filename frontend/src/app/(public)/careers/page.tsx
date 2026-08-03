import { publicFetch } from '@/lib/api';
import { Sparkles } from 'lucide-react';
import { CareersClientList } from './CareersClientList';

export const metadata = {
  title: 'Careers & Open Positions | BrainForge26',
  description: 'Join our team of elite software engineers and technology leaders.',
};

export default async function CareersPage() {
  let jobs: any[] = [];
  try {
    const res = await publicFetch<any>('/jobs/jobs/public');
    jobs = Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    jobs = [];
  }

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 fill-current text-orange-400" /> Join BrainForge26
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mt-4 tracking-tight">
            Build The Future Of{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              Enterprise Tech
            </span>
          </h1>
          <p className="mt-4 text-slate-300 text-lg leading-relaxed">
            We are hiring talented full-stack engineers, AI researchers, and DevOps specialists to solve complex technical challenges.
          </p>
        </div>

        {/* Job Listings Client Component with Application Modal */}
        <CareersClientList jobs={jobs} />
      </div>
    </div>
  );
}
