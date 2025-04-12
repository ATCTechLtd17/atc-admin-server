import { Router } from 'express';
import { SubCategoryController } from './subCategories.controller';

const router = Router();

router.post('/create-sub-category', SubCategoryController.createSubCategory);
router.get('/', SubCategoryController.getAllSubCategories);
router.get('/:id', SubCategoryController.getSingleSubCategory);
router.patch('/:id', SubCategoryController.updateSubCategory);
router.delete('/:id', SubCategoryController.deleteSubCategory);

export const SubCategoryRoutes = router;
