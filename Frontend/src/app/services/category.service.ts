import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category, PageResponse } from '../models';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseService {
  private apiUrl = environment.apiBaseUrl + '/categories';

  constructor(private http: HttpClient) {
    super();
  }

  getAll(page = 0, size = 10, sort = 'id,asc'): Observable<PageResponse<Category>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get<PageResponse<Category>>(this.apiUrl, { params });
  }
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => this.handleError(error)));
  }

  create(data: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, data)
      .pipe(catchError(error => this.handleError(error)));
  }

  update(id: number, data: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(error => this.handleError(error)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
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
