import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

/**
 * Route-level authorization: blocks navigation for users who lack the
 * role(s) declared on the route's `data.roles`. This is the navigation
 * counterpart to AuthInterceptor — the interceptor protects API calls,
 * this guard protects the UI surface itself, so an unauthorized user
 * never even reaches a screen whose data they couldn't fetch anyway.
 *
 * Usage in a routing module:
 *   { path: 'products', canActivate: [RoleGuard], data: { roles: ['admin', 'stock-manager'] }, ... }
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredRoles = (route.data['roles'] as UserRole[] | undefined) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const isAuthorized = requiredRoles.some((role) => this.authService.hasRole(role));
    return isAuthorized ? true : this.router.createUrlTree(['/login']);
  }
}
