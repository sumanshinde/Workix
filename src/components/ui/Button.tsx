'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  motionProps?: HTMLMotionProps<"button">;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = "", 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    motionProps,
    ...props 
  }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/15 disabled:opacity-60 disabled:pointer-events-none disabled:hover:scale-100 disabled:active:scale-100";
    
    const variants: Record<ButtonVariant, string> = {
      primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25 border-none",
      secondary: "bg-white/90 backdrop-blur-lg border border-slate-200 text-slate-900 hover:bg-slate-50 hover:scale-105 active:scale-95 shadow-sm shadow-black/5",
      outline: "border border-slate-200 bg-transparent text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm hover:scale-105 active:scale-95",
      ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:scale-95",
      danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:scale-105 active:scale-95 shadow-lg shadow-red-500/25 border-none",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "h-9 px-4 text-xs rounded-xl gap-2",
      md: "h-12 px-6 text-[15px] rounded-xl gap-2",
      lg: "h-14 px-8 text-base rounded-2xl gap-3",
      icon: "h-12 w-12 p-0 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={twMerge(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
