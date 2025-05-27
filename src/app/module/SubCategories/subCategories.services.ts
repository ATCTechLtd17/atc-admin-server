import httpStatus from 'http-status';
import { SubCategory } from './subCategories.model';
import { ISubCategories } from './subCategories.interface';
import AppError from '../../Error/AppError';
import QueryBuilder from '../../Builder/QueryBuilder';

const createSubCategory = async (payload: ISubCategories) => {
  const isExist = await SubCategory.findOne({ name: payload.name });
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Sub-category already exists');
  }
  const subCategory = await SubCategory.create(payload);
  return subCategory;
};

const getAllSubCategories = async (query: Record<string, unknown>) => {
  const subCategoryQuery = new QueryBuilder(
    SubCategory.find().populate({
      path: 'category',
      populate: {
        path: 'department',
      },
    }),
    query,
  )
    .sort()
    .paginate();

  const result = await subCategoryQuery.modelQuery;
  const meta = await subCategoryQuery.countTotal();

  return {
    result,
    meta,
  };
};

const getSingleSubCategory = async (id: string) => {
  const subCategory = await SubCategory.findById(id).populate('category');
  if (!subCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sub-category not found');
  }
  return subCategory;
};

const updateSubCategory = async (
  id: string,
  payload: Partial<ISubCategories>,
) => {
  const updated = await SubCategory.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sub-category not found');
  }
  return updated;
};

const deleteSubCategory = async (id: string) => {
  const deleted = await SubCategory.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sub-category not found');
  }
  return deleted;
};

export const SubCategoryServices = {
  createSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
