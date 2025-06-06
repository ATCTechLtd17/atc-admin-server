import { model, Schema } from 'mongoose';
import { IAdmin } from './admin.interface';

const adminSchema = new Schema<IAdmin>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    emergencyContact: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Admin = model<IAdmin>('Admin', adminSchema);
