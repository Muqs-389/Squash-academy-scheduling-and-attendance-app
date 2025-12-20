
import React from 'react';
import { User, Screen } from '../types';
import { store } from '../store';

interface MyBookingsScreenProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({ user, onNavigate }) => {
  const allBookings = store.getBookings().filter(b => b.userId === user.id);
  const sessions = store.getSessions();

  const getSession = (id: string) => sessions.find(s => s.id === id);

  return (
    <div className="p-6 min-h-full bg-gray-50">
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-950">PLAY HISTORY</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Your track record at Muqs'</p>
        </div>
        <button 
          onClick={() => onNavigate('SCHEDULE')}
          className="bg-[#9fcc22] text-zinc-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all"
        >
          Book Now
        </button>
      </header>
      
      {allBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="w-24 h-24 bg-white rounded-[32px] shadow-sm border border-zinc-100 flex items-center justify-center mb-6">
             <svg className="w-10 h-10 text-[#89b11b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h3 className="text-lg font-black text-zinc-900 uppercase italic">Ready to court?</h3>
          <p className="text-zinc-500 mt-2 text-sm font-medium px-8">You haven't booked any sessions yet. Secure your spot on the court today!</p>
          <button 
            onClick={() => onNavigate('SCHEDULE')}
            className="mt-8 bg-[#9fcc22] text-zinc-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-lime-200 active:scale-95 transition-all"
          >
            Explore Schedule
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-2">Recent & Upcoming</h2>
            {allBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(booking => {
              const session = getSession(booking.sessionId);
              if (!session) return null;

              return (
                <div key={booking.id} className="bg-white border border-zinc-100 p-6 rounded-[32px] shadow-sm animate-slide-up">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-zinc-900 italic uppercase">{session.name}</h4>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                        {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {session.startTime}
                      </p>
                    </div>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      booking.status === 'CANCELLED' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-50">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-[10px] font-black text-[#89b11b] border border-zinc-100">
                      MP
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Monthly Plan</p>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Attendance Recorded</p>
                    </div>
                    {booking.status !== 'CANCELLED' && (
                      <button 
                        onClick={() => {
                          if (confirm("Cancel this session booking?")) {
                            store.cancelBooking(booking.id);
                          }
                        }}
                        className="text-[10px] text-red-400 font-black uppercase tracking-widest hover:text-red-600 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-8 bg-zinc-900 rounded-[40px] text-white relative overflow-hidden shadow-xl mt-4">
            <div className="relative z-10">
              <h3 className="text-xl font-black italic uppercase mb-2">Want more court time?</h3>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6 opacity-80">Consistency is the fast lane to mastery.</p>
              <button 
                onClick={() => onNavigate('SCHEDULE')}
                className="bg-[#9fcc22] text-zinc-950 font-black px-8 py-5 rounded-3xl shadow-lg active:scale-95 transition-all text-xs uppercase tracking-[0.2em] border-b-4 border-lime-800/30"
              >
                Go to Booking
              </button>
            </div>
            <svg className="absolute top-0 right-0 w-32 h-32 text-[#9fcc22] -mr-8 -mt-8 opacity-10 rotate-12" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsScreen;
