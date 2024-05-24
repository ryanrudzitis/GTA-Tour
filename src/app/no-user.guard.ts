import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

export const noUserGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);
  
  return user(auth).pipe(
    map((userOrNull: any) => userOrNull || router.parseUrl('/sign-in'))
  );
};
