import { Router } from 'express';
import { SubCategoryController } from './subCategories.controller';
import auth from '../../middleware/auth';
import { UserRole } from '../User/user.constant';

const router = Router();

router.post(
  '/create',
  auth(...Object.values(UserRole)),
  SubCategoryController.createSubCategory,
);
router.get(
  '/',
  auth(...Object.values(UserRole)),
  SubCategoryController.getAllSubCategories,
);
router.get(
  '/:id',
  auth(...Object.values(UserRole)),
  SubCategoryController.getSingleSubCategory,
);
router.patch(
  '/:id',
  auth(...Object.values(UserRole)),
  SubCategoryController.updateSubCategory,
);
router.delete(
  '/:id',
  auth(...Object.values(UserRole)),
  SubCategoryController.deleteSubCategory,
);

export const SubCategoryRoutes = router;
