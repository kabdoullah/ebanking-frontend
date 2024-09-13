import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authorizationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.roles.includes('ADMIN')) {
    router.navigateByUrl('/admin/not-authorized');
    return false;
  }
  return true;
};
