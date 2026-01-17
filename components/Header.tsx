
import React from 'react';
import { Language } from '../types';
import { MapPin, Languages, Menu, Bell } from 'lucide-react';

interface HeaderProps {
  location: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAssistant: () => void;
}

const Header: React.FC<HeaderProps> = ({ location, language, onLanguageChange }) => {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 pb-3 flex items-center justify-between bg-[#0E1A0E]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-4">
        <button className="p-2.5 text-white/70 hover:bg-white/5 rounded-full transition-colors active:scale-90">
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-white leading-tight tracking-tight italic">Apla<span className="text-[#F59E0B] not-italic">.</span>AgriMart</h1>
          <div className="flex items-center gap-1.5 text-[#F59E0B] group">
            <MapPin size={10} className="animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100 transition-opacity">{location}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <button 
          onClick={() => onLanguageChange(language === Language.ENGLISH ? Language.MARATHI : Language.ENGLISH)}
          className="px-3 py-1.5 text-white/70 hover:bg-white/5 rounded-full flex items-center gap-2 border border-white/10 active:scale-95 transition-all"
        >
          <Languages size={16} className="text-[#F59E0B]" />
          <span className="text-[10px] font-black tracking-widest">{language === Language.ENGLISH ? 'मराठी' : 'ENG'}</span>
        </button>
        <button className="p-2.5 text-white/70 hover:bg-white/5 rounded-full relative">
          <Bell size={22} />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0E1A0E]"></div>
        </button>
      </div>
    </header>
  );
};

export default Header;
