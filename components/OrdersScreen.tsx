
import React from 'react';
import { Language } from '../types';
import { ShoppingBag, ArrowRight, Leaf, Sprout } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

const OrdersScreen: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang === Language.ENGLISH ? 'en' : 'mr'];

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-8 text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Immersive Agricultural Illustration */}
      <div className="relative w-full max-w-[280px]">
        {/* Breathing Sun Effect */}
        <div className="absolute inset-0 bg-amber-500/20 blur-[80px] rounded-full animate-pulse"></div>
        
        {/* Floating Organic Elements */}
        <div className="absolute -top-4 -left-4 animate-bounce duration-[3000ms] opacity-40">
          <Leaf className="text-green-400 rotate-45" size={32} />
        </div>
        <div className="absolute top-10 -right-8 animate-bounce duration-[4000ms] delay-500 opacity-40">
          <Sprout className="text-amber-400 -rotate-12" size={28} />
        </div>
        
        {/* Main Icon Container */}
        <div className="relative glass-card p-12 rounded-[64px] border-white/10 shadow-2xl flex flex-col items-center">
          <div className="w-40 h-40 bg-white/5 rounded-[48px] flex items-center justify-center text-7xl shadow-inner border border-white/10 relative group">
             <div className="absolute inset-0 bg-[#F59E0B] opacity-0 group-hover:opacity-10 transition-opacity blur-2xl"></div>
             🚜
          </div>
        </div>
      </div>

      {/* Content Board */}
      <div className="space-y-4 max-w-xs">
        <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
          {t.noOrders}
        </h2>
        <p className="text-white/40 text-lg font-medium leading-relaxed">
          {t.noOrdersDesc}
        </p>
      </div>

      {/* Action Button */}
      <button className="spring-btn flex items-center gap-4 bg-[#F59E0B] text-[#132413] px-10 py-6 rounded-[32px] font-black text-xl shadow-2xl shadow-amber-900/40 border-b-4 border-amber-700">
        {t.startShopping}
        <ArrowRight size={24} strokeWidth={3} />
      </button>

      {/* Subtle Hint */}
      <div className="flex items-center gap-2 opacity-20">
        <ShoppingBag size={14} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Mandi Connect Logistics</span>
      </div>
    </div>
  );
};

export default OrdersScreen;
