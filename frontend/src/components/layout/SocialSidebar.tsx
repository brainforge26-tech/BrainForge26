'use client';

import * as React from 'react';
import { Github, Twitter, Linkedin, Facebook, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const SOCIAL_ITEMS = [
  { label: 'GitHub', icon: Github, href: 'https://github.com/brainforge26' },
  { label: 'Twitter', icon: Twitter, href: 'https://twitter.com/brainforge26' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/brainforge26' },
  { label: 'Facebook', icon: Facebook, href: 'https://facebook.com/brainforge26' },
  { label: 'Email Us', icon: Mail, href: 'mailto:contact@brainforge26.tech' },
];

export function SocialSidebar() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col items-center gap-3.5 z-40 pointer-events-auto"
    >
      {/* Top Ambient Glow Line */}
      <div className="w-[1.5px] h-16 bg-gradient-to-b from-transparent via-orange-500/50 to-orange-400 shadow-[0_0_10px_#FF4D00]" />

      {/* Social Icons Container */}
      <div className="p-2 rounded-full bg-[#08090E]/90 border border-white/[0.12] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col gap-3">
        {SOCIAL_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              title={item.label}
              className="relative group flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:border-orange-500/50 hover:bg-gradient-to-br hover:from-orange-500 hover:to-amber-500 transition-all duration-300 shadow-md hover:scale-110"
            >
              <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />

              {/* Tooltip on hover */}
              <span className="absolute left-14 px-3 py-1 rounded-xl bg-[#0C0E18] border border-orange-500/30 text-orange-300 font-bold text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none shadow-xl">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>

      {/* Bottom Ambient Glow Line */}
      <div className="w-[1.5px] h-16 bg-gradient-to-t from-transparent via-orange-500/50 to-orange-400 shadow-[0_0_10px_#FF4D00]" />
    </motion.aside>
  );
}
