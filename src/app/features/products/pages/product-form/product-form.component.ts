import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, ProductCategory, ProductFormValue } from '../../../../core/models/product.model';

/**
 * Dynamic reactive form for creating/editing a Product.
 *
 * "Dynamic" here means: the form adapts to an existing Product via
 * OnChanges (edit mode) or starts blank (create mode), and validation
 * rules live declaratively in the FormGroup definition rather than
 * scattered across template conditionals. The component emits a typed
 * ProductFormValue rather than the FormGroup itself, so the parent
 * doesn't need to know anything about how the form is built internally
 * — that's an implementation detail encapsulated here (open/closed:
 * the form's internals can change without breaking callers).
 */
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnChanges {
  @Input() product: Product | null = null;
  @Input() saving = false;

  @Output() save = new EventEmitter<ProductFormValue>();
  @Output() cancel = new EventEmitter<void>();

  readonly categories: ProductCategory[] = ['rings', 'necklaces', 'earrings', 'bracelets', 'watches'];

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]{4,20}$/)]],
    category: ['rings', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    active: [true],
  });

  constructor(private readonly fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      // patchValue (not setValue) so partial products don't blow up the form.
      this.form.patchValue(this.product);
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue() as ProductFormValue);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
