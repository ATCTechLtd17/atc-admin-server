import { Schema, model } from 'mongoose';
import { TIncome } from './income.interface';

const incomeSchema = new Schema<TIncome>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
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
        // unit: {
        //   type: String,
        //   required: true,
        // },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    tax: {
      type: Number,
      required: true,
    },
    vat: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
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
    paymentStatus: {
      type: String,
      enum: ['Partial Paid', 'Fully Paid'],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Income = model<TIncome>('Income', incomeSchema);
