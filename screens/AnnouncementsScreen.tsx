
import React, { useEffect } from 'react';
import { Screen, Announcement } from '../types';
import { store } from '../store';

interface AnnouncementsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const AnnouncementsScreen: React.FC<AnnouncementsScreenProps> = ({ onNavigate }) => {
  const announcements = store.getAnnouncements();

  useEffect(() => {
    store.markAllAnnouncementsSeen();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white p-6 pb-24">
      <header className="flex items-center gap-4 mb-10 pt-4">
        <button 
          onClick={() => onNavigate('HOME')} 
          className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">NOTICEBOARD</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Muqs' Academy Updates</p>
        </div>
      </header>

      {announcements.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
          <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
          </div>
          <h3 className="font-bold uppercase tracking-widest text-sm">No announcements yet</h3>
          <p className="text-xs mt-2">Check back later for news and updates.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((ann) => {
            const date = new Date(ann.createdAt);
            const isNew = store.isAnnouncementNew(ann.id);
            
            return (
              <div key={ann.id} className="relative group animate-fade-in">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#9fcc22] to-emerald-500 rounded-[32px] blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-6 rounded-[32px]">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {isNew && (
                      <span className="bg-[#9fcc22] text-zinc-950 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white leading-tight mb-2 italic uppercase">
                    {ann.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {ann.body}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#9fcc22] rounded-full"></div>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                      Broadcast to {ann.audience}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-12 text-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.3em]">End of feed</p>
      </div>
    </div>
  );
};

export default AnnouncementsScreen;
