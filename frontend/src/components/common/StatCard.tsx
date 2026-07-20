import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;       // percentage change (+/-)
  icon?: React.ElementType;
  iconColor?: string;
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = '#4F7DFF',
  description,
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral  = change === 0;

  return (
    <div
      className={cn(
        'p-6 rounded-[20px] bg-white/[0.04] border border-white/[0.08]',
        'hover:border-[rgba(79,125,255,0.2)] hover:bg-white/[0.06] hover:-translate-y-0.5',
        'transition-all duration-250',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#7A8499] truncate">{title}</p>
          <p className="mt-1 text-2xl font-bold text-white tracking-tight">{value}</p>

          {/* Change indicator */}
          {change !== undefined && (
            <div
              className={cn(
                'mt-2 inline-flex items-center gap-1 text-xs font-semibold',
                isPositive && 'text-[#22C55E]',
                isNegative && 'text-[#EF4444]',
                isNeutral  && 'text-[#7A8499]',
              )}
            >
              {isPositive && <TrendingUp  className="w-3.5 h-3.5" />}
              {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
              {isNeutral  && <Minus        className="w-3.5 h-3.5" />}
              <span>
                {isPositive && '+'}
                {change.toFixed(1)}%
              </span>
              {description && (
                <span className="text-[#7A8499] font-normal ml-1">{description}</span>
              )}
            </div>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div
            className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
            style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}
          >
            <Icon className="w-5 h-5" style={{ color: iconColor }} />
          </div>
        )}
      </div>
    </div>
  );
}
