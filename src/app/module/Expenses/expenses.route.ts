import { Router } from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../User/user.constant';
import { ExpenseController } from './expenses.controller';

const router = Router();

router.post(
  '/add-expense',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ExpenseController.createExpense,
);

router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ExpenseController.getAllExpenses,
);

router.get(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ExpenseController.getSingleExpense,
);

router.patch(
  '/update-expense/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ExpenseController.updateExpense,
);

router.delete(
  '/delete-expense/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ExpenseController.deleteExpense,
);

export const ExpenseRoutes = router;
