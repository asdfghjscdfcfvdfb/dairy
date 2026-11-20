import React from 'react';
import { CheckCircle2, User, Calendar, Clock, Package, PlusCircle, CloudCheck, FileSpreadsheet } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { formatDate, formatTime } from '../utils/formatters';

export default function SubmissionSuccess({ entry, onNextEntry, syncStatus }) {
  if (!entry) return null;

  const filledProducts = PRODUCTS.filter(p => {
    const val = entry.products?.[p.name];
    return val !== '' && val !== null && val !== undefined && parseFloat(val) > 0;
  });

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-200">
      
      {/* Success Banner */}
      <div className="bg-emerald-600 text-white rounded-2xl p-6 text-center shadow-lg shadow-emerald-600/20">
        <div className="w-16 h-16 rounded-full bg-white text-emerald-600 mx-auto flex items-center justify-center mb-3 shadow-md">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <h2 className="text-xl font-extrabold tracking-tight">Entry Submitted!</h2>
        <p className="text-xs text-emerald-100 mt-1">
          One-time milk distribution recorded successfully.
        </p>

        {/* Sync Status Badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-[11px] font-medium text-emerald-100 border border-emerald-500/50">
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
          <span>{syncStatus?.message || 'Logged & synced'}</span>
        </div>
      </div>

      {/* Digital Receipt Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Receipt Summary</span>
          <span className="text-[11px] font-mono text-slate-400">ID: {entry.id?.slice(-8)}</span>
        </div>

        {/* Customer Details */}
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-slate-500 font-semibold">Customer:</div>
            <div className="text-sm font-bold text-slate-900 leading-snug">{entry.customerName}</div>
            <div className="text-xs font-mono font-bold text-blue-600 mt-0.5">Code: {entry.customerCode}</div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <span className="flex items-center gap-1 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formatDate(entry.timestamp)}
          </span>
          <span className="flex items-center gap-1 font-mono text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {formatTime(entry.timestamp)}
          </span>
        </div>

        {/* Totals Banner */}
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-blue-600 font-semibold uppercase">Total Products</div>
            <div className="text-base font-bold text-blue-950">{entry.totalItems} items</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-blue-600 font-semibold uppercase">Total Quantity</div>
            <div className="text-lg font-black text-blue-700 font-mono">{entry.totalQuantity}</div>
          </div>
        </div>

        {/* Products Breakdown List */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Items Logged ({filledProducts.length})
          </div>
          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
            {filledProducts.map((p) => (
              <div key={p.name} className="py-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{p.name}</span>
                <span className="font-mono font-bold text-blue-600 px-2 py-0.5 bg-slate-100 rounded">
                  {entry.products[p.name]}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Single Submission Notice */}
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-center font-medium">
        ⚠️ This customer&apos;s daily milk entry is completed and locked. Multiple submissions for the same customer are prohibited.
      </div>

      {/* Button to proceed to next customer */}
      <button
        type="button"
        onClick={onNextEntry}
        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Submit for Another Customer</span>
      </button>

    </div>
  );
}
