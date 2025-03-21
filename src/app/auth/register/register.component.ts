import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService, RegisterCompanyRequest } from '../../core/auth/services/auth.service';


@Component({
  selector: 'app-register',
  imports: [RouterLink,ReactiveFormsModule,NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterCompanyComponent {
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      description: [''],
      adminFirstName: ['', Validators.required],
      adminLastName: ['', Validators.required],
      adminEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;
    
    const formData = this.registerForm.value;
    
    const registerData: RegisterCompanyRequest = {
      companyName: formData.companyName,
      address: formData.address,
      email: formData.email,
      phone: formData.phone,
      description: formData.description,
      adminFirstName: formData.adminFirstName,
      adminLastName: formData.adminLastName,
      adminEmail: formData.adminEmail,
      password: formData.password
    };
    
    this.authService.registerCompany(registerData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          // Redirect to login page with company role
          this.router.navigate(['/auth/login', { role: 'company' }], {
            queryParams: { registration: 'success' }
          });
        },
        error: (error) => {
          if (error.status === 409) {
            this.errorMessage = 'Company email already in use';
          } else {
            this.errorMessage = error.message || 'Registration failed';
          }
        }
      });
  }
  
  goBack(): void {
    this.router.navigate(['/auth/select', { role: 'company' }]);
  }
}

// export class RegisterCompanyComponent {
//   registerForm: FormGroup;
//   hidePassword = true;
//   isLoading = false;
//   errorMessage: string | null = null;
  
//   constructor(
//     private fb: FormBuilder,
//     private router: Router
//   ) {
//     this.registerForm = this.fb.group({
//       companyName: ['', [Validators.required, Validators.minLength(2)]],
//       address: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       phone: ['', Validators.required],
//       description: [''],
//       adminFirstName: ['', Validators.required],
//       adminLastName: ['', Validators.required],
//       adminEmail: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       confirmPassword: ['', Validators.required],
//       termsAccepted: [false, Validators.requiredTrue]
//     }, { validators: this.passwordMatchValidator });
//   }
  
//   passwordMatchValidator(form: FormGroup) {
//     const password = form.get('password')?.value;
//     const confirmPassword = form.get('confirmPassword')?.value;
    
//     if (password !== confirmPassword) {
//       form.get('confirmPassword')?.setErrors({ mismatch: true });
//       return { passwordMismatch: true };
//     }
    
//     return null;
//   }
  
//   onSubmit(): void {
//     if (this.registerForm.invalid) {
//       return;
//     }
    
//     this.isLoading = true;
//     this.errorMessage = null;
    
//     // TODO: Implement auth service registration
    
//     // Simulate API call
//     setTimeout(() => {
//       this.isLoading = false;
//       this.router.navigate(['/company/dashboard']);
//     }, 1500);
//   }
  
//   goBack(): void {
//     this.router.navigate(['/auth/select', { role: 'company' }]);
//   }
// }
