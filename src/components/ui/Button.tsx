import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", fullWidth, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-bold font-sans transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-4 py-2.5";
    
    const variants = {
      primary: "bg-accent-pink text-white hover:opacity-90 shadow-md",
      secondary: "bg-[#2a1d35] text-white hover:bg-[#3b2856]",
      outline: "border-2 border-border-theme text-white hover:bg-[#2a1d35]",
      ghost: "text-text-main hover:bg-[#2a1d35]",
      danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], fullWidth && "w-full", className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
