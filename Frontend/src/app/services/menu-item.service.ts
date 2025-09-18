import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuItem, PageResponse } from '../models';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class MenuItemService extends BaseService {
  private apiUrl = environment.apiBaseUrl + '/menu-items';
  constructor(private http: HttpClient) {
    super();
  }

  // Get recommended menu items for a customer
  getRecommendations(customerId: number): Observable<MenuItem[]> {
    const url = environment.apiBaseUrl + '/orders/recommendations';
    return this.http.get<MenuItem[]>(url, { params: new HttpParams().set('customerId', customerId.toString()) })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  getAll(page = 0, size = 10, sort = 'id,asc'): Observable<PageResponse<MenuItem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get<PageResponse<MenuItem>>(this.apiUrl, { params })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  getMenuItemById(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }
  getMenuItemBySlug(slug: string): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.apiUrl}/slug/${slug}`)
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
