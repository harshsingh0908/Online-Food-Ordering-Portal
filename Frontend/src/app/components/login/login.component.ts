import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Form data
  signUpData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  };

  loginData = {
    email: '',
    password: ''
  };

  // UI states
  isSignUp = false;
  showSignUpPassword = false;
  showLoginPassword = false;
  rememberMe = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    // Load remembered email
    const rememberedEmail = this.authService.getRememberedEmail();
    if (rememberedEmail) {
      this.loginData.email = rememberedEmail;
      this.rememberMe = true;
    }
  }

  toggleForm(): void {
    this.isSignUp = !this.isSignUp;
  }

  togglePasswordSignUp(): void {
    this.showSignUpPassword = !this.showSignUpPassword;
  }

  togglePasswordLogin(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  onSignUp(): void {
    if (!this.validateSignUpForm()) {
      return;
    }

    const user: User = {
      name: this.signUpData.name,
      email: this.signUpData.email,
      password: this.signUpData.password,
      phone: this.signUpData.phone
    };

    if (this.authService.register(user)) {
      alert('Sign up successful! You can now login.');
      this.resetSignUpForm();
      this.isSignUp = false;
    } else {
      alert('Email already registered! Please login.');
    }
  }

  onLogin(): void {
    if (!this.validateLoginForm()) {
      return;
    }

    if (this.authService.login(this.loginData.email, this.loginData.password)) {
      if (this.rememberMe) {
        this.authService.setRememberedEmail(this.loginData.email);
      } else {
        this.authService.removeRememberedEmail();
      }
      
      alert(`Welcome back, ${this.authService.getCurrentUser()?.name}!`);
      this.router.navigate(['/']);
    } else {
      alert('Invalid email or password!');
    }
  }

  onForgotPassword(): void {
    const email = prompt('Enter your registered email:');
    if (!email) return;

    // This is a simplified implementation
    // In a real app, you'd make an API call
    alert('Password reset link sent to your email!');
  }

  private validateSignUpForm(): boolean {
    if (!this.signUpData.name || !this.signUpData.email || !this.signUpData.password || 
        !this.signUpData.confirmPassword || !this.signUpData.phone) {
      alert('Please fill in all fields!');
      return false;
    }

    if (this.signUpData.password.length < 6) {
      alert('Password must be at least 6 characters.');
      return false;
    }

    if (this.signUpData.password !== this.signUpData.confirmPassword) {
      alert('Passwords do not match!');
      return false;
    }

    return true;
  }

  private validateLoginForm(): boolean {
    if (!this.loginData.email || !this.loginData.password) {
      alert('Please fill in all fields!');
      return false;
    }
    return true;
  }

  private resetSignUpForm(): void {
    this.signUpData = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    };
  }
}
