import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Product, ProductFormValue } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';

type SortKey = keyof Pick<Product, 'name' | 'sku' | 'price' | 'stockQuantity'>;
type SortDirection = 'asc' | 'desc';

/**
 * "Advanced grid" here means: server-driven search (debounced, so we
 * don't hammer the API on every keystroke), client-side sort by column,
 * and pagination — the three things a real ERP product list needs, kept
 * as plain component state rather than pulled in as a 3rd-party grid
 * dependency, so the logic is fully inspectable in an interview context.
 * Swapping this for ag-Grid/PrimeNG later would only touch the template.
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  editingProduct: Product | null = null;
  isFormOpen = false;

  readonly searchControl = new FormControl('', { nonNullable: true });

  sortKey: SortKey = 'name';
  sortDirection: SortDirection = 'asc';

  page = 1;
  readonly pageSize = 10;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((search) => {
          this.loading = true;
          this.page = 1;
          return this.productService.list({ search });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (products) => {
          this.products = products;
          this.loading = false;
        },
        error: () => {
          this.error = 'Não foi possível carregar os produtos.';
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get sortedAndPaginatedProducts(): Product[] {
    const sorted = [...this.products].sort((a, b) => {
      const dir = this.sortDirection === 'asc' ? 1 : -1;
      return a[this.sortKey] > b[this.sortKey] ? dir : -dir;
    });
    const start = (this.page - 1) * this.pageSize;
    return sorted.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.products.length / this.pageSize));
  }

  sortBy(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
  }

  goToPage(page: number): void {
    this.page = Math.min(Math.max(1, page), this.totalPages);
  }

  openCreateForm(): void {
    this.editingProduct = null;
    this.isFormOpen = true;
  }

  openEditForm(product: Product): void {
    this.editingProduct = product;
    this.isFormOpen = true;
  }

  onFormSave(value: ProductFormValue): void {
    const request$ = this.editingProduct
      ? this.productService.update(this.editingProduct.id, value)
      : this.productService.create(value);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isFormOpen = false;
        this.fetchProducts();
      },
      error: () => {
        this.error = 'Não foi possível salvar o produto.';
      },
    });
  }

  onFormCancel(): void {
    this.isFormOpen = false;
  }

  private fetchProducts(): void {
    this.loading = true;
    this.productService
      .list()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.loading = false;
        },
        error: () => {
          this.error = 'Não foi possível carregar os produtos.';
          this.loading = false;
        },
      });
  }
}
