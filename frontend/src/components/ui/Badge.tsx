import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide uppercase transition-colors',
  {
    variants: {
      variant: {
        primary:
          'bg-[rgba(79,125,255,0.15)] text-[#4F7DFF] border border-[rgba(79,125,255,0.3)]',
        secondary:
          'bg-[rgba(124,92,255,0.15)] text-[#7C5CFF] border border-[rgba(124,92,255,0.3)]',
        cyan:
          'bg-[rgba(0,212,255,0.12)] text-[#00D4FF] border border-[rgba(0,212,255,0.25)]',
        success:
          'bg-[rgba(34,197,94,0.15)] text-[#22C55E] border border-[rgba(34,197,94,0.3)]',
        warning:
          'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]',
        error:
          'bg-[rgba(239,68,68,0.15)] text-[#EF4444] border border-[rgba(239,68,68,0.3)]',
        muted:
          'bg-white/[0.06] text-[#7A8499] border border-white/[0.08]',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1   text-xs',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'inline-block w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-[#22C55E]',
            variant === 'error'   && 'bg-[#EF4444]',
            variant === 'warning' && 'bg-[#F59E0B]',
            variant === 'primary' && 'bg-[#4F7DFF]',
            variant === 'secondary' && 'bg-[#7C5CFF]',
            variant === 'cyan'    && 'bg-[#00D4FF]',
            variant === 'muted'   && 'bg-[#7A8499]',
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
