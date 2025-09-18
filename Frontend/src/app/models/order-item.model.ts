import type { MenuItem } from './menu-item.model';
export interface OrderItem {
  id: number;
  menuItem: MenuItem;
  quantity: number;
}
