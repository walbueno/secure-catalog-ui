import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';

const makeProduct = (overrides: Partial<Product>): Product => ({
  id: overrides.id ?? '1',
  name: overrides.name ?? 'Anel Solitário',
  sku: overrides.sku ?? 'ANL-0001',
  category: overrides.category ?? 'rings',
  price: overrides.price ?? 100,
  stockQuantity: overrides.stockQuantity ?? 5,
  active: overrides.active ?? true,
  ...overrides,
});

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['list', 'create', 'update']);
    productServiceSpy.list.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProductListComponent],
      providers: [{ provide: ProductService, useValue: productServiceSpy }],
    });

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('loads products on init', () => {
    const products = [makeProduct({ id: '1' }), makeProduct({ id: '2', name: 'Colar' })];
    productServiceSpy.list.and.returnValue(of(products));

    fixture.detectChanges();

    expect(component.products.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('sets an error message when loading products fails', () => {
    productServiceSpy.list.and.returnValue(throwError(() => new Error('network error')));

    fixture.detectChanges();

    expect(component.error).toBeTruthy();
    expect(component.loading).toBeFalse();
  });

  it('sorts products by the given key, toggling direction on repeat calls', () => {
    component.products = [
      makeProduct({ id: '1', name: 'Zircônia' }),
      makeProduct({ id: '2', name: 'Ametista' }),
    ];

    // sortKey defaults to 'name'/'asc', so the first call to sortBy('name')
    // toggles direction to 'desc' rather than setting it for the first time.
    component.sortBy('name');
    expect(component.sortedAndPaginatedProducts[0].name).toBe('Zircônia');

    component.sortBy('name');
    expect(component.sortedAndPaginatedProducts[0].name).toBe('Ametista');

    component.sortBy('price'); // switching to a new key resets direction to 'asc'
    expect(component.sortDirection).toBe('asc');
  });

  it('paginates results according to pageSize', () => {
    component.products = Array.from({ length: 25 }, (_, i) =>
      makeProduct({ id: String(i), name: `Produto ${i}` })
    );

    expect(component.sortedAndPaginatedProducts.length).toBe(component.pageSize);
    expect(component.totalPages).toBe(3);

    component.goToPage(3);
    expect(component.page).toBe(3);
    expect(component.sortedAndPaginatedProducts.length).toBe(5);
  });

  it('clamps goToPage within [1, totalPages]', () => {
    component.products = [makeProduct({})];

    component.goToPage(99);
    expect(component.page).toBe(component.totalPages);

    component.goToPage(-5);
    expect(component.page).toBe(1);
  });

  it('re-fetches the product list after a successful form save', fakeAsync(() => {
    fixture.detectChanges(); // initial load, products = []
    productServiceSpy.create.and.returnValue(of(makeProduct({ id: '9' })));
    productServiceSpy.list.and.returnValue(of([makeProduct({ id: '9' })]));

    component.openCreateForm();
    component.onFormSave({
      name: 'Anel Novo',
      sku: 'ANL-0009',
      category: 'rings',
      price: 200,
      stockQuantity: 3,
      active: true,
    });
    tick();

    expect(component.isFormOpen).toBeFalse();
    expect(productServiceSpy.list).toHaveBeenCalledTimes(2); // initial + refetch
  }));

  it('debounces and calls the API when the search control changes', fakeAsync(() => {
    fixture.detectChanges();
    productServiceSpy.list.calls.reset();
    productServiceSpy.list.and.returnValue(of([makeProduct({ name: 'Colar de Pérolas' })]));

    component.searchControl.setValue('pérolas');
    tick(300); // debounceTime window

    expect(productServiceSpy.list).toHaveBeenCalledWith({ search: 'pérolas' });
    expect(component.products.length).toBe(1);
  }));
});
