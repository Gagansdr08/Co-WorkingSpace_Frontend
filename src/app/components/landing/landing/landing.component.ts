import { Component } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'employee' | 'company' | 'space-owner';
@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  
  constructor(private router: Router) {}
  
  navigateToAuth(role: UserRole): void {
    // if (role === 'employee') {
    //   // Employee only has login
    //   // this.router.navigate(['/auth/login', { role }]);
    //   this.router.navigate(['/dashboard']);

    // } 
    // else if (role === 'company'){
    //   // Company and Space Owner have registration option
    //   this.router.navigate(['/company-dashboard']);
    // }
    // else if (role === 'space-owner'){
    //   // Company and Space Owner have registration option
    //   this.router.navigate(['/coworking-spaces']);
    // }
    
    if (role === 'employee') {
      // Employee only has login
      this.router.navigate(['/auth/login', { role }]);
    } else {
      // Company and Space Owner have registration option
      this.router.navigate(['/auth/select', { role }]);
    }
  }
}
