export const UserRole = {
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type TStatus = 'ACTIVE' | 'INACTIVE';

export const adminSearchableFields = [
  'fullName',
  'email',
  'contact',
  'address',
];
