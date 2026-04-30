import React, { useState } from 'react';
import { Store } from 'lucide-react';
import { Language, UserRole } from '../types.ts';
import ShopRegistrationView from './dukaan/ShopRegistrationView.tsx';
import MyListingsScreen from './MyListingsScreen.tsx';

interface Props {
  lang: Language;
  onRegistered: (role: UserRole) => void;
  onCreateNew: () => void;
}

export default function MyShopGateScreen({ lang, onRegistered, onCreateNew }: Props) {
  const [showRegistration, setShowRegistration] = useState(false);
  const isMr = lang === Language.MARATHI;

  if (showRegistration) {
    return (
      <ShopRegistrationView
        lang={lang}
        onSave={(profile) => {
          localStorage.setItem('agrimart_user_role', 'shopkeeper');
          localStorage.setItem('agrimart_shop_profile', JSON.stringify(profile));
          onRegistered('shopkeeper');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A1A0A' }}>
      {/* Dukandaar registration CTA */}
      <div className="mx-4 mt-4 mb-2 rounded-2xl p-4 flex items-center gap-3"
        style={{ background: 'rgba(45,90,27,0.18)', border: '1px solid rgba(76,175,80,0.25)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(45,90,27,0.4)' }}>
          <Store size={20} color="#4CAF50" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#F5F0E8]">
            {isMr ? 'दुकानदार व्हा' : 'Open Your Dukaan'}
          </p>
          <p className="text-[11px] text-[rgba(245,240,232,0.45)] mt-0.5">
            {isMr
              ? 'कृषी निविष्ठा उत्पादने विका, इन्व्हेंटरी व्यवस्थापित करा'
              : 'Sell agri-input products, manage inventory'}
          </p>
        </div>
        <button
          onClick={() => setShowRegistration(true)}
          className="flex-shrink-0 px-3 py-2 rounded-full text-[12px] font-semibold active:scale-95 transition-all"
          style={{ background: '#2D5A1B', color: '#F5F0E8', touchAction: 'manipulation' }}
        >
          {isMr ? 'नोंदणी करा' : 'Register →'}
        </button>
      </div>

      {/* Farmer's produce listings below */}
      <MyListingsScreen lang={lang} onCreateNew={onCreateNew} />
    </div>
  );
}
