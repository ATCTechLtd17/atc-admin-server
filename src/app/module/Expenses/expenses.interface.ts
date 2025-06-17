import { Types } from 'mongoose';

export type TExpenses = {
  id: string;
  products: [
    {
      productName: string;
      description?: string;
      unitPrice: number;
      quantity: number;
    },
  ];
  date: string;
  account: string;
  subCategory: Types.ObjectId;
  tax?: number;
  vat?: number;
  tds?: number;
  subTotal: number;
  grossTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: 'Partial Paid' | 'Fully Paid' | 'Unpaid';
};
