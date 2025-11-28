import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { CaptchaService } from '../../../../core/services/captcha.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

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
  captchaError: string | null = null;
  readonly captchaEnabled: boolean;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private captchaService = inject(CaptchaService);
  private toastr = inject(ToastrService);

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
    this.captchaEnabled = this.captchaService.isEnabled();
  }

  // Getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  async onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.captchaError = null;

    let captchaToken = '';

    if (this.captchaEnabled) {
      try {
        captchaToken = await this.captchaService.execute('login');
      } catch (error) {
        console.error('Captcha execution failed', error);
        this.captchaError = 'Captcha verification failed. Please try again.';
        this.toastr.error('Captcha verification failed. Please try again.', 'Login');
        this.loading = false;
        return;
      }
    }

    const loginRequest = {
      username: this.f['username'].value,
      password: this.f['password'].value,
      captchaToken: captchaToken || undefined
    };

    console.log('Making real login request for username:', loginRequest.username);

    this.authService.login(loginRequest)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.toastr.success(`Welcome back, ${response.username}!`, 'Login Successful');
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          console.error('Login failed:', error);

          let errorMessage = 'Login failed. Please check your credentials.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Invalid username or password.';
          } else if (error.status === 404) {
            errorMessage = 'User not found.';
          }

          this.toastr.error(errorMessage, 'Login Failed');
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