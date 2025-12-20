
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { store } from '../store';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  academyName: string;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, academyName }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [isCoachMode, setIsCoachMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const config = store.getConfig();

  const posterPath = config.customBackground || "WhatsApp Image 2025-12-11 at 19.01.19.jpeg";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (isCoachMode) {
        if (pin === '7861') {
          const user: User = {
            id: 'admin_coach',
            name: 'Head Coach',
            phone: '7861',
            role: UserRole.ADMIN
          };
          store.setCurrentUser(user);
          onLogin(user);
        } else {
          alert("Invalid Coach PIN");
        }
      } else {
        if (!name || !phone) {
          alert("Please fill in all fields");
          setIsLoading(false);
          return;
        }
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: name,
          phone,
          role: UserRole.CLIENT
        };
        store.setCurrentUser(user);
        onLogin(user);
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 overflow-hidden bg-white text-zinc-900">
      {/* Background Poster Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${posterPath}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.9) grayscale(0.2)'
        }}
      />
      
      {/* Sporty Light Overlay */}
      <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[2px]" />

      {/* Content Container */}
      <div className="relative z-20 w-full flex flex-col items-center">
        <div className="mb-10 text-center animate-fade-in">
          <div className="w-20 h-20 bg-[#9fcc22] rounded-[24px] flex items-center justify-center mx-auto mb-6 rotate-3 shadow-[0_15px_35px_rgba(159,204,34,0.4)] border-4 border-white">
            <svg className="w-12 h-12 text-zinc-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-950 italic drop-shadow-sm">
            <span className="text-[#89b11b]">{academyName.split(' ')[0]}</span> {academyName.split(' ').slice(1).join(' ')}
          </h1>
          <p className="text-zinc-600 mt-1 font-bold text-[10px] uppercase tracking-[0.2em]">Kenya's Elite Training</p>
        </div>

        <div className="w-full max-w-xs bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-white/40 animate-slide-up">
          <div className="flex gap-2 mb-8 p-1 bg-zinc-100 rounded-2xl">
            <button 
              onClick={() => setIsCoachMode(false)}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isCoachMode ? 'bg-white shadow-sm text-zinc-950' : 'text-zinc-400'}`}
            >
              Student
            </button>
            <button 
              onClick={() => setIsCoachMode(true)}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isCoachMode ? 'bg-[#9fcc22] shadow-sm text-zinc-950' : 'text-zinc-400'}`}
            >
              Coach
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {!isCoachMode ? (
              <>
                <input
                  type="text"
                  required
                  className="w-full p-4 rounded-2xl bg-zinc-50 border-2 border-zinc-100 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-[#9fcc22] transition-all font-bold text-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="tel"
                  required
                  className="w-full p-4 rounded-2xl bg-zinc-50 border-2 border-zinc-100 text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-[#9fcc22] transition-all font-bold text-sm"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Enter Coach PIN</p>
                <input
                  type="password"
                  required
                  className="w-full p-4 rounded-2xl bg-zinc-50 border-2 border-zinc-100 text-zinc-950 text-center tracking-[1em] placeholder-zinc-200 focus:outline-none focus:border-[#9fcc22] transition-all font-black text-xl"
                  placeholder="••••"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#9fcc22] text-zinc-950 font-black py-5 rounded-2xl shadow-[0_10px_25px_rgba(159,204,34,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm border-b-4 border-lime-700/20"
            >
              {isLoading ? "..." : (isCoachMode ? "ACCESS CONSOLE" : "ENTER ACADEMY")}
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center opacity-70">
          Official Training App • Version 2.0
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
