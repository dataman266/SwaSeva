import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Language, UserRole } from '../types.ts';
import DashboardTab from './dukaan/DashboardTab.tsx';
import InventoryTab from './dukaan/InventoryTab.tsx';
import OrdersTab from './dukaan/OrdersTab.tsx';

interface Props {
  lang: Language;
  onBack: () => void;
  userRole: UserRole;
}

type DukaanTab = 'dashboard' | 'inventory' | 'orders';

export default function DukaanScreen({ lang, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<DukaanTab>('dashboard');
  const isMr = lang === 'mr';

  const tabs: { id: DukaanTab; label: string }[] = [
    { id: 'dashboard', label: isMr ? 'डॅशबोर्ड' : 'Dashboard' },
    { id: 'inventory', label: isMr ? 'इन्व्हेंटरी' : 'Inventory' },
    { id: 'orders',    label: isMr ? 'ऑर्डर्स'   : 'Orders'    },
  ];

  let shopName = isMr ? 'माझे दुकान' : 'My Shop';
  try {
    const profile = JSON.parse(localStorage.getItem('agrimart_shop_profile') ?? '{}');
    if (profile?.shopName) shopName = profile.shopName;
  } catch { /* ignore */ }

  return (
    <div className="min-h-screen" style={{ background: '#0A1A0A' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 border-b border-[rgba(245,240,232,0.08)]"
        style={{ background: 'rgba(10,26,10,0.96)', backdropFilter: 'blur(12px)' }}
      >
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[rgba(245,240,232,0.12)] active:scale-90 transition-all"
        >
          <ArrowLeft size={18} className="text-[#F5F0E8]" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[rgba(245,240,232,0.4)]">
            {isMr ? 'दुकानदार मोड' : 'Dukandaar Mode'}
          </p>
          <h1 className="text-[17px] font-semibold text-[#F5F0E8] leading-tight truncate">{shopName}</h1>
        </div>
        <div
          className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.1em]"
          style={{ background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.25)', color: '#F5C518' }}
        >
          {isMr ? 'समीक्षा अंतर्गत 🕐' : 'Under Review 🕐'}
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="sticky top-[72px] z-30 flex border-b border-[rgba(245,240,232,0.08)]"
        style={{ background: 'rgba(10,26,10,0.96)', backdropFilter: 'blur(12px)' }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3.5 text-[13px] font-semibold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'text-[#E8C84A] border-[#E8C84A]'
                : 'text-[rgba(245,240,232,0.45)] border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="overflow-y-auto pb-24">
        {activeTab === 'dashboard' && <DashboardTab lang={lang} onGoToInventory={() => setActiveTab('inventory')} />}
        {activeTab === 'inventory' && <InventoryTab lang={lang} />}
        {activeTab === 'orders'    && <OrdersTab    lang={lang} />}
      </div>
    </div>
  );
}
