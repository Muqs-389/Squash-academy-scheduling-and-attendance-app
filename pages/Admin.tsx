import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { api, clearLocalDataStores } from '../lib/api';
import Button from '../components/Button';
import Input from '../components/Input';
import { ShieldCheck, Trophy } from 'lucide-react';

const Admin: React.FC = () => {
  const { isAdmin, userProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sessions' | 'announcements' | 'tips'>('sessions');
  
  const [title, setTitle] = useState('Academy Training');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('16:00');
  const [newsTitle, setNewsTitle] = useState('');
  const [newsBody, setNewsBody] = useState('');
  const [tipBody, setTipBody] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const startDateTime = new Date(`${date}T${time}`);
      const endDateTime = new Date(startDateTime.getTime() + 90 * 60000); // Default 1.5hrs

      await api.createSession({
        title,
        start: { toDate: () => startDateTime },
        end: { toDate: () => endDateTime },
        location: 'Academy Court',
        capacity: 7, // Fixed at 7 per coach request
        recurrence: 'none',
        createdBy: userProfile?.uid
      } as any);

      alert('Rally on! Session added to timetable.');
      setDate('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createAnnouncement({
        title: newsTitle,
        body: newsBody,
        createdBy: userProfile?.uid
      } as any);

      alert('Announcement published to the wall.');
      setNewsTitle('');
      setNewsBody('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipBody.trim()) return;
    setLoading(true);
    try {
      await api.createTip(tipBody.trim(), userProfile?.uid || 'coach');
      alert('Pro-tip posted for members.');
      setTipBody('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = () => {
    if (!window.confirm('Reset all app data? This will clear roster, sessions, bookings, announcements, tips, and sign-in state.')) return;

    clearLocalDataStores();
    window.location.reload();
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <div>
           <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Coach Control</h1>
           <p className="text-slate-500 font-medium">Manage your roster and academy.</p>
        </div>
        <div className="bg-slate-900 text-white p-3 rounded-2xl">
            <ShieldCheck size={28} />
        </div>
      </header>

      <div className="flex p-1.5 bg-slate-100 rounded-2xl">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'sessions' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Add Session
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'announcements' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Post News
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'tips' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Pro Tips
        </button>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-card">
        {activeTab === 'sessions' ? (
          <form onSubmit={handleCreateSession} className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <Trophy size={20} className="text-brand-secondary" />
                <h2 className="text-xl font-bold text-slate-800">New Training Roster</h2>
            </div>
            <Input label="Session Title" value={title} onChange={e => setTitle(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
              <Input label="Start Time" type="time" value={time} onChange={e => setTime(e.target.value)} required />
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Academy Rule</p>
                <p className="text-slate-700 text-sm font-bold">Capacity is locked at 7 players per session.</p>
            </div>
            <Button type="submit" isLoading={loading}>Add to Schedule</Button>
          </form>
        ) : activeTab === 'announcements' ? (
          <form onSubmit={handlePostAnnouncement} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Global Announcement</h2>
            <Input label="Headline" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} required placeholder="e.g., Tournament Winners!" />
            <div>
              <label className="block text-slate-500 text-sm font-bold mb-2 ml-1">Message Content</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-5 py-4 rounded-3xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 placeholder-slate-400 h-40 transition-all font-medium"
                value={newsBody}
                onChange={e => setNewsBody(e.target.value)}
                required
                placeholder="Share the news with the academy..."
              />
            </div>
            <Button type="submit" isLoading={loading}>Broadcast News</Button>
          </form>
        ) : (
          <form onSubmit={handleCreateTip} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Coach Pro-Tip</h2>
            <div>
              <label className="block text-slate-500 text-sm font-bold mb-2 ml-1">Tip Content</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-5 py-4 rounded-3xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 placeholder-slate-400 h-32 transition-all font-medium"
                value={tipBody}
                onChange={e => setTipBody(e.target.value)}
                required
                placeholder="Share a quick training cue for players"
              />
            </div>
            <Button type="submit" isLoading={loading}>Publish Pro-Tip</Button>
          </form>
        )}
      </div>
      
      <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
        <h3 className="text-brand-accent text-xs uppercase font-black tracking-widest mb-3 flex items-center gap-2">
            <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
            </div>
            Coach Dashboard Info
        </h3>
        <ul className="space-y-3">
            <li className="text-slate-400 text-xs font-medium">• 7 is the magic number. Roster limits are automatically enforced.</li>
            <li className="text-slate-400 text-xs font-medium">• Past sessions are automatically archived from the user view.</li>
            <li className="text-slate-400 text-xs font-medium">• Use the "News" section for weather alerts or tournament results.</li>
        </ul>
        <div className="mt-6">
          <Button onClick={handleResetData} variant="danger" className="w-full">Reset Data</Button>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 text-center">Clears local storage & reloads</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;