import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);
  if (!req.url.includes('/auth/login')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.accessToken}`
      }
    });
    return next(authReq).pipe(
      catchError((error) => {
        if (error.status === 401) {
          authService.logout();
          router.navigateByUrl('/login');
        }
        return throwError(() => new Error(error));
      })
    );
  }
  return next(req);
};
