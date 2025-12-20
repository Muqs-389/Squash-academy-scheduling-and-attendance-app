
import React, { useState } from 'react';
import { Session, SessionType } from '../types';
import { store } from '../store';

interface AdminSessionsProps {
  onNavigate: () => void;
}

const AdminSessions: React.FC<AdminSessionsProps> = ({ onNavigate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [sessions, setSessions] = useState(store.getSessions());
  
  const [formData, setFormData] = useState<Partial<Session>>({
    name: '',
    type: SessionType.JUNIOR,
    days: [1, 2, 3, 4, 5],
    startTime: '16:00',
    endTime: '17:30',
    capacity: 7,
    location: 'Parklands Sports Club'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: Session = {
      ...formData as Session,
      id: Math.random().toString(36).substr(2, 9)
    };
    store.addSession(newSession);
    setSessions(store.getSessions());
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this session?")) {
      store.deleteSession(id);
      setSessions(store.getSessions());
    }
  };

  return (
    <div className="p-6 pb-24 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-10 pt-4">
        <button onClick={onNavigate} className="text-[#9fcc22] font-black uppercase tracking-widest text-xs flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h1 className="text-xl font-black italic uppercase tracking-tighter">MANAGE SESSIONS</h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#9fcc22] text-zinc-950 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all text-2xl font-black"
        >
          {isAdding ? '×' : '+'}
        </button>
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-[32px] border border-white/5 space-y-6 mb-8 animate-slide-up">
          <h2 className="font-black text-lg italic uppercase">Create Training Slot</h2>
          <div>
            <label className="block text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-[0.2em]">Session Name</label>
            <input 
              type="text" required
              className="w-full p-5 bg-zinc-800 rounded-2xl border-none text-white placeholder-zinc-600 focus:ring-2 focus:ring-[#9fcc22] text-sm font-bold"
              placeholder="e.g. Juniors Competitive"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-[0.2em]">Audience</label>
              <select 
                className="w-full p-5 bg-zinc-800 rounded-2xl border-none text-white focus:ring-2 focus:ring-[#9fcc22] text-sm font-bold appearance-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
              >
                <option value={SessionType.JUNIOR}>Junior</option>
                <option value={SessionType.ADULT}>Adult</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-[0.2em]">Max Students</label>
              <input 
                type="number" required
                className="w-full p-5 bg-zinc-800 rounded-2xl border-none text-white focus:ring-2 focus:ring-[#9fcc22] text-sm font-bold"
                value={formData.capacity}
                onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-[0.2em]">Start Time</label>
              <input 
                type="time" required
                className="w-full p-5 bg-zinc-800 rounded-2xl border-none text-white focus:ring-2 focus:ring-[#9fcc22] text-sm font-bold"
                value={formData.startTime}
                onChange={e => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#9fcc22] text-zinc-950 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">
            Save Training Slot
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {sessions.map(s => (
            <div key={s.id} className="bg-zinc-900 p-6 rounded-[32px] border border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-black italic uppercase text-white leading-tight">{s.name}</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                  {s.startTime} • {s.capacity} spots • {s.type}
                </p>
              </div>
              <button 
                onClick={() => handleDelete(s.id)}
                className="w-12 h-12 rounded-2xl bg-red-950/30 text-red-500 flex items-center justify-center active:scale-95 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSessions;
