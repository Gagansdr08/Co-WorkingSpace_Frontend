import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService, RegisterSpaceOwnerRequest } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-register-owner',
  imports: [ReactiveFormsModule,NgIf,RouterLink],
  templateUrl: './register-owner.component.html',
  styleUrl: './register-owner.component.css'
})

export class RegisterSpaceOwnerComponent {
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
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      // Space info
      spaceName: ['', [Validators.required, Validators.maxLength(100)]],
      spaceAddress: ['', [Validators.required, Validators.maxLength(255)]],
      spaceContactEmail: ['', [Validators.email, Validators.maxLength(50)]],
      spaceContactPhone: ['', Validators.maxLength(20)],
      spaceDescription: ['', Validators.maxLength(500)],
      termsAccepted: [false, Validators.requiredTrue],
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
    
    const registerData: RegisterSpaceOwnerRequest = {
      // firstName: formData.firstName,
      // lastName: formData.lastName,
      // email: formData.email,
      // password: formData.password
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      spaceName: formData.spaceName,
      spaceAddress: formData.spaceAddress,
      spaceContactEmail: formData.spaceContactEmail,
      spaceContactPhone: formData.spaceContactPhone,
      spaceDescription: formData.spaceDescription
    };
    
    this.authService.registerSpaceOwner(registerData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          // Redirect to login page with space-owner role
          this.router.navigate(['/auth/login', { role: 'space-owner' }], {
            queryParams: { registration: 'success' }
          });
        },
        error: (error) => {
          if (error.status === 409) {
            this.errorMessage = 'Email already in use';
          } else {
            this.errorMessage = error.message || 'Registration failed';
          }
        }
      });
  }
  
  goBack(): void {
    this.router.navigate(['/auth/select', { role: 'space-owner' }]);
  }
}

// export class RegisterSpaceOwnerComponent {
//   registerForm: FormGroup;
//   hidePassword = true;
//   isLoading = false;
//   errorMessage: string | null = null;
  
//   constructor(
//     private fb: FormBuilder,
//     private router: Router
//   ) {
//     this.registerForm = this.fb.group({
//       firstName: ['', [Validators.required, Validators.minLength(2)]],
//       lastName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
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
//       this.router.navigate(['/space-owner/dashboard']);
//     }, 1500);
//   }
  
//   goBack(): void {
//     this.router.navigate(['/auth/select', { role: 'space-owner' }]);
//   }
// }