
import React, { useState } from 'react';
import { User, ChildProfile, UserRole } from '../types';
import { store } from '../store';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  academyName: string;
  onUpdateAcademyName: (name: string) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, academyName, onUpdateAcademyName }) => {
  const [isEditingAcademy, setIsEditingAcademy] = useState(false);
  const [tempAcademyName, setTempAcademyName] = useState(academyName);
  
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  
  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !childAge) return;
    
    const newChild: ChildProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: childName,
      age: parseInt(childAge)
    };
    
    const updatedUser = {
      ...user,
      children: [...(user.children || []), newChild]
    };
    
    store.updateUser(updatedUser);
    setChildName('');
    setChildAge('');
    alert("Child added successfully!");
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button 
          onClick={onLogout}
          className="text-red-500 font-bold text-sm px-4 py-2 bg-red-50 rounded-xl"
        >
          Log Out
        </button>
      </header>

      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-3xl font-black mb-4">
          {user.name.charAt(0)}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
        <p className="text-gray-500 text-sm">{user.phone}</p>
        <span className="mt-2 text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
          {user.role} Account
        </span>
      </div>

      {user.role === UserRole.ADMIN && (
        <div className="mb-10 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Academy Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academy Name</label>
              {isEditingAcademy ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 p-3 bg-gray-50 rounded-xl border-none text-sm"
                    value={tempAcademyName}
                    onChange={e => setTempAcademyName(e.target.value)}
                  />
                  <button 
                    onClick={() => {
                      onUpdateAcademyName(tempAcademyName);
                      setIsEditingAcademy(false);
                    }}
                    className="bg-emerald-600 text-white px-4 rounded-xl text-sm font-bold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-bold text-gray-800">{academyName}</span>
                  <button onClick={() => setIsEditingAcademy(true)} className="text-emerald-600 text-xs font-bold">Edit</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Family Profiles</h3>
        
        <div className="space-y-3 mb-6">
          {user.children?.map(child => (
            <div key={child.id} className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div>
                <p className="font-bold text-emerald-900">{child.name}</p>
                <p className="text-xs text-emerald-700 opacity-60">Age {child.age}</p>
              </div>
              <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>
            </div>
          ))}
          {!user.children?.length && (
            <p className="text-xs text-gray-400 italic text-center py-4">No family members linked yet.</p>
          )}
        </div>

        <form onSubmit={handleAddChild} className="space-y-3 border-t border-gray-50 pt-6">
          <p className="text-xs font-bold text-gray-800 mb-2">Link a child/student</p>
          <input 
            type="text" 
            placeholder="Child's Full Name"
            className="w-full p-4 bg-gray-50 rounded-xl border-none text-sm"
            value={childName}
            onChange={e => setChildName(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Age"
            className="w-full p-4 bg-gray-50 rounded-xl border-none text-sm"
            value={childAge}
            onChange={e => setChildAge(e.target.value)}
          />
          <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-100 active:scale-95 transition-all">
            Add Family Member
          </button>
        </form>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Powered by Squash Academy Pro v1.0</p>
      </div>
    </div>
  );
};

export default ProfileScreen;
