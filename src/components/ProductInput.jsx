import React from 'react';
import { Lock, X } from 'lucide-react';

export default function ProductInput({
  product,
  value,
  onChange,
  disabled
}) {
  const handleChange = (e) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      onChange(product.name, '');
      return;
    }
    const num = parseFloat(rawVal);
    if (!isNaN(num) && num >= 0) {
      onChange(product.name, rawVal);
    }
  };

  const isFilled = value !== '' && value !== null && value !== undefined && parseFloat(value) > 0;

  return (
    <div className={`p-3 rounded-xl border transition-all ${
      disabled 
        ? 'bg-slate-50 border-slate-200 opacity-60' 
        : isFilled
        ? 'bg-blue-50/50 border-blue-400 shadow-xs ring-1 ring-blue-100'
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`}>
      {/* Product Title and Unit */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-4 h-4 rounded bg-slate-100 text-slate-500 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0">
            {product.order}
          </span>
          <span className="text-xs font-bold text-slate-800 truncate">
            {product.name}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
          {product.badge}
        </span>
      </div>

      {/* Numeric Input */}
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          disabled={disabled}
          value={value}
          onChange={handleChange}
          placeholder="0"
          className={`w-full h-11 px-3 text-base font-mono font-bold rounded-lg border text-slate-900 transition-all ${
            disabled
              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed placeholder:text-slate-300'
              : 'bg-white border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none'
          }`}
        />

        {disabled && (
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-3.5 h-3.5 opacity-50" />
          </div>
        )}

        {!disabled && isFilled && (
          <button
            type="button"
            onClick={() => onChange(product.name, '')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
