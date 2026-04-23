import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, MapPin, User, Smartphone } from 'lucide-react';
import { Language } from '../types.ts';
import { getCart, clearCart } from '../utils/cart.ts';
import { PRODUCTS } from '../constants.tsx';
import { haptic } from '../utils/haptic.ts';
import SectionReveal from './atoms/SectionReveal.tsx';

interface CheckoutScreenProps {
  lang: Language;
  onBack: () => void;
  onConfirmed: () => void; // navigate to ORDERS after success
}

type PayMethod = 'upi' | 'cod';

const inputCls = [
  'w-full px-4 py-3.5 rounded-xl font-light text-[#F5F0E8] text-[14px]',
  'placeholder:text-[rgba(245,240,232,0.2)]',
  'border border-[rgba(245,240,232,0.1)] focus:border-[rgba(74,140,42,0.4)]',
  'bg-[rgba(255,255,255,0.03)] focus:bg-[rgba(255,255,255,0.05)]',
  'outline-none transition-all',
].join(' ');

export default function CheckoutScreen({ lang, onBack, onConfirmed }: CheckoutScreenProps) {
  const isMr = lang === Language.MARATHI;
  const [step, setStep]         = useState<1 | 2>(1);
  const [name, setName]         = useState('');
  const [village, setVillage]   = useState('');
  const [phone, setPhone]       = useState('');
  const [payMethod, setPayMethod] = useState<PayMethod>('upi');
  const [upiId, setUpiId]       = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const cart = getCart();
  const cartProducts = cart.map(item => ({
    item,
    product: PRODUCTS.find(p => p.id === item.productId),
  })).filter(({ product }) => !!product);

  const total = cartProducts.reduce((sum, { item, product }) =>
    sum + (product!.price * item.quantity), 0
  );

  const canProceed = name.trim() && village.trim() && phone.trim().length >= 10;

  const handleConfirm = () => {
    if (!canProceed) return;
    haptic.success();
    clearCart();
    setConfirmed(true);
    setTimeout(onConfirmed, 2600);
  };

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-8 text-center space-y-8 animate-[fadeUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(74,140,42,0.12)', border: '1px solid rgba(74,140,42,0.25)' }}
        >
          <CheckCircle size={40} className="text-[#4CAF50]" strokeWidth={1.5} />
        </div>
        <div className="space-y-3">
          <h2 className="font-light text-[#F5F0E8]" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
            {isMr ? 'ऑर्डर दिली!' : 'Order Placed!'}
          </h2>
          <p className="font-light text-[rgba(245,240,232,0.45)] leading-relaxed max-w-xs" style={{ fontSize: '14px' }}>
            {isMr
              ? 'विक्रेता लवकरच संपर्क करेल. ऑर्डर्स टॅबमध्ये ट्रॅक करा.'
              : 'The seller will contact you shortly. Track your order in the Orders tab.'}
          </p>
        </div>
        <p className="font-light text-[rgba(245,240,232,0.3)]" style={{ fontSize: '12px' }}>
          {isMr ? 'ऑर्डर्सवर जात आहे...' : 'Taking you to Orders…'}
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-8 pb-36 space-y-7" style={{ minHeight: '100vh' }}>

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
              {isMr ? 'खरेदी पूर्ण करा' : 'Complete Purchase'}
            </p>
            <h1 className="font-light text-[#F5F0E8]" style={{ fontSize: '24px', letterSpacing: '-0.02em' }}>
              {isMr ? 'चेकआउट' : 'Checkout'}
            </h1>
          </div>
        </div>
      </SectionReveal>

      {/* Step indicator */}
      <SectionReveal delay={40}>
        <div className="flex items-center gap-3">
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: step >= s ? '#2E7D32' : 'rgba(245,240,232,0.06)',
                    border: `1px solid ${step >= s ? 'rgba(74,140,42,0.4)' : 'rgba(245,240,232,0.1)'}`,
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 600, color: step >= s ? '#F5F0E8' : 'rgba(245,240,232,0.3)' }}>
                    {s}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: step >= s ? 'rgba(245,240,232,0.7)' : 'rgba(245,240,232,0.3)', fontWeight: 400 }}>
                  {s === 1
                    ? (isMr ? 'पत्ता' : 'Delivery')
                    : (isMr ? 'पेमेंट' : 'Payment')}
                </span>
              </div>
              {s < 2 && (
                <div className="flex-1 h-px" style={{ background: step > 1 ? 'rgba(74,140,42,0.4)' : 'rgba(245,240,232,0.1)' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </SectionReveal>

      {/* Order summary strip */}
      <SectionReveal delay={60}>
        <div
          className="p-4 rounded-2xl flex items-center justify-between"
          style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
        >
          <div>
            <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-[rgba(245,240,232,0.3)] mb-0.5">
              {isMr ? 'ऑर्डर एकूण' : 'Order Total'}
            </p>
            <p className="font-light text-[#F5F0E8]" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>
              ₹{total.toLocaleString('en-IN')}
            </p>
          </div>
          <p className="font-light text-[rgba(245,240,232,0.4)]" style={{ fontSize: '12px' }}>
            {cart.reduce((s,i) => s+i.quantity,0)} {isMr ? 'वस्तू' : 'items'}
          </p>
        </div>
      </SectionReveal>

      {/* ── Step 1: Delivery details ── */}
      {step === 1 && (
        <SectionReveal delay={80} className="space-y-4">
          <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)]">
            {isMr ? 'डिलिव्हरी माहिती' : 'Delivery Details'}
          </p>

          <div
            className="p-5 rounded-2xl space-y-4"
            style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
          >
            {/* Name */}
            <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 border border-[rgba(245,240,232,0.1)] focus-within:border-[rgba(74,140,42,0.4)] bg-[rgba(255,255,255,0.03)] transition-all">
              <User size={15} className="text-[rgba(245,240,232,0.3)] flex-shrink-0" />
              <input
                type="text"
                placeholder={isMr ? 'पूर्ण नाव' : 'Full Name'}
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 bg-transparent outline-none border-none font-light text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.2)]"
                style={{ fontSize: '14px' }}
              />
            </div>

            {/* Village/address */}
            <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 border border-[rgba(245,240,232,0.1)] focus-within:border-[rgba(74,140,42,0.4)] bg-[rgba(255,255,255,0.03)] transition-all">
              <MapPin size={15} className="text-[rgba(245,240,232,0.3)] flex-shrink-0" />
              <input
                type="text"
                placeholder={isMr ? 'गाव / पत्ता' : 'Village / Address'}
                value={village}
                onChange={e => setVillage(e.target.value)}
                className="flex-1 bg-transparent outline-none border-none font-light text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.2)]"
                style={{ fontSize: '14px' }}
              />
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 border border-[rgba(245,240,232,0.1)] focus-within:border-[rgba(74,140,42,0.4)] bg-[rgba(255,255,255,0.03)] transition-all">
              <Smartphone size={15} className="text-[rgba(245,240,232,0.3)] flex-shrink-0" />
              <input
                type="tel"
                placeholder={isMr ? 'फोन नंबर' : 'Phone Number'}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="flex-1 bg-transparent outline-none border-none font-light text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.2)]"
                style={{ fontSize: '14px' }}
              />
            </div>
          </div>
        </SectionReveal>
      )}

      {/* ── Step 2: Payment ── */}
      {step === 2 && (
        <SectionReveal delay={60} className="space-y-4">
          <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)]">
            {isMr ? 'पेमेंट पद्धत' : 'Payment Method'}
          </p>

          <div className="flex gap-3">
            {([
              { key: 'upi', label: 'UPI',                     labelMr: 'UPI'          },
              { key: 'cod', label: 'Cash on Delivery',        labelMr: 'रोख डिलिव्हरी' },
            ] as const).map(opt => (
              <button
                key={opt.key}
                onClick={() => setPayMethod(opt.key)}
                className="flex-1 py-3.5 rounded-xl border font-medium transition-all active:scale-95 text-[13px]"
                style={{
                  touchAction: 'manipulation',
                  background: payMethod === opt.key ? 'rgba(74,140,42,0.12)' : 'transparent',
                  border: `1px solid ${payMethod === opt.key ? 'rgba(74,140,42,0.4)' : 'rgba(245,240,232,0.1)'}`,
                  color: payMethod === opt.key ? '#4CAF50' : 'rgba(245,240,232,0.45)',
                }}
              >
                {isMr ? opt.labelMr : opt.label}
              </button>
            ))}
          </div>

          {payMethod === 'upi' && (
            <div
              className="p-5 rounded-2xl"
              style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
            >
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                className={inputCls}
              />
              <p className="text-[11px] font-light text-[rgba(245,240,232,0.3)] mt-2 px-1">
                {isMr ? 'उदा. 9876543210@paytm' : 'e.g. 9876543210@paytm'}
              </p>
            </div>
          )}

          {payMethod === 'cod' && (
            <div
              className="p-4 rounded-2xl flex items-start gap-3"
              style={{ background: 'rgba(212,196,160,0.06)', border: '1px solid rgba(212,196,160,0.12)' }}
            >
              <span style={{ fontSize: '18px' }}>💰</span>
              <p className="font-light text-[rgba(245,240,232,0.55)] leading-relaxed" style={{ fontSize: '13px' }}>
                {isMr
                  ? 'मालाच्या डिलिव्हरीवेळी रोख पैसे द्या. विक्रेता लवकरच संपर्क करेल.'
                  : 'Pay cash when the goods are delivered. The seller will contact you to arrange.'}
              </p>
            </div>
          )}

          {/* Delivery summary */}
          <div
            className="p-4 rounded-2xl space-y-2"
            style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
          >
            <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-[rgba(245,240,232,0.3)] mb-3">
              {isMr ? 'डिलिव्हरी सारांश' : 'Delivery Summary'}
            </p>
            {[
              { label: isMr ? 'नाव' : 'Name', value: name },
              { label: isMr ? 'पत्ता' : 'Address', value: village },
              { label: isMr ? 'फोन' : 'Phone', value: phone },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span style={{ fontSize: '12px', color: 'rgba(245,240,232,0.35)', fontWeight: 400 }}>{label}</span>
                <span style={{ fontSize: '12px', color: '#F5F0E8', fontWeight: 300 }}>{value}</span>
              </div>
            ))}
          </div>
        </SectionReveal>
      )}

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 pb-safe pt-4"
        style={{ background: 'linear-gradient(to top, #0A1A0A 80%, transparent)' }}
      >
        {step === 1 ? (
          <button
            onClick={() => { if (canProceed) setStep(2); }}
            disabled={!canProceed}
            className="w-full py-4 rounded-2xl font-medium text-[#F5F0E8] transition-all active:scale-[0.98]"
            style={{
              background: canProceed ? '#2E7D32' : 'rgba(245,240,232,0.06)',
              fontSize: '15px', letterSpacing: '-0.01em',
              color: canProceed ? '#F5F0E8' : 'rgba(245,240,232,0.3)',
              touchAction: 'manipulation',
            }}
          >
            {isMr ? 'पुढे — पेमेंट' : 'Next — Payment'}
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            className="w-full py-4 rounded-2xl font-medium text-[#F5F0E8] active:scale-[0.98] transition-all"
            style={{ background: '#2E7D32', fontSize: '15px', letterSpacing: '-0.01em', touchAction: 'manipulation' }}
          >
            {isMr ? `ऑर्डर द्या — ₹${total.toLocaleString('en-IN')}` : `Confirm Order — ₹${total.toLocaleString('en-IN')}`}
          </button>
        )}
      </div>
    </div>
  );
}
