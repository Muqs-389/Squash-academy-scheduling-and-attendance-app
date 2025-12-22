import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-slate-500 text-sm font-bold mb-2">{label}</label>}
      <input
        className={`w-full bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} text-slate-800 px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 placeholder-slate-400 transition-all font-medium ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs font-bold mt-1.5 ml-1">{error}</p>}
    </div>
  );
};

export default Input;