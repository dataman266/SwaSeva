
import React from 'react';
import { Language } from '../types';
import { User, Settings, Bell, HelpCircle, Shield, LogOut, ChevronRight } from 'lucide-react';

const ProfileScreen: React.FC<{ lang: Language }> = ({ lang }) => (
  <div className="px-6 py-10 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
    <div className="flex items-center gap-6">
      <div className="w-24 h-24 bg-[#2D5A27] text-white rounded-[32px] flex items-center justify-center text-4xl font-black shadow-2xl border-4 border-white/10 relative">
        RS
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#F59E0B] rounded-full border-4 border-[#1A2E1A] flex items-center justify-center">
            <Shield size={14} strokeWidth={3} />
        </div>
      </div>
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-white">Rajesh Shinde</h2>
        <p className="text-white/40 font-bold tracking-tight">+91 99999 88888</p>
        <div className="inline-flex mt-2 px-4 py-1.5 bg-green-500/10 text-green-400 text-[10px] font-black rounded-full border border-green-500/20 uppercase tracking-widest">Premium Farmer</div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {[
        { icon: Settings, label: 'Account Settings', color: 'text-amber-400' },
        { icon: Bell, label: 'Notification Alerts', color: 'text-green-400' },
        { icon: Shield, label: 'Kyc Verification', color: 'text-blue-400' },
        { icon: HelpCircle, label: 'Customer Support', color: 'text-purple-400' },
        { icon: LogOut, label: 'Logout Session', color: 'text-red-500' },
      ].map((item, idx) => (
        <button key={idx} className="spring-btn flex items-center justify-between p-6 glass-card rounded-[32px] border-white/5 active:bg-white/10 transition-all">
          <div className="flex items-center gap-5">
            <div className={`p-3 rounded-2xl bg-white/5 ${item.color}`}>
                <item.icon size={22} strokeWidth={3} />
            </div>
            <span className="font-black text-white text-lg tracking-tight">{item.label}</span>
          </div>
          <ChevronRight size={20} className="text-white/20" />
        </button>
      ))}
    </div>

    <div className="bg-[#F59E0B]/5 p-8 rounded-[48px] border border-[#F59E0B]/10 text-center space-y-2">
      <p className="text-[10px] text-[#F59E0B] font-black uppercase tracking-[0.3em]">System Status</p>
      <p className="text-white/20 font-black text-sm uppercase tracking-widest">v1.2.4-BETA • PWA CONNECTED</p>
    </div>
  </div>
);

export default ProfileScreen;
