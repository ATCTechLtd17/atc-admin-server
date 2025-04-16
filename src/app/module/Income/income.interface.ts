import { Types } from 'mongoose';

export type TIncome = {
  date: string;
  incomeType: 'Invoice' | 'MR';
  division: string;
  organization?: string;
  description?: string;
  subCategory: Types.ObjectId;
  contact: string;
  email: string;
  address: string;
  services: [
    {
      serviceName: string;
      unit: string;
      price: number;
    },
  ];

  depositAmount: number;
  subTotal: number;
  grossTotal: number;
  payableAmount: number;
  dueAmount: number;
};
