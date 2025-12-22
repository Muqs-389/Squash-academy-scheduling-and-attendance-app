
import React, { useState } from 'react';
import { api } from '../lib/api';
import Button from '../components/Button';
import Input from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Trophy, Plus, X, ChevronRight, Activity, ArrowLeft, KeyRound, Mail, UserCircle } from 'lucide-react';

type LoginView = 'selection' | 'coach-pin' | 'parent-signup' | 'parent-roster';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<LoginView>('selection');
  const navigate = useNavigate();

  // Coach State
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Parent State
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [children, setChildren] = useState<string[]>([]);
  const [newChild, setNewChild] = useState('');

  const handleCoachLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPinError('');
    try {
      await api.login({ role: 'admin', pin });
      navigate('/');
    } catch (e: any) {
      setPinError(e.message);
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const handleParentSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !parentEmail || !parentPassword) return;
    setView('parent-roster');
  };

  const handleFinalParentLogin = async () => {
    setLoading(true);
    try {
      await api.login({
        role: 'parent',
        email: parentEmail,
        displayName: parentName,
        children: children
      });
      navigate('/');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addChild = () => {
    if (newChild.trim()) {
      setChildren([...children, newChild.trim()]);
      setNewChild('');
    }
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const renderSelection = () => (
    <div className="space-y-4">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center mb-8">Choose Portal Entry</p>
      
      <button 
        onClick={() => setView('coach-pin')}
        className="w-full bg-slate-900 p-6 rounded-[2rem] flex items-center justify-between group transition-all active:scale-95 shadow-xl"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="bg-white/10 p-2.5 rounded-xl text-brand-lime">
            <Shield size={22} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-lg font-black text-white leading-none">Coach Entry</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Admin Protocol</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-700" />
      </button>

      <button 
        onClick={() => setView('parent-signup')}
        className="w-full bg-slate-50 p-6 rounded-[2rem] flex items-center justify-between group transition-all active:scale-95 border border-slate-100"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="bg-brand-lime p-2.5 rounded-xl text-white shadow-lime-glow">
            <User size={22} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 leading-none">Parent Portal</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Create Account</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-300" />
      </button>
    </div>
  );

  const renderCoachPin = () => (
    <form onSubmit={handleCoachLogin} className="space-y-6 animate-in slide-in-from-right-4">
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={() => setView('selection')} className="text-slate-400 hover:text-slate-600 flex items-center gap-1">
          <ArrowLeft size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>
        <KeyRound size={20} className="text-brand-lime" />
      </div>
      
      <div className="text-center mb-8">
        <h3 className="text-xl font-black text-slate-900 uppercase italic">Coach Verification</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enter Security PIN</p>
      </div>

      <div className="space-y-4">
        <input 
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={4}
          autoFocus
          placeholder="••••"
          className={`w-full text-center text-4xl font-black tracking-[0.5em] py-5 rounded-3xl bg-slate-50 border-2 ${pinError ? 'border-red-500' : 'border-slate-100 focus:border-brand-lime'} outline-none transition-all`}
        />
        {pinError && <p className="text-red-500 text-[10px] font-black uppercase text-center">{pinError}</p>}
        
        <div className="pt-4">
          <Button type="submit" isLoading={loading} disabled={pin.length < 4}>Verify & Enter</Button>
        </div>
      </div>
    </form>
  );

  const renderParentSignup = () => (
    <form onSubmit={handleParentSignup} className="space-y-6 animate-in slide-in-from-right-4">
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={() => setView('selection')} className="text-slate-400 hover:text-slate-600 flex items-center gap-1">
          <ArrowLeft size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>
        <UserCircle size={20} className="text-brand-lime" />
      </div>

      <div className="text-center mb-8">
        <h3 className="text-xl font-black text-slate-900 uppercase italic">Parent Sign Up</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Create your family account</p>
      </div>

      <div className="space-y-1">
        <Input 
          label="Full Name" 
          value={parentName} 
          onChange={e => setParentName(e.target.value)} 
          placeholder="e.g. John Smith" 
          required 
        />
        <Input 
          label="Email Address" 
          type="email" 
          value={parentEmail} 
          onChange={e => setParentEmail(e.target.value)} 
          placeholder="parent@example.com" 
          required 
        />
        <Input 
          label="Secure Password" 
          type="password" 
          value={parentPassword} 
          onChange={e => setParentPassword(e.target.value)} 
          placeholder="••••••••" 
          required 
        />
        
        <div className="pt-4">
          <Button type="submit" disabled={!parentName || !parentEmail || !parentPassword}>
            Next: Register Juniors
          </Button>
        </div>
      </div>
    </form>
  );

  const renderParentRoster = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4">
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={() => setView('parent-signup')} className="text-slate-400 hover:text-slate-600 flex items-center gap-1">
          <ArrowLeft size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>
        <Activity size={20} className="text-brand-lime" />
      </div>

      <div className="text-center mb-8">
        <h3 className="text-xl font-black text-slate-900 uppercase italic">Add Juniors</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Register children for squads</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input 
            value={newChild}
            onChange={e => setNewChild(e.target.value)}
            placeholder="Athlete Name..."
            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-lime/20"
            onKeyPress={(e) => e.key === 'Enter' && addChild()}
          />
          <button 
            onClick={addChild}
            className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-colors shadow-lg"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
          {children.map((child, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-50/50 px-5 py-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-ball"></div>
                <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{child}</span>
              </div>
              <button onClick={() => removeChild(i)} className="text-red-300 hover:text-red-500 p-1">
                <X size={16} strokeWidth={3}/>
              </button>
            </div>
          ))}
          {children.length === 0 && (
            <div className="text-center py-10 opacity-30 border-2 border-dashed border-slate-100 rounded-[2rem]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Add Junior Name Above</p>
            </div>
          )}
        </div>

        <Button 
          onClick={handleFinalParentLogin}
          isLoading={loading}
          disabled={children.length === 0}
          className="py-5"
        >
          Complete Setup & Enter
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brand-bg relative overflow-hidden">
      {/* Decorative Branding */}
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] academy-gradient rounded-full opacity-10 blur-[120px]"></div>
      
      <div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in-95 duration-700">
        <div className="mb-10 text-center">
          <div className="inline-flex bg-slate-900 w-24 h-24 rounded-[2.5rem] shadow-premium items-center justify-center mb-6 relative">
            <Trophy className="text-brand-lime" size={48} strokeWidth={2.5} />
            <div className="absolute -bottom-2 -right-2 flex gap-1 bg-white p-2 rounded-full shadow-lg">
                <div className="w-2 h-2 bg-brand-ball rounded-full"></div>
                <div className="w-2 h-2 bg-brand-ball rounded-full"></div>
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 leading-none tracking-tighter uppercase italic">
            Muqs' School<br/><span className="text-brand-lime">Of Squash</span>
          </h1>
        </div>

        <div className="bg-white p-8 rounded-[3.5rem] shadow-premium border border-white">
          {view === 'selection' && renderSelection()}
          {view === 'coach-pin' && renderCoachPin()}
          {view === 'parent-signup' && renderParentSignup()}
          {view === 'parent-roster' && renderParentRoster()}
        </div>
        
        <p className="text-center text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] mt-12 opacity-50">
          Built for Muqs' School of Squash
        </p>
      </div>
    </div>
  );
};

export default Login;
