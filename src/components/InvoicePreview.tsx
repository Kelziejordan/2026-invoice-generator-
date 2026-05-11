import React from 'react';
import { Invoice } from '../types/invoice';
import { calculateInvoiceTotals, formatCurrency } from '../utils/calculations';
import { Button } from './UI';
import { ArrowLeft, Printer } from 'lucide-react';

interface InvoicePreviewProps {
  data: Invoice;
  onBack: () => void;
}

export function InvoicePreview({ data, onBack }: InvoicePreviewProps) {
  const totals = calculateInvoiceTotals(data);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center no-print bg-white p-4 rounded-lg shadow-sm border border-slate-100 sticky top-4 z-10">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Editor
        </Button>
        <Button onClick={handlePrint} className="bg-slate-900 text-white hover:bg-slate-800">
          <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
        </Button>
      </div>

      <div className="bg-white p-8 md:p-16 shadow-xl border border-slate-200 rounded-sm invoice-container print:shadow-none print:border-none print:p-0 min-h-[1056px]">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 mb-4">INVOICE</h1>
            <div className="text-slate-600">
              <p className="font-bold text-slate-900 uppercase tracking-wide text-sm">{data.businessName}</p>
              <div className="whitespace-pre-line text-sm mt-1">{data.businessAddress}</div>
              <p className="text-sm mt-1 font-medium">{data.businessContact}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">Invoice Number</p>
            <p className="text-xl font-bold text-slate-900">{data.invoiceNumber}</p>
            <div className="pt-4 space-y-1 text-sm">
              <p><span className="text-slate-500">Date:</span> {formatDate(data.invoiceDate)}</p>
              {data.dueDate && (
                <p><span className="text-slate-500">Due:</span> {formatDate(data.dueDate)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-12">
          <p className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-3">Bill To</p>
          <div className="text-slate-900">
            <p className="text-lg font-bold">{data.clientName}</p>
            <div className="whitespace-pre-line text-slate-600 mt-1">{data.clientAddress}</div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2 border-slate-900 text-left text-xs font-bold uppercase tracking-widest text-slate-500">
              <th className="py-3 px-2">Description</th>
              <th className="py-3 px-2 text-right w-20">Qty</th>
              <th className="py-3 px-2 text-right w-32">Price</th>
              <th className="py-3 px-2 text-right w-32">Total</th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            {data.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="py-4 px-2 align-top text-slate-900 font-medium">
                  {item.description}
                </td>
                <td className="py-4 px-2 align-top text-right tabular-nums">
                  {item.quantity}
                </td>
                <td className="py-4 px-2 align-top text-right tabular-nums">
                  {formatCurrency(item.unitPrice, data.currency)}
                </td>
                <td className="py-4 px-2 align-top text-right font-bold text-slate-900 tabular-nums">
                  {formatCurrency(item.quantity * item.unitPrice, data.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/3 space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="tabular-nums font-medium">{formatCurrency(totals.subtotal, data.currency)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                <span className="flex items-center text-xs font-bold uppercase tracking-tighter">Discount</span>
                <span className="tabular-nums font-bold">-{formatCurrency(totals.discount, data.currency)}</span>
              </div>
            )}
            {totals.tax > 0 && (
              <div className="flex justify-between text-slate-600">
                <span className="text-xs font-bold uppercase tracking-widest">Tax ({data.taxRate}%)</span>
                <span className="tabular-nums font-medium">{formatCurrency(totals.tax, data.currency)}</span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-slate-900 pt-3 text-lg font-black text-slate-900 uppercase tracking-tighter">
              <span>Total Due</span>
              <span className="tabular-nums">{formatCurrency(totals.total, data.currency)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="mt-16 pt-8 border-t border-slate-100">
            <p className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-2">Notes & Terms</p>
            <div className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
              {data.notes}
            </div>
          </div>
        )}

        <div className="mt-auto pt-16 text-center text-slate-400 text-xs italic no-print print:block">
          Thank you for your business.
        </div>
      </div>
    </div>
  );
}
