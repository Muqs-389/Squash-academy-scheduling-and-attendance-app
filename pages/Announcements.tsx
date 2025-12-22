import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Announcement } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Megaphone, Copy, Check, MessageSquare } from 'lucide-react';

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await api.getAnnouncements();
        data.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());
        setAnnouncements(data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchNews();
  }, []);

  const handleCopy = (item: Announcement) => {
    const text = `🏆 *MUQS' SQUASH NEWS* 🏆\n\n*${item.title.toUpperCase()}*\n\n${item.body}\n\n📍 Parklands Academy\n🔥 Master the Court!`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Academy Wall</h1>
        <p className="text-slate-500 font-bold text-sm">Official club news & tournament info.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-brand-secondary rounded-full animate-spin"></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white border border-slate-100 p-12 rounded-[2.5rem] text-center shadow-premium">
          <Megaphone size={40} className="mx-auto text-slate-100 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map(item => (
            <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-premium relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-brand-ball rounded-full"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Official Memo</span>
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  {item.createdAt ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true }) : ''}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 leading-tight mb-4">{item.title}</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-wrap mb-8">{item.body}</p>
              
              <div className="flex justify-end pt-6 border-t border-slate-50">
                <button 
                  onClick={() => handleCopy(item)}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all px-6 py-3 rounded-full ${copiedId === item.id ? 'bg-green-500 text-white success-bounce' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {copiedId === item.id ? (
                    <><Check size={14} strokeWidth={3} /> Message Copied!</>
                  ) : (
                    <><Copy size={14} strokeWidth={3} /> Copy for WhatsApp</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;