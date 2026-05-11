import React from 'react';
import { Invoice, InvoiceItem } from '../types/invoice';
import { Input, Textarea, Button } from './UI';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '../utils/calculations';

interface InvoiceFormProps {
  data: Invoice;
  onChange: (updater: (prev: Invoice) => Invoice) => void;
  onPreview: () => void;
  onReset: () => void;
}

export function InvoiceForm({ data, onChange, onPreview, onReset }: InvoiceFormProps) {
  const updateField = (field: keyof Invoice, value: any) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    onChange((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const addItem = () => {
    onChange((prev) => ({
      ...prev,
      items: [...prev.items, { id: generateId(), description: '', quantity: 1, unitPrice: 0 }],
    }));
  };

  const removeItem = (id: string) => {
    onChange((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="space-y-8 bg-white p-6 md:p-10 rounded-xl shadow-sm border border-slate-100 no-print">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">Business Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Business Name *"
            value={data.businessName}
            onChange={(e) => updateField('businessName', e.target.value)}
            placeholder="Your Company"
          />
          <Input
            label="Contact Info"
            value={data.businessContact}
            onChange={(e) => updateField('businessContact', e.target.value)}
            placeholder="Email or Phone"
          />
        </div>
        <Textarea
          label="Address"
          value={data.businessAddress}
          onChange={(e) => updateField('businessAddress', e.target.value)}
          placeholder="123 Street St, City, Country"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">Client Information</h2>
        <Input
          label="Client Name *"
          value={data.clientName}
          onChange={(e) => updateField('clientName', e.target.value)}
          placeholder="Recipient Name"
        />
        <Textarea
          label="Client Address"
          value={data.clientAddress}
          onChange={(e) => updateField('clientAddress', e.target.value)}
          placeholder="Recipient Address"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Invoice #"
            value={data.invoiceNumber}
            onChange={(e) => updateField('invoiceNumber', e.target.value)}
          />
          <Input
            label="Date"
            type="date"
            value={data.invoiceDate}
            onChange={(e) => updateField('invoiceDate', e.target.value)}
          />
          <Input
            label="Due Date"
            type="date"
            value={data.dueDate}
            onChange={(e) => updateField('dueDate', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 flex-1">
            <label className="text-sm font-medium text-slate-700">Currency</label>
            <select
              value={data.currency}
              onChange={(e) => updateField('currency', e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
          <Input
            label="Tax Rate (%)"
            type="number"
            value={data.taxRate}
            onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Discount (value or %)"
            value={data.discountValue}
            onChange={(e) => updateField('discountValue', e.target.value)}
            placeholder="e.g. 10 or 5%"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold text-slate-900">Items / Services</h2>
          <Button variant="secondary" onClick={addItem} className="h-8 pr-3 pl-2">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-3 items-end animate-in fade-in slide-in-from-top-1">
              <div className="col-span-12 md:col-span-6">
                <Input
                  label={index === 0 ? "Description" : undefined}
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Service description"
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Input
                  label={index === 0 ? "Qty" : undefined}
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-5 md:col-span-3">
                <Input
                  label={index === 0 ? "Price" : undefined}
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-3 md:col-span-1 flex justify-end pb-1.5">
                <Button
                  variant="ghost"
                  onClick={() => removeItem(item.id)}
                  disabled={data.items.length === 1}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 h-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t">
        <Textarea
          label="Notes / Payment Terms"
          value={data.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Thank you for your business!"
        />
      </section>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t font-semibold">
        <Button onClick={onPreview} className="flex-1 h-12 text-base">
          Preview Invoice
        </Button>
        <Button variant="secondary" onClick={onReset} className="h-12 text-base px-8">
          Reset Form
        </Button>
      </div>
    </div>
  );
}
