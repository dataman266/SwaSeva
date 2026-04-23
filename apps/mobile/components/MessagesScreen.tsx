import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Phone } from 'lucide-react';
import { Language } from '../types.ts';
import { SELLERS, TRANSLATIONS } from '../constants.tsx';

const CONNECTIONS_KEY = 'agrimart_connections';

interface Connection {
  id: string;
  sellerId: string;
  sellerName: string;
  productId: string | null;
  productName: string | null;
  message: string;
  timestamp: number;
  unread: boolean;
}

interface MessagesScreenProps {
  lang: Language;
  onViewSeller?: (sellerId: string) => void;
}

export default function MessagesScreen({ lang, onViewSeller }: MessagesScreenProps) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeChat, setActiveChat] = useState<Connection | null>(null);

  const isMr = lang === Language.MARATHI;
  const t    = TRANSLATIONS[isMr ? 'mr' : 'en'];

  useEffect(() => {
    const raw: Connection[] = JSON.parse(localStorage.getItem(CONNECTIONS_KEY) || '[]');
    // Sort by most recent first, dedupe by sellerId (show latest per seller)
    const bySellerMap = new Map<string, Connection>();
    [...raw].sort((a, b) => b.timestamp - a.timestamp).forEach(c => {
      if (!bySellerMap.has(c.sellerId)) bySellerMap.set(c.sellerId, c);
    });
    setConnections(Array.from(bySellerMap.values()));
  }, []);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const seller = activeChat ? SELLERS.find(s => s.id === activeChat.sellerId) : null;

  // ── Chat thread view ───────────────────────────────────────────────
  if (activeChat) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0A1A0A' }}>

        {/* Chat header */}
        <div
          className="flex items-center gap-3 px-5 pt-safe pt-4 pb-4 border-b border-[rgba(245,240,232,0.06)]"
          style={{ background: 'rgba(10,26,10,0.95)' }}
        >
          <button
            onClick={() => setActiveChat(null)}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.15)] active:scale-90 transition-all"
            style={{ touchAction: 'manipulation' }}
          >
            <ArrowLeft size={16} className="text-[#F5F0E8]" />
          </button>
          {/* Seller avatar */}
          {seller && (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: seller.avatarColor, border: '1px solid rgba(245,240,232,0.1)' }}
            >
              <span className="text-[#F5F0E8] font-medium" style={{ fontSize: '14px' }}>{seller.name.charAt(0)}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[#F5F0E8] truncate" style={{ fontSize: '15px', letterSpacing: '-0.01em' }}>
              {activeChat.sellerName}
            </p>
            {activeChat.productName && (
              <p className="text-[10px] text-[rgba(245,240,232,0.35)] truncate">{activeChat.productName}</p>
            )}
          </div>
          {seller && (
            <a
              href={`tel:${seller.phone}`}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(245,240,232,0.15)] active:scale-90 transition-all"
              style={{ touchAction: 'manipulation' }}
            >
              <Phone size={15} className="text-[#E8C84A]" />
            </a>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">
          {/* Product context pill */}
          {activeChat.productName && (
            <div className="flex justify-center">
              <span
                className="text-[9px] font-medium tracking-[0.15em] uppercase px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(212,196,160,0.08)', border: '1px solid rgba(212,196,160,0.15)', color: 'rgba(212,196,160,0.6)' }}
              >
                {isMr ? 'चौकशी:' : 'Enquiry:'} {activeChat.productName}
              </span>
            </div>
          )}

          {/* Auto-message bubble (from user) */}
          <div className="flex justify-end">
            <div
              className="max-w-[78%] px-4 py-3 rounded-2xl rounded-br-md"
              style={{ background: '#2E7D32', border: '1px solid rgba(74,140,42,0.3)' }}
            >
              <p className="font-light text-[#F5F0E8] leading-relaxed" style={{ fontSize: '14px' }}>
                {activeChat.message}
              </p>
              <p className="text-right mt-1 text-[10px] text-[rgba(245,240,232,0.45)]">
                {formatTime(activeChat.timestamp)}
              </p>
            </div>
          </div>

          {/* Auto-reply bubble (from seller) */}
          <div className="flex justify-start">
            <div
              className="max-w-[78%] px-4 py-3 rounded-2xl rounded-bl-md"
              style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.08)' }}
            >
              <p className="font-light text-[rgba(245,240,232,0.75)] leading-relaxed" style={{ fontSize: '14px' }}>
                {isMr
                  ? `नमस्कार! आम्ही तुमची चौकशी मिळाली. लवकरच संपर्क करू. धन्यवाद! 🙏`
                  : `Hello! We've received your enquiry and will get back to you shortly. Thank you!`}
              </p>
              <p className="text-left mt-1 text-[10px] text-[rgba(245,240,232,0.35)]">
                {formatTime(activeChat.timestamp + 60000)}
              </p>
            </div>
          </div>

          {/* Offline notice */}
          <div className="flex justify-center mt-4">
            <span
              className="text-[9px] font-medium tracking-[0.12em] uppercase px-4 py-2 rounded-full"
              style={{ background: 'rgba(245,240,232,0.04)', color: 'rgba(245,240,232,0.25)' }}
            >
              {isMr ? 'संदेश WhatsApp द्वारे पाठवले जातात' : 'Messages delivered via WhatsApp or Phone'}
            </span>
          </div>
        </div>

        {/* WhatsApp redirect */}
        {seller && (
          <div
            className="px-5 pb-safe pb-6 pt-4 border-t border-[rgba(245,240,232,0.06)]"
            style={{ background: 'rgba(10,26,10,0.95)' }}
          >
            <a
              href={`https://wa.me/${seller.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(activeChat.message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-full font-medium text-[13px] tracking-[0.05em] active:scale-95 transition-all text-[#F5F0E8]"
              style={{ background: '#25D366' }}
            >
              <MessageSquare size={16} />
              {isMr ? 'WhatsApp वर संपर्क करा' : 'Continue on WhatsApp'}
            </a>
          </div>
        )}
      </div>
    );
  }

  // ── Conversations list ─────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#0A1A0A' }}>

      {/* Header */}
      <div className="px-6 pt-safe pt-6 pb-5">
        <h1 className="font-light text-[#F5F0E8]" style={{ fontSize: 'clamp(26px, 7vw, 34px)', letterSpacing: '-0.03em' }}>
          {t.messages}
        </h1>
        <p className="text-[12px] font-light text-[rgba(245,240,232,0.4)] mt-1">
          {connections.length > 0
            ? `${connections.length} ${isMr ? 'संभाषण' : 'conversation' + (connections.length !== 1 ? 's' : '')}`
            : (isMr ? 'कोणतेही संदेश नाहीत' : 'No messages yet')}
        </p>
      </div>

      {/* List */}
      {connections.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-8 pt-20 text-center">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
            style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
          >
            <MessageSquare size={32} className="text-[rgba(212,196,160,0.4)]" />
          </div>
          <p className="font-medium text-[#F5F0E8] mb-2" style={{ fontSize: '17px', letterSpacing: '-0.01em' }}>
            {t.noMessages}
          </p>
          <p className="font-light text-[rgba(245,240,232,0.4)] leading-relaxed" style={{ fontSize: '13px' }}>
            {t.noMessagesDesc}
          </p>
        </div>
      ) : (
        <div className="px-5 flex flex-col gap-2">
          {connections.map(conn => {
            const sellerData = SELLERS.find(s => s.id === conn.sellerId);
            return (
              <button
                key={conn.id}
                onClick={() => setActiveChat(conn)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left active:scale-[0.98] transition-transform"
                style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)', touchAction: 'manipulation' }}
              >
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: sellerData?.avatarColor || '#1E3A1E', border: '1px solid rgba(245,240,232,0.08)' }}
                >
                  <span className="text-[#F5F0E8] font-medium" style={{ fontSize: '18px' }}>
                    {conn.sellerName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-[#F5F0E8] truncate" style={{ fontSize: '14px', letterSpacing: '-0.01em' }}>
                      {conn.sellerName}
                    </p>
                    <span className="text-[10px] text-[rgba(245,240,232,0.3)] ml-2 flex-shrink-0">
                      {formatTime(conn.timestamp)}
                    </span>
                  </div>
                  {conn.productName && (
                    <p className="text-[10px] text-[#E8C84A] mb-1 truncate">{conn.productName}</p>
                  )}
                  <p className="text-[12px] font-light text-[rgba(245,240,232,0.4)] truncate">{conn.message}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
