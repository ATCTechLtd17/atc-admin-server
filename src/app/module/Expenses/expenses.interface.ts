import { Types } from 'mongoose';

export type TExpenses = {
  description: string;
  date: string;
  account: string;
  subCategory: Types.ObjectId;
  unitPrice: number;
  quantity: number;
  tax: number;
  vat: number;
  tds: number;
  totalAmount: number;
  paidAmount: number;
};
