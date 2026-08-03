'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function MouseCursor() {
  const [mounted, setMounted] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for fluid trailing effect
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  React.useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Check if mouse is hovering over an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.closest('a, button, input, select, textarea, [data-cursor="pointer"]') !== null;
        setIsHovered(isInteractive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!mounted || typeof window === 'undefined') return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      {/* ── Outer Transparent Ring ────────────────────────────────────────────── */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
        }}
        animate={{
          scale: isHovered ? 1.8 : 1,
          borderColor: isHovered ? 'rgba(249, 115, 22, 0.8)' : 'rgba(249, 115, 22, 0.4)',
          backgroundColor: isHovered ? 'rgba(249, 115, 22, 0.12)' : 'rgba(249, 115, 22, 0.04)',
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed top-0 left-0 -ml-5 -mt-5 w-10 h-10 rounded-full border border-orange-500/40 bg-orange-500/[0.04] backdrop-blur-[2px] shadow-[0_0_20px_rgba(249,115,22,0.25)] transition-colors duration-200"
      />

      {/* ── Inner Solid Glowing Dot ───────────────────────────────────────────── */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          scale: isHovered ? 0.6 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 shadow-[0_0_12px_#FF5500]"
      />
    </div>
  );
}
