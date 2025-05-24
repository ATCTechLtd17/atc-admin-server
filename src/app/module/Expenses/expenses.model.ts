import { Schema, model } from 'mongoose';
import { TExpenses } from './expenses.interface';

const expenseSchema = new Schema<TExpenses>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
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
  unitPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  vat: {
    type: Number,
    required: true,
  },
  tds: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Partial Paid', 'Fully Paid'],
    required: true,
  },
});

const Expense = model<TExpenses>('Expense', expenseSchema);

export default Expense;
