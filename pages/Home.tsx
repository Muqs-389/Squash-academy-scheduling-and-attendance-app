import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { LogOut, Target, Trophy, Users, Plus, X, Star, Megaphone, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import { api } from '../lib/api';
import { Tip } from '../types';

const Home: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [newChild, setNewChild] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [tips, setTips] = useState<Tip[]>([]);

  const handleLogout = async () => {
    await api.logout();
    navigate('/login');
  };

  const handleAddChild = async () => {
    if (newChild.trim() && userProfile) {
      const updated = [...userProfile.children, newChild.trim()];
      await api.updateChildren(updated);
      setNewChild('');
      setShowAdd(false);
    }
  };

  const removeChild = async (idx: number) => {
    if (userProfile && window.confirm("Archive this athlete from your roster?")) {
      const updated = userProfile.children.filter((_, i) => i !== idx);
      await api.updateChildren(updated);
    }
  };

  useEffect(() => {
    const loadTips = async () => {
      const storedTips = await api.getTips();
      setTips(storedTips);
    };

    loadTips();
  }, []);

  const hasCoachTips = tips.length > 0;
  const dailyTip = hasCoachTips
    ? tips[Math.floor(Math.random() * tips.length)]
    : null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-16">
      <header className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-premium">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
            Welcome, {userProfile?.displayName?.split(' ')[0]}
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Academy Member</p>
        </div>
        <button onClick={handleLogout} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 transition-all active:scale-90">
          <LogOut size={20}/>
        </button>
      </header>

      {/* Roster Call-to-Action */}
      <div className="academy-gradient rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-lime-glow">
        <div className="relative z-10 space-y-4">
          <div className="bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            <p className="text-[10px] font-black uppercase tracking-widest">Roster Protocol Active</p>
          </div>
          <h2 className="text-4xl font-black tracking-tighter leading-none uppercase italic">Weekly<br/>Squads</h2>
          <p className="text-white/90 text-sm font-bold max-w-[200px]">Currently capped at 7 players per squad—save your spot early.</p>
          <Button
            onClick={() => navigate('/schedule')}
            className="bg-white text-slate-900 border-none w-auto inline-flex px-10 hover:bg-slate-50 font-black shadow-xl"
          >
            View Timetable
          </Button>
        </div>
        <Trophy size={160} className="absolute -right-12 -bottom-10 opacity-10 rotate-12" />
      </div>

      {/* Family Roster Management */}
      <section className="bg-white p-7 rounded-[3rem] shadow-premium border border-slate-50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-brand-lime/10 p-2 rounded-xl">
              <Users size={20} className="text-brand-lime" />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase italic">Junior Athletes</h3>
          </div>
          <button 
            onClick={() => setShowAdd(!showAdd)} 
            className={`p-2 rounded-xl transition-all ${showAdd ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-brand-lime'}`}
          >
            {showAdd ? <X size={20}/> : <Plus size={20}/>}
          </button>
        </div>

        {showAdd && (
          <div className="mb-6 flex gap-2 animate-in slide-in-from-top-4">
            <input 
              value={newChild}
              onChange={e => setNewChild(e.target.value)}
              placeholder="Full Name..."
              className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-lime/20"
            />
            <button 
              onClick={handleAddChild} 
              className="bg-brand-lime text-white px-6 rounded-2xl font-black text-[10px] uppercase shadow-md shadow-lime-100"
            >
              Add
            </button>
          </div>
        )}

        <div className="space-y-3">
          {userProfile?.children.length === 0 ? (
            <div className="text-center py-8 opacity-40 italic text-xs font-bold uppercase tracking-widest">
              No athletes registered.
            </div>
          ) : (
            userProfile?.children.map((child, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100 transition-all hover:border-brand-lime/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-ball shadow-sm"></div>
                  <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{child}</span>
                </div>
                <button onClick={() => removeChild(i)} className="text-slate-300 hover:text-red-400 p-1"><X size={16}/></button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Pro-Tips Feature */}
      {hasCoachTips && dailyTip && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-premium flex items-start gap-5">
          <div className="bg-brand-ball text-slate-900 p-3.5 rounded-2xl shadow-lg shadow-yellow-500/20 shrink-0">
            <Target size={24} strokeWidth={3} />
          </div>
          <div>
            <p className="text-[10px] font-black text-brand-lime uppercase tracking-[0.2em] mb-1.5 italic">Coach Muq's Pro-Tip</p>
            <p className="text-white text-sm font-bold leading-snug italic">"{dailyTip.body}"</p>
          </div>
        </div>
      )}

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate('/bookings')} className="bg-white border border-slate-50 p-7 rounded-[2.5rem] shadow-premium flex flex-col items-center gap-3 text-center transition-all active:scale-95 group">
          <div className="bg-brand-lime/10 text-brand-lime p-4 rounded-2xl group-hover:bg-brand-lime group-hover:text-white transition-all">
            <Star size={24} fill="currentColor" />
          </div>
          <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Training Log</span>
        </button>
        <button onClick={() => navigate('/announcements')} className="bg-white border border-slate-50 p-7 rounded-[2.5rem] shadow-premium flex flex-col items-center gap-3 text-center transition-all active:scale-95 group">
          <div className="bg-brand-lime/10 text-brand-lime p-4 rounded-2xl group-hover:bg-brand-lime group-hover:text-white transition-all">
            <Megaphone size={24} />
          </div>
          <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Noticeboard</span>
        </button>
      </div>

      <footer className="text-center py-6 opacity-30">
        <div className="flex justify-center gap-1.5 mb-2">
          <div className="w-2 h-2 rounded-full bg-brand-ball"></div>
          <div className="w-2 h-2 rounded-full bg-brand-ball"></div>
        </div>
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">Muqs' School of Squash • Pro Edition</p>
      </footer>
    </div>
  );
};

export default Home;