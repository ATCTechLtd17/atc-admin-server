import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ReportServices } from './report.services';
import httpStatus from 'http-status';

const getFinancialReport = CatchAsync(async (req, res) => {
  const result = await ReportServices.getFinancialReport(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Financial report generated successfully',
    data: result,
  });
});

const getExpensesByCategory = CatchAsync(async (req, res) => {
  const result = await ReportServices.getExpensesByCategory();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expenses by category report generated successfully',
    data: result,
  });
});

export const ReportController = {
  getFinancialReport,
  getExpensesByCategory,
};
