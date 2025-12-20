
import React from 'react';
import { User, Screen, Plan } from '../types';
import { store, MONTHLY_PLANS } from '../store';

interface MonthlyPlansScreenProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

const MonthlyPlansScreen: React.FC<MonthlyPlansScreenProps> = ({ user, onNavigate }) => {
  const handleSelectPlan = (plan: Plan) => {
    if (confirm(`Switch to the ${plan.sessions} sessions plan for Ksh ${plan.price.toLocaleString()}?`)) {
      const updatedUser = { ...user, activePlanId: plan.id };
      store.updateUser(updatedUser);
      onNavigate('HOME');
    }
  };

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => onNavigate('HOME')} className="text-zinc-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter">MONTHLY CHARGES</h1>
      </div>

      <div className="space-y-4">
        {MONTHLY_PLANS.map(plan => {
          const isSelected = user.activePlanId === plan.id;
          return (
            <div 
              key={plan.id}
              onClick={() => handleSelectPlan(plan)}
              className={`p-6 rounded-[32px] border-2 transition-all active:scale-95 flex justify-between items-center ${
                isSelected 
                  ? 'bg-[#9fcc22] border-[#9fcc22] text-zinc-950' 
                  : 'bg-zinc-900 border-zinc-800 text-white'
              }`}
            >
              <div>
                <h3 className="text-2xl font-black">{plan.sessions} <span className="text-xs uppercase font-bold">Sessions</span></h3>
                <p className={`text-xs font-bold uppercase opacity-60 ${isSelected ? 'text-zinc-950' : 'text-[#9fcc22]'}`}>
                  Ksh {plan.price.toLocaleString()} / mo
                </p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-zinc-950 text-white' : 'bg-zinc-800 text-[#9fcc22]'}`}>
                {isSelected ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 p-8 bg-zinc-900 rounded-[40px] border border-zinc-800">
        <h4 className="text-[#9fcc22] text-xs font-black uppercase tracking-widest mb-4">Training Focus</h4>
        <ul className="space-y-3 text-xs text-zinc-400 font-bold uppercase">
          <li className="flex items-start gap-3">
            <span className="text-[#9fcc22]">✓</span> Personalized coaching & tactical awareness
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#9fcc22]">✓</span> Engaging drills & competitive match play
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#9fcc22]">✓</span> technique & technical development
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MonthlyPlansScreen;
