import React, { useState, useMemo } from 'react';
import { Search, X, Check, Building2 } from 'lucide-react';
import customersData from '../data/customers.json';

export default function CustomerSearchModal({ isOpen, onClose, onSelectCustomer, currentCode }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customersData;
    const term = searchTerm.toLowerCase().trim();
    return customersData.filter(c => 
      c.code.toLowerCase().includes(term) || 
      c.name.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Customer Directory</h3>
              <p className="text-xs text-slate-500">163 Verified Milk Distribution Customers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by code (e.g. 3805) or customer name..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-500">
            <span>Showing {filteredCustomers.length} of 163 customers</span>
            {searchTerm && <span>Filter: &ldquo;{searchTerm}&rdquo;</span>}
          </div>
        </div>

        {/* Customer List */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 p-2">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm font-medium text-slate-600">No customers match your search.</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by partial customer code or name.</p>
            </div>
          ) : (
            filteredCustomers.map((cust) => {
              const isSelected = cust.code === currentCode;
              return (
                <button
                  key={cust.code}
                  type="button"
                  onClick={() => {
                    onSelectCustomer(cust.code);
                    onClose();
                  }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                    isSelected ? 'bg-blue-50/80 border border-blue-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-lg border border-slate-200 flex-shrink-0">
                      {cust.code}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 truncate">
                      {cust.name}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 flex-shrink-0">
                      <Check className="w-4 h-4" /> Selected
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}
