import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Download, 
  Trash2, 
  Edit3, 
  Eye, 
  Calendar, 
  Clock, 
  User, 
  Database, 
  AlertTriangle, 
  Package, 
  Check, 
  Filter 
} from 'lucide-react';
import { formatDate, formatTime, exportEntriesToCSV } from '../utils/formatters';
import ConfirmationModal from './ConfirmationModal';
import EntryDetailModal from './EntryDetailModal';

export default function EntryHistory({
  entries = [],
  currentCustomerCode,
  onEditEntry,
  onDeleteEntry,
  onClearAllEntries
}) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'customer'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntryForDetails, setSelectedEntryForDetails] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  // Filter entries based on filterMode & search
  const filteredEntries = useMemo(() => {
    let result = entries;

    if (filterMode === 'customer' && currentCustomerCode) {
      result = result.filter(e => e.customerCode === currentCustomerCode);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(e => 
        e.customerCode.toLowerCase().includes(q) ||
        (e.customerName || '').toLowerCase().includes(q) ||
        (formatDate(e.timestamp) || '').toLowerCase().includes(q)
      );
    }

    // Sort newest first
    return [...result].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [entries, filterMode, currentCustomerCode, searchQuery]);

  const customerEntriesCount = useMemo(() => {
    if (!currentCustomerCode) return 0;
    return entries.filter(e => e.customerCode === currentCustomerCode).length;
  }, [entries, currentCustomerCode]);

  const totalQuantityLogged = useMemo(() => {
    return filteredEntries.reduce((sum, e) => sum + (e.totalQuantity || 0), 0);
  }, [filteredEntries]);

  const handleExport = () => {
    exportEntriesToCSV(filteredEntries);
  };

  const handleConfirmDelete = () => {
    if (entryToDelete) {
      onDeleteEntry(entryToDelete.id);
      setEntryToDelete(null);
    }
  };

  const handleConfirmClearAll = () => {
    onClearAllEntries();
    setIsClearAllModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              4. Saved Entry History
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold border border-slate-200">
                {entries.length} Records
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Temporary browser storage (localStorage) for daily milk distributions
          </p>
        </div>

        {/* Export & Clear All actions */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleExport}
            disabled={filteredEntries.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 font-semibold text-xs transition-colors shadow-xs"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>

          {entries.length > 0 && (
            <button
              type="button"
              onClick={() => setIsClearAllModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors"
              title="Clear all saved records in browser"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* LocalStorage Technical Notice Callout */}
      <div className="my-4 p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
        <Database className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-blue-900 font-semibold">Temporary Browser Storage:</strong> Entries are temporarily persisted in your browser&apos;s localStorage for testing and offline convenience. A cloud backend (Supabase / REST API) can be hooked up without altering this component structure.
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        {/* Filter Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Entries ({entries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('customer')}
            disabled={!currentCustomerCode}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              filterMode === 'customer'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Current Customer {currentCustomerCode ? `(${customerEntriesCount})` : ''}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code, name, or date..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Entries List / Table */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">No Saved Entries Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {filterMode === 'customer'
              ? `No saved entries for customer code ${currentCustomerCode || ''}. Try switching to "All Entries".`
              : 'Select a customer, unlock with the password, and save your first milk product entry.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => {
            const isCurrentCustomer = entry.customerCode === currentCustomerCode;
            const topProducts = Object.entries(entry.products || {})
              .filter(([_, v]) => v !== '' && parseFloat(v) > 0)
              .slice(0, 4);

            return (
              <div
                key={entry.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrentCustomer
                    ? 'bg-blue-50/20 border-blue-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Customer Info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-mono font-bold rounded-lg border border-slate-200 flex-shrink-0 mt-0.5">
                      {entry.customerCode}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">
                        {entry.customerName}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(entry.timestamp)}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formatTime(entry.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Pills & Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                        {entry.totalItems} items
                      </span>
                      <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-xs font-bold text-blue-700">
                        Qty: {entry.totalQuantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedEntryForDetails(entry)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        title="View Full Breakdown"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditEntry(entry)}
                        className="p-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        title="Edit Entry in Form"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setEntryToDelete(entry)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Preview of entered products tags */}
                {topProducts.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">Quantities:</span>
                    {topProducts.map(([name, qty]) => (
                      <span
                        key={name}
                        className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-mono text-[11px]"
                      >
                        {name}: <strong>{qty}</strong>
                      </span>
                    ))}
                    {entry.totalItems > 4 && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        +{entry.totalItems - 4} more...
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Entry Details Modal */}
      <EntryDetailModal
        entry={selectedEntryForDetails}
        isOpen={!!selectedEntryForDetails}
        onClose={() => setSelectedEntryForDetails(null)}
      />

      {/* Delete Entry Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!entryToDelete}
        title="Delete Saved Entry?"
        message={`Are you sure you want to delete the record for ${entryToDelete?.customerName} (${entryToDelete?.customerCode}) logged on ${formatDate(entryToDelete?.timestamp)}? This action cannot be undone.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setEntryToDelete(null)}
      />

      {/* Clear All History Confirmation Modal */}
      <ConfirmationModal
        isOpen={isClearAllModalOpen}
        title="Clear Entire Entry History?"
        message="Are you sure you want to delete all saved entries from localStorage? This will remove all customer records saved in this browser."
        confirmText="Clear All History"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmClearAll}
        onCancel={() => setIsClearAllModalOpen(false)}
      />
    </div>
  );
}
