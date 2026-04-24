import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(74,4,78,0.05)] border border-border-theme", className)} {...props}>
      {children}
    </div>
  );
}

export function AnimatedCard({ className, children, delay = 0, ...props }: React.HTMLAttributes<HTMLDivElement> & { delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn("bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(74,4,78,0.05)] border border-border-theme", className)} 
      {...props}
    >
      {children}
    </motion.div>
  );
}
