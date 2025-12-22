import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Session } from '../types';
import { useAuth } from '../App';
import { format } from 'date-fns';
import Button from '../components/Button';
import { Clock, Calendar, CheckCircle2, X, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Schedule: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectingPlayer, setSelectingPlayer] = useState<Session | null>(null);
  const { userProfile, isAdmin } = useAuth();
  const [userBookings, setUserBookings] = useState<Record<string, string[]>>({});

  const fetchSessions = async () => {
    try {
      const data = await api.getSessions();
      setSessions(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchUserBookings = async () => {
    if (!userProfile) return;
    const bookings = await api.getBookings(userProfile.uid);
    const map: Record<string, string[]> = {};
    bookings.forEach(b => {
      if (!map[b.sessionId]) map[b.sessionId] = [];
      map[b.sessionId].push(b.playerName);
    });
    setUserBookings(map);
  };

  useEffect(() => {
    fetchSessions();
    fetchUserBookings();
  }, [userProfile]);

  const handleBook = async (playerName: string) => {
    if (!userProfile || !selectingPlayer) return;
    setProcessing(selectingPlayer.id);
    try {
      await api.bookSession(selectingPlayer, userProfile.uid, playerName);
      await fetchSessions();
      await fetchUserBookings();
      setSelectingPlayer(null);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      <div className="w-14 h-14 border-[6px] border-slate-100 border-t-brand-secondary rounded-full animate-spin"></div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Inspecting Courts...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Court<br/>Timetable</h1>
        <p className="text-slate-400 font-bold text-xs mt-3 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-brand-ball rounded-full animate-pulse"></span>
          7 Spot Roster Protocol Active
        </p>
      </header>

      <div className="space-y-6">
        {sessions.length === 0 ? (
          <div className="bg-white border border-slate-100 p-12 rounded-[2.5rem] text-center shadow-premium space-y-4">
            <Calendar size={40} className="mx-auto text-slate-100" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No sessions yet</p>
            {isAdmin && (
              <div className="space-y-3">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Coach, ready to post the next rally?</p>
                <Button onClick={() => navigate('/admin')} className="bg-slate-900 text-white px-6 py-3">
                  Open Coach Control
                </Button>
              </div>
            )}
          </div>
        ) : (
          sessions.map(session => {
            const startDate = session.start.toDate();
            const isFull = session.bookedCount >= 7;
            const sessionPlayerBookings = userBookings[session.id] || [];
            const remaining = 7 - session.bookedCount;

            return (
              <div key={session.id} className="bg-white rounded-[2.5rem] p-7 shadow-premium border border-slate-50 relative overflow-hidden transition-all active:scale-[0.99]">
                <div className="flex justify-between items-center mb-6">
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isFull ? 'bg-red-50 text-red-500' : 'bg-brand-secondary/10 text-brand-secondary'}`}>
                    {isFull ? 'Roster Full' : 'Join Roster'}
                  </div>
                  {sessionPlayerBookings.length > 0 && (
                    <div className="flex gap-0.5">
                      {sessionPlayerBookings.map((_, idx) => (
                        <div key={idx} className="w-2 h-2 rounded-full bg-brand-ball"></div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 uppercase">{session.title}</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <Calendar size={14} className="text-brand-secondary" /> {format(startDate, 'EEEE, MMM do')}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <Clock size={14} className="text-brand-secondary" /> {format(startDate, 'h:mm a')}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-5 rounded-3xl mb-6 border border-slate-100">
                  <div className="flex justify-between items-end mb-2.5">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Court Capacity</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${remaining <= 2 ? 'text-red-500' : 'text-slate-900'}`}>
                      {remaining} {remaining === 1 ? 'Spot' : 'Spots'} Remaining
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`h-2 flex-1 rounded-full ${i < session.bookedCount ? 'bg-brand-secondary shadow-sm shadow-lime-200' : 'bg-slate-200'}`}></div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setSelectingPlayer(session)}
                  disabled={isFull}
                  className={`py-4 ${isFull ? 'bg-slate-100 text-slate-400 shadow-none' : 'bg-slate-900 text-white'}`}
                >
                  {isFull ? 'Roster Locked' : 'Book Session'}
                </Button>
              </div>
            );
          })
        )}
      </div>

      {/* Modern Player Selection Modal */}
      {selectingPlayer && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="text-xl font-black text-slate-900 uppercase leading-none">Choose Athlete</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Select from family roster</p>
              </div>
              <button onClick={() => setSelectingPlayer(null)} className="p-2 bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-colors">
                <X size={24}/>
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {userProfile?.children.map(child => {
                const isAlreadyBooked = userBookings[selectingPlayer.id]?.includes(child);
                return (
                  <button 
                    key={child}
                    onClick={() => handleBook(child)}
                    disabled={isAlreadyBooked || processing === selectingPlayer.id}
                    className={`w-full p-6 rounded-3xl flex items-center justify-between transition-all group border-2 ${isAlreadyBooked ? 'bg-slate-50 opacity-40 border-transparent' : 'bg-white hover:bg-brand-secondary border-slate-50 hover:border-brand-secondary shadow-sm'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-2xl group-hover:bg-white group-hover:text-brand-secondary transition-colors ${isAlreadyBooked ? 'bg-slate-200 text-slate-400' : 'bg-brand-secondary text-white'}`}>
                        <User size={20} />
                      </div>
                      <span className={`font-black uppercase tracking-widest text-sm transition-colors group-hover:text-white ${isAlreadyBooked ? 'text-slate-400' : 'text-slate-900'}`}>
                        {child}
                      </span>
                    </div>
                    {isAlreadyBooked ? (
                      <CheckCircle2 size={18} className="text-slate-300" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-white" />
                    )}
                  </button>
                );
              })}
              {userProfile?.children.length === 0 && (
                <div className="text-center py-10 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 text-xs font-bold mb-5 italic px-6 uppercase tracking-widest">No athletes registered on your profile.</p>
                  <Button onClick={() => navigate('/')} variant="primary" className="w-auto px-8 mx-auto inline-flex">Setup Roster</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;