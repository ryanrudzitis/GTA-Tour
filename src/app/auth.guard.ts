import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (authService.currentUser) {
    console.log('User is logged in guard');
    router.navigate(['/home']);
    return false;
  }
  console.log('User is not logged in guard');
  return true;
};
