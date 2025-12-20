
import React from 'react';
import { Screen } from '../types';
import { store } from '../store';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isAdmin: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate, isAdmin }) => {
  const unreadCount = store.getUnseenAnnouncementCount();
  
  const navItems = [
    { id: 'HOME', label: 'Home', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { id: 'SCHEDULE', label: 'Book', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { id: 'ANNOUNCEMENTS', label: 'News', badge: unreadCount, icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    )},
    { id: 'BOOKINGS', label: 'Play', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    )},
    { id: isAdmin ? 'ADMIN_DASHBOARD' : 'PROFILE', label: isAdmin ? 'Admin' : 'Me', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )},
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-xl border-t border-zinc-100 flex justify-around items-center py-2 px-1 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50">
      {navItems.map((item) => {
        const isActive = currentScreen === item.id || (item.id === 'ADMIN_DASHBOARD' && currentScreen.startsWith('ADMIN_'));
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as Screen)}
            className={`flex flex-col items-center p-2 rounded-2xl transition-all relative ${
              isActive ? 'text-[#89b11b]' : 'text-zinc-400'
            }`}
          >
            <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
              {item.icon}
            </div>
            {item.badge && item.badge > 0 && !isActive && (
              <span className="absolute top-1 right-2 w-4 h-4 bg-[#9fcc22] text-zinc-950 text-[8px] font-black rounded-full flex items-center justify-center border border-white shadow-sm">
                {item.badge}
              </span>
            )}
            <span className={`text-[8px] mt-1 font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
