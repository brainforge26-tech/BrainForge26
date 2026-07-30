'use client';

import React from 'react';

interface SectionStackProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  isHero?: boolean;
  disableSticky?: boolean;
}

export function SectionStack({ children, id, className = '', isHero = false, disableSticky = false }: SectionStackProps) {
  if (isHero) {
    return (
      <div id={id} className={`relative z-10 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div id={id} className={disableSticky ? "relative z-20 -mt-8" : "relative z-20 -mt-8"}>
      <div
        className={`relative rounded-t-[36px] bg-[#09090B] border-t border-white/[0.08] shadow-[0_-20px_50px_rgba(0,0,0,0.9)] overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
