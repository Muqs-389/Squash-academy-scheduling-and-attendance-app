
import React, { useState } from 'react';
// Importing User and UserRole from types, and store constants from store
import { MONTHLY_PLANS, store } from '../store';
import { User, UserRole } from '../types';

interface AdminMembersProps {
  onNavigate: () => void;
}

const AdminMembers: React.FC<AdminMembersProps> = ({ onNavigate }) => {
  const users = store.getUsers().filter(u => u.role === UserRole.CLIENT);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.phone.includes(searchTerm)
  );

  const togglePayment = (user: User) => {
    store.updateUser({ ...user, planPaid: !user.planPaid });
    setSearchTerm(searchTerm); // Trigger re-render
  };

  return (
    <div className="p-6 pb-24 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-10 pt-4">
        <button onClick={onNavigate} className="text-[#9fcc22] font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h1 className="text-xl font-black italic uppercase tracking-tighter">PAYMENTS</h1>
        <div className="w-10"></div>
      </div>

      <div className="mb-8">
        <input 
          type="text"
          placeholder="SEARCH MEMBERS..."
          className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-5 text-sm font-black uppercase tracking-widest focus:border-[#9fcc22] outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map(u => {
          const plan = MONTHLY_PLANS.find(p => p.id === u.activePlanId);
          return (
            <div key={u.id} className="bg-zinc-900 p-6 rounded-[32px] border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black italic uppercase text-white leading-tight">{u.name}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{u.phone}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${u.planPaid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {u.planPaid ? 'PAID' : 'UNPAID'}
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Active Plan</p>
                  <p className="text-sm font-black text-white italic">
                    {plan ? `${plan.sessions} Sessions` : 'No Active Plan'}
                  </p>
                </div>
                {plan && (
                  <button 
                    onClick={() => togglePayment(u)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${u.planPaid ? 'bg-zinc-800 text-zinc-500' : 'bg-[#9fcc22] text-zinc-950'}`}
                  >
                    {u.planPaid ? 'MARK UNPAID' : 'MARK PAID'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminMembers;
