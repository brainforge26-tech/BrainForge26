import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const FOOTER_LINKS = {
  Company:  [
    { label: 'About',    href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Team',     href: '/#team' },
  ],
  Services: [
    { label: 'Web Development',    href: '/#services' },
    { label: 'Mobile Apps',        href: '/#services' },
    { label: 'UI/UX Design',       href: '/#services' },
    { label: 'Cloud & DevOps',     href: '/#services' },
  ],
  Resources: [
    { label: 'Pricing',    href: '/#pricing' },
    { label: 'FAQ',        href: '/#faq' },
    { label: 'Contact',    href: '/#contact' },
    { label: 'Client Login', href: '/login' },
  ],
};

const SOCIALS = [
  { icon: Github,   href: 'https://github.com',   label: 'GitHub' },
  { icon: Twitter,  href: 'https://twitter.com',  label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Mail,     href: 'mailto:hello@brainforceit.com', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#050816] pt-16 pb-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#4F7DFF] opacity-[0.04] rounded-full blur-[80px] pointer-events-none" />

      <div className="section-wrapper relative z-10">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F7DFF] to-[#7C5CFF]">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Brain<span className="gradient-text-blue">Force</span>IT
              </span>
            </Link>
            <p className="text-sm text-[#7A8499] leading-relaxed max-w-[260px]">
              Premium IT agency delivering world-class software, talent, and project excellence.
            </p>
            {/* Socials */}
            <div className="flex gap-3 mt-6">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#7A8499] hover:text-white hover:bg-white/[0.09] hover:border-[rgba(79,125,255,0.3)] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#7A8499] mb-4">
                {group}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#AAB3C5] hover:text-white transition-colors"
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
          <p className="text-sm text-[#7A8499]">
            © {new Date().getFullYear()} BrainForceIT. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} href="#" className="text-xs text-[#7A8499] hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
