'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Globe, Smartphone, Cpu, Palette, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  Cpu,
  Palette,
};

function getIcon(name: string | null | undefined): React.ElementType {
  return name && ICON_MAP[name] ? ICON_MAP[name] : Globe;
}

export type Service = {
  id: string;
  icon: string | null;
  title: string;
  features: string[];
};

interface ServicesSectionProps {
  initialServices?: Service[];
}

export function ServicesSection({ initialServices = [] }: ServicesSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [services, setServices] = useState<Service[]>(initialServices);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (initialServices.length > 0) {
      setServices(initialServices);
      return;
    }
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';
    fetch(`${BASE}/homepage/services`, { cache: 'no-store' })
      .then(r => r.json())
      .then(json => {
        const list: Service[] = json?.data ?? [];
        setServices(list);
      })
      .catch(() => setServices([]));
  }, [initialServices]);

  const total = services.length;

  function prev() { if (total > 0) setCurrent(c => (c - 1 + total) % total); }
  function next() { if (total > 0) setCurrent(c => (c + 1) % total); }

  useEffect(() => {
    if (total === 0) return;
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % total);
    }, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [total, isPaused]);

  if (total === 0) {
    return null;
  }

  return (
    <section id="services" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#111114]/40 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#A61C43] opacity-[0.015] rounded-full blur-[100px] pointer-events-none" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="section-label justify-center mb-3">OUR EXPERTISE</div>
          <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-extrabold tracking-tight">
            Our <span className="gradient-text">Specialized Services</span>
          </h2>
          <p className="mt-4 text-[#AAB3C5] max-w-xl mx-auto text-balance">
            From idea to launch, we cover every layer of the stack and every phase of the product lifecycle.
          </p>
        </motion.div>

        <div
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {services.map(({ id, icon, title, features }, i) => {
            const Icon = getIcon(icon);
            const isActive = i === current % services.length;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return (
              <Link key={id} href={`/services/${slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                  onClick={() => setCurrent(i)}
                  className={`group rounded-[24px] backdrop-blur-xl p-7 flex flex-col gap-4 cursor-pointer transition-all duration-500 relative overflow-hidden border ${
                    isActive
                      ? 'border-[#A61C43] shadow-[0_12px_36px_rgba(166,28,67,.15)] -translate-y-2 bg-[rgba(166,28,67,0.03)]'
                      : 'border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,25,0.85)] hover:border-[#A61C43] hover:shadow-[0_12px_36px_rgba(166,28,67,.10)] hover:-translate-y-1'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(166,28,67,0.02)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[rgba(166,28,67,0.08)] border border-[rgba(166,28,67,0.18)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <Icon className="w-6 h-6 text-[#C02C54]" />
                  </div>
                  <h3 className="font-bold text-white text-lg relative z-10">{title}</h3>
                  <ul className="space-y-2 flex-1 relative z-10">
                    {features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#AAB3C5]">
                        <CheckCircle2 className="w-4 h-4 text-[#C02C54] shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#C02C54] opacity-0 group-hover:opacity-100 transition-all duration-200 relative z-10">
                    See Details <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Mobile carousel */}
        <div
          className="md:hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="rounded-[24px] bg-[rgba(20,20,25,0.85)] backdrop-blur-xl border border-[rgba(166,28,67,0.18)] p-7 flex flex-col gap-4"
          >
            {(() => {
              const item = services[current];
              if (!item) return null;
              const { icon, title, features } = item;
              const Icon = getIcon(icon);
              const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <Link href={`/services/${slug}`}>
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[rgba(166,28,67,0.08)] border border-[rgba(166,28,67,0.18)] mb-3">
                    <Icon className="w-6 h-6 text-[#C02C54]" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{title}</h3>
                  <ul className="space-y-2 mb-4">
                    {features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#AAB3C5]">
                        <CheckCircle2 className="w-4 h-4 text-[#C02C54] shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#C02C54]">
                    See Details <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })()}
          </motion.div>

          <div className="flex items-center justify-between mt-5 px-1">
            <button onClick={() => { prev(); setIsPaused(false); }} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/[0.08] text-[#AAB3C5] hover:text-white hover:border-[#A61C43] transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2 items-center">
              {services.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setIsPaused(false); }}
                  className="relative overflow-hidden rounded-full transition-all duration-300"
                  style={{ width: i === current ? 28 : 8, height: 8 }}
                >
                  <span className={`absolute inset-0 rounded-full ${i === current ? 'bg-white/20' : 'bg-white/[0.2]'}`} />
                  {i === current && (
                    <motion.span
                      key={`${current}-progress`}
                      className="absolute inset-0 rounded-full bg-[#A61C43] origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isPaused ? undefined : 1 }}
                      transition={{ duration: 3, ease: 'linear' }}
                      style={{ transformOrigin: 'left' }}
                    />
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => { next(); setIsPaused(false); }} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/[0.08] text-[#AAB3C5] hover:text-white hover:border-[#A61C43] transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
