'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Menu,
  X,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  Search,
  Globe,
  Smartphone,
  Code2,
  Cpu,
  Cloud,
  FolderKanban,
  Users,
  Briefcase,
  BookOpen,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import apiClient from '@/lib/axios';

const SERVICES_DROPDOWN = [
  { title: 'Website Development', desc: 'Corporate, Web Apps & Portals', href: '/services', icon: Globe },
  { title: 'Mobile App Development', desc: 'iOS, Android, Flutter & PWA', href: '/services', icon: Smartphone },
  { title: 'Custom Software & ERP', desc: 'ERP, CRM, POS & Enterprise Tech', href: '/services', icon: Code2 },
  { title: 'AI & Automation', desc: 'LLMs, AI Agents & Automation', href: '/services', icon: Cpu },
  { title: 'Cloud & DevOps', desc: 'AWS, Azure, Docker & CI/CD', href: '/services', icon: Cloud },
];

const PAGES_DROPDOWN = [
  { title: 'About Us', desc: 'Learn about BrainForge26', href: '/about', icon: Info },
  { title: 'Our Projects', desc: 'Client case studies & metrics', href: '/portfolio', icon: FolderKanban },
  { title: 'Our Team', desc: 'Meet our software engineers', href: '/team', icon: Users },
  { title: 'Careers', desc: 'Join our engineering team', href: '/careers', icon: Briefcase },
  { title: 'Blog & Articles', desc: 'Tech insights & industry news', href: '/blogs', icon: BookOpen },
];

export function Navbar({ user }: { user?: { role: string } | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<'services' | 'pages' | null>(null);
  
  // Search Modal state
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = React.useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  React.useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setLoadingSearch(true);
      const { data } = await apiClient.get('/services/public');
      const filtered = (data.data || []).filter((s: any) =>
        s.title.toLowerCase().includes(val.toLowerCase()) ||
        s.overview?.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
    } catch {
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all duration-300 pointer-events-none"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <div
            className={cn(
              'flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-300 relative',
              scrolled
                ? 'bg-[#08090E]/90 border-white/[0.15] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)]'
                : 'bg-[#08090E]/75 border-white/[0.1] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
            )}
          >
            {/* ── Logo ──────────────────────────────────────────────────────── */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-cyan-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-all">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white tracking-tight leading-none">
                  Brain<span className="text-orange-400">Forge26</span>
                </span>
                <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
                  Enterprise Software
                </span>
              </div>
            </Link>

            {/* ── Desktop Navigation Links & Dropdowns ──────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200',
                  pathname === '/'
                    ? 'text-white bg-white/[0.12] font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                )}
              >
                Home
              </Link>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('services')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => router.push('/services')}
                  className={cn(
                    'px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200',
                    pathname.startsWith('/services')
                      ? 'text-white bg-white/[0.12] font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  )}
                >
                  <span>Services</span>
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', activeDropdown === 'services' && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'services' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-80 rounded-3xl bg-[#0B0D16]/95 border border-white/[0.12] p-3 shadow-2xl backdrop-blur-2xl space-y-1 z-50"
                    >
                      {SERVICES_DROPDOWN.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/[0.06] transition-colors group"
                        >
                          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:scale-110 transition-transform">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block group-hover:text-orange-400 transition-colors">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-slate-400 leading-tight block">
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      ))}
                      <div className="pt-2 border-t border-white/[0.08]">
                        <Link
                          href="/services"
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-300 font-bold text-xs flex items-center justify-between hover:bg-orange-500/30 transition-all"
                        >
                          <span>Explore All 180+ Services</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pages / Company Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('pages')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={cn(
                    'px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200',
                    activeDropdown === 'pages'
                      ? 'text-white bg-white/[0.12] font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  )}
                >
                  <span>Pages</span>
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', activeDropdown === 'pages' && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'pages' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-72 rounded-3xl bg-[#0B0D16]/95 border border-white/[0.12] p-3 shadow-2xl backdrop-blur-2xl space-y-1 z-50"
                    >
                      {PAGES_DROPDOWN.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/[0.06] transition-colors group"
                        >
                          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block group-hover:text-cyan-400 transition-colors">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-slate-400 leading-tight block">
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/contact"
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200',
                  pathname === '/contact'
                    ? 'text-white bg-white/[0.12] font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                )}
              >
                Contacts
              </Link>
            </nav>

            {/* ── Right Actions: Search Icon + CTA Button ──────────────────────── */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {/* Search Icon Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-300 hover:text-white transition-colors"
                title="Search services"
              >
                <Search className="w-4 h-4" />
              </button>

              {user?.role === 'ADMIN' ? (
                <Link
                  href="/admin"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                >
                  Admin Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-xs shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all hover:scale-105 flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* ── Mobile Hamburger ────────────────────────────────────────────── */}
            <button
              className="lg:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.1] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Dropdown Menu ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <motion.div
          className="fixed inset-0 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-[#06070A]/95 backdrop-blur-2xl"
            onClick={() => setMobileOpen(false)}
          />

          <motion.div
            className="absolute top-24 left-4 right-4 bg-[#0B0D14]/95 border border-white/[0.12] rounded-3xl p-6 flex flex-col gap-3 shadow-2xl max-h-[80vh] overflow-y-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-2xl text-sm font-semibold text-white hover:bg-white/[0.06]">
              Home
            </Link>
            <Link href="/services" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-2xl text-sm font-semibold text-white hover:bg-white/[0.06]">
              Services
            </Link>
            <Link href="/portfolio" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-2xl text-sm font-semibold text-white hover:bg-white/[0.06]">
              Our Projects
            </Link>
            <Link href="/team" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-2xl text-sm font-semibold text-white hover:bg-white/[0.06]">
              Our Team
            </Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-2xl text-sm font-semibold text-white hover:bg-white/[0.06]">
              About Us
            </Link>
            <Link href="/blogs" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-2xl text-sm font-semibold text-white hover:bg-white/[0.06]">
              Blog
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-2xl text-sm font-semibold text-white hover:bg-white/[0.06]">
              Contacts
            </Link>
            <hr className="border-white/[0.1] my-2" />
            <Link href="/contact" onClick={() => setMobileOpen(false)}>
              <button className="w-full py-3.5 rounded-2xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm shadow-xl flex items-center justify-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </motion.div>
      )}

      {/* ── Search Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#0E1322] border border-white/[0.15] rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-5 h-5 text-orange-400" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search services, technologies, or case studies..."
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-slate-400 text-base focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Results */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {query.trim() === '' ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    Type to search 180+ software services (e.g. ERP, React, bKash, AI)...
                  </p>
                ) : searchResults.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No matching services found for "{query}".
                  </p>
                ) : (
                  searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/contact?service=${encodeURIComponent(item.title)}`}
                      onClick={() => setSearchOpen(false)}
                      className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-between group transition-colors block"
                    >
                      <div>
                        <span className="font-bold text-white text-sm group-hover:text-orange-400 transition-colors block">
                          {item.title}
                        </span>
                        <span className="text-xs text-slate-400 line-clamp-1">
                          {item.overview}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-400 transition-colors shrink-0" />
                    </Link>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
