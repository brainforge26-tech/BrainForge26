import Link from 'next/link';
import { ShieldCheck, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const FOOTER_LINKS = {
  Company: [
    { label: 'About Us',     href: '/about' },
    { label: 'Services',     href: '/services' },
    { label: 'Portfolio',    href: '/portfolio' },
    { label: 'Our Team',     href: '/team' },
  ],
  Solutions: [
    { label: 'Web Systems',  href: '/services' },
    { label: 'AI & Data',    href: '/services' },
    { label: 'Mobile Apps',  href: '/services' },
    { label: 'Careers',      href: '/careers' },
  ],
  QuickLinks: [
    { label: 'Blogs',        href: '/blogs' },
    { label: 'Contact Us',   href: '/contact' },
    { label: 'Admin Login',  href: '/login' },
  ],
};

const SOCIALS = [
  { icon: Github,   href: 'https://github.com/brainforge26',   label: 'GitHub' },
  { icon: Twitter,  href: 'https://twitter.com/brainforge26',  label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/brainforge26', label: 'LinkedIn' },
  { icon: Mail,     href: 'mailto:contact@brainforge26.tech', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-[#050608] pt-16 pb-8 overflow-hidden text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Brain<span className="text-orange-400">Forge26</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              BrainForge26 is an AI-fueled corporate software engineering agency building scalable web platforms, AI solutions, and enterprise systems.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.1] text-slate-400 hover:text-white hover:bg-orange-500/20 hover:border-orange-500/40 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-4">
                {group}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} BrainForge26 Tech. All rights reserved. Managed by Admin.
          </p>
          <div className="flex gap-6">
            <Link href="/login" className="text-xs text-slate-400 hover:text-orange-400 transition-colors">
              Admin Portal Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
