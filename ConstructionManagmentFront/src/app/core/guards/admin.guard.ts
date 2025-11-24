import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Check if user is authenticated first
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }
  
  // Check if user has admin role
  const mockRole = localStorage.getItem('mock_user_role');
  const isAdmin = mockRole === 'ROLE_ADMIN';
  
  if (!isAdmin) {
    alert('Access denied. Admin privileges required.');
    return false;
  }
  
  return true;
};