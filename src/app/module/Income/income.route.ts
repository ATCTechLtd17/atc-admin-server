import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { IncomeController } from './income.controller';

const router = Router();

router.post(
  '/add-income',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  IncomeController.createIncome,
);

router.get(
  '/',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  IncomeController.getAllIncome,
);

router.get(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  IncomeController.getSingleIncome,
);

router.patch(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  IncomeController.updateIncome,
);

router.delete(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  IncomeController.deleteIncome,
);

export const IncomeRoutes = router;
