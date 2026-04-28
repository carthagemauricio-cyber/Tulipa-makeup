import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && <label className="text-sm font-medium text-text-main block">{label}</label>}
        <input
          className={cn(
            "flex w-full rounded-xl border border-border-theme bg-[#2a1d35] px-4 py-3 text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:border-accent-pink disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
