import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AuthenticatedUser {
  id: string;
  name: string;
  roles: UserRole[];
}

export type UserRole = 'admin' | 'sales' | 'stock-manager' | 'viewer';

const TOKEN_STORAGE_KEY = 'catalog_demo_token';

/**
 * Owns authentication state as a single source of truth (BehaviorSubject),
 * so any component/guard/interceptor can react to login/logout without
 * polling. This mirrors what the job asks for — "autenticação e
 * autorização por usuário e perfis" — with roles modeled explicitly
 * instead of a vague boolean "isAdmin" flag.
 *
 * Token storage is isolated behind get/setToken so swapping the storage
 * strategy later (e.g. httpOnly cookie via a backend proxy, which is the
 * more secure option) doesn't ripple through the rest of the app.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser$ = new BehaviorSubject<AuthenticatedUser | null>(null);

  readonly user$: Observable<AuthenticatedUser | null> = this.currentUser$.asObservable();

  login(user: AuthenticatedUser, token: string): void {
    this.setToken(token);
    this.currentUser$.next(user);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.currentUser$.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser$.value?.roles.includes(role) ?? false;
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}
