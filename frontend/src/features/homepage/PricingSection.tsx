'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

const PLANS = [
  {
    name:    'Starter',
    price:   '2,500',
    period:  'project',
    desc:    'Perfect for small websites and landing pages.',
    color:   '#4F7DFF',
    features: [
      'Up to 5 pages',
      'Responsive design',
      'Basic SEO setup',
      '1 round of revisions',
      '30-day support',
    ],
    popular: false,
  },
  {
    name:    'Professional',
    price:   '7,500',
    period:  'project',
    desc:    'Full-featured web application for growing businesses.',
    color:   '#7C5CFF',
    features: [
      'Custom web application',
      'Authentication & roles',
      'Database design',
      'REST API backend',
      '3 rounds of revisions',
      '90-day support',
      'Deployment included',
    ],
    popular: true,
  },
  {
    name:    'Enterprise',
    price:   'Custom',
    period:  '',
    desc:    'Tailored solutions for large-scale enterprise needs.',
    color:   '#00D4FF',
    features: [
      'Everything in Professional',
      'Dedicated developer team',
      'Custom integrations',
      'Scalable infrastructure',
      'SLA guarantee',
      '1-year support',
      'Priority response',
    ],
    popular: false,
  },
];

export function PricingSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="pricing" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#050816]/60 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-hero-gradient opacity-50 pointer-events-none" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="section-label justify-center mb-3">Pricing</div>
          <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-extrabold tracking-tight">
            Transparent <span className="gradient-text">Pricing Plans</span>
          </h2>
          <p className="mt-4 text-[#AAB3C5] max-w-xl mx-auto text-balance">
            No hidden fees. Fixed-price projects with clear deliverables and milestones.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map(({ name, price, period, desc, color, features, popular }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-[24px] border transition-all duration-300 hover:-translate-y-1 ${
                popular
                  ? 'border-[rgba(124,92,255,0.5)] bg-gradient-to-b from-[rgba(124,92,255,0.08)] to-[rgba(124,92,255,0.02)] shadow-[0_0_40px_rgba(124,92,255,0.15)]'
                  : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15]'
              }`}>

              {popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#4F7DFF] text-white text-xs font-bold">
                    <Zap className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                <p className="text-sm font-semibold uppercase tracking-widest" style={{ color }}>{name}</p>
                <div className="mt-4 mb-2 flex items-end gap-1">
                  {price === 'Custom' ? (
                    <span className="text-4xl font-extrabold text-white">Custom</span>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-[#AAB3C5] -mb-1">$</span>
                      <span className="text-4xl font-extrabold text-white">{price}</span>
                    </>
                  )}
                  {period && <span className="text-sm text-[#7A8499] mb-1">/{period}</span>}
                </div>
                <p className="text-sm text-[#7A8499] mb-6">{desc}</p>

                <ul className="space-y-3 flex-1">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#AAB3C5]">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={ROUTES.register}
                  className={`mt-8 flex items-center justify-center gap-2 h-11 rounded-full font-semibold text-sm transition-all duration-200 ${
                    popular
                      ? 'bg-gradient-to-r from-[#7C5CFF] to-[#4F7DFF] text-white shadow-[0_4px_20px_rgba(124,92,255,0.35)] hover:shadow-[0_8px_30px_rgba(124,92,255,0.5)] hover:-translate-y-0.5'
                      : 'bg-white/[0.06] text-white border border-white/[0.10] hover:bg-white/[0.10] hover:-translate-y-0.5'
                  }`}>
                  {price === 'Custom' ? 'Contact Us' : 'Get Started'} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-[#7A8499] mt-8">
          All prices in USD. Custom enterprise plans available on request.
        </motion.p>
      </div>
    </section>
  );
}
