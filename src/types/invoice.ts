import { z } from 'zod';

export const InvoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
});

export const InvoiceSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessAddress: z.string().optional(),
  businessContact: z.string().optional(),
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.string(),
  dueDate: z.string().optional(),
  currency: z.string().default('USD'),
  taxRate: z.number().min(0).max(100).default(0),
  discountValue: z.string().default('0'), // Supports % or absolute
  notes: z.string().optional(),
  items: z.array(InvoiceItemSchema).min(1, 'At least one item is required'),
});

export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;

export type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
