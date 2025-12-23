import React, { createContext, useContext, useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserProfile } from './types';
import { api } from './lib/api';
import { DEMO_MODE } from './config';
import { isConfigured } from './firebase';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Bookings from './pages/Bookings';
import Announcements from './pages/Announcements';
import Admin from './pages/Admin';
import Layout from './components/Layout';

// Context
interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ userProfile: null, loading: true, isAdmin: false });
export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = api.subscribeAuth((user) => {
      setUserProfile(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ userProfile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-brand-green">
        Loading...
      </div>
    );
  }
  if (!userProfile) return <Navigate to="/login" state={{ from: location }} replace />;

  return <>{children}</>;
};

const SetupScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center p-8 bg-slate-900 text-white">
    <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
      <h1 className="text-2xl font-bold text-brand-green mb-4">Setup Required</h1>
      <p className="text-slate-300 mb-6">
        The app is running, but it's not connected to your Firebase project yet.
      </p>
      <div className="space-y-4 text-sm text-slate-400 bg-slate-900/50 p-4 rounded-xl font-mono">
        <p>1. Open <span className="text-white">firebase.ts</span></p>
        <p>2. Locate <span className="text-white">firebaseConfig</span></p>
        <p>3. Replace the <span className="text-yellow-400">apiKey</span> and other fields with your project details from the Firebase Console.</p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="mt-6 w-full py-3 bg-brand-green text-slate-900 font-bold rounded-xl hover:bg-green-400 transition-colors"
      >
        I've Updated It, Reload
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  // If not demo mode and not configured, show setup
  if (!DEMO_MODE && !isConfigured) {
    return <SetupScreen />;
  }

  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={(
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/schedule"
            element={(
              <ProtectedRoute>
                <Layout>
                  <Schedule />
                </Layout>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/bookings"
            element={(
              <ProtectedRoute>
                <Layout>
                  <Bookings />
                </Layout>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/announcements"
            element={(
              <ProtectedRoute>
                <Layout>
                  <Announcements />
                </Layout>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin"
            element={(
              <ProtectedRoute>
                <Layout>
                  <Admin />
                </Layout>
              </ProtectedRoute>
            )}
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
