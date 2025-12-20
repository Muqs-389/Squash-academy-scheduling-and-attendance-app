
import React, { useState } from 'react';
import { Announcement } from '../types';
import { store } from '../store';
import { generateAnnouncementContent } from '../geminiService';

interface AdminAnnouncementsProps {
  onNavigate: () => void;
}

const AdminAnnouncements: React.FC<AdminAnnouncementsProps> = ({ onNavigate }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<'ALL' | 'JUNIOR' | 'ADULT'>('ALL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnnouncement: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      body,
      audience,
      createdAt: new Date().toISOString()
    };
    store.addAnnouncement(newAnnouncement);
    alert("Announcement posted successfully!");
    onNavigate();
  };

  const handleAiDraft = async () => {
    if (!topic) return alert("Please enter a topic for AI to help.");
    setIsGenerating(true);
    const result = await generateAnnouncementContent(topic, audience);

    if ('error' in result) {
      alert(result.error);
    } else {
      setTitle(result.title);
      setBody(result.body);
    }

    setIsGenerating(false);
  };

  return (
    <div className="p-6 pb-32 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8 pt-4">
        <button onClick={onNavigate} className="text-[#89b11b] font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h1 className="text-xl font-black italic uppercase tracking-tighter text-zinc-950">NEW POST</h1>
        <div className="w-10" />
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-zinc-100 mb-8 shadow-sm">
        <h3 className="font-black text-zinc-900 mb-2 flex items-center gap-2 italic uppercase text-sm">
           <svg className="w-5 h-5 text-[#9fcc22]" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,17L10.5,13.5L7,12L10.5,10.5L12,7L13.5,10.5L17,12L13.5,13.5L12,17Z" /></svg>
           AI Draft Assistant
        </h3>
        <p className="text-[10px] text-zinc-500 mb-4 font-bold uppercase tracking-widest opacity-80">Quickly draft updates for your members.</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="e.g. Session cancelled for rain"
            className="flex-1 p-4 rounded-2xl bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-[#9fcc22] text-sm font-bold"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <button 
            onClick={handleAiDraft}
            disabled={isGenerating}
            className="bg-[#9fcc22] text-zinc-950 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm disabled:opacity-50"
          >
            {isGenerating ? '...' : 'Draft'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
        <div>
          <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase tracking-[0.2em] ml-2">Target Audience</label>
          <div className="flex gap-2 p-1 bg-white border border-zinc-100 rounded-[24px] shadow-sm">
            {['ALL', 'JUNIOR', 'ADULT'].map(a => (
              <button
                key={a}
                type="button"
                onClick={() => setAudience(a as any)}
                className={`flex-1 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                  audience === a ? 'bg-[#9fcc22] text-zinc-950 shadow-sm' : 'bg-transparent text-zinc-400'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm space-y-4">
          <div>
            <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase tracking-[0.2em] ml-2">Headline</label>
            <input 
              type="text" required
              className="w-full p-4 bg-zinc-50 rounded-2xl border-2 border-zinc-100 focus:outline-none focus:border-[#9fcc22] font-black text-sm text-zinc-950"
              placeholder="Post Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-400 mb-2 uppercase tracking-[0.2em] ml-2">Message Body</label>
            <textarea 
              required
              rows={4}
              className="w-full p-4 bg-zinc-50 rounded-2xl border-2 border-zinc-100 focus:outline-none focus:border-[#9fcc22] font-bold text-sm text-zinc-950"
              placeholder="What's the update?"
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-zinc-950 text-white py-5 rounded-[28px] font-black shadow-xl active:scale-95 transition-all uppercase tracking-[0.3em] text-xs border-b-4 border-zinc-800"
        >
          Post Announcement
        </button>
      </form>
    </div>
  );
};

export default AdminAnnouncements;
