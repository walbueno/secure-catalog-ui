/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/products`;

  const sample: Product = {
    id: '1',
    name: 'Anel Solitário',
    sku: 'ANL-0001',
    category: 'rings',
    price: 150,
    stockQuantity: 4,
    active: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('list() calls GET /products without filters', () => {
    service.list().subscribe();
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([sample]);
  });

  it('list() forwards category and search as query params', () => {
    service.list({ category: 'rings', search: 'solit' }).subscribe();
    const req = httpMock.expectOne(
      (r) => r.url === baseUrl && r.params.get('category') === 'rings' && r.params.get('search') === 'solit'
    );
    expect(req.request.method).toBe('GET');
    req.flush([sample]);
  });

  it('create() posts the payload without an id', () => {
    const { id, ...payload } = sample;
    service.create(payload).subscribe();
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(sample);
  });

  it('update() puts to /products/:id', () => {
    const { id, ...payload } = sample;
    service.update(id, payload).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(sample);
  });

  it('delete() issues a DELETE to /products/:id', () => {
    service.delete(sample.id).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/${sample.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
