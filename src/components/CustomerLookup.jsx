import React from 'react';
import { Search, UserCheck, AlertCircle, X, Check, Lock, AlertTriangle } from 'lucide-react';

export default function CustomerLookup({
  customerCode,
  customerName,
  lookupStatus, // 'idle' | 'found' | 'not_found'
  onCodeChange,
  onClearCode,
  alreadySubmittedInfo,
  onResetCustomerSubmission
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          Step 1: Customer Code
        </h2>
        <span className="text-[11px] font-semibold text-slate-400">163 Registered</span>
      </div>

      {/* Customer Code Input */}
      <div>
        <label htmlFor="mobileCustomerCode" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
          Enter Customer Code <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="mobileCustomerCode"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={customerCode}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="e.g. 3805, 3825, 3826..."
            maxLength={8}
            className={`w-full h-12 pl-10 pr-10 text-base font-mono font-bold rounded-xl border transition-all ${
              lookupStatus === 'found'
                ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20 text-slate-900'
                : lookupStatus === 'not_found'
                ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/30 text-rose-900'
                : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
            } focus:outline-none`}
            autoComplete="off"
          />
          {customerCode && (
            <button
              type="button"
              onClick={onClearCode}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status text */}
        <div className="mt-1.5 text-xs min-h-[18px]">
          {lookupStatus === 'found' && !alreadySubmittedInfo && (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Customer verified
            </span>
          )}
          {lookupStatus === 'not_found' && (
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Customer Not Found
            </span>
          )}
        </div>
      </div>

      {/* Customer Name Field (Strictly Read-Only) */}
      <div>
        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Customer Name</span>
          <span className="text-[10px] font-normal text-slate-400 flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5" /> Read-Only
          </span>
        </label>
        <div className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border flex items-center gap-2.5 ${
          lookupStatus === 'found'
            ? 'bg-slate-50 border-emerald-300 text-slate-900'
            : 'bg-slate-100/70 border-slate-200 text-slate-400'
        }`}>
          <UserCheck className={`w-4 h-4 flex-shrink-0 ${lookupStatus === 'found' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <div className="flex-1 font-bold text-xs sm:text-sm leading-tight truncate">
            {lookupStatus === 'found' ? customerName : <span className="font-normal italic text-slate-400 text-xs">Customer name will appear here</span>}
          </div>
        </div>
      </div>

      {/* ONE-TIME SUBMISSION ALERT (If already submitted today) */}
      {alreadySubmittedInfo && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start justify-between gap-2.5 text-xs text-rose-800 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-900">Already Submitted Today</div>
              <div>Entry was recorded at {alreadySubmittedInfo.time}. (1 submission per day rule)</div>
            </div>
          </div>
          {onResetCustomerSubmission && (
            <button
              type="button"
              onClick={onResetCustomerSubmission}
              className="px-2 py-1 bg-white border border-rose-300 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-lg shadow-2xs whitespace-nowrap"
            >
              Reset for testing
            </button>
          )}
        </div>
      )}
    </div>
  );
}
