import { model, Schema } from 'mongoose';
import { ICategories } from './categories.interface';

const categoriesSchema = new Schema<ICategories>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = model<ICategories>('Category', categoriesSchema);
