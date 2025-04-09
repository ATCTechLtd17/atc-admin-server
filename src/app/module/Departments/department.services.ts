import QueryBuilder from '../../Builder/QueryBuilder';
import AppError from '../../Error/AppError';
import { IDepartment } from './department.interface';
import { Department } from './department.model';
import httpStatus from 'http-status';

const createDepartment = async (payload: IDepartment) => {
  const isDepartmentExist = await Department.findOne({ name: payload.name });
  if (isDepartmentExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Department already exist');
  }
  const newDepartment = await Department.create(payload);
  return newDepartment;
};

const getAllDepartment = async (query: Record<string, unknown>) => {
  const departmentQuery = new QueryBuilder(Department.find(), query)
    .sort()
    .paginate();
  const result = await departmentQuery.modelQuery;
  const meta = await departmentQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleDepartment = async (id: string) => {
  const department = await Department.findById(id);
  if (!department) {
    throw new AppError(httpStatus.NOT_FOUND, 'Department not found');
  }
  return department;
};

export const DepartmentServices = {
  createDepartment,
  getAllDepartment,
  getSingleDepartment,
};
