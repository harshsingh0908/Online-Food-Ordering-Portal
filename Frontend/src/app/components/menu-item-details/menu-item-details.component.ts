import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';
import { MenuItemService } from '../../services/menu-item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';

// Standalone modal import (so we can use <app-product-details-modal>)



import { ProductDetailsModalComponent } from '../product-details-modal/product-details-modal.component';

@Component({
  selector: 'app-menu-item-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductDetailsModalComponent],
  templateUrl: './menu-item-details.component.html',
  styleUrls: ['./menu-item-details.component.scss']
})
export class MenuItemDetailsComponent implements OnInit, OnDestroy {
  menuItem: MenuItem | null = null;
  private subscriptions = new Subscription();
  loading = false;
  error: string | null = null;
  cartQty = 0;
  categoryDropdownOpen = false;
  MENU: MenuItem[] = [];
  relatedMenu: MenuItem[] = [];
  itemQuantities: { [key: string]: number } = {};

  // Modal state
  showModal = false;
  modalOrigin: { x: number; y: number } | null = null;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuItemService,
    private cartService: CartService,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load menu list (simulate HomeComponent's MENU if available)
    this.MENU = (HomeComponent.prototype && (HomeComponent.prototype as any).MENU) || [];
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        const slug = params['slug'];
        if (slug) {
          this.loadMenuItem(slug);
        }
      })
    );

    // subscribe to cart changes
    this.subscriptions.add(
      this.cartService.items$.subscribe(items => {
        this.itemQuantities = {};
        items.forEach((item: any) => {
          this.itemQuantities[item.productId] = item.qty;
        });
        this.updateCartQty();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadMenuItem(slug: string): void {
    if (this.loading) return;
    this.loading = true;
    this.subscriptions.add(
      this.menuService.getMenuItemBySlug(slug).subscribe({
        next: (item: MenuItem) => {
          this.menuItem = item;
          this.loading = false;
          this.error = null;
          this.updateCartQty();
          this.relatedMenu = this.MENU.filter(i => i.cat === item.cat && i.slug !== item.slug);
        },
        error: (error: any) => {
          console.error('Error loading menu item:', error);
          this.snackbar.error('Failed to load menu item details');
          this.loading = false;
          this.error = 'Product not found.';
        }
      })
    );
  }

  updateCartQty(): void {
    if (!this.menuItem) { this.cartQty = 0; return; }
    const qty = this.itemQuantities[String(this.menuItem.id)] || 0;
    this.cartQty = qty;
  }

  updateQuantity(delta: number): void {
    if (!this.menuItem) return;
    const { id, name } = this.menuItem;
    let qty = this.cartQty + delta;
    if (qty < 0) qty = 0;
    this.cartService.updateQty(String(id), qty);
    if (delta > 0) this.snackbar.success(`Added ${name} to cart`);
    if (delta < 0 && qty === 0) this.snackbar.success(`Removed ${name} from cart`);
  }

  // Related products helpers
  getQuantity(productId: string): number {
    return this.itemQuantities[productId] || 0;
  }

  addToCart(item: MenuItem): void {
    this.cartService.add({
      id: String(item.id),
      name: item.name,
      price: item.price,
      imageUrl: item.img
    }, 1);
  }

  updateRelatedQuantity(productId: string, delta: number): void {
    const qty = (this.itemQuantities[productId] || 0) + delta;
    this.cartService.updateQty(productId, qty < 0 ? 0 : qty);
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/placeholder.jpg';
  }

  // Header helpers
  openCart() { /* navigate to cart or open drawer */ }
  logout() { this.router.navigate(['/login']); }

  getCurrentUser() {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch { return null; }
  }

  getDescription(item: MenuItem): string {
    if (!item) return '';
    if (item.description && item.description.trim().length > 0) return item.description;
    const base = `${item.name} is a delicious ${item.cat?.toLowerCase() || 'food'} item`;
    if (item.veg) {
      return `${base} made with fresh vegetarian ingredients. Perfect for those who love healthy and tasty food.`;
    } else {
      return `${base} crafted with premium ingredients for a rich and satisfying meal.`;
    }
  }

  // --------------------
  // Modal helpers
  // --------------------

  // Open modal from click (pass event to get coords for animation)
  openModal(item: MenuItem, event?: MouseEvent) {
    if (!item) return;
    if (event) {
      this.modalOrigin = { x: event.clientX, y: event.clientY };
    } else {
      this.modalOrigin = { x: Math.round(window.innerWidth / 2), y: Math.round(window.innerHeight / 2) };
    }
    this.menuItem = item;
    this.showModal = true;
  }

  // Handler when modal emits add
  handleModalAdd() {
    if (!this.menuItem) return;
    this.addToCart(this.menuItem);
    this.snackbar.success(`${this.menuItem.name} added to cart`);
  }
}
