import CatchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { DepartmentServices } from './department.services';
import httpStatus from 'http-status';

const createDepartment = CatchAsync(async (req, res) => {
  const result = DepartmentServices.createDepartment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department created successfully',
    data: result,
  });
});

const getAllDepartment = CatchAsync(async (req, res) => {
  const result = await DepartmentServices.getAllDepartment(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Departments retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getSingleDepartment = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DepartmentServices.getSingleDepartment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department retrieved successfully',
    data: result,
  });
});

const updateDepartment = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DepartmentServices.updateDepartment(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department updated successfully',
    data: result,
  });
});

const deleteDepartment = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DepartmentServices.deleteDepartment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department deleted successfully',
    data: result,
  });
});

export const DepartmentController = {
  createDepartment,
  getAllDepartment,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
};
