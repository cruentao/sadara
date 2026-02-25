import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  {
    path: 'instituciones',
    canActivate: [authGuard, roleGuard(['super_admin'])],
    loadChildren: () =>
      import('./features/instituciones/instituciones.routes').then((m) => m.institucionesRoutes),
  },
  {
    path: 'academico',
    canActivate: [authGuard, roleGuard(['admin_institucion'])],
    loadChildren: () =>
      import('./features/academico/academico.routes').then((m) => m.academicoRoutes),
  },
  {
    path: 'inscripcion',
    canActivate: [authGuard, roleGuard(['estudiante'])],
    loadChildren: () =>
      import('./features/inscripcion/inscripcion.routes').then((m) => m.inscripcionRoutes),
  },
  {
    path: 'estudiantes',
    canActivate: [authGuard, roleGuard(['admin_institucion'])],
    loadChildren: () =>
      import('./features/estudiantes/estudiantes.routes').then((m) => m.estudiantesRoutes),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
