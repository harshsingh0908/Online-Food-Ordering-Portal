// File: src/app/components/home/home.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuItemService } from '../../services/menu-item.service';
import { CartService, SimpleCartItem } from '../../services/cart.service';

// Standalone components used by the template
import { ProductDetailsModalComponent } from '../product-details-modal/product-details-modal.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductDetailsModalComponent,
    ProductDetailsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  vegOnly = false;
  nonVegOnly = false;
  recommendedMenu: any[] = [];
  popularMenu: any[] = [];
  breakfastMenu: any[] = [];
  lunchMenu: any[] = [];
  dinnerMenu: any[] = [];
  snacksMenu: any[] = [];
  MENU: any[] = [];

  // UI state
  categoryDropdownOpen = false;
  helpModalOpen = false;
  cartDrawerOpen = false;
  showModal = false;
  searchQuery = '';
  customizableOnly = false;
  sortBy = '';
  currentSlide = 0;
  currentYear = new Date().getFullYear();

  items$ = this.cartService.items$;
  modalProduct: any = null;
  modalOrigin: { x: number; y: number } | null = null;

  cartItems: SimpleCartItem[] = [];

  constructor(
    private router: Router,
    private menuItemService: MenuItemService,
    public cartService: CartService
  ) {
    this.items$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnInit(): void {
    this.menuItemService.getAll(0, 1000).subscribe(res => {
      this.MENU = res?.content || [];
      this.applyFilters();
    });
  }

  // close modal on ESC only
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.showModal) {
      this.closeProductModal();
    }
  }

  // Cart drawer methods
  openCart() { this.cartDrawerOpen = true; }
  closeCart() { this.cartDrawerOpen = false; }

  // Checkbox handlers
  onVegOnlyChange() { this.nonVegOnly = false; this.applyFilters(); }
  onNonVegOnlyChange() { this.vegOnly = false; this.applyFilters(); }

  // TrackBy
  trackById(index: number, item: any) { return item?.id || index; }

  // Images
  getImageUrlFromName(name: string, provided?: string) {
    if (!provided && !name) return 'assets/images/placeholder.jpg';
    if (provided) {
      if (provided.startsWith('assets/')) return provided;
      return `assets/images/${provided}`;
    }
    const base = name.trim().toLowerCase().replace(/[^a-z0-9\s_-]/g, '');
    return `assets/images/${base.replace(/\s+/g, '-')}.jpg`;
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) img.src = 'assets/images/placeholder.jpg';
  }

  formatPrice(price?: number) {
    if (price === undefined || price === null) return '0';
    return new Intl.NumberFormat('en-IN').format(Math.round(price));
  }

  // Filters
  applyFilters() {
    let filtered = [...this.MENU];
    if (this.vegOnly) filtered = filtered.filter(i => i.veg === true);
    if (this.nonVegOnly) filtered = filtered.filter(i => i.veg === false);
    if (this.customizableOnly) filtered = filtered.filter(i => i.customizable === true);

    const q = this.searchQuery?.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(i =>
        (i.name || '').toLowerCase().includes(q) ||
        (i.cat || '').toLowerCase().includes(q)
      );
    }

    switch (this.sortBy) {
      case 'priceLow': filtered.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case 'priceHigh': filtered.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'rating': filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'pop': filtered.sort((a, b) => (b.pop || 0) - (a.pop || 0)); break;
    }

    this.recommendedMenu = filtered.filter(i => i.pop && i.pop > 80).slice(0, 6);
    this.popularMenu = filtered.slice();
    this.breakfastMenu = filtered.filter(i => i.cat?.toLowerCase().includes('breakfast'));
    this.lunchMenu = filtered.filter(i => i.cat?.toLowerCase().includes('lunch'));
    this.dinnerMenu = filtered.filter(i => i.cat?.toLowerCase().includes('dinner'));
    this.snacksMenu = filtered.filter(i => i.cat?.toLowerCase().includes('snack'));
  }

  // Cart helpers
  getCartTotal() {
    return this.cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  }
  getCartCount() {
    return this.cartItems.reduce((sum, i) => sum + i.qty, 0);
  }
  getQuantity(id: string) {
    const item = this.cartItems.find(i => i.productId === id);
    return item ? item.qty : 0;
  }
  updateQuantity(id: string, change: number) {
    const item = this.cartItems.find(i => i.productId === id);
    if (!item) return;
    const newQty = Math.max(1, item.qty + change);
    if (newQty === item.qty) return;
    this.cartService.updateQty(id, newQty);
  }
  addToCart(item: any) {
    this.cartService.add({
      id: String(item.id),
      name: item.name,
      price: item.price,
      imageUrl: item.img
    }, 1);
  }

  getModalProductQty() {
    return this.modalProduct ? this.getQuantity(this.modalProduct.id?.toString()) : 0;
  }

  // Product modal
  openProductModal(item: any, event?: MouseEvent) {
    this.modalProduct = item;
    if (event) {
      this.modalOrigin = { x: event.clientX, y: event.clientY };
    } else {
      this.modalOrigin = { x: Math.round(window.innerWidth / 2), y: Math.round(window.innerHeight / 2) };
    }
    // ensure modal sees the product before show is toggled to avoid race
    setTimeout(() => { this.showModal = true; }, 0);
  }

  closeProductModal() { this.showModal = false; this.modalProduct = null; }

  // IMPORTANT: keep modal open when adding/removing from modal controls
  addModalProduct() {
    if (!this.modalProduct) return;
    this.addToCart(this.modalProduct);
    // do NOT close modal here — keep it open so user can change qty further
    // update cartQty is reflected automatically via cartService subscription
  }

  removeModalProduct() {
    if (!this.modalProduct) return;
    const id = String(this.modalProduct.id);
    const existing = this.cartItems.find(i => i.productId === id);
    if (!existing) return;
    const newQty = Math.max(0, existing.qty - 1);
    this.cartService.updateQty(id, newQty);
    // keep modal open even if qty becomes 0 — user can decide to close
  }

  // Help modal
  openHelp() { this.helpModalOpen = true; }
  closeHelp() { this.helpModalOpen = false; }

  // User
  getCurrentUser() {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : { name: 'Guest' };
    } catch {
      return { name: 'Guest' };
    }
  }
  logout() {
    try { localStorage.removeItem('currentUser'); } catch {}
    this.cartService.clear();
    this.router.navigate(['/login']);
  }
}
