import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models';
import { NgIf } from '@angular/common';
import { EmployeeRegistrationComponent } from './employee-registration/employee-registration.component';
import { SeatAllocationComponent } from './seat-allocation/seat-allocation.component';

@Component({
  selector: 'app-company-dashboard',
  imports: [NgIf,EmployeeRegistrationComponent,SeatAllocationComponent],
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.css'
})
export class CompanyDashboardComponent implements OnInit {
  currentCompany: Company | null = null;
  activeTab: string = 'employees';
  loading = false;
  error = '';
  coworkingSpaceId: number = 1;

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.loadCompanyData();
  }

  loadCompanyData(): void {
    this.loading = true;
    // Assuming you have company ID 1 for testing
    // In a real app, you'd get this from auth or route params
    const companyId = 1;
    
    this.companyService.getCompanyById(companyId).subscribe({
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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}