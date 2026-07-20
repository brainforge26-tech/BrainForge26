import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-[20px] transition-all duration-250',
  {
    variants: {
      variant: {
        // ── Default glass card ───────────────────────────────────────────────
        default:
          'bg-white/[0.04] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] hover:border-white/[0.12]',

        // ── Elevated — slightly more opaque ──────────────────────────────────
        elevated:
          'bg-white/[0.07] border border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]',

        // ── Accent border (blue glow) ────────────────────────────────────────
        accent:
          'bg-white/[0.04] border border-[rgba(79,125,255,0.25)] shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(79,125,255,0.1)] backdrop-blur-md hover:-translate-y-0.5 hover:border-[rgba(79,125,255,0.4)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_20px_rgba(79,125,255,0.15)]',

        // ── Stat / metric card ───────────────────────────────────────────────
        stat:
          'bg-white/[0.04] border border-white/[0.08] hover:border-[rgba(79,125,255,0.2)] hover:bg-white/[0.06] hover:-translate-y-0.5',

        // ── Flat / no border ─────────────────────────────────────────────────
        flat:
          'bg-[#0B1224]',

        // ── Ghost / transparent ──────────────────────────────────────────────
        ghost: 'bg-transparent',
      },
      padding: {
        none: '',
        sm:   'p-4',
        md:   'p-6',
        lg:   'p-8',
        xl:   'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  },
);

// ─── Card Root ─────────────────────────────────────────────────────────────────
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

// ─── Card Header ──────────────────────────────────────────────────────────────
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1.5 pb-4', className)}
      {...props}
    />
  ),
);
CardHeader.displayName = 'CardHeader';

// ─── Card Title ───────────────────────────────────────────────────────────────
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold text-white leading-snug', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

// ─── Card Description ─────────────────────────────────────────────────────────
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-[#AAB3C5] leading-relaxed', className)}
      {...props}
    />
  ),
);
CardDescription.displayName = 'CardDescription';

// ─── Card Content ─────────────────────────────────────────────────────────────
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-[#AAB3C5]', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

// ─── Card Footer ──────────────────────────────────────────────────────────────
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4 border-t border-white/[0.06]', className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
