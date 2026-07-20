'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F7DFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        // ── Filled gradient (primary CTA) ────────────────────────────────────
        primary:
          'bg-gradient-to-r from-[#4F7DFF] to-[#7C5CFF] text-white shadow-[0_4px_20px_rgba(79,125,255,0.3)] hover:shadow-[0_8px_30px_rgba(79,125,255,0.5)] hover:-translate-y-0.5 active:translate-y-0',

        // ── Ghost / glass secondary ──────────────────────────────────────────
        secondary:
          'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-[rgba(79,125,255,0.4)] hover:shadow-[0_0_20px_rgba(79,125,255,0.1)] hover:-translate-y-0.5',

        // ── Destructive ──────────────────────────────────────────────────────
        destructive:
          'bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-[0_4px_20px_rgba(239,68,68,0.25)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.4)] hover:-translate-y-0.5',

        // ── Ghost (no background) ────────────────────────────────────────────
        ghost:
          'text-[#AAB3C5] hover:text-white hover:bg-white/5',

        // ── Link style ───────────────────────────────────────────────────────
        link:
          'text-[#4F7DFF] underline-offset-4 hover:underline hover:text-[#00D4FF] p-0 h-auto',

        // ── Outline ──────────────────────────────────────────────────────────
        outline:
          'border border-[rgba(79,125,255,0.4)] text-[#4F7DFF] hover:bg-[rgba(79,125,255,0.08)] hover:-translate-y-0.5',

        // ── Cyan accent ──────────────────────────────────────────────────────
        cyan:
          'bg-gradient-to-r from-[#00D4FF] to-[#4F7DFF] text-white shadow-[0_4px_20px_rgba(0,212,255,0.25)] hover:shadow-[0_8px_30px_rgba(0,212,255,0.4)] hover:-translate-y-0.5',
      },
      size: {
        xs:  'h-7  px-3   text-xs   rounded-full',
        sm:  'h-9  px-4   text-sm   rounded-full',
        md:  'h-11 px-6   text-base rounded-full',
        lg:  'h-13 px-8   text-lg   rounded-full',
        xl:  'h-14 px-10  text-xl   rounded-full',
        icon: 'h-10 w-10 rounded-full',
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
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
