
import React, { useState } from 'react';
import { User, Screen, Session, Booking, SessionType } from '../types';
import { store } from '../store';

interface ScheduleScreenProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ user, onNavigate }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [filter, setFilter] = useState<'ALL' | SessionType>('ALL');
  const [showBookingModal, setShowBookingModal] = useState<Session | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const sessions = store.getSessions().filter(s => 
    s.days.includes(selectedDay) && 
    (filter === 'ALL' || s.type === filter)
  );

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDate = new Date();

  const handleBook = async (session: Session, childId?: string) => {
    setIsBooking(true);
    const bookingData: Omit<Booking, 'id'> = {
      sessionId: session.id,
      userId: user.id,
      childId,
      date: new Date().toISOString(),
      status: 'BOOKED',
      attended: false,
      createdAt: new Date().toISOString()
    };
    
    const result = await store.addBooking(bookingData);
    setIsBooking(false);

    if (result.success) {
      setShowBookingModal(null);
      alert("Spot Secured! Attendance will be tracked in the cloud.");
    } else {
      alert(result.error || "Booking failed. Please check your connection.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white">
      <div className="p-6 bg-zinc-900/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-10">
        <header className="flex items-center gap-4 mb-6">
          <button onClick={() => onNavigate('HOME')} className="text-zinc-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">TRAINING SCHEDULE</h1>
        </header>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
          {weekDays.map((day, idx) => (
            <button
              key={day}
              onClick={() => setSelectedDay(idx)}
              className={`flex-shrink-0 w-14 py-3 rounded-2xl flex flex-col items-center transition-all ${
                selectedDay === idx 
                  ? 'bg-[#9fcc22] text-zinc-950 shadow-lg shadow-lime-900/20' 
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              <span className="text-[10px] font-bold uppercase">{day}</span>
              <span className="text-lg font-black italic">{(todayDate.getDate() + (idx - todayDate.getDay())) || todayDate.getDate()}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-4 mt-2">
          {['ALL', SessionType.JUNIOR, SessionType.ADULT].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2 transition-all ${
                filter === f ? 'bg-[#9fcc22]/10 border-[#9fcc22] text-[#9fcc22]' : 'bg-transparent border-zinc-800 text-zinc-500'
              }`}
            >
              {f === 'ALL' ? 'All Sessions' : f + 'S'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="font-bold uppercase tracking-widest text-xs">No sessions scheduled</p>
          </div>
        ) : (
          sessions.map(session => {
            const bookings = store.getBookings().filter(b => b.sessionId === session.id && b.status === 'BOOKED');
            const spotsLeft = session.capacity - bookings.length;
            const isFull = spotsLeft <= 0;

            return (
              <div key={session.id} className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded bg-[#9fcc22]/10 text-[#9fcc22] mb-3 inline-block`}>
                      {session.type} TRAINING
                    </span>
                    <h3 className="text-xl font-black text-white italic uppercase">{session.name}</h3>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mt-2 font-bold uppercase">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {session.startTime} - {session.endTime}
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-1 font-bold uppercase">{session.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-[#9fcc22] uppercase tracking-widest bg-[#9fcc22]/5 px-2 py-1 rounded-lg">
                      LIVE
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[...Array(Math.min(bookings.length, 3))].map((_, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-zinc-900 bg-zinc-800" />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {isFull ? 'Sold Out' : `${spotsLeft} spots left`}
                    </span>
                  </div>

                  <button
                    disabled={isFull}
                    onClick={() => setShowBookingModal(session)}
                    className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${
                      isFull ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-[#9fcc22] text-zinc-950 shadow-lg shadow-lime-900/20'
                    }`}
                  >
                    {isFull ? 'Full' : 'Join Session'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-zinc-900 w-full rounded-t-[40px] p-8 pb-12 animate-slide-up border-t border-white/10">
            <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-8" />
            <h2 className="text-2xl font-black text-white italic uppercase mb-2">Confirm Training</h2>
            <p className="text-zinc-500 text-sm mb-10">You are joining <span className="text-white font-black">{showBookingModal.name}</span>. Verifying capacity...</p>
            
            <div className="space-y-4 mb-10">
              <button 
                disabled={isBooking}
                onClick={() => handleBook(showBookingModal)}
                className="w-full bg-[#9fcc22] text-zinc-950 p-6 rounded-2xl font-black text-sm uppercase tracking-widest flex justify-between items-center shadow-xl active:scale-95 transition-transform disabled:opacity-50"
              >
                <span>{isBooking ? 'Securing Spot...' : 'Confirm for Myself'}</span>
                {!isBooking && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
              </button>
              
              {user.children && user.children.length > 0 && user.children.map(child => (
                <button 
                  disabled={isBooking}
                  key={child.id}
                  onClick={() => handleBook(showBookingModal, child.id)}
                  className="w-full bg-zinc-800 text-white p-6 rounded-2xl font-black text-sm uppercase tracking-widest flex justify-between items-center active:scale-95 transition-transform disabled:opacity-50"
                >
                  <span>{isBooking ? 'Syncing...' : `Confirm for ${child.name}`}</span>
                  {!isBooking && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                </button>
              ))}

              <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-8">
                Verified real-time capacity check.
              </p>
            </div>

            <button 
              disabled={isBooking}
              onClick={() => setShowBookingModal(null)}
              className="w-full text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em] py-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleScreen;
