/* eslint-disable @typescript-eslint/no-explicit-any */
import Expense from '../Expenses/expenses.model';
import { Income } from '../Income/income.model';
import {
  TFinancialReport,
  TDateRange,
  TExpensesByCategoryReport,
} from './report.interface';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

const getFinancialReport = async (
  query: TDateRange,
): Promise<TFinancialReport> => {
  const { fromDate, toDate } = query;

  // Date filters for the main query
  const dateFilter: any = {};
  if (fromDate || toDate) {
    dateFilter.date = {};
    if (fromDate) {
      dateFilter.date.$gte = fromDate;
    }
    if (toDate) {
      dateFilter.date.$lte = toDate;
    }
  }

  // Current month date range
  const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const currentMonthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');

  // Last 12 months for averages
  const twelveMonthsAgo = format(subMonths(new Date(), 12), 'yyyy-MM-dd');
  const now = format(new Date(), 'yyyy-MM-dd');

  // Fetch all data in parallel
  const [
    totalIncomeResult,
    totalExpenseResult,
    currentMonthIncome,
    currentMonthExpense,
    lastYearIncome,
    lastYearExpense,
    fullyPaidIncomeResult,
    partialPaidIncomeResult,
    unpaidIncomeResult,
    partialPaidIncomeDueResult,
    fullyPaidExpenseResult,
    partialPaidExpenseResult,
    unpaidExpenseResult,
    partialPaidExpenseDueResult,
  ] = await Promise.all([
    // Total income (sum of all payableAmount)
    Income.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$payableAmount' } } },
    ]),

    // Total expense (sum of all grossTotal)
    Expense.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$grossTotal' } } },
    ]),

    // Current month income
    Income.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: '$depositAmount' } } },
    ]),

    // Current month expense
    Expense.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]),

    // Last 12 months income for average calculation
    Income.aggregate([
      {
        $match: {
          date: { $gte: twelveMonthsAgo, $lte: now },
        },
      },
      { $group: { _id: null, total: { $sum: '$depositAmount' } } },
    ]),

    // Last 12 months expense for average calculation
    Expense.aggregate([
      {
        $match: {
          date: { $gte: twelveMonthsAgo, $lte: now },
        },
      },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]),

    // Fully Paid income (depositAmount)
    Income.aggregate([
      {
        $match: {
          ...dateFilter,
          paymentStatus: 'Fully Paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$depositAmount' } } },
    ]),

    // Partial Paid income (depositAmount)
    Income.aggregate([
      {
        $match: {
          ...dateFilter,
          paymentStatus: 'Partial Paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$depositAmount' } } },
    ]),

    // Unpaid income (payableAmount)
    Income.aggregate([
      {
        $match: {
          ...dateFilter,
          paymentStatus: 'Unpaid',
        },
      },
      { $group: { _id: null, total: { $sum: '$payableAmount' } } },
    ]),

    // Partial Paid income due amounts
    Income.aggregate([
      {
        $match: {
          ...dateFilter,
          paymentStatus: 'Partial Paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$dueAmount' } } },
    ]),

    // Fully Paid expense (paidAmount)
    Expense.aggregate([
      {
        $match: {
          ...dateFilter,
          paymentStatus: 'Fully Paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]),

    // Partial Paid expense (paidAmount)
    Expense.aggregate([
      {
        $match: {
          ...dateFilter,
          paymentStatus: 'Partial Paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]),

    // Unpaid expense (grossTotal)
    Expense.aggregate([
      {
        $match: {
          ...dateFilter,
          paymentStatus: 'Unpaid',
        },
      },
      { $group: { _id: null, total: { $sum: '$grossTotal' } } },
    ]),

    // Partial Paid expense due amounts
    Expense.aggregate([
      {
        $match: {
          ...dateFilter,
          paymentStatus: 'Partial Paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$dueAmount' } } },
    ]),
  ]);

  // Calculate values
  const totalIncome = totalIncomeResult[0]?.total || 0;
  const totalExpense = totalExpenseResult[0]?.total || 0;
  const profit = totalIncome - totalExpense;

  const currentMonthIncomeSum = currentMonthIncome[0]?.total || 0;
  const currentMonthExpenseSum = currentMonthExpense[0]?.total || 0;

  const lastYearIncomeSum = lastYearIncome[0]?.total || 0;
  const lastYearExpenseSum = lastYearExpense[0]?.total || 0;

  // Payment status breakdowns
  const fullyPaidIncome = fullyPaidIncomeResult[0]?.total || 0;
  const partialPaidIncome = partialPaidIncomeResult[0]?.total || 0;
  const unpaidIncome = unpaidIncomeResult[0]?.total || 0;
  const partialPaidIncomeDue = partialPaidIncomeDueResult[0]?.total || 0;

  const fullyPaidExpense = fullyPaidExpenseResult[0]?.total || 0;
  const partialPaidExpense = partialPaidExpenseResult[0]?.total || 0;
  const unpaidExpense = unpaidExpenseResult[0]?.total || 0;
  const partialPaidExpenseDue = partialPaidExpenseDueResult[0]?.total || 0;

  // Calculate totals according to requirements
  const totalPaidIncome = fullyPaidIncome + partialPaidIncome;
  const totalUnpaidIncome = unpaidIncome + partialPaidIncomeDue;

  const totalPaidExpense = fullyPaidExpense + partialPaidExpense;
  const totalUnpaidExpense = unpaidExpense + partialPaidExpenseDue;

  // Calculate averages (monthly over last 12 months)
  const averageIncome = lastYearIncomeSum / 12;
  const averageExpense = lastYearExpenseSum / 12;

  const report: TFinancialReport = {
    totalIncome,
    totalExpense,
    profit,
    currentMonthIncome: currentMonthIncomeSum,
    currentMonthExpense: currentMonthExpenseSum,
    averageIncome,
    averageExpense,
    totalPaidIncome,
    totalUnpaidIncome,
    totalPaidExpense: totalPaidExpense,
    totalUnpaidExpense,
    ...(fromDate && { startDate: fromDate }),
    ...(toDate && { endDate: toDate }),
  };

  return report;
};

const getExpensesByCategory = async (): Promise<TExpensesByCategoryReport> => {
  // Aggregate expenses by category
  const expensesByCategory = await Expense.aggregate([
    // Lookup to get subcategory details
    {
      $lookup: {
        from: 'subcategories',
        localField: 'subCategory',
        foreignField: '_id',
        as: 'subCategoryData',
      },
    },
    { $unwind: '$subCategoryData' },

    // Lookup to get category details
    {
      $lookup: {
        from: 'categories',
        localField: 'subCategoryData.category',
        foreignField: '_id',
        as: 'categoryData',
      },
    },
    { $unwind: '$categoryData' },

    // Group by category and calculate totals
    {
      $group: {
        _id: {
          categoryId: '$categoryData._id',
          categoryName: '$categoryData.name',
        },
        paidAmount: { $sum: '$paidAmount' },
      },
    },

    // Project to clean up the output
    {
      $project: {
        _id: 0,
        categoryId: '$_id.categoryId',
        categoryName: '$_id.categoryName',
        paidAmount: 1,
      },
    },

    // Sort by total amount (descending)
    { $sort: { paidAmount: -1 } },
  ]);

  // Calculate total expenses across all categories
  const totalExpenses = expensesByCategory.reduce(
    (sum, category) => sum + category.paidAmount,
    0,
  );

  // Add percentage to each category
  const result = expensesByCategory.map((category) => ({
    ...category,
    percentage: (category.paidAmount / totalExpenses) * 100,
  }));

  return {
    expensesByCategory: result,
    totalExpenses,
  };
};

export const ReportServices = {
  getFinancialReport,
  getExpensesByCategory,
};
