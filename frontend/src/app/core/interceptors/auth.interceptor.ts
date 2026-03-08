import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';

// Attaches Bearer token from in-memory store to every outgoing request
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  if (!token) return next(req);

  // Clone request to add Authorization header and ensure cookie (refresh token) is sent
  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }),
  );
};
