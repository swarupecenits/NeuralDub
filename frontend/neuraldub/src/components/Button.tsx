import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0A1628] disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:
    'bg-cyan-500 text-white hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    secondary:
    'bg-transparent border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50',
    outline:
    'bg-transparent border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg'
  };
  return (
    <motion.button
      whileHover={{
        scale: 1.02
      }}
      whileTap={{
        scale: 0.98
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}>

      {children}
    </motion.button>
  );
}

export default Button;