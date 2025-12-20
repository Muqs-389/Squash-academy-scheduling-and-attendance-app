
import React, { useState } from 'react';
import { store } from '../store';

interface AdminSettingsProps {
  onNavigate: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onNavigate }) => {
  const config = store.getConfig();
  const [bgUrl, setBgUrl] = useState(config.customBackground || '');
  const [academyName, setAcademyName] = useState(config.academyName);

  const handleSave = () => {
    store.updateConfig({ 
      customBackground: bgUrl || undefined,
      academyName: academyName
    });
    alert("Design settings updated!");
    onNavigate();
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // In a real app we'd show a viewfinder, for this demo we'll simulate a 'photo' capture 
      // by just using a high-quality stock photo if they use the feature.
      alert("Camera accessed! (Simulation: High-quality coach photo applied)");
      setBgUrl("https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop");
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      alert("Could not access camera. Please check permissions.");
    }
  };

  return (
    <div className="p-6 pb-24 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-10 pt-4">
        <button onClick={onNavigate} className="text-[#9fcc22] font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h1 className="text-xl font-black italic uppercase tracking-tighter">DESIGN SETTINGS</h1>
        <div className="w-10"></div>
      </div>

      <div className="space-y-8 animate-fade-in">
        <div className="bg-zinc-900 p-8 rounded-[40px] border border-white/5">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#9fcc22] mb-6">Home Background</h2>
          
          <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-zinc-800 mb-6 relative group">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${bgUrl || 'WhatsApp Image 2025-12-11 at 19.01.19.jpeg'}')` }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-black uppercase tracking-widest">Preview</span>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleCameraCapture}
              className="w-full bg-white/5 border-2 border-zinc-800 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Take Profile Photo
            </button>

            <div className="relative">
              <label className="block text-[8px] font-black text-zinc-600 mb-2 uppercase tracking-widest ml-4">Or Enter Image URL</label>
              <input 
                type="text"
                placeholder="https://..."
                className="w-full bg-black/30 border-2 border-zinc-800 rounded-2xl p-5 text-sm font-bold focus:border-[#9fcc22] outline-none transition-all"
                value={bgUrl}
                onChange={(e) => setBgUrl(e.target.value)}
              />
            </div>

            {bgUrl && (
              <button 
                onClick={() => setBgUrl('')}
                className="w-full py-2 text-red-500 font-black text-[10px] uppercase tracking-widest"
              >
                Reset to Default Poster
              </button>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 p-8 rounded-[40px] border border-white/5">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#9fcc22] mb-6">Academy Identity</h2>
          <label className="block text-[8px] font-black text-zinc-600 mb-2 uppercase tracking-widest ml-4">Academy Title</label>
          <input 
            type="text"
            className="w-full bg-black/30 border-2 border-zinc-800 rounded-2xl p-5 text-sm font-bold focus:border-[#9fcc22] outline-none transition-all"
            value={academyName}
            onChange={(e) => setAcademyName(e.target.value)}
          />
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-[#9fcc22] text-zinc-950 py-6 rounded-[32px] font-black uppercase tracking-widest text-sm shadow-2xl active:scale-95 transition-all"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
