import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { DepartmentController } from './department.controller';

const router = Router();

router.post(
  '/create-department',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  DepartmentController.createDepartment,
);

router.get(
  '/',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  DepartmentController.getAllDepartment,
);

router.get(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  DepartmentController.getSingleDepartment,
);

router.patch(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  DepartmentController.updateDepartment,
);

router.delete(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  DepartmentController.deleteDepartment,
);

export const DepartmentRoutes = router;
