import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "flex w-full appearance-none rounded-xl border border-border-theme bg-[#2a1d35] px-[18px] py-[14px] pr-10 text-sm transition-all duration-300 hover:border-accent-pink/50 focus:outline-none focus:border-accent-pink focus:bg-[#342442] focus:ring-[3px] focus:ring-accent-pink/20 focus:shadow-[0_0_15px_rgba(217,70,239,0.2)] focus:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50",
              !props.value && "text-text-muted/60",
              props.value && "text-white",
              error && "border-red-300 focus:border-red-400 focus:ring-red-400/20 focus:shadow-none",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-text-main">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-muted">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
