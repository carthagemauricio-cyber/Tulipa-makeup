import * as React from "react"
import { cn } from "../../lib/utils"
import { motion } from "motion/react"

export interface CardProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <div className={cn("bg-[#1c1524] rounded-[24px] p-6 shadow-xl border border-border-theme", className)} {...props} />
  )
}

export function AnimatedCard({ className, delay = 0, ...props }: CardProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("bg-[#1c1524] rounded-[24px] p-6 shadow-xl border border-border-theme", className)} 
      {...props}
    />
  )
}
