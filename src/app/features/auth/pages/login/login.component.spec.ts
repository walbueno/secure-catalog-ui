import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear(); // avoid leaking a token from another spec's login() call
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [AuthService, { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lists demo users for admin, stock-manager and sales', () => {
    const roles = component.demoUsers.map((u) => u.role);
    expect(roles).toEqual(['admin', 'stock-manager', 'sales']);
  });

  it('logs in with the chosen role and navigates to /products', () => {
    spyOn(authService, 'login').and.callThrough();

    component.loginAs('admin');

    expect(authService.login).toHaveBeenCalledWith(
      jasmine.objectContaining({ roles: ['admin'] }),
      'demo-token'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});
