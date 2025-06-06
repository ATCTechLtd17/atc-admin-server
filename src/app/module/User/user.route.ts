import { Router } from 'express';
import { UserController } from './user.controller';
import {
  adminSchemaValidation,
  UpdateUserValidationSchema,
} from './user.validation';
import auth from '../../middleware/auth';
import { UserRole } from './user.constant';
import { validateRequest } from '../../middleware/validateRequest';
import { parseBodyForFormData } from '../../middleware/ParseBodyForFormData';
import { uploadSingleImage } from '../../config/multer.config';
import { validateFileRequest } from '../../middleware/validateUploadedFile';
import { UploadedFilesArrayZodSchema } from '../../utils/uploadedFileValidationSchema';

const router = Router();

router.get(
  '/admins',
  auth(...Object.values(UserRole)),
  UserController.getAllAdmin,
);

router.post(
  '/create-admin',
  auth(UserRole.SUPER_ADMIN),
  validateRequest(adminSchemaValidation),
  UserController.createAdminIntoDB,
);

router.get('/me', auth(...Object.values(UserRole)), UserController.getMeFromDB);

router.patch(
  '/update-my-profile',
  auth(...Object.values(UserRole)),
  uploadSingleImage,
  validateFileRequest(UploadedFilesArrayZodSchema),
  parseBodyForFormData,
  validateRequest(UpdateUserValidationSchema),
  UserController.updateUserProfile,
);

router.delete('/:id', auth(UserRole.SUPER_ADMIN), UserController.deleteUser);

export const UserRoutes = router;
