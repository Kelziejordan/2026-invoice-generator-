import { useState, useEffect, useCallback } from 'react';
import { Invoice, InvoiceSchema, RemoteData } from '../types/invoice';
import { generateId } from '../utils/calculations';

const STORAGE_KEY = 'invoice_pro_draft';

const DEFAULT_INVOICE: Invoice = {
  businessName: '',
  businessAddress: '',
  businessContact: '',
  clientName: '',
  clientAddress: '',
  invoiceNumber: `INV-${new Date().getFullYear()}-001`,
  invoiceDate: new Date().toISOString().split('T')[0],
  currency: 'USD',
  taxRate: 0,
  discountValue: '0',
  items: [{ id: generateId(), description: '', quantity: 1, unitPrice: 0 }],
};

export function useInvoiceState() {
  const [state, setState] = useState<RemoteData<Invoice>>({ status: 'idle' });

  // Load from local storage
  useEffect(() => {
    setState({ status: 'loading' });
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const validated = InvoiceSchema.parse(parsed);
        setState({ status: 'success', data: validated });
      } else {
        setState({ status: 'success', data: DEFAULT_INVOICE });
      }
    } catch (error) {
      console.error('Failed to load invoice draft', error);
      setState({ status: 'success', data: DEFAULT_INVOICE });
    }
  }, []);

  // Save to local storage
  const saveInvoice = useCallback((data: Invoice) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setState({ status: 'success', data });
    } catch (error) {
      console.error('Failed to save invoice draft', error);
    }
  }, []);

  const updateInvoice = useCallback((updater: (prev: Invoice) => Invoice) => {
    setState((curr) => {
      if (curr.status !== 'success') return curr;
      const next = updater(curr.data);
      // Auto-save
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return { ...curr, data: next };
    });
  }, []);

  const resetInvoice = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ status: 'success', data: DEFAULT_INVOICE });
  }, []);

  return {
    state,
    updateInvoice,
    resetInvoice,
  };
}
