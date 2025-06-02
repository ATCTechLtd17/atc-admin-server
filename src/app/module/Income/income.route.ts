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

// New route for getting income by custom ID (public route for QR code access)
router.get('/receipt/:customId', IncomeController.getIncomeByCustomId);

// New route for downloading PDF by custom ID (public route for QR code access)
// router.get('/download-pdf/:id', IncomeController.downloadIncomePdf);

router.patch(
  '/update-income/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  IncomeController.updateIncome,
);

router.delete(
  '/delete-income/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  IncomeController.deleteIncome,
);

export const IncomeRoutes = router;
