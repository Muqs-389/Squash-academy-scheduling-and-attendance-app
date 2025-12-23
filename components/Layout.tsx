import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, BookOpen, Megaphone, Shield } from 'lucide-react';
import { useAuth } from '../App';
import { SHOW_DEMO_UI } from '../config';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col relative bg-brand-bg">
      {SHOW_DEMO_UI && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-brand-secondary text-white text-[10px] font-bold text-center py-1 uppercase tracking-wider">
          Demo Protocol Active • Academy Preview
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-32 pt-12 px-6 max-w-lg mx-auto w-full">
        {children}
      </main>

      {/* Clean Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl px-4 py-2.5 shadow-card flex justify-around items-center">
          <NavLink 
            to="/" 
            className={({ isActive }) => `p-3 rounded-2xl transition-all ${isActive ? 'bg-brand-secondary text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            {({ isActive }) => <Home size={22} />}
          </NavLink>
          
          <NavLink 
            to="/schedule" 
            className={({ isActive }) => `p-3 rounded-2xl transition-all ${isActive ? 'bg-brand-secondary text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            {({ isActive }) => <Calendar size={22} />}
          </NavLink>

          <NavLink 
            to="/bookings" 
            className={({ isActive }) => `p-3 rounded-2xl transition-all ${isActive ? 'bg-brand-secondary text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            {({ isActive }) => <BookOpen size={22} />}
          </NavLink>

          <NavLink 
            to="/announcements" 
            className={({ isActive }) => `p-3 rounded-2xl transition-all ${isActive ? 'bg-brand-secondary text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            {({ isActive }) => <Megaphone size={22} />}
          </NavLink>

          {isAdmin && (
            <NavLink 
              to="/admin" 
              className={({ isActive }) => `p-3 rounded-2xl transition-all ${isActive ? 'bg-brand-secondary text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {({ isActive }) => <Shield size={22} />}
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Layout;