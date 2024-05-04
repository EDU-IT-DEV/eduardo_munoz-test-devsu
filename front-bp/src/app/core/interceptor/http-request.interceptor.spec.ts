import { TestBed } from '@angular/core/testing';
import { HttpRequestInterceptor } from './http-request.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('HttpRequestInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add authorId to headers', () => {
    const testData = { name: 'Test' };
    environment.authorId = 123;

    httpClient.get('/test').subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne('/test');
    expect(req.request.headers.has('authorId')).toBeTruthy();
    expect(req.request.headers.get('authorId')).toBe('123');
    req.flush(testData);
  });
});
