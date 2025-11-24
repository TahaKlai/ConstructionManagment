import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  
  // Available roles matching database
  roles = [
    { value: 'ROLE_USER', label: 'User' },
    { value: 'ROLE_ADMIN', label: 'Administrator' }
  ];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['ROLE_USER', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(fg: FormGroup) {
    const password = fg.get('password')?.value;
    const confirmPassword = fg.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      fg.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      fg.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }

  // Getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    console.log('Register form submitted');
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form errors:', this.registerForm.errors);

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('Form is invalid, stopping submission');
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control && control.errors) {
          console.log(`${key} errors:`, control.errors);
        }
      });
      return;
    }

    this.loading = true;
    
    const registerRequest = {
      username: this.f['username'].value,
      email: this.f['email'].value,
      fullName: this.f['fullName'].value,
      password: this.f['password'].value,
      role: this.f['role'].value
    };

    console.log('Making real registration request:', registerRequest);

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        const roleName = registerRequest.role === 'ROLE_ADMIN' ? 'Administrator' : 'User';
        
        // Use setTimeout to avoid change detection issues
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
          alert(`Registration successful! Account created as ${roleName}. You can now login.`);
          this.router.navigate(['/auth/login']);
        }, 100);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        
        // Check if it's actually a success with parsing error (status 201)
        if (error.status === 201 && error.statusText === 'Created') {
          console.log('Registration actually succeeded (status 201), treating as success');
          const roleName = registerRequest.role === 'ROLE_ADMIN' ? 'Administrator' : 'User';
          
          setTimeout(() => {
            this.loading = false;
            this.cdr.detectChanges();
            alert(`Registration successful! Account created as ${roleName}. You can now login.`);
            this.router.navigate(['/auth/login']);
          }, 100);
          return;
        }
        
        // Use setTimeout to avoid change detection issues
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
          
          // Handle specific error messages
          let errorMessage = 'Registration failed. Please try again.';
          
          // Backend returns error as plain text string
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Invalid registration data. Please check your input.';
          } else if (error.status === 409) {
            errorMessage = 'Username or email already exists. Please choose different ones.';
          }
          
          alert(errorMessage);
        }, 100);
      }
    });
  }
}