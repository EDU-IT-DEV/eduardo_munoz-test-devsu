import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../interfaces/product.interface';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiURL = 'test-api-url';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() }
    ];

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(apiURL);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should create product', () => {
    const newProduct: Product = { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: new Date(), date_revision: new Date() };

    service.createProduct(newProduct).subscribe((product) => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne(apiURL);
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('should update product', () => {
    const updatedProduct: Product = { id: '1', name: 'Updated Product', description: 'Updated Description', logo: 'updated_logo.png', date_release: new Date(), date_revision: new Date() };

    service.updateProduct(updatedProduct).subscribe((product) => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(apiURL);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  it('should delete product', () => {
    const id = '1';

    service.deleteProduct(id).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiURL}?id=${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should check if product exists', () => {
    const id = '1';
    const exists = true;

    service.productExists(id).subscribe((result) => {
      expect(result).toBe(exists);
    });

    const req = httpMock.expectOne(`${apiURL}/verification?id=${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(exists);
  });

  it('should handle error', () => {
    service.getProducts().subscribe(
      () => fail('expected an error, not products'),
      (error) => expect(error).toEqual('Error, intentelo más tarde!.')
    );

    const req = httpMock.expectOne(apiURL);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
