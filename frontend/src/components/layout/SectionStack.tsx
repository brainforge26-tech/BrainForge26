'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SectionStackProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  isHero?: boolean;
  disableSticky?: boolean;
}

export function SectionStack({ children, id, className = '', isHero = false, disableSticky = false }: SectionStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const y     = useTransform(scrollYProgress, [0, 1], [30, 0]);

  if (isHero) {
    return (
      <div id={id} className={`relative z-10 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} id={id} className={disableSticky ? "relative z-20 -mt-8" : "sticky top-0 z-20 -mt-8"}>
      <motion.div
        style={{ scale, y }}
        className={`relative rounded-t-[36px] bg-[#09090B] border-t border-white/[0.08] shadow-[0_-20px_50px_rgba(0,0,0,0.9)] overflow-hidden ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
