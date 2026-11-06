import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';
import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['hasRole']);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });
    router = TestBed.inject(Router);
  });

  function runGuard(roles: UserRole[]) {
    const route = { data: { roles } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    return TestBed.runInInjectionContext(() => roleGuard(route, state));
  }

  it('allows navigation when the route declares no roles', () => {
    expect(runGuard([])).toBeTrue();
  });

  it('allows navigation when the user has one of the required roles', () => {
    authService.hasRole.and.returnValue(true);
    expect(runGuard(['admin'])).toBeTrue();
  });

  it('redirects to /login when the user lacks the required role', () => {
    authService.hasRole.and.returnValue(false);
    const result = runGuard(['admin']) as UrlTree;
    expect(router.serializeUrl(result)).toBe('/login');
  });
});