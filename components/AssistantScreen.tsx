
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, Send, MessageCircle, User, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { PRODUCTS } from '../constants';
import { getAiMarketAssistance } from '../services/geminiService';

interface AssistantScreenProps {
  lang: Language;
  onBack: () => void;
}

const AssistantScreen: React.FC<AssistantScreenProps> = ({ lang, onBack }) => {
  const isMr = lang === Language.MARATHI;
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: isMr ? 'नमस्कार! मी तुमचा मंडी सहाय्यक आहे. मी तुम्हाला कशी मदत करू शकतो?' : 'Hello! I am your Mandi Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const aiResponse = await getAiMarketAssistance(userText, PRODUCTS, lang);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0E1A0E] z-[100] flex flex-col ios-safe-top">
      {/* Background Blobs duplicated locally to ensure continuity during transition */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-[#2D5A27] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-[#92400E] rounded-full blur-[120px] opacity-40"></div>
      </div>

      {/* Dynamic Header */}
      <div className="relative px-6 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-3xl bg-white/5">
        <button onClick={onBack} className="spring-btn p-4 bg-white/5 rounded-[24px] border border-white/10 text-white/70">
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <h2 className="text-xl font-black text-white/90">{isMr ? 'शेतकरी सहाय्यक' : 'Kisan Sahayak'}</h2>
          </div>
          <p className="text-[10px] font-black text-[#F59E0B] tracking-widest uppercase opacity-60">{isMr ? 'एआय कृषी सल्लागार' : 'AI Agricultural Advisor'}</p>
        </div>
        <div className="w-14 h-14 bg-white/10 rounded-[20px] flex items-center justify-center text-2xl shadow-lg border border-white/10">
          🤖
        </div>
      </div>

      {/* Modern Bubble Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-10 pb-40 scrollbar-hide relative z-10">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[85%] p-7 rounded-[36px] text-lg font-bold shadow-2xl ${
              m.role === 'user' 
              ? 'bg-[#2D5A27] text-white rounded-tr-none border border-white/10' 
              : 'bg-white/10 backdrop-blur-xl text-white/90 rounded-tl-none border border-white/10'
            }`}>
              {m.text}
            </div>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mx-4">
              {m.role === 'user' ? (isMr ? 'तुम्ही' : 'You') : (isMr ? 'सहाय्यक' : 'Assistant')}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start space-y-3 animate-pulse">
            <div className="bg-white/5 border border-white/10 p-7 rounded-[36px] rounded-tl-none w-48 shadow-lg">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-green-500/50 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-green-500/50 rounded-full animate-bounce delay-150"></div>
                <div className="w-2.5 h-2.5 bg-green-500/50 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Immersive Input Dock */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0E1A0E] via-[#0E1A0E]/95 to-transparent safe-bottom z-50">
        <div className="flex gap-4 items-center bg-white/10 backdrop-blur-3xl p-3 rounded-[36px] shadow-2xl border border-white/10">
          <button className="spring-btn w-16 h-16 bg-[#F59E0B] text-white rounded-full flex items-center justify-center shadow-2xl shadow-amber-900/40">
            <Mic size={32} strokeWidth={2.5} />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder={isMr ? 'विचारण्यासाठी लिहा किंवा बोला...' : 'Type or speak to ask...'} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full py-5 pr-14 bg-transparent text-xl font-bold placeholder:text-white/20 focus:outline-none text-white"
            />
            <button 
              onClick={handleSend}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#F59E0B]"
            >
              <Send size={26} strokeWidth={3} />
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2 mt-6 opacity-30">
            <Sparkles size={14} className="text-[#F59E0B]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Gemini Advanced AI Intelligence</p>
        </div>
      </div>
    </div>
  );
};

export default AssistantScreen;
