import { CanActivateFn, Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(Auth);
  
  return user(auth).pipe(
    map((userOrNull: any) => !userOrNull || router.parseUrl('/home'))
  );
};
