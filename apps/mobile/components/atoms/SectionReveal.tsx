import React from 'react';
import { motion } from 'motion/react';

interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;     // ms, default 0
  className?: string;
  threshold?: number; // 0–1, default 0.12
}

/**
 * Wraps content in a motion-powered fade-up scroll reveal.
 * Triggers once when the element enters the viewport.
 */
export default function SectionReveal({
  children,
  delay = 0,
  className = '',
  threshold = 0.12,
}: SectionRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
