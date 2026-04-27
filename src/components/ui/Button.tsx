import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-accent-pink text-white hover:opacity-90 shadow-[0_4px_15px_rgba(217,70,239,0.3)] focus:ring-accent-pink",
      secondary: "bg-[#2a1d35] text-white hover:bg-[#3b2856] focus:ring-accent-pink",
      outline: "border-2 border-border-theme text-text-main hover:bg-[#2a1d35] focus:ring-accent-pink",
      ghost: "text-text-main hover:bg-[#2a1d35] hover:text-white focus:ring-accent-pink",
      danger: "bg-[rgba(239,68,68,0.1)] text-red-500 hover:bg-[rgba(239,68,68,0.2)] focus:ring-red-400",
    };

    const sizes = {
      sm: "h-[36px] px-4 text-sm rounded-[12px]",
      md: "h-[44px] px-6 text-base rounded-[16px]",
      lg: "h-[56px] px-[24px] text-[16px] rounded-[16px]",
    };

    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
