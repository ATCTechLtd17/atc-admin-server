import { Types } from 'mongoose';

export type TIncome = {
  id: string;
  date: string;
  incomeType: 'Invoice' | 'MR';
  division?: string;
  organization?: string;
  description?: string;
  subCategory?: Types.ObjectId;
  contact: string;
  email: string;
  address: string;
  services?: [
    {
      serviceName: string;
      // unit: string;
      price: number;
    },
  ];

  tax?: number;
  vat?: number;
  discount?: number;
  depositAmount: number;
  subTotal: number;
  grossTotal: number;
  payableAmount: number;
  dueAmount: number;
  paymentStatus: 'Partial Paid' | 'Fully Paid';
};
