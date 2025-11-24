// 📁 components/ui/Button.tsx
import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'white'
  size?: 'medium' | 'large'
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className,
  ...props 
}: ButtonProps) {
  const baseStyles = "group font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 justify-center disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    primary: "bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 border border-transparent",
    // Adapted for dark mode: Changed text-gray-900 to text-white and adjusted border color
    outline: "border-2 border-white/20 text-white hover:border-emerald-500 hover:text-emerald-500 bg-transparent",
    white: "bg-white text-emerald-600 hover:bg-gray-50 hover:scale-105 hover:shadow-2xl"
  }
  
  const sizes = {
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg md:px-10 md:py-5 md:text-xl"
  }
  
  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}