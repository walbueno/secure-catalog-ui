import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authService: AuthService;
  let router: Router;

  const routeWithRoles = (roles: string[]): ActivatedRouteSnapshot =>
    ({ data: { roles } } as unknown as ActivatedRouteSnapshot);

  beforeEach(() => {
    localStorage.clear(); // avoid leaking a token from another spec's login() call
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: { createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({} as UrlTree) } },
      ],
    });

    guard = TestBed.inject(RoleGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('allows navigation when the route declares no roles', () => {
    expect(guard.canActivate(routeWithRoles([]))).toBeTrue();
  });

  it('allows navigation when the user has one of the required roles', () => {
    authService.login({ id: '1', name: 'Ana', roles: ['stock-manager'] }, 'token');
    expect(guard.canActivate(routeWithRoles(['admin', 'stock-manager']))).toBeTrue();
  });

  it('redirects to /login when the user lacks the required role', () => {
    authService.login({ id: '1', name: 'Ana', roles: ['viewer'] }, 'token');
    const result = guard.canActivate(routeWithRoles(['admin']));

    expect(result).not.toBeTrue();
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
