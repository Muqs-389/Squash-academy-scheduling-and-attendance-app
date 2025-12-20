
import React, { useState, useEffect } from 'react';
import { Screen, User, UserRole } from './types';
import { store } from './store';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import MonthlyPlansScreen from './screens/MonthlyPlansScreen';
import AnnouncementsScreen from './screens/AnnouncementsScreen';
import AdminDashboard from './screens/AdminDashboard';
import AdminSessions from './screens/AdminSessions';
import AdminAnnouncements from './screens/AdminAnnouncements';
import AdminAttendance from './screens/AdminAttendance';
import AdminMembers from './screens/AdminMembers';
import AdminSettings from './screens/AdminSettings';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('AUTH');
  const [currentUser, setCurrentUser] = useState<User | null>(store.getCurrentUser());
  const [isReady, setIsReady] = useState(store.isInitialized && store.isAuthReady);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
      setSyncError(store.syncError);
      setIsReady(store.isInitialized && store.isAuthReady);
      setVersion(v => v + 1);
    });

    if (currentUser && currentScreen === 'AUTH') {
      setCurrentScreen('HOME');
    }

    return () => unsubscribe();
  }, [currentUser, currentScreen]);

  const handleLogout = () => {
    store.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentScreen('AUTH');
  };

  const academyConfig = store.getConfig();

  // If sync error occurs, show full screen error
  if (syncError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-zinc-950 p-10 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-xl font-black italic uppercase tracking-tighter mb-4">Security Error</h2>
        <p className="text-zinc-500 text-xs font-bold leading-relaxed mb-10">{syncError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl"
        >
          Check Connectivity
        </button>
      </div>
    );
  }

  // Loading state
  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-zinc-950 p-8">
        <div className="w-16 h-16 border-4 border-[#9fcc22] border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-lg font-black italic uppercase tracking-tighter">Securing Connection...</h2>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">Connecting to Squash Cloud</p>
      </div>
    );
  }

  const renderScreen = () => {
    if (!currentUser && currentScreen !== 'AUTH') return <AuthScreen onLogin={(u) => store.setCurrentUser(u)} academyName={academyConfig.academyName} />;

    switch (currentScreen) {
      case 'AUTH': return <AuthScreen onLogin={(u) => store.setCurrentUser(u)} academyName={academyConfig.academyName} />;
      case 'HOME': return <HomeScreen user={currentUser!} academyName={academyConfig.academyName} onNavigate={setCurrentScreen} />;
      case 'PLANS': return <MonthlyPlansScreen user={currentUser!} onNavigate={setCurrentScreen} />;
      case 'SCHEDULE': return <ScheduleScreen user={currentUser!} onNavigate={setCurrentScreen} />;
      case 'BOOKINGS': return <MyBookingsScreen user={currentUser!} onNavigate={setCurrentScreen} />;
      case 'ANNOUNCEMENTS': return <AnnouncementsScreen onNavigate={setCurrentScreen} />;
      case 'PROFILE': return <ProfileScreen user={currentUser!} onLogout={handleLogout} academyName={academyConfig.academyName} onUpdateAcademyName={(name) => store.updateConfig({ academyName: name })} />;
      case 'ADMIN_DASHBOARD': return <AdminDashboard onNavigate={setCurrentScreen} />;
      case 'ADMIN_SESSIONS': return <AdminSessions onNavigate={() => setCurrentScreen('ADMIN_DASHBOARD')} />;
      case 'ADMIN_ANNOUNCEMENTS': return <AdminAnnouncements onNavigate={() => setCurrentScreen('ADMIN_DASHBOARD')} />;
      case 'ADMIN_ATTENDANCE': return <AdminAttendance onNavigate={() => setCurrentScreen('ADMIN_DASHBOARD')} />;
      case 'ADMIN_MEMBERS': return <AdminMembers onNavigate={() => setCurrentScreen('ADMIN_DASHBOARD')} />;
      case 'ADMIN_SETTINGS': return <AdminSettings onNavigate={() => setCurrentScreen('ADMIN_DASHBOARD')} />;
      default: return <HomeScreen user={currentUser!} academyName={academyConfig.academyName} onNavigate={setCurrentScreen} />;
    }
  };

  const showNav = currentUser && currentScreen !== 'AUTH' && !currentScreen.startsWith('ADMIN_');

  return (
    <div key={version} className="flex flex-col h-[100dvh] max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden relative">
      <main className="flex-1 overflow-y-auto no-scrollbar relative z-0">
        <div className={`flex flex-col min-h-full ${showNav ? 'pb-32' : ''}`}>
          {renderScreen()}
        </div>
      </main>
      
      {showNav && (
        <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} isAdmin={currentUser?.role === UserRole.ADMIN} />
      )}
    </div>
  );
};

export default App;
