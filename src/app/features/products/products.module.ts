import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';

/**
 * Feature module for the Products area. This module is only loaded when
 * the user navigates to /products (see app-routing.module.ts loadChildren)
 * — that's the "Modularização (Lazy Loading)" requirement: the app's
 * initial bundle doesn't pay the cost of this feature until it's needed.
 */
@NgModule({
    imports: [CommonModule, ReactiveFormsModule, ProductsRoutingModule, ProductListComponent, ProductFormComponent],
})
export class ProductsModule {}
