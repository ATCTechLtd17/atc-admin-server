import { Model } from 'mongoose';
import { TStatus } from './user.constant';

type TRole = 'ADMIN' | 'SUPER_ADMIN';

export interface IUser {
  userId: string;
  fullName?: string;
  email: string;
  contact: string;
  password: string;
  profileImg?: string;
  needPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: TRole;
  status: TStatus;
  isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
