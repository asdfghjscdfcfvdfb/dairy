import React, { useState } from 'react';
import { X, Key, ShieldCheck } from 'lucide-react';

export default function PasswordSettingsModal({
  isOpen,
  onClose,
  currentPassword,
  onSavePassword
}) {
  const [newPassword, setNewPassword] = useState(currentPassword);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setMessage('Password cannot be empty.');
      return;
    }
    onSavePassword(newPassword.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Demo Password Settings</h3>
              <p className="text-xs text-slate-500">Configure client prototype access key</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Demo Access Password
          </label>
          <input
            type="text"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setMessage('');
            }}
            className="w-full px-3.5 py-2.5 text-sm font-mono font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            placeholder="e.g. milk123"
          />

          {message && (
            <p className="text-xs text-rose-600 font-semibold mt-2">{message}</p>
          )}

          <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-blue-800">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Prototype Note
            </div>
            This password protects entry forms locally in your browser session for workflow validation. When the backend is integrated, this will be replaced with role-based JWT employee logins.
          </div>

          <div className="mt-5 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
