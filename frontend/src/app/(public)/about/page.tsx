import { ShieldCheck, Award, Users, Cpu, Target, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | BrainForge26',
  description: 'Learn about BrainForge26, an elite corporate software company building next-gen web, AI, and cloud solutions.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060910] text-slate-100 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-cyan-400 border border-blue-500/20 uppercase tracking-widest">
            Corporate Profile
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mt-4 tracking-tight">
            Engineering Excellence For <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">Global Enterprises</span>
          </h1>
          <p className="mt-4 text-slate-400 text-lg leading-relaxed">
            BrainForge26 is a full-service corporate software agency similar to Brain Station 23, delivering custom web systems, AI models, mobile apps, and dedicated talent.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              To empower global businesses with robust, high-performance software and artificial intelligence systems that drive sustainable digital growth.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Technical Quality</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We uphold strict code review guidelines, automated static security analysis, unit testing, and SOC2 compliant cloud infrastructure.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Elite Talent Pool</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our engineering team comprises hand-picked senior software developers, solution architects, and machine learning researchers.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-12 rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950 border border-blue-500/30">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready To Start Your Project?</h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 text-base">
            Get in touch with our solutions team to discuss your business requirements and technical roadmap.
          </p>
          <Link href="/contact" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg hover:brightness-110 transition-all inline-block">
            Contact Engineering Team
          </Link>
        </div>

      </div>
    </div>
  );
}
