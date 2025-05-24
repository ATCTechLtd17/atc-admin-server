/* eslint-disable @typescript-eslint/no-explicit-any */

import { IUser } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status';

import { Admin } from '../Admin/admin.model';
import { IAdmin } from '../Admin/admin.interface';

import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import AppError from '../../Error/AppError';

import QueryBuilder from '../../Builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import { TImageFile } from '../../interface/image.interface';
import { SuperAdmin } from '../SuperAdmin/superAdmin.model';
import { adminSearchableFields, UserRole } from './user.constant';

const generateUserId = (name: string): string => {
  const cleanName = name.trim().split(' ').join('').toLowerCase();
  const shortUuid = uuidv4().slice(0, 6); // keep it short & readable
  return `${cleanName}-${shortUuid}`;
};

const roleModelMap: any = {
  [UserRole.ADMIN]: Admin,
  [UserRole.SUPER_ADMIN]: SuperAdmin,
};

//create-admin
const createAdmin = async (password: string, payload: IAdmin) => {
  const userName = generateUserId(payload.fullName);

  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const userData: Partial<IUser> = {};

  //user-data
  userData.userId = userName;
  userData.email = payload.email;
  userData.contact = payload.contact;
  userData.password = password;
  userData.role = UserRole.ADMIN;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const createUser = await User.create([userData], { session });

    if (!createUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Account Registration failed');
    }

    if (createUser.length > 0) {
      payload.user = createUser[0]._id;
      const createAdmin = await Admin.create([payload], { session });

      if (!createAdmin.length) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Account Registration failed',
        );
      }

      await session.commitTransaction();
      await session.endSession();

      return createAdmin;
    }
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const getAllAdminFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(
    Admin.find({ isDeleted: false }).populate('user'),
    query,
  )
    .search(adminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;
  const meta = await adminQuery.countTotal();
  return { result, meta };
};

//Get me
const getMe = async (id: string) => {
  const isUserExist = await User.findOne({ _id: id });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User with this id not found');
  }

  if (isUserExist.role === UserRole.ADMIN) {
    const getProfile = await Admin.findOne({ user: isUserExist._id }).populate(
      'user',
    );
    return getProfile;
  } else if (isUserExist.role === UserRole.SUPER_ADMIN) {
    const getProfile = await SuperAdmin.findOne({
      user: isUserExist._id,
    }).populate('user');
    return getProfile;
  }
};

const updateUserProfileData = async (
  user: JwtPayload,
  data: Partial<IUser>,
  profileImg?: TImageFile,
) => {
  const profileImagePath = (profileImg && profileImg.path) || '';
  const modelToUpdate = roleModelMap[user.role as any];

  const result = await modelToUpdate.findOneAndUpdate(
    { user: user.id },
    {
      ...data,
      ...(profileImagePath && { profileImage: profileImagePath }),
    },
    { new: true },
  );

  return result;
};

//soft delete
const deleteUser = async (id: string) => {
  const _id = id;
  const isUserExist = await User.findById(_id);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (isUserExist.role === UserRole.ADMIN) {
      await User.updateOne(
        { _id: _id },
        { $set: { isDeleted: true, status: 'INACTIVE' } },
        { session },
      );
      await Admin.updateOne(
        { user: _id },
        { $set: { isDeleted: true } },
        { session },
      );
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'User delete failed');
  }
};

export const UserServices = {
  createAdmin,
  getAllAdminFromDB,
  getMe,
  updateUserProfileData,
  deleteUser,
};
