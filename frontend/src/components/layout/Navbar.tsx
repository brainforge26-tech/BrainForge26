'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'Services',   href: '/#services' },
  { label: 'Projects',   href: '/projects' },
  { label: 'Pricing',    href: '/#pricing' },
  { label: 'Team',       href: '/#team' },
  { label: 'Contact',    href: '/#contact' },
];

export function Navbar({ user }: { user?: { role: string } | null }) {
  const pathname   = usePathname();
  const router     = useRouter();
  const [scrolled, setScrolled]   = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Smooth-scroll handler for hash links
  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const hash = href.includes('#') ? href.split('#')[1] : null;
    if (!hash) return;

    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Navigate to homepage then scroll after load
      e.preventDefault();
      router.push(href);
    }
  }


  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[rgba(9,9,11,0.85)] backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
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
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#A61C43] to-[#851636] shadow-[0_0_12px_rgba(166,28,67,0.15)] group-hover:shadow-[0_0_18px_rgba(166,28,67,0.25)] transition-shadow">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Brain<span className="text-[#C02C54]">Forge</span>
              </span>
            </Link>

            {/* ── Desktop nav links ──────────────────────────────────────────── */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
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
              {user ? (
                <Link href={`/${user.role.toLowerCase()}`}>
                  <Button variant="primary" size="sm" className="rounded-[10px] px-5 py-2.5 font-bold">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="rounded-[10px] px-4 py-2.5 font-bold">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm" className="rounded-[10px] px-5 py-2.5 font-bold">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
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
            className="absolute inset-0 bg-[#09090B]/90 backdrop-blur-lg"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="absolute top-16 left-0 right-0 bg-[#111114]/95 backdrop-blur-xl border-b border-white/[0.08] p-6 flex flex-col gap-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => { handleNavClick(e, link.href); setMobileOpen(false); }}
                className={cn(
                  'px-4 py-3 rounded-xl text-base font-medium transition-all',
                  pathname === link.href
                    ? 'text-white bg-[rgba(166,28,67,0.12)] border border-[rgba(166,28,67,0.2)]'
                    : 'text-[#AAB3C5] hover:text-white hover:bg-white/[0.05]',
                )}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-white/[0.08] my-1" />
            {user ? (
              <Link href={`/${user.role.toLowerCase()}`}>
                <Button variant="primary" size="md" className="w-full rounded-[10px] py-3 font-bold">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary" size="md" className="w-full rounded-[10px] py-3 font-bold">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="md" className="w-full rounded-[10px] py-3 font-bold">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
