'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base
  'group inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A61C43] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        // ── Filled gradient (primary CTA) ────────────────────────────────────
        primary:
          'bg-gradient-to-r from-[#730E27] via-[#8B1532] to-[#52091B] text-white border border-white/15 shadow-[0_8px_30px_rgba(115,14,39,0.35)] hover:shadow-[0_12px_45px_rgba(115,14,39,0.5)] hover:-translate-y-0.5 active:translate-y-0',

        // ── Ghost / glass secondary ──────────────────────────────────────────
        secondary:
          'bg-[#111114]/90 text-white border border-white/15 backdrop-blur-xl hover:bg-white/10 hover:border-[rgba(115,14,39,0.35)] hover:shadow-[0_8px_30px_rgba(115,14,39,0.15)] hover:-translate-y-0.5 active:translate-y-0',

        // ── Destructive ──────────────────────────────────────────────────────
        destructive:
          'bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-[0_4px_20px_rgba(239,68,68,0.25)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.4)] hover:-translate-y-0.5',

        // ── Ghost (no background) ────────────────────────────────────────────
        ghost:
          'text-[#AAB3C5] hover:text-white hover:bg-white/5',

        // ── Link style ───────────────────────────────────────────────────────
        link:
          'text-[#C02C54] underline-offset-4 hover:underline hover:text-[#A61C43] p-0 h-auto',

        // ── Outline ──────────────────────────────────────────────────────────
        outline:
          'border border-[rgba(166,28,67,0.4)] text-[#C02C54] hover:bg-[rgba(166,28,67,0.08)] hover:-translate-y-0.5',

        // ── Cyan accent ──────────────────────────────────────────────────────
        cyan:
          'bg-gradient-to-r from-[#00D4FF] to-[#4F7DFF] text-white shadow-[0_4px_20px_rgba(0,212,255,0.25)] hover:shadow-[0_8px_30px_rgba(0,212,255,0.4)] hover:-translate-y-0.5',
      },
      size: {
        xs:  'h-8  px-3   text-xs   rounded-full',
        sm:  'h-10 px-4.5 text-sm   rounded-full',
        md:  'h-12 px-6   text-base rounded-full',
        lg:  'h-14 px-8   text-base sm:text-lg rounded-full font-bold',
        xl:  'h-16 px-10  text-lg sm:text-xl rounded-full font-bold',
        icon: 'h-11 w-11 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon && (
            <span className="transition-transform duration-200 ease-out group-hover:-translate-x-1 group-hover:scale-110 shrink-0 inline-flex items-center">
              {leftIcon}
            </span>
          )
        )}
        {children}
        {!loading && rightIcon && (
          <span className="transition-transform duration-200 ease-out group-hover:translate-x-1.5 shrink-0 inline-flex items-center">
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
