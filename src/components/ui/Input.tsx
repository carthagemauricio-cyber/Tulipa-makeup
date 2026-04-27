import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex w-full rounded-xl border border-border-theme bg-[#334155] px-[18px] py-[14px] text-sm text-white transition-all duration-300 placeholder:text-text-muted/60 hover:border-accent-pink/50 focus:outline-none focus:border-accent-pink focus:bg-[#475569] focus:ring-[3px] focus:ring-accent-pink/20 focus:shadow-[0_0_15px_rgba(217,70,239,0.2)] focus:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-300 focus:border-red-400 focus:ring-red-400/20 focus:shadow-none",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
