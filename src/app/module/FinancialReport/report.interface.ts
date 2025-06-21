export type TFinancialReport = {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  currentMonthIncome: number;
  currentMonthExpense: number;
  averageIncome: number;
  averageExpense: number;
  totalPaidIncome: number;
  totalUnpaidIncome: number;
  totalPaidExpense: number;
  totalUnpaidExpense: number;
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
