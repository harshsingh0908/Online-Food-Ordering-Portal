import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuService, MenuItemsResponse } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../core/snackbar.service';
import { UiLoadingService } from '../../services/ui-loading.service';
import { MenuItem } from '../../models/menu-item.model';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  totalItems = 0;
  pageSize = 12;
  currentPage = 0;
  searchControl = new FormControl<string>('');
  vegOnlyControl = new FormControl<boolean>(false);
  loading = false;

  private destroy$ = new Subject<void>();
  private searchSubscription?: Subscription;
  private vegFilterSubscription?: Subscription;

  constructor(
    private menuService: MenuService,
    private cartService: CartService,
    private snackbar: SnackbarService,
    private loadingService: UiLoadingService
  ) {}

  ngOnInit(): void {
    this.loadMenuItems();
    this.setupSearchFilter();
    this.setupVegFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchFilter(): void {
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.loadMenuItems();
      });
  }

  private setupVegFilter(): void {
    this.vegFilterSubscription = this.vegOnlyControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(isVeg => {
        this.currentPage = 0;
        this.loadMenuItems();
      });
  }

  loadMenuItems(): void {
    this.loadingService.startLoading();
    this.loading = true;

    const searchQuery = this.searchControl.value || '';
    const isVeg = this.vegOnlyControl.value;

    // TODO: Update MenuService to support search functionality
    const request$ = isVeg 
      ? this.menuService.getVegItems(isVeg, this.currentPage, this.pageSize)
      : this.menuService.getAllMenuItems(this.currentPage, this.pageSize);

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: this.handleMenuResponse.bind(this),
        error: this.handleError.bind(this)
      });
  }

  private handleMenuResponse(response: MenuItemsResponse): void {
    this.menuItems = response.content;
    this.totalItems = response.totalElements;
    this.loading = false;
    this.loadingService.stopLoading();
  }

  private handleError(error: Error): void {
    console.error('Error loading menu items:', error);
    this.snackbar.error('Failed to load menu items. Please try again.');
    this.loading = false;
    this.loadingService.stopLoading();
  }

  // onPageChange(event: any): void {
  //   this.currentPage = event.pageIndex;
  //   this.pageSize = event.pageSize;
  //   this.loadMenuItems();
  // }

  addToCart(menuItem: MenuItem): void {
    this.cartService.add({
      id: String(menuItem.id),
      name: menuItem.name,
      price: menuItem.price,
      imageUrl: menuItem.img
    }, 1);
    this.snackbar.actionWithUndo(
      `Added ${menuItem.name} to cart`,
      () => this.undoAddToCart(menuItem.id.toString())
    );
  }

  private undoAddToCart(itemId: string): void {
    try {
      this.cartService.remove(itemId);
      this.snackbar.success('Item removed from cart');
    } catch (error: any) {
      console.error('Error removing item:', error);
      this.snackbar.error('Failed to remove item from cart');
    }
  }
}
