import React, { useEffect, useRef, useState } from 'react';

interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;        // ms, default 0
  className?: string;
  threshold?: number;    // 0–1, default 0.12
}

/**
 * Wraps content in an IntersectionObserver fade-up reveal.
 * Matches FarmMinerals scroll-entry animation.
 */
export default function SectionReveal({
  children,
  delay = 0,
  className = '',
  threshold = 0.12,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${visible ? 'reveal-visible' : 'reveal-hidden'} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
