import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from '../../components/landing/landing/landing.component';

@Component({
  selector: 'app-auth-select',
  imports: [],
  templateUrl: './auth-select.component.html',
  styleUrl: './auth-select.component.css'
})
export class AuthSelectComponent implements OnInit {
  role: UserRole | null = null;
  roleTitle: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.role = this.route.snapshot.paramMap.get('role') as UserRole;
    
    if (!this.role || this.role === 'employee') {
      // Employee should go directly to login, no selection needed
      this.router.navigate(['/auth/login']);
      return;
    }
    
    // Set readable title based on role
    this.roleTitle = this.role === 'company' ? 'Company' : 'Space Owner';
  }
  
  navigateToLogin(): void {
    this.router.navigate(['/auth/login', { role: this.role }]);
  }
  
  navigateToRegister(): void {
    if (this.role === 'company') {
      this.router.navigate(['/auth/register-company']);
    } else if (this.role === 'space-owner') {
      this.router.navigate(['/auth/register-space-owner']);
    }
  }
}
