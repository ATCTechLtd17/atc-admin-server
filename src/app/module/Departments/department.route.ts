import { Router } from 'express';
import auth from '../../middleware/auth';

import { DepartmentController } from './department.controller';
import { UserRole } from '../User/user.constant';

const router = Router();

router.post(
  '/create-department',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DepartmentController.createDepartment,
);

router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DepartmentController.getAllDepartment,
);

router.get(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DepartmentController.getSingleDepartment,
);

router.patch(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DepartmentController.updateDepartment,
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DepartmentController.deleteDepartment,
);

export const DepartmentRoutes = router;
