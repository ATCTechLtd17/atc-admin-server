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
    currentMonthTotalIncome,
    currentMonthTotalExpense,
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
    // Current month specific queries (renamed with cm prefix)
    cmFullyPaidIncome,
    cmPartialPaidIncome,
    cmUnpaidIncome,
    cmPartialPaidIncomeDue,
    cmFullyPaidExpense,
    cmPartialPaidExpense,
    cmUnpaidExpense,
    cmPartialPaidExpenseDue,
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

    // Current month total income (payableAmount)
    Income.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: '$payableAmount' } } },
    ]),

    // Current month total expense (grossTotal)
    Expense.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: '$grossTotal' } } },
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

    // Current month Fully Paid income
    Income.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
          paymentStatus: 'Fully Paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$depositAmount' } } },
    ]),

    // Current month Partial Paid income
    Income.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
          paymentStatus: 'Partial Paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$depositAmount' } } },
    ]),

    // Current month Unpaid income
    Income.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
          paymentStatus: 'Unpaid',
        },
      },
      { $group: { _id: null, total: { $sum: '$payableAmount' } } },
    ]),

    // Current month Partial Paid income due amounts
    Income.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
          paymentStatus: 'Partial Paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$dueAmount' } } },
    ]),

    // Current month Fully Paid expense
    Expense.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
          paymentStatus: 'Fully Paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]),

    // Current month Partial Paid expense
    Expense.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
          paymentStatus: 'Partial Paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]),

    // Current month Unpaid expense
    Expense.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
          paymentStatus: 'Unpaid',
        },
      },
      { $group: { _id: null, total: { $sum: '$grossTotal' } } },
    ]),

    // Current month Partial Paid expense due amounts
    Expense.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
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

  const currentMonthTotalIncomeSum = currentMonthTotalIncome[0]?.total || 0;
  const currentMonthTotalExpenseSum = currentMonthTotalExpense[0]?.total || 0;
  const currentMonthProfit =
    currentMonthTotalIncomeSum - currentMonthTotalExpenseSum;

  const lastYearIncomeSum = lastYearIncome[0]?.total || 0;
  const lastYearExpenseSum = lastYearExpense[0]?.total || 0;
  const lastYearProfit = lastYearIncomeSum - lastYearExpenseSum;

  // Payment status breakdowns
  const fullyPaidIncome = fullyPaidIncomeResult[0]?.total || 0;
  const partialPaidIncome = partialPaidIncomeResult[0]?.total || 0;
  const unpaidIncome = unpaidIncomeResult[0]?.total || 0;
  const partialPaidIncomeDue = partialPaidIncomeDueResult[0]?.total || 0;

  const fullyPaidExpense = fullyPaidExpenseResult[0]?.total || 0;
  const partialPaidExpense = partialPaidExpenseResult[0]?.total || 0;
  const unpaidExpense = unpaidExpenseResult[0]?.total || 0;
  const partialPaidExpenseDue = partialPaidExpenseDueResult[0]?.total || 0;

  // Current month payment status breakdowns
  const currentMonthFullyPaidIncome = cmFullyPaidIncome[0]?.total || 0;
  const currentMonthPartialPaidIncome = cmPartialPaidIncome[0]?.total || 0;
  const currentMonthUnpaidIncome = cmUnpaidIncome[0]?.total || 0;
  const currentMonthPartialPaidIncomeDue =
    cmPartialPaidIncomeDue[0]?.total || 0;

  const currentMonthFullyPaidExpense = cmFullyPaidExpense[0]?.total || 0;
  const currentMonthPartialPaidExpense = cmPartialPaidExpense[0]?.total || 0;
  const currentMonthUnpaidExpense = cmUnpaidExpense[0]?.total || 0;
  const currentMonthPartialPaidExpenseDue =
    cmPartialPaidExpenseDue[0]?.total || 0;

  // Calculate totals according to requirements
  const totalPaidIncome = fullyPaidIncome + partialPaidIncome;
  const totalUnpaidIncome = unpaidIncome + partialPaidIncomeDue;

  const totalPaidExpense = fullyPaidExpense + partialPaidExpense;
  const totalUnpaidExpense = unpaidExpense + partialPaidExpenseDue;

  // Calculate current month totals
  const currentMonthPaidIncome =
    currentMonthFullyPaidIncome + currentMonthPartialPaidIncome;
  const currentMonthUnpaidIncomeTotal =
    currentMonthUnpaidIncome + currentMonthPartialPaidIncomeDue;

  const currentMonthPaidExpense =
    currentMonthFullyPaidExpense + currentMonthPartialPaidExpense;
  const currentMonthUnpaidExpenseTotal =
    currentMonthUnpaidExpense + currentMonthPartialPaidExpenseDue;

  // Calculate averages (monthly over last 12 months)
  const averageIncome = lastYearIncomeSum / 12;
  const averageExpense = lastYearExpenseSum / 12;
  const averageProfit = lastYearProfit / 12;

  const report: TFinancialReport = {
    totalIncome,
    totalExpense,
    profit,
    currentMonthTotalIncome: currentMonthTotalIncomeSum,
    currentMonthTotalExpense: currentMonthTotalExpenseSum,
    currentMonthProfit,
    currentMonthPaidIncome,
    currentMonthUnpaidIncome: currentMonthUnpaidIncomeTotal,
    currentMonthPaidExpense,
    currentMonthUnpaidExpense: currentMonthUnpaidExpenseTotal,
    averageIncome,
    averageExpense,
    averageProfit,
    totalPaidIncome,
    totalUnpaidIncome,
    totalPaidExpense,
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
