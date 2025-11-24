import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { User } from './core/models/user.model';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  sidebarCollapsed = false;
  pageTitle = 'Dashboard';
  currentUser: User | null = null;
  isAdmin = false;
  
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.router.routerState.root;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data['title'] || this.getPageTitleFromUrl();
        })
      )
      .subscribe(title => this.pageTitle = title);
    
    // Check role immediately from localStorage
    this.checkUserRole();
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.checkUserRole();
    });
    
    // Also check role periodically to ensure it stays updated
    setInterval(() => {
      this.checkUserRole();
    }, 1000);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private getPageTitleFromUrl(): string {
    const url = this.router.url;
    if (url.includes('dashboard')) {
      return 'Dashboard';
    } else if (url.includes('projects')) {
      return 'Projects';
    } else if (url.includes('tasks')) {
      return 'Tasks';
    } else if (url.includes('invoices')) {
      return 'Invoices';
    } else if (url.includes('suppliers')) {
      return 'Suppliers';
    } else if (url.includes('workedhours')) {
      return 'Worked Hours';
    }
    return 'Dashboard';
  }

  private checkUserRole(): void {
    // Check user role from localStorage or current user
    const mockRole = localStorage.getItem('mock_user_role');
    console.log('=== APP COMPONENT ROLE CHECK ===');
    console.log('mockRole from localStorage:', mockRole);
    
    if (mockRole) {
      this.isAdmin = mockRole === 'ROLE_ADMIN';
      console.log('✅ Admin status from localStorage:', this.isAdmin);
    } else if (this.currentUser && this.currentUser.roles) {
      this.isAdmin = this.currentUser.roles.some((role: any) => 
        role === 'ROLE_ADMIN' || role.name === 'ROLE_ADMIN'
      );
      console.log('✅ Admin status from currentUser:', this.isAdmin);
    } else {
      this.isAdmin = false;
      console.log('ℹ️ No role info found, defaulting to User');
    }
    console.log('Final app component admin status:', this.isAdmin);
    console.log('==============================');
  }
}
