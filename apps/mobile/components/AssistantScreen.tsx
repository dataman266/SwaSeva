import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, Send, Sparkles, RefreshCw, Bot, AlertCircle } from 'lucide-react';
import { Language } from '../types.ts';
import { PRODUCTS } from '../constants.tsx';
import { getAiMarketAssistance } from '../services/geminiService.ts';

interface AssistantScreenProps {
  lang: Language;
  onBack: () => void;
}

interface Message {
  role: 'ai' | 'user';
  text: string;
  time: string;
}

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function AssistantScreen({ lang, onBack }: AssistantScreenProps) {
  const isMr = lang === Language.MARATHI;

  const [messages, setMessages] = useState<Message[]>([{
    role: 'ai',
    text: isMr
      ? 'नमस्कार! मी तुमचा AgriMart सहाय्यक आहे. मी तुम्हाला कशी मदत करू शकतो?'
      : 'Namaste! I am your AgriMart Assistant. How can I help you today?',
    time: now(),
  }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [lastQuery, setLastQuery]       = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const SUGGESTED = isMr
    ? ['टोमॅटो साठी सर्वोत्तम बियाणे?', 'MSP दर काय आहे?', 'आंबा कलमाची काळजी?']
    : ['Best seeds for tomatoes?', 'What is today\'s MSP rate?', 'How to care for mango grafts?'];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const sendQuery = async (text: string) => {
    setNetworkError(false);
    setLastQuery(text);
    setMessages(prev => [...prev, { role: 'user', text, time: now() }]);
    setLoading(true);
    try {
      const reply = await getAiMarketAssistance(text, PRODUCTS, lang);
      setMessages(prev => [...prev, { role: 'ai', text: reply, time: now() }]);
    } catch {
      setNetworkError(true);
    }
    setLoading(false);
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    sendQuery(text);
  };

  const handleRetry = () => {
    if (lastQuery) sendQuery(lastQuery);
  };

  const handleReset = () => {
    setMessages([messages[0]]);
    setNetworkError(false);
    setLastQuery('');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{ background: '#0A1A0A' }}
    >
      {/* Subtle bg glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-20%] right-[-15%] w-[90vw] h-[90vw] rounded-full opacity-10"
          style={{ background: '#2E7D32', filter: 'blur(100px)' }}
        />
      </div>

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div
        className="relative flex items-center gap-3 px-5 py-3 border-b z-20 flex-shrink-0 pt-safe nav-blur"
        style={{ borderColor: 'rgba(245,240,232,0.07)', background: 'rgba(10,26,10,0.85)' }}
      >
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full text-[rgba(245,240,232,0.55)] active:scale-90 transition-all"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#2E7D32', border: '1px solid rgba(212,196,160,0.2)' }}
        >
          <Bot size={18} className="text-[#E8C84A]" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#F5F0E8] leading-none" style={{ fontSize: '14px', letterSpacing: '-0.01em' }}>
            {isMr ? 'किसान सहाय्यक' : 'Kisan Sahayak'}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
            <span className="text-[9px] font-medium tracking-[0.12em] uppercase text-[#4CAF50]">
              {isMr ? 'ऑनलाइन' : 'Online'}
            </span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="w-8 h-8 flex items-center justify-center rounded-full text-[rgba(245,240,232,0.35)] active:scale-90 transition-all hover:text-[rgba(245,240,232,0.65)]"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* ── Message list ────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 space-y-5 scrollbar-hide relative z-10"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 ${m.role === 'user' ? 'items-end' : 'items-start'} animate-[fadeUp_0.35s_cubic-bezier(0.16,1,0.3,1)_both]`}
          >
            {/* Suggested prompts — shown only below the first AI greeting */}
            {i === 0 && messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-3 max-w-[82%]">
                {SUGGESTED.map(s => (
                  <button
                    key={s}
                    onClick={() => sendQuery(s)}
                    className="px-3 py-2 rounded-xl border border-[rgba(245,240,232,0.1)] text-[rgba(245,240,232,0.55)] text-left active:scale-95 transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.03)', fontSize: '12px', fontWeight: 300,
                      touchAction: 'manipulation', lineHeight: 1.4,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div
              className={`max-w-[82%] px-5 py-3.5 rounded-2xl ${
                m.role === 'user'
                  ? 'rounded-tr-sm'
                  : 'rounded-tl-sm'
              }`}
              style={
                m.role === 'user'
                  ? { background: '#2E7D32', border: '1px solid rgba(245,240,232,0.08)' }
                  : { background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }
              }
            >
              <p className="font-light text-[#F5F0E8] leading-relaxed" style={{ fontSize: '14px' }}>
                {m.text}
              </p>
            </div>
            <p className="text-[9px] font-light text-[rgba(245,240,232,0.3)] px-1">
              {m.role === 'user' ? (isMr ? 'तुम्ही' : 'You') : (isMr ? 'सहाय्यक' : 'Assistant')} · {m.time}
            </p>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start animate-[fadeUp_0.3s_both]">
            <div
              className="px-5 py-3.5 rounded-2xl rounded-tl-sm"
              style={{ background: '#162B16', border: '1px solid rgba(245,240,232,0.07)' }}
            >
              <div className="flex gap-1.5 items-center h-4">
                {[0, 0.2, 0.4].map(d => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-[#E8C84A] animate-bounce"
                    style={{ animationDelay: `${d}s`, animationDuration: '0.9s' }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Network error banner */}
        {networkError && !loading && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl animate-[fadeUp_0.3s_both]"
            style={{ background: 'rgba(229,115,115,0.08)', border: '1px solid rgba(229,115,115,0.2)' }}
          >
            <AlertCircle size={15} className="text-[#E57373] flex-shrink-0" />
            <p className="flex-1 font-light text-[rgba(245,240,232,0.7)]" style={{ fontSize: '13px' }}>
              {isMr ? 'नेटवर्क समस्या आली.' : 'Network issue. Please try again.'}
            </p>
            <button
              onClick={handleRetry}
              className="px-3 py-1.5 rounded-full text-[#E57373] border border-[rgba(229,115,115,0.3)] active:scale-95 transition-all"
              style={{ fontSize: '11px', fontWeight: 500, touchAction: 'manipulation' }}
            >
              {isMr ? 'पुन्हा प्रयत्न करा' : 'Retry'}
            </button>
          </div>
        )}
      </div>

      {/* ── Input bar ───────────────────────────────────────────────── */}
      <div
        className="relative z-30 flex-shrink-0 px-4 pb-safe pt-3"
        style={{ background: 'linear-gradient(to top, #0A1A0A 70%, transparent)' }}
      >
        <div
          className="flex items-center gap-2 p-2 rounded-2xl nav-blur"
          style={{ background: 'rgba(17,28,17,0.9)', border: '1px solid rgba(245,240,232,0.1)' }}
        >
          {/* Mic button */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-all"
            style={{ background: '#2E7D32', border: '1px solid rgba(212,196,160,0.15)' }}
          >
            <Mic size={16} className="text-[#E8C84A]" strokeWidth={1.5} />
          </button>

          <input
            type="text"
            placeholder={isMr ? 'सल्ला विचारा...' : 'Ask for advice...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent outline-none border-none font-light text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.25)]"
            style={{ fontSize: '14px' }}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90 disabled:opacity-30"
            style={{
              background: input.trim() ? '#E8C84A' : 'rgba(245,240,232,0.06)',
              border: '1px solid rgba(245,240,232,0.1)',
            }}
          >
            <Send size={14} className={input.trim() ? 'text-[#0A1A0A]' : 'text-[rgba(245,240,232,0.4)]'} />
          </button>
        </div>

        {/* Gemini badge */}
        <div className="flex justify-center items-center gap-1.5 mt-2 mb-1 opacity-25">
          <Sparkles size={10} className="text-[#E8C84A]" />
          <p className="text-[9px] font-medium tracking-[0.18em] uppercase text-[#E8C84A]">
            {isMr ? 'Gemini द्वारे संचालित' : 'Powered by Gemini'}
          </p>
        </div>
      </div>
    </div>
  );
}
