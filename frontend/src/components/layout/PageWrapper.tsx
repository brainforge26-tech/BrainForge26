'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  /** Adds the standard section max-width + horizontal padding */
  contained?: boolean;
  /** Animate children in on mount */
  animate?: boolean;
}

const pageVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export function PageWrapper({
  children,
  className,
  contained = false,
  animate = true,
}: PageWrapperProps) {
  const inner = (
    <div
      className={cn(
        'min-h-screen',
        contained && 'section-wrapper',
        className,
      )}
    >
      {children}
    </div>
  );

  if (!animate) return inner;

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className={cn('min-h-screen', contained && 'section-wrapper', className)}
    >
      {children}
    </motion.div>
  );
}

// ─── Dashboard layout (Sidebar + main content area) ──────────────────────────
interface DashboardWrapperProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DashboardWrapper({ sidebar, children, className }: DashboardWrapperProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#050816]">
      {sidebar}
      <main
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden',
          'bg-[#050816]',
          className,
        )}
      >
        {/* subtle grid overlay */}
        <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="relative z-10 p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
