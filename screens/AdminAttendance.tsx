
import React, { useState } from 'react';
import { Session, Booking, User, ChildProfile } from '../types';
import { store } from '../store';

interface AdminAttendanceProps {
  onNavigate: () => void;
}

const AdminAttendance: React.FC<AdminAttendanceProps> = ({ onNavigate }) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const sessions = store.getSessions();
  const bookings = store.getBookings().filter(b => b.date.split('T')[0] === today && b.status === 'BOOKED');
  const users = store.getUsers();

  const getEntityName = (booking: Booking) => {
    const user = users.find(u => u.id === booking.userId);
    if (booking.childId) {
      const child = user?.children?.find(c => c.id === booking.childId);
      return child ? `${child.name} (Child)` : 'Unknown Child';
    }
    return user?.name || 'Unknown User';
  };

  const filteredBookings = selectedSessionId 
    ? bookings.filter(b => b.sessionId === selectedSessionId)
    : bookings;

  const handleToggle = (id: string) => {
    store.toggleAttendance(id);
    // Force re-render
    setSelectedSessionId(selectedSessionId); 
  };

  return (
    <div className="p-6 pb-24 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-10 pt-4">
        <button onClick={onNavigate} className="text-[#9fcc22] font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h1 className="text-xl font-black italic uppercase tracking-tighter">ROLL CALL</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8">
        <button 
          onClick={() => setSelectedSessionId(null)}
          className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${!selectedSessionId ? 'bg-[#9fcc22] text-zinc-950 border-[#9fcc22]' : 'bg-transparent border-zinc-800 text-zinc-500'}`}
        >
          All Today
        </button>
        {sessions.map(s => (
          <button 
            key={s.id}
            onClick={() => setSelectedSessionId(s.id)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${selectedSessionId === s.id ? 'bg-[#9fcc22] text-zinc-950 border-[#9fcc22]' : 'bg-transparent border-zinc-800 text-zinc-500'}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Bookings Found</p>
          </div>
        ) : (
          filteredBookings.map(b => (
            <div key={b.id} className="bg-zinc-900 p-5 rounded-[32px] border border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-black italic uppercase text-white leading-tight">{getEntityName(b)}</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                  {sessions.find(s => s.id === b.sessionId)?.name}
                </p>
              </div>
              <button 
                onClick={() => handleToggle(b.id)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 ${b.attended ? 'bg-[#9fcc22] border-[#9fcc22] text-zinc-950 shadow-[0_0_15px_rgba(159,204,34,0.3)]' : 'bg-transparent border-zinc-800 text-zinc-700'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;
