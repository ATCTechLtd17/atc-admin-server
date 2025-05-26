import { Router } from 'express';
import { AuthRoutes } from '../module/Auth/auth.route';
import { DepartmentRoutes } from '../module/Departments/department.route';
import { CategoryRoutes } from '../module/Categories/categories.route';
import { SubCategoryRoutes } from '../module/SubCategories/subCategories.route';
import { IncomeRoutes } from '../module/Income/income.route';
import { ExpenseRoutes } from '../module/Expenses/expenses.route';
import { UserRoutes } from '../module/User/user.route';

const middleWareRouter = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
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
  {
    path: '/expense',
    route: ExpenseRoutes,
  },
];

moduleRoutes.forEach((route) => middleWareRouter.use(route.path, route.route));

export const MiddlewareRoutes = middleWareRouter;
