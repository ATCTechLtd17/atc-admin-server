export type TFinancialReport = {
  // Overall totals
  totalIncome: number;
  totalExpense: number;
  profit: number;

  // Current month totals
  currentMonthTotalIncome: number;
  currentMonthTotalExpense: number;
  currentMonthProfit: number;

  // Current month payment status breakdown
  currentMonthPaidIncome: number;
  currentMonthUnpaidIncome: number;
  currentMonthPaidExpense: number;
  currentMonthUnpaidExpense: number;

  // Averages
  averageIncome: number;
  averageExpense: number;
  averageProfit: number;

  // Payment status breakdowns
  totalPaidIncome: number;
  totalUnpaidIncome: number;
  totalPaidExpense: number;
  totalUnpaidExpense: number;

  // Date range
  startDate?: string;
  endDate?: string;
};

export type TDateRange = {
  fromDate?: string;
  toDate?: string;
};

export type TExpenseByCategory = {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  percentage: number;
};

export type TExpensesByCategoryReport = {
  expensesByCategory: TExpenseByCategory[];
  totalExpenses: number;
};
