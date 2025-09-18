export interface Review {
  id?: number;
  menuItemId?: number;
  userId?: number;
  user?: { id?: number };
  rating: number;
  comment: string;
  createdAt?: string | Date;
}
