
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, CheckCircle2, Scale, MessageCircle, MapPin, Filter } from 'lucide-react';
import { Language, Product } from '../types.ts';
import { PRODUCTS, SELLERS, CATEGORIES, TRANSLATIONS } from '../constants.tsx';

interface HomeScreenProps {
  lang: Language;
  onViewDetails: (p: Product) => void;
  onOpenAssistant: () => void;
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
      className={`relative transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <button 
        onClick={onToggleSelect}
        className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md transition-all active:scale-90 ${
          isSelected ? 'bg-[#F59E0B] text-[#0E1A0E] scale-110 shadow-lg' : 'bg-black/30 text-white/50 border border-white/10'
        }`}
      >
        <CheckCircle2 size={18} strokeWidth={3} />
      </button>
      <div onClick={onClick} className="cursor-pointer active:scale-[0.98] transition-transform duration-200">{children}</div>
    </div>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ lang, onViewDetails, onOpenAssistant }) => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const isMr = lang === Language.MARATHI;
  const t = TRANSLATIONS[isMr ? 'mr' : 'en'];

  const toggleSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = (isMr ? p.nameMr : p.name).toLowerCase().includes(search.toLowerCase()) ||
                         (isMr ? p.varietyMr : p.variety).toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-4 pt-2 pb-36 space-y-8 min-h-screen">
      {/* Material 3 Search Bar */}
      <div className="sticky top-16 z-30 pt-2">
        <div className="bg-[#1A2E1A] rounded-[28px] flex items-center px-5 py-4 shadow-xl border border-white/5 group focus-within:border-[#F59E0B]/30 transition-all">
          <Search size={22} className="text-white/40 group-focus-within:text-[#F59E0B] transition-colors" />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none focus:ring-0 w-full ml-4 text-white font-medium placeholder:text-white/20"
          />
          <button className="p-1 text-white/40"><Filter size={20} /></button>
        </div>
      </div>

      {/* Categories Chips */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
        <button 
          onClick={() => setActiveCategory('all')}
          className={`px-6 py-2.5 rounded-full border transition-all font-bold text-xs whitespace-nowrap ${activeCategory === 'all' ? 'bg-[#2D5A27] border-[#2D5A27] text-white' : 'bg-white/5 border-white/10 text-white/50'}`}
        >
          {isMr ? 'सर्व' : 'All'}
        </button>
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id} 
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all whitespace-nowrap ${activeCategory === cat.name ? 'bg-[#2D5A27] border-[#2D5A27] text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/50'}`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span className="text-xs font-bold">{isMr ? cat.nameMr : cat.name}</span>
          </button>
        ))}
      </div>

      {/* Featured Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-2xl font-black text-white/95 tracking-tight">{t.nearYou}</h2>
          <span className="text-[10px] font-black text-[#F59E0B] bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">LIVE MARKET</span>
        </div>
        
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
                <div className="glass-card overflow-hidden group border-white/5 hover:border-white/10 transition-colors shadow-2xl">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A0E] via-transparent to-black/20"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="bg-black/50 backdrop-blur-md text-[9px] font-black text-white px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                         {isMr ? product.category : product.category}
                       </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[10px] font-black text-[#F59E0B] uppercase tracking-[0.2em] mb-1">{isMr ? product.varietyMr : product.variety}</p>
                      <h3 className="text-2xl font-black text-white leading-tight drop-shadow-lg">{isMr ? product.nameMr : product.name}</h3>
                    </div>
                  </div>
                  <div className="p-6 flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-white/40">
                         <MapPin size={12} className="text-[#F59E0B]" />
                         <span className="text-xs font-bold">{seller?.location}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-2xl font-black text-[#F59E0B]">₹{product.price}</span>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">/{isMr ? product.unitMr : product.unit}</span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-white/5 rounded-2xl text-white/40 group-hover:text-[#F59E0B] group-hover:bg-[#F59E0B]/10 transition-all border border-white/5">
                      <ChevronRight size={22} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>

      {/* Assistant FAB */}
      <button 
        onClick={onOpenAssistant}
        className="fixed bottom-28 right-6 w-16 h-16 bg-[#2D5A27] text-[#F59E0B] rounded-[24px] flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/10 z-[60] active:scale-90 transition-all hover:brightness-110 active:rotate-12"
      >
        <MessageCircle size={30} strokeWidth={2.5} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F59E0B] rounded-full border-2 border-[#0E1A0E] animate-pulse"></div>
      </button>

      {/* Compare Tool */}
      {selectedIds.length > 1 && (
        <div className="fixed bottom-28 left-6 z-[60] animate-in slide-in-from-left duration-500">
          <button 
            className="bg-[#F59E0B] text-[#0E1A0E] px-7 py-4 rounded-[20px] font-black text-sm shadow-2xl flex items-center gap-3 active:scale-95 transition-transform"
          >
            <Scale size={20} />
            <span className="uppercase tracking-widest">{isMr ? `${selectedIds.length} तुलना करा` : `Compare ${selectedIds.length}`}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
