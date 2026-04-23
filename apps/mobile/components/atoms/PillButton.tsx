import React from 'react';
import { motion } from 'motion/react';

interface PillButtonProps {
  children: React.ReactNode;
  variant?: 'dark' | 'light' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

/**
 * FarmMinerals-style pill CTA with dot decorators and motion spring physics.
 *
 * Variants:
 *  dark    — cream text on transparent w/ cream border (on dark backgrounds)
 *  light   — dark text on cream bg (on light backgrounds)
 *  outline — green border, green text
 */
export default function PillButton({
  children,
  variant = 'dark',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  fullWidth = false,
}: PillButtonProps) {
  const base = [
    'inline-flex items-center justify-center gap-3 rounded-full font-medium',
    'select-none cursor-pointer',
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-40 pointer-events-none' : '',
  ].join(' ');

  const sizes = {
    sm: 'px-5 py-2.5 text-[11px] tracking-[0.8px]',
    md: 'px-7 py-3.5 text-[13px] tracking-[0.8px]',
    lg: 'px-9 py-4   text-[14px] tracking-[1px]',
  };

  const variants = {
    dark:    'bg-transparent border border-[rgba(245,240,232,0.35)] text-[#F5F0E8] hover:border-[rgba(245,240,232,0.65)] hover:bg-[rgba(245,240,232,0.05)]',
    light:   'bg-[#F5F0E8] border border-[#F5F0E8] text-[#0A1A0A] hover:bg-white',
    outline: 'bg-transparent border border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32]/10',
  };

  const dotColors = {
    dark:    'bg-[#E8C84A]',
    light:   'bg-[#2E7D32]',
    outline: 'bg-[#2E7D32]',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      <span className={`pill-dot ${dotColors[variant]}`} />
      {children}
      <span className={`pill-dot ${dotColors[variant]}`} />
    </motion.button>
  );
}
