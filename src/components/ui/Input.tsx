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
            "flex w-full rounded-xl border border-border-theme bg-[#2a1d35] px-[18px] py-[14px] text-sm text-white transition-all placeholder:text-text-muted/60 focus:outline-none focus:border-accent-pink disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-300 focus:border-red-400",
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
