
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MessageSquare, Truck, Heart, MapPin, Calendar, Info, Star, ChevronRight, ShieldCheck, Leaf } from 'lucide-react';
import { Product, Language } from '../types';
import { SELLERS, TRANSLATIONS } from '../constants';

interface DetailsScreenProps {
  product: Product;
  lang: Language;
  onBack: () => void;
}

const DetailsScreen: React.FC<DetailsScreenProps> = ({ product, lang, onBack }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const seller = SELLERS.find(s => s.id === product.sellerId);
  const isMr = lang === Language.MARATHI;
  const t = TRANSLATIONS[isMr ? 'mr' : 'en'];

  useEffect(() => {
    setMounted(true);
  }, []);

  const prodName = isMr ? product.nameMr : product.name;
  const prodDesc = isMr ? product.descriptionMr : product.description;
  const prodUnit = isMr ? product.unitMr : product.unit;
  const prodAge = isMr ? product.ageMr : product.age;

  return (
    <div className={`min-h-screen pb-48 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Immersive Header Image with Zoom Animation */}
      <div className="relative h-[55vh] w-full overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={prodName} 
          className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${mounted ? 'scale-100' : 'scale-125'}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#132413]"></div>
        
        {/* Top Floating Controls */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center ios-safe-top">
          <button onClick={onBack} className="spring-btn p-4 bg-black/40 backdrop-blur-xl rounded-[24px] shadow-2xl text-white border border-white/10">
            <ArrowLeft size={24} strokeWidth={3} />
          </button>
          <button onClick={() => setIsSaved(!isSaved)} className="spring-btn p-4 bg-black/40 backdrop-blur-xl rounded-[24px] shadow-2xl border border-white/10">
            <Heart size={24} strokeWidth={3} className={isSaved ? 'text-red-500 fill-red-500' : 'text-white/40'} />
          </button>
        </div>

        {/* Floating Price Tag */}
        <div className="absolute bottom-12 left-6 right-6 flex justify-between items-end">
            <div className={`space-y-2 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <span className="px-4 py-1.5 bg-[#F59E0B] text-white text-[10px] font-black rounded-full shadow-2xl shadow-amber-900/40 uppercase tracking-widest border border-white/10">{t.verifiedChoice}</span>
                <h1 className="text-4xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">{prodName}</h1>
            </div>
            <div className={`bg-white/10 backdrop-blur-2xl px-6 py-4 rounded-[32px] shadow-2xl border border-white/20 text-center min-w-[120px] transition-all duration-700 delay-500 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                <p className="text-[10px] font-black text-white/40 tracking-widest uppercase mb-1">{t.price}</p>
                <p className="text-3xl font-black text-[#F59E0B]">₹{product.price}</p>
            </div>
        </div>
      </div>

      {/* Tactile Content Container */}
      <div className={`px-6 -mt-10 space-y-10 relative z-10 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        
        {/* Info Tiles */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-6 rounded-[36px] space-y-2 border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 text-[#F59E0B] mb-1">
              <Calendar size={18} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.age}</span>
            </div>
            <p className="text-2xl font-black text-white/90 tracking-tight">{prodAge || 'N/A'}</p>
          </div>
          <div className="glass-card p-6 rounded-[36px] space-y-2 border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 text-[#F59E0B] mb-1">
              <Info size={18} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.quantity}</span>
            </div>
            <p className="text-2xl font-black text-white/90 tracking-tight">{product.quantity} <span className="text-xs font-bold text-white/30 ml-1 uppercase">{t.unitsLabel}</span></p>
          </div>
        </div>

        {/* Description Paper */}
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-[48px] border border-white/10 shadow-inner relative overflow-hidden">
          <div className="absolute -top-10 -right-10 p-4 opacity-5 pointer-events-none">
            <Leaf size={180} />
          </div>
          <h3 className="text-xl font-black text-white/90 mb-5 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#F59E0B] rounded-full"></div>
            {t.itemDetails}
          </h3>
          <p className="text-lg text-white/60 font-medium leading-relaxed">
            {prodDesc}
          </p>
          <div className="mt-8 flex items-center gap-3 bg-green-500/10 px-5 py-3 rounded-2xl w-fit border border-green-500/20">
            <ShieldCheck size={20} className="text-green-400" />
            <span className="text-[11px] font-black text-green-400 uppercase tracking-widest">{t.qualityVerified}</span>
          </div>
        </div>

        {/* Seller Card */}
        <div className="spring-btn glass-card p-7 rounded-[48px] border-white/10 shadow-2xl flex items-center gap-6">
           <div className="w-20 h-20 bg-[#2D5A27] rounded-[28px] flex items-center justify-center text-3xl shadow-2xl border border-white/10">
             🏪
           </div>
           <div className="flex-1">
             <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-black text-white/95 leading-none">{seller?.name}</h4>
                {seller?.isVerified && <ShieldCheck size={18} className="text-[#F59E0B]" strokeWidth={3} />}
             </div>
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-black text-amber-500">{seller?.rating}</span>
                </div>
                <span className="text-xs font-bold text-white/30 tracking-tight uppercase tracking-widest">{seller?.distance}</span>
             </div>
           </div>
           <ChevronRight size={24} className="text-white/20" />
        </div>

        {/* Logistics Interactive Block */}
        <div className="bg-gradient-to-br from-[#92400E] to-[#78350F] p-8 rounded-[56px] text-white space-y-8 shadow-2xl border border-white/10">
          <div className="flex items-center gap-5">
            <div className="p-4.5 bg-white/10 rounded-[32px] border border-white/20 shadow-inner">
              <Truck size={36} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-2xl font-black tracking-tight">{t.transport}</h4>
              <p className="text-amber-200/60 text-sm font-bold tracking-wide">{isMr ? 'विक्रेत्याशी थेट समन्वय' : 'Direct coordination with seller'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
             <button className="spring-btn flex items-center justify-between p-6 bg-white/10 rounded-[28px] border border-white/10 text-left hover:bg-white/15 transition-colors">
                <span className="font-bold text-xl text-white/90">{t.selfPickup}</span>
                <ChevronRight size={20} className="opacity-50" />
             </button>
             <button className="spring-btn flex items-center justify-between p-6 bg-white text-[#92400E] rounded-[28px] text-left shadow-2xl shadow-amber-900/60 font-black">
                <span className="text-xl">{t.requestTransport}</span>
                <ChevronRight size={22} strokeWidth={3} />
             </button>
          </div>
        </div>
      </div>

      {/* Floating Action Dock */}
      <div className={`fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#132413] via-[#132413]/95 to-transparent safe-bottom z-[60] transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex gap-5 max-w-lg mx-auto">
            <a 
            href={`tel:${seller?.phone}`}
            className="spring-btn flex-[1] flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl backdrop-blur-xl"
            >
            <Phone size={24} strokeWidth={3} className="text-[#F59E0B]" />
            {t.call}
            </a>
            <button className="spring-btn flex-[1.6] flex items-center justify-center gap-4 bg-[#2D5A27] text-white py-6 rounded-[32px] font-black text-xl shadow-2xl shadow-green-900/40 border border-white/10">
            <MessageSquare size={24} strokeWidth={3} />
            {t.chat}
            </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsScreen;
