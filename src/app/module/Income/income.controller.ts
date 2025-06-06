import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { IncomeServices } from './income.services';
import httpStatus from 'http-status';

const createIncome = CatchAsync(async (req, res) => {
  const result = await IncomeServices.addIncome(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Income created successfully',
    data: result,
  });
});

const getAllIncome = CatchAsync(async (req, res) => {
  const result = await IncomeServices.getAllIncome(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Incomes fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleIncome = CatchAsync(async (req, res) => {
  const result = await IncomeServices.getSingleIncome(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Income fetched successfully',
    data: result,
  });
});

const getIncomeByCustomId = CatchAsync(async (req, res) => {
  const result = await IncomeServices.getIncomeByCustomId(req.params.customId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Income fetched successfully',
    data: result,
  });
});

// const downloadIncomePdf = CatchAsync(async (req, res) => {
//   const result = await IncomeServices.generateIncomePdf(req.params.id);

//   // Set headers for PDF download
//   res.setHeader('Content-Type', 'application/pdf');
//   res.setHeader(
//     'Content-Disposition',
//     `attachment; filename=ATC_Money_Receipt_${req.params.id}.pdf`,
//   );

//   // Send the PDF buffer
//   res.send(result);
// });

const updateIncome = CatchAsync(async (req, res) => {
  const result = await IncomeServices.updateIncome(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Income updated successfully',
    data: result,
  });
});

const deleteIncome = CatchAsync(async (req, res) => {
  const result = await IncomeServices.deleteIncome(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Income deleted successfully',
    data: result,
  });
});

export const IncomeController = {
  createIncome,
  getAllIncome,
  getIncomeByCustomId,
  getSingleIncome,
  updateIncome,
  deleteIncome,
  // downloadIncomePdf,
};
