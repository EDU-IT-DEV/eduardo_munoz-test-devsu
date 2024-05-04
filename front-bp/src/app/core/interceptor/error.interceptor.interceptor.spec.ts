import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';
import { Product } from 'src/app/features/products/interfaces/product.interface';
import { catchError, throwError } from 'rxjs';

describe('ErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should handle client-side error', () => {
    httpClient.get<Product>('/test').subscribe(
      () => fail('expected an error, not product'),
      (error) => {
        expect(error).toContain('Error:');
      }
    );

    const req = httpTestingController.expectOne('/test');
    req.error(new ErrorEvent('Client Error'));
  });

  it('should handle server-side error', () => {
    httpClient.get<Product>('/test').subscribe(
      () => fail('expected an error, not product'),
      (error) => {
        expect(error).toContain('Error Code: 500');
      }
    );

    const req = httpTestingController.expectOne('/test');
    req.flush(null, { status: 500, statusText: 'Server Error' });
  });

  it('should throw custom error message on server error', () => {
    httpClient.get<Product>('/test').subscribe(
      () => fail('expected an error, not product'),
      (error) => {
        expect(error).toBe('Error Code: 404, Message: Not Found');
      }
    );

    const req = httpTestingController.expectOne('/test');
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('should throw custom error message on client error', () => {
    spyOn(console, 'error');
    httpClient.get<Product>('/test').subscribe(
      () => fail('expected an error, not product'),
      (error) => {
        expect(error).toBe('Error: Client error');
      }
    );

    const req = httpTestingController.expectOne('/test');
    req.error(new ErrorEvent('Client error'));
  });

  it('should throw error when error is not HttpErrorResponse', () => {
    spyOn(console, 'error');

    httpClient.get<Product>('/test').pipe(
      catchError(() => throwError('Unknown error'))
    ).subscribe(
      () => fail('expected an error, not product'),
      (error) => {
        expect(error).toBe('Unknown error');
      }
    );

    const req = httpTestingController.expectOne('/test');
    req.flush(null);
  });
});
