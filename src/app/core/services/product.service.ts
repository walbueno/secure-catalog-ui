import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductFormValue } from '../models/product.model';

/**
 * Thin HTTP boundary for the Product resource.
 *
 * Responsibility is deliberately narrow (Single Responsibility): this
 * class only knows how to talk to the /products endpoint. It doesn't
 * know about forms, grids, or how the data is displayed — that's the
 * component/presentation layer's job. Auth headers are NOT set here;
 * they're attached centrally by AuthInterceptor, so every service that
 * calls the API automatically inherits secure request handling instead
 * of each service having to remember to do it.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = `${environment.apiUrl}/products`;

  constructor(private readonly http: HttpClient) {}

  list(filters?: { category?: string; search?: string }): Observable<Product[]> {
    let params = new HttpParams();
    if (filters?.category) {
      params = params.set('category', filters.category);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    return this.http.get<Product[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(payload: ProductFormValue): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, payload);
  }

  update(id: string, payload: ProductFormValue): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
