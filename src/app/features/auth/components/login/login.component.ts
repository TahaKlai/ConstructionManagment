import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });

    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  // Getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    
    const loginRequest = {
      username: this.f['username'].value,
      password: this.f['password'].value
    };

    console.log('Making real login request for username:', loginRequest.username);

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        
        // Store role information for dashboard (temporary until JWT contains roles)
        // Check if username contains 'admin' to determine role
        const userRole = loginRequest.username.toLowerCase().includes('admin') ? 'ROLE_ADMIN' : 'ROLE_USER';
        localStorage.setItem('mock_user_role', userRole);
        console.log('=== LOGIN ROLE STORAGE ===');
        console.log('Username:', loginRequest.username);
        console.log('Detected role:', userRole);
        console.log('Stored in localStorage as mock_user_role');
        console.log('========================');
        
        alert('Login successful!');
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.loading = false;
        
        // Handle specific error messages
        let errorMessage = 'Login failed. Please check your credentials.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 401) {
          errorMessage = 'Invalid username or password.';
        } else if (error.status === 404) {
          errorMessage = 'User not found.';
        }
        
        alert(errorMessage);
      }
    });
  }

  onRegisterClick(event: Event): void {
    console.log('Register link clicked - this should work now');
    // The routerLink will handle the actual navigation
  }

  navigateToRegister(event: Event): void {
    event.preventDefault();
    console.log('Navigating to register page...');
    this.router.navigate(['/auth/register']);
  }
}