import React, { useState, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Language } from '../types.ts';
import { PRODUCTS } from '../constants.tsx';
import {
  getCart, removeFromCart, updateQty, CartItem, CART_EVENT,
} from '../utils/cart.ts';
import SectionReveal from './atoms/SectionReveal.tsx';

interface CartScreenProps {
  lang: Language;
  onBack: () => void;
  onCheckout: () => void;
}

export default function CartScreen({ lang, onBack, onCheckout }: CartScreenProps) {
  const isMr = lang === Language.MARATHI;
  const [items, setItems] = useState<CartItem[]>(getCart());

  useEffect(() => {
    const handler = () => setItems(getCart());
    window.addEventListener(CART_EVENT, handler);
    return () => window.removeEventListener(CART_EVENT, handler);
  }, []);

  const cartProducts = items.map(item => ({
    item,
    product: PRODUCTS.find(p => p.id === item.productId),
  })).filter(({ product }) => !!product);

  const total = cartProducts.reduce((sum, { item, product }) =>
    sum + (product!.price * item.quantity), 0
  );

  return (
    <div className="px-5 pt-8 pb-36 space-y-6" style={{ minHeight: '100vh' }}>

      {/* Header */}
      <SectionReveal>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.1)] text-[rgba(245,240,232,0.5)] active:scale-90 transition-all flex-shrink-0"
            style={{ touchAction: 'manipulation' }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[rgba(245,240,232,0.35)] mb-0.5">
              {isMr ? 'खरेदी यादी' : 'Shopping Cart'}
            </p>
            <h1 className="font-light text-[#F5F0E8]" style={{ fontSize: '24px', letterSpacing: '-0.02em' }}>
              {isMr ? 'कार्ट' : 'Cart'}
              {items.length > 0 && (
                <span className="font-light text-[rgba(245,240,232,0.35)] ml-2" style={{ fontSize: '16px' }}>
                  ({items.reduce((s,i) => s+i.quantity,0)} {isMr ? 'वस्तू' : 'items'})
                </span>
              )}
            </h1>
          </div>
        </div>
      </SectionReveal>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
          >
            <ShoppingCart size={28} className="text-[rgba(245,240,232,0.2)]" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="font-light text-[#F5F0E8]" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>
              {isMr ? 'कार्ट रिकामी आहे' : 'Your cart is empty'}
            </h2>
            <p className="font-light text-[rgba(245,240,232,0.4)] max-w-xs" style={{ fontSize: '13px' }}>
              {isMr ? 'बाजारात जा आणि वस्तू निवडा' : 'Go to the market and add items'}
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-full border border-[rgba(245,240,232,0.15)] text-[rgba(245,240,232,0.65)] font-medium active:scale-95 transition-all"
            style={{ fontSize: '13px', touchAction: 'manipulation' }}
          >
            {isMr ? 'बाजार पहा' : 'Browse Market'}
          </button>
        </div>
      ) : (
        <>
          {/* Cart items */}
          <div className="space-y-3">
            {cartProducts.map(({ item, product }, idx) => (
              <SectionReveal key={item.productId} delay={idx * 60}>
                <div
                  className="p-4 rounded-2xl flex items-center gap-4"
                  style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={product!.imageUrl}
                      alt={isMr ? product!.nameMr : product!.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#F5F0E8] truncate" style={{ fontSize: '14px', letterSpacing: '-0.01em' }}>
                      {isMr ? product!.nameMr : product!.name}
                    </p>
                    <p className="font-light text-[rgba(245,240,232,0.4)] mt-0.5" style={{ fontSize: '11px' }}>
                      ₹{product!.price} / {isMr ? product!.unitMr : product!.unit}
                    </p>
                    <p className="font-light text-[#E8C84A] mt-1" style={{ fontSize: '13px', letterSpacing: '-0.01em' }}>
                      ₹{(product!.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQty(item.productId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-[rgba(245,240,232,0.12)] flex items-center justify-center active:scale-90 transition-all"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {item.quantity === 1
                        ? <Trash2 size={12} className="text-[#E57373]" />
                        : <Minus size={12} className="text-[rgba(245,240,232,0.6)]" />}
                    </button>
                    <span className="font-medium text-[#F5F0E8] w-5 text-center" style={{ fontSize: '14px' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.productId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-[rgba(245,240,232,0.12)] flex items-center justify-center active:scale-90 transition-all"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <Plus size={12} className="text-[rgba(245,240,232,0.6)]" />
                    </button>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Remove all */}
          <button
            onClick={() => { cartProducts.forEach(({ item }) => removeFromCart(item.productId)); }}
            className="text-[rgba(229,115,115,0.6)] font-light active:text-[#E57373] transition-colors"
            style={{ fontSize: '12px', touchAction: 'manipulation' }}
          >
            {isMr ? 'सर्व काढा' : 'Clear cart'}
          </button>
        </>
      )}

      {/* Sticky checkout bar */}
      {items.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 px-5 pb-safe pt-4"
          style={{ background: 'linear-gradient(to top, #0A1A0A 80%, transparent)' }}
        >
          {/* Total */}
          <div className="flex items-baseline justify-between mb-3 px-1">
            <span className="font-light text-[rgba(245,240,232,0.5)]" style={{ fontSize: '13px' }}>
              {isMr ? 'एकूण' : 'Total'}
            </span>
            <span className="font-light text-[#F5F0E8]" style={{ fontSize: '22px', letterSpacing: '-0.02em' }}>
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full py-4 rounded-2xl font-medium text-[#F5F0E8] active:scale-[0.98] transition-all"
            style={{ background: '#2E7D32', fontSize: '15px', letterSpacing: '-0.01em', touchAction: 'manipulation' }}
          >
            {isMr ? 'पुढे जा — पेमेंट' : 'Proceed to Checkout'}
          </button>
        </div>
      )}
    </div>
  );
}
