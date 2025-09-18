import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';

export interface MenuItemsResponse {
  content: MenuItem[];
  totalElements: number;
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  private items: MenuItem[] = [
    // Minimal in-memory menu for demo; extend as needed
    { id: '1', name: 'Sample', cat: 'Sample', price: 100, mrp: 120, off: 20, veg: true, customizable: false, rating: 4.5, pop: 10, img: '' }
  ];

  getAllMenuItems(page = 0, pageSize = 12): Observable<MenuItemsResponse> {
    return of({
      content: this.items.slice(page * pageSize, (page + 1) * pageSize),
      totalElements: this.items.length
    });
  }

  getVegItems(vegOnly: boolean, page = 0, pageSize = 12): Observable<MenuItemsResponse> {
    const filtered = this.items.filter(i => i.veg);
    return of({
      content: filtered.slice(page * pageSize, (page + 1) * pageSize),
      totalElements: filtered.length
    });
  }
}
