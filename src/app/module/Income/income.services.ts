/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../Builder/QueryBuilder';
import AppError from '../../Error/AppError';
import { generateCode } from '../../utils/codeGeneratorUtility';
import { TIncome } from './income.interface';
import { Income } from './income.model';
import httpStatus from 'http-status';

// const generateMRIdFromUUID = () => {
//   const uuid = uuidv4();
//   const digits = uuid.replace(/\D/g, '').slice(0, 4);
//   return `MR-${digits}`;
// };

const addIncome = async (payload: TIncome) => {
  const id = await generateCode(Income, 'MR', 'id');

  const newIncome = await Income.create({
    ...payload,
    id,
  });

  return newIncome;
};

const getAllIncome = async (query: Record<string, unknown>) => {
  const { fromDate, toDate, division, paymentStatus, ...restQuery } = query;

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

  // Filter by division
  if (division) {
    filter.division = division;
  }

  // Filter by paymentStatus
  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  const incomesQuery = new QueryBuilder(
    Income.find(filter).populate({
      path: 'subCategory',
      populate: {
        path: 'category',
        populate: 'department',
      },
    }),
    restQuery,
  )
    .search(['contact', 'email', 'id'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await incomesQuery.modelQuery;
  const meta = await incomesQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleIncome = async (id: string) => {
  const income = await Income.findById(id);
  if (!income) {
    throw new AppError(httpStatus.NOT_FOUND, 'Income not found');
  }
  return income;
};

const updateIncome = async (id: string, payload: Partial<TIncome>) => {
  const updatedIncome = await Income.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updatedIncome) {
    throw new AppError(httpStatus.NOT_FOUND, 'Income not found');
  }
  return updatedIncome;
};

const deleteIncome = async (id: string) => {
  const deleted = await Income.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Income not found');
  }
  return deleted;
};

export const IncomeServices = {
  addIncome,
  getAllIncome,
  getSingleIncome,
  updateIncome,
  deleteIncome,
};
