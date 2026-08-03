import { ShieldCheck, Award, Users, Cpu, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | BrainForge26',
  description: 'Learn about BrainForge26, an elite corporate software company building next-gen web, AI, and cloud solutions.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 fill-current text-orange-400" /> Corporate Profile
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mt-4 tracking-tight">
            Engineering Excellence For <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Global Enterprises</span>
          </h1>
          <p className="mt-4 text-slate-300 text-lg leading-relaxed">
            BrainForge26 is an AI-fueled corporate software agency delivering custom web systems, AI models, mobile apps, and enterprise engineering solutions.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-3xl bg-[#0B1224] border border-white/[0.08] backdrop-blur-xl hover:border-orange-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To empower global businesses with robust, high-performance software and artificial intelligence systems that drive sustainable digital growth.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0B1224] border border-white/[0.08] backdrop-blur-xl hover:border-orange-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Technical Quality</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We uphold strict code review guidelines, automated static security analysis, unit testing, and SOC2 compliant cloud infrastructure.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0B1224] border border-white/[0.08] backdrop-blur-xl hover:border-orange-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Elite Talent Pool</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our engineering team comprises hand-picked senior software developers, solution architects, and machine learning researchers.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-12 rounded-3xl bg-[#0B1224] border border-orange-500/30 shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready To Start Your Project?</h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm">
            Get in touch with our solutions team to discuss your business requirements and technical roadmap.
          </p>
          <Link href="/contact" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-extrabold text-xs shadow-lg hover:brightness-110 transition-all inline-block">
            Contact Engineering Team
          </Link>
        </div>

      </div>
    </div>
  );
}
