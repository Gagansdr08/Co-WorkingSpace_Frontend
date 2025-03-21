import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { Company,Employee } from '../../models';
import { NgForOf, NgIf } from '@angular/common';
import { EmployeeRegistrationComponent } from './employee-registration/employee-registration.component';
import { SeatAllocationComponent } from './seat-allocation/seat-allocation.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AuthService, EmployeeCredentials, User } from '../../core/auth/services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { DashboardBaseComponent } from '../dashboard-base/dashboard-base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-dashboard',
  imports: [NgIf,AddEmployeeComponent,EmployeeRegistrationComponent,SeatAllocationComponent,NgForOf],
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.css'
})
export class CompanyDashboardComponent extends DashboardBaseComponent {
  
  currentCompany: Company | null = null;
  activeTab: string = 'employees';
  loading = false;
  // error = '';
  coworkingSpaceId: number = 3;
  showAddEmployeeModal = false;
  companyId: number | null = null;
  employees: Employee[] = [];
  companyid:number=0;


  constructor( protected override authService: AuthService,
    protected override router: Router,
    private companyService: CompanyService,private employeeService: EmployeeService) {
    super(authService, router);

   }

  // ngOnInit(): void {
  //   this.loadCompanyData();
  // }

  override onUserLoaded(user: User): void {
    // Check if user has the COMPANY_ADMIN role
    if (!user.roles.includes('COMPANY_ADMIN')) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      return;
    }
     // Set companyId from user data
     this.companyId = user.companyId || null;
    // If no companyId is available, something's wrong
    if (!this.companyId) {
      console.error('Company admin user has no associated company ID');
    }
    else{
     this.companyid=this.companyId;
      this.loadCompanyData();
      this.loadEmployees();
      console.log(user);
    }
  }

  loadCompanyData(): void {
    this.loading = true;
    // Assuming you have company ID 1 for testing
    // In a real app, you'd get this from auth or route params
    
    // const companyId = 1;
    // this.companyId=companyId;
    // this.companyId = this.currentCompany.id || null;

    
    // If no companyId is available, something's wrong
    if (!this.companyid) {
      console.error('Company admin user has no associated company ID');
    }
    
    this.companyService.getCompanyById(this.companyid).subscribe({
      next: (company) => {
        this.currentCompany = company;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading company data', err);
        this.error = 'Failed to load company data. Please try again later.';
        this.loading = false;
      }
    });
  }

  openAddEmployeeModal(): void {
    this.showAddEmployeeModal = true;
  }
  
  closeAddEmployeeModal(): void {
    this.showAddEmployeeModal = false;
  }
  
  handleEmployeeAdded(credentials: EmployeeCredentials): void {
    console.log('Employee added successfully:', credentials);
    // In a real implementation, you might refresh the employees list

  }

  loadEmployees(): void {
    if (!this.companyId) return;
    this.loading = true;
    this.employeeService.getEmployeesByCompany(this.companyId).subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading employees', err);
        this.error = 'Failed to load employees. Please try again later.';
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}