import { Schema, model } from 'mongoose';
import { TIncome } from './income.interface';

const incomeSchema = new Schema<TIncome>(
  {
    date: {
      type: String,
      required: true,
    },
    incomeType: {
      type: String,
      enum: ['Invoice', 'MR'],
      required: true,
    },
    division: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
    },
    description: {
      type: String,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    services: [
      {
        serviceName: {
          type: String,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    depositAmount: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    grossTotal: {
      type: Number,
      required: true,
    },
    payableAmount: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Income = model<TIncome>('Income', incomeSchema);
