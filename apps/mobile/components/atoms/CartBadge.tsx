import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { getCartCount, CART_EVENT } from '../../utils/cart.ts';

interface CartBadgeProps {
  onOpen: () => void;
}

export default function CartBadge({ onOpen }: CartBadgeProps) {
  const [count, setCount] = useState(getCartCount());

  useEffect(() => {
    const handler = () => setCount(getCartCount());
    window.addEventListener(CART_EVENT, handler);
    return () => window.removeEventListener(CART_EVENT, handler);
  }, []);

  return (
    <button
      onClick={onOpen}
      className="relative w-8 h-8 flex items-center justify-center rounded-full border border-[rgba(245,240,232,0.1)] text-[rgba(245,240,232,0.55)] hover:text-[#F5F0E8] transition-all active:scale-90"
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'rgba(45,90,27,0.2)' }}
      aria-label="Open cart"
    >
      <ShoppingCart size={15} />
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[#0A1A0A] font-medium"
          style={{ background: '#D4C4A0', fontSize: '8px', lineHeight: 1 }}
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
