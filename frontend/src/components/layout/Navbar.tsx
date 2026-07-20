'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'Services',   href: '/#services' },
  { label: 'Projects',   href: '/#projects' },
  { label: 'Pricing',    href: '/#pricing' },
  { label: 'Team',       href: '/#team' },
  { label: 'Contact',    href: '/#contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[rgba(5,8,22,0.85)] backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-transparent',
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="section-wrapper">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* ── Logo ──────────────────────────────────────────────────────── */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F7DFF] to-[#7C5CFF] shadow-[0_0_16px_rgba(79,125,255,0.4)] group-hover:shadow-[0_0_24px_rgba(79,125,255,0.6)] transition-shadow">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Brain<span className="gradient-text-blue">Force</span>IT
              </span>
            </Link>

            {/* ── Desktop nav links ──────────────────────────────────────────── */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'text-white bg-white/[0.08]'
                      : 'text-[#AAB3C5] hover:text-white hover:bg-white/[0.05]',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Desktop CTA ────────────────────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* ── Mobile hamburger ───────────────────────────────────────────── */}
            <button
              className="md:hidden p-2 rounded-lg text-[#AAB3C5] hover:text-white hover:bg-white/[0.06] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu ─────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#050816]/90 backdrop-blur-lg"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="absolute top-16 left-0 right-0 bg-[#0B1224]/95 backdrop-blur-xl border-b border-white/[0.08] p-6 flex flex-col gap-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-3 rounded-xl text-base font-medium transition-all',
                  pathname === link.href
                    ? 'text-white bg-[rgba(79,125,255,0.12)] border border-[rgba(79,125,255,0.2)]'
                    : 'text-[#AAB3C5] hover:text-white hover:bg-white/[0.05]',
                )}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-white/[0.08] my-1" />
            <Link href="/login">
              <Button variant="secondary" size="md" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="md" className="w-full">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
