
import React, { useState } from 'react';
import { Camera, Plus, CheckCircle, ArrowRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { CATEGORIES, TRANSLATIONS } from '../constants';

interface SellScreenProps {
  lang: Language;
  onDone: () => void;
}

const SellScreen: React.FC<SellScreenProps> = ({ lang, onDone }) => {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const isMr = lang === Language.MARATHI;
  const t = TRANSLATIONS[isMr ? 'mr' : 'en'];

  const handlePublish = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onDone();
    }, 2200);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-green-500/10 rounded-[48px] flex items-center justify-center border border-green-500/20 shadow-2xl">
          <CheckCircle size={64} className="text-green-400" strokeWidth={3} />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-white leading-tight">Published!</h2>
          <p className="text-white/40 text-lg font-medium leading-relaxed max-w-xs">Farmers near you will now see your high-quality stock.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 space-y-12 pb-32">
      {/* Immersive Stepper */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h1 className="text-3xl font-black text-white/95 tracking-tight">{t.addInventory}</h1>
           {step > 1 && (
             <button onClick={() => setStep(step - 1)} className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/40">
                <ChevronLeft size={20} />
             </button>
           )}
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.4)]' : 'bg-white/5'}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-6">
            <label className="block text-xl font-black text-white/70">Pick a Category</label>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id} 
                  className="spring-btn flex flex-col items-start gap-4 p-7 glass-card rounded-[36px] border-white/10 transition-all hover:bg-white/10 active:border-[#F59E0B]/40"
                  onClick={() => setStep(2)}
                >
                  <span className="text-4xl">{cat.icon}</span>
                  <span className="font-black text-lg text-white/90">{isMr ? cat.nameMr : cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-6">
            <label className="block text-xl font-black text-white/70">Evidence (Stock Photos)</label>
            <div className="flex gap-5">
              <button className="spring-btn w-32 h-32 bg-white/5 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center gap-3 text-white/30 group">
                <Camera size={32} className="group-hover:text-[#F59E0B] transition-colors" />
                <span className="text-[10px] font-black tracking-widest uppercase">Capture</span>
              </button>
              <div className="w-32 h-32 bg-white/2 rounded-[32px] flex items-center justify-center border border-white/5 shadow-inner">
                <Plus size={24} className="text-white/10" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">{t.variety}</label>
              <input type="text" placeholder="e.g. CO 86032" className="w-full p-6 bg-white/5 border border-white/10 rounded-[28px] text-xl font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-[#F59E0B]/40 transition-colors" />
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">{t.price}</label>
                <input type="number" placeholder="₹" className="w-full p-6 bg-white/5 border border-white/10 rounded-[28px] text-xl font-bold text-[#F59E0B] placeholder:text-white/10 focus:outline-none focus:border-[#F59E0B]/40" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Unit</label>
                <div className="relative">
                   <select className="w-full p-6 bg-white/5 border border-white/10 rounded-[28px] text-xl font-bold text-white/80 appearance-none focus:outline-none focus:border-[#F59E0B]/40">
                    <option className="bg-[#132413]">per Plant</option>
                    <option className="bg-[#132413]">per kg</option>
                    <option className="bg-[#132413]">per bundle</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setStep(3)}
            className="spring-btn w-full bg-[#2D5A27] text-white py-6 rounded-[32px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl border border-white/10"
          >
            Next Details
            <ArrowRight size={24} strokeWidth={3} />
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-br from-[#2D5A27] to-[#14532D] text-white p-8 rounded-[48px] space-y-6 shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
                <ShieldCheck size={160} />
            </div>
            <h3 className="text-2xl font-black leading-tight">Trust Badge</h3>
            <p className="text-white/70 font-medium leading-relaxed">Upload a clear photo of your ID to get the <span className="text-[#F59E0B] font-black">Verified Seller</span> badge.</p>
            <button className="spring-btn w-full bg-white text-[#2D5A27] py-4 rounded-[24px] font-black text-sm tracking-widest uppercase shadow-xl">Upload Identity</button>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Quantity Available</label>
                <input type="number" placeholder="Stock count..." className="w-full p-6 bg-white/5 border border-white/10 rounded-[28px] text-xl font-bold text-white placeholder:text-white/10 focus:outline-none" />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Description</label>
                <textarea rows={3} placeholder="Tell buyers about quality and source..." className="w-full p-6 bg-white/5 border border-white/10 rounded-[32px] text-lg font-bold text-white placeholder:text-white/10 focus:outline-none" />
            </div>
          </div>

          <button 
            onClick={handlePublish}
            className="spring-btn w-full bg-[#F59E0B] text-[#132413] py-7 rounded-[36px] font-black text-2xl shadow-2xl shadow-amber-900/40 uppercase tracking-widest border-4 border-white/20"
          >
            {t.publish}
          </button>
        </div>
      )}
    </div>
  );
};

export default SellScreen;
