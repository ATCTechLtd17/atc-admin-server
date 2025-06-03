import { Schema, model } from 'mongoose';
import { TExpenses } from './expenses.interface';

const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    description: { type: String },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }, // prevent creating separate _id for each product
);

const expenseSchema = new Schema<TExpenses>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    products: {
      type: [productSchema],
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
    tax: {
      type: Number,
    },
    vat: {
      type: Number,
    },
    tds: {
      type: Number,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    grossTotal: {
      type: Number,
      required: true,
    },
    paidAmount: {
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
    timestamps: true, // optional: adds createdAt and updatedAt
  },
);

const Expense = model<TExpenses>('Expense', expenseSchema);

export default Expense;
