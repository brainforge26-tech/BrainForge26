'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="relative py-28 overflow-hidden bg-[#06070a]" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-[#0B1224] border border-white/[0.12] p-8 md:p-16 text-center shadow-2xl"
        >
          {/* Decorative orange glowing auras */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-extrabold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 fill-current text-orange-400" />
              Get Started Today
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Ready to Build Something{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                Extraordinary?
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
              Tell us about your corporate project and we&apos;ll get back to you within 24 hours with a tailored engineering proposal.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-black text-sm shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all hover:scale-105 flex items-center gap-2">
                  <span>Start Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              No commitment required · Response within 24h · Free technical consultation
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
