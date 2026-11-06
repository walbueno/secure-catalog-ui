import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/auth/pages/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // Lazy loading: ProductsModule (and everything it imports) is only
  // fetched by the browser when the user actually navigates to /products.
  // RoleGuard: only users with 'admin' or 'stock-manager' can reach the
  // catalog screen — mirrors the API-level authorization enforced by
  // AuthInterceptor, but at the navigation level.
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module').then((m) => m.ProductsModule),
    canActivate: [roleGuard],
    data: { roles: ['admin', 'stock-manager'] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
