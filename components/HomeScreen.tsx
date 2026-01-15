
import React, { useState, useEffect, useRef } from 'react';
import { Search, Star, ShieldCheck, Leaf, ChevronRight, CheckCircle2, X, Scale, MessageCircle } from 'lucide-react';
import { Language, Product } from '../types';
import { PRODUCTS, SELLERS, CATEGORIES, TRANSLATIONS } from '../constants';

interface HomeScreenProps {
  lang: Language;
  onViewDetails: (p: Product) => void;
  onOpenAssistant?: () => void; // Added for Android FAB
}

const AnimatedCard: React.FC<{ 
  children: React.ReactNode; 
  index: number; 
  onClick: () => void;
  isSelected: boolean;
  onToggleSelect: (e: React.MouseEvent) => void;
}> = ({ children, index, onClick, isSelected, onToggleSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <button 
        onClick={onToggleSelect}
        className={`absolute top-4 right-4 z-20 p-2 rounded-full backdrop-blur-md transition-all ${
          isSelected ? 'bg-[#F59E0B] text-white' : 'bg-black/20 text-white/40'
        }`}
      >
        <CheckCircle2 size={20} />
      </button>
      <div onClick={onClick} className="cursor-pointer">{children}</div>
    </div>
  );
};

const HomeScreen: React.FC<HomeScreenProps & { onOpenAssistant?: () => void }> = ({ lang, onViewDetails, onOpenAssistant }) => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  
  const isMr = lang === Language.MARATHI;
  const t = TRANSLATIONS[isMr ? 'mr' : 'en'];

  const toggleSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredProducts = PRODUCTS.filter(p => 
    (isMr ? p.nameMr : p.name).toLowerCase().includes(search.toLowerCase()) ||
    (isMr ? p.varietyMr : p.variety).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pb-32 space-y-8 relative">
      {/* Material Search Bar */}
      <div className="bg-white/5 rounded-2xl flex items-center px-4 py-3 border border-white/10 mt-2">
        <Search size={20} className="text-white/40" />
        <input 
          type="text" 
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none focus:ring-0 w-full ml-3 text-white placeholder:text-white/20"
        />
      </div>

      {/* Categories Chips */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button key={cat.id} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 whitespace-nowrap">
            <span>{cat.icon}</span>
            <span className="text-xs font-bold text-white/70">{isMr ? cat.nameMr : cat.name}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-black text-white/90">{t.nearYou}</h2>
        <div className="grid grid-cols-1 gap-6">
          {filteredProducts.map((product, idx) => {
            const seller = SELLERS.find(s => s.id === product.sellerId);
            return (
              <AnimatedCard 
                key={product.id} 
                index={idx} 
                onClick={() => onViewDetails(product)}
                isSelected={selectedIds.includes(product.id)}
                onToggleSelect={(e) => toggleSelection(e, product.id)}
              >
                <div className="glass-card overflow-hidden group">
                  <div className="relative h-48">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <p className="text-[10px] font-black text-[#F59E0B] uppercase tracking-widest">{isMr ? product.varietyMr : product.variety}</p>
                      <h3 className="text-2xl font-black text-white leading-tight">{isMr ? product.nameMr : product.name}</h3>
                    </div>
                  </div>
                  <div className="p-5 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-white/40">{seller?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-black text-[#F59E0B]">₹{product.price}</span>
                        <span className="text-[10px] text-white/30 uppercase">/{isMr ? product.unitMr : product.unit}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-white/20">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>

      {/* Material FAB for AI Assistant ( quintessential Android ) */}
      <button 
        onClick={onOpenAssistant}
        className="fixed bottom-24 right-6 w-16 h-16 bg-[#2D5A27] text-[#F59E0B] rounded-[24px] flex items-center justify-center shadow-2xl border border-white/10 z-40 active:scale-95 transition-transform"
      >
        <MessageCircle size={28} strokeWidth={2.5} />
      </button>

      {/* Comparison Modal ( simplified for Android feel ) */}
      {selectedIds.length > 1 && !showComparison && (
        <div className="fixed bottom-24 left-4 right-24 z-40 animate-in slide-in-from-left duration-300">
          <button 
            onClick={() => setShowComparison(true)}
            className="bg-[#F59E0B] text-[#132413] px-6 py-4 rounded-full font-black text-sm shadow-2xl flex items-center gap-2"
          >
            <Scale size={18} />
            {isMr ? `${selectedIds.length} तुलना करा` : `Compare ${selectedIds.length}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
