import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { ExpenseController } from './expenses.controller';

const router = Router();

router.post(
  '/add-expense',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  ExpenseController.createExpense,
);

router.get(
  '/',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  ExpenseController.getAllExpenses,
);

router.get(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  ExpenseController.getSingleExpense,
);

router.patch(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  ExpenseController.updateExpense,
);

router.delete(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  ExpenseController.deleteExpense,
);

export const ExpenseRoutes = router;
