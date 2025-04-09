import { Router } from 'express';
import { AuthRoutes } from '../module/Auth/auth.route';
import { DepartmentRoutes } from '../module/Departments/department.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
