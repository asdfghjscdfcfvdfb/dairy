import React from 'react';
import { X, Calendar, Clock, User, Package, FileText } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { formatDate, formatTime } from '../utils/formatters';

export default function EntryDetailModal({ entry, isOpen, onClose }) {
  if (!isOpen || !entry) return null;

  // Filter products that have values in this entry
  const filledProducts = PRODUCTS.filter(p => {
    const val = entry.products?.[p.name];
    return val !== '' && val !== null && val !== undefined && parseFloat(val) > 0;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Milk Entry Record Details</h3>
              <p className="text-xs text-slate-500">ID: {entry.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer & Timestamp Info */}
        <div className="p-5 bg-white border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <User className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Customer</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">{entry.customerName}</div>
              <div className="text-xs font-mono font-semibold text-blue-600 mt-0.5">Code: {entry.customerCode}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Calendar className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Logged Timestamp</div>
              <div className="text-sm font-semibold text-slate-800 mt-0.5">{formatDate(entry.timestamp)}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" /> {formatTime(entry.timestamp)}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Metric Pills */}
        <div className="px-5 py-3 bg-blue-50/50 border-b border-blue-100/60 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">
            Products with quantities: <strong className="text-blue-700 font-bold">{entry.totalItems || filledProducts.length}</strong> of 19
          </span>
          <span className="font-medium text-slate-600">
            Total Distributed Quantity: <strong className="text-blue-700 font-bold text-sm">{entry.totalQuantity}</strong>
          </span>
        </div>

        {/* Product Items Breakdown */}
        <div className="p-5 overflow-y-auto flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Product Quantities Breakdown</h4>
          {filledProducts.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-4 text-center">No product quantities recorded in this entry.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filledProducts.map((p) => {
                const qty = entry.products[p.name];
                return (
                  <div 
                    key={p.name}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-mono font-bold flex items-center justify-center">
                        {p.order}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.unit}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-mono font-bold text-base rounded-lg border border-blue-100">
                        {qty}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
