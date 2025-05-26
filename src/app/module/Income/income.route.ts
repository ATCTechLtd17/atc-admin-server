import { Router } from 'express';
import auth from '../../middleware/auth';
import { IncomeController } from './income.controller';
import { UserRole } from '../User/user.constant';

const router = Router();

router.post(
  '/add-income',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  IncomeController.createIncome,
);

router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  IncomeController.getAllIncome,
);

router.get(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  IncomeController.getSingleIncome,
);

router.patch(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  IncomeController.updateIncome,
);

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  IncomeController.deleteIncome,
);

export const IncomeRoutes = router;
