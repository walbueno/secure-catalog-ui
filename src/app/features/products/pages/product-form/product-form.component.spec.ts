import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductFormComponent } from './product-form.component';
import { Product } from '../../../../core/models/product.model';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  const sample: Product = {
    id: '1',
    name: 'Anel Solitário',
    sku: 'ANL-0001',
    category: 'rings',
    price: 150,
    stockQuantity: 4,
    active: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProductFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts invalid when empty (create mode)', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('patches the form when an existing product is set (edit mode)', () => {
    component.product = sample;
    component.ngOnChanges({
      product: { currentValue: sample, previousValue: null, firstChange: true, isFirstChange: () => true },
    } as any);

    expect(component.form.value.name).toBe('Anel Solitário');
    expect(component.form.valid).toBeTrue();
  });

  it('does not emit save when the form is invalid', () => {
    spyOn(component.save, 'emit');

    component.onSubmit();

    expect(component.save.emit).not.toHaveBeenCalled();
    expect(component.form.touched).toBeTrue(); // markAllAsTouched was called
  });

  it('emits save with the form value when valid', () => {
    spyOn(component.save, 'emit');
    component.form.setValue({
      name: 'Colar de Pérolas',
      sku: 'COL-0002',
      category: 'necklaces',
      price: 300,
      stockQuantity: 2,
      active: true,
    });

    component.onSubmit();

    expect(component.save.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ name: 'Colar de Pérolas', sku: 'COL-0002' })
    );
  });

  it('emits cancel when onCancel is called', () => {
    spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});
