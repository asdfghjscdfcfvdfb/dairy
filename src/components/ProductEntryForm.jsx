import React, { useState } from 'react';
import { Send, Lock, RotateCcw, AlertCircle } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import ProductInput from './ProductInput';
import ConfirmationModal from './ConfirmationModal';
import { calculateProductSummary, hasAnyProductValue } from '../utils/formatters';

export default function ProductEntryForm({
  isUnlocked,
  isCustomerSelected,
  productValues,
  onChangeProductValue,
  onClearAllValues,
  onSubmitEntry,
  isSubmitting,
  alreadySubmitted
}) {
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [validationError, setValidationError] = useState('');

  const summary = calculateProductSummary(productValues);
  const hasValues = hasAnyProductValue(productValues);

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setValidationError('');

    if (alreadySubmitted) {
      setValidationError('Entry was already submitted for this customer today.');
      return;
    }

    if (!isCustomerSelected) {
      setValidationError('Please select a valid customer first.');
      return;
    }

    if (!isUnlocked) {
      setValidationError('Please unlock the form with password first.');
      return;
    }

    if (!hasValues) {
      setValidationError('Please enter quantity for at least one dairy product.');
      return;
    }

    onSubmitEntry();
  };

  return (
    <div className="space-y-3 pb-24">
      {/* Section Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            Step 3: Dairy Quantities (19 Products)
          </h2>
          <p className="text-[11px] text-slate-400">Leave blank if no quantity distributed</p>
        </div>

        {/* Live Tally Pill */}
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Qty</div>
          <div className="text-sm font-black font-mono text-blue-600">{summary.totalQuantity}</div>
        </div>
      </div>

      {/* Locked message banner */}
      {!isUnlocked && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800">
          <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Product inputs are locked. Complete Step 2 above to edit quantities.</span>
        </div>
      )}

      {/* 19 Product Grid (Mobile 2 columns) */}
      <div className="grid grid-cols-2 gap-2.5">
        {PRODUCTS.map((product) => (
          <ProductInput
            key={product.id}
            product={product}
            value={productValues[product.name] ?? ''}
            onChange={onChangeProductValue}
            disabled={!isUnlocked || alreadySubmitted}
          />
        ))}
      </div>

      {/* Validation alert */}
      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STICKY BOTTOM ACTION BAR (Designed specifically for Mobile Thumbs) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 max-w-md mx-auto shadow-xl">
        <div className="flex items-center gap-2.5">
          {/* Clear Button */}
          <button
            type="button"
            onClick={() => setIsClearModalOpen(true)}
            disabled={!isUnlocked || !hasValues || alreadySubmitted}
            className="h-12 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-semibold text-xs flex items-center gap-1 disabled:opacity-30"
            title="Clear all fields"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Large Submit Button (1-Time Submission) */}
          <button
            type="button"
            onClick={handleSubmitClick}
            disabled={!isUnlocked || !isCustomerSelected || !hasValues || isSubmitting || alreadySubmitted}
            className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Recording Entry...</span>
              </>
            ) : alreadySubmitted ? (
              <span>Already Submitted Today</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit 1-Time Entry ({summary.filledItemsCount} items)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      <ConfirmationModal
        isOpen={isClearModalOpen}
        title="Clear All Fields?"
        message="Are you sure you want to reset all product numbers back to blank?"
        confirmText="Clear All"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => {
          onClearAllValues();
          setIsClearModalOpen(false);
        }}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
}
