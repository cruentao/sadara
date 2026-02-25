import { SetMetadata } from '@nestjs/common';

// Supported roles in the system
export type UserRole = 'super_admin' | 'admin_institucion' | 'estudiante';

export const ROLES_KEY = 'roles';

// Decorator to annotate controllers/handlers with required roles
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
