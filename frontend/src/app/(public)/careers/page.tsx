import { publicFetch } from '@/lib/api';
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { FormattedText } from '@/components/ui/FormattedText';

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

        {/* Job Listings */}
        {jobs.length === 0 ? (
          <div className="text-center py-16 bg-[#0B1224] border border-white/[0.08] rounded-3xl">
            <p className="text-slate-400 font-medium">There are currently no active job postings. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {jobs.map((job: any) => (
              <div
                key={job.id}
                className="rounded-3xl bg-[#0B1224] border border-white/[0.08] hover:border-orange-500/40 p-8 backdrop-blur-xl transition-all shadow-xl space-y-6"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        {job.department}
                      </span>
                      <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-white/[0.05] text-slate-300">
                        {job.type}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">{job.title}</h3>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        {job.location}
                      </span>
                      {job.experience && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-orange-400" />
                          {job.experience}
                        </span>
                      )}
                      {job.salaryRange && (
                        <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                          <DollarSign className="w-4 h-4" />
                          {job.salaryRange}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/contact?job=${encodeURIComponent(job.title)}`}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs transition-all shadow-lg shrink-0 flex items-center gap-2"
                  >
                    <span>Apply For Role</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* EXACT FORMATTED RICH TEXT JOB DESCRIPTION */}
                {job.description && (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-orange-400 mb-3">
                      Role Overview & Scope
                    </h4>
                    <FormattedText content={job.description} />
                  </div>
                )}

                {/* Requirements Array/Text */}
                {job.requirements && job.requirements.length > 0 && (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-orange-400 mb-3">
                      Key Requirements & Qualifications
                    </h4>
                    {Array.isArray(job.requirements) ? (
                      <div className="space-y-2">
                        {job.requirements.map((req: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-300 font-medium">{req}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <FormattedText content={job.requirements} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
