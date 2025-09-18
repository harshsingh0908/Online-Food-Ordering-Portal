import { Injectable } from '@angular/core';

export interface User {
  name: string;
  email: string;
  password?: string;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: User | null = null;

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  /** Alias for compatibility with existing code */
  isUserLoggedIn(): boolean {
    return this.isLoggedIn();
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const user = localStorage.getItem('currentUser');
      this.currentUser = user ? JSON.parse(user) : null;
    }
    return this.currentUser;
  }

  /** For compatibility — return a "user id" (using email as unique ID) */
  getLoggedInUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.email : null;
  }

  login(email: string, password: string): boolean {
    if (email && password) {
      const user: User = { name: email.split('@')[0], email };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }

  register(user: User): boolean {
    return true; // demo only
  }

  getRememberedEmail(): string {
    return localStorage.getItem('rememberedEmail') || '';
  }

  setRememberedEmail(email: string): void {
    localStorage.setItem('rememberedEmail', email);
  }

  removeRememberedEmail(): void {
    localStorage.removeItem('rememberedEmail');
  }
}
