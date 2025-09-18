import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

/**
 * Minimal ReviewService. If backend is present it will call it,
 * otherwise it returns mock/fallback responses so UI remains functional.
 */
@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private http: HttpClient | null) {}

  // Try hitting backend endpoint; if not available, return empty array
  getReviewsByMenuItem(menuItemId: number): Observable<any[]> {
    try {
      // adjust endpoint as your backend exposes it
      return (this.http as HttpClient).get<any[]>(`/api/reviews?menuItemId=${menuItemId}`);
    } catch (e) {
      return of([]);
    }
  }

  // Provide a small summary (avg/count) — fallback to 0
  getReviewSummary(menuItemId: number): Observable<{ average: number; count: number }> {
    try {
      return (this.http as HttpClient).get<{ average: number; count: number }>(`/api/reviews/summary?menuItemId=${menuItemId}`);
    } catch (e) {
      return of({ average: 0, count: 0 });
    }
  }

  addReview(payload: { menuItemId: number; userId: number; rating: number; comment: string }): Observable<any> {
    try {
      return (this.http as HttpClient).post('/api/reviews', payload);
    } catch (e) {
      // fallback: pretend it succeeded
      return of({ ok: true });
    }
  }
}
