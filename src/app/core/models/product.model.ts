/**
 * Product domain model.
 *
 * Kept intentionally framework-agnostic (plain interface, no Angular
 * decorators) so it can be reused by services, forms, and tests without
 * pulling in UI concerns. This is the "D" in DDD-lite: the shape of the
 * business entity is defined once, in one place.
 */
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  stockQuantity: number;
  active: boolean;
}

export type ProductCategory = 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'watches';

/**
 * Payload shape for create/update — deliberately narrower than Product
 * (no id, since that's server-assigned on create). Separating "read"
 * and "write" shapes avoids accidentally trusting client-supplied ids.
 */
export type ProductFormValue = Omit<Product, 'id'>;
