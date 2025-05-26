import { Router } from 'express';
import auth from '../../middleware/auth';
import { ReportController } from './report.controller';
import { UserRole } from '../User/user.constant';

const router = Router();

router.get(
  '/financial-report',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ReportController.getFinancialReport,
);

router.get(
  '/expenses-by-category',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ReportController.getExpensesByCategory,
);

export const ReportRoutes = router;
