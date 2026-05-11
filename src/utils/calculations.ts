import { Invoice, InvoiceItem } from '../types/invoice';

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function parseDiscount(discountStr: string, subtotal: number): number {
  const trimmed = discountStr.trim();
  if (trimmed.endsWith('%')) {
    const percent = parseFloat(trimmed) || 0;
    return subtotal * (percent / 100);
  }
  return parseFloat(trimmed) || 0;
}

export function calculateInvoiceTotals(invoice: Invoice) {
  const subtotal = calculateSubtotal(invoice.items);
  const discount = parseDiscount(invoice.discountValue, subtotal);
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * (invoice.taxRate / 100);
  const total = taxableAmount + tax;

  return {
    subtotal,
    discount,
    tax,
    total,
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
