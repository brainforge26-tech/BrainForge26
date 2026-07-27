'use client';

import { Github, Twitter, Linkedin, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

export function SocialSidebar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
      className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-40"
    >
      <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/[0.1] mx-auto mb-2" />
      <SocialIcon href="https://github.com" icon={Github} />
      <SocialIcon href="https://twitter.com" icon={Twitter} />
      <SocialIcon href="https://linkedin.com" icon={Linkedin} />
      <SocialIcon href="https://facebook.com" icon={Facebook} />
      <div className="w-px h-16 bg-gradient-to-t from-transparent to-white/[0.1] mx-auto mt-2" />
    </motion.div>
  );
}

function SocialIcon({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#B4B7C5] hover:text-[#C02C54] hover:border-[rgba(166,28,67,0.2)] hover:bg-[rgba(166,28,67,0.04)] hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(166,28,67,0.12)] transition-all duration-300"
    >
      <Icon className="w-[18px] h-[18px]" />
    </a>
  );
}
