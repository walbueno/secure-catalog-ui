import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

/**
 * Autorização no nível da rota: bloqueia a navegação de quem não tem
 * nenhum dos perfis declarados em `data.roles`. O interceptor protege as
 * chamadas de API; o guard protege a navegação.
 *
 * Uso: { path: 'products', canActivate: [roleGuard], data: { roles: ['admin', 'stock-manager'] } }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = (route.data['roles'] as UserRole[] | undefined) ?? [];
  if (requiredRoles.length === 0) {
    return true;
  }

  const isAuthorized = requiredRoles.some((role) => authService.hasRole(role));
  return isAuthorized ? true : router.createUrlTree(['/login']);
};