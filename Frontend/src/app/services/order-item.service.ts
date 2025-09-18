import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OrderItem, PageResponse } from '../models';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class OrderItemService extends BaseService {
  private apiUrl = environment.apiBaseUrl + '/order-items';
  constructor(private http: HttpClient) {
    super();
  }
  getAll(page = 0, size = 10, sort = 'id,asc'): Observable<PageResponse<OrderItem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get<PageResponse<OrderItem>>(this.apiUrl, { params })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    throw error;
  }
}
