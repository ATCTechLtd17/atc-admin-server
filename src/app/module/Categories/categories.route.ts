import { Router } from 'express';
import { CategoryController } from './categories.controller';

const router = Router();

router.post('/create-category', CategoryController.createCategory);
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getSingleCategory);
router.patch('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

export const CategoryRoutes = router;
