import { Types } from 'mongoose';

export interface ISubCategories {
  name: string;
  description: string;
  category: Types.ObjectId;
}
