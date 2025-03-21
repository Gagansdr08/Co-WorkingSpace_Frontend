import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-base',
  // imports: [],
  standalone:false,
  templateUrl: '',
  styleUrl: ''
})
export class DashboardBaseComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = true;
  error: string | null = null;
  
  constructor(
    protected authService: AuthService,
    protected router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadCurrentUser();
  }
  
  loadCurrentUser(): void {
    this.isLoading = true;
    this.error = null;
    
    this.authService.getCurrentUserDetails()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (user) => {
          this.currentUser = user;
          this.onUserLoaded(user);
          console.log(user);
        },
        error: (error) => {
          if (error.status === 500 && error.error && error.error.message) {
            // Check for specific Spring Security null Principal error
            if (error.error.message.includes('UserDetails.getUsername()')) {
              this.error = 'Authentication error. Please login again.';
              // Attempt to redirect to login after a short delay
              setTimeout(() => {
                this.authService.logout();
                this.router.navigate(['/auth/login']);
              }, 3000);
            } else {
              this.error = 'Server error: ' + error.error.message;
            }
          } else {
            this.error = 'Failed to load user data. Please try again.';
          }
          console.error('Error loading user data:', error);
        }
      });
  }
  
  onUserLoaded(user: User): void {
    // Override in child components
  }
  
  logout(): void {
    this.authService.logout();
  }
}
