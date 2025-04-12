import httpStatus from 'http-status';
import CatchAsync from '../../utils/catchAsync';
import { CategoryServices } from './categories.services';
import { sendResponse } from '../../utils/sendResponse';

const createCategory = CatchAsync(async (req, res) => {
  const result = await CategoryServices.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is created successfully',
    data: result,
  });
});

const getAllCategories = CatchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategories(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleCategory = CatchAsync(async (req, res) => {
  const result = await CategoryServices.getSingleCategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category fetched successfully',
    data: result,
  });
});

const updateCategory = CatchAsync(async (req, res) => {
  const result = await CategoryServices.updateCategory(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteCategory = CatchAsync(async (req, res) => {
  const result = await CategoryServices.deleteCategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
