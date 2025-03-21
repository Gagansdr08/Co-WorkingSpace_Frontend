import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models';
import { CommonModule, NgFor,NgIf } from '@angular/common';
import { DashboardBaseComponent } from '../dashboard-base/dashboard-base.component';
import { AuthService, User } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [NgIf,NgFor,CommonModule,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone:true
})
export class DashboardComponent extends DashboardBaseComponent {
  currentEmployee: Employee | null = null;
  companyId: number | null = null;
  employeeId: number | null = null;
  userid:number | null = null;
  loading = true;
  activeTab: string = 'employees';
  // error = '';

  constructor(
     protected override authService: AuthService,
    protected override router: Router,
    private employeeService: EmployeeService,
  ) { super(authService,router)

  }

  // ngOnInit(): void {
  //   this.loadEmployeeData();
  // }

  override onUserLoaded(user: User): void {
    // Check if user has the EMPLOYEE role
    if (!user.roles.includes('EMPLOYEE')) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      return;
    }
    
    // Set companyId from user data
    this.companyId = user.companyId || null;
    
    // In a real application, you might load employee details here
    // For now, we're just using a mock employeeId
    this.userid = user.id || null; // Normally would be fetched from API
    this.loadEmployeeData();    
  }

  loadEmployeeData(): void {
    this.loading = true;
    if(!this.userid) return 

    this.employeeService.getEmployeeById(this.userid).subscribe({
      next: (employee) => {
        this.currentEmployee = employee;
        this.employeeId=employee.id;
        console.log(this.currentEmployee);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading employee data', err);
        this.error = 'Failed to load employee data. Please try again later.';
        this.loading = false;
      }
    });
  }

  navigateToTab(tab: string): void {
    console.log(this.currentEmployee);
    this.router.navigate(['/dashboard', tab]);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  showProfileModal = false;

openProfileModal(): void {
  this.showProfileModal = true;
}

closeProfileModal(): void {
  this.showProfileModal = false;
}

editProfile(): void {
  // Implement edit profile functionality
  console.log('Edit profile clicked');
  // Could open another modal or redirect to edit form
}
}