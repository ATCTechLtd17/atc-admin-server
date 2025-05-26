import { Types } from 'mongoose';

export interface ICategories {
  name: string;
  description?: string;
  department: Types.ObjectId;
}
