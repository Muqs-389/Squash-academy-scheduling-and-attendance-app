
import React, { useState } from 'react';
import { User, Screen } from '../types';
import { store } from '../store';

interface HomeScreenProps {
  user: User;
  academyName: string;
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, academyName, onNavigate }) => {
  const [showContact, setShowContact] = useState(false);
  const unreadCount = store.getUnseenAnnouncementCount();
  const config = store.getConfig();
  
  const posterPath = config.customBackground || "WhatsApp Image 2025-12-11 at 19.01.19.jpeg";

  return (
    <div className="relative min-h-full w-full bg-white flex flex-col">
      {/* Background Poster Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${posterPath}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.95) contrast(1.05)'
        }}
      />
      
      {/* Gradient Lighter Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-white via-white/40 to-transparent opacity-90" />

      {/* Content Container */}
      <div className="relative z-20 flex flex-col p-8 pt-12 pb-24">
        
        {/* Top Header */}
        <header className="flex justify-between items-start mb-12">
          <div className="animate-fade-in bg-white/50 backdrop-blur-lg p-5 rounded-[32px] border border-white/60 shadow-sm">
            <h1 className="text-3xl font-black text-zinc-950 leading-none tracking-tighter uppercase italic">
              <span className="text-[#89b11b]">{academyName.split(' ')[0]}</span><br/>
              {academyName.split(' ').slice(1).join(' ')}
            </h1>
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 border-l-2 border-[#9fcc22] pl-2">Parklands Sports Club</p>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onNavigate('ANNOUNCEMENTS')}
              className="relative w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-sm active:scale-95 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#9fcc22] text-zinc-950 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => onNavigate('PROFILE')}
              className="w-14 h-14 rounded-2xl bg-[#9fcc22] flex items-center justify-center text-zinc-950 font-black shadow-xl border-b-4 border-lime-700/20 active:scale-95 transition-all"
            >
              {user.name.charAt(0)}
            </button>
          </div>
        </header>

        {/* Action Content Area */}
        <div className="space-y-8 animate-slide-up mt-auto">
          <div className="max-w-[280px] bg-white/30 backdrop-blur-sm p-6 rounded-[32px] border border-white/40">
            <h2 className="text-4xl font-black text-zinc-950 leading-tight uppercase tracking-tighter italic">
              AFTER-SCHOOL GROUP <span className="text-[#89b11b]">SQUASH</span> TRAINING
            </h2>
            <p className="text-zinc-700 text-sm mt-4 font-bold leading-relaxed">
              Join monthly training packages • Track your progress
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
               <div className="flex items-center gap-1.5 text-[10px] font-black text-[#89b11b] uppercase tracking-widest">
                  <span className="w-2 h-2 bg-[#9fcc22] rounded-full"></span> AGES 7-16
               </div>
               <div className="flex items-center gap-1.5 text-[10px] font-black text-[#89b11b] uppercase tracking-widest">
                  <span className="w-2 h-2 bg-[#9fcc22] rounded-full"></span> MAX 7 / SESSION
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => onNavigate('PLANS')}
              className="w-full bg-[#9fcc22] text-zinc-950 py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(159,204,34,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-lime-700/20"
            >
              Monthly Packages
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            <button 
              onClick={() => onNavigate('SCHEDULE')}
              className="w-full bg-white text-zinc-950 py-6 rounded-[32px] font-black text-sm uppercase tracking-widest hover:bg-zinc-50 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-zinc-100 shadow-sm"
            >
              Session Schedule
            </button>

            <button 
              onClick={() => setShowContact(true)}
              className="mt-4 text-[#89b11b] text-[10px] font-black uppercase tracking-[0.4em] text-center hover:opacity-80 transition-opacity flex items-center justify-center gap-2 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 active:scale-95"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.45 5.45l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Contact Coach
            </button>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-900/70 backdrop-blur-lg">
          <div className="bg-white w-full rounded-[48px] p-10 border border-zinc-100 animate-slide-up shadow-2xl relative">
            <h3 className="text-3xl font-black text-zinc-950 mb-3 italic uppercase tracking-tighter">TALK TO COACH</h3>
            <p className="text-zinc-500 text-sm mb-10 font-medium">Connect directly for gear or tournament info.</p>
            
            <div className="space-y-5">
              <a 
                href="tel:+254111459756" 
                className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl hover:bg-zinc-100 transition-colors border border-zinc-100 shadow-sm"
              >
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-[#9fcc22]/10 flex items-center justify-center text-[#89b11b]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                   </div>
                   <span className="text-zinc-900 font-black tracking-tight text-lg">+254 111 459 756</span>
                </div>
                <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </a>
              
              <a 
                href="https://wa.me/254111459756" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-emerald-50 rounded-3xl hover:bg-emerald-100 transition-colors border border-emerald-100 shadow-sm"
              >
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.81 9.81 0 0 0 12.04 2zM16.9 15.11c-.27-.14-1.59-.78-1.84-.87-.25-.09-.43-.14-.61.14-.18.27-.69.87-.84 1.04-.15.17-.3.19-.57.05a7.14 7.14 0 0 1-2.12-1.31c-.82-.73-1.37-1.63-1.53-1.9-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.44-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.14.18 1.92 2.94 4.66 4.12.65.28 1.16.45 1.56.57.65.21 1.24.18 1.7.11.51-.08 1.59-.65 1.81-1.28.22-.63.22-1.17.16-1.28-.06-.11-.23-.17-.5-.3z" /></svg>
                   </div>
                   <span className="text-zinc-900 font-black tracking-tight text-lg">WhatsApp Coach</span>
                </div>
                <svg className="w-6 h-6 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
            
            <button 
              onClick={() => setShowContact(false)}
              className="w-full mt-10 py-5 text-zinc-400 font-black uppercase tracking-[0.3em] text-[11px] hover:text-zinc-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
