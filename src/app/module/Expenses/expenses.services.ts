/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../Builder/QueryBuilder';
import AppError from '../../Error/AppError';
import { TExpenses } from './expenses.interface';
import Expense from './expenses.model';
import httpStatus from 'http-status';

import { v4 as uuidv4 } from 'uuid';
const generateEXIdFromUUID = () => {
  const uuid = uuidv4();
  const digits = uuid.replace(/\D/g, '').slice(0, 4);
  return `EX-${digits}`;
};

const addExpense = async (payload: TExpenses) => {
  const id = generateEXIdFromUUID();
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

const updateExpense = async (id: string, payload: Partial<TExpenses>) => {
  const updatedExpense = await Expense.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updatedExpense) {
    throw new AppError(httpStatus.NOT_FOUND, 'Expense not found');
  }
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
