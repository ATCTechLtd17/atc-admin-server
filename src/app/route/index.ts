import { Router } from 'express';
import { AuthRoutes } from '../module/Auth/auth.route';
import { DepartmentRoutes } from '../module/Departments/department.route';
import { CategoryRoutes } from '../module/Categories/categories.route';
import { SubCategoryRoutes } from '../module/SubCategories/subCategories.route';
import { IncomeRoutes } from '../module/Income/income.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/department',
    route: DepartmentRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/sub-category',
    route: SubCategoryRoutes,
  },
  {
    path: '/income',
    route: IncomeRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
