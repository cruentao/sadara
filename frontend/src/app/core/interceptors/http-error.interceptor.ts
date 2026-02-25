import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

// Global HTTP error handler — manages 401 and 403 centrally
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Session expired or invalid — clear local state and send to login
        authService.logout();
        router.navigate(['/auth/login']);
      }

      if (error.status === 403) {
        // Authenticated but lacking permissions — redirect to dashboard
        router.navigate(['/dashboard']);
      }

      // Re-throw so individual components can handle remaining errors if needed
      return throwError(() => error);
    }),
  );
};
