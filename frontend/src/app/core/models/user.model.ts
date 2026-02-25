export type UserRole = 'super_admin' | 'admin_institucion' | 'estudiante';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  institucion_id: string | null;
}
