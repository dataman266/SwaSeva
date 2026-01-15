
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, Send, Sparkles, User, Bot, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { PRODUCTS } from '../constants';
import { getAiMarketAssistance } from '../services/geminiService';

interface AssistantScreenProps {
  lang: Language;
  onBack: () => void;
}

const AssistantScreen: React.FC<AssistantScreenProps> = ({ lang, onBack }) => {
  const isMr = lang === Language.MARATHI;
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string; time: string }[]>([
    { 
      role: 'ai', 
      text: isMr ? 'नमस्कार! मी तुमचा मंडी सहाय्यक आहे. मी तुम्हाला कशी मदत करू शकतो?' : 'Namaste! I am your Mandi Assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText, time }]);
    setIsLoading(true);

    const aiResponse = await getAiMarketAssistance(userText, PRODUCTS, lang);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0E1A0E] z-[100] flex flex-col ios-safe-top overflow-hidden">
      {/* Immersive Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[100vw] h-[100vw] bg-[#2D5A27] rounded-full blur-[140px] opacity-20"></div>
        <div className="absolute bottom-[-10%] left-[-15%] w-[100vw] h-[100vw] bg-[#F59E0B] rounded-full blur-[160px] opacity-10"></div>
      </div>

      {/* Android Top App Bar Style */}
      <div className="relative px-4 py-4 flex items-center gap-4 border-b border-white/5 backdrop-blur-3xl bg-white/5 z-20">
        <button onClick={onBack} className="p-3 text-white/70 hover:bg-white/5 rounded-full transition-colors active:scale-90">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <div className="flex-1 flex items-center gap-3">
          <div className="w-12 h-12 bg-[#2D5A27] rounded-2xl flex items-center justify-center shadow-xl border border-white/10 ring-2 ring-[#F59E0B]/20">
            <Bot size={28} className="text-[#F59E0B]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-tight">{isMr ? 'शेतकरी सहाय्यक' : 'Kisan Sahayak'}</h2>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black text-green-500/80 uppercase tracking-widest">{isMr ? 'ऑनलाइन' : 'ONLINE'}</span>
            </div>
          </div>
        </div>
        <button className="p-3 text-white/40 hover:bg-white/5 rounded-full" onClick={() => setMessages([messages[0]])}>
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Chat Canvas */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-8 pb-36 relative z-10 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[82%] px-6 py-5 rounded-[28px] shadow-xl border ${
              m.role === 'user' 
              ? 'bg-[#2D5A27] text-white rounded-tr-none border-white/10 shadow-green-900/20' 
              : 'bg-[#1A2E1A] text-white/90 rounded-tl-none border-white/5 shadow-black/40'
            }`}>
              <p className="text-[15px] font-medium leading-relaxed tracking-tight">{m.text}</p>
            </div>
            <div className="flex items-center gap-2 px-3 opacity-30">
               <span className="text-[9px] font-black uppercase tracking-widest text-white">{m.role === 'user' ? (isMr ? 'तुम्ही' : 'You') : (isMr ? 'सहाय्यक' : 'AI Assistant')}</span>
               <span className="text-[9px] font-bold text-white">•</span>
               <span className="text-[9px] font-bold text-white">{m.time}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start space-y-2 animate-in fade-in duration-300">
            <div className="bg-[#1A2E1A] border border-white/5 p-6 rounded-[28px] rounded-tl-none w-32 shadow-lg">
              <div className="flex gap-1.5 justify-center">
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MD3 Rounded Input Field */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-[#0E1A0E] via-[#0E1A0E] to-transparent z-30">
        <div className="max-w-3xl mx-auto flex items-center gap-3 bg-[#1A2E1A] p-2.5 rounded-[32px] shadow-2xl border border-white/10 group focus-within:ring-2 ring-[#F59E0B]/20 transition-all">
          <button className="w-12 h-12 bg-[#2D5A27] text-[#F59E0B] rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
            <Mic size={24} strokeWidth={2.5} />
          </button>
          <input 
            type="text" 
            placeholder={isMr ? 'सल्ला विचारा...' : 'Ask for advice...'} 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white font-medium placeholder:text-white/20 px-1"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${input.trim() ? 'bg-[#F59E0B] text-[#0E1A0E]' : 'bg-white/5 text-white/20'}`}
          >
            <Send size={22} strokeWidth={3} />
          </button>
        </div>
        <div className="flex justify-center items-center gap-2 mt-4 opacity-40">
            <Sparkles size={12} className="text-[#F59E0B]" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Smart Agricultural Assistant Powered by Gemini</p>
        </div>
      </div>
    </div>
  );
};

export default AssistantScreen;
