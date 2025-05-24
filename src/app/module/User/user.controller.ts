import catchAsync from '../../utils/catchAsync';

import httpStatus from 'http-status';

import { sendResponse } from '../../utils/sendResponse';
import { TImageFiles } from '../../interface/image.interface';
import { UserServices } from './user.services';

const createAdminIntoDB = catchAsync(async (req, res) => {
  const { password, admin } = req.body;
  const result = await UserServices.createAdmin(password, admin);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});
const getAllAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.getAllAdminFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Admin data retrieve successfully',
    data: result,
  });
});

const getMeFromDB = catchAsync(async (req, res) => {
  const { id } = req.user;

  const result = await UserServices.getMe(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile get successfully',
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  const files = req.files as TImageFiles;

  // Extract single files from the fields
  const profilePhoto = files?.image ? files.image[0] : undefined;
  const result = await UserServices.updateUserProfileData(
    req.user,
    req.body,
    profilePhoto,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.deleteUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const UserController = {
  createAdminIntoDB,
  getAllAdmin,

  getMeFromDB,
  updateUserProfile,
  deleteUser,
};
