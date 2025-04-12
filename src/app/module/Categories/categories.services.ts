import httpStatus from 'http-status';
import { ICategories } from './categories.interface';
import AppError from '../../Error/AppError';
import { Category } from './categories.model';
import QueryBuilder from '../../Builder/QueryBuilder';

const createCategory = async (payload: ICategories) => {
  const isCategoryExist = await Category.findOne({ name: payload.name });
  if (isCategoryExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category already exist');
  }
  const newCategory = await Category.create(payload);
  return newCategory;
};

const getAllCategories = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(
    Category.find().populate('department'),
    query,
  )
    .sort()
    .paginate();

  const result = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();

  return {
    result,
    meta,
  };
};

const getSingleCategory = async (id: string) => {
  const category = await Category.findById(id).populate('department');
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

const updateCategory = async (id: string, payload: Partial<ICategories>) => {
  const updatedCategory = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updatedCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return updatedCategory;
};

const deleteCategory = async (id: string) => {
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return deleted;
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
