import httpStatus from 'http-status';
import CatchAsync from '../../utils/catchAsync';
import { SubCategoryServices } from './subCategories.services';
import { sendResponse } from '../../utils/sendResponse';

const createSubCategory = CatchAsync(async (req, res) => {
  const result = await SubCategoryServices.createSubCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub-category created successfully',
    data: result,
  });
});

const getAllSubCategories = CatchAsync(async (req, res) => {
  const result = await SubCategoryServices.getAllSubCategories(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub-categories fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleSubCategory = CatchAsync(async (req, res) => {
  const result = await SubCategoryServices.getSingleSubCategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub-category fetched successfully',
    data: result,
  });
});

const updateSubCategory = CatchAsync(async (req, res) => {
  const result = await SubCategoryServices.updateSubCategory(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub-category updated successfully',
    data: result,
  });
});

const deleteSubCategory = CatchAsync(async (req, res) => {
  const result = await SubCategoryServices.deleteSubCategory(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sub-category deleted successfully',
    data: result,
  });
});

export const SubCategoryController = {
  createSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
