/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useInvoiceState } from './hooks/useInvoiceState';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { ReceiptText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { state, updateInvoice, resetInvoice } = useInvoiceState();
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear this invoice draft?')) {
      resetInvoice();
      showToast('Form reset successfully');
    }
  };

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-indigo-600"
        >
          <ReceiptText className="w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4 text-center">
        <div className="max-w-md space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
          <p className="text-slate-600">{state.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-32 px-4 md:px-0">
      {/* Header - Hidden in Print */}
      <header className="py-8 md:py-12 text-center no-print max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-lg shadow-indigo-100">
          <Sparkles className="w-3 h-3" />
          <span>Professional Invoice Generator</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
          Invoice Pro
        </h1>
        <p className="text-slate-500 font-medium">Create and print professional invoices instantly</p>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'edit' ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InvoiceForm
                data={state.data}
                onChange={updateInvoice}
                onPreview={() => setView('preview')}
                onReset={handleReset}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <InvoicePreview data={state.data} onBack={() => setView('edit')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Install Prompt for PWA - Optional Info */}
      <div className="fixed bottom-6 right-6 no-print hidden lg:block">
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-slate-100 max-w-xs animate-in slide-in-from-right-10">
          <p className="text-sm font-bold text-slate-900 mb-1">💡 Pro Tip</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Install this app to your phone's home screen for quick offline access.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl no-print"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-sm font-bold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
