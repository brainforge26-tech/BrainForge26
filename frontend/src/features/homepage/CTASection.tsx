'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="relative py-28 overflow-hidden" id="contact">
      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-[28px] overflow-hidden"
        >
          {/* Gradient background card */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4F7DFF]/20 via-[#7C5CFF]/10 to-[#00D4FF]/10" />
          <div className="absolute inset-0 border border-[rgba(79,125,255,0.2)] rounded-[28px]" />
          <div className="absolute inset-0 bg-[#050816]/60 backdrop-blur-sm" />

          {/* Decorative orbs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#4F7DFF] rounded-full blur-[80px] opacity-20 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#7C5CFF] rounded-full blur-[80px] opacity-15 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 px-8 py-16 md:px-16 text-center">
            <div className="section-label justify-center mb-4">Get Started Today</div>

            <h2 className="text-[clamp(1.875rem,4vw,3.25rem)] font-extrabold tracking-tight max-w-2xl mx-auto text-balance">
              Ready to Build Something{' '}
              <span className="gradient-text">Extraordinary?</span>
            </h2>

            <p className="mt-5 text-lg text-[#AAB3C5] max-w-xl mx-auto text-balance">
              Tell us about your project and we&apos;ll get back to you within 24 hours
              with a detailed proposal.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Your Project
                </Button>
              </Link>
              <Button variant="secondary" size="lg" leftIcon={<Calendar className="w-4 h-4" />}>
                Book a Free Call
              </Button>
            </div>

            <p className="mt-6 text-sm text-[#7A8499]">
              No commitment required · Response within 24h · Free consultation
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
