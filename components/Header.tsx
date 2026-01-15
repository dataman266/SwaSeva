
import React from 'react';
import { Language } from '../types';
import { MapPin, Search, Languages, Menu } from 'lucide-react';

interface HeaderProps {
  location: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAssistant: () => void;
}

const Header: React.FC<HeaderProps> = ({ location, language, onLanguageChange, onOpenAssistant }) => {
  return (
    <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between bg-[#0E1A0E]/80 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <button className="p-2 text-white/70 hover:bg-white/5 rounded-full">
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-black text-white leading-none tracking-tight">Kisan Mandi</h1>
          <div className="flex items-center gap-1 text-[#F59E0B] opacity-80">
            <MapPin size={10} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{location}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onLanguageChange(language === Language.ENGLISH ? Language.MARATHI : Language.ENGLISH)}
          className="p-2 text-white/70 hover:bg-white/5 rounded-full flex items-center gap-1"
        >
          <Languages size={20} />
          <span className="text-[10px] font-bold">{language === Language.ENGLISH ? 'मराठी' : 'EN'}</span>
        </button>
        <button className="p-2 text-white/70 hover:bg-white/5 rounded-full">
          <Search size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header;
