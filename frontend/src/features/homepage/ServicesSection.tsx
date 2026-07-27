'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
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

type Service = {
  id: string;
  icon: string | null;
  title: string;
  features: string[];
};

// Fallback static services to show while loading or if DB is empty
const FALLBACK: Service[] = [
  {
    id: '1', icon: 'Globe', title: 'Website',
    features: ['Customized Design', 'SEO/GEO Optimized', 'Google Analytics', 'Performance Optimized', 'Scalable Architecture', 'AI Agent Integration', 'Payment Integration', 'Secure Systems', 'Responsive Design'],
  },
  {
    id: '2', icon: 'Smartphone', title: 'Mobile App',
    features: ['Real-Time Features', 'Scalable Architecture', 'API Integration', 'Offline Support', 'Smooth Performance', 'Multi-Platform Support', 'App Testing', 'Secure Authentication', 'Store Deployment'],
  },
  {
    id: '3', icon: 'Cpu', title: 'AI/ML',
    features: ['AI Strategy', 'ML Models', 'NLP Systems', 'AI Agents', 'Process Automation', 'Data Pipelines', 'Predictive Analytics', 'Model Optimization', 'MLOps Deployment'],
  },
  {
    id: '4', icon: 'Palette', title: 'UI/UX Design',
    features: ['User Research', 'Journey Mapping', 'Information Architecture', 'Wireframe Design', 'Interactive Prototypes', 'Visual Interface', 'Design Usability', 'Testing', 'Conversion Optimization'],
  },
];

export function ServicesSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [services, setServices] = useState<Service[]>([]);
  const [current, setCurrent]  = useState(0);
  const [loading, setLoading]      = useState(true);
  const [isPaused, setIsPaused]    = useState(false);
  const timerRef                   = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';
    fetch(`${BASE}/services?active=true`, { cache: 'no-store' })
      .then(r => r.json())
      .then(json => {
        const list: Service[] = json?.data?.services ?? [];
        setServices(list.length > 0 ? list : FALLBACK);
      })
      .catch(() => setServices(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const displayed = loading ? FALLBACK : services;
  const total     = displayed.length;

  function prev() { setCurrent(c => (c - 1 + total) % total); }
  function next() { setCurrent(c => (c + 1) % total); }

  // Auto-scroll: advance every 3 seconds unless paused
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

  return (
    <section id="services" ref={ref} className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[#111114]/40 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#A61C43] opacity-[0.015] rounded-full blur-[100px] pointer-events-none" />

      <div className="section-wrapper relative z-10">
        {/* Header */}
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
            From idea to launch, we cover every layer of the stack and every
            phase of the product lifecycle.
          </p>
        </motion.div>

        {/* Desktop grid — active card highlighted */}
        <div
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {displayed.map(({ id, icon, title, features }, i) => {
            const Icon    = getIcon(icon);
            const isActive = i === current % displayed.length;
            return (
              <motion.div
                key={id}
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
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[rgba(166,28,67,0.08)] border border-[rgba(166,28,67,0.18)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <Icon className="w-6 h-6 text-[#C02C54]" />
                </div>
                {/* Title */}
                <h3 className="font-bold text-white text-lg relative z-10">{title}</h3>
                {/* Features */}
                <ul className="space-y-2 flex-1 relative z-10">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#AAB3C5]">
                      <CheckCircle2 className="w-4 h-4 text-[#C02C54] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {/* See Details */}
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#C02C54] opacity-0 group-hover:opacity-100 transition-all duration-200 relative z-10">
                  See Details <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile carousel — auto-scroll */}
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
              const { icon, title, features } = displayed[current];
              const Icon = getIcon(icon);
              return (
                <>
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[rgba(166,28,67,0.08)] border border-[rgba(166,28,67,0.18)]">
                    <Icon className="w-6 h-6 text-[#C02C54]" />
                  </div>
                  <h3 className="font-bold text-white text-lg">{title}</h3>
                  <ul className="space-y-2">
                    {features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[#AAB3C5]">
                        <CheckCircle2 className="w-4 h-4 text-[#C02C54] shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#C02C54]">
                    See Details <ArrowRight className="w-4 h-4" />
                  </div>
                </>
              );
            })()}
          </motion.div>

          {/* Carousel controls */}
          <div className="flex items-center justify-between mt-5 px-1">
            <button onClick={() => { prev(); setIsPaused(false); }} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/[0.08] text-[#AAB3C5] hover:text-white hover:border-[#A61C43] transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2 items-center">
              {displayed.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setIsPaused(false); }}
                  className="relative overflow-hidden rounded-full transition-all duration-300"
                  style={{ width: i === current ? 28 : 8, height: 8 }}
                >
                  {/* Track */}
                  <span className={`absolute inset-0 rounded-full ${i === current ? 'bg-white/20' : 'bg-white/[0.2]'}`} />
                  {/* Fill — animates from 0 to 100% over 3s when active */}
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
