'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801818293914';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hello BrainForceIT Team, I would like to inquire about your services.')}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Hover / Active Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#111114]/95 backdrop-blur-xl border border-[#25D366]/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white text-xs font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            Need assistance? Chat on WhatsApp!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] transition-all duration-300 border border-white/20"
        aria-label="Chat on WhatsApp"
      >
        {/* Static Soft Outer Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 pointer-events-none" />

        {/* WhatsApp Icon (SVG) */}
        <svg
          className="w-7 h-7 fill-current relative z-10 transition-transform duration-300 group-hover:rotate-12"
          viewBox="0 0 24 24"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.763.459 3.486 1.332 5.006L2 22l5.127-1.341c1.465.8 3.118 1.22 4.881 1.22h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.668-1.037-5.176-2.923-7.062A9.923 9.923 0 0 0 12.012 2zm.003 16.516h-.003c-1.494 0-2.96-.401-4.24-1.16l-.304-.18-3.149.824.84-3.064-.198-.316A8.303 8.303 0 0 1 3.68 11.984c0-4.587 3.737-8.318 8.332-8.318 2.223 0 4.312.866 5.884 2.44 1.572 1.574 2.437 3.664 2.436 5.888 0 4.588-3.737 8.322-8.317 8.322zm4.56-6.225c-.25-.126-1.478-.729-1.707-.812-.229-.084-.396-.126-.563.126-.167.252-.647.812-.793.979-.146.167-.292.188-.542.063a6.837 6.837 0 0 1-2.012-1.24 7.55 7.55 0 0 1-1.393-1.737c-.146-.252-.016-.388.109-.513.113-.113.25-.292.375-.438.126-.146.167-.252.25-.417.084-.167.042-.313-.021-.438-.063-.126-.563-1.356-.772-1.856-.203-.488-.41-.422-.563-.429h-.48c-.167 0-.438.063-.667.313s-.876.856-.876 2.087.897 2.419 1.022 2.586c.126.167 1.765 2.696 4.276 3.782.597.258 1.064.412 1.428.528.6.19 1.146.163 1.577.099.48-.071 1.478-.605 1.687-1.189.208-.584.208-1.085.146-1.189-.063-.105-.229-.168-.479-.293z" />
        </svg>
      </motion.a>
    </div>
  );
}
