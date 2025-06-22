/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../Builder/QueryBuilder';
import AppError from '../../Error/AppError';
import { generateCode } from '../../utils/codeGeneratorUtility';
import { TExpenses } from './expenses.interface';
import Expense from './expenses.model';
import httpStatus from 'http-status';

const addExpense = async (payload: TExpenses) => {
  const id = await generateCode(Expense, 'EX', 'id');
  const newExpense = await Expense.create({ ...payload, id });
  return newExpense;
};

const getAllExpenses = async (query: Record<string, unknown>) => {
  const {
    department,
    category,
    fromDate,
    toDate,
    paymentStatus,
    ...restQuery
  } = query;

  const filter: Record<string, unknown> = {};

  // Filter by date range
  if (fromDate || toDate) {
    (filter.date as any) = {};
    if (fromDate) {
      (filter.date as any).$gte = fromDate;
    }
    if (toDate) {
      (filter.date as any).$lte = toDate;
    }
  }

  // Filter by paymentStatus
  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  const expensesQuery = new QueryBuilder(
    Expense.find(filter).populate({
      path: 'subCategory',
      populate: {
        path: 'category',
        populate: 'department',
      },
    }),
    restQuery,
  )
    .search(['description', 'account', 'id'])
    .filter()
    .sort()
    .paginate()
    .fields();

  let expenses = await expensesQuery.modelQuery;

  // Filter by department
  if (department) {
    expenses = expenses.filter(
      (expense: any) =>
        expense.subCategory?.category?.department?._id?.toString() ===
        department,
    );
  }

  // Filter by category
  if (category) {
    expenses = expenses.filter(
      (expense: any) =>
        expense.subCategory?.category?._id?.toString() === category,
    );
  }

  const meta = await expensesQuery.countTotal();

  return {
    result: expenses,
    meta,
  };
};

const getSingleExpense = async (id: string) => {
  const expense = await Expense.findById(id).populate({
    path: 'subCategory',
    populate: {
      path: 'category',
      populate: 'department',
    },
  });
  if (!expense) {
    throw new AppError(httpStatus.NOT_FOUND, 'Expense not found');
  }
  return expense;
};

// expense.service.ts
const updateExpense = async (id: string, payload: Partial<TExpenses>) => {
  const existingExpense = await Expense.findById(id);
  if (!existingExpense) {
    throw new AppError(httpStatus.NOT_FOUND, 'Expense not found');
  }

  // Calculate new due amount
  const newPaidAmount = payload.paidAmount || existingExpense.paidAmount;
  // const newDueAmount = existingExpense.grossTotal - newPaidAmount;

  if (newPaidAmount > existingExpense.grossTotal) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Paid amount cannot be greater than gross total',
    );
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    id,
    {
      ...payload,
      paidAmount: newPaidAmount,
      // paymentStatus: payload.dueAmount! <= 0 ? 'Fully Paid' : 'Partial Paid',
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedExpense;
};

const deleteExpense = async (id: string) => {
  const deleted = await Expense.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Expense not found');
  }
  return deleted;
};

export const ExpenseServices = {
  addExpense,
  getAllExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
};
