import React, { useState } from 'react';
import {
  ArrowLeft, Phone, MessageSquare, ShieldCheck, Star,
  MapPin, Package, Calendar, TrendingUp,
} from 'lucide-react';
import { Language, Product, MappedShopProduct } from '../types.ts';
import { SELLERS, PRODUCTS, MOCK_SHOP_PROFILES, MOCK_SHOP_ITEMS, getTranslations } from '../constants.tsx';
import SectionReveal from './atoms/SectionReveal.tsx';

const CONNECTIONS_KEY = 'agrimart_connections';

interface SellerProfileScreenProps {
  sellerId: string;
  lang: Language;
  onBack: () => void;
  onViewProduct: (product: Product) => void;
  onSendEnquiry: (sellerId: string) => void;
}

export default function SellerProfileScreen({ sellerId, lang, onBack, onViewProduct, onSendEnquiry }: SellerProfileScreenProps) {
  const [enquiryToast, setEnquiryToast] = useState(false);
  const isMr   = lang === Language.MARATHI;
  const t      = getTranslations(lang);
  const isShop = sellerId.startsWith('shop_');
  const seller = !isShop ? SELLERS.find(s => s.id === sellerId) : undefined;
  const listings = !isShop ? PRODUCTS.filter(p => p.sellerId === sellerId) : [];
  const shopProfile = isShop ? MOCK_SHOP_PROFILES.find(sp => sp.shopkeeperId === sellerId) : null;
  const shopItems: MappedShopProduct[] = isShop
    ? MOCK_SHOP_ITEMS
        .filter(si => si.shopkeeperId === sellerId && si.isActive)
        .map(si => ({
          id: si.id,
          name: si.name,
          nameMr: si.nameMr,
          sellerId: si.shopkeeperId,
          price: si.price,
          unit: si.unit,
          unitMr: si.unit,
          quantity: si.stockQty,
          imageUrl: si.imageUris[0] || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
          photos: si.imageUris,
          category: si.category,
          variety: si.brand || '',
          varietyMr: si.brand || '',
          description: si.description,
          descriptionMr: si.descriptionMr,
          isDukaanItem: true as const,
          brand: si.brand,
          expiryDate: si.expiryDate,
        }))
    : [];

  const displayName     = isShop ? (isMr ? (shopProfile?.shopNameMr || shopProfile?.shopName) : shopProfile?.shopName) ?? 'Dukandaar' : seller?.name ?? '';
  const displayLocation = isShop ? shopProfile?.location ?? '' : seller?.location ?? '';
  const avatarBg        = isShop ? 'rgba(45,90,27,0.5)' : seller?.avatarColor ?? '#2D5A1B';
  const specialityTags  = isShop
    ? [...new Set(MOCK_SHOP_ITEMS.filter(si => si.shopkeeperId === sellerId).map(si => si.category))]
    : seller?.speciality ?? [];

  if (!seller && !shopProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A1A0A' }}>
        <button onClick={onBack} className="text-[#E8C84A]">← Back</button>
      </div>
    );
  }

  const bio = seller ? (isMr ? seller.bioMr : seller.bio) : '';

  const handleEnquiry = () => {
    const entityId   = isShop ? (shopProfile?.shopkeeperId ?? sellerId) : (seller?.id ?? sellerId);
    const entityName = isShop ? (shopProfile?.shopName ?? 'Dukandaar') : (seller?.name ?? '');
    const autoMsg = isMr
      ? `नमस्कार ${entityName}, मला तुमच्या उत्पादनांबद्दल अधिक माहिती हवी आहे.`
      : `Hi ${entityName}, I'd like to know more about your products on Swaseva.`;

    const connections: object[] = JSON.parse(localStorage.getItem(CONNECTIONS_KEY) || '[]');
    const existing = connections.find((c: any) => c.sellerId === entityId && !c.productId);
    if (!existing) {
      connections.push({
        id: `${entityId}_general_${Date.now()}`,
        sellerId: entityId,
        sellerName: entityName,
        productId: null,
        productName: null,
        message: autoMsg,
        timestamp: Date.now(),
        unread: false,
      });
      localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
    }

    setEnquiryToast(true);
    setTimeout(() => {
      setEnquiryToast(false);
      onSendEnquiry(entityId);
    }, 900);
  };

  const stats = isShop ? [
    { icon: Package,    label: isMr ? 'उत्पादने' : 'Products',  value: `${shopItems.length}` },
    { icon: ShieldCheck, label: isMr ? 'स्थिती' : 'Status',    value: isMr ? 'सत्यापित' : 'Active' },
    { icon: MapPin,     label: isMr ? 'अंतर' : 'Distance',     value: shopProfile?.distance || '—' },
    { icon: Star,       label: isMr ? 'प्रकार' : 'Type',       value: isMr ? 'दुकान' : 'Shop' },
  ] : [
    { icon: Calendar,   label: t.daysOnApp,  value: `${seller!.daysOnApp}` },
    { icon: TrendingUp, label: t.itemsSold,   value: seller!.totalSold >= 1000 ? `${(seller!.totalSold / 1000).toFixed(1)}k` : `${seller!.totalSold}` },
    { icon: Star,       label: isMr ? 'रेटिंग' : 'Rating',    value: `${seller!.rating}` },
    { icon: Package,    label: isMr ? 'लिस्टिंग' : 'Listings', value: `${listings.length}` },
  ];

  return (
    <div className="min-h-screen pb-36" style={{ background: '#0A1A0A' }}>

      {/* ── Hero banner ────────────────────────────────────────── */}
      <div className="relative h-52 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${avatarBg} 0%, #0A1A0A 100%)` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A0A] to-transparent" />

        {/* Back button */}
        <div className="absolute top-0 left-0 right-0 flex items-center px-5 pt-safe pt-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.2)] bg-[rgba(10,26,10,0.5)] text-[#F5F0E8] active:scale-90 transition-all nav-blur"
            style={{ touchAction: 'manipulation' }}
          >
            <ArrowLeft size={18} />
          </button>
          <span className="ml-4 text-[11px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.45)]">
            {isShop ? (isMr ? 'दुकान प्रोफाइल' : 'Shop Profile') : t.sellerProfile}
          </span>
        </div>

        {/* Avatar circle */}
        <div className="absolute bottom-6 left-5 flex items-end gap-4">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0"
            style={{
              background: avatarBg,
              border: '2px solid rgba(245,240,232,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {isShop ? (
              <span style={{ fontSize: '36px' }}>🏪</span>
            ) : (
              <span className="text-[#F5F0E8] font-light" style={{ fontSize: '36px', letterSpacing: '-0.03em' }}>
                {displayName.charAt(0)}
              </span>
            )}
          </div>
          <div className="pb-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-medium text-[#F5F0E8]" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>
                {displayName}
              </h1>
              {(isShop || seller?.isVerified) && <ShieldCheck size={15} className="text-[#4CAF50]" />}
            </div>
            {isShop ? (
              <span
                className="text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(45,90,27,0.5)', color: '#7EC95A', border: '1px solid rgba(74,140,42,0.4)' }}
              >
                {isMr ? 'सत्यापित दुकानदार' : 'Verified Dukandaar'}
              </span>
            ) : (
              <p className="text-[11px] font-light text-[rgba(245,240,232,0.45)]">{displayLocation}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="px-5 space-y-6 mt-4">

        {/* Stats strip */}
        <SectionReveal>
          <div className="grid grid-cols-4 gap-2">
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 py-4 rounded-2xl"
                style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
              >
                <Icon size={14} className="text-[#E8C84A]" />
                <span className="font-light text-[#F5F0E8]" style={{ fontSize: '18px', letterSpacing: '-0.02em' }}>{value}</span>
                <span className="text-[8px] font-medium tracking-[0.12em] uppercase text-[rgba(245,240,232,0.3)] text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Speciality / category tags */}
        {specialityTags.length > 0 && (
          <SectionReveal delay={60}>
            <div className="flex flex-wrap gap-2">
              {specialityTags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-medium tracking-[0.12em] uppercase px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(212,196,160,0.08)', border: '1px solid rgba(212,196,160,0.2)', color: '#E8C84A' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </SectionReveal>
        )}

        {/* Bio / About */}
        <SectionReveal delay={80}>
          <div className="p-5 rounded-2xl" style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}>
            <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.3)] mb-3">
              {isMr ? 'आमच्याबद्दल' : 'About'}
            </p>
            <p className="font-light leading-relaxed text-[rgba(245,240,232,0.7)]" style={{ fontSize: '14px' }}>
              {isShop
                ? (isMr
                    ? `${displayName} हे एक विश्वसनीय कृषी निविष्ठा दुकान आहे. येथे बियाणे, खते, कीटकनाशके आणि इतर शेती साहित्य उपलब्ध आहे.`
                    : `${displayName} is a trusted agricultural inputs store offering seeds, fertilizers, pesticides, and farming tools.`)
                : bio}
            </p>
          </div>
        </SectionReveal>

        {/* Contact details */}
        <SectionReveal delay={100}>
          <div className="p-5 rounded-2xl" style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}>
            <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.3)] mb-4">
              {isShop ? (isMr ? 'संपर्क' : 'Contact') : t.contactSeller}
            </p>
            {!isShop && seller && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,196,160,0.08)' }}>
                  <Phone size={15} className="text-[#E8C84A]" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-[rgba(245,240,232,0.35)] uppercase tracking-[0.1em] mb-0.5">{isMr ? 'फोन' : 'Phone'}</p>
                  <p className="font-medium text-[#F5F0E8]" style={{ fontSize: '15px' }}>{seller.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,196,160,0.08)' }}>
                <MapPin size={15} className="text-[#E8C84A]" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-[rgba(245,240,232,0.35)] uppercase tracking-[0.1em] mb-0.5">{isMr ? 'पत्ता' : 'Address'}</p>
                <p className="font-medium text-[#F5F0E8]" style={{ fontSize: '14px' }}>{displayLocation}</p>
              </div>
            </div>
            {/* Call (farmer only) + Message buttons */}
            <div className="flex gap-3 mt-2">
              {!isShop && seller && (
                <a
                  href={`tel:${seller.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full border border-[rgba(245,240,232,0.15)] active:scale-95 transition-all"
                  style={{ touchAction: 'manipulation' }}
                >
                  <Phone size={15} className="text-[#E8C84A]" />
                  <span className="text-[13px] font-medium text-[rgba(245,240,232,0.75)]">{isMr ? 'कॉल' : 'Call'}</span>
                </a>
              )}
              <button
                onClick={handleEnquiry}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full active:scale-95 transition-all"
                style={{ background: '#2E7D32', touchAction: 'manipulation' }}
              >
                <MessageSquare size={15} className="text-[#F5F0E8]" />
                <span className="text-[13px] font-medium text-[#F5F0E8]">{t.sendEnquiry}</span>
              </button>
            </div>
          </div>
        </SectionReveal>

        {/* Listings (farmer) or Shop items */}
        {(isShop ? shopItems : listings).length > 0 && (
          <SectionReveal delay={120}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-px bg-[#E8C84A]" />
                <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[rgba(245,240,232,0.35)]">
                  {isShop ? (isMr ? 'उपलब्ध उत्पादने' : 'Available Products') : t.otherListings}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {(isShop ? shopItems : listings).map(p => {
                  const pName = isMr ? p.nameMr : p.name;
                  const pUnit = isMr ? p.unitMr : p.unit;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onViewProduct(p)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl text-left active:scale-[0.98] transition-transform"
                      style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)', touchAction: 'manipulation' }}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={p.imageUrl}
                          alt={pName}
                          className="w-full h-full object-cover"
                          style={{ filter: 'brightness(0.8) saturate(0.9)' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#F5F0E8] truncate mb-1" style={{ fontSize: '14px', letterSpacing: '-0.01em' }}>{pName}</p>
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="text-[11px] font-light text-[rgba(245,240,232,0.4)]">{p.category}</p>
                          {(p as MappedShopProduct).isDukaanItem && (
                            <span className="text-[8px] font-semibold tracking-[0.08em] uppercase px-1.5 py-0.5 rounded-full"
                              style={{ background: 'rgba(45,90,27,0.4)', color: '#7EC95A', border: '1px solid rgba(74,140,42,0.3)' }}>
                              🏪
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-medium text-[#E8C84A]" style={{ fontSize: '15px' }}>₹{p.price}</span>
                          <span className="text-[10px] text-[rgba(245,240,232,0.35)]">/ {pUnit}</span>
                        </div>
                      </div>
                      <ArrowLeft size={14} className="rotate-180 text-[rgba(245,240,232,0.2)] flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </SectionReveal>
        )}
      </div>

      {/* Enquiry sent toast */}
      {enquiryToast && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full"
          style={{ background: '#2E7D32', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        >
          <ShieldCheck size={15} className="text-[#F5F0E8]" />
          <span className="text-[13px] font-medium text-[#F5F0E8] tracking-[0.05em]">{t.enquirySent}</span>
        </div>
      )}
    </div>
  );
}
