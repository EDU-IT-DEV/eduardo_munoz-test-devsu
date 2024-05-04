import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';


import { Product } from '../interfaces/product.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiURL = environment.apiURL;

  constructor(private httpClient: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.apiURL}`).pipe(
      catchError(this.handleError)
    );
  }

  createProduct(newProduct: Product): Observable<Product> {
    return this.httpClient.post<Product>(`${this.apiURL}`, newProduct).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(`${this.apiURL}`, product).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.httpClient.delete(`${this.apiURL}`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  productExists(id: string): Observable<boolean> {
    const params = new HttpParams().set('id', id);
    return this.httpClient.get<boolean>(`${this.apiURL}/verification`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ha ocurrido un error:', error.error.message);
    } else {
      console.error(`Error de servidor, estado: ${error.status}, error: ${error.error}`);
    }
    return throwError('Error, intentelo más tarde!.');
  }
}
