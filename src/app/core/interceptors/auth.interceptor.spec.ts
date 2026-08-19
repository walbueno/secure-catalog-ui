import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    // AuthService persists the token to real browser localStorage, which
    // Karma does NOT reset between specs — without this, a token written
    // by one test leaks into the next and produces flaky, order-dependent
    // failures.
    localStorage.clear();
  });

  afterEach(() => httpMock.verify());

  it('attaches the Authorization header when a token exists', () => {
    authService.login({ id: '1', name: 'Test User', roles: ['viewer'] }, 'fake-token');

    httpClient.get('/api/products').subscribe();

    const req = httpMock.expectOne('/api/products');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush([]);
  });

  it('does not attach an Authorization header when there is no token', () => {
    httpClient.get('/api/products').subscribe();

    const req = httpMock.expectOne('/api/products');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush([]);
  });

  it('logs the user out and redirects to /login on a 401 response', () => {
    authService.login({ id: '1', name: 'Test User', roles: ['viewer'] }, 'fake-token');
    spyOn(authService, 'logout').and.callThrough();

    httpClient.get('/api/products').subscribe({
      error: (err: HttpErrorResponse) => expect(err.status).toBe(401),
    });

    const req = httpMock.expectOne('/api/products');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
