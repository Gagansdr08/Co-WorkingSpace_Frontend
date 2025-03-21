import { Component, OnInit } from '@angular/core';
import { UserRole } from '../../components/landing/landing/landing.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute,Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink,NgIf,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  role: UserRole | null = null;
  roleTitle: string = 'User';
  hidePassword = true;
  isLoading = false;
  errorMessage: string | null = null;
  returnUrl: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }
  
  ngOnInit(): void {
    // Get role from route params
    this.role = this.route.snapshot.paramMap.get('role') as UserRole;
    
    // Set role title based on role
    if (this.role) {
      switch (this.role) {
        case 'employee':
          this.roleTitle = 'Employee';
          break;
        case 'company':
          this.roleTitle = 'Company Admin';
          break;
        case 'space-owner':
          this.roleTitle = 'Space Owner';
          break;
      }
    }
    
    // Get return URL from query params or set defaults based on role
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.getDefaultRouteForRole();
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;
    
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    
    this.authService.login(email, password)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (user: { roles: string | string[]; }) => {
          // Check if user has the appropriate role
          const roleMap = {
            'employee': 'EMPLOYEE',
            'company': 'COMPANY_ADMIN',
            'space-owner': 'SPACE_OWNER'
          };
          
          const expectedRole = this.role ? roleMap[this.role] : null;
          
          if (expectedRole && !user.roles.includes(expectedRole)) {
            this.errorMessage = `This account does not have ${this.roleTitle} permissions`;
            this.authService.logout();
            return;
          }
          
          // Navigate to the appropriate dashboard
          this.router.navigateByUrl(this.returnUrl || this.getDefaultRouteForRole());
        },
        error: (error: { message: string; }) => {
          this.errorMessage = error.message || 'Invalid email or password';
        }
      });
  }
  
  goBack(): void {
    if (this.role && this.role !== 'employee') {
      this.router.navigate(['/auth/select', { role: this.role }]);
    } else {
      this.router.navigate(['/']);
    }
  }
  
  // Get default route based on user role
  private getDefaultRouteForRole(): string {
    // switch (this.role) {
    //   case 'employee':
    //     return '/employee/dashboard';
    //   case 'company':
    //     return '/company/dashboard';
    //   case 'space-owner':
    //     return '/space-owner/dashboard';
    //   default:
    //     return '/';
    // }
    switch (this.role) {
      case 'employee':
        return '/dashboard';
      case 'company':
        return '/company-dashboard';
      case 'space-owner':
        return '/coworking-spaces';
      default:
        return '/';
    }
  }
}


// export class LoginComponent implements OnInit {
//   loginForm: FormGroup;
//   role: UserRole | null = null;
//   roleTitle: string = 'User';
//   hidePassword = true;
//   isLoading = false;
//   errorMessage: string | null = null;
  
//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private router: Router,
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       rememberMe: [false]
//     });
//   }
  
//   ngOnInit(): void {
//     this.role = this.route.snapshot.paramMap.get('role') as UserRole;
    
//     if (this.role) {
//       switch (this.role) {
//         case 'employee':
//           this.roleTitle = 'Employee';
//           break;
//         case 'company':
//           this.roleTitle = 'Company Admin';
//           break;
//         case 'space-owner':
//           this.roleTitle = 'Space Owner';
//           break;
//       }
//     }
//   }
  
//   onSubmit(): void {
//     if (this.loginForm.invalid) {
//       return;
//     }
    
//     this.isLoading = true;
//     this.errorMessage = null;
    
//     // TODO: Implement auth service login
    
//     // Simulate API call
//     setTimeout(() => {
//       this.isLoading = false;
      
//       // Redirect based on role
//       if (this.role === 'employee') {
//         this.router.navigate(['/employee/dashboard']);
//       } else if (this.role === 'company') {
//         this.router.navigate(['/company/dashboard']);
//       } else if (this.role === 'space-owner') {
//         this.router.navigate(['/space-owner/dashboard']);
//       } else {
//         // Default if no role specified
//         this.router.navigate(['/']);
//       }
//     }, 1500);
//   }
  
//   goBack(): void {
//     if (this.role && this.role !== 'employee') {
//       this.router.navigate(['/auth/select', { role: this.role }]);
//     } else {
//       this.router.navigate(['/']);
//     }
//   }

// }
