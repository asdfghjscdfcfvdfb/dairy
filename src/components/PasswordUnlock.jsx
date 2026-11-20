import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';
import { CONFIG } from '../config';

export default function PasswordUnlock({
  isUnlocked,
  isCustomerSelected,
  onUnlock,
  onLock,
  disabled
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (disabled) return;

    if (!isCustomerSelected) {
      setErrorMessage('Enter customer code first.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter password.');
      return;
    }

    const success = onUnlock(password);
    if (!success) {
      setErrorMessage('Incorrect password.');
    } else {
      setPassword('');
      setErrorMessage('');
    }
  };

  const handleAutoFill = () => {
    setPassword(CONFIG.DEMO_PASSWORD);
    setErrorMessage('');
  };

  return (
    <div className={`rounded-2xl border p-4 transition-all ${
      isUnlocked ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200 shadow-xs'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          Step 2: Password Authorization
        </h2>
        {isUnlocked ? (
          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Unlocked
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked
          </span>
        )}
      </div>

      {!isUnlocked ? (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2.5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              disabled={!isCustomerSelected || disabled}
              placeholder={disabled ? "Submission locked for today" : isCustomerSelected ? "Enter password..." : "Select customer first"}
              className="w-full h-12 pl-10 pr-10 text-sm font-medium rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={!isCustomerSelected || disabled}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 disabled:opacity-40"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1 text-xs font-semibold text-rose-600">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!isCustomerSelected || disabled}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Entry Form</span>
            </button>
            <button
              type="button"
              onClick={handleAutoFill}
              disabled={!isCustomerSelected || disabled}
              className="h-11 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl disabled:opacity-40 transition-colors"
              title="Auto-fill demo password"
            >
              Auto-fill ({CONFIG.DEMO_PASSWORD})
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-2.5 flex items-center justify-between text-xs text-emerald-800">
          <span>Form is unlocked for quantity entry.</span>
          <button
            type="button"
            onClick={onLock}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 underline underline-offset-2"
          >
            Lock Form
          </button>
        </div>
      )}
    </div>
  );
}
