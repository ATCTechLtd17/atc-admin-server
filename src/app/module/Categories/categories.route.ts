import { Router } from 'express';
import { CategoryController } from './categories.controller';
import auth from '../../middleware/auth';
import { UserRole } from '../User/user.constant';

const router = Router();

router.post(
  '/create-category',
  auth(...Object.values(UserRole)),
  CategoryController.createCategory,
);
router.get(
  '/',
  auth(...Object.values(UserRole)),
  CategoryController.getAllCategories,
);
router.get(
  '/:id',
  auth(...Object.values(UserRole)),
  CategoryController.getSingleCategory,
);
router.patch(
  '/:id',
  auth(...Object.values(UserRole)),
  CategoryController.updateCategory,
);
router.delete(
  '/:id',
  auth(...Object.values(UserRole)),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
