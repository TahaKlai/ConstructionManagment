import { Component, HostListener, OnInit, inject } from '@angular/core';
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
  showUserMenu = false;
  
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
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.checkUserRole();
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  logout() {
    this.closeUserMenu();
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeUserMenu();
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
    if (this.currentUser && this.currentUser.roles) {
      this.isAdmin = this.currentUser.roles.some((role: any) => 
        (typeof role === 'string' ? role : role.name) === 'ROLE_ADMIN'
      );
    } else {
      this.isAdmin = false;
    }
  }
}
