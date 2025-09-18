import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, SimpleCartItem } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items$: Observable<SimpleCartItem[]>;
  cartTotal = 0;
  deliveryFee = 40;

  constructor(public cartService: CartService, private router: Router) {
    this.items$ = this.cartService.items$;
  }

  ngOnInit(): void {
    this.items$.subscribe((items: SimpleCartItem[]) => {
      this.cartTotal = items.reduce((sum: number, i: SimpleCartItem) => sum + i.price * i.qty, 0);
    });
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    const filename = img.src.split('/').pop()?.split('.')[0] || '';
    const attempts = [
      `assets/images/${filename.replace(/-/g, '_')}.jpg`,
      `assets/images/${filename.replace(/_/g, '-')}.jpg`,
      `assets/images/${filename}.jpg`,
      `assets/images/placeholder.jpg`
    ];
    const next = attempts.find(a => !img.src.endsWith(a));
    img.src = next || 'assets/images/placeholder.jpg';
  }

  updateQuantity(productId: string, change: number): void {
    // compute deterministic newQty (avoid relying on service's add/sub logic)
    const item = this.cartService.itemsSubject.value.find(i => i.productId === productId);
    if (!item) return;

    const newQty = Math.max(1, item.qty + change);
    if (newQty === item.qty) return;

    // Update via cart service (explicit set)
    this.cartService.updateQty(productId, newQty);
  }

  removeItem(productId: string): void {
    this.cartService.remove(productId);
  }

  clearCart(): void {
    this.cartService.clear();
  }

  proceedToCheckout(): void {
    // Without a backend, simulate success
    if (this.cartService.itemsSubject.value.length === 0) {
      alert('Cart is empty');
      return;
    }
    // Simple demo flow: confirm -> clear cart and show success
    const confirmPay = confirm(`Proceed to pay ₹${new Intl.NumberFormat('en-IN').format(this.cartTotal + this.deliveryFee)} ? (demo)`);
    if (confirmPay) {
      // simulate payment success
      alert('Payment successful (demo). Thank you!');
      this.cartService.clear();
      this.router.navigate(['/']);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN').format(Math.round(price));
  }

  getCartCount(): number {
    return this.cartService.itemsSubject.value.reduce((total: number, item: SimpleCartItem) => total + item.qty, 0);
  }
}
