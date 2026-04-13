// AgriMart Design System — FarmMinerals-inspired
// Single source of truth for all design tokens

export const Colors = {
  // Core palette
  brandDark:       '#0A1A0A',
  brandCream:      '#F5F0E8',
  brandGreen:      '#2D5A1B',
  brandGreenLight: '#4A8C2A',
  brandBeige:      '#D4C4A0',
  surfaceDark:     '#111C11',
  surfaceMid:      '#1A2D1A',
  surfaceLight:    '#F9F5EE',
  white:           '#FFFFFF',

  // Semantic
  textOnDark:      '#F5F0E8',
  textMuted:       '#8FA882',
  textDim:         'rgba(245,240,232,0.45)',
  accentAmber:     '#F59E0B',
  divider:         'rgba(245,240,232,0.08)',
  overlay:         'rgba(10,26,10,0.7)',
} as const;

export const Typography = {
  display:  { fontFamily: 'Inter', fontWeight: '300', fontSize: '42px', letterSpacing: '-0.5px', lineHeight: '1.1' },
  h1:       { fontFamily: 'Inter', fontWeight: '400', fontSize: '30px', letterSpacing: '0.2px',  lineHeight: '1.2' },
  h2:       { fontFamily: 'Inter', fontWeight: '400', fontSize: '22px', letterSpacing: '0.3px',  lineHeight: '1.3' },
  h3:       { fontFamily: 'Inter', fontWeight: '500', fontSize: '17px', letterSpacing: '0.1px',  lineHeight: '1.4' },
  body:     { fontFamily: 'Inter', fontWeight: '300', fontSize: '15px', letterSpacing: '0.1px',  lineHeight: '1.65' },
  caption:  { fontFamily: 'Inter', fontWeight: '500', fontSize: '11px', letterSpacing: '1.5px',  lineHeight: '1.4'  },
  button:   { fontFamily: 'Inter', fontWeight: '500', fontSize: '13px', letterSpacing: '0.8px',  lineHeight: '1'    },
  stat:     { fontFamily: 'Inter', fontWeight: '300', fontSize: '56px', letterSpacing: '-2px',   lineHeight: '1'    },
} as const;

export const Spacing = {
  xs:   '4px',
  sm:   '8px',
  md:   '16px',
  lg:   '24px',
  xl:   '32px',
  xxl:  '48px',
  xxxl: '64px',
} as const;

export const Radius = {
  sm:   '6px',
  md:   '12px',
  lg:   '20px',
  xl:   '28px',
  pill: '999px',
} as const;

export const Duration = {
  fast:   '150ms',
  normal: '300ms',
  slow:   '600ms',
  reveal: '700ms',
} as const;

export const Easing = {
  smooth:  'cubic-bezier(0.16, 1, 0.3, 1)',
  spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
  fadeOut: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

// Tailwind CDN class shortcuts — consistent aliases used throughout
export const tw = {
  // Backgrounds
  bgDark:    'bg-[#0A1A0A]',
  bgSurface: 'bg-[#111C11]',
  bgMid:     'bg-[#1A2D1A]',
  bgLight:   'bg-[#F9F5EE]',
  bgGreen:   'bg-[#2D5A1B]',

  // Text
  textCream:  'text-[#F5F0E8]',
  textGreen:  'text-[#2D5A1B]',
  textBeige:  'text-[#D4C4A0]',
  textMuted:  'text-[#8FA882]',
  textAmber:  'text-[#F59E0B]',
  textDark:   'text-[#0A1A0A]',

  // Border
  borderDim: 'border-[rgba(245,240,232,0.08)]',

  // Pill button shared base
  pillBase: 'inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-medium text-[13px] tracking-[0.8px] transition-all duration-200 active:scale-95 select-none',
} as const;
