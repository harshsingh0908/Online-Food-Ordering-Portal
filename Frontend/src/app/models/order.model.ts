import type { OrderItem } from './order-item.model';
export interface Order {
  id: number;
  items: OrderItem[];
  total: number;
}
