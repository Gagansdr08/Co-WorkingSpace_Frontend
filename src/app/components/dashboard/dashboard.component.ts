import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models';
import { CommonModule, NgFor,NgIf } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [NgIf,NgFor,CommonModule,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone:true
})
export class DashboardComponent implements OnInit {
  currentEmployee: Employee | null = null;
  loading = true;
  error = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this.loading = true;
    this.employeeService.getCurrentEmployee().subscribe({
      next: (employee) => {
        this.currentEmployee = employee;
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
    this.router.navigate(['/dashboard', tab]);
  }
}