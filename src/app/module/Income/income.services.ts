import QueryBuilder from '../../Builder/QueryBuilder';
import AppError from '../../Error/AppError';
import { TIncome } from './income.interface';
import { Income } from './income.model';
import httpStatus from 'http-status';

const addIncome = async (payload: TIncome) => {
  const newIncome = await Income.create(payload);
  return newIncome;
};

const getAllIncome = async (query: Record<string, unknown>) => {
  const incomesQuery = new QueryBuilder(
    Income.find().populate({
      path: 'subCategory',
      populate: {
        path: 'category',
        populate: 'department',
      },
    }),
    query,
  )
    .search(['name'])
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
