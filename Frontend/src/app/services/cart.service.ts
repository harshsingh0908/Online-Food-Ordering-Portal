import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';
import { Cart, CartItem } from '../models/cart.model';

export interface SimpleCartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  qty: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public itemsSubject = new BehaviorSubject<SimpleCartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();
  // Normalize image URL for cart and details
  private imageMap: { [key: string]: string } = {
    'paneer-tikka': 'paneer_tikka.jpg',
    'paneer_tikka': 'paneer_tikka.jpg',
    'butter-chicken': 'butter-chicken.jpg',
    'allo-paratha': 'allo-paratha.jpg',
    'masala-dosa': 'masala-dosa.jpg',
    'butter-naan': 'butter-naan.jpg',
    'paneer-butter-masala': 'paneer-butter-masala.jpg',
    'chicken-biryani': 'Chicken_Biryani.jpg',
    'chole-bhature': 'chole_bhature.jpg'
  };

  normalizeImageUrl(img: string | undefined | null): string {
    if (!img) return 'assets/images/placeholder.jpg';
    if (img.startsWith('assets/images/')) return img;

    // Clean the filename
    const cleanName = img.replace(/^.*[\\\/]/, '')  // Remove path
                        .replace(/\.[^/.]+$/, '')    // Remove extension
                        .toLowerCase()
                        .replace(/[^a-z0-9-_]/g, '');// Keep only valid chars
    
    // Try to find in our map
    const mappedFile = this.imageMap[cleanName];
    if (mappedFile) {
      return `assets/images/${mappedFile}`;
    }

    // Fallback to both variants if not in map
    const withUnderscore = `assets/images/${cleanName.replace(/-/g, '_')}.jpg`;
    const withHyphen = `assets/images/${cleanName.replace(/_/g, '-')}.jpg`;

    // Try underscore version first as that seems to be more common in your assets
    return withUnderscore;
  }
  private cartSubject = new BehaviorSubject<Cart>({
    totalAmount: 0,
    items: []
  });
  cart$ = this.cartSubject.asObservable();

  getCart(): Cart {
    return this.cartSubject.value;
  }

  private calculateCart(items: SimpleCartItem[]): Cart {
    const totalAmount = items.reduce((sum: number, item: SimpleCartItem) =>
      sum + (item.price * item.qty), 0);
    // Convert SimpleCartItem to CartItem for legacy API
    const cartItems: CartItem[] = items.map(i => ({
      menuItem: {
        id: i.productId,
        name: i.name,
        price: i.price,
        imageUrl: i.imageUrl
      } as any,
      quantity: i.qty
    }));
    return { items: cartItems, totalAmount };
  }
  add(product: { id: string, name: string, price: number, imageUrl?: string }, qty: number = 1): void {
    let items = this.itemsSubject.value.map(i => ({ ...i })); // clone all items
    const idx = items.findIndex(i => i.productId === product.id);
    if (idx > -1) {
      items[idx] = { ...items[idx], qty: items[idx].qty + qty }; // replace with new object
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: this.normalizeImageUrl(product.imageUrl),
        qty
      });
    }
    this.itemsSubject.next(items);
    this.cartSubject.next(this.calculateCart(items));
  }

  updateQty(productId: string, qty: number): void {
    // Get current state
    const currentItems = this.itemsSubject.value;
    const currentItem = currentItems.find(i => i.productId === productId);
    if (!currentItem) return;

    // Ensure qty only changes by 1
    const currentQty = currentItem.qty;
    let newQty = qty;
    if (Math.abs(qty - currentQty) > 1) {
      newQty = qty > currentQty ? currentQty + 1 : currentQty - 1;
    }
    newQty = Math.max(1, newQty); // Never go below 1

    console.log('Cart Service - Updating Quantity:', {
      productId,
      currentQty,
      requestedQty: qty,
      finalQty: newQty
    });

    // Update state immutably
    const items = currentItems.map(i => 
      i.productId === productId ? { ...i, qty: newQty } : { ...i }
    );
    
    this.itemsSubject.next(items);
    this.cartSubject.next(this.calculateCart(items));
  }

  remove(productId: string): void {
    let items = this.itemsSubject.value.filter((i: SimpleCartItem) => i.productId !== productId);
    this.itemsSubject.next(items);
    this.cartSubject.next(this.calculateCart(items));
  }

  clear(): void {
    this.itemsSubject.next([]);
    this.cartSubject.next(this.calculateCart([]));
  }

  getTotal(): number {
    return this.itemsSubject.value.reduce((sum: number, i: SimpleCartItem) => sum + i.price * i.qty, 0);
  }

}
export type { CartItem };
