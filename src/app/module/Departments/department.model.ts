import { model, Schema } from 'mongoose';
import { IDepartment } from './department.interface';

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Department = model<IDepartment>('Department', departmentSchema);
