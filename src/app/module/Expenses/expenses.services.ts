/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../Builder/QueryBuilder';
import AppError from '../../Error/AppError';
import { TExpenses } from './expenses.interface';
import Expense from './expenses.model';
import httpStatus from 'http-status';

const addExpense = async (payload: TExpenses) => {
  const newExpense = await Expense.create(payload);
  return newExpense;
};

const getAllExpenses = async (query: Record<string, unknown>) => {
  const { department, category, fromDate, toDate, ...restQuery } = query;

  const filter: Record<string, unknown> = {};

  // Apply date range filter
  (filter.date as any) = {};
  if (fromDate) {
    (filter.date as any).$gte = fromDate;
  }
  if (toDate) {
    (filter.date as any).$lte = toDate;
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
    .search(['description', 'account'])
    .sort()
    .paginate()
    .fields();

  // After query is built
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
