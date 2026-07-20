import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#AAB3C5]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-[#7A8499] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 text-sm text-white',
              'bg-white/[0.04] border border-white/[0.08] rounded-xl',
              'placeholder:text-[#7A8499]',
              'transition-all duration-200 outline-none',
              'focus:border-[#4F7DFF] focus:bg-[rgba(79,125,255,0.04)] focus:ring-2 focus:ring-[rgba(79,125,255,0.15)]',
              error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[rgba(239,68,68,0.15)]',
              leftIcon  && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-[#7A8499]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-[#EF4444]">{error}</p>}
        {hint && !error && <p className="text-xs text-[#7A8499]">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
