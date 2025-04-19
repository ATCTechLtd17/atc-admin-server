import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

import httpStatus from 'http-status';
import { ExpenseServices } from './expenses.services';

const createExpense = CatchAsync(async (req, res) => {
  const result = await ExpenseServices.addExpense(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense created successfully',
    data: result,
  });
});

const getAllExpenses = CatchAsync(async (req, res) => {
  const result = await ExpenseServices.getAllExpenses(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expenses fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleExpense = CatchAsync(async (req, res) => {
  const result = await ExpenseServices.getSingleExpense(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense fetched successfully',
    data: result,
  });
});

const updateExpense = CatchAsync(async (req, res) => {
  const result = await ExpenseServices.updateExpense(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense updated successfully',
    data: result,
  });
});

const deleteExpense = CatchAsync(async (req, res) => {
  const result = await ExpenseServices.deleteExpense(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense deleted successfully',
    data: result,
  });
});

export const ExpenseController = {
  createExpense,
  getAllExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
};
