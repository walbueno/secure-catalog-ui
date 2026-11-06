import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../../../core/services/auth.service';

/**
 * Demo login screen. There is no real backend behind this project (see
 * README), so this simulates authentication by letting the visitor pick
 * a role and issuing a fake token locally via AuthService.login(). This
 * exists specifically so RoleGuard has somewhere to send unauthenticated
 * users, and so reviewers can actually see the authorization flow work
 * end-to-end instead of just reading about it in the code.
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  readonly demoUsers: Array<{ label: string; role: UserRole }> = [
    { label: 'Entrar como Admin', role: 'admin' },
    { label: 'Entrar como Gestor de Estoque', role: 'stock-manager' },
    { label: 'Entrar como Vendedor (sem acesso ao catálogo)', role: 'sales' },
  ];

  accessMessage = '';

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  loginAs(role: UserRole): void {
    this.authService.login({ id: 'demo-user', name: 'Usuário Demo', roles: [role] }, 'demo-token');

    if (role === 'admin' || role === 'stock-manager') {
      this.accessMessage = '';
      this.router.navigate(['/products']);
      return;
    }

    this.accessMessage = 'O perfil Vendedor não possui acesso ao catálogo de produtos.';
  }
}
