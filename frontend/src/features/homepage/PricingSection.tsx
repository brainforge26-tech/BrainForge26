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
    color:   '#C02C54',
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
    color:   '#A61C43',
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
    color:   '#851636',
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

export function PricingSection({ plans }: { plans?: any[] }) {
  const displayPlans = plans && plans.length > 0 ? plans : PLANS;
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="pricing" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#09090B]/60 pointer-events-none" />
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
          {displayPlans.map(({ name, price, billingCycle, period, description, desc, color, features, popular, isPopular }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-[24px] border transition-all duration-300 hover:-translate-y-1 ${
                (isPopular ?? popular)
                  ? 'border-[rgba(166,28,67,0.3)] bg-gradient-to-b from-[rgba(166,28,67,0.06)] to-[rgba(166,28,67,0.01)] shadow-[0_0_24px_rgba(166,28,67,0.1)] hover:shadow-[0_12px_36px_rgba(166,28,67,.2)]'
                  : 'border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,25,0.85)] backdrop-blur-xl hover:border-[#A61C43] hover:shadow-[0_12px_36px_rgba(166,28,67,.15)]'
              }`}>

              {(isPopular ?? popular) && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#A61C43] to-[#851636] text-white text-xs font-bold shadow-[0_4px_12px_rgba(166,28,67,0.2)]">
                    <Zap className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: color || '#C02C54' }}>{name}</p>
                <div className="mt-4 mb-2 flex items-end gap-1">
                  {price === 'Custom' || price === 0 ? (
                    <span className="text-4xl font-extrabold text-white">Custom</span>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-[#AAB3C5] -mb-1">$</span>
                      <span className="text-4xl font-extrabold text-white">{price}</span>
                    </>
                  )}
                  {(billingCycle || period) && <span className="text-sm text-[#7A8499] mb-1">/{billingCycle || period}</span>}
                </div>
                <p className="text-sm text-[#7A8499] mb-6">{description || desc}</p>

                <ul className="space-y-3 flex-1">
                  {features && features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#AAB3C5]">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: color || '#C02C54' }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={ROUTES.register}
                  className={`group mt-8 flex items-center justify-center gap-2 h-11 rounded-full font-semibold text-sm transition-all duration-200 ${
                    (isPopular ?? popular)
                      ? 'bg-gradient-to-r from-[#A61C43] to-[#851636] text-white shadow-[0_6px_20px_rgba(166,28,67,0.2)] hover:shadow-[0_8px_25px_rgba(166,28,67,0.3)] hover:-translate-y-0.5'
                      : 'bg-white/[0.06] text-white border border-white/[0.10] hover:bg-white/[0.10] hover:-translate-y-0.5'
                  }`}>
                  {price === 'Custom' || price === 0 ? 'Contact Us' : 'Get Started'} <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
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
