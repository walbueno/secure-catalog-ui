import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  const URL = '/api/products';
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  afterEach(() => httpMock.verify());

  it('does not attach an Authorization header when there is no token', () => {
    authService.getToken.and.returnValue(null);
    http.get(URL).subscribe();
    const req = httpMock.expectOne(URL);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush([]);
  });

  it('attaches the Authorization header when a token exists', () => {
    authService.getToken.and.returnValue('abc');
    http.get(URL).subscribe();
    const req = httpMock.expectOne(URL);
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush([]);
  });

  it('logs the user out and redirects to /login on a 401 response', () => {
    authService.getToken.and.returnValue('abc');
    http.get(URL).subscribe({ error: () => {} });
    httpMock.expectOne(URL).flush('', { status: 401, statusText: 'Unauthorized' });
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
