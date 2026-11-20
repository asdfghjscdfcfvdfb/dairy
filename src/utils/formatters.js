/**
 * Formatting helpers for currency, dates, quantities, and exports
 */

export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatTime = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDateTime = (dateInput) => {
  if (!dateInput) return '';
  return `${formatDate(dateInput)} at ${formatTime(dateInput)}`;
};

/**
 * Calculate totals from product values object
 */
export const calculateProductSummary = (productValues = {}) => {
  let filledItemsCount = 0;
  let totalQuantity = 0;

  Object.entries(productValues).forEach(([name, val]) => {
    if (val !== '' && val !== null && val !== undefined) {
      const num = parseFloat(val);
      if (!isNaN(num) && num > 0) {
        filledItemsCount += 1;
        totalQuantity += num;
      }
    }
  });

  return {
    filledItemsCount,
    totalQuantity: parseFloat(totalQuantity.toFixed(2))
  };
};

/**
 * Check if at least one product has a positive numeric value
 */
export const hasAnyProductValue = (productValues = {}) => {
  return Object.values(productValues).some(val => {
    if (val === '' || val === null || val === undefined) return false;
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  });
};

/**
 * Format CSV row
 */
export const exportEntriesToCSV = (entries = []) => {
  if (!entries.length) return;

  const headers = ['Entry ID', 'Timestamp', 'Customer Code', 'Customer Name', 'Total Items', 'Total Qty', 'Details'];
  const rows = entries.map(e => [
    `"${e.id}"`,
    `"${formatDateTime(e.timestamp)}"`,
    `"${e.customerCode}"`,
    `"${(e.customerName || '').replace(/"/g, '""')}"`,
    e.totalItems || 0,
    e.totalQuantity || 0,
    `"${Object.entries(e.products || {})
      .filter(([_, v]) => v !== '' && parseFloat(v) > 0)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `milk_distribution_entries_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
