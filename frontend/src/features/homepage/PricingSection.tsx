'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface PricingSectionProps {
  plans?: any[];
}

export function PricingSection({ plans = [] }: PricingSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  if (plans.length === 0) {
    return null;
  }

  return (
    <section id="pricing" ref={ref} className="relative py-24 overflow-hidden">
      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label justify-center mb-3">TRANSPARENT PRICING</div>
          <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-extrabold tracking-tight">
            Simple, Predictable <span className="gradient-text">Pricing</span>
          </h2>
          <p className="mt-4 text-[#AAB3C5] max-w-xl mx-auto text-balance">
            Choose the right investment for your product. No hidden fees, clear deliverables.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => {
            const isPopular = plan.isPopular;
            return (
              <motion.div
                key={plan.id || i}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`group rounded-[28px] backdrop-blur-xl p-8 flex flex-col justify-between relative transition-all duration-300 border ${
                  isPopular
                    ? 'border-[#A61C43] shadow-[0_16px_48px_rgba(166,28,67,.2)] bg-[rgba(166,28,67,0.04)] md:-translate-y-2'
                    : 'border-white/[0.08] bg-[rgba(20,20,25,0.85)] hover:border-[#A61C43]/40'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#A61C43] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-current" /> Most Popular
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-white text-xl mb-2">{plan.name}</h3>
                  <p className="text-sm text-[#AAB3C5] min-h-[40px] mb-6">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-white/[0.08]">
                    <span className="text-4xl font-extrabold text-white">
                      ${Number(plan.price).toLocaleString()}
                    </span>
                    {plan.billingCycle && (
                      <span className="text-sm text-[#AAB3C5]">/ {plan.billingCycle}</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {(plan.features || []).map((f: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[#AAB3C5]">
                        <CheckCircle2 className="w-4 h-4 text-[#C02C54] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/apply" className="w-full">
                  <button
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-[#A61C43] text-white hover:bg-[#851636] shadow-lg shadow-[#A61C43]/20'
                        : 'bg-white/[0.06] text-white hover:bg-white/[0.12] border border-white/[0.08]'
                    }`}
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
