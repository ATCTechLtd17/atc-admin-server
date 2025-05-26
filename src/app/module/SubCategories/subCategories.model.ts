import { model, Schema } from 'mongoose';
import { ISubCategories } from './subCategories.interface';

const subCategoriesSchema = new Schema<ISubCategories>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SubCategory = model<ISubCategories>(
  'SubCategory',
  subCategoriesSchema,
);
