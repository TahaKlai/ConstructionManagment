import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error intercepted:', error);
      console.error('Error status:', error.status);
      console.error('Error statusText:', error.statusText);
      
      // Handle parsing errors for successful responses (201, 200, etc.)
      if (error.status >= 200 && error.status < 300 && error.message.includes('parsing')) {
        console.log('Parsing error for successful response, treating as success');
        // For successful status codes with parsing errors, return empty success response
        return throwError(() => ({ success: true, status: error.status }));
      }
      
      // Only handle actual error status codes
      if (error.status >= 400) {
        if (error.status === 401) {
          // Auto logout if 401 response returned from API
          authService.logout();
          router.navigate(['/auth/login']);
          toastr.error('Session expired. Please log in again.', 'Authentication Error');
        } else if (error.status === 403) {
          toastr.error('You do not have permission to access this resource.', 'Access Denied');
        } else if (error.status === 404) {
          toastr.error('Resource not found.', 'Not Found');
        } else if (error.status >= 500) {
          toastr.error('A server error occurred. Please try again later.', 'Server Error');
        }
        
        const errorMessage = error.error?.message || error.message || error.statusText || 'Unknown Error';
        return throwError(() => new Error(errorMessage));
      }
      
      // If it's not a real error (status < 400), just re-throw the original error
      return throwError(() => error);
    })
  );
};