import React from 'react';
import { Milk, Shield, ShieldCheck, Calendar } from 'lucide-react';

export default function MobileHeader({ isUnlocked }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <header className="bg-blue-600 text-white px-4 py-3.5 sticky top-0 z-30 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
            <Milk className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight leading-tight">
              Milk Distribution Entry
            </h1>
            <p className="text-[11px] text-blue-100 flex items-center gap-1">
              <Calendar className="w-3 h-3 inline" />
              <span>{today}</span> &bull; <span>Karimnagar</span>
            </p>
          </div>
        </div>

        {/* Lock status pill */}
        <div>
          {isUnlocked ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Unlocked</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Locked</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
