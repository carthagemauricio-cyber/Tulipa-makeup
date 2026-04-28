import * as React from "react"
import { cn } from "../../lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && <label className="text-sm font-medium text-text-main block">{label}</label>}
        <div className="relative">
          <select
            className={cn(
              "flex w-full appearance-none rounded-xl border border-border-theme bg-[#2a1d35] px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-pink disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          >
            <option value="" disabled>Selecione...</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
