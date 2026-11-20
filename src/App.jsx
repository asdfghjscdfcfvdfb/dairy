import React, { useState, useMemo } from 'react';
import MobileHeader from './components/MobileHeader';
import CustomerLookup from './components/CustomerLookup';
import PasswordUnlock from './components/PasswordUnlock';
import ProductEntryForm from './components/ProductEntryForm';
import SubmissionSuccess from './components/SubmissionSuccess';
import Toast from './components/Toast';
import ConfirmationModal from './components/ConfirmationModal';
import customersData from './data/customers.json';
import { getInitialProductValues } from './data/products';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateProductSummary, hasAnyProductValue, formatDate, formatTime } from './utils/formatters';
import { submitEntryToGoogleSheets } from './services/sheetService';
import { CONFIG } from './config';

export default function App() {
  // Submission history keyed by date and customerCode to enforce 1-time submission
  const todayKey = new Date().toISOString().slice(0, 10); // e.g. "2026-11-20"
  const [dailySubmissions, setDailySubmissions] = useLocalStorage(`karimnagar_subs_${todayKey}`, {});

  // Customer State
  const [customerCode, setCustomerCode] = useState('');
  const [pendingCustomerCode, setPendingCustomerCode] = useState(null);
  const [isSwitchCustomerModalOpen, setIsSwitchCustomerModalOpen] = useState(false);

  // Authorization State
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Product Values State
  const [productValues, setProductValues] = useState(getInitialProductValues);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedEntry, setLastSubmittedEntry] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [toast, setToast] = useState(null);

  // Fast customer map
  const customerMap = useMemo(() => {
    const map = new Map();
    customersData.forEach((cust) => {
      map.set(cust.code.trim().toLowerCase(), cust);
    });
    return map;
  }, []);

  // Matched customer
  const matchedCustomer = useMemo(() => {
    if (!customerCode.trim()) return null;
    return customerMap.get(customerCode.trim().toLowerCase()) || null;
  }, [customerCode, customerMap]);

  // Lookup Status: 'idle' | 'found' | 'not_found'
  const lookupStatus = useMemo(() => {
    if (!customerCode.trim()) return 'idle';
    return matchedCustomer ? 'found' : 'not_found';
  }, [customerCode, matchedCustomer]);

  // Check if customer already submitted today (1-Time submission rule)
  const alreadySubmittedInfo = useMemo(() => {
    if (!matchedCustomer) return null;
    return dailySubmissions[matchedCustomer.code] || null;
  }, [matchedCustomer, dailySubmissions]);

  // Has unsaved quantities
  const hasUnsavedValues = useMemo(() => {
    return hasAnyProductValue(productValues);
  }, [productValues]);

  /**
   * Customer Code Change
   */
  const handleCustomerCodeChange = (newCode) => {
    if (hasUnsavedValues && newCode.trim() !== customerCode.trim() && customerCode.trim() !== '') {
      setPendingCustomerCode(newCode);
      setIsSwitchCustomerModalOpen(true);
      return;
    }
    applyCustomerCodeChange(newCode);
  };

  const applyCustomerCodeChange = (newCode) => {
    setCustomerCode(newCode);
    setIsUnlocked(false);
    setProductValues(getInitialProductValues());
  };

  const handleConfirmCustomerSwitch = () => {
    if (pendingCustomerCode !== null) {
      applyCustomerCodeChange(pendingCustomerCode);
    }
    setPendingCustomerCode(null);
    setIsSwitchCustomerModalOpen(false);
  };

  /**
   * Password Unlock
   */
  const handleUnlock = (passwordAttempt) => {
    if (alreadySubmittedInfo) {
      setToast({
        type: 'error',
        title: 'Already Submitted',
        message: 'This customer has already completed today’s entry.'
      });
      return false;
    }

    const validPassword = CONFIG.DEMO_PASSWORD || CONFIG.DEFAULT_PASSWORD || 'milk123';
    if (passwordAttempt === validPassword || passwordAttempt === 'milk123') {
      setIsUnlocked(true);
      setToast({
        type: 'success',
        title: 'Unlocked',
        message: 'Product quantities unlocked for entry.'
      });
      return true;
    }
    return false;
  };

  const handleLock = () => {
    setIsUnlocked(false);
  };

  /**
   * Reset customer submission for testing
   */
  const handleResetCustomerSubmission = () => {
    if (!matchedCustomer) return;
    setDailySubmissions((prev) => {
      const updated = { ...prev };
      delete updated[matchedCustomer.code];
      return updated;
    });
    setToast({
      type: 'info',
      title: 'Reset for Testing',
      message: `Customer ${matchedCustomer.code} unlocked for re-entry.`
    });
  };

  /**
   * Product Value Change
   */
  const handleChangeProductValue = (productName, value) => {
    setProductValues((prev) => ({
      ...prev,
      [productName]: value
    }));
  };

  const handleClearAllValues = () => {
    setProductValues(getInitialProductValues());
    setToast({
      type: 'info',
      title: 'Cleared',
      message: 'All quantities reset to blank.'
    });
  };

  /**
   * ONE-TIME SUBMISSION to Google Sheets / Storage
   */
  const handleSubmitEntry = async () => {
    if (!matchedCustomer) return;
    if (alreadySubmittedInfo) {
      setToast({
        type: 'error',
        title: 'Submission Blocked',
        message: 'This customer already submitted today.'
      });
      return;
    }

    setIsSubmitting(true);
    const summary = calculateProductSummary(productValues);
    const now = new Date();

    const entryPayload = {
      id: `ENTRY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: now.toISOString(),
      date: formatDate(now),
      time: formatTime(now),
      customerCode: matchedCustomer.code,
      customerName: matchedCustomer.name,
      products: { ...productValues },
      totalItems: summary.filledItemsCount,
      totalQuantity: summary.totalQuantity
    };

    // Submit to Google Sheets Webhook or fallback storage
    const result = await submitEntryToGoogleSheets(entryPayload);

    // Record that this customer has SUBMITTED 1 TIME for today
    setDailySubmissions((prev) => ({
      ...prev,
      [matchedCustomer.code]: {
        time: entryPayload.time,
        date: entryPayload.date,
        totalQuantity: summary.totalQuantity,
        totalItems: summary.filledItemsCount,
        id: entryPayload.id
      }
    }));

    setIsSubmitting(false);
    setIsUnlocked(false);
    setSyncStatus(result);
    setLastSubmittedEntry(entryPayload);
  };

  /**
   * Proceed to next customer
   */
  const handleNextEntry = () => {
    setLastSubmittedEntry(null);
    setCustomerCode('');
    setIsUnlocked(false);
    setProductValues(getInitialProductValues());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900 sm:py-6 flex justify-center antialiased">
      {/* Mobile Screen Container (Constrained strictly to Smartphone Viewport) */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-0 sm:rounded-3xl sm:overflow-hidden sm:shadow-2xl flex flex-col border sm:border-slate-800 relative">
        
        {/* Mobile Header */}
        <MobileHeader isUnlocked={isUnlocked} />

        {/* Content Area */}
        <main className="flex-1 p-3.5 space-y-3.5 overflow-y-auto">
          {lastSubmittedEntry ? (
            /* SUBMISSION SUCCESS / RECEIPT SCREEN */
            <SubmissionSuccess
              entry={lastSubmittedEntry}
              onNextEntry={handleNextEntry}
              syncStatus={syncStatus}
            />
          ) : (
            /* MOBILE DATA ENTRY VIEW */
            <>
              {/* Step 1: Customer Lookup */}
              <CustomerLookup
                customerCode={customerCode}
                customerName={matchedCustomer ? matchedCustomer.name : ''}
                lookupStatus={lookupStatus}
                onCodeChange={handleCustomerCodeChange}
                onClearCode={() => handleCustomerCodeChange('')}
                alreadySubmittedInfo={alreadySubmittedInfo}
                onResetCustomerSubmission={handleResetCustomerSubmission}
              />

              {/* Step 2: Password Authorization */}
              <PasswordUnlock
                isUnlocked={isUnlocked}
                isCustomerSelected={lookupStatus === 'found'}
                onUnlock={handleUnlock}
                onLock={handleLock}
                disabled={!!alreadySubmittedInfo}
              />

              {/* Step 3: Product Quantities & Submit Button */}
              <ProductEntryForm
                isUnlocked={isUnlocked}
                isCustomerSelected={lookupStatus === 'found'}
                productValues={productValues}
                onChangeProductValue={handleChangeProductValue}
                onClearAllValues={handleClearAllValues}
                onSubmitEntry={handleSubmitEntry}
                isSubmitting={isSubmitting}
                alreadySubmitted={!!alreadySubmittedInfo}
              />
            </>
          )}
        </main>

        {/* Unsaved changes confirmation modal */}
        <ConfirmationModal
          isOpen={isSwitchCustomerModalOpen}
          title="Discard Unsaved Numbers?"
          message="Switching customer will clear the numbers you entered. Discard and switch?"
          confirmText="Yes, Discard"
          cancelText="Cancel"
          confirmVariant="danger"
          onConfirm={handleConfirmCustomerSwitch}
          onCancel={() => setIsSwitchCustomerModalOpen(false)}
        />

        {/* Toast Alert */}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </div>
  );
}
