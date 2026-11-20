import React, { useState, useEffect } from 'react';
import { Milk, Shield, ShieldCheck, Calendar, Clock, Key } from 'lucide-react';

export default function Header({ isUnlocked, onOpenPasswordSettings }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Logo & Titles */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
              <Milk className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Milk Distribution Management
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  Karimnagar
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Customer Product Entry & Daily Milk Logistics
              </p>
            </div>
          </div>

          {/* Date, Status Indicator, and Demo Key Settings */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 flex-wrap">
            {/* Live Date & Time */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-600 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{formattedDate}</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-[11px]">{formattedTime}</span>
              </div>
            </div>

            {/* Lock / Unlock Status Badge */}
            <div className="flex items-center gap-2">
              {isUnlocked ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Entry Unlocked</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold shadow-xs">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>Form Locked</span>
                </div>
              )}

              {/* Password Settings Quick Button */}
              {onOpenPasswordSettings && (
                <button
                  type="button"
                  onClick={onOpenPasswordSettings}
                  title="Configure Demo Password"
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                >
                  <Key className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
