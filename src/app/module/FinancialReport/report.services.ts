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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Current month date range (format as YYYY-MM-DD strings)
  const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const currentMonthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');

  // Last 12 months for averages
  const twelveMonthsAgo = format(subMonths(new Date(), 12), 'yyyy-MM-dd');
  const now = format(new Date(), 'yyyy-MM-dd');

  // Fetch all data in parallel
  const [
    totalIncome,
    totalExpense,
    currentMonthIncome,
    currentMonthExpense,
    lastYearIncome,
    lastYearExpense,
  ] = await Promise.all([
    // Total income with date filter
    Income.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$payableAmount' } } },
    ]),

    // Total expense with date filter
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
  ]);

  // Calculate values
  const incomeSum = totalIncome[0]?.total || 0;
  const expenseSum = totalExpense[0]?.total || 0;
  const profit = incomeSum - expenseSum;

  const currentMonthIncomeSum = currentMonthIncome[0]?.total || 0;
  const currentMonthExpenseSum = currentMonthExpense[0]?.total || 0;

  const lastYearIncomeSum = lastYearIncome[0]?.total || 0;
  const lastYearExpenseSum = lastYearExpense[0]?.total || 0;

  // Calculate averages (monthly over last 12 months)
  const averageIncome = lastYearIncomeSum / 12;
  const averageExpense = lastYearExpenseSum / 12;

  const report: TFinancialReport = {
    totalIncome: incomeSum,
    totalExpense: expenseSum,
    profit,
    currentMonthIncome: currentMonthIncomeSum,
    currentMonthExpense: currentMonthExpenseSum,
    averageIncome,
    averageExpense,
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
