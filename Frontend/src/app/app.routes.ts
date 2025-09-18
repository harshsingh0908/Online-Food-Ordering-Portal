import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { authGuard } from './guards/auth.guard';

import { MenuItemDetailsComponent } from './components/menu-item-details/menu-item-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'product/:slug', component: MenuItemDetailsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
