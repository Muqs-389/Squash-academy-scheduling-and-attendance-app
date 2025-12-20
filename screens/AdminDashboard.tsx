
import React from 'react';
import { Screen, UserRole } from '../types';
import { store } from '../store';

interface AdminDashboardProps {
  onNavigate: (screen: Screen) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const sessions = store.getSessions();
  const bookings = store.getBookings().filter(b => b.status === 'BOOKED');
  const announcements = store.getAnnouncements();
  const users = store.getUsers().filter(u => u.role === UserRole.CLIENT);

  const stats = [
    { label: 'Today Bookings', value: bookings.filter(b => b.date.split('T')[0] === new Date().toISOString().split('T')[0]).length, color: 'text-emerald-600' },
    { label: 'Active Plans', value: users.filter(u => !!u.activePlanId).length, color: 'text-[#89b11b]' },
    { label: 'Unpaid Plans', value: users.filter(u => !!u.activePlanId && !u.planPaid).length, color: 'text-red-500' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6 text-zinc-900 pb-24">
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-950">COACH CONSOLE</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Muqs' Academy Management</p>
        </div>
        <button 
          onClick={() => onNavigate('HOME')}
          className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-400 border border-zinc-200 shadow-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-10">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm">
            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
            <p className={`text-xl font-black italic ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">CORE MANAGEMENT</h2>
        
        <button 
          onClick={() => onNavigate('ADMIN_ATTENDANCE')}
          className="w-full bg-white p-6 rounded-[32px] flex items-center gap-6 border border-zinc-100 shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#9fcc22]/10 text-[#89b11b] flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <div className="text-left">
            <h3 className="font-black text-zinc-950 italic uppercase">Roll Call</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Track Attendance Today</p>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('ADMIN_MEMBERS')}
          className="w-full bg-white p-6 rounded-[32px] flex items-center gap-6 border border-zinc-100 shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="text-left">
            <h3 className="font-black text-zinc-950 italic uppercase">Payments</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Monitor Member Plans</p>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('ADMIN_SESSIONS')}
          className="w-full bg-white p-6 rounded-[32px] flex items-center gap-6 border border-zinc-100 shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div className="text-left">
            <h3 className="font-black text-zinc-950 italic uppercase">Timetable</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Update Training Slots</p>
          </div>
        </button>

        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 mt-6">COMMUNICATION & DESIGN</h2>

        <button 
          onClick={() => onNavigate('ADMIN_ANNOUNCEMENTS')}
          className="w-full bg-white p-6 rounded-[32px] flex items-center gap-6 border border-zinc-100 shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
          <div className="text-left">
            <h3 className="font-black text-zinc-950 italic uppercase">Broadcast</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Post to Noticeboard</p>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('ADMIN_SETTINGS')}
          className="w-full bg-white p-6 rounded-[32px] flex items-center gap-6 border border-zinc-100 shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div className="text-left">
            <h3 className="font-black text-zinc-950 italic uppercase">Design</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Upload Custom Background</p>
          </div>
        </button>
      </div>

      <div className="mt-12 p-8 bg-[#9fcc22] rounded-[40px] text-zinc-950 overflow-hidden relative shadow-lg">
        <div className="relative z-10">
          <h3 className="text-xl font-black italic uppercase mb-2">Reports</h3>
          <p className="text-zinc-950 text-xs font-bold uppercase tracking-widest mb-6 opacity-70">Export attendance & billing data.</p>
          <button className="bg-zinc-950 text-white font-black px-8 py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em] border-b-4 border-zinc-800/40">
            Export Monthly CSV
          </button>
        </div>
        <svg className="absolute top-0 right-0 w-32 h-32 text-zinc-950 -mr-8 -mt-8 opacity-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,10H10V14H14M14,12H10V14H14M14,14H10V16H14M14,16H10V18H14M19,3H5C3.89,3 3,3.9 3,5V19C3,20.1 3.89,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3Z" />
        </svg>
      </div>
    </div>
  );
};

export default AdminDashboard;
