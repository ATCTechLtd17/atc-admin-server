import { z } from 'zod';

export const adminSchemaValidation = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Password is required',
    }),
    admin: z.object({
      fullName: z.string().min(1, 'Full name is required'),
      email: z.string().email('Invalid email format'),
      contact: z.string().min(11, 'Contact number must be at least 11 digits'),
      emergencyContact: z.string().optional(),
      address: z.string().optional(),
    }),
  }),
});

export const UpdateUserValidationSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    emergencyContact: z.string().optional(),
    address: z.string().optional(),
  }),
});
